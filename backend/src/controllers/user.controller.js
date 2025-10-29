import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";
import { getFileInfo } from "../lib/upload.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, //exclude current user
        { _id: { $nin: currentUser.friends } }, // exclude current user's friends
        { isOnboarded: true },
      ],
    });
    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error in getRecommendedUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate("friends", "fullName profilePic location bio");

    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error in getMyFriends controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    // prevent sending req to yourself
    if (myId === recipientId) {
      return res.status(400).json({ message: "You can't send friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // check if user is already friends
    if (recipient.friends.includes(myId)) {
      return res.status(400).json({ message: "You are already friends with this user" });
    }

    // check if a req already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "A friend request already exists between you and this user" });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Error in sendFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Verify the current user is the recipient
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // add each user to the other's friends array
    // $addToSet: adds elements to an array only if they do not already exist.
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.log("Error in acceptFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getFriendRequests(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", "fullName profilePic location bio");

    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    console.log("Error in getPendingFriendRequests controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic location bio");

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getUserProfile(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .select("fullName profilePic bio location nativeLanguage learningLanguage friends createdAt");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserProfile controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function uploadProfilePicture(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user.id;
    const fileInfo = getFileInfo(req.file);
    
    // Update user's profile picture
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePic: fileInfo.url },
      { new: true }
    ).select("fullName profilePic email");

    res.status(200).json({
      message: "Profile picture updated successfully",
      profilePic: fileInfo.url,
      user,
    });
  } catch (error) {
    console.error("Error in uploadProfilePicture controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMutualFriends(req, res) {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    // Get current user's friends
    const currentUser = await User.findById(currentUserId).select("friends");
    const currentUserFriends = currentUser.friends;

    // Get target user's friends
    const targetUser = await User.findById(userId).select("friends");
    const targetUserFriends = targetUser.friends;

    // Find mutual friends
    const mutualFriendIds = currentUserFriends.filter(friendId =>
      targetUserFriends.some(targetFriendId =>
        friendId.toString() === targetFriendId.toString()
      )
    );

    // Get mutual friends details
    const mutualFriends = await User.find({
      _id: { $in: mutualFriendIds }
    }).select("fullName profilePic");

    res.status(200).json(mutualFriends);
  } catch (error) {
    console.error("Error in getMutualFriends controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getNotificationPreferences(req, res) {
  try {
    const user = await User.findById(req.user.id).select("notificationPreferences");
    res.status(200).json(user.notificationPreferences);
  } catch (error) {
    console.error("Error in getNotificationPreferences controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateNotificationPreferences(req, res) {
  try {
    const { preferences } = req.body;
    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { notificationPreferences: preferences },
      { new: true }
    ).select("notificationPreferences");

    res.status(200).json({
      message: "Notification preferences updated successfully",
      preferences: user.notificationPreferences,
    });
  } catch (error) {
    console.error("Error in updateNotificationPreferences controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
