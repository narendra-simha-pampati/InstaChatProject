import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { uploadSingle } from "../lib/upload.js";
import {
  acceptFriendRequest,
  getFriendRequests,
  getMyFriends,
  getMutualFriends,
  getNotificationPreferences,
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserProfile,
  sendFriendRequest,
  updateNotificationPreferences,
  uploadProfilePicture,
} from "../controllers/user.controller.js";

const router = express.Router();

// apply auth middleware to all routes
router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendReqs);

router.post("/profile-picture", uploadSingle, uploadProfilePicture);
router.get("/:userId/mutual-friends", getMutualFriends);
router.get("/:userId/profile", getUserProfile);

// Notification preferences
router.get("/notification-preferences", getNotificationPreferences);
router.put("/notification-preferences", updateNotificationPreferences);

export default router;
