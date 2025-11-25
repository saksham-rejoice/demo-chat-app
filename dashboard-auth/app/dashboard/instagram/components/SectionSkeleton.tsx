"use client";

const SectionSkeleton = ({ title }: { title: string }) => {
  return (
    <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4 h-48 animate-pulse">
      <div className="h-4 w-16 bg-gray-700 rounded mb-3"></div>
      <div className="space-y-2">
        {[1, 2, 3].map((index) => (
          <div key={index} className="flex items-center gap-2 p-1">
            <div className="w-6 h-6 rounded-full bg-gray-700"></div>
            <div className="flex-1">
              <div className="h-3 w-20 bg-gray-700 rounded"></div>
            </div>
            <div className="w-5 h-5 bg-gray-700 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionSkeleton;