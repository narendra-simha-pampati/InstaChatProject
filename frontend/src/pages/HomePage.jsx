import { useState } from "react";
import { Link } from "react-router";
import { BellIcon, UsersIcon, SearchIcon, FilterIcon } from "lucide-react";
import StoriesBar from "../components/StoriesBar";
import ProfessionalFeed from "../components/ProfessionalFeed";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import { useQuery } from "@tanstack/react-query";
import { getUserFriends, getRecommendedUsers } from "../lib/api";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Welcome Back!
              </h1>
              <p className="text-base-content opacity-70 mt-2">
                Discover new connections and share your language journey
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link to="/notifications" className="btn btn-outline btn-sm relative">
                <BellIcon className="w-4 h-4 mr-2" />
                Notifications
                {friends.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-content text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {friends.length}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content opacity-50 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search people, languages, or interests..."
                  className="input input-bordered w-full pl-10 pr-4 bg-base-100"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn btn-outline ${showFilters ? "btn-active" : ""}`}
              >
                <FilterIcon className="w-4 h-4" />
              </button>
            </div>
            
            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-4 p-4 bg-base-100 rounded-xl border border-base-300">
                <div className="flex flex-wrap gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Language</span>
                    </label>
                    <select className="select select-bordered w-full max-w-xs">
                      <option>All Languages</option>
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Location</span>
                    </label>
                    <input
                      type="text"
                      placeholder="City, Country"
                      className="input input-bordered w-full max-w-xs"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Status</span>
                    </label>
                    <select className="select select-bordered w-full max-w-xs">
                      <option>All Users</option>
                      <option>Online Now</option>
                      <option>Recently Active</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stories Section */}
        <StoriesBar />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Professional Feed */}
          <div className="lg:col-span-2">
            <div className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Your Feed</h2>
                <div className="flex items-center gap-2 text-sm text-base-content opacity-70">
                  <UsersIcon className="w-4 h-4" />
                  <span>{friends.length + recommendedUsers.length} connections</span>
                </div>
              </div>
              <ProfessionalFeed />
            </div>
          </div>

          {/* Right Column - Quick Actions & Stats */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-300">
              <h3 className="text-lg font-semibold mb-4">Your Progress</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-base-content opacity-70">Friends</span>
                  <span className="font-semibold">{friends.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-base-content opacity-70">Stories Shared</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-base-content opacity-70">Messages Sent</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-base-content opacity-70">Video Calls</span>
                  <span className="font-semibold">0</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-300">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/friends" className="btn btn-outline w-full justify-start">
                  <UsersIcon className="w-4 h-4 mr-2" />
                  Manage Friends
                </Link>
                <Link to="/notifications" className="btn btn-outline w-full justify-start">
                  <BellIcon className="w-4 h-4 mr-2" />
                  View Notifications
                </Link>
                <button className="btn btn-primary w-full">
                  Start Video Call
                </button>
              </div>
            </div>

            {/* Recent Friends */}
            {friends.length > 0 && (
              <div className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-300">
                <h3 className="text-lg font-semibold mb-4">Recent Friends</h3>
                <div className="space-y-3">
                  {friends.slice(0, 3).map((friend) => (
                    <div key={friend._id} className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-10 rounded-full">
                          <img src={friend.profilePic || "/default-avatar.png"} alt={friend.fullName} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{friend.fullName}</p>
                        <p className="text-xs text-base-content opacity-70">
                          {friend.nativeLanguage}
                        </p>
                      </div>
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                    </div>
                  ))}
                  {friends.length > 3 && (
                    <Link to="/friends" className="text-primary text-sm hover:underline">
                      View all {friends.length} friends
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

