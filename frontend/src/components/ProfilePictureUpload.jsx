import React, { useState } from "react";
import { uploadProfilePicture } from "../lib/api";
import toast from "react-hot-toast";

const ProfilePictureUpload = ({ currentProfilePic, onUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));

    try {
      setIsUploading(true);
      const data = await uploadProfilePicture(file);
      toast.success("Profile picture updated");
      onUpdate && onUpdate(data?.profilePic || null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload");
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="avatar">
        <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl || currentProfilePic || "/i.png"} alt="Profile" />
        </div>
      </div>

      <label className="btn btn-outline btn-sm">
        {isUploading ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          "Change Photo"
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </label>
    </div>
  );
};

export default ProfilePictureUpload;


