import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 500,
    },
    media: {
      type: {
        type: String,
        enum: ["text", "image", "video"],
        default: "text",
      },
      url: {
        type: String,
        default: "",
      },
      thumbnail: {
        type: String,
        default: "",
      },
      duration: {
        type: Number, // for videos in seconds
        default: 0,
      },
      size: {
        type: Number, // file size in bytes
        default: 0,
      },
    },
    views: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for better query performance
storySchema.index({ author: 1, expiresAt: 1 });
storySchema.index({ expiresAt: 1 });

// Virtual for view count
storySchema.virtual("viewCount").get(function () {
  return this.views.length;
});

// Method to check if user has viewed the story
storySchema.methods.hasUserViewed = function (userId) {
  return this.views.some((view) => view.user.toString() === userId.toString());
};

// Method to add a view
storySchema.methods.addView = function (userId) {
  if (!this.hasUserViewed(userId)) {
    this.views.push({ user: userId });
    return this.save();
  }
  return Promise.resolve(this);
};

const Story = mongoose.model("Story", storySchema);

export default Story;
