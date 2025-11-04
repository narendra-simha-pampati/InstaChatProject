import { Link } from "react-router";

import { MapPinIcon, MessageCircleIcon, VideoIcon } from "lucide-react";

const FriendCard = ({ friend, onVideoCall }) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12">
            <img src={friend.profilePic || "/default-avatar.png"} alt={friend.fullName} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold truncate">{friend.fullName}</h3>
            {friend.location && (
              <div className="flex items-center text-xs text-base-content opacity-70 mt-1">
                <MapPinIcon className="w-3 h-3 mr-1" />
                {friend.location}
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        {friend.bio && (
          <p className="text-sm text-base-content opacity-70 mb-3 line-clamp-2">
            {friend.bio}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link to={`/chat/${friend._id}`} className="btn btn-outline flex-1">
            <MessageCircleIcon className="w-4 h-4 mr-1" />
            Message
          </Link>
          <button 
            onClick={() => onVideoCall?.(friend)}
            className="btn btn-primary flex-1"
          >
            <VideoIcon className="w-4 h-4 mr-1" />
            Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default FriendCard;
