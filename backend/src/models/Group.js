import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 500,
      default: "",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["admin", "moderator", "member"],
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    moderators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    settings: {
      isPrivate: {
        type: Boolean,
        default: false,
      },
      allowMemberInvites: {
        type: Boolean,
        default: true,
      },
      allowFileSharing: {
        type: Boolean,
        default: true,
      },
      maxMembers: {
        type: Number,
        default: 100,
      },
    },
    avatar: {
      type: String,
      default: "",
    },
    tags: [
      {
        type: String,
        maxlength: 20,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastMessage: {
      content: String,
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      sentAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  { timestamps: true }
);

// Indexes for better performance
groupSchema.index({ creator: 1 });
groupSchema.index({ "members.user": 1 });
groupSchema.index({ tags: 1 });
groupSchema.index({ isActive: 1 });

// Virtual for member count
groupSchema.virtual("memberCount").get(function () {
  return this.members.filter(member => member.isActive).length;
});

// Virtual for admin count
groupSchema.virtual("adminCount").get(function () {
  return this.admins.length;
});

// Method to check if user is member
groupSchema.methods.isMember = function (userId) {
  return this.members.some(
    member => member.user.toString() === userId.toString() && member.isActive
  );
};

// Method to check if user is admin
groupSchema.methods.isAdmin = function (userId) {
  return this.admins.some(admin => admin.toString() === userId.toString());
};

// Method to check if user is moderator
groupSchema.methods.isModerator = function (userId) {
  return this.moderators.some(mod => mod.toString() === userId.toString());
};

// Method to add member
groupSchema.methods.addMember = function (userId, role = "member") {
  if (!this.isMember(userId)) {
    this.members.push({
      user: userId,
      role: role,
      joinedAt: new Date(),
      isActive: true,
    });
    
    if (role === "admin") {
      this.admins.push(userId);
    } else if (role === "moderator") {
      this.moderators.push(userId);
    }
    
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove member
groupSchema.methods.removeMember = function (userId) {
  this.members = this.members.map(member => {
    if (member.user.toString() === userId.toString()) {
      member.isActive = false;
    }
    return member;
  });
  
  this.admins = this.admins.filter(admin => admin.toString() !== userId.toString());
  this.moderators = this.moderators.filter(mod => mod.toString() !== userId.toString());
  
  return this.save();
};

// Method to update member role
groupSchema.methods.updateMemberRole = function (userId, newRole) {
  const member = this.members.find(m => m.user.toString() === userId.toString());
  if (member) {
    member.role = newRole;
    
    // Update admin/moderator arrays
    if (newRole === "admin") {
      if (!this.admins.includes(userId)) {
        this.admins.push(userId);
      }
      this.moderators = this.moderators.filter(mod => mod.toString() !== userId.toString());
    } else if (newRole === "moderator") {
      if (!this.moderators.includes(userId)) {
        this.moderators.push(userId);
      }
      this.admins = this.admins.filter(admin => admin.toString() !== userId.toString());
    } else {
      this.admins = this.admins.filter(admin => admin.toString() !== userId.toString());
      this.moderators = this.moderators.filter(mod => mod.toString() !== userId.toString());
    }
    
    return this.save();
  }
  return Promise.resolve(this);
};

const Group = mongoose.model("Group", groupSchema);

export default Group;
