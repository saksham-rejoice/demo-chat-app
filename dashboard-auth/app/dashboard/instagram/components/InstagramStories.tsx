'use client'
interface Stories {
  id: number;
  username: string;
  avatar: string;
  isYour: boolean;
}

const InstagramStories = () => {
  const stories: Stories[] = [
    { id: 1, username: "Your Story", avatar: "👤", isYour: true },
    { id: 2, username: "lebaner...", avatar: "🎨", isYour: false },
    { id: 3, username: "smallipsa", avatar: "👩", isYour: false },
    { id: 4, username: "dylanclark", avatar: "👨", isYour: false },
    { id: 5, username: "rhianna", avatar: "💃", isYour: false },
    { id: 6, username: "shakilay", avatar: "🎭", isYour: false },
    { id: 7, username: "edelstep", avatar: "🎪", isYour: false },
    { id: 8, username: "gucci", avatar: "👜", isYour: false },
  ];
  return (
    <div className="mb-6  pb-4">
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
