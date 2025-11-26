"use client";
import { useState, useEffect, useMemo } from "react";
import { useUser } from "@/hooks/useUser";
import { getStories } from "@/services/instagramService";
import StoryViewer from "./StoryViewer";

interface Story {
  userId: string;
  username: string;
  imageUrls: string[];
}

interface StoriesResponse {
  myStories: Story | null;
  otherStories: Story[];
}

const StoryAvatar = ({
  username,
  isCurrentUser,
  onClick,
}: {
  username: string;
  isCurrentUser?: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      className="flex flex-col items-center gap-1 min-w-fit cursor-pointer"
      onClick={onClick}
    >
      <div
        className={`w-16 h-16 rounded-full p-0.5 
        ${
          isCurrentUser
            ? "bg-gray-700"
            : "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600"
        }`}
      >
        <div className="w-full h-full bg-gray-900 rounded-full p-0.5 flex items-center justify-center">
          <div className="w-full h-full bg-gray-800 rounded-full flex items-center justify-center text-lg font-semibold text-white">
            {username[0].toUpperCase()}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <span className="text-xs truncate w-16 text-center text-gray-300">
          {username}
        </span>
        {isCurrentUser && <span className="text-xs text-gray-500">(you)</span>}
      </div>
    </div>
  );
};

const InstagramStories = () => {
  const [myStories, setMyStories] = useState<Story | null>(null);
  const [otherStories, setOtherStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [storyViewerOpen, setStoryViewerOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const { user } = useUser();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const data = await getStories();
        if (data.success) {
          setMyStories(data.data.myStories);
          setOtherStories(data.data.otherStories);
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const allStories = useMemo(() => {
    const stories = [];
    if (myStories) stories.push(myStories);
    stories.push(...otherStories);
    return stories;
  }, [myStories, otherStories]);

  if (loading) return <div className="mb-3 pb-2">Loading stories...</div>;

  return (
    <div className="mb-3 pb-2">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {/* Current User Story */}
        {myStories && (
          <StoryAvatar
            username={myStories.username}
            isCurrentUser
            onClick={() => {
              setSelectedStoryIndex(0);
              setStoryViewerOpen(true);
            }}
          />
        )}

        {/* Other Stories */}
        {otherStories.map((story, index) => (
          <StoryAvatar
            key={story.userId}
            username={story.username}
            onClick={() => {
              setSelectedStoryIndex(myStories ? index + 1 : index);
              setStoryViewerOpen(true);
            }}
          />
        ))}
      </div>

      <StoryViewer
        stories={allStories}
        initialIndex={selectedStoryIndex}
        open={storyViewerOpen}
        onOpenChange={setStoryViewerOpen}
      />
    </div>
  );
};

export default InstagramStories;
