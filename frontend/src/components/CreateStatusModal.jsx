import { useState, useRef } from "react";
import { Image, Video, Mic, File, X, Smile, ChevronDown } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import toast from "react-hot-toast";
import { useChatStore } from "../store/useChatStore";

const CreateStatusModal = ({ onClose }) => {
  const [statusText, setStatusText] = useState("");
  const [filePreview, setFilePreview] = useState(null); // For image, video, or file preview
  const [fileType, setFileType] = useState(null); // To track the type of file (image, video, audio, file)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileOptions, setShowFileOptions] = useState(false);
  const [background, setBackground] = useState(""); // For custom backgrounds
  const fileInputRef = useRef(null);
  const { createStatus } = useChatStore();

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("Selected file type:", file.type); // Debugging

    // Validate file type
    if (fileType === "image" && !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (fileType === "video" && !file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }
    if (fileType === "audio" && !file.type.startsWith("audio/")) {
      toast.error("Please select an audio file");
      return;
    }

    // Preview the file
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Remove file preview
  const removeFilePreview = () => {
    setFilePreview(null);
    setFileType(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle emoji selection
  const handleEmojiClick = (emojiObject) => {
    setStatusText((prevText) => prevText + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  // Handle file type selection
  const handleFileTypeChange = (type) => {
    setFileType(type);
    setShowFileOptions(false);
    fileInputRef.current?.click();
  };

  // Handle status creation
  const handleCreate = async (e) => {
    e.preventDefault();

    // Validate that at least one field is present
    if (!statusText.trim() && !filePreview) {
      toast.error("Please enter a status or attach a file.");
      return;
    }

    try {
      const formData = new FormData();

      // Append text if it exists
      if (statusText.trim()) {
        formData.append("text", statusText.trim());
      }

      // Append file if it exists
      if (filePreview && fileInputRef.current?.files[0]) {
        const file = fileInputRef.current.files[0];
        if (fileType === "image") {
          formData.append("media", file);
        } else if (fileType === "video") {
          formData.append("media", file);
        } else if (fileType === "audio") {
          formData.append("music", file);
        }
      }

      // Append background if it exists
      if (background) {
        formData.append("background", background);
      }

      // Log FormData entries for debugging
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Call the onCreate function with the form data
      await createStatus(formData);

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error creating status:", error);
      toast.error("Failed to create status");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-lg w-96 overflow-y-auto max-h-[80vh]">
        <h2 className="font-semibold mb-4">Create Status</h2>

        {/* File Preview */}
        {filePreview && (
          <div className="mb-4">
            <label className="block font-semibold mb-2">Preview</label>
            {fileType === "image" && (
              <img
                src={filePreview}
                alt="Media Preview"
                className="w-full rounded-lg"
              />
            )}
            {fileType === "video" && (
              <video src={filePreview} controls className="w-full rounded-lg" />
            )}
            {fileType === "audio" && (
              <audio src={filePreview} controls className="w-full" />
            )}
            <button
              onClick={removeFilePreview}
              className="mt-2 btn btn-sm btn-outline"
            >
              Remove File
            </button>
          </div>
        )}

        {/* Text Input */}
        <textarea
          className="w-full p-2 border border-base-300 rounded-lg mb-4"
          placeholder="What's on your mind?"
          value={statusText}
          onChange={(e) => setStatusText(e.target.value)}
          style={{ backgroundColor: background }} // Apply background color here
        />

        {/* Emoji Picker */}
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            className="btn btn-circle btn-sm btn-ghost text-zinc-400 hover:text-primary"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile size={20} />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-16 left-4 z-50">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>

        {/* Background Selector */}
        <div className="mb-4">
          <div className="flex gap-2">
            {["#FF5733", "#33FF57", "#3357FF", "#F1C40F"].map((color) => (
              <button
                key={color}
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: color }}
                onClick={() => setBackground(color)}
              />
            ))}
          </div>
        </div>

        {/* File Options Dropdown */}
        <div className="relative mb-4">
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={() => setShowFileOptions(!showFileOptions)}
          >
            <ChevronDown size={16} className="mr-2" />
            Attach File
          </button>

          {/* File Options Menu */}
          {showFileOptions && (
            <div className="absolute bottom-12 right-0 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50 w-48">
              <ul className="py-2">
                <li>
                  <button
                    type="button"
                    className="w-full px-4 py-2 flex items-center gap-2 hover:bg-base-200"
                    onClick={() => handleFileTypeChange("image")}
                  >
                    <Image size={16} />
                    <span>Image</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="w-full px-4 py-2 flex items-center gap-2 hover:bg-base-200"
                    onClick={() => handleFileTypeChange("video")}
                  >
                    <Video size={16} />
                    <span>Video</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="w-full px-4 py-2 flex items-center gap-2 hover:bg-base-200"
                    onClick={() => handleFileTypeChange("audio")}
                  >
                    <Mic size={16} />
                    <span>Audio</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept={
            fileType === "image"
              ? "image/*"
              : fileType === "audio"
              ? "audio/*"
              : fileType === "video"
              ? "video/*"
              : "*"
          }
        />

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleCreate}
            disabled={!statusText.trim() && !filePreview}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateStatusModal;