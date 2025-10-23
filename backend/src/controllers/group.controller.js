import Group from "../models/Group.js";
import User from "../models/User.js";

// Create a new group
export async function createGroup(req, res) {
  try {
    const { name, description, isPrivate, tags, avatar } = req.body;
    const creatorId = req.user.id;

    // Validate required fields
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "Group name is required" });
    }

    const group = await Group.create({
      name: name.trim(),
      description: description?.trim() || "",
      creator: creatorId,
      members: [{
        user: creatorId,
        role: "admin",
        joinedAt: new Date(),
        isActive: true,
      }],
      admins: [creatorId],
      settings: {
        isPrivate: isPrivate || false,
        allowMemberInvites: true,
        allowFileSharing: true,
        maxMembers: 100,
      },
      avatar: avatar || "",
      tags: tags || [],
    });

    // Populate creator details
    await group.populate("creator", "fullName profilePic");
    await group.populate("members.user", "fullName profilePic");

    res.status(201).json(group);
  } catch (error) {
    console.error("Error in createGroup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get user's groups
export async function getMyGroups(req, res) {
  try {
    const userId = req.user.id;

    const groups = await Group.find({
      "members.user": userId,
      "members.isActive": true,
      isActive: true,
    })
      .populate("creator", "fullName profilePic")
      .populate("members.user", "fullName profilePic")
      .populate("lastMessage.sender", "fullName profilePic")
      .sort({ "lastMessage.sentAt": -1, updatedAt: -1 });

    res.status(200).json(groups);
  } catch (error) {
    console.error("Error in getMyGroups controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get public groups (for discovery)
export async function getPublicGroups(req, res) {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, search = "", tags = [] } = req.query;

    const query = {
      isActive: true,
      "settings.isPrivate": false,
      "members.user": { $ne: userId }, // Exclude groups user is already in
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (tags.length > 0) {
      query.tags = { $in: tags };
    }

    const groups = await Group.find(query)
      .populate("creator", "fullName profilePic")
      .populate("members.user", "fullName profilePic")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Group.countDocuments(query);

    res.status(200).json({
      groups,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error in getPublicGroups controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get group details
export async function getGroupDetails(req, res) {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    const group = await Group.findById(groupId)
      .populate("creator", "fullName profilePic")
      .populate("members.user", "fullName profilePic")
      .populate("admins", "fullName profilePic")
      .populate("moderators", "fullName profilePic");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.isMember(userId)) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    res.status(200).json(group);
  } catch (error) {
    console.error("Error in getGroupDetails controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Join a group
export async function joinGroup(req, res) {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.isMember(userId)) {
      return res.status(400).json({ message: "You are already a member of this group" });
    }

    if (group.settings.isPrivate) {
      return res.status(403).json({ message: "This is a private group" });
    }

    if (group.memberCount >= group.settings.maxMembers) {
      return res.status(400).json({ message: "Group is full" });
    }

    await group.addMember(userId, "member");

    res.status(200).json({ message: "Successfully joined the group" });
  } catch (error) {
    console.error("Error in joinGroup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Leave a group
export async function leaveGroup(req, res) {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.isMember(userId)) {
      return res.status(400).json({ message: "You are not a member of this group" });
    }

    // If user is the creator, transfer ownership to another admin
    if (group.creator.toString() === userId.toString()) {
      const otherAdmins = group.admins.filter(admin => admin.toString() !== userId.toString());
      if (otherAdmins.length > 0) {
        group.creator = otherAdmins[0];
      } else {
        // If no other admins, make the group inactive
        group.isActive = false;
      }
    }

    await group.removeMember(userId);

    res.status(200).json({ message: "Successfully left the group" });
  } catch (error) {
    console.error("Error in leaveGroup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Invite user to group
export async function inviteToGroup(req, res) {
  try {
    const { groupId } = req.params;
    const { userId: inviteeId } = req.body;
    const inviterId = req.user.id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.isMember(inviterId)) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    if (!group.settings.allowMemberInvites && !group.isAdmin(inviterId)) {
      return res.status(403).json({ message: "Member invites are not allowed" });
    }

    const invitee = await User.findById(inviteeId);
    if (!invitee) {
      return res.status(404).json({ message: "User not found" });
    }

    if (group.isMember(inviteeId)) {
      return res.status(400).json({ message: "User is already a member of this group" });
    }

    if (group.memberCount >= group.settings.maxMembers) {
      return res.status(400).json({ message: "Group is full" });
    }

    await group.addMember(inviteeId, "member");

    res.status(200).json({ message: "User successfully invited to the group" });
  } catch (error) {
    console.error("Error in inviteToGroup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Update group settings
export async function updateGroupSettings(req, res) {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.isAdmin(userId)) {
      return res.status(403).json({ message: "Only admins can update group settings" });
    }

    // Update allowed fields
    if (updates.name) group.name = updates.name.trim();
    if (updates.description !== undefined) group.description = updates.description.trim();
    if (updates.avatar !== undefined) group.avatar = updates.avatar;
    if (updates.tags) group.tags = updates.tags;
    if (updates.settings) {
      group.settings = { ...group.settings, ...updates.settings };
    }

    await group.save();

    res.status(200).json({ message: "Group settings updated successfully" });
  } catch (error) {
    console.error("Error in updateGroupSettings controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Delete group
export async function deleteGroup(req, res) {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.creator.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only the group creator can delete the group" });
    }

    group.isActive = false;
    await group.save();

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error("Error in deleteGroup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
