import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  selectedGroup: null, // Add selectedGroup state
  isUsersLoading: false,
  isMessagesLoading: false,
  notifications: [],
  isNotificationsLoading: false,
  statuses: [],
  isStatusesLoading: false,
  groups: [], // Add groups state
  isGroupsLoading: false, // Add loading state for groups

  // Fetch users for the sidbar
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Fetch messages between the current user and another user
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Send a message
  sendMessage: async (formData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  // Forward a message
  forwardMessage: async (messageId, receiverId) => {
    try {
      const res = await axiosInstance.post(`/messages/forward/${messageId}`, { receiverId });
      const newMessage = res.data;

      const { selectedUser, messages } = get();
      if (selectedUser._id === receiverId) {
        set({ messages: [...messages, newMessage] });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // Update a message
  updateMessage: async (messageId, text) => {
    try {
      const res = await axiosInstance.patch(`/messages/update/${messageId}`, { text });
      const updatedMessage = res.data;

      const { messages } = get();
      const updatedMessages = messages.map((message) =>
        message._id === updatedMessage._id ? updatedMessage : message
      );
      set({ messages: updatedMessages });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // Delete a message
  deleteMessage: async (messageId) => {
    try {
      await axiosInstance.delete(`/messages/delete/${messageId}`);

      const { messages } = get();
      const updatedMessages = messages.filter((message) => message._id !== messageId);
      set({ messages: updatedMessages });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // Add a reaction to a message
  addReaction: async (messageId, emoji) => {
    try {
      const { authUser } = useAuthStore.getState();
      const res = await axiosInstance.post(`/messages/react/${messageId}`, {
        emoji,
        userId: authUser._id,
      });
      const reactedMessage = res.data;

      const { messages } = get();
      const updatedMessages = messages.map((message) =>
        message._id === reactedMessage._id ? reactedMessage : message
      );
      set({ messages: updatedMessages });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // Remove a reaction from a message
  removeReaction: async (messageId, reaction) => {
    try {
      const res = await axiosInstance.delete(`/messages/react/${messageId}`, { data: { reaction } });
      const updatedMessage = res.data;

      const { messages } = get();
      const updatedMessages = messages.map((message) =>
        message._id === updatedMessage._id ? updatedMessage : message
      );
      set({ messages: updatedMessages });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // Fetch notifications for the current user
  fetchNotifications: async () => {
    set({ isNotificationsLoading: true });
    try {
      const res = await axiosInstance.get("/notifications");
      set({ notifications: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isNotificationsLoading: false });
    }
  },

  // Mark a notification as read
  markNotificationAsRead: async (notificationId) => {
    try {
      const res = await axiosInstance.patch(`/notifications/${notificationId}/read`);
      const updatedNotification = res.data;

      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === updatedNotification._id ? updatedNotification : n
        ),
      }));
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  },

  // Delete a notification
  deleteNotification: async (notificationId) => {
    try {
      await axiosInstance.delete(`/api/notifications/${notificationId}`);

      set((state) => ({
        notifications: state.notifications.filter((n) => n._id !== notificationId),
      }));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // Fetch statuses for the current user
  fetchStatuses: async () => {
    set({ isStatusesLoading: true });
    try {
      const res = await axiosInstance.get("/status");
      set({ statuses: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isStatusesLoading: false });
    }
  },

  // Create a new status
  createStatus: async (formData) => {
    console.log("formaData", formData);
    
    try {
      // Send the request to the backend
      const res = await axiosInstance.post("/status", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set content type for file uploads
        },
      });
  
      // Get the newly created status from the response
      const newStatus = res.data;
  
      // Update the state with the new status
      set((state) => ({
        statuses: [newStatus, ...state.statuses],
      }));
  
      // Show success message
      toast.success("Status created successfully!");
    } catch (error) {
      console.error("Error creating status:", error);
      toast.error(error.response?.data?.message || "Failed to create status");
    }
  },

  // Fetch groups for the current user
  fetchGroups: async () => {
    set({ isGroupsLoading: true });
    try {
      const res = await axiosInstance.get("/groups");
      console.log(res.data);
      
      set({ groups: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  // Create a new group
  createGroup: async (name, description, members, groupImage) => {
    try {
      const res = await axiosInstance.post("/groups", { name, description, members, groupImage });
      const newGroup = res.data;
      console.log(newGroup);
      
  
      set((state) => ({
        groups: [newGroup, ...state.groups],
      }));
  
      toast.success("Group created successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // Send a message to a group
  sendGroupMessage: async (groupId,formData) => {
    try {
      const res = await axiosInstance.post(`/groups/${groupId}/messages`,formData);
      const newMessage = res.data;
      console.log("new Message",newMessage);
      

      // Update messages state if the group is selected
      const { selectedGroup, messages } = get();
      if (selectedGroup?._id === groupId) {
        set({ messages: [...messages, newMessage] });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // Fetch messages for a group
  getGroupMessages: async (groupId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/groups/${groupId}/messages`);
      console.log("messages",res.data);
      
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Add members to a group
  addMembersToGroup: async (groupId, members) => {
    try {
      const res = await axiosInstance.post(`/groups/${groupId}/add-members`, { members });
      const updatedGroup = res.data;

      set((state) => ({
        groups: state.groups.map((group) =>
          group._id === updatedGroup._id ? updatedGroup : group
        ),
      }));

      toast.success("Members added successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // Remove members from a group
  removeMembersFromGroup: async (groupId, members) => {
    try {
      const res = await axiosInstance.post(`/groups/${groupId}/remove-members`, { members });
      const updatedGroup = res.data;

      set((state) => ({
        groups: state.groups.map((group) =>
          group._id === updatedGroup._id ? updatedGroup : group
        ),
      }));

      toast.success("Members removed successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // Leave a group
  leaveGroup: async (groupId) => {
    try {
      await axiosInstance.post(`/groups/${groupId}/leave`);

      set((state) => ({
        groups: state.groups.filter((group) => group._id !== groupId),
      }));

      toast.success("You have left the group");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  replyToStatus: async (statusId, text) => {
    try {
      const { authUser } = useAuthStore.getState();
      const res = await axiosInstance.post("/status/reply", {
        statusId,
        text,
        senderId: authUser._id,
      },{
        headers: {
          "Content-Type": "application/json",
        },
      });

      const newMessage = res.data;

      // Update the messages state if the receiver is the selected user
      const { selectedUser, messages } = get();
      if (selectedUser?._id === newMessage.receiverId) {
        set({ messages: [...messages, newMessage] });
      }

      toast.success("Reply sent successfully!");
    } catch (error) {
      console.error("Error replying to status:", error);
      toast.error(error.response?.data?.message || "Failed to send reply");
    }
  },

  // Subscribe to new messages via WebSocket
  subscribeToMessages: () => {
    const { selectedUser, selectedGroup } = get();
    const socket = useAuthStore.getState().socket;
  
    if (!socket) return;
  
    // Listen for new messages from the selected user
    if (selectedUser) {
      socket.on("newMessage", (newMessage) => {
        const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
        if (!isMessageSentFromSelectedUser) return;
  
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      });
    }
  
    // Listen for new messages in the selected group
    if (selectedGroup) {
      socket.on("newGroupMessage", (newMessage) => {
        const isMessageSentToSelectedGroup = newMessage.groupId === selectedGroup._id;
        if (!isMessageSentToSelectedGroup) return;
  
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      });
    }
  
    // Listen for message updates
    socket.on("messageUpdated", (updatedMessage) => {
      set((state) => ({
        messages: state.messages.map((message) =>
          message._id === updatedMessage._id ? updatedMessage : message
        ),
      }));
    });
  
    // Listen for message deletions
    socket.on("messageDeleted", (deletedMessageId) => {
      set((state) => ({
        messages: state.messages.map((message) =>
          message._id === deletedMessageId ? { ...message, isDeleted: true } : message
        ),
      }));
    });
  
    // Listen for message reactions
    socket.on("messageReacted", (reactedMessage) => {
      set((state) => ({
        messages: state.messages.map((message) =>
          message._id === reactedMessage._id ? reactedMessage : message
        ),
      }));
    });
  },

  // Unsubscribe from WebSocket events
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
  
    socket.off("newMessage");
    socket.off("newGroupMessage");
    socket.off("messageUpdated");
    socket.off("messageDeleted");
    socket.off("messageReacted");
  },
  // Set the selected user
  setSelectedUser: (selectedUser) => set({ selectedUser }),
  setSelectGroup: (selectedGroup) => set({ selectedGroup }),
}));