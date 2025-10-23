import { useState } from "react";
import { XIcon, UsersIcon, LockIcon, ImageIcon, TagIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroup } from "../lib/api";
import toast from "react-hot-toast";

const CreateGroupModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPrivate: false,
    tags: [],
    avatar: "",
  });
  const [newTag, setNewTag] = useState("");

  const { mutate: createGroupMutation, isPending } = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Group created successfully!");
      handleClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create group");
    },
  });

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      isPrivate: false,
      tags: [],
      avatar: "",
    });
    setNewTag("");
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Group name is required");
      return;
    }
    createGroupMutation(formData);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-base-100 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-base-300">
          <h2 className="text-xl font-bold">Create New Group</h2>
          <button
            onClick={handleClose}
            className="btn btn-ghost btn-sm"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Group Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Group Name *</span>
            </label>
            <input
              type="text"
              placeholder="Enter group name"
              className="input input-bordered w-full"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              maxLength={100}
              required
            />
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Description</span>
            </label>
            <textarea
              placeholder="Describe your group..."
              className="textarea textarea-bordered w-full h-20 resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              maxLength={500}
            />
          </div>

          {/* Privacy Setting */}
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text font-medium">Private Group</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={formData.isPrivate}
                onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
              />
            </label>
            <div className="label">
              <span className="label-text-alt text-base-content opacity-70">
                {formData.isPrivate ? (
                  <>
                    <LockIcon className="w-3 h-3 inline mr-1" />
                    Only invited members can join
                  </>
                ) : (
                  <>
                    <UsersIcon className="w-3 h-3 inline mr-1" />
                    Anyone can discover and join
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Tags</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a tag"
                className="input input-bordered flex-1"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                maxLength={20}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="btn btn-outline"
                disabled={!newTag.trim()}
              >
                <TagIcon className="w-4 h-4" />
              </button>
            </div>
            
            {/* Display Tags */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="badge badge-primary gap-2"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="btn btn-ghost btn-xs p-0 h-auto min-h-0"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Avatar Upload */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Group Avatar</span>
            </label>
            <div className="flex items-center gap-4">
              <div className="avatar">
                <div className="w-16 rounded-full">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Group Avatar" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-primary" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <input
                  type="url"
                  placeholder="Avatar URL (optional)"
                  className="input input-bordered w-full"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-outline flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={isPending || !formData.name.trim()}
            >
              {isPending ? "Creating..." : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
