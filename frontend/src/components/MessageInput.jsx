import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Smile, Mic, Video, File, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [filePreview, setFilePreview] = useState(null); // For image, video, or file preview
  const [fileType, setFileType] = useState(null); // To track the type of file (image, video, audio, file)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileOptions, setShowFileOptions] = useState(false);
  const fileInputRef = useRef(null);
  const { selectedUser, selectedGroup, sendMessage, sendGroupMessage } = useChatStore();

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

  // Handle sending the message
  const handleSendMessage = async (e) => {
    e.preventDefault();
  
    // Validate that at least one field is present
    if (!text.trim() && !filePreview) {
      toast.error("Please enter a message or attach a file.");
      return;
    }
  
    try {
      const formData = new FormData();
  
      // Append text if it exists
      if (text.trim()) {
        formData.append("text", text.trim()); // Ensure text is appended as a string
      }
  
      // Append file if it exists
      if (filePreview && fileInputRef.current?.files[0]) {
        const file = fileInputRef.current.files[0];
        if (fileType === "image") {
          formData.append("image", file);
        } else if (fileType === "video") {
          formData.append("video", file);
        } else if (fileType === "audio") {
          formData.append("audio", file);
        } else if (fileType === "file") {
          formData.append("file", file);
        }
      }
  
      console.log("Sending message with data:", formData); // Debugging
  
      // Log FormData entries for debugging
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }
  
      // Send message to user or group based on selection
      if (selectedUser) {
        console.log(formData);
        
        await sendMessage(formData);
      } else if (selectedGroup) {
        console.log(formData);
        
        await sendGroupMessage(selectedGroup._id, formData);
      }
  
      // Clear form
      setText("");
      setFilePreview(null);
      setFileType(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };
  // Handle emoji selection
  const handleEmojiClick = (emojiObject) => {
    setText((prevText) => prevText + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  // Handle file type selection
  const handleFileTypeChange = (type) => {
    setFileType(type);
    setShowFileOptions(false);
    fileInputRef.current?.click();
  };

  return (
    <div className="p-4 w-full">
      {filePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            {fileType === "image" && (
              <img
                src={filePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              />
            )}
            {fileType === "video" && (
              <video
                src={filePreview}
                controls
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              />
            )}
            {fileType === "audio" && (
              <audio
                src={filePreview}
                controls
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              />
            )}
            {fileType === "file" && (
              <div className="w-20 h-20 flex items-center justify-center bg-base-200 rounded-lg border border-zinc-700">
                <File size={24} />
              </div>
            )}
            <button
              onClick={removeFilePreview}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          {/* Emoji Picker Button */}
          <button
            type="button"
            className="btn btn-circle btn-sm btn-ghost text-zinc-400 hover:text-primary"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile size={20} />
          </button>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-16 left-4 z-50">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}

          {/* Text Input */}
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* File Options Dropdown */}
          <div className="relative">
            <button
              type="button"
              className="btn btn-circle btn-sm btn-ghost text-zinc-400 hover:text-primary"
              onClick={() => setShowFileOptions(!showFileOptions)}
            >
              <ChevronDown size={20} />
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
                      onClick={() => handleFileTypeChange("audio")}
                    >
                      <Mic size={16} />
                      <span>Audio</span>
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
                      onClick={() => handleFileTypeChange("file")}
                    >
                      <File size={16} />
                      <span>File</span>
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
        </div>

        {/* Send Button */}
        <button
          type="submit"
          className="btn btn-sm btn-circle btn-primary"
          disabled={!text.trim() && !filePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;