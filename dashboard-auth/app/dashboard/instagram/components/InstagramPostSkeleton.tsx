"use client";

const InstagramPostSkeleton = () => {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((index) => (
        <article
          key={index}
          className="border border-gray-700 overflow-hidden bg-black max-w-[640px] mx-auto md:mx-0 md:ml-6 rounded-md animate-pulse"
        >
          {/* Post Header Skeleton */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-700"></div>
              <div className="h-4 w-20 bg-gray-700 rounded"></div>
            </div>
            <div className="w-5 h-5 bg-gray-700 rounded"></div>
          </div>

          {/* Post Image Skeleton */}
          <div className="w-full h-[480px] md:h-[560px] bg-gray-700"></div>

          {/* Post Actions Skeleton */}
          <div className="px-4 pt-3 pb-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 bg-gray-700 rounded"></div>
                <div className="w-6 h-6 bg-gray-700 rounded"></div>
                <div className="w-6 h-6 bg-gray-700 rounded"></div>
              </div>
              <div className="w-6 h-6 bg-gray-700 rounded"></div>
            </div>

            {/* Likes Skeleton */}
            <div className="h-4 w-16 bg-gray-700 rounded mb-2"></div>

            {/* Caption Skeleton */}
            <div className="space-y-1">
              <div className="h-4 w-full bg-gray-700 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
            </div>

            {/* Time Skeleton */}
            <div className="h-3 w-24 bg-gray-700 rounded mt-2"></div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default InstagramPostSkeleton;