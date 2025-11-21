"use client";
import {
  getSavedPosts,
  SavedCollectionData,
} from "@/services/instagramService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin, Calendar, Hash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCurrentCollectionName } from "@/store/slices/instagramSlice";

const InstagramSavedPostPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [posts, setPosts] = useState<SavedCollectionData | null>(null);
  const fetchCollectionPostData = async (id: string) => {
    try {
      const result = await getSavedPosts(id);
      console.log(result);
      setPosts(result);
      // Save collection name to Redux
      if (result.collectionName) {
        dispatch(setCurrentCollectionName(result.collectionName));
      }
    } catch (error) {
      console.error("Error fetching collection:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCollectionPostData(id as string);
    }
  }, [id]);
  return (
    <div className="px-2">
      {posts ? (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">
              {posts.collectionName}
            </h1>
            <p className="text-gray-400">
              {posts.savedPost.length} saved posts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.savedPost.map((post) => (
              <Card
                key={post._id}
                className="bg-gray-800/70 border border-gray-700 rounded-xl shadow-md hover:shadow-lg hover:bg-gray-700/70 transition-all overflow-hidden flex flex-col h-fit"
              >
                {post.imageDetails?.url && (
                  <div className="w-full aspect-video overflow-hidden">
                    <img
                      src={post.imageDetails.url}
                      alt={post.caption}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <CardHeader className="pb-2 px-4 pt-3">
                  <h3 className="text-white font-semibold text-lg leading-tight line-clamp-2">
                    {post.caption}
                  </h3>
                </CardHeader>

                <CardContent className="space-y-3 px-4 pb-4 grow">
                  {/* Location */}
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="capitalize truncate">{post.location}</span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Hashtags */}
                  <div className="flex items-start gap-2">
                    <Hash className="w-4 h-4 text-blue-400 mt-1 shrink-0" />
                    <div className="flex flex-wrap gap-1">
                      {post.hashtags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="text-blue-400 text-xs bg-gray-700 px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}

                      {post.hashtags.length > 3 && (
                        <span className="text-gray-400 text-xs mt-1">
                          +{post.hashtags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between text-gray-400 text-sm border-t border-gray-700 pt-3 mt-auto">
                    <span>{post.likes.length} likes</span>
                    <span>{post.comments.length} comments</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400">Loading collection...</div>
        </div>
      )}
    </div>
  );
};

export default InstagramSavedPostPage;
