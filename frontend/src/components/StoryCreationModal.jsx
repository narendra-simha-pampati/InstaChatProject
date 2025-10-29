import { useState, useRef, useEffect } from "react";
import { XIcon, ImageIcon, VideoIcon, TypeIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStory, uploadStoryMedia } from "../lib/api";
import toast from "react-hot-toast";

const StoryCreationModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { mutate: uploadMediaMutation } = useMutation({
    mutationFn: uploadStoryMedia,
    onSuccess: (data) => {
      createStoryMutation({
        content: content.trim(),
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
      handleClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add story");
      setIsUploading(false);
    },
  });

  const handleClose = () => {
    setContent("");
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  const handleFileSelect = (event) => {
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

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (!content.trim() && !selectedFile) {
      toast.error("Please add some content or select a file");
      return;
    }

    if (content.length > 500) {
      toast.error("Story content must be less than 500 characters");
      return;
    }

    setIsUploading(true);

    if (selectedFile) {
      uploadMediaMutation(selectedFile);
    } else {
      createStoryMutation({ content: content.trim() });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-base-100 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <h2 className="text-xl font-bold">Create Story</h2>
          <button
            onClick={handleClose}
            className="btn btn-ghost btn-sm"
            disabled={isUploading}
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Text Input */}
          <div>
            <label className="label">
              <span className="label-text">What's on your mind?</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full h-24 resize-none"
              placeholder="Share your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={500}
              disabled={isUploading}
            />
            <div className="label">
              <span className="label-text-alt">{content.length}/500 characters</span>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="label">
              <span className="label-text">Add Media (Optional)</span>
            </label>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-outline flex-1"
                disabled={isUploading}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Choose File
              </button>
            </div>
          </div>

          {/* Preview */}
          {previewUrl && (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="absolute top-2 right-2 btn btn-sm btn-circle btn-error"
                disabled={isUploading}
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-base-300">
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="btn btn-outline flex-1"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="btn btn-primary flex-1"
              disabled={isUploading || (!content.trim() && !selectedFile)}
            >
              {isUploading ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2" />
                  Posting...
                </>
              ) : (
                <>
                  <TypeIcon className="w-4 h-4 mr-2" />
                  Post Story
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryCreationModal;

