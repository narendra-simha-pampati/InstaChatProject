import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};
export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

export async function getUserFriends() {
  const response = await axiosInstance.get("/users/friends");
  return response.data;
}

export async function getRecommendedUsers() {
  const response = await axiosInstance.get("/users");
  return response.data;
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data;
}

export async function sendFriendRequest(userId) {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
}

export async function getFriendRequests() {
  const response = await axiosInstance.get("/users/friend-requests");
  return response.data;
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}

// Story API functions
export async function createStory(storyData) {
  const response = await axiosInstance.post("/stories", storyData);
  return response.data;
}

export async function uploadStoryMedia(file) {
  const formData = new FormData();
  formData.append("media", file);
  
  const response = await axiosInstance.post("/stories/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function getStoriesFeed() {
  const response = await axiosInstance.get("/stories/feed");
  return response.data;
}

export async function getMyStories() {
  const response = await axiosInstance.get("/stories/my-stories");
  return response.data;
}

export async function viewStory(storyId) {
  const response = await axiosInstance.put(`/stories/${storyId}/view`);
  return response.data;
}

export async function deleteStory(storyId) {
  const response = await axiosInstance.delete(`/stories/${storyId}`);
  return response.data;
}

// Group API functions
export async function createGroup(groupData) {
  const response = await axiosInstance.post("/groups", groupData);
  return response.data;
}

export async function getMyGroups() {
  const response = await axiosInstance.get("/groups/my-groups");
  return response.data;
}

export async function getPublicGroups(params = {}) {
  const response = await axiosInstance.get("/groups/public", { params });
  return response.data;
}

export async function getGroupDetails(groupId) {
  const response = await axiosInstance.get(`/groups/${groupId}`);
  return response.data;
}

export async function joinGroup(groupId) {
  const response = await axiosInstance.post(`/groups/${groupId}/join`);
  return response.data;
}

export async function leaveGroup(groupId) {
  const response = await axiosInstance.post(`/groups/${groupId}/leave`);
  return response.data;
}

export async function inviteToGroup(groupId, userId) {
  const response = await axiosInstance.post(`/groups/${groupId}/invite`, { userId });
  return response.data;
}

export async function updateGroupSettings(groupId, settings) {
  const response = await axiosInstance.put(`/groups/${groupId}/settings`, settings);
  return response.data;
}

export async function deleteGroup(groupId) {
  const response = await axiosInstance.delete(`/groups/${groupId}`);
  return response.data;
}

export async function uploadProfilePicture(file) {
  const formData = new FormData();
  formData.append("profilePic", file);

  const response = await axiosInstance.post("/users/profile-picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function getMutualFriends(userId) {
  const response = await axiosInstance.get(`/users/${userId}/mutual-friends`);
  return response.data;
}

export async function getUserProfile(userId) {
  const response = await axiosInstance.get(`/users/${userId}/profile`);
  return response.data;
}

// Notification preferences
export async function getNotificationPreferences() {
  const response = await axiosInstance.get("/users/notification-preferences");
  return response.data;
}

export async function updateNotificationPreferences(preferences) {
  const response = await axiosInstance.put("/users/notification-preferences", {
    preferences,
  });
  return response.data;
}

// Email verification
export async function verifyEmailOtp({ email, code }) {
  const response = await axiosInstance.post("/auth/verify-otp", { email, code });
  return response.data;
}

export async function resendEmailOtp({ email }) {
  const response = await axiosInstance.post("/auth/resend-otp", { email });
  return response.data;
}
