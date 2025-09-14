// frontend/src/pages/FriendsPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const FriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axios.get("/api/users/friends"); // 👈 hitting backend route
        setFriends(res.data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  if (loading) return <p className="p-6">Loading friends...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Friends</h1>
      {friends.length === 0 ? (
        <p>No friends yet.</p>
      ) : (
        <ul className="space-y-4">
          {friends.map((friend) => (
            <li key={friend._id} className="flex items-center space-x-4">
              <img
                src={friend.profilePic || "/default-avatar.png"}
                alt={friend.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{friend.fullName}</p>
                <p className="text-sm text-gray-500">
                  Speaks {friend.nativeLanguage} • Learning {friend.learningLanguage}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendsPage;
