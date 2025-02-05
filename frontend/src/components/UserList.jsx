import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { User } from "lucide-react";

const UserList = ({ onSelectUser }) => {
  const { authUser } = useAuthStore();
  const { users, getUsers } = useChatStore();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter users based on search query (only if searchQuery has 3 or more characters)
  const filteredUsers =
    searchQuery.length >= 3
      ? users.filter(
          (user) =>
            user._id !== authUser._id && // Exclude the current user
            user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : users.filter((user) => user._id !== authUser._id); // Show all users by default (except the current user)

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border rounded-lg mb-4"
      />

      {/* User List */}
      <div className="max-h-64 overflow-y-auto">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => onSelectUser(user._id)}
              className="flex items-center gap-3 p-2 hover:bg-base-200 rounded-lg cursor-pointer transition-colors"
            >
              <div className="size-10 rounded-full border flex items-center justify-center">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="size-10 rounded-full"
                />
              </div>
              <div>
                <p className="font-medium">{user.fullName}</p>
                <p className="text-sm text-base-content/70">{user.email}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-base-content/70">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default UserList;