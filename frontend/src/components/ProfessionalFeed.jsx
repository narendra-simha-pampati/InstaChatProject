

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HeartIcon, MessageCircleIcon, ShareIcon, MoreHorizontalIcon, MapPinIcon, UserPlusIcon, CheckCircleIcon } from "lucide-react";
import { getUserFriends, getRecommendedUsers, sendFriendRequest, getOutgoingFriendReqs } from "../lib/api";
import FriendCard from "./FriendCard";
import MutualFriends from "./MutualFriends";
import toast from "react-hot-toast";

const FeedCard = ({ user, type = "recommendation", onSendFriendRequest, hasRequestBeenSent, onVideoCall }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0); // Start with 0 instead of random

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleSendFriendRequest = () => {
    onSendFriendRequest(user._id);
  };

  const handleChat = () => {
    // Navigate to chat with this user
    window.location.href = `/chat/${user._id}`;
  };

  const handleShare = () => {
    // Share user profile
    if (navigator.share) {
      navigator.share({
        title: `${user.fullName}'s Profile`,
        text: `Check out ${user.fullName}'s profile on InstaChat!`,
        url: window.location.origin + `/profile/${user._id}`,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${user.fullName}'s profile: ${window.location.origin}/profile/${user._id}`);
      toast.success("Profile link copied to clipboard!");
    }
  };

  const handleVideoCall = () => {
    if (onVideoCall) {
      onVideoCall(user);
    }
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
                    <MapPinIcon className="w-3 h-3" />
                    {user.location}
                  </span>
                )}
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
        
        {/* Mutual Friends */}
        {type === "recommendation" && (
          <div className="mb-4">
            <MutualFriends userId={user._id} />
          </div>
        )}
        
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
            
            <button 
              onClick={handleChat}
              className="flex items-center gap-2 text-base-content opacity-70 hover:text-primary transition-colors"
            >
              <MessageCircleIcon className="w-5 h-5" />
              <span className="text-sm">Chat</span>
            </button>
            
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 text-base-content opacity-70 hover:text-secondary transition-colors"
            >
              <ShareIcon className="w-5 h-5" />
              <span className="text-sm">Share</span>
            </button>
          </div>
          
          {type === "recommendation" && (
            <button 
              onClick={handleSendFriendRequest}
              className={`btn btn-sm ${
                hasRequestBeenSent ? "btn-disabled" : "btn-primary"
              }`}
              disabled={hasRequestBeenSent}
            >
              {hasRequestBeenSent ? (
                <>
                  <CheckCircleIcon className="w-4 h-4 mr-1" />
                  Request Sent
                </>
              ) : (
                <>
                  <UserPlusIcon className="w-4 h-4 mr-1" />
                  Send Friend Request
                </>
              )}
            </button>
          )}
          
          {type === "friend" && (
            <button 
              onClick={handleVideoCall}
              className="btn btn-primary btn-sm"
            >
              <MessageCircleIcon className="w-4 h-4 mr-1" />
              Video Call
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfessionalFeed = ({ onVideoCall, searchQuery = "" }) => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
      toast.success("Friend request sent successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send friend request");
    },
  });

  const [activeTab, setActiveTab] = useState("friends");

  // Update outgoing requests IDs
  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  const handleSendFriendRequest = (userId) => {
    sendRequestMutation(userId);
  };

  // Filter users based on search query
  const filteredRecommendedUsers = recommendedUsers.filter(user =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.location && user.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.bio && user.bio.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
              <FeedCard 
                key={friend._id} 
                user={friend} 
                type="friend" 
                onVideoCall={onVideoCall}
              />
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
            filteredRecommendedUsers.map((user) => {
              const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
              return (
                <FeedCard 
                  key={user._id} 
                  user={user} 
                  type="recommendation" 
                  onSendFriendRequest={handleSendFriendRequest}
                  hasRequestBeenSent={hasRequestBeenSent}
                />
              );
            })
          )
        )}
      </div>
    </div>
  );
};

export default ProfessionalFeed;
