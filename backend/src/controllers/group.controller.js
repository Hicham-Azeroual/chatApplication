import Group from "../models/group.model.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import cloudinary from "../lib/cloudinary.js";
// Create a new group
export const createGroup = async (req, res) => {
  try {
    const { name, description, members, groupImage } = req.body; // Add groupImage to destructuring
    const createdBy = req.user._id;

    // Validate members
    if (!Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ error: "Members must be a non-empty array" });
    }

    // Check if all members exist
    const validMembers = await User.find({ _id: { $in: members } });
    if (validMembers.length !== members.length) {
      return res.status(400).json({ error: "One or more members are invalid" });
    }

    // Upload group image to Cloudinary
    let groupImageUrl = "";
    if (groupImage) {
      const uploadResponse = await cloudinary.uploader.upload(groupImage);
      groupImageUrl = uploadResponse.secure_url;
      console.log("Group image URL:", groupImageUrl);
      
    }

    // Create the group
    const newGroup = new Group({
      name,
      description,
      createdBy,
      admins: [createdBy], // Creator is the first admin
      members,
      profilePic: groupImageUrl, // Add group image URL
    });

    await newGroup.save();

    // Notify members via WebSocket
    members.forEach((memberId) => {
      const socketId = getReceiverSocketId(memberId);
      if (socketId) {
        io.to(socketId).emit("newGroup", newGroup);
      }
    });

    res.status(201).json(newGroup);
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add members to a group
export const addMembers = async (req, res) => {
  try {
    console.log("addMembers called",req.body);
    
    const { members } = req.body;
    const groupId = req.params.groupId;
    // Validate members
    if (!Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ error: "Members must be a non-empty array" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Ensure the user is an admin
    if (!group.admins.includes(req.user._id)) {
      return res.status(403).json({ error: "Only admins can add members" });
    }

    // Check if new members exist
    const validMembers = await User.find({ _id: { $in: members } });
    if (validMembers.length !== members.length) {
      return res.status(400).json({ error: "One or more members are invalid" });
    }

    // Add new members (avoid duplicates)
    group.members = [...new Set([...group.members, ...members])];
    await group.save();

    // Notify new members via WebSocket
    members.forEach((memberId) => {
      const socketId = getReceiverSocketId(memberId);
      if (socketId) {
        io.to(socketId).emit("addedToGroup", group);
      }
    });

    res.status(200).json(group);
  } catch (error) {
    console.error("Error adding members:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Remove members from a group
export const removeMembers = async (req, res) => {
  try {
    const { groupId, members } = req.body;

    // Validate members
    if (!Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ error: "Members must be a non-empty array" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Ensure the user is an admin
    if (!group.admins.includes(req.user._id)) {
      return res.status(403).json({ error: "Only admins can remove members" });
    }

    // Prevent removing admins
    const adminsToRemove = members.filter((memberId) =>
      group.admins.includes(memberId)
    );
    if (adminsToRemove.length > 0) {
      return res.status(400).json({ error: "Admins cannot be removed" });
    }

    // Remove members
    group.members = group.members.filter((memberId) => !members.includes(memberId));
    await group.save();

    // Notify removed members via WebSocket
    members.forEach((memberId) => {
      const socketId = getReceiverSocketId(memberId);
      if (socketId) {
        io.to(socketId).emit("removedFromGroup", group);
      }
    });

    res.status(200).json(group);
  } catch (error) {
    console.error("Error removing members:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Send a message to a group
export const sendGroupMessage = async (req, res) => {
  try {
    const { text, image, video, audio, file } = req.body;
    const senderId = req.user._id;
    const groupId = req.params.groupId;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Ensure the sender is a member of the group
    if (!group.members.includes(senderId)) {
      return res.status(403).json({ error: "You are not a member of this group" });
    }

    // Create the message
    const newMessage = new Message({
      senderId,
      groupId,
      text,
      image,
      video,
      audio,
      file,
    });

    await newMessage.save();

    // Notify all group members via WebSocket
    group.members.forEach((memberId) => {
      const socketId = getReceiverSocketId(memberId);
      if (socketId) {
        io.to(socketId).emit("newGroupMessage", newMessage);
      }
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending group message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get messages for a group
export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    console.log("group id is :",groupId);
    
    // Optional: Add pagination
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ groupId })
      .sort({ createdAt: -1 }) // Sort by latest first
      .skip(skip)
      .limit(limit);

    console.log("messages are :",messages);
      
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching group messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all groups for the current user

export const getGroups = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("User ID (ObjectId):", userId); // Debugging: Verify the ObjectId

    const groups = await Group.find({ members: userId });
    console.log("Groups:", groups); // Debugging: Check the groups returned

    res.status(200).json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
