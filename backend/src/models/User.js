import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minlength: 6,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // allows either Google or password login
    },
    bio: {
      type: String,
      default: "",
    },
    profilePic: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationOTP: {
      type: String,
    },
    emailVerificationExpires: {
      type: Date,
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    notificationPreferences: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      pushNotifications: {
        type: Boolean,
        default: false,
      },
      friendRequests: {
        type: Boolean,
        default: true,
      },
      storyViews: {
        type: Boolean,
        default: true,
      },
      groupInvites: {
        type: Boolean,
        default: true,
      },
      videoCalls: {
        type: Boolean,
        default: true,
      },
      showUnreadBadges: {
        type: Boolean,
        default: true,
      },
      showLastMessagePreview: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true }
);

// Hash password only if it exists and is modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password (only for local login users)
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false; // Google users may not have passwords
  const isPasswordCorrect = await bcrypt.compare(
    enteredPassword,
    this.password
  );
  return isPasswordCorrect;
};

const User = mongoose.model("User", userSchema);

export default User;
