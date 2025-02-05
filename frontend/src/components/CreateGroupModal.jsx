import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera } from "lucide-react";

const CreateGroupModal = ({ onClose, onCreate, users }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedImg, setSelectedImg] = useState(null); // State for the group image
  const { authUser } = useAuthStore();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image); // Set the base64 image for preview
    };
  };

  const handleCreate = async () => {
    if (!name || selectedMembers.length === 0) {
      alert("Please fill in all fields and select at least one member.");
      return;
    }

    // Call the onCreate function with the group image
    onCreate(name, description, [...selectedMembers, authUser._id], selectedImg);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">Create Group</h2>

        {/* Group Image Upload */}
        <div className="flex flex-col items-center gap-4 mb-4">
          <div className="relative">
            <img
              src={selectedImg || "https://banner2.cleanpng.com/20180622/qfj/aazcdq748.webp"} // Default image if no image is selected
              alt="Group"
              className="size-20 rounded-full object-cover border-4"
            />
            <label
              htmlFor="group-image-upload"
              className="absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200"
            >
              <Camera className="w-5 h-5 text-base-200" />
              <input
                type="file"
                id="group-image-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>
          <p className="text-sm text-zinc-400">Click the camera icon to upload a group photo</p>
        </div>

        {/* Group Name */}
        <input
          type="text"
          placeholder="Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg"
        />

        {/* Group Description */}
        <input
          type="text"
          placeholder="Group Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg"
        />

        {/* Add Members */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Add Members</h3>
          <div className="max-h-40 overflow-y-auto">
            {users.map((user) => (
              <label key={user._id} className="flex items-center gap-2 p-2 hover:bg-base-200 rounded-lg">
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
                />
                <span>{user.fullName}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 p-2 bg-base-300 rounded-lg hover:bg-base-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="flex-1 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;