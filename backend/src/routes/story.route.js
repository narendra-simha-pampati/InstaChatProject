import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createStory,
  getStoriesFeed,
  getMyStories,
  viewStory,
  deleteStory,
  cleanupExpiredStories,
  uploadStoryMedia,
} from "../controllers/story.controller.js";
import { uploadSingle } from "../lib/upload.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(protectRoute);

// Story CRUD operations
router.post("/", createStory);
router.post("/upload", uploadSingle, uploadStoryMedia);
router.get("/feed", getStoriesFeed);
router.get("/my-stories", getMyStories);
router.put("/:storyId/view", viewStory);
router.delete("/:storyId", deleteStory);

// Admin route for cleanup (optional)
router.post("/cleanup", cleanupExpiredStories);

export default router;
