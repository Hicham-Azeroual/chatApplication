import express from "express";
import {
  createGroup,
  addMembers,
  removeMembers,
  sendGroupMessage,
  getGroupMessages,
  getGroups
} from "../controllers/group.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import multer from "multer";

import path from "path";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to the "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  },
});
const router = express.Router();
const upload = multer({ storage });

// Create a new group
router.post("/", protectRoute, createGroup);
router.get("/", protectRoute, getGroups);

// Add members to a group
router.post("/:groupId/add-members", protectRoute, addMembers);

// Remove members from a group
router.post("/:groupId/remove-members", protectRoute, removeMembers);

// Send a message to a group
router.post("/:groupId/messages", protectRoute,upload.any() ,sendGroupMessage);

// Get messages for a group
router.get("/:groupId/messages", protectRoute, getGroupMessages);

export default router;