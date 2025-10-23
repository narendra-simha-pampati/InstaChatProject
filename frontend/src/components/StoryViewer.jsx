import { useState, useEffect } from "react";
import { XIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { viewStory, deleteStory } from "../lib/api";
import toast from "react-hot-toast";

const StoryViewer = ({ stories, onClose, initialIndex = 0 }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const queryClient = useQueryClient();

  const currentStory = stories[currentStoryIndex];
  const isOwnStory = currentStory?.isOwn;

  const { mutate: viewStoryMutation } = useMutation({
    mutationFn: viewStory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });

  const { mutate: deleteStoryMutation } = useMutation({
    mutationFn: deleteStory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      toast.success("Story deleted successfully!");
      handleNext();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete story");
    },
  });

  // Auto-progress and story viewing
  useEffect(() => {
    if (!isPlaying || !currentStory) return;

    // Mark story as viewed if not already viewed
    if (!currentStory.hasViewed && !isOwnStory) {
      viewStoryMutation(currentStory._id);
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 2; // 5 seconds total (100 / 2 = 50 intervals of 100ms)
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, currentStory, currentStoryIndex]);

  const handleNext = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setProgress(0);
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this story?")) {
      deleteStoryMutation(currentStory._id);
    }
  };

  if (!currentStory) {
    onClose();
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
      >
        <XIcon className="w-8 h-8" />
      </button>

      {/* Navigation buttons */}
      <button
        onClick={handlePrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors"
        disabled={currentStoryIndex === 0}
      >
        <ChevronLeftIcon className="w-8 h-8" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors"
        disabled={currentStoryIndex === stories.length - 1}
      >
        <ChevronRightIcon className="w-8 h-8" />
      </button>

      {/* Story content */}
      <div className="relative w-full max-w-md mx-4">
        {/* Progress bars */}
        <div className="absolute top-4 left-4 right-4 z-10 flex gap-1">
          {stories.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden"
            >
              <div
                className={`h-full bg-white transition-all duration-100 ${
                  index < currentStoryIndex
                    ? "w-full"
                    : index === currentStoryIndex
                    ? "w-full"
                    : "w-0"
                }`}
                style={{
                  width:
                    index === currentStoryIndex
                      ? `${progress}%`
                      : index < currentStoryIndex
                      ? "100%"
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Story content */}
        <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl overflow-hidden min-h-[600px] flex flex-col">
          {/* Author info */}
          <div className="flex items-center gap-3 p-4 bg-black bg-opacity-30">
            <img
              src={currentStory.author?.profilePic || "/default-avatar.png"}
              alt={currentStory.author?.fullName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="text-white font-semibold">
                {currentStory.author?.fullName}
              </h3>
              <p className="text-white text-sm opacity-70">
                {new Date(currentStory.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            
            {/* Delete button for own stories */}
            {isOwnStory && (
              <button
                onClick={handleDelete}
                className="text-white hover:text-red-400 transition-colors"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Story content */}
          <div className="flex-1 flex items-center justify-center p-6">
            {currentStory.media?.type === "image" && currentStory.media?.url ? (
              <img
                src={currentStory.media.url}
                alt="Story"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            ) : currentStory.media?.type === "video" && currentStory.media?.url ? (
              <video
                src={currentStory.media.url}
                controls
                className="max-w-full max-h-full rounded-lg"
                onPlay={() => setIsPlaying(false)}
                onPause={() => setIsPlaying(true)}
                poster={currentStory.media.thumbnail}
              />
            ) : (
              <div className="text-center">
                <p className="text-white text-lg leading-relaxed">
                  {currentStory.content}
                </p>
              </div>
            )}
          </div>

          {/* View count */}
          <div className="p-4 bg-black bg-opacity-30">
            <p className="text-white text-sm opacity-70">
              {currentStory.viewCount} view{currentStory.viewCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Click areas for navigation */}
      <div
        className="absolute left-0 top-0 w-1/2 h-full cursor-pointer"
        onClick={handlePrevious}
      />
      <div
        className="absolute right-0 top-0 w-1/2 h-full cursor-pointer"
        onClick={handleNext}
      />
    </div>
  );
};

export default StoryViewer;
