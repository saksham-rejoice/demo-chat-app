"use client";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Combobox } from "@/components/ui/comboBox";
import { X, ImagePlus } from "lucide-react";
import PreviewPostDialog from "./components/PreviewPostDialog";
import { useUser } from "@/hooks/useUser";
import { useInstagramPost } from "@/hooks/Instagram/useInstagramPost";

const MAX_DROPDOWN_HEIGHT = "max-h-40";

export default function CreateInstagramPost() {
  const { user } = useUser();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const {
    // State
    image,
    caption,
    location,
    hashtags,
    uploadedImageId,
    uploadedImageUrl,
    isUploading,
    isDragging,
    trendingHashtagsList,
    showHashtagDropdown,
    states,

    // Handlers
    handleImageUpload,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    removeImage,
    handleCaptionChange,
    selectHashtag,
    setLocation,
    removeHashtag,
    clearForm,
  } = useInstagramPost();

  const userName = user?.username || "your_username";
  const userImage = undefined;

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6 bg-gray-900 text-gray-200">
      {/* IMAGE UPLOAD SECTION */}
      <Card
        className={`p-4 bg-gray-800 border-gray-700 transition ${
          isDragging ? "border-blue-500 bg-gray-700" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
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
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
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
                src={uploadedImageUrl || image}
                alt="upload"
                className="rounded-lg w-full h-60 object-cover"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white" />
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

          <Input
            type="file"
            ref={fileRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      </Card>

      {/* CAPTION */}
      <div className="relative">
        <label className="text-sm font-medium text-gray-300">Caption</label>
        <Textarea
          value={caption}
          onChange={handleCaptionChange}
          placeholder="Write a caption... (Type # for hashtags)"
          className="mt-1 bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500"
        />
        {showHashtagDropdown && trendingHashtagsList.length > 0 && (
          <div
            className={`absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg ${MAX_DROPDOWN_HEIGHT} overflow-y-auto`}
          >
            {trendingHashtagsList.map((tag, index) => (
              <div
                key={`${tag.hashtag}-${index}`}
                className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-gray-200 text-sm"
                onClick={() => selectHashtag(tag.hashtag)}
              >
                {tag.hashtag} ({tag.count} posts)
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LOCATION */}
      <div>
        <label className="text-sm font-medium text-gray-300">Location</label>
        <div className="mt-1">
          <Combobox
            items={states.map((state) => ({
              value: state.isoCode,
              label: state.name,
            }))}
            value={
              states.find((state) => state.name === location)?.isoCode || ""
            }
            onValueChange={(value) => {
              const selectedState = states.find(
                (state) => state.isoCode === value
              );
              setLocation(selectedState?.name || "");
            }}
            searchValue={location}
            onSearchChange={setLocation}
            onClear={() => setLocation("")}
            placeholder="Search location..."
            inputMode={true}
            className="w-full"
          />
        </div>
      </div>

      {/* HASHTAGS DISPLAY */}
      {hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2">
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
      )}

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
