import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import session from "express-session";
import passport from "passport";
import "./config/passport.js";   // make sure this path is correct
import MongoStore from 'connect-mongo';
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import storyRoutes from "./routes/story.route.js";
import groupRoutes from "./routes/group.route.js";

import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 5001;

const __dirname = path.resolve();

// ⬇️ MODIFIED: Set the CORS origin to allow the live railway domain and localhost ⬇️
// This ensures that your frontend and backend can communicate in production.
const CORS_ORIGIN = process.env.CORS_ORIGIN || `https://instachatproject-production.up.railway.app`;

app.use(
  cors({
    origin: CORS_ORIGIN, // Use the dynamically set origin
    credentials: true, // allow frontend to send cookies
  })
);
// ⬆️ END MODIFIED SECTION ⬆️

// session middleware (must be before passport)
// The SESSION_SECRET check is essential and was likely crashing the server earlier.
const SESSION_SECRET = process.env.SESSION_SECRET;

// ⬇️ MODIFIED: Crash defense for missing SESSION_SECRET ⬇️
// This is added to prevent a crash if SESSION_SECRET is not set in Railway.
if (!SESSION_SECRET) {
    console.error("CRITICAL ERROR: SESSION_SECRET environment variable is not set.");
    process.exit(1); // Stop deployment if a critical secret is missing
}
// ⬆️ END MODIFIED SECTION ⬆️

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 14 * 24 * 60 * 60,
    }),
    secret: SESSION_SECRET, // Use the checked secret
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cookieParser());

// Serve static files (for uploaded media)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/groups", groupRoutes);

// ⬇️ CORRECTED STATIC FILE SERVING BLOCK ⬇️
// ⬇️ With this corrected, reliable block: ⬇️
if (process.env.NODE_ENV === "production") {
  // CORRECTED PATH: Use path.resolve(process.cwd()) to reliably point to the
  // project root (/app), then append the correct path to frontend/dist.
  const staticPath = path.resolve(process.cwd(), "frontend", "dist");
  
  app.use(express.static(staticPath));

  app.get("*", (req, res, next) => { 
    // This serves the frontend's index.html for all non-API and non-static asset requests.
    if (path.extname(req.url).length > 0) return next();
    res.sendFile(path.join(staticPath, "index.html"));
  });
}
// ⬆️ END CORRECTED SECTION ⬆️

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});