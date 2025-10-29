import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { XIcon, VideoIcon, PhoneIcon, UsersIcon, SearchIcon } from "lucide-react";
import { getUserFriends } from "../lib/api";

const VideoCallModal = ({ isOpen, onClose, onStartCall }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFriend, setSelectedFriend] = useState(null);

  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const filteredFriends = friends.filter(friend =>
    friend.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartCall = () => {
    if (selectedFriend) {
      onStartCall(selectedFriend);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedFriend(null);
    setSearchQuery("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-base-100 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-base-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <VideoIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Start Video Call</h2>
              <p className="text-sm text-base-content opacity-70">
                Choose a friend to call
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="btn btn-ghost btn-sm"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-base-300">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content opacity-50 w-4 h-4" />
            <input
              type="text"
              placeholder="Search friends..."
              className="input input-bordered w-full pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Friends List */}
        <div className="flex-1 overflow-y-auto max-h-60">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 bg-base-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-base-200 rounded w-1/3 mb-1" />
                    <div className="h-3 bg-base-200 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredFriends.length === 0 ? (
            <div className="p-8 text-center">
              <UsersIcon className="w-12 h-12 text-base-content opacity-30 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">
                {searchQuery ? "No friends found" : "No friends yet"}
              </h3>
              <p className="text-sm text-base-content opacity-70">
                {searchQuery 
                  ? "Try adjusting your search" 
                  : "Add some friends to start video calling!"
                }
              </p>
            </div>
          ) : (
            <div className="p-2">
              {filteredFriends.map((friend) => (
                <div
                  key={friend._id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedFriend?._id === friend._id
                      ? "bg-primary/20 border border-primary"
                      : "hover:bg-base-200"
                  }`}
                  onClick={() => setSelectedFriend(friend)}
                >
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img 
                        src={friend.profilePic || "/default-avatar.png"} 
                        alt={friend.fullName} 
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{friend.fullName}</h3>
                    {friend.location && (
                      <p className="text-xs text-base-content opacity-70">
                        📍 {friend.location}
                      </p>
                    )}
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedFriend?._id === friend._id
                      ? "bg-primary border-primary"
                      : "border-base-300"
                  }`}>
                    {selectedFriend?._id === friend._id && (
                      <div className="w-full h-full rounded-full bg-primary-content scale-50" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-base-300">
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="btn btn-outline flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleStartCall}
              className="btn btn-primary flex-1"
              disabled={!selectedFriend}
            >
              <PhoneIcon className="w-4 h-4 mr-2" />
              Start Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;
