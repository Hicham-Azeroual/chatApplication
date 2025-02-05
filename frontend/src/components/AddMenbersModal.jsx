import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import {  X } from "lucide-react"; // Import the X icon

const AddMembersModal = ({ groupId, onClose }) => {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const { users, selectedGroup, addMembersToGroup } = useChatStore();
  console.log(selectedGroup);
  
  // Filter users who are not already in the group
  const nonGroupMembers = users.filter(
    (user) => !selectedGroup.members.some((member) => member === user._id)
  );

  const handleAddMembers = () => {
    addMembersToGroup(groupId, selectedMembers);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-lg w-96 shadow-lg border border-base-300">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-base-content">Add Members</h2>
          <button onClick={onClose} className="text-base-content hover:text-error">
            <X className="size-5" />
          </button>
        </div>

        {/* Member List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {nonGroupMembers.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200 transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedMembers.includes(user._id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedMembers([...selectedMembers, user._id]);
                  } else {
                    setSelectedMembers(selectedMembers.filter((id) => id !== user._id));
                  }
                }}
                className="checkbox checkbox-primary"
              />
              <div className="flex items-center gap-2">
                <div className="avatar">
                  <div className="size-8 rounded-full">
                    <img src={user.profilePic || "/avatar.png"} alt={user.fullName} />
                  </div>
                </div>
                <span className="text-base-content">{user.fullName}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-base-200 text-base-content rounded-lg hover:bg-base-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddMembers}
            className="px-4 py-2 bg-primary text-primary-content rounded-lg hover:bg-primary-focus transition-colors"
          >
            Add Members
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMembersModal;