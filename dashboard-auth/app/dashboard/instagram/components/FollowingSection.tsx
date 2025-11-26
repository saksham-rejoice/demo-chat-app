"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { getFollowing } from "@/services/instagramService";
import { useUser } from "@/hooks/useUser";
import { FollowingResponse } from "@/types/instagram";
import SectionSkeleton from "./SectionSkeleton";
import { useAppSelector } from "@/store/hooks";
export default function FollowingSection() {
  const [followingData, setFollowingData] = useState<FollowingResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const activityRefreshTrigger = useAppSelector(
    (state) => state.instagram.activityRefreshTrigger
  );
  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const following = await getFollowing();
        setFollowingData(following);
      } catch (error) {
        console.error("Failed to fetch following:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFollowing();
  }, [activityRefreshTrigger]);
  if (loading) return <SectionSkeleton title="Following" />;

  return (
    <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4 h-48">
      <h3 className="text-white font-medium mb-3 text-sm">Following</h3>
      <ScrollArea className="h-32">
        <div className="space-y-2 pr-4">
          {followingData?.data?.following?.map((user, index) => (
            <div
              key={user._id}
              className="flex items-center gap-2 p-1 rounded hover:bg-gray-700/50"
            >
              <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs truncate">{user.username}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
