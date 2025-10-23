import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HeartIcon, MessageCircleIcon, ShareIcon, MoreHorizontalIcon } from "lucide-react";
import { getUserFriends, getRecommendedUsers } from "../lib/api";
import FriendCard, { getLanguageFlag } from "./FriendCard";
import { capitialize } from "../lib/utils";

const FeedCard = ({ user, type = "recommendation" }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50));

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <div className="bg-base-100 rounded-2xl shadow-sm border border-base-300 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 border-b border-base-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-12 rounded-full">
                <img src={user.profilePic || "/default-avatar.png"} alt={user.fullName} />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{user.fullName}</h3>
              <div className="flex items-center gap-2 text-sm text-base-content opacity-70">
                {user.location && (
                  <span className="flex items-center gap-1">
                    📍 {user.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  {getLanguageFlag(user.nativeLanguage)}
                  {capitialize(user.nativeLanguage)}
                </span>
              </div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm">
            <MoreHorizontalIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {user.bio && (
          <p className="text-base-content mb-4 leading-relaxed">
            {user.bio}
          </p>
        )}
        
        {/* Language badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {user.nativeLanguage && (
            <span className="badge badge-secondary">
              {getLanguageFlag(user.nativeLanguage)}
              Native: {capitialize(user.nativeLanguage)}
            </span>
          )}
          {user.learningLanguage && (
            <span className="badge badge-outline">
              Learning: {capitialize(user.learningLanguage)}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition-colors ${
                isLiked ? "text-red-500" : "text-base-content opacity-70 hover:text-red-500"
              }`}
            >
              <HeartIcon className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              <span className="text-sm">{likeCount}</span>
            </button>
            
            <button className="flex items-center gap-2 text-base-content opacity-70 hover:text-primary transition-colors">
              <MessageCircleIcon className="w-5 h-5" />
              <span className="text-sm">Chat</span>
            </button>
            
            <button className="flex items-center gap-2 text-base-content opacity-70 hover:text-secondary transition-colors">
              <ShareIcon className="w-5 h-5" />
              <span className="text-sm">Share</span>
            </button>
          </div>
          
          {type === "recommendation" && (
            <button className="btn btn-primary btn-sm">
              Connect
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfessionalFeed = () => {
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const [activeTab, setActiveTab] = useState("friends");

  if (loadingFriends || loadingUsers) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-base-100 rounded-2xl p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-base-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-base-200 rounded w-1/3 mb-2" />
                <div className="h-3 bg-base-200 rounded w-1/4" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-base-200 rounded w-full" />
              <div className="h-3 bg-base-200 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 bg-base-200 rounded-xl p-1">
        <button
          onClick={() => setActiveTab("friends")}
          className={`flex-1 py-2 px-4 rounded-lg transition-all ${
            activeTab === "friends"
              ? "bg-primary text-primary-content shadow-sm"
              : "text-base-content opacity-70 hover:opacity-100"
          }`}
        >
          Friends ({friends.length})
        </button>
        <button
          onClick={() => setActiveTab("discover")}
          className={`flex-1 py-2 px-4 rounded-lg transition-all ${
            activeTab === "discover"
              ? "bg-primary text-primary-content shadow-sm"
              : "text-base-content opacity-70 hover:opacity-100"
          }`}
        >
          Discover ({recommendedUsers.length})
        </button>
      </div>

      {/* Feed Content */}
      <div className="space-y-4">
        {activeTab === "friends" ? (
          friends.length === 0 ? (
            <div className="bg-base-100 rounded-2xl p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">No Friends Yet</h3>
              <p className="text-base-content opacity-70 mb-4">
                Connect with people to see their updates here!
              </p>
              <button
                onClick={() => setActiveTab("discover")}
                className="btn btn-primary"
              >
                Discover People
              </button>
            </div>
          ) : (
            friends.map((friend) => (
              <FeedCard key={friend._id} user={friend} type="friend" />
            ))
          )
        ) : (
          recommendedUsers.length === 0 ? (
            <div className="bg-base-100 rounded-2xl p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">No Recommendations</h3>
              <p className="text-base-content opacity-70">
                Check back later for new connections!
              </p>
            </div>
          ) : (
            recommendedUsers.map((user) => (
              <FeedCard key={user._id} user={user} type="recommendation" />
            ))
          )
        )}
      </div>
    </div>
  );
};

export default ProfessionalFeed;
