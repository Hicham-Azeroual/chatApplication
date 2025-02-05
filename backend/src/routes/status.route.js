import express from "express";
import { createStatus, getStatuses,replyToStatus } from "../controllers/status.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import multer from "multer";

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Add a timestamp to the filename
  },
});
/* 
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "video/mp4", "audio/mpeg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, MP4, and MPEG files are allowed."), false);
  }
}; */

const upload = multer({ storage });

const router = express.Router();

// Create a new status
router.post(
  "/",
  protectRoute,
  upload.fields([
    { name: "media", maxCount: 1 }, // For image or video
    { name: "music", maxCount: 1 }, // For audio
  ]),
  createStatus
);

// Get all statuses
router.get("/", protectRoute, getStatuses);
router.post("/reply",protectRoute,replyToStatus)
export default router;