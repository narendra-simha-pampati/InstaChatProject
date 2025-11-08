import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { login, logout, onboard, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Local auth
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);


router.post("/onboarding", protectRoute, onboard);

// check if user is logged in
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

/* ---------------- GOOGLE AUTH ---------------- */

// Start Google OAuth flow
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONTEND_URL}/login`,
    session: true,
  }),
  (req, res) => {
    // Generate JWT and set as httpOnly cookie to match protectRoute expectations
    const token = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
    });

    // Redirect to frontend app root
    res.redirect(`${FRONTEND_URL}/`);
  }
);

// Logout with Google
router.get("/google/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.redirect(`${FRONTEND_URL}/login`);
  });
});

export default router;

