'use client'
import { getInstagramPosts } from "@/services/instagramService";
import { Fragment,useState,useEffect } from "react"
import InstagramPost from "../components/InstagramPost";
interface Post {
  id: number;
  username: string;
  avatar: string;
  image: string;
  likes: string;
  caption: string;
  time: string;
}
const InstagramFeeds = () => {
    const [posts, setPosts] = useState<Post[]>([]);
     const [loading, setLoading] = useState(true);
      const [liked, setLiked] = useState<Record<number, boolean>>({});
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
    <Fragment>
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

    </Fragment>
  )
}

export default InstagramFeeds