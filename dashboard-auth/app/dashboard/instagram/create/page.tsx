"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, ImagePlus } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  uploadInstagramPhoto,
  deleteInstagramPhoto,
} from "@/services/instagramService";
import { toast } from "sonner";
import PreviewPostDialog from "./components/PreviewPostDialog";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

export default function CreateInstagramPost() {
  const router = useRouter();
  const { user } = useUser();
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [uploadedImageId, setUploadedImageId] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const userName = user?.username || "your_username";
  const userImage = user?.profilePicture;

  const fileRef = useRef<HTMLInputElement | null>(null);

  const hashtagOptions = [
    "travel",
    "food",
    "fitness",
    "nature",
    "coding",
    "ai",
    "photography",
  ];

  // Handle normal upload
  const handleImageUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);

    setIsUploading(true);
    try {
      const response = await uploadInstagramPhoto({ image: file });
      setUploadedImageId(response.data._id);
      setUploadedImageUrl(response.data.url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle drag-drop file
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);

    setIsUploading(true);
    try {
      const response = await uploadInstagramPhoto({ image: file });
      setUploadedImageId(response.data._id);
      setUploadedImageUrl(response.data.url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = async () => {
    if (uploadedImageId) {
      try {
        await deleteInstagramPhoto(uploadedImageId);
        toast.success("Image deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete image");
      }
    }
    setImage(null);
    setUploadedImageId(null);
    setUploadedImageUrl(null);
  };

  const addHashtag = (value: string) => {
    if (!hashtags.includes(value)) {
      setHashtags([...hashtags, value]);
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter((t) => t !== tag));
  };

  const clearForm = () => {
    setImage(null);
    setUploadedImageId(null);
    setUploadedImageUrl(null);
    setCaption("");
    setLocation("");
    setHashtags([]);
    router.push("/dashboard/instagram/feed");
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6 bg-gray-900 text-gray-200">
      {/* ================= IMAGE UPLOAD W/ DRAG & DROP ================= */}
      <Card
        className={`p-4 bg-gray-800 border-gray-700 transition ${
          isDragging ? "border-blue-500 bg-gray-700" : ""
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-4">
          {!image ? (
            <div
              className={`border border-gray-700 rounded-lg w-full h-60 flex flex-col items-center justify-center cursor-pointer transition ${
                isDragging ? "bg-gray-700 border-blue-500" : "bg-gray-800"
              }`}
              onClick={() => !isUploading && fileRef.current?.click()}
            >
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                  <p className="text-sm text-gray-400 mt-2">Uploading...</p>
                </div>
              ) : (
                <>
                  <ImagePlus className="w-10 h-10 text-gray-400" />
                  <p className="text-sm text-gray-400 mt-2">
                    Drag & Drop Image or Click to Upload
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="relative w-full">
              <img
                src={uploadedImageUrl || image || ""}
                alt="upload"
                className="rounded-lg w-full h-60 object-cover"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
                </div>
              )}
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700"
                onClick={removeImage}
                disabled={isUploading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          <input
            type="file"
            ref={fileRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      </Card>

      {/* ================= CAPTION ================= */}
      <div>
        <label className="text-sm font-medium text-gray-300">Caption</label>
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          className="mt-1 bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500"
        />
      </div>

      {/* ================= LOCATION ================= */}
      <div>
        <label className="text-sm font-medium text-gray-300">Location</label>
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Add location..."
          className="mt-1 bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500"
        />
      </div>

      {/* ================= HASHTAGS ================= */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Hashtags</label>
        <Select onValueChange={addHashtag}>
          <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
            <SelectValue placeholder="Select a hashtag" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
            {hashtagOptions.map((tag) => (
              <SelectItem
                key={tag}
                value={tag}
                className="text-gray-200 focus:bg-gray-700"
              >
                #{tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Chips */}
        <div className="flex flex-wrap gap-2 mt-2">
          {hashtags.map((tag) => (
            <Badge
              key={tag}
              className="flex items-center justify-between w-24 bg-gray-700 text-gray-300 px-2 py-1"
            >
              <span className="truncate text-xs">#{tag}</span>
              <button
                className="p-1 rounded-sm hover:bg-gray-600 transition-colors shrink-0"
                onClick={() => removeHashtag(tag)}
                type="button"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* ================= PREVIEW BUTTON ================= */}
      <PreviewPostDialog
        userName={userName}
        userImage={userImage}
        uploadedImageUrl={uploadedImageUrl}
        image={image}
        caption={caption}
        location={location}
        hashtags={hashtags}
        uploadedImageId={uploadedImageId}
        onPublishComplete={clearForm}
      />
    </div>
  );
}
