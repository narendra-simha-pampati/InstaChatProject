import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

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
  const { id: targetUserId } = useParams();

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

        //
        const channelId = [authUser._id, targetUserId].sort().join("-");

        // you and me
        // if i start the chat => channelId: [myId, yourId]
        // if you start the chat => channelId: [yourId, myId]  => [myId,yourId]

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

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
  }, [tokenData, authUser, targetUserId]);

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
    <div className="h-screen w-screen fixed inset-0 z-40 bg-white">
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
