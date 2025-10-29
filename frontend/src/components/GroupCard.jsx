import { useState } from "react";
import { useNavigate } from "react-router";
import { UsersIcon, LockIcon, MessageCircleIcon, SettingsIcon, UserPlusIcon, CrownIcon, ShieldIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { joinGroup, leaveGroup } from "../lib/api";
import toast from "react-hot-toast";

const GroupCard = ({ group, isMember = false, onJoin, onLeave, onSettings }) => {
  const [isHovered, setIsHovered] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: joinGroupMutation, isPending: isJoining } = useMutation({
    mutationFn: () => joinGroup(group._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Successfully joined the group!");
      onJoin?.(group);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to join group");
    },
  });

  const { mutate: leaveGroupMutation, isPending: isLeaving } = useMutation({
    mutationFn: () => leaveGroup(group._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Successfully left the group!");
      onLeave?.(group);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to leave group");
    },
  });

  const handleJoin = () => {
    joinGroupMutation();
  };

  const handleLeave = () => {
    if (confirm("Are you sure you want to leave this group?")) {
      leaveGroupMutation();
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <CrownIcon className="w-4 h-4 text-yellow-500" />;
      case "moderator":
        return <ShieldIcon className="w-4 h-4 text-blue-500" />;
      default:
        return <UsersIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div
      className="bg-base-100 rounded-2xl shadow-sm border border-base-300 overflow-hidden hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Group Header */}
      <div className="p-4 border-b border-base-300">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-12 rounded-full">
              {group.avatar ? (
                <img src={group.avatar} alt={group.name} />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <UsersIcon className="w-6 h-6 text-primary" />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{group.name}</h3>
              {group.settings?.isPrivate && (
                <LockIcon className="w-4 h-4 text-base-content opacity-50" />
              )}
            </div>
            <p className="text-sm text-base-content opacity-70">
              {group.memberCount} member{group.memberCount !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {isMember ? (
              <>
                <button
                  onClick={() => navigate(`/chat/group-${group._id}`)}
                  className="btn btn-primary btn-sm"
                  title="Open Chat"
                >
                  <MessageCircleIcon className="w-4 h-4 mr-1" /> Chat
                </button>
                <button
                  onClick={() => onSettings?.(group)}
                  className="btn btn-ghost btn-sm"
                  title="Group Settings"
                >
                  <SettingsIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={handleLeave}
                  className="btn btn-outline btn-sm btn-error"
                  disabled={isLeaving}
                >
                  {isLeaving ? "Leaving..." : "Leave"}
                </button>
              </>
            ) : (
              <button
                onClick={handleJoin}
                className="btn btn-primary btn-sm"
                disabled={isJoining}
              >
                {isJoining ? "Joining..." : "Join"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Group Content */}
      <div className="p-4">
        {group.description && (
          <p className="text-sm text-base-content opacity-70 mb-3 line-clamp-2">
            {group.description}
          </p>
        )}

        {/* Tags */}
        {group.tags && group.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {group.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="badge badge-outline badge-sm">
                #{tag}
              </span>
            ))}
            {group.tags.length > 3 && (
              <span className="badge badge-outline badge-sm">
                +{group.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Last Message */}
        {group.lastMessage && (
          <div className="flex items-center gap-2 text-sm text-base-content opacity-60">
            <MessageCircleIcon className="w-4 h-4" />
            <span className="truncate">
              {group.lastMessage.sender?.fullName}: {group.lastMessage.content}
            </span>
          </div>
        )}

        {/* Member Preview */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {group.members?.slice(0, 3).map((member, index) => (
                <div key={index} className="avatar">
                  <div className="w-6 rounded-full border-2 border-base-100">
                    <img
                      src={member.user?.profilePic || "/default-avatar.png"}
                      alt={member.user?.fullName}
                    />
                  </div>
                </div>
              ))}
              {group.memberCount > 3 && (
                <div className="avatar">
                  <div className="w-6 rounded-full border-2 border-base-100 bg-base-200 flex items-center justify-center">
                    <span className="text-xs font-semibold">+{group.memberCount - 3}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-base-content opacity-50">
            <UsersIcon className="w-3 h-3" />
            <span>{group.memberCount}/{group.settings?.maxMembers || 100}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
