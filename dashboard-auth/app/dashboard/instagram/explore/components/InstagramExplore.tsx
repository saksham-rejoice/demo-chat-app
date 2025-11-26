"use client";
import React, { useState, useEffect } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { getInstagramPosts } from "@/services/instagramService";
import { InstagramPost } from "@/types/instagram";

const InstagramExplore = () => {
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const instagramPosts = await getInstagramPosts();
        setPosts(instagramPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-gray-400">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Explore Grid */}
      <div className="grid grid-cols-3 gap-0.5 bg-gray-900">
        {posts.map((post) => (
          <div
            key={post._id}
            className="relative overflow-hidden cursor-pointer bg-gray-900 group"
            onMouseEnter={() => setHoveredPost(post._id)}
            onMouseLeave={() => setHoveredPost(null)}
          >
            <div className="relative w-full pb-[100%]">
              <img
                src={post.imageDetails.url}
                alt={post.caption}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Hover overlay */}
              <div
                className={`absolute inset-0 bg-black/50 flex items-center justify-center gap-6 transition-opacity duration-200 ${
                  hoveredPost === post._id ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-6 h-6 fill-white text-white" />
                  <span className="font-semibold text-white">
                    {post.likes.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 fill-white text-white" />
                  <span className="font-semibold text-white">
                    {post.comments.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstagramExplore;