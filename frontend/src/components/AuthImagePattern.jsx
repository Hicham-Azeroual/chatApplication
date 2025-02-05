const AuthImagePattern = ({ title, subtitle }) => {
    // Social media icons data
    const socialMediaIcons = [
      { icon: "facebook", link: "#", color: "text-blue-400" },
      { icon: "twitter", link: "#", color: "text-blue-300" },
      { icon: "instagram", link: "#", color: "text-pink-400" },
      { icon: "linkedin", link: "#", color: "text-blue-500" },
    ];
  
    // Emojis for the chat effect
    const emojis = ["💬", "👋", "🚀", "❤️", "👍", "🎉"];
  
    return (
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-base-100 to-base-200 p-6 lg:p-12 relative overflow-hidden">
        {/* Floating Shapes */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 lg:w-64 lg:h-64 bg-base-content/5 rounded-full animate-float"></div>
          <div className="w-32 h-32 lg:w-48 lg:h-48 bg-base-content/10 rounded-full animate-float animation-delay-2000 absolute"></div>
          <div className="w-24 h-24 lg:w-32 lg:h-32 bg-base-content/15 rounded-full animate-float animation-delay-4000 absolute"></div>
        </div>
  
        {/* Particle Effects */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-base-content/20 rounded-full animate-particle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
  
        {/* Floating Emojis (Chat Effect) */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-chat-emoji"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 5 + 5}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              {emojis[Math.floor(Math.random() * emojis.length)]}
            </div>
          ))}
        </div>
  
        {/* Content */}
        <div className="relative z-10 max-w-md text-center">
          <h2 className="text-2xl lg:text-4xl font-bold text-base-content mb-4">{title}</h2>
          <p className="text-base-content/70 text-sm lg:text-base mb-8">{subtitle}</p>
  
          {/* Social Media Icons */}
          <div className="flex justify-center space-x-6">
            {socialMediaIcons.map((social, index) => (
              <a
                key={index}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`${social.color} hover:scale-110 transform transition-transform duration-300 animate-float`}
                style={{ animationDelay: `${index * 0.5}s` }}
              >
                <i className={`fab fa-${social.icon} text-3xl`}></i>
              </a>
            ))}
          </div>
        </div>
  
        {/* CSS Animations */}
        <style>
          {`
            @keyframes float {
              0%,
              100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-10px);
              }
            }
            @keyframes particle {
              0% {
                transform: translateY(0) translateX(0);
                opacity: 1;
              }
              100% {
                transform: translateY(-100px) translateX(50px);
                opacity: 0;
              }
            }
            @keyframes chat-emoji {
              0% {
                transform: translateY(100vh) translateX(0);
                opacity: 1;
              }
              100% {
                transform: translateY(-100px) translateX(0);
                opacity: 0;
              }
            }
            .animate-float {
              animation: float 4s ease-in-out infinite;
            }
            .animation-delay-2000 {
              animation-delay: 2s;
            }
            .animation-delay-4000 {
              animation-delay: 4s;
            }
            .animate-particle {
              animation: particle linear infinite;
            }
            .animate-chat-emoji {
              animation: chat-emoji linear infinite;
            }
          `}
        </style>
      </div>
    );
  };
  
  export default AuthImagePattern;