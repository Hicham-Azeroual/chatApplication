import Status from "../models/status.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { createNotification } from "./notification.controller.js";
import Message from "../models/message.model.js";
// Helper function to upload media to Cloudinary
const uploadMedia = async (file, resourceType) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(file.path, {
      resource_type: resourceType === "audio" ? "raw" : resourceType, // Use "raw" for audio files
    });
    return uploadResponse.secure_url;
  } catch (error) {
    console.error(`Error uploading ${resourceType} to Cloudinary:`, error);
    throw new Error(`Failed to upload ${resourceType}: ${error.message}`);
  }
};

// Create a new status
export const createStatus = async (req, res) => {
  try {
    console.log("Creating status", req.body);

    const { text, background } = req.body;
    const userId = req.user._id;
    console.log("req files", req.files);

    // Initialize media URLs
    let imageUrl = "";
    let videoUrl = "";
    let audioUrl = "";

    // Check if files were uploaded
    if (req.files && req.files.media) {
      for (const file of req.files.media) {
        if (file.mimetype.startsWith('image/')) {
          imageUrl = await uploadMedia(file, "image");
        } else if (file.mimetype.startsWith('video/')) {
          videoUrl = await uploadMedia(file, "video");
        } else if (file.mimetype.startsWith('audio/')) {
          audioUrl = await uploadMedia(file, "raw");
        }
      }
    }

    // Validate that at least one field is present
    if (!text && !imageUrl && !videoUrl && !audioUrl) {
      return res.status(400).json({
        message: "At least one of text, image, video, or audio is required.",
      });
    }

    // Create the status
    const status = await Status.create({
      userId,
      text,
      image: imageUrl,
      video: videoUrl,
      audio: audioUrl,
      background,
    });

    // Notify followers via WebSocket (optional)
    const followers = await User.find({ followers: userId });
    followers.forEach((follower) => {
      const followerSocketId = getReceiverSocketId(follower._id);
      if (followerSocketId) {
        io.to(followerSocketId).emit("newStatus", status);
      }
    });

    res.status(201).json(status);
  } catch (error) {
    console.error("Error creating status:", error);
    res.status(500).json({ message: "Failed to create status", error: error.message });
  }
};

// Get all statuses
export const getStatuses = async (req, res) => {
  try {
    // Fetch all statuses and populate the userId field
    const statuses = await Status.find()
      .populate("userId", "fullName profilePic")
      .sort({ createdAt: -1 }); // Sort by creation date (newest first)

    // Return the statuses
    res.status(200).json(statuses);
  } catch (error) {
    console.error("Error fetching statuses:", error);
    res.status(500).json({ message: "Failed to fetch statuses", error: error.message });
  }
};

// controllers/status.controller.js

export const replyToStatus = async (req, res) => {
  try {
    const { statusId, text } = req.body;
    const senderId = req.user._id;
    console.log("called replayToStatus|||||||||");
    
    // Fetch the status
    const status = await Status.findById(statusId).populate("userId", "fullName profilePic");
    if (!status) {
      return res.status(404).json({ error: "Status not found" });
    }

    // Create a new message that references the status
    const newMessage = new Message({
      senderId,
      receiverId: status.userId._id, // The user who created the status
      text,
      statusReply: {
        statusId: status._id,
        text: status.text,
        image: status.image,
        video: status.video,
        audio: status.audio,
        background: status.background,
        createdAt: status.createdAt,
        user: {
          fullName: status.userId.fullName,
          profilePic: status.userId.profilePic,
        },
      },
    });

    await newMessage.save();

    // Notify the receiver via WebSocket
    const receiverSocketId = getReceiverSocketId(status.userId._id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in replyToStatus controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};