
interface Stories {
  id: number;
  username: string;
  avatar: string;
  isYour: boolean;
}

const InstagramStories = ({ stories }: { stories: Stories[] }) => {
  return (
    <div className="mb-6 border-b border-gray-800 pb-4">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {stories.map((story) => (
          <div
            key={story.id}
            className="flex flex-col items-center gap-1 min-w-fit"
          >
            <div
              className={`w-16 h-16 rounded-full p-0.5 ${
                story.isYour
                  ? "bg-gray-700"
                  : "bg-linear-to-tr from-yellow-400 via-pink-500 to-purple-600"
              }`}
            >
              <div className="w-full h-full bg-gray-900 rounded-full p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-gray-800 rounded-full flex items-center justify-center text-2xl">
                  {story.avatar}
                </div>
              </div>
            </div>
            <span className="text-xs truncate w-16 text-center text-gray-300">
              {story.username}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstagramStories;
