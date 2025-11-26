import { useState, useCallback, useMemo, useEffect } from "react";
import { State } from "country-state-city";
import {
  uploadInstagramPhoto,
  deleteInstagramPhoto,
  trendingHashtags,
} from "@/services/instagramService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const DEBOUNCE_DELAY = 300;

const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const useInstagramPost = () => {
  const router = useRouter();

  // Form state
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);

  // Upload state
  const [uploadedImageId, setUploadedImageId] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Dropdown state
  const [trendingHashtagsList, setTrendingHashtagsList] = useState<any[]>([]);
  const [showHashtagDropdown, setShowHashtagDropdown] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedLocationIndex, setSelectedLocationIndex] = useState(-1);

  // Memoized values
  const states = useMemo(() => State.getStatesOfCountry("IN"), []);

  const filteredStates = useMemo(() => {
    if (!location) return states;
    const searchTerm = location.toLowerCase();
    return states.filter((state) =>
      state.name.toLowerCase().includes(searchTerm)
    );
  }, [location, states]);

  // API calls
  const fetchTrendingHashtags = useCallback(async () => {
    try {
      const data = await trendingHashtags();
      if (data.success) {
        setTrendingHashtagsList(data.data.trendingHashtags);
      }
    } catch (error) {
      console.error("Failed to fetch trending hashtags:", error);
    }
  }, []);

  const debouncedFetchHashtags = useMemo(
    () => debounce(fetchTrendingHashtags, DEBOUNCE_DELAY),
    [fetchTrendingHashtags]
  );

  // Image handling
  const processImageFile = useCallback(async (file: File) => {
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
      toast.error("Failed to upload image");
      setImage(null);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processImageFile(file);
    },
    [processImageFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) processImageFile(file);
    },
    [processImageFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const removeImage = useCallback(async () => {
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
  }, [uploadedImageId]);

  // Caption handling
  const handleCaptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      const position = e.target.selectionStart;
      setCaption(value);
      setCursorPosition(position);

      const lastHashIndex = value.lastIndexOf("#", position - 1);
      const nextSpaceIndex = value.indexOf(" ", lastHashIndex);

      if (
        lastHashIndex !== -1 &&
        (nextSpaceIndex === -1 || nextSpaceIndex >= position)
      ) {
        setShowHashtagDropdown(true);
        debouncedFetchHashtags();
      } else {
        setShowHashtagDropdown(false);
      }
    },
    [debouncedFetchHashtags]
  );

  const selectHashtag = useCallback(
    (hashtag: string) => {
      const lastHashIndex = caption.lastIndexOf("#", cursorPosition - 1);
      const beforeHash = caption.substring(0, lastHashIndex);
      const afterCursor = caption.substring(cursorPosition);
      const newCaption = `${beforeHash}${hashtag} ${afterCursor}`;
      setCaption(newCaption);
      setShowHashtagDropdown(false);
    },
    [caption, cursorPosition]
  );

  // Location handling
  const handleLocationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocation(value);
      setShowLocationDropdown(!!value);
      setSelectedLocationIndex(-1);
    },
    []
  );

  const handleLocationKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showLocationDropdown) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedLocationIndex((prev) =>
            prev < filteredStates.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedLocationIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedLocationIndex >= 0) {
            setLocation(filteredStates[selectedLocationIndex].name);
            setShowLocationDropdown(false);
            setSelectedLocationIndex(-1);
          }
          break;
        case "Escape":
          setShowLocationDropdown(false);
          setSelectedLocationIndex(-1);
          break;
      }
    },
    [showLocationDropdown, selectedLocationIndex, filteredStates]
  );

  const selectLocation = useCallback((stateName: string) => {
    setLocation(stateName);
    setShowLocationDropdown(false);
    setSelectedLocationIndex(-1);
  }, []);

  // Hashtag management
  const removeHashtag = useCallback((tag: string) => {
    setHashtags((prev) => prev.filter((t) => t !== tag));
  }, []);

  // Form management
  const clearForm = useCallback(() => {
    setImage(null);
    setUploadedImageId(null);
    setUploadedImageUrl(null);
    setCaption("");
    setLocation("");
    setHashtags([]);
    router.push("/dashboard/instagram/feed");
  }, [router]);

  // Effects
  useEffect(() => {
    fetchTrendingHashtags();
  }, [fetchTrendingHashtags]);

  return {
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
    showLocationDropdown,
    filteredStates,
    selectedLocationIndex,
    states,

    // Handlers
    handleImageUpload,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    removeImage,
    handleCaptionChange,
    selectHashtag,
    handleLocationChange,
    handleLocationKeyDown,
    selectLocation,
    setLocation,
    removeHashtag,
    clearForm,
  };
};