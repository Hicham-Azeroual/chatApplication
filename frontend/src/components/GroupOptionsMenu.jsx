import React from 'react';

const GroupOptionsMenu = ({ onClose, onAddMembers, onLeaveGroup, onUpdateGroup, onDeleteGroup }) => {
  return (
    <div className="absolute right-0 mt-2 w-56 rounded-md bg-base-100 border border-base-300  shadow-lg  z-50">
      <div className="py-1 bg-base">
        <button
          onClick={onAddMembers}
          className="block w-full px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition duration-150 ease-in-out"
        >
          Add Members
        </button>
        <button
          onClick={onUpdateGroup}
          className="block w-full px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition duration-150 ease-in-out"
        >
          Update Group
        </button>
        <button
          onClick={onLeaveGroup}
          className="block w-full px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition duration-150 ease-in-out"
        >
          Leave Group
        </button>
        <button
          onClick={onDeleteGroup}
          className="block w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 hover:text-destructive transition duration-150 ease-in-out"
        >
          Delete Group
        </button>
      </div>
    </div>
  );
};

export default GroupOptionsMenu;
