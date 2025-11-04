// frontend/src/pages/FriendsPage.jsx
import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios.js";
import FriendCard from "../components/FriendCard.jsx";
import NoFriendsFound from "../components/NoFriendsFound.jsx";

const FriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axiosInstance.get("/users/friends"); // 👈 hitting backend route
        setFriends(res.data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const handleVideoCall = (friend) => {
    // Navigate to video call page with friend ID
    window.location.href = `/call/${friend._id}`;
  };

  if (loading) return <p className="p-6">Loading friends...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Friends</h1>
      {friends.length === 0 ? (
        <NoFriendsFound />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {friends.map((friend) => (
            <FriendCard 
              key={friend._id} 
              friend={friend} 
              onVideoCall={handleVideoCall}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsPage;
