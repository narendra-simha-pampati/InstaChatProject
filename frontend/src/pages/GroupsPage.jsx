import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon, SearchIcon, FilterIcon, UsersIcon, LockIcon } from "lucide-react";
import { getMyGroups, getPublicGroups } from "../lib/api";
import GroupCard from "../components/GroupCard";
import CreateGroupModal from "../components/CreateGroupModal";

const GroupsPage = () => {
  const [activeTab, setActiveTab] = useState("my-groups");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: myGroups = [], isLoading: loadingMyGroups } = useQuery({
    queryKey: ["groups", "my-groups"],
    queryFn: getMyGroups,
  });

  const { data: publicGroupsData, isLoading: loadingPublicGroups } = useQuery({
    queryKey: ["groups", "public", searchQuery],
    queryFn: () => getPublicGroups({ search: searchQuery }),
    enabled: activeTab === "discover",
  });

  const publicGroups = publicGroupsData?.groups || [];

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Groups
              </h1>
              <p className="text-base-content opacity-70 mt-2">
                Join communities and connect with language learners
              </p>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Create Group
            </button>
          </div>

          {/* Search and Filters */}
          <div className="relative">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content opacity-50 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search groups..."
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
                      <span className="label-text">Privacy</span>
                    </label>
                    <select className="select select-bordered w-full max-w-xs">
                      <option>All Groups</option>
                      <option>Public Only</option>
                      <option>Private Only</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Members</span>
                    </label>
                    <select className="select select-bordered w-full max-w-xs">
                      <option>Any Size</option>
                      <option>Small (1-10)</option>
                      <option>Medium (11-50)</option>
                      <option>Large (50+)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 bg-base-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveTab("my-groups")}
            className={`flex-1 py-2 px-4 rounded-lg transition-all ${
              activeTab === "my-groups"
                ? "bg-primary text-primary-content shadow-sm"
                : "text-base-content opacity-70 hover:opacity-100"
            }`}
          >
            <UsersIcon className="w-4 h-4 inline mr-2" />
            My Groups ({myGroups.length})
          </button>
          <button
            onClick={() => setActiveTab("discover")}
            className={`flex-1 py-2 px-4 rounded-lg transition-all ${
              activeTab === "discover"
                ? "bg-primary text-primary-content shadow-sm"
                : "text-base-content opacity-70 hover:opacity-100"
            }`}
          >
            <SearchIcon className="w-4 h-4 inline mr-2" />
            Discover ({publicGroupsData?.total || 0})
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === "my-groups" ? (
            loadingMyGroups ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-base-100 rounded-2xl p-6 animate-pulse">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-base-200 rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-base-200 rounded w-2/3 mb-2" />
                        <div className="h-3 bg-base-200 rounded w-1/3" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-base-200 rounded w-full" />
                      <div className="h-3 bg-base-200 rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : myGroups.length === 0 ? (
              <div className="bg-base-100 rounded-2xl p-8 text-center">
                <UsersIcon className="w-16 h-16 text-base-content opacity-30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Groups Yet</h3>
                <p className="text-base-content opacity-70 mb-4">
                  You haven't joined any groups yet. Create one or discover existing groups!
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn btn-primary"
                  >
                    Create Group
                  </button>
                  <button
                    onClick={() => setActiveTab("discover")}
                    className="btn btn-outline"
                  >
                    Discover Groups
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myGroups.map((group) => (
                  <GroupCard
                    key={group._id}
                    group={group}
                    isMember={true}
                    onSettings={(group) => {
                      // TODO: Open group settings modal
                      console.log("Open settings for:", group.name);
                    }}
                  />
                ))}
              </div>
            )
          ) : (
            loadingPublicGroups ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-base-100 rounded-2xl p-6 animate-pulse">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-base-200 rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-base-200 rounded w-2/3 mb-2" />
                        <div className="h-3 bg-base-200 rounded w-1/3" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-base-200 rounded w-full" />
                      <div className="h-3 bg-base-200 rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : publicGroups.length === 0 ? (
              <div className="bg-base-100 rounded-2xl p-8 text-center">
                <SearchIcon className="w-16 h-16 text-base-content opacity-30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Groups Found</h3>
                <p className="text-base-content opacity-70 mb-4">
                  {searchQuery ? "Try adjusting your search terms" : "No public groups available at the moment"}
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn btn-primary"
                >
                  Create First Group
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publicGroups.map((group) => (
                  <GroupCard
                    key={group._id}
                    group={group}
                    isMember={false}
                  />
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};

export default GroupsPage;
