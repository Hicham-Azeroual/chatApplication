import { useState } from "react";
import { X, MoreVertical } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import GroupOptionsMenu from "./GroupOptionsMenu";
import AddMembersModal from "./AddMenbersModal";
import LeaveGroupModal from "./LeaveGroupModal";

const ChatHeader = () => {
  const { selectedUser, selectedGroup, setSelectedUser, setSelectGroup } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddMembersModalOpen, setIsAddMembersModalOpen] = useState(false);
  const [isLeaveGroupModalOpen, setIsLeaveGroupModalOpen] = useState(false);

  const isGroup = !!selectedGroup;

  const handleCloseChat = () => {
    if (isGroup) {
      setSelectGroup(null);
    } else {
      setSelectedUser(null);
    }
  };

  const handleAddMembers = () => {
    setIsAddMembersModalOpen(true);
    setIsMenuOpen(false); // Close the menu
  };

  const handleLeaveGroup = () => {
    setIsLeaveGroupModalOpen(true);
    setIsMenuOpen(false); // Close the menu
  };

  const name = isGroup ? selectedGroup.name : selectedUser?.fullName;
  const profilePic = isGroup ? selectedGroup.profilePic : selectedUser?.profilePic;
  const status = isGroup
    ? `${selectedGroup.members.length} members`
    : onlineUsers.includes(selectedUser?._id)
    ? "Online"
    : "Offline";

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={profilePic || "/avatar.png"} alt={name} />
              {!isGroup && onlineUsers.includes(selectedUser?._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-100" />
              )}
            </div>
          </div>

          {/* User/Group info */}
          <div>
            <h3 className="font-medium">{name}</h3>
            <p className="text-sm text-base-content/70">{status}</p>
          </div>
        </div>

        {/* Close button and Group Options Menu */}
        <div className="flex items-center gap-2">
          {isGroup && (
            <div className="relative">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <MoreVertical className="size-5" />
              </button>
              {isMenuOpen && (
                <GroupOptionsMenu
                  onClose={() => setIsMenuOpen(false)}
                  onAddMembers={handleAddMembers}
                  onLeaveGroup={handleLeaveGroup}
                />
              )}
            </div>
          )}
          <button onClick={handleCloseChat}>
            <X />
          </button>
        </div>
      </div>

      {/* Modals */}
      {isAddMembersModalOpen && (
        <AddMembersModal groupId={selectedGroup._id} onClose={() => setIsAddMembersModalOpen(false)} />
      )}
      {isLeaveGroupModalOpen && (
        <LeaveGroupModal groupId={selectedGroup._id} onClose={() => setIsLeaveGroupModalOpen(false)} />
      )}
    </div>
  );
};

export default ChatHeader;