import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Bell, CircleDashed, Search, Plus, Group } from "lucide-react";
import StatusModal from "./StatusModal";
import CreateStatusModal from "./CreateStatusModal";
import CreateGroupModal from "./CreateGroupModal";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    notifications,
    fetchNotifications,
    markNotificationAsRead,
    fetchStatuses,
    statuses,
    createStatus,
    groups,
    fetchGroups,
    createGroup,
    selectedGroup,
    setSelectGroup,
  } = useChatStore();

  const { onlineUsers, authUser } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isCreateStatusOpen, setIsCreateStatusOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("users"); // State to manage active tab

  // Fetch users, notifications, statuses, and groups on mount
  useEffect(() => {
    getUsers();
    fetchNotifications();
    fetchStatuses();
    fetchGroups();
  }, [getUsers, fetchNotifications, fetchStatuses, fetchGroups]);

  // Filter users based on online status and search query
  const filteredUsers = users.filter((user) => {
    if (showOnlineOnly && !onlineUsers.includes(user._id)) return false;
    if (searchQuery) {
      return user.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  // Filter groups based on search query
  const filteredGroups = groups.filter((group) => {
    if (searchQuery) {
      return group.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  console.log("filteredGroups", filteredGroups);
    // the status if expire or not voila the model of my status :
/*     import mongoose from "mongoose";
    
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
    
    export default Status;  domner le code to do this filtre to affiche just the status not expired*/

    const filteredStatuses = statuses.filter((status) => {
      const now = new Date();
      const expiresAt = new Date(status.expiresAt);
      return now < expiresAt;
    })
    


  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Handle status creation


  // Handle group creation
  const handleCreateGroup = async (name, description, members, groupImage) => {
    await createGroup(name, description, members, groupImage);
    fetchGroups();
  };

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium hidden lg:block">Contacts</span>
          </div>

          {/* Status Icon */}
          <div className="relative">
            <button
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className="p-2 rounded-full hover:bg-base-300 transition-colors relative"
            >
              <CircleDashed className="size-6 text-base-content/70" />
            </button>

            {/* Status Dropdown */}
            {isStatusOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50 overflow-y-auto">
                <div className="p-4 overflow-y-auto max-h-[60vh]">
                  <h3 className="font-semibold mb-2">Status</h3>
                  <button
                    onClick={() => setIsCreateStatusOpen(true)}
                    className="w-full p-2 mb-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Create Status
                  </button>
                  <ul className="space-y-2">
                    {filteredStatuses.length === 0 ? (
                      <p className="text-sm text-base-content/70">
                        No statuses available
                      </p>
                    ) : (
                      filteredStatuses.map((status) => (
                        <li
                          key={status._id}
                          className="p-2 rounded-lg bg-base-200 hover:bg-base-300 cursor-pointer"
                          onClick={() => setSelectedStatus(status)}
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={status.userId.profilePic || "/avatar.png"}
                              alt={status.userId.fullName}
                              className="size-8 rounded-full"
                            />
                            <div>
                              <p className="text-sm">
                                {status.userId.fullName}
                              </p>
                              <small className="text-xs text-base-content/50">
                                {status.text}
                              </small>
                            </div>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Notification Icon */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-2 rounded-full hover:bg-base-300 transition-colors relative"
            >
              <Bell className="size-6 text-base-content/70" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full size-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50">
                <div className="p-4">
                  <h3 className="font-semibold mb-2">Notifications</h3>
                  {notifications.length === 0 ? (
                    <p className="text-sm text-base-content/70">
                      No new notifications
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {notifications.map((notification) => (
                        <li
                          key={notification._id}
                          className={`p-2 rounded-lg ${
                            notification.read ? "bg-base-200" : "bg-base-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-sm">{notification.content}</p>
                            {!notification.read && (
                              <button
                                onClick={() =>
                                  markNotificationAsRead(notification._id)
                                }
                                className="text-xs text-blue-500 hover:underline"
                              >
                                Mark as read
                              </button>
                            )}
                          </div>
                          <small className="text-xs text-base-content/50">
                            {new Date(
                              notification.createdAt
                            ).toLocaleTimeString()}
                          </small>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>

        {/* Search Input */}
        <div className="mt-4 flex items-center gap-2 bg-base-200 rounded-lg p-2">
          <Search className="size-5 text-base-content/70" />
          <input
            type="text"
            placeholder={`Search ${
              activeTab === "users" ? "users" : "groups"
            }...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      {/* Switch Button for Users and Groups */}
      <div className="flex flex-col lg:flex-row items-center justify-around p-2 border-b border-base-300">
        <button
          onClick={() => setActiveTab("users")}
          className={`w-full lg:flex-1 p-2 text-center mb-2 lg:mb-0 ${
            activeTab === "users"
              ? "bg-primary text-white rounded-lg"
              : "text-base-content/70 hover:bg-base-300 rounded-lg"
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab("groups")}
          className={`w-full lg:flex-1 p-2 text-center ${
            activeTab === "groups"
              ? "bg-primary text-white rounded-lg"
              : "text-base-content/70 hover:bg-base-300 rounded-lg"
          }`}
        >
          Groups
        </button>
      </div>

      {/* Group List */}
      {activeTab === "groups" && (
        <div className="border-b border-base-300 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium hidden lg:block">Groups</h3>
            <button
              onClick={() => setIsCreateGroupOpen(true)}
              className="p-2 rounded-full hover:bg-base-300 transition-colors"
            >
              <Plus className="size-6 text-base-content/70" />
            </button>
          </div>

          {/* List of Groups */}
          <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
            {" "}
            {/* Added max-height and overflow */}
            {filteredGroups?.map((group) => (
              <button
                key={group._id}
                onClick={() => {
                  setSelectedUser(null);
                  setSelectGroup(group);
                }}
                className={`
      w-full p-3 flex items-center gap-3
      hover:bg-base-300 transition-colors
      ${
        selectedGroup?._id === group._id
          ? "bg-base-300 ring-1 ring-base-300"
          : ""
      }
    `}
              >
                <div className="relative mx-auto lg:mx-0">
                  <img
                    src={group.profilePic || "/group-avatar.png"} // Use groupImage for group profile picture
                    alt={group.name}
                    className="size-12 object-cover rounded-full"
                  />
                  {group.members.some((member) =>
                    onlineUsers.includes(member._id)
                  ) && (
                    <span
                      className="absolute bottom-0 right-0 size-3 bg-green-500 
          rounded-full ring-2 ring-zinc-900"
                    />
                  )}
                </div>

                {/* Group info - only visible on larger screens */}
                <div className="hidden lg:block text-left min-w-0">
                  <div className="font-medium truncate">{group.name}</div>
                  <div className="text-sm text-zinc-400">
                    {group.members.length} members
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* User List */}
      {activeTab === "users" && (
        <div className="overflow-y-auto w-full py-3">
          {filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => {
                setSelectGroup(null);
                setSelectedUser(user);
              }}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${
                  selectedUser?._id === user._id
                    ? "bg-base-300 ring-1 ring-base-300"
                    : ""
                }
              `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                    rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>

              {/* User info - only visible on larger screens */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))}

          {filteredUsers.length === 0 && (
            <div className="text-center text-zinc-500 py-4">No users found</div>
          )}
        </div>
      )}

      {/* Status Modal */}
      {selectedStatus && (
        <StatusModal
          status={selectedStatus}
          onClose={() => setSelectedStatus(null)}
        />
      )}

      {/* Create Status Modal */}
      {isCreateStatusOpen && (
        <CreateStatusModal
          onClose={() => setIsCreateStatusOpen(false)}
        />
      )}

      {/* Create Group Modal */}
      {isCreateGroupOpen && (
        <CreateGroupModal
          onClose={() => setIsCreateGroupOpen(false)}
          onCreate={handleCreateGroup}
          users={users}
        />
      )}
    </aside>
  );
};

export default Sidebar;
