const MessageSkeleton = () => {
    // Create an array of 6 items for skeleton messages
    const skeletonMessages = Array(6).fill(null);
  
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {skeletonMessages.map((_, idx) => (
          <div
            key={idx}
            className={`flex ${idx % 2 === 0 ? "justify-start" : "justify-end"}`}
          >
            {/* Avatar Skeleton */}
            <div className="flex items-end gap-2">
              {idx % 2 === 0 && (
                <div className="avatar">
                  <div className="size-8 rounded-full">
                    <div className="skeleton w-full h-full rounded-full" />
                  </div>
                </div>
              )}
  
              {/* Message Bubble Skeleton */}
              <div
                className={`max-w-[80%] flex flex-col ${
                  idx % 2 === 0 ? "items-start" : "items-end"
                }`}
              >
                <div className="skeleton h-16 w-[200px] rounded-lg" />
  
                {/* Timestamp Skeleton */}
                <div className="skeleton h-3 w-16 mt-1 rounded-full" />
              </div>
  
              {idx % 2 !== 0 && (
                <div className="avatar">
                  <div className="size-8 rounded-full">
                    <div className="skeleton w-full h-full rounded-full" />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default MessageSkeleton;