import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { MoreVertical, Edit, Trash2, Forward, Smile, Copy } from "lucide-react";
import Modal from "./Modal";
import UserList from "./UserList";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    selectedGroup,
    subscribeToMessages,
    unsubscribeFromMessages,
    deleteMessage,
    updateMessage,
    forwardMessage,
    addReaction,
    socket,
    users,
    sendMessage,
    sendGroupMessage,
    getGroupMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [forwardModalOpen, setForwardModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [updatedText, setUpdatedText] = useState("");
  const [reactionPickerOpen, setReactionPickerOpen] = useState(null);

  // Fetch messages when selectedUser or selectedGroup changes
  useEffect(() => {
    if (selectedUser || selectedGroup) {
      getMessages(selectedUser?._id || selectedGroup?._id);
    }
    if (selectedGroup) {
      getGroupMessages(selectedGroup._id);
    }
    if (selectedUser || selectedGroup) {
      subscribeToMessages();
    }
    return () => unsubscribeFromMessages();
  }, [
    selectedUser,
    selectedGroup,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
    getGroupMessages,
  ]);

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle WebSocket events
  useEffect(() => {
    if (authUser && socket) {
      socket.emit("joinRoom", authUser._id);
      socket.on("newNotification", (notification) => {
        console.log("New notification:", notification);
      });
      return () => {
        socket.off("newNotification");
      };
    }
  }, [authUser, socket]);

  const handleMenuClick = (messageId) => {
    setMenuOpen(menuOpen === messageId ? null : messageId);
  };

  const handleReactionClick = (messageId) => {
    setReactionPickerOpen(reactionPickerOpen === messageId ? null : messageId);
  };

  const handleEmojiClick = (emojiObject, messageId) => {
    const emoji = emojiObject.emoji;
    addReaction(messageId, emoji);
    setReactionPickerOpen(null);
  };

  const handleUpdateClick = (message) => {
    setSelectedMessage(message);
    setUpdatedText(message.text);
    setUpdateModalOpen(true);
  };

  const handleDeleteClick = (message) => {
    setSelectedMessage(message);
    setDeleteModalOpen(true);
  };

  const handleForwardClick = (message) => {
    setSelectedMessage(message);
    setForwardModalOpen(true);
  };

  const handleUpdateMessage = async () => {
    if (!selectedMessage) return;
    try {
      await updateMessage(selectedMessage._id, updatedText);
      toast.success("Message updated");
      setUpdateModalOpen(false);
    } catch (error) {
      toast.error("Failed to update message");
    }
  };

  const handleDeleteMessage = async () => {
    if (!selectedMessage) return;
    try {
      await deleteMessage(selectedMessage._id);
      toast.success("Message deleted");
      setDeleteModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const handleForwardMessage = async (userId) => {
    if (!selectedMessage) return;
    try {
      await forwardMessage(selectedMessage._id, userId);
      toast.success("Message forwarded");
      setForwardModalOpen(false);
    } catch (error) {
      toast.error("Failed to forward message");
    }
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  const findSender = (senderId) => {
    return users.find((user) => user._id === senderId);
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      {/* Chat Header */}
      <ChatHeader
        name={selectedUser?.fullName || selectedGroup?.name}
        profilePic={selectedUser?.profilePic || selectedGroup?.profilePic}
        isGroup={!!selectedGroup}
        members={selectedGroup?.members}
      />

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser
                      ? selectedUser.profilePic || "/avatar.png"
                      : findSender(message.senderId)?.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1 flex items-center gap-2">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
              {/* Three-dot menu */}
              <div className="relative">
                <button
                  onClick={() => handleMenuClick(message._id)}
                  className="p-1 rounded-full hover:bg-base-300 transition-colors"
                >
                  <MoreVertical className="size-4 text-base-content/70" />
                </button>

                {/* Dropdown menu */}
                {menuOpen === message._id && (
                  <div className="absolute right-0 mt-2 w-48 bg-base-100 border border-base-300 rounded-lg shadow-lg z-10">
                    <ul className="py-1">
                      <li>
                        <button
                          onClick={() => handleUpdateClick(message)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-base-content/80 hover:bg-base-200 transition-colors"
                        >
                          <Edit className="size-4" />
                          <span>Edit</span>
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleDeleteClick(message)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-base-content/80 hover:bg-base-200 transition-colors"
                        >
                          <Trash2 className="size-4" />
                          <span>Delete</span>
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleForwardClick(message)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-base-content/80 hover:bg-base-200 transition-colors"
                        >
                          <Forward className="size-4" />
                          <span>Forward</span>
                        </button>
                      </li>
                      <li>
                        {message.text && (
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(message.text);
                              toast.success("Message copied to clipboard");
                              setMenuOpen(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-base-content/80 hover:bg-base-200 transition-colors"
                          >
                            <Copy className="size-4" />
                            <span>Copy Text</span>
                          </button>
                        )}
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="chat-bubble flex flex-col relative p-3">
              {/* Display status reply if it exists */}
              {message.statusReply && (
                <div className="bg-base-200 p-4 rounded-lg mb-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={message.statusReply.user.profilePic}
                      alt={message.statusReply.user.fullName}
                      className="size-8 rounded-full"
                    />
                    <p className="font-semibold">
                      {message.statusReply.user.fullName}
                    </p>
                  </div>
                  <p className="text-sm text-base-content/70">
                    {message.statusReply.text}
                  </p>
                  {message.statusReply.image && (
                    <img
                      src={message.statusReply.image}
                      alt="Status Image"
                      className="w-fit rounded-lg mt-2"
                    />
                  )}
                  {message.statusReply.video && (
                    <video
                      src={message.statusReply.video}
                      controls
                      className="w-full rounded-lg mt-2"
                    />
                  )}
                  {message.statusReply.audio && (
                    <audio
                      src={message.statusReply.audio}
                      controls
                      className="w-full mt-2"
                    />
                  )}
                </div>
              )}

              {/* Display message content */}
              {message.deleted ? (
                <p className="text-gray-500 italic">
                  This message was deleted.
                </p>
              ) : (
                <>
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2"
                    />
                  )}
                  {message.video && (
                    <video
                      src={message.video}
                      controls
                      className="sm:max-w-[200px] rounded-md mb-2"
                    />
                  )}
                  {message.file && (
                    <a
                      href={message.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Download File
                    </a>
                  )}
                  {message.text && <p className="mr-8">{message.text}</p>}
                </>
              )}

              {/* Display reactions */}
              {message.reactions?.length > 0 && (
                <div className="flex gap-1 mt-1 z-50">
                  {message.reactions.map((reaction, index) => (
                    <span key={index} className="text-sm">
                      {reaction.emoji}
                    </span>
                  ))}
                </div>
              )}

              {/* Reaction picker */}
              {reactionPickerOpen === message._id && (
                <div className="absolute bottom-8 right-0 z-50">
                  <EmojiPicker
                    onEmojiClick={(emojiObject) =>
                      handleEmojiClick(emojiObject, message._id)
                    }
                  />
                </div>
              )}

              {/* Reaction button */}
              <div className="absolute bottom-1 right-1">
                <button
                  onClick={() => handleReactionClick(message._id)}
                  className="p-1 rounded-full hover:bg-base-300 transition-colors"
                >
                  <Smile className="size-4 text-base-content/70" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={(text, file) => {
          if (selectedUser) {
            sendMessage({ text, file, receiverId: selectedUser._id });
          } else if (selectedGroup) {
            sendGroupMessage({ text, file, groupId: selectedGroup._id });
          }
        }}
      />

      {/* Update Modal */}
      <Modal isOpen={updateModalOpen} onClose={() => setUpdateModalOpen(false)}>
        <h2 className="text-lg font-bold mb-4">Edit Message</h2>
        <textarea
          value={updatedText}
          onChange={(e) => setUpdatedText(e.target.value)}
          className="w-full p-2 border rounded-lg mb-4"
          rows={3}
        />
        <button
          onClick={handleUpdateMessage}
          className="btn btn-primary w-full"
        >
          Save Changes
        </button>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <h2 className="text-lg font-bold mb-4">Delete Message</h2>
        <p className="mb-4">Are you sure you want to delete this message?</p>
        <div className="flex gap-2">
          <button
            onClick={() => setDeleteModalOpen(false)}
            className="btn btn-ghost flex-1"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteMessage}
            className="btn btn-error flex-1"
          >
            Delete
          </button>
        </div>
      </Modal>

      {/* Forward Modal */}
      <Modal
        isOpen={forwardModalOpen}
        onClose={() => setForwardModalOpen(false)}
      >
        <h2 className="text-lg font-bold mb-4">Forward Message</h2>
        <UserList onSelectUser={handleForwardMessage} />
      </Modal>
    </div>
  );
};

export default ChatContainer;