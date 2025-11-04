import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import { MessageCircle, Search, Phone, Video } from "lucide-react";

const ChatsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const filteredFriends = friends.filter(friend =>
    friend.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVideoCall = (friend) => {
    // Navigate to video call with friend
    window.location.href = `/call/${friend._id}`;
  };

  const handleAudioCall = (friend) => {
    // For now, same as video call - you can implement audio-only later
    window.location.href = `/call/${friend._id}`;
  };

  const openChat = (friend) => {
    navigate(`/chat/${friend._id}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Chats</h1>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost btn-circle">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content opacity-50 w-5 h-5" />
        <input
          type="text"
          placeholder="Search friends..."
          className="input input-bordered w-full pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Friends List - Instagram Style */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                <div className="w-16 h-16 bg-base-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-5 bg-base-200 rounded w-1/3 mb-2" />
                  <div className="h-4 bg-base-200 rounded w-1/4" />
                </div>
                <div className="flex gap-2">
                  <div className="w-10 h-10 bg-base-200 rounded-full" />
                  <div className="w-10 h-10 bg-base-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredFriends.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-base-content opacity-30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery ? "No friends found" : "No friends yet"}
            </h3>
            <p className="text-base-content opacity-70 mb-6">
              {searchQuery 
                ? "Try adjusting your search" 
                : "Add some friends to start chatting!"
              }
            </p>
            {!searchQuery && (
              <Link to="/friends" className="btn btn-primary">
                Find Friends
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredFriends.map((friend) => (
              <div
                key={friend._id}
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-base-200 transition-colors group cursor-pointer"
                onClick={() => openChat(friend)}
              >
                {/* Profile Picture */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary ring-offset-2 ring-offset-base-100">
                    <img 
                      src={friend.profilePic || "/i.png"} 
                      alt={friend.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Online indicator */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-base-100"></div>
                </div>

                {/* Friend Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{friend.fullName}</h3>
                  <p className="text-sm text-base-content opacity-70 truncate">
                    {friend.location || "Online"}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    to={`/chat/${friend._id}`}
                    className="btn btn-ghost btn-circle hover:bg-primary hover:text-primary-content"
                    title="Start Chat"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </Link>
                  <Link
                    to={`/profile/${friend._id}`}
                    className="btn btn-ghost btn-circle hover:bg-base-300"
                    title="View Profile"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img src="/logo_tab.png" alt="Profile" className="w-5 h-5 opacity-70" />
                  </Link>
                  
                  <button
                    onClick={() => handleAudioCall(friend)}
                    className="btn btn-ghost btn-circle hover:bg-success hover:text-success-content"
                    title="Audio Call"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => handleVideoCall(friend)}
                    className="btn btn-ghost btn-circle hover:bg-secondary hover:text-secondary-content"
                    title="Video Call"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <Video className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatsPage;
