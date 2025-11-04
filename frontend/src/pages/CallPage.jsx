import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [prefAudio, setPrefAudio] = useState(true);
  const [prefVideo, setPrefVideo] = useState(true);
  const [showJoinOptions, setShowJoinOptions] = useState(true);

  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initClient = async () => {
      if (!tokenData?.token || !authUser || !callId) return;

      try {
        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        };

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });

        const callInstance = videoClient.call("default", callId);
        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error initializing call client:", error);
        toast.error("Could not initialize the call. Please try again.");
        setIsConnecting(false);
      }
    };

    initClient();
  }, [tokenData, authUser, callId]);

  const handleJoin = async (audio, video) => {
    if (!call) return;
    setIsConnecting(true);
    try {
      await call.join({ create: true, audio, video });
    } catch (error) {
      console.error("Error joining call:", error);
      toast.error("Could not join the call. Please try again.");
    } finally {
      setIsConnecting(false);
      setShowJoinOptions(false);
    }
  };

  if (isLoading || (isConnecting && !showJoinOptions)) return <PageLoader />;

  return (
    <div className="h-screen w-screen fixed inset-0 z-50 bg-black">
      {client && call ? (
        <StreamVideo client={client}>
          <StreamCall call={call}>
            {showJoinOptions ? (
              <PreJoin
                prefAudio={prefAudio}
                prefVideo={prefVideo}
                setPrefAudio={setPrefAudio}
                setPrefVideo={setPrefVideo}
                onJoin={() => handleJoin(prefAudio, prefVideo)}
                onJoinAudioOnly={() => handleJoin(true, false)}
              />
            ) : (
              <CallContent />
            )}
          </StreamCall>
        </StreamVideo>
      ) : (
        <div className="flex items-center justify-center h-full text-white">
          <p>Could not initialize call. Please refresh or try again later.</p>
        </div>
      )}
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const navigate = useNavigate();

  if (callingState === CallingState.LEFT) return navigate("/");

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

const PreJoin = ({ prefAudio, prefVideo, setPrefAudio, setPrefVideo, onJoin, onJoinAudioOnly }) => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black">
      <div className="bg-gray-800 border border-gray-600 rounded-2xl p-8 w-full max-w-md text-white">
        <h2 className="text-2xl font-semibold mb-6 text-center">Join Call</h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-lg">Microphone</span>
            <input type="checkbox" className="toggle toggle-primary" checked={prefAudio} onChange={(e) => setPrefAudio(e.target.checked)} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg">Camera</span>
            <input type="checkbox" className="toggle toggle-secondary" checked={prefVideo} onChange={(e) => setPrefVideo(e.target.checked)} />
          </div>
          <div className="flex gap-4 pt-4">
            <button className="btn btn-outline btn-lg flex-1 text-white border-gray-400 hover:bg-gray-700" onClick={onJoinAudioOnly}>Audio Only</button>
            <button className="btn btn-primary btn-lg flex-1" onClick={onJoin}>Join Call</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallPage;
