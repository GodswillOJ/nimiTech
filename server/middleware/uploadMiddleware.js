const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// Ensure upload directories exist
const ensureUploadDirs = () => {
  const dirs = [
    path.join(__dirname, "../uploads"),
    path.join(__dirname, "../uploads/blog"),
    path.join(__dirname, "../uploads/blog/featured"),
    path.join(__dirname, "../uploads/blog/content"),
    path.join(__dirname, "../uploads/avatars"),
    path.join(__dirname, "../uploads/business"),
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Call this when the module is loaded
ensureUploadDirs();

// Generate secure filename
const generateSecureFilename = originalname => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString("hex");
  const ext = path.extname(originalname).toLowerCase();
  const baseName = path
    .basename(originalname, ext)
    .replace(/[^a-zA-Z0-9]/g, "_")
    .substring(0, 20);

  return `${baseName}_${timestamp}_${randomString}${ext}`;
};

// Configure storage for blog uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { type } = req.body;
    let uploadPath = "uploads/blog"; // default

    switch (type) {
      case "featuredImage":
      case "image":
        uploadPath = "uploads/blog/featured";
        break;
      case "contentImage":
        uploadPath = "uploads/blog/content";
        break;
      case "authorAvatar":
        uploadPath = "uploads/avatars";
        break;
      case "businessImage":
        uploadPath = "uploads/business";
        break;
      default:
        uploadPath = "uploads/blog";
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const secureFilename = generateSecureFilename(file.originalname);
    cb(null, secureFilename);
  },
});

// Configure storage specifically for avatar uploads
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/avatars");
  },
  filename: (req, file, cb) => {
    const secureFilename = generateSecureFilename(file.originalname);
    cb(null, secureFilename);
  },
});

// Enhanced file filter with security checks
const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"), false);
  }

  // Check for allowed image types
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only JPEG, PNG, and WebP images are allowed"), false);
  }

  cb(null, true);
};

// Configure multer with enhanced security for blog uploads
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 3, // Allow multiple files for blog posts
    fields: 20, // Limit number of fields
  },
});

// Configure multer specifically for avatar uploads
const avatarUpload = multer({
  storage: avatarStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for avatars
    files: 1, // Only one avatar at a time
    fields: 5, // Limit number of fields
  },
});

// Multiple file upload configurations
const uploadSingle = upload.single("image");
const uploadAvatar = avatarUpload.single("avatar");
const uploadMultiple = upload.fields([
  { name: "featuredImage", maxCount: 1 },
  { name: "contentImage", maxCount: 1 },
  { name: "authorAvatar", maxCount: 1 },
]);

// Enhanced error handling middleware
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size too large. Maximum size is 10MB.",
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Too many files. Maximum allowed: 3 files.",
      });
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: "Unexpected file field.",
      });
    }
    if (error.code === "LIMIT_FIELD_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Too many form fields.",
      });
    }
  }

  if (error.message === "Only image files are allowed") {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error.message === "Only JPEG, PNG, and WebP images are allowed") {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error.message === "Filename contains invalid characters") {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next(error);
};

// Utility function to delete uploaded files
const deleteFile = filePath => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
};

// Middleware to clean up files on error
const cleanupOnError = (req, res, next) => {
  const originalSend = res.send;

  res.send = function (data) {
    if (res.statusCode >= 400 && req.files) {
      // Delete uploaded files if request failed
      Object.values(req.files)
        .flat()
        .forEach(file => {
          deleteFile(file.path);
        });
    }
    originalSend.call(this, data);
  };

  next();
};

module.exports = {
  upload: uploadSingle,
  uploadAvatar,
  uploadMultiple,
  handleMulterError,
  cleanupOnError,
  deleteFile,
  ensureUploadDirs,
};
