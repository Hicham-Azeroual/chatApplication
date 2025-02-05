import Notification from '../models/notification.model.js';
import { io } from '../lib/socket.js';
// 1. Get all notifications for the current user
export const getNotifications = async (req, res) => {
  const userId = req.user._id;
  console.log("notidication of user with id ",userId);
  

  try {
    // Find all notifications for the current user
    const notifications = await Notification.find({ userId: userId,read:false })
      .sort({ timestamp: -1 }) // Sort by most recent first
      .populate('userId', 'fullName profilePic'); // Populate user details

    // Return the notifications
    console.log("notification",notifications);
    
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error in getNotifications:', error.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// 2. Mark a notification as read
export const markNotificationAsRead = async (req, res) => {
    const { id: notificationId } = req.params;
    const userId = req.user._id;
  
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId }, // Ensure the notification belongs to the user
        { read: true },
        { new: true } // Return the updated document
      );
  
      if (!notification) {
        return res.status(404).json({ message: "Notification not found." });
      }
  
      res.status(200).json(notification);
    } catch (error) {
      console.error("Error in markNotificationAsRead:", error.message);
      res.status(500).json({ message: "Internal server error." });
    }
  };

// 3. Delete a notification
export const deleteNotification = async (req, res) => {
  const { notificationId } = req.params;
  const userId = req.user._id;

  try {
    // Find and delete the notification
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      user: userId,
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    // Emit the deletion to the user
    io.to(userId.toString()).emit('notificationDeleted', notificationId);

    // Return success response
    res.status(200).json({ message: 'Notification deleted successfully.' });
  } catch (error) {
    console.error('Error in deleteNotification:', error.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// 4. Create a new notification (for internal use, e.g., when a user receives a message or group invite)
export const createNotification = async (userId, content, type) => {
  try {
    // Validate the type against the enum values
    const validTypes = ["new_message", "reaction", "message_forwarded"];
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid notification type: ${type}`);
    }

    // Create a new notification
    const newNotification = new Notification({
      userId, // Use `userId` instead of `user`
      content, // Ensure `content` is provided
      type, // Ensure `type` is a valid enum value
    });

    // Save the notification to the database
    await newNotification.save();

    // Emit the new notification to the user
    io.to(userId.toString()).emit("newNotification", newNotification);

    return newNotification;
  } catch (error) {
    console.error("Error in createNotification:", error.message);
    throw error;
  }
};