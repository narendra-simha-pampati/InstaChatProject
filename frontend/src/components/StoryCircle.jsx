import { useState, useRef } from "react";
import { PlusIcon, PlayIcon, ImageIcon, VideoIcon, XIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStory, uploadStoryMedia } from "../lib/api";
import toast from "react-hot-toast";

const StoryCircle = ({ story, isOwn = false, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const hasUnviewed = story?.hasUnviewed;
  const storyCount = story?.stories?.length || 0;

  return (
    <div
      className="flex flex-col items-center cursor-pointer group"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Story circle with gradient border for unviewed stories */}
        <div
          className={`w-16 h-16 rounded-full p-0.5 transition-all duration-200 ${
            hasUnviewed
              ? "bg-gradient-to-tr from-primary via-secondary to-accent"
              : "bg-base-300"
          } ${isHovered ? "scale-105" : ""}`}
        >
          <div className="w-full h-full rounded-full bg-base-100 flex items-center justify-center overflow-hidden">
            {isOwn ? (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <PlusIcon className="w-6 h-6 text-primary" />
              </div>
            ) : (
              <img
                src={story?.author?.profilePic || "/default-avatar.png"}
                alt={story?.author?.fullName}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
        
        {/* Story count indicator */}
        {storyCount > 1 && (
          <div className="absolute -top-1 -right-1 bg-primary text-primary-content text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {storyCount}
          </div>
        )}
        
        {/* Play icon for unviewed stories */}
        {hasUnviewed && !isOwn && (
          <div className="absolute -bottom-1 -right-1 bg-accent text-accent-content rounded-full w-5 h-5 flex items-center justify-center">
            <PlayIcon className="w-3 h-3" />
          </div>
        )}
      </div>
      
      {/* Username */}
      <span className="text-xs mt-2 text-center max-w-16 truncate group-hover:text-primary transition-colors">
        {isOwn ? "Your Story" : story?.author?.fullName}
      </span>
    </div>
  );
};

const AddStoryButton = ({ onAddStory }) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const { mutate: uploadMediaMutation } = useMutation({
    mutationFn: uploadStoryMedia,
    onSuccess: (data) => {
      // Create story with uploaded media
      createStoryMutation({
        content: "",
        mediaType: data.file.type,
        mediaUrl: data.file.url,
        thumbnail: data.file.type === "video" ? data.file.url : "",
        duration: data.file.type === "video" ? 0 : 0,
        size: data.file.size,
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to upload media");
      setIsUploading(false);
    },
  });

  const { mutate: createStoryMutation } = useMutation({
    mutationFn: createStory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      toast.success("Story added successfully!");
      setIsUploading(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add story");
      setIsUploading(false);
    },
  });

  const handleAddStory = () => {
    const content = prompt("What's on your mind? (Max 500 characters)");
    if (content && content.trim()) {
      if (content.length > 500) {
        toast.error("Story content must be less than 500 characters");
        return;
      }
      createStoryMutation({ content: content.trim() });
    }
  };

  const handleMediaUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "video/mp4", "video/mov", "video/avi", "video/webm"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select an image or video file");
      return;
    }

    // Validate file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File size must be less than 50MB");
      return;
    }

    setIsUploading(true);
    uploadMediaMutation(file);
  };

  return (
    <>
      <div className="flex flex-col items-center cursor-pointer group">
        <div className="relative">
          <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-primary via-secondary to-accent">
            <div className="w-full h-full rounded-full bg-base-100 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                {isUploading ? (
                  <span className="loading loading-spinner loading-sm text-primary" />
                ) : (
                  <PlusIcon className="w-6 h-6 text-primary" />
                )}
              </div>
            </div>
          </div>
        </div>
        
        <span className="text-xs mt-2 text-center max-w-16 truncate group-hover:text-primary transition-colors">
          Your Story
        </span>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Story creation options */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-base-100 rounded-xl shadow-lg border border-base-300 p-2 z-10 hidden group-hover:block">
        <div className="flex gap-2">
          <button
            onClick={handleAddStory}
            className="btn btn-sm btn-outline"
            disabled={isUploading}
          >
            <ImageIcon className="w-4 h-4 mr-1" />
            Text
          </button>
          <button
            onClick={handleMediaUpload}
            className="btn btn-sm btn-outline"
            disabled={isUploading}
          >
            <VideoIcon className="w-4 h-4 mr-1" />
            Media
          </button>
        </div>
      </div>
    </>
  );
};

export default StoryCircle;
export { AddStoryButton };
