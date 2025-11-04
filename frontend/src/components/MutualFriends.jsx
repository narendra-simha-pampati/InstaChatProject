import { useQuery } from "@tanstack/react-query";
import { UsersIcon } from "lucide-react";
import { getMutualFriends } from "../lib/api";

const MutualFriends = ({ userId }) => {
  const { data: mutualFriends = [], isLoading } = useQuery({
    queryKey: ["mutualFriends", userId],
    queryFn: () => getMutualFriends(userId),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-base-content opacity-70">
        <UsersIcon className="w-4 h-4" />
        <span>Loading mutual friends...</span>
      </div>
    );
  }

  if (mutualFriends.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm text-base-content opacity-70">
      <UsersIcon className="w-4 h-4" />
      <span>{mutualFriends.length} mutual friend{mutualFriends.length !== 1 ? 's' : ''}</span>
      <div className="flex -space-x-2">
        {mutualFriends.slice(0, 3).map((friend) => (
          <div key={friend._id} className="avatar">
            <div className="w-6 h-6 rounded-full ring-2 ring-base-100">
              <img 
                src={friend.profilePic || "/default-avatar.png"} 
                alt={friend.fullName}
                title={friend.fullName}
              />
            </div>
          </div>
        ))}
        {mutualFriends.length > 3 && (
          <div className="w-6 h-6 rounded-full ring-2 ring-base-100 bg-base-200 flex items-center justify-center text-xs font-medium">
            +{mutualFriends.length - 3}
          </div>
        )}
      </div>
    </div>
  );
};

export default MutualFriends;
