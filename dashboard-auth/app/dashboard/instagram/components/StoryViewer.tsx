"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Volume2,
  VolumeX,
  Pause,
  Play,
} from "lucide-react";

interface Story {
  userId: string;
  username: string;
  imageUrls: string[];
}

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StoryProgressBar = ({
  duration,
  isPaused,
  onComplete,
}: {
  duration: number;
  isPaused: boolean;
  onComplete: () => void;
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          onComplete();
          return 100;
        }
        return prev + 100 / (duration / 50);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPaused, duration, onComplete]);

  useEffect(() => {
    setProgress(0);
  }, [duration]);

  return (
    <div className="h-1 bg-white/30 rounded-full overflow-hidden">
      <div
        className="h-full bg-white transition-all duration-50"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default function StoryViewer({
  stories,
  initialIndex,
  open,
  onOpenChange,
}: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setCurrentImageIndex(0);
  }, [initialIndex]);

  const handleNext = () => {
    const currentStory = stories[currentIndex];
    if (currentImageIndex < currentStory.imageUrls.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentImageIndex(0);
    } else {
      onOpenChange(false);
    }
  };

  const handlePrev = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentImageIndex(stories[currentIndex - 1].imageUrls.length - 1);
    }
  };

  const currentStory = stories[currentIndex];
  const currentImage = currentStory?.imageUrls[currentImageIndex];

  if (!currentStory) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md h-[90vh] p-6 bg-gradient-to-br from-purple-900 via-black to-pink-900 border-none overflow-hidden">
        <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl bg-black">
          {/* Story Image */}
          <div className="absolute inset-0">
            <img
              src={currentImage}
              alt="Story"
              className="w-full h-full object-contain bg-black"
            />
          </div>

          {/* Gradient Overlays */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

          {/* Progress Bars */}
          <div className="absolute top-3 left-3 right-3 flex gap-1.5 z-10">
            {currentStory.imageUrls.map((_, index) => (
              <div key={index} className="flex-1">
                {index < currentImageIndex ? (
                  <div className="h-1 bg-white rounded-full shadow-lg" />
                ) : index === currentImageIndex ? (
                  <StoryProgressBar
                    duration={5000}
                    isPaused={isPaused}
                    onComplete={handleNext}
                  />
                ) : (
                  <div className="h-1 bg-white/30 rounded-full" />
                )}
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-7 left-4 right-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5 shadow-lg">
                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-white font-semibold text-lg">
                  {currentStory.username.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <p className="text-white font-bold text-sm drop-shadow-lg">
                  {currentStory.username}
                </p>
                <p className="text-white/80 text-xs drop-shadow-md">now</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="text-white hover:scale-110 transition-transform bg-black/30 backdrop-blur-sm p-2 rounded-full hover:bg-black/50"
              >
                {isPaused ? <Play size={18} /> : <Pause size={18} />}
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:scale-110 transition-transform bg-black/30 backdrop-blur-sm p-2 rounded-full hover:bg-black/50"
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <button
                onClick={() => onOpenChange(false)}
                className="text-white hover:scale-110 transition-transform bg-black/30 backdrop-blur-sm p-2 rounded-full hover:bg-black/50"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Navigation Areas */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-0 bottom-0 w-1/3 cursor-pointer"
            disabled={currentIndex === 0 && currentImageIndex === 0}
          />
          <button
            onClick={handleNext}
            className="absolute right-0 top-0 bottom-0 w-1/3 cursor-pointer"
          />

          {/* Navigation Buttons */}
          {(currentIndex > 0 || currentImageIndex > 0) && (
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          {(currentIndex < stories.length - 1 ||
            currentImageIndex < currentStory.imageUrls.length - 1) && (
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Reply Input */}
          <div className="absolute bottom-4 left-4 right-4">
            <input
              type="text"
              placeholder={`Reply to ${currentStory.username}...`}
              className="w-full bg-transparent border border-white/50 rounded-full px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:border-white"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
