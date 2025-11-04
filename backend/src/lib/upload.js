import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directories exist
const uploadDir = path.join(process.cwd(), "uploads");
const storiesDir = path.join(uploadDir, "stories");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(storiesDir)) {
  fs.mkdirSync(storiesDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, storiesDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `story-${uniqueSuffix}${ext}`);
  },
});

// File filter to allow only images and videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|webm/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed!"));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: fileFilter,
});

// Middleware for single file upload
export const uploadSingle = upload.single("media");

// Helper function to get file URL
export const getFileUrl = (filename) => {
  if (!filename) return "";
  const baseUrl = process.env.BASE_URL || "http://localhost:5001";
  return `${baseUrl}/uploads/stories/${filename}`;
};

// Helper function to delete file
export const deleteFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(storiesDir, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// Helper function to get file info
export const getFileInfo = (file) => {
  if (!file) return null;
  
  const ext = path.extname(file.originalname).toLowerCase();
  const isImage = /\.(jpg|jpeg|png|gif)$/.test(ext);
  const isVideo = /\.(mp4|mov|avi|webm)$/.test(ext);
  
  return {
    type: isImage ? "image" : isVideo ? "video" : "unknown",
    size: file.size,
    filename: file.filename,
    originalName: file.originalname,
    url: getFileUrl(file.filename),
  };
};
