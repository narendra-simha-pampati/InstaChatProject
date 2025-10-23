import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createGroup,
  getMyGroups,
  getPublicGroups,
  getGroupDetails,
  joinGroup,
  leaveGroup,
  inviteToGroup,
  updateGroupSettings,
  deleteGroup,
} from "../controllers/group.controller.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(protectRoute);

// Group CRUD operations
router.post("/", createGroup);
router.get("/my-groups", getMyGroups);
router.get("/public", getPublicGroups);
router.get("/:groupId", getGroupDetails);
router.post("/:groupId/join", joinGroup);
router.post("/:groupId/leave", leaveGroup);
router.post("/:groupId/invite", inviteToGroup);
router.put("/:groupId/settings", updateGroupSettings);
router.delete("/:groupId", deleteGroup);

export default router;
