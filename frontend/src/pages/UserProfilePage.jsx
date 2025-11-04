import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router";
import { getMutualFriends, getUserProfile } from "../lib/api";
import PageLoader from "../components/PageLoader";

const UserProfilePage = () => {
  const { id } = useParams();

  const { data: profile, isLoading: loadingProfile } = useQuery({
    queryKey: ["userProfile", id],
    queryFn: () => getUserProfile(id),
  });

  const { data: mutual = [], isLoading: loadingMutual } = useQuery({
    queryKey: ["mutualFriends", id],
    queryFn: () => getMutualFriends(id),
  });

  if (loadingProfile) return <PageLoader />;
  if (!profile) return <div className="p-6">User not found</div>;

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-6">
          <div className="avatar">
            <div className="w-28 h-28 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100 overflow-hidden">
              <img src={profile.profilePic || "/i.png"} alt={profile.fullName} />
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold">{profile.fullName}</h1>
              <Link to={`/chat/${id}`} className="btn btn-primary btn-sm">Message</Link>
              <Link to={`/call/${id}`} className="btn btn-outline btn-sm">Call</Link>
            </div>
            <p className="text-base-content opacity-80 text-sm">
              {profile.location || ""}
            </p>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Bio</h3>
            <p className="text-sm leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* Mutual Friends */}
        <div className="mt-8">
          <h3 className="font-semibold mb-3">Mutual Friends ({mutual.length})</h3>
          {loadingMutual ? (
            <div className="flex gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-base-200 animate-pulse" />
              ))}
            </div>
          ) : mutual.length === 0 ? (
            <p className="text-sm opacity-70">No mutual friends yet</p>
          ) : (
            <div className="flex gap-3 flex-wrap">
              {mutual.map((m) => (
                <Link key={m._id} to={`/profile/${m._id}`} className="tooltip" data-tip={m.fullName}>
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full">
                      <img src={m.profilePic || "/i.png"} alt={m.fullName} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;


