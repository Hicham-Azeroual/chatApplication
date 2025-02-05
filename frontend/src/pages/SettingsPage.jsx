import { useState } from "react";
import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send, Image, Video, File, Mic, Smile, Forward, Star, Lock } from "lucide-react";

// Dynamic preview messages with various types and features
const PREVIEW_MESSAGES = [
  {
    id: 1,
    sender: "user1",
    type: "text",
    content: "Hey! How's it going?",
    status: "read",
    timestamp: "12:00 PM",
    reactions: [{ user: "user2", reaction: "like" }],
    replies: [],
    starredBy: ["user1"],
  },
  {
    id: 2,
    sender: "user2",
    type: "image",
    content: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRB9JvZ-YJX9XXmX7N5RdvZsjmKUW2IRDXbSA&s",
    status: "delivered",
    timestamp: "12:01 PM",
    reactions: [],
    fileMetadata: {
      fileName: "image.png",
      fileSize: 1024,
      mimeType: "image/png",
    },
    forwardedFrom: "user3",
  },
  {
    id: 3,
    sender: "user1",
    type: "video",
    content: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    status: "sent",
    timestamp: "12:02 PM",
    reactions: [],
    fileMetadata: {
      fileName: "video.mp4",
      fileSize: 2048,
      mimeType: "video/mp4",
    },
  },
  {
    id: 4,
    sender: "user2",
    type: "document",
    content: "https://example.com/document.pdf",
    status: "failed",
    timestamp: "12:03 PM",
    reactions: [],
    fileMetadata: {
      fileName: "document.pdf",
      fileSize: 512,
      mimeType: "application/pdf",
    },
  },
  {
    id: 5,
    sender: "user1",
    type: "audio",
    content: "https://example.com/audio.mp3",
    status: "read",
    timestamp: "12:04 PM",
    reactions: [],
    fileMetadata: {
      fileName: "audio.mp3",
      fileSize: 256,
      mimeType: "audio/mp3",
    },
  },
  {
    id: 6,
    sender: "user2",
    type: "sticker",
    content: "https://ih1.redbubble.net/image.5308098802.0671/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg",
    status: "delivered",
    timestamp: "12:05 PM",
    reactions: [],
  },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="min-h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        {/* Theme Selection */}
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="text-sm text-base-content/70">Choose a theme for your chat interface</p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`
                group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
                ${theme === t ? "bg-base-200" : "hover:bg-base-200/50"}
              `}
              onClick={() => setTheme(t)}
            >
              <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                  <div className="rounded bg-primary"></div>
                  <div className="rounded bg-secondary"></div>
                  <div className="rounded bg-accent"></div>
                  <div className="rounded bg-neutral"></div>
                </div>
              </div>
              <span className="text-[11px] font-medium truncate w-full text-center">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>

        {/* Preview Section */}
        <h3 className="text-lg font-semibold mb-3">Preview</h3>
        <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
          <div className="p-4 bg-base-200">
            <div className="max-w-lg mx-auto">
              {/* Mock Chat UI */}
              <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                      H
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Hicham</h3>
                      <p className="text-xs text-base-content/70">Online</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                  {PREVIEW_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user1" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`
                          max-w-[80%] rounded-xl p-3 shadow-sm
                          ${message.sender === "user1" ? "bg-primary text-primary-content" : "bg-base-200"}
                        `}
                      >
                        {/* Message Content */}
                        {message.type === "text" && (
                          <p className="text-sm">{message.content}</p>
                        )}
                        {message.type === "image" && (
                          <img
                            src={message.content}
                            alt="Image"
                            className="rounded-lg w-48 h-auto" // Adjusted to be rectangular
                          />
                        )}
                        {message.type === "video" && (
                          <video controls className="rounded-lg w-48 h-auto">
                            <source src={message.content} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        )}
                        {message.type === "document" && (
                          <div className="flex items-center gap-2">
                            <File size={16} />
                            <a
                              href={message.content}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm underline"
                            >
                              {message.fileMetadata.fileName}
                            </a>
                          </div>
                        )}
                        {message.type === "audio" && (
                          <audio controls className="w-full">
                            <source src={message.content} type="audio/mp3" />
                            Your browser does not support the audio tag.
                          </audio>
                        )}
                        {message.type === "sticker" && (
                          <img
                            src={message.content}
                            alt="Sticker"
                            className="w-16 h-16"
                          />
                        )}

                        {/* Message Metadata */}
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-[10px] text-base-content/70">
                            {message.timestamp}
                          </p>
                          {message.status === "read" && (
                            <span className="text-[10px] text-green-500">Read</span>
                          )}
                          {message.status === "delivered" && (
                            <span className="text-[10px] text-blue-500">Delivered</span>
                          )}
                          {message.status === "failed" && (
                            <span className="text-[10px] text-red-500">Failed</span>
                          )}
                        </div>

                        {/* Reactions */}
                        {message.reactions.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {message.reactions.map((reaction, index) => (
                              <span key={index} className="text-xs">
                                {reaction.reaction === "like" && "👍"}
                                {reaction.reaction === "love" && "❤️"}
                                {reaction.reaction === "laugh" && "😂"}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Forwarded Message */}
                        {message.forwardedFrom && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-base-content/70">
                            <Forward size={12} />
                            <span>Forwarded</span>
                          </div>
                        )}

                        {/* Starred Message */}
                        {message.starredBy?.length > 0 && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-yellow-500">
                            <Star size={12} />
                            <span>Starred</span>
                          </div>
                        )}

                        {/* Encryption */}
                        {message.encryption?.isEncrypted && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-base-content/70">
                            <Lock size={12} />
                            <span>Encrypted</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-base-300 bg-base-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input input-bordered flex-1 text-sm h-10"
                      placeholder="Type a message..."
                      value="This is a preview"
                      readOnly
                    />
                    <button className="btn btn-primary h-10 min-h-0">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;