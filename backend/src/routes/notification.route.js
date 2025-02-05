import express from "express";
import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get all notifications for the logged-in user
router.get("/", protectRoute, getNotifications);

// Mark a notification as read
router.patch("/:id/read", protectRoute, markNotificationAsRead);

// Delete a notification
router.delete("/:id", protectRoute, deleteNotification);

export default router;