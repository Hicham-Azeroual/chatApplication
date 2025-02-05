
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { createNotification } from "./notification.controller.js";
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
    try {
      const { id: userToChatId } = req.params;
      const myId = req.user._id;
  
      const messages = await Message.find({
        $or: [
          { senderId: myId, receiverId: userToChatId },
          { senderId: userToChatId, receiverId: myId },
        ],
        isDeleted: false, // Exclude deleted messages
      }).populate("reactions.userId", "fullName profilePic"); // Populate user details for reactions
  
      res.status(200).json(messages);
    } catch (error) {
      console.log("Error in getMessages controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  const uploadMedia = async (media, resourceType) => {
    try {
      const uploadResponse = await cloudinary.uploader.upload(media, {
        resource_type: resourceType === "audio" ? "raw" : resourceType, // Use "raw" for audio files
      });
      return uploadResponse.secure_url;
    } catch (error) {
      console.error(`Error uploading ${resourceType} to Cloudinary:`, error);
      throw new Error(`Failed to upload ${resourceType}: ${error.message}`);
    }
  };
  
  export const sendMessage = async (req, res) => {
    try {
      const { text } = req.body;
      const { id: receiverId } = req.params;
      const senderId = req.user._id;
  
      // Handle file uploads (image, video, audio, file)
      const files = req.files || [];
      let imageUrl, videoUrl, fileUrl, audioUrl;
  
      for (const file of files) {
        if (file.fieldname === "image") {
          imageUrl = await uploadMedia(file.path, "image");
        } else if (file.fieldname === "video") {
          videoUrl = await uploadMedia(file.path, "video");
        } else if (file.fieldname === "file") {
          fileUrl = await uploadMedia(file.path, "raw");
        } else if (file.fieldname === "audio") {
          audioUrl = await uploadMedia(file.path, "raw");
        }
      }
  
      // Validate that at least one field is present
      if (!text && !imageUrl && !videoUrl && !fileUrl && !audioUrl) {
        return res.status(400).json({ error: "At least one of text, image, video, file, or audio is required" });
      }
  
      // Create a new message
      const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image: imageUrl,
        video: videoUrl,
        file: fileUrl,
        audio: audioUrl,
      });
  
      await newMessage.save();
  
      // Notify the receiver via WebSocket
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
  
      // Create a notification for the receiver
      await createNotification(
        receiverId, // userId
        `You have a new message from ${req.user.fullName}`, // content
        "new_message" // type (must be a valid enum value)
      );
  
      res.status(201).json(newMessage);
    } catch (error) {
      console.error("Error in sendMessage controller:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
export const forwardMessage = async (req, res) => {
    try {
      const { messageId } = req.params; // ID of the message to forward
      const { receiverId } = req.body; // ID of the user/group to forward the message to
      const senderId = req.user._id; // ID of the user forwarding the message
  
      // Fetch the message to forward
      const messageToForward = await Message.findById(messageId);
      if (!messageToForward) {
        return res.status(404).json({ error: "Message not found" });
      }
  
      // Check if the receiver exists
      const receiver = await User.findById(receiverId);
      if (!receiver) {
        return res.status(404).json({ error: "Receiver not found" });
      }
  
      // Create a new message with the same content
      const newMessage = new Message({
        senderId,
        receiverId,
        text: messageToForward.text,
        image: messageToForward.image,
        video: messageToForward.video,
        file: messageToForward.file,
        isForwarded: true, // Mark as forwarded
        originalSenderId: messageToForward.senderId, // Track the original sender
        forwardedFrom: messageToForward._id, // Reference the original message
      });
  
      // Save the new message
      await newMessage.save();
  
      // Notify the receiver via WebSocket
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
  
      res.status(201).json(newMessage);
    } catch (error) {
      console.log("Error in forwardMessage controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const updateMessage = async (req, res) => {
    try {
      const { messageId } = req.params; // ID of the message to update
      const { text } = req.body; // New text content
      const senderId = req.user._id; // ID of the user updating the message
  
      // Find the message
      const message = await Message.findById(messageId);
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }
  
      // Check if the user is the sender of the message
      if (message.senderId.toString() !== senderId.toString()) {
        return res.status(403).json({ error: "You can only update your own messages" });
      }
  
      // Check if the message is editable (e.g., within 5 minutes of sending)
      const currentTime = new Date();
      const messageTime = new Date(message.createdAt);
      const timeDifference = (currentTime - messageTime) / (1000 * 60); // Difference in minutes
  
      if (timeDifference > 5) {
        return res.status(400).json({ error: "Message can only be updated within 5 minutes of sending" });
      }
  
      // Update the message text
      message.text = text;
      await message.save();
  
      // Notify the receiver via WebSocket
      const receiverSocketId = getReceiverSocketId(message.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("messageUpdated", message);
      }
  
      res.status(200).json(message);
    } catch (error) {
      console.log("Error in updateMessage controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const deleteMessage = async (req, res) => {
    try {
      const { messageId } = req.params; // ID of the message to delete
      const senderId = req.user._id; // ID of the user deleting the message
  
      // Find the message
      const message = await Message.findById(messageId);
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }
  
      // Check if the user is the sender of the message
      if (message.senderId.toString() !== senderId.toString()) {
        return res.status(403).json({ error: "You can only delete your own messages" });
      }
  
      // Soft delete the message (mark as deleted)
      message.isDeleted = true;
      await message.save();
  
      // Notify the receiver via WebSocket
      const receiverSocketId = getReceiverSocketId(message.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("messageDeleted", messageId);
      }
  
      res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
      console.log("Error in deleteMessage controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const addReaction = async (req, res) => {
    const { messageId } = req.params;
    const { emoji, userId } = req.body; // Destructure emoji and userId from the request body
  
    try {
      const message = await Message.findById(messageId);
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }
  
      // Check if the user has already reacted with this emoji
      const existingReaction = message.reactions.find(
        (reaction) =>
          reaction.userId.toString() === userId.toString() && reaction.emoji === emoji
      );
  
      if (existingReaction) {
        return res.status(400).json({ error: "You have already reacted with this emoji" });
      }
  
      // Add the reaction
      message.reactions.push({ emoji, userId });
      await message.save();
  
      // Notify the receiver via WebSocket
      const receiverSocketId = getReceiverSocketId(message.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("messageReacted", message);
      }
  
      res.status(200).json(message);
    } catch (error) {
      console.log("Error in addReaction controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const removeReaction = async (req, res) => {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;
  
    try {
      const message = await Message.findById(messageId);
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }
  
      // Remove the user's reaction for the specified emoji
      message.reactions = message.reactions.filter(
        (reaction) =>
          reaction.userId.toString() !== userId.toString() || reaction.emoji !== emoji
      );
      await message.save();
  
      // Notify the receiver via WebSocket
      const receiverSocketId = getReceiverSocketId(message.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("messageReacted", message);
      }
  
      res.status(200).json(message);
    } catch (error) {
      console.log("Error in removeReaction controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };