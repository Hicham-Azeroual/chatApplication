import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react"; // Changed icon for variety

const NoChatSelected = () => {
  const [welcomeText, setWelcomeText] = useState("");
  const [helloMessages, setHelloMessages] = useState([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const welcomeMessage = "Welcome to Connectify!";
  const helloMessageList = [
    "Hello! 👋",
    "Hi there! 😊",
    "Hey! How can I help you? 🚀",
  ];

  // Function to animate the welcome text
  useEffect(() => {
    let timeout;

    const animateText = (text, delay, reverse = false) => {
      let currentIndex = 0;

      const addCharacter = () => {
        if (currentIndex < text.length) {
          setWelcomeText(text.slice(0, currentIndex + 1));
          currentIndex++;
          timeout = setTimeout(addCharacter, delay);
        } else if (!reverse) {
          // Wait for a moment before reversing
          timeout = setTimeout(() => animateText(text, delay, true), 1000);
        }
      };

      const removeCharacter = () => {
        if (currentIndex >= 0) {
          setWelcomeText(text.slice(0, currentIndex));
          currentIndex--;
          timeout = setTimeout(removeCharacter, delay);
        } else {
          // Restart the animation
          timeout = setTimeout(() => animateText(text, delay), 1000);
        }
      };

      if (reverse) {
        removeCharacter();
      } else {
        addCharacter();
      }
    };

    animateText(welcomeMessage, 100);

    return () => clearTimeout(timeout);
  }, []);

  // Function to cycle through hello messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % helloMessageList.length);
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-gradient-to-br from-base-100 to-base-200">
      <div className="max-w-md text-center space-y-8">
        {/* Animated Icon with Gradient */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Outer Circle with Gradient */}
            <div
              className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary 
              flex items-center justify-center animate-pulse shadow-lg"
            >
              {/* Inner Circle with Icon */}
              <div
                className="w-20 h-20 rounded-full bg-base-100 flex items-center 
                justify-center shadow-inner"
              >
                <MessageCircle className="w-10 h-10 text-primary animate-float" />
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {welcomeText}
        </h2>

        {/* Hello Messages */}
        <div className="text-base-content/70 text-lg">
          {helloMessages.map((message, index) => (
            <div
              key={index}
              className={`transition-opacity duration-1000 ${
                index === currentMessageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              {message}
            </div>
          ))}
        </div>

        {/* Subtle Call-to-Action */}
        <div className="mt-6">
          <button
            className="btn btn-outline btn-primary hover:bg-primary hover:text-white 
            transition-all duration-300"
          >
            Start a New Chat
          </button>
        </div>
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
          .animate-pulse {
            animation: pulse 2s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default NoChatSelected;