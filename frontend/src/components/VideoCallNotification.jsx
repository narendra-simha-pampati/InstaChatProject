import React from "react";

const VideoCallNotification = ({ callData, onAccept, onDecline }) => {
  if (!callData) return null;

  const caller = callData.caller || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-base-300/60 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-sm p-6 rounded-2xl shadow-lg bg-base-100 border border-base-300">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="avatar">
            <div className="w-20 h-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={caller.profilePic || "/i.png"} alt={caller.fullName || "Caller"} />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Incoming video call</h3>
            <p className="text-base-content opacity-70 mt-1">{caller.fullName || "Someone"} is calling…</p>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <button onClick={onAccept} className="btn btn-success">Accept</button>
            <button onClick={onDecline} className="btn btn-error btn-outline">Decline</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCallNotification;


