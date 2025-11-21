"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImagePlus } from "lucide-react";
import { publishInstagramPost } from "@/services/instagramService";
import { toast } from "sonner";
interface PreviewPostDialogProps {
  userName: string;
  userImage?: string;
  uploadedImageUrl?: string | null;
  image?: string | null;
  caption: string;
  location: string;
  hashtags: string[];
  uploadedImageId?: string | null;
  onPublishComplete: () => void;
}

const PreviewPostDialog = ({
  userName,
  userImage,
  uploadedImageUrl,
  image,
  caption,
  location,
  hashtags,
  uploadedImageId,
  onPublishComplete,
}: PreviewPostDialogProps) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const isFormValid =
    uploadedImageId &&
    caption.trim().length > 0 &&
    location.trim().length > 0 &&
    hashtags.length > 0;

  const handlePublishPost = async () => {
    if (!isFormValid) {
      toast.error("Please fill all required fields before publishing.");
      return;
    }

    setIsPublishing(true);
    
    try {
      await publishInstagramPost({
        imageId: uploadedImageId,
        caption,
        location,
        hashtags,
      });
      toast.success("Post published successfully!");
      setIsOpen(false);
      onPublishComplete();
    } catch (error) {
      console.error("Publish error:", error);
      toast.error("Failed to publish post");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white">
          Preview Post
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md bg-gray-800 border-gray-700 text-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-100">Post Preview</DialogTitle>
        </DialogHeader>

        {isPublishing && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-lg">
            <div className="bg-gray-800 p-6 rounded-lg flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-200">Publishing post...</p>
            </div>
          </div>
        )}

        <ScrollArea className="max-h-[80vh] rounded-lg">
          <div className="bg-black rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center p-3 border-b border-gray-700">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                {userImage ? (
                  <img
                    src={userImage}
                    alt="profile"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <span className="text-white text-sm font-semibold">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="ml-3 text-white font-semibold">{userName}</span>
            </div>

            {/* Image */}
            <div className="aspect-square bg-gray-800 flex items-center justify-center">
              {uploadedImageUrl || image ? (
                <img
                  src={uploadedImageUrl || image || ""}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-500 text-center">
                  <ImagePlus className="w-16 h-16 mx-auto mb-2" />
                  <p>No image selected</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-3 space-y-2">
              <div className="flex space-x-4">
                <div className="w-6 h-6 border-2 border-white rounded-sm"></div>
                <div className="w-6 h-6 border-2 border-white rounded-full"></div>
                <div className="w-6 h-6 border-2 border-white transform rotate-45"></div>
              </div>

              <p className="text-white font-semibold">0 likes</p>

              <div className="text-white text-sm">
                <span className="font-semibold">{userName}</span>
                <span className="ml-2">
                  {caption || "Your caption will appear here..."}
                </span>
              </div>

              {/* Location Section */}
              <div className="text-gray-400 text-xs">
                <p>📍 {location || "Add location..."}</p>
              </div>

              {/* Hashtags Section */}
              <div className="text-blue-400 text-xs">
                {hashtags.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {hashtags.map((tag, index) => (
                      <span key={index}>#{tag}</span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500">Add hashtags...</span>
                )}
              </div>

              <p className="text-gray-400 text-xs">2 minutes ago</p>

              {/* Publish Button */}
              <Button
                onClick={handlePublishPost}
                disabled={!isFormValid || isPublishing}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isPublishing ? "Publishing..." : "Publish Post"}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewPostDialog;
