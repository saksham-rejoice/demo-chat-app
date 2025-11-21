"use client";

import { useState, useEffect } from "react";
import { trendingHashtags } from "@/services/instagramService";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TrendingHashtag {
  hashtag: string;
  count: number;
}

export default function TrendingSection() {
  const [trendingTags, setTrendingTags] = useState<TrendingHashtag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingHashtags = async () => {
      try {
        const data = await trendingHashtags();
        setTrendingTags(data.data?.trendingHashtags || []);
      } catch (error) {
        console.error("Error fetching trending hashtags:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingHashtags();
  }, []);

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4 h-48">
      <h3 className="text-white font-medium mb-3 text-sm">Trending</h3>
      <ScrollArea className="h-32">
        <div className="space-y-2 pr-4">
          {loading ? (
            <div className="text-gray-400 text-xs">Loading...</div>
          ) : (
            trendingTags.map((item, index) => (
              <div
                key={index}
                className="p-1 rounded hover:bg-gray-700/50 cursor-pointer"
              >
                <p className="text-blue-400 text-sm font-medium">
                  #{item.hashtag}
                </p>
                <p className="text-gray-400 text-xs">
                  {formatCount(item.count)} posts
                </p>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
