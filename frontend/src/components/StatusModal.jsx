import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
// components/StatusModal.js
const StatusModal = ({ status, onClose }) => {
  const [reply, setReply] = useState("");

  const handleReply = async () => {
    if (!reply.trim()) {
      console.log("Please enter a reply");
      return;
    }

    await useChatStore.getState().replyToStatus(status._id, reply);
    onClose(); // Close the modal after sending the reply
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-lg w-96 max-w-full overflow-y-auto max-h-[60vh]">
        {/* User Info */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src={status.userId.profilePic}
            alt={status.userId.fullName}
            className="size-12 rounded-full"
          />
          <div>
            <p className="font-semibold">{status.userId.fullName}</p>
            <small className="text-base-content/50">
              {new Date(status.createdAt).toLocaleTimeString()}
            </small>
          </div>
        </div>

        {/* Status Content */}
        <div className="mb-4">
          {/* Text with Background */}
          {status.text && (
            <p
              className="mb-4 p-2 rounded-lg"
              style={status.background ? { backgroundColor: status.background, color: "white" } : {}}
            >
              {status.text}
            </p>
          )}

          {/* Image */}
          {status.image && (
            <img
              src={status.image}
              alt="Status Image"
              className="w-fit rounded-lg mb-4"
            />
          )}

          {/* Video */}
          {status.video && (
            <video
              src={status.video}
              controls
              className="w-full rounded-lg mb-4"
            />
          )}

          {/* Audio */}
          {status.audio && (
            <audio src={status.audio} controls className="w-full mb-4" />
          )}
        </div>

        {/* Reply Input */}
        <textarea
          className="w-full p-2 border border-base-300 rounded-lg mb-4"
          placeholder="Type a reply..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <button className="btn btn-outline btn-primary" onClick={handleReply}>
            Send
          </button>
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;