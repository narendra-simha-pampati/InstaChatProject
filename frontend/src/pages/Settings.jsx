import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser";
import ProfilePictureUpload from "../components/ProfilePictureUpload.jsx";
import { UserIcon, MapPinIcon, EditIcon, BellIcon, MailIcon, SmartphoneIcon } from "lucide-react";
import { getNotificationPreferences, updateNotificationPreferences } from "../lib/api";
import toast from "react-hot-toast";

const Settings = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(authUser?.bio || "");
  const [location, setLocation] = useState(authUser?.location || "");

  // Fetch notification preferences
  const { data: notificationPrefs, isLoading: loadingPrefs } = useQuery({
    queryKey: ["notificationPreferences"],
    queryFn: getNotificationPreferences,
  });

  // Update notification preferences mutation
  const { mutate: updatePrefsMutation, isPending: updatingPrefs } = useMutation({
    mutationFn: updateNotificationPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationPreferences"] });
      toast.success("Notification preferences updated!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update preferences");
    },
  });

  const handleSave = () => {
    // TODO: Implement profile update
    setIsEditing(false);
  };

  const handleNotificationPreferenceChange = (key, value) => {
    if (!notificationPrefs) return;
    
    const updatedPrefs = {
      ...notificationPrefs,
      [key]: value,
    };
    
    updatePrefsMutation(updatedPrefs);
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Profile Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <UserIcon className="w-5 h-5" />
          Profile
        </h2>
        
        <div className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-300">
          <div className="flex items-start gap-6">
            {/* Profile Picture */}
            <ProfilePictureUpload 
              currentProfilePic={authUser?.profilePic}
              onUpdate={(newPic) => {
                // Profile picture updated
              }}
            />
            
            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{authUser?.fullName}</h3>
                <p className="text-sm text-base-content opacity-70">{authUser?.email}</p>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4" />
                      Location
                    </span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Enter your location"
                    />
                  ) : (
                    <p className="text-base-content">{location || "Not specified"}</p>
                  )}
                </div>
                
                <div>
                  <label className="label">
                    <span className="label-text">Bio</span>
                  </label>
                  {isEditing ? (
                    <textarea
                      className="textarea textarea-bordered w-full h-24 resize-none"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      maxLength={500}
                    />
                  ) : (
                    <p className="text-base-content">{bio || "No bio yet"}</p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button onClick={handleSave} className="btn btn-primary">
                      Save Changes
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)} 
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="btn btn-outline"
                  >
                    <EditIcon className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Theme Toggle */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Appearance</h2>
        <button className="btn btn-outline">Toggle Dark / Light Theme</button>
      </section>

      {/* Notifications */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BellIcon className="w-5 h-5" />
          Notifications
        </h2>
        
        <div className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-300">
          {loadingPrefs ? (
            <div className="flex justify-center py-4">
              <span className="loading loading-spinner loading-md" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Email Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MailIcon className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-semibold">Email Notifications</h3>
                    <p className="text-sm text-base-content opacity-70">
                      Receive notifications via email
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={notificationPrefs?.emailNotifications || false}
                  onChange={(e) => handleNotificationPreferenceChange('emailNotifications', e.target.checked)}
                  disabled={updatingPrefs}
                />
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SmartphoneIcon className="w-5 h-5 text-secondary" />
                  <div>
                    <h3 className="font-semibold">Push Notifications</h3>
                    <p className="text-sm text-base-content opacity-70">
                      Receive browser push notifications
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="toggle toggle-secondary"
                  checked={notificationPrefs?.pushNotifications || false}
                  onChange={(e) => handleNotificationPreferenceChange('pushNotifications', e.target.checked)}
                  disabled={updatingPrefs}
                />
              </div>

              {/* Detailed Notification Settings */}
              <div className="divider">Notification Types</div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Friend Requests</h4>
                    <p className="text-sm text-base-content opacity-70">
                      Notify when someone sends you a friend request
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={notificationPrefs?.friendRequests || false}
                    onChange={(e) => handleNotificationPreferenceChange('friendRequests', e.target.checked)}
                    disabled={updatingPrefs}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Story Views</h4>
                    <p className="text-sm text-base-content opacity-70">
                      Notify when someone views your story
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={notificationPrefs?.storyViews || false}
                    onChange={(e) => handleNotificationPreferenceChange('storyViews', e.target.checked)}
                    disabled={updatingPrefs}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Group Invites</h4>
                    <p className="text-sm text-base-content opacity-70">
                      Notify when you're added to a group
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={notificationPrefs?.groupInvites || false}
                    onChange={(e) => handleNotificationPreferenceChange('groupInvites', e.target.checked)}
                    disabled={updatingPrefs}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Video Calls</h4>
                    <p className="text-sm text-base-content opacity-70">
                      Notify when someone calls you
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={notificationPrefs?.videoCalls || false}
                    onChange={(e) => handleNotificationPreferenceChange('videoCalls', e.target.checked)}
                    disabled={updatingPrefs}
                  />
                </div>

                {/* Chat UI Preferences */}
                <div className="divider">Chat UI Preferences</div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Show Unread Badges</h4>
                    <p className="text-sm text-base-content opacity-70">
                      Display red unread message count on chats
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={notificationPrefs?.showUnreadBadges || false}
                    onChange={(e) => handleNotificationPreferenceChange('showUnreadBadges', e.target.checked)}
                    disabled={updatingPrefs}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Show Last Message Preview</h4>
                    <p className="text-sm text-base-content opacity-70">
                      Show the most recent message text under each chat
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={notificationPrefs?.showLastMessagePreview || false}
                    onChange={(e) => handleNotificationPreferenceChange('showLastMessagePreview', e.target.checked)}
                    disabled={updatingPrefs}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Privacy */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Privacy</h2>
        <p className="text-sm text-gray-500">Manage who can see your profile & activity.</p>
        <button className="btn btn-outline btn-error">Delete Account</button>
      </section>
    </div>
  );
};

export default Settings;
