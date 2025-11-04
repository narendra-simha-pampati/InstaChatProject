import { useState, useRef, useEffect } from "react";
import { PlusIcon, PlayIcon, ImageIcon, VideoIcon, XIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStory, uploadStoryMedia } from "../lib/api";
import StoryCreationModal from "./StoryCreationModal";
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
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center cursor-pointer group relative">
        <div 
          className="relative"
          onClick={() => setShowModal(true)}
        >
          <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-primary via-secondary to-accent">
            <div className="w-full h-full rounded-full bg-base-100 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <PlusIcon className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        </div>
        
        <span className="text-xs mt-2 text-center max-w-16 truncate group-hover:text-primary transition-colors">
          Your Story
        </span>
      </div>

      {/* Story Creation Modal */}
      <StoryCreationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default StoryCircle;
export { AddStoryButton };
