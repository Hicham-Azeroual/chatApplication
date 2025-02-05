import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
  forwardMessage,
  updateMessage,
  deleteMessage,
  addReaction,
  removeReaction,
} from "../controllers/message.controller.js";

const router = express.Router();

// 1. Get users for the sidebar (excluding the current user)
router.get("/users", protectRoute, getUsersForSidebar);

// 2. Get messages between the current user and another user
router.get("/:id", protectRoute, getMessages);

// 3. Send a message to a user or group
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

const upload = multer({ storage });

// Update the route to use multer middleware
router.post("/send/:id", protectRoute, upload.any(), sendMessage);
// 4. Forward a message to another user or group
router.post("/forward/:messageId", protectRoute, forwardMessage);

// 5. Update a message (only for the sender and within 5 minutes of sending)
router.patch("/update/:messageId", protectRoute, updateMessage);

// 6. Delete a message (soft delete, only for the sender)
router.delete("/delete/:messageId", protectRoute, deleteMessage);

// 7. Add a reaction to a message
router.post("/react/:messageId", protectRoute, addReaction);

// 8. Remove a reaction from a message
router.delete("/react/:messageId", protectRoute, removeReaction);

export default router;