"use client";
import { Bookmark, Heart, MoreHorizontal, Send } from "lucide-react";
import CommentDialog from "./CommentDialog";

interface Post {
  id: number;
  username: string;
  avatar: string;
  image: string;
  likes: string;
  caption: string;
  time: string;
}

interface InstagramPostProps {
  posts: Post[];
  liked: Record<number, boolean>;
  toggleLike: (postId: number) => void;
}

const InstagramPost = ({ posts, liked, toggleLike }: InstagramPostProps) => {
  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <article
          key={post.id}
          className="border border-gray-700 overflow-hidden bg-black max-w-[640px] mx-auto md:mx-0 md:ml-6 rounded-md"
        >
          {/* Post Header */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center text-lg">
                {post.avatar}
              </div>
              <span className="font-semibold text-sm text-white">{post.username}</span>
            </div>
            <button>
              <MoreHorizontal className="w-5 h-5 text-gray-300" />
            </button>
          </div>

          {/* Post Image */}
          <div className="w-full h-[480px] md:h-[560px] relative">
            {post.image.startsWith("http") ? (
              <img src={post.image} alt={post.caption} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full" style={{ background: post.image }} />
            )}
          </div>

          {/* Post Actions */}
          <div className="px-4 pt-3 pb-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <button onClick={() => toggleLike(post.id)} className="transition-transform hover:scale-110">
                  <Heart className={`w-6 h-6 ${liked[post.id] ? "fill-red-500 text-red-500" : "text-white"}`} />
                </button>

                {/* extracted comment dialog */}
                <CommentDialog post={post} />

                <button className="transition-transform hover:scale-110">
                  <Send className="w-6 h-6 text-white" />
                </button>
              </div>
              <button className="transition-transform hover:scale-110">
                <Bookmark className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Likes */}
            <p className="font-semibold text-sm mb-2 text-white">{post.likes} likes</p>

            {/* Caption */}
            <p className="text-sm text-gray-200">
              <span className="font-semibold mr-2">{post.username}</span>
              {post.caption}
            </p>

            {/* Time */}
            <p className="text-xs text-gray-500 mt-2">{post.time}</p>
          </div>
        </article>
      ))}
    </div>
  );
};

export default InstagramPost;
