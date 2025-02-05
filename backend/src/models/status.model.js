import mongoose from "mongoose";

// Reaction schema (for reactions to statuses)
const reactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    emoji: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const statusSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      default: "", // Optional text
    },
    image: {
      type: String, // URL to the uploaded image
      default: "",
    },
    video: {
      type: String, // URL to the uploaded video
      default: "",
    },
    audio: {
      type: String, // URL to the uploaded audio
      default: "",
    },
    background: {
      type: String, // Background color or image URL
      default: "",
    },
    expiresAt: {
      type: Date,
      default: () => Date.now() + 24 * 60 * 60 * 1000, // Expires in 24 hours
    },
    isForwarded: {
      type: Boolean,
      default: false, // Indicates if the status is forwarded
    },
    originalSenderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the original sender (if forwarded)
    },
    forwardedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Status", // Reference to the original status (if forwarded)
    },
    isDeleted: {
      type: Boolean,
      default: false, // Soft delete flag
    },
    reactions: {
      type: [reactionSchema], // Array of reactions
      default: [],
    },
  },
  { timestamps: true }
);

const Status = mongoose.model("Status", statusSchema);

export default Status;