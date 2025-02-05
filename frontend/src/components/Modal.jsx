import { useEffect } from "react";
import { X } from "lucide-react";
const Modal = ({ isOpen, onClose, children }) => {
  // Close modal when pressing the Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-base-200 transition-colors"
        >
          <X className="size-5 text-base-content/70" />
        </button>

        {/* Modal Content */}
        {children}
      </div>
    </div>
  );
};

export default Modal;