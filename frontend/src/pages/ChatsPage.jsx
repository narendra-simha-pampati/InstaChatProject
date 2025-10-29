import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken, getNotificationPreferences } from "../lib/api";
import { MessageCircle, Search } from "lucide-react";
import { StreamChat } from "stream-chat";
import { Chat, ChannelList } from "stream-chat-react";
import useAuthUser from "../hooks/useAuthUser";
import ChatLoader from "../components/ChatLoader";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  const { data: notificationPrefs } = useQuery({
    queryKey: ["notificationPreferences"],
    queryFn: getNotificationPreferences,
    enabled: !!authUser,
  });

  const [client, setClient] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (!tokenData?.token || !authUser) return;
      const c = StreamChat.getInstance(STREAM_API_KEY);
      await c.connectUser(
        { id: authUser._id, name: authUser.fullName, image: authUser.profilePic },
        tokenData.token
      );
      setClient(c);
    };
    init();
    return () => {
      if (client) client.disconnectUser();
    };
  }, [tokenData, authUser]);

  const filters = useMemo(() => ({ type: "messaging", members: { $in: [authUser?._id] } }), [authUser]);
  const sort = useMemo(() => ({ last_message_at: -1 }), []);

  if (!client) return <ChatLoader />;

  const showUnread = notificationPrefs?.showUnreadBadges !== false;
  const showPreview = notificationPrefs?.showLastMessagePreview !== false;

  const ChannelPreviewUI = (props) => {
    const { channel, latestMessage, unread } = props;
    const data = channel.data || {};
    const membersMap = channel.state?.members || {};
    const members = Object.values(membersMap);
    const isGroup = data.name || members.length > 2 || String(channel.id).startsWith("group-");

    // Compute display name and avatar
    let displayName = data.name || "";
    let displayImage = data.image || "";
    if (!isGroup) {
      // DM: show the other user
      const other = members.find((m) => m.user?.id !== authUser?._id);
      displayName = other?.user?.name || other?.user?.fullName || channel.id;
      displayImage = other?.user?.image || other?.user?.profilePic || "";
    } else {
      // Group fallback name
      if (!displayName) displayName = `Group ${String(channel.id).replace("group-", "").slice(0, 6)}`;
    }

    const lastText = latestMessage?.text || "";

    return (
      <div
        className="flex items-center gap-4 p-3 rounded-xl hover:bg-base-200 transition-colors cursor-pointer"
        onClick={() => navigate(`/chat/${channel.id}`)}
      >
        <div className="relative">
          <div className="w-11 h-11 rounded-full overflow-hidden ring-1 ring-base-300 bg-base-300">
            {displayImage ? (
              <img src={displayImage} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 opacity-60" />
              </div>
            )}
          </div>
          {showUnread && unread > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
              {unread > 9 ? "9+" : unread}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{displayName}</h3>
          {showPreview && (
            <p className="text-xs text-base-content opacity-70 truncate max-w-[38ch]">{lastText}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Chats</h1>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content opacity-50 w-5 h-5" />
        <input
          type="text"
          placeholder="Search chats..."
          className="input input-bordered w-full pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Chat client={client}>
          <ChannelList
            filters={filters}
            sort={sort}
            options={{ state: true, watch: true, presence: true }}
            Preview={(p) => {
              const latestMessage = p.channel.state.messages[p.channel.state.messages.length - 1];
              const unread = p.channel.countUnread();
              const name = (p.channel.data?.name || "").toLowerCase();
              if (searchQuery && !name.includes(searchQuery.toLowerCase())) return null;
              return <ChannelPreviewUI channel={p.channel} latestMessage={latestMessage} unread={unread} />;
            }}
          />
        </Chat>
      </div>
    </div>
  );
};

export default ChatsPage;
