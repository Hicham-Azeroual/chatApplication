import { useChatStore } from "../store/useChatStore";

const LeaveGroupModal = ({ groupId, onClose }) => {
  const { leaveGroup } = useChatStore();

  const handleLeaveGroup = () => {
    leaveGroup(groupId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-bold mb-4">Leave Group</h2>
        <p className="mb-4">Are you sure you want to leave this group?</p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button onClick={handleLeaveGroup} className="px-4 py-2 bg-red-500 text-white rounded">
            Leave
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveGroupModal;