import Story from "../models/Story.js";
import User from "../models/User.js";
import { getFileInfo } from "../lib/upload.js";

// Create a new story
export async function createStory(req, res) {
  try {
    const { content, mediaType = "text", mediaUrl, thumbnail, duration, size } = req.body;
    const author = req.user.id;

    // Validate that at least content is provided
    if (!content && !mediaUrl) {
      return res.status(400).json({ 
        message: "Story must have at least content or media" 
      });
    }

    const story = await Story.create({
      author,
      content: content || "",
      media: {
        type: mediaType,
        url: mediaUrl || "",
        thumbnail: thumbnail || "",
        duration: duration || 0,
        size: size || 0,
      },
    });

    // Populate author details
    await story.populate("author", "fullName profilePic");

    res.status(201).json(story);
  } catch (error) {
    console.error("Error in createStory controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get stories for the home feed (friends' stories)
export async function getStoriesFeed(req, res) {
  try {
    const currentUserId = req.user.id;
    
    // Get current user's friends
    const user = await User.findById(currentUserId).select("friends");
    const friendIds = user.friends;

    // Get active stories from friends
    const stories = await Story.find({
      author: { $in: friendIds },
      isActive: true,
      expiresAt: { $gt: new Date() },
    })
      .populate("author", "fullName profilePic")
      .sort({ createdAt: -1 });

    // Group stories by author
    const storiesByAuthor = {};
    stories.forEach((story) => {
      const authorId = story.author._id.toString();
      if (!storiesByAuthor[authorId]) {
        storiesByAuthor[authorId] = {
          author: story.author,
          stories: [],
          hasUnviewed: false,
        };
      }
      
      const hasViewed = story.hasUserViewed(currentUserId);
      storiesByAuthor[authorId].stories.push({
        ...story.toObject(),
        hasViewed,
      });
      
      if (!hasViewed) {
        storiesByAuthor[authorId].hasUnviewed = true;
      }
    });

    res.status(200).json(Object.values(storiesByAuthor));
  } catch (error) {
    console.error("Error in getStoriesFeed controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get user's own stories
export async function getMyStories(req, res) {
  try {
    const userId = req.user.id;

    const stories = await Story.find({
      author: userId,
      isActive: true,
      expiresAt: { $gt: new Date() },
    })
      .populate("author", "fullName profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(stories);
  } catch (error) {
    console.error("Error in getMyStories controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// View a story
export async function viewStory(req, res) {
  try {
    const { storyId } = req.params;
    const userId = req.user.id;

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    if (!story.isActive || story.expiresAt < new Date()) {
      return res.status(400).json({ message: "Story has expired" });
    }

    await story.addView(userId);
    
    res.status(200).json({ message: "Story viewed successfully" });
  } catch (error) {
    console.error("Error in viewStory controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Delete a story
export async function deleteStory(req, res) {
  try {
    const { storyId } = req.params;
    const userId = req.user.id;

    const story = await Story.findOne({
      _id: storyId,
      author: userId,
    });

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    story.isActive = false;
    await story.save();

    res.status(200).json({ message: "Story deleted successfully" });
  } catch (error) {
    console.error("Error in deleteStory controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Upload story media
export async function uploadStoryMedia(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileInfo = getFileInfo(req.file);
    
    res.status(200).json({
      message: "File uploaded successfully",
      file: fileInfo,
    });
  } catch (error) {
    console.error("Error in uploadStoryMedia controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Clean up expired stories (can be called periodically)
export async function cleanupExpiredStories(req, res) {
  try {
    const result = await Story.updateMany(
      { expiresAt: { $lt: new Date() } },
      { isActive: false }
    );

    res.status(200).json({ 
      message: "Expired stories cleaned up", 
      updatedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error("Error in cleanupExpiredStories controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
