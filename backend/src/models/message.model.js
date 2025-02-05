import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema(
  {
    emoji: {
      type: String,
      required: true, // The emoji itself (e.g., "😊")
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // The user who reacted
    },
  },
  { timestamps: true } // Track when the reaction was added
);

const statusReplySchema = new mongoose.Schema({
  statusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Status",
    required: true, // The ID of the status being replied to
  },
  text: {
    type: String, // The text content of the status
  },
  image: {
    type: String, // The image URL of the status (if any)
  },
  video: {
    type: String, // The video URL of the status (if any)
  },
  audio: {
    type: String, // The audio URL of the status (if any)
  },
  background: {
    type: String, // The background color or style of the status (if any)
  },
  createdAt: {
    type: Date, // The creation date of the status
  },
  user: {
    fullName: {
      type: String, // The full name of the user who created the status
    },
    profilePic: {
      type: String, // The profile picture URL of the user who created the status
    },
  },
});

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    video: {
      type: String,
    },
    audio: {
      type: String,
    },
    file: {
      type: String,
    },
    isForwarded: {
      type: Boolean,
      default: false,
    },
    originalSenderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    forwardedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    reactions: {
      type: [reactionSchema],
      default: [],
    },
    statusReply: {
      type: statusReplySchema, // Add the statusReply field
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;