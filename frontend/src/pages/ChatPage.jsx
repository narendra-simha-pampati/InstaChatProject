import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken, getGroupDetails } from "../lib/api";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";
import DoodleCanvas from "../components/DoodleCanvas";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: routeId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDoodleCanvas, setShowDoodleCanvas] = useState(false);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // this will run only when authUser is available
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        console.log("Initializing stream chat client...");

        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        let currChannel;
        // If routeId looks like a channelId (e.g., 'group-<groupId>' or any hyphenated id not matching a single user id), open by id
        if (routeId && (routeId.startsWith("group-") || routeId.includes("-") && routeId.split("-").length > 1 && routeId !== authUser._id)) {
          const channelId = routeId;
          currChannel = client.channel("messaging", channelId);

          // If it's a group channel, ensure it's created with members & metadata
          if (channelId.startsWith("group-")) {
            try {
              const groupId = channelId.replace("group-", "");
              const group = await getGroupDetails(groupId);
              const memberIds = group.members?.filter(m => m.isActive)?.map(m => m.user?._id || m.user) || [];
              await currChannel.create(); // create if not exists
              await currChannel.update({ name: group.name, image: group.avatar || undefined }, memberIds.length ? memberIds : undefined);
              // Add members to channel if not present
              if (memberIds.length) {
                await currChannel.addMembers(memberIds);
              }
            } catch (e) {
              console.warn("Could not ensure group channel members:", e?.message);
            }
          }
        } else {
          // DM between authUser and target user id
          const targetUserId = routeId;
          const channelId = [authUser._id, targetUserId].sort().join("-");
          currChannel = client.channel("messaging", channelId, {
            members: [authUser._id, targetUserId],
          });
        }

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [tokenData, authUser, routeId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  const handleSendDoodle = (doodleDataURL) => {
    if (channel) {
      channel.sendMessage({
        text: "🎨 Doodle shared!",
        attachments: [
          {
            type: "image",
            image_url: doodleDataURL,
            fallback: "Doodle image",
          },
        ],
      });
      toast.success("Doodle sent!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-screen w-screen fixed inset-0 z-40 bg-base-100">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full h-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus>
                <MessageInput.Input />
                <MessageInput.ButtonSend />
                <MessageInput.AttachmentButton />
                <button
                  onClick={() => setShowDoodleCanvas(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Send Doodle"
                >
                  🎨
                </button>
              </MessageInput>
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
      
      {/* Doodle Canvas Modal */}
      <DoodleCanvas
        isOpen={showDoodleCanvas}
        onClose={() => setShowDoodleCanvas(false)}
        onSendDoodle={handleSendDoodle}
      />
    </div>
  );
};
export default ChatPage;
