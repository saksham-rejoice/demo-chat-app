"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { getFollowers } from "@/services/instagramService";
import { FollowersResponse } from "@/types/instagram";
import { useEffect, useState } from "react";
import SectionSkeleton from "./SectionSkeleton";
export default function FollowersSection() {
  const [followersCount, setFollowersCount] =
    useState<FollowersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const followers = await getFollowers();
        setFollowersCount(followers);
      } catch (error) {
        console.error("Failed to fetch followers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFollowers();
  }, []);
  if (loading) return <SectionSkeleton title="Followers" />;

  return (
    <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4 h-48">
      <h3 className="text-white font-medium mb-3 text-sm">Followers</h3>
      <ScrollArea className="h-36">
        <div className="space-y-1">
          {(followersCount?.data?.followers || []).map((user, index) => (
            <div
              key={user._id}
              className="flex items-center gap-2 p-1 rounded hover:bg-gray-700/50"
            >
              <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <p className="text-white text-xs truncate">{user.username}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
