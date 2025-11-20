"use client";
import { useState, useEffect } from "react";
import { Heart, Home, Search, PlusSquare } from "lucide-react";
import InstagramSidebar from "./components/InstagramSidebar";
import InstagramStories from "./components/InstagramStories";
import InstagramPost from "./components/InstagramPost";
import { getInstagramPosts } from "../../../services/instagramService";
interface Stories {
  id: number;
  username: string;
  avatar: string;
  isYour: boolean;
}
interface Post {
  id: number;
  username: string;
  avatar: string;
  image: string;
  likes: string;
  caption: string;
  time: string;
}
const InstagramClone = () => {
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const apiPosts = await getInstagramPosts();
        const formattedPosts: Post[] = apiPosts.map((post: any) => ({
          id: post._id,
          username: post.user?.username || "Unknown",
          avatar: post.user?.username?.charAt(0).toUpperCase() || "U",
          image:
            post.imageDetails?.url ||
            "linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)",
          likes: post.likes?.length?.toString() || "0",
          caption: post.caption || "",
          time: new Date(post.createdAt).toLocaleString().toUpperCase(),
        }));
        setPosts(formattedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        // Fallback to static data on error
        setPosts([
          {
            id: 1,
            username: "fenty",
            avatar: "💄",
            image: "linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)",
            likes: "26.3k",
            caption:
              "Tell ya homies we got 10 more shades of #PROFILTRFOUNDATION, for a...",
            time: "2 HOURS AGO",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const toggleLike = (postId: number) => {
    setLiked((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      <InstagramSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-900">
        <div className="max-w-2xl mx-0 px-4 py-6 lg:pl-6">
          {/* Stories */}
          <InstagramStories stories={stories} />

          {/* Posts */}
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-white">Loading posts...</div>
            </div>
          ) : (
            <InstagramPost
              posts={posts}
              liked={liked}
              toggleLike={toggleLike}
            />
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-4 py-2">
        <div className="flex items-center justify-around">
          <button className="p-2">
            <Home className="w-6 h-6 text-white" />
          </button>
          <button className="p-2">
            <Search className="w-6 h-6 text-gray-400" />
          </button>
          <button className="p-2">
            <PlusSquare className="w-6 h-6 text-gray-400" />
          </button>
          <button className="p-2">
            <Heart className="w-6 h-6 text-gray-400" />
          </button>
          <button className="p-2">
            <div className="w-6 h-6 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center text-xs text-white font-bold">
              OM
            </div>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default InstagramClone;
