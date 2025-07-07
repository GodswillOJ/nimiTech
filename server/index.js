const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");

dotenv.config();

// Debug: Check if environment variables are loaded
console.log("Environment check:");

// Now import modules that depend on environment variables
const blogRoutes = require("./routes/blogRoutes");
const businessRoutes = require("./routes/businessRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { handleJsonParsingError } = require("./controllers/authController");
const connectDB = require("./config/db");

connectDB();

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Created uploads directory");
}

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://nimitechit.com",
      "https://www.nimitechit.com",
    ];
    if (process.env.CORS_ORIGIN && !allowedOrigins.includes(process.env.CORS_ORIGIN)) {
      allowedOrigins.push(process.env.CORS_ORIGIN);
    }

    console.log("CORS Check - Origin:", origin, "Allowed Origins:", allowedOrigins);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("CORS Error - Origin not allowed:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-requested-with",
    "X-Requested-With",
    "X-CSRF-Token",
    "x-csrf-token",
    "Accept",
    "Origin",
    "Cache-Control",
    "X-Requested-With",
  ],
  exposedHeaders: ["set-cookie"],
  optionsSuccessStatus: 200, // For legacy browser support
  preflightContinue: false,
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options("*", cors(corsOptions));

app.use(cookieParser()); // Parse cookies

// Skip JSON parsing for file upload routes
app.use((req, res, next) => {
  // Skip JSON parsing for file upload endpoints
  if (req.path.includes("/upload-avatar") || req.path.includes("/upload-image")) {
    return next();
  }
  express.json({ limit: "10mb" })(req, res, next);
});

app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// API Routes
app.use("/api/blogs", blogRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/newsletter", newsletterRoutes);

// Heartbeat/Health check endpoint
app.get("/api/heartbeat", (req, res) => {
  res.status(200).json({
    status: "alive",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    message: "Server is running",
  });
});

// Uploads (static files) with CORS headers
app.use(
  "/uploads",
  (req, res, next) => {
    // Add CORS headers for static files
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  },
  express.static(path.join(__dirname, "/uploads"))
);

// Debug middleware to log missing static files
app.use("/uploads", (req, res, next) => {
  const filePath = path.join(__dirname, "/uploads", req.path);
  if (!fs.existsSync(filePath)) {
    console.log(`Static file not found: ${filePath}`);
    console.log(`Requested URL: ${req.originalUrl}`);
    return res.status(404).json({
      success: false,
      message: "File not found",
      path: req.path,
    });
  }
  next();
});

// Serve frontend (in production)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.json({ message: "NimiTech API Server is running in development mode" });
  });
}

app.use(notFound);
app.use(handleJsonParsingError);
app.use(errorHandler);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);

  // Start heartbeat pinging in production to prevent server from sleeping
  if (process.env.NODE_ENV === "production") {
    startHeartbeat();
  }
});

// Heartbeat function to keep server alive
function startHeartbeat() {
  const HEARTBEAT_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
  const SERVER_URL = 'https://nimitech-website.onrender.com' || `http://localhost:${PORT}`;

  console.log("Starting heartbeat ping every 5 minutes...");

  setInterval(async () => {
    try {
      const fetch = (await import("node-fetch")).default;
      const response = await fetch(`${SERVER_URL}/api/heartbeat`);

      if (response.ok) {
        const data = await response.json();
        console.log(`Heartbeat ping successful at ${data.timestamp}`);
      } else {
        console.log(`Heartbeat ping failed with status: ${response.status}`);
      }
    } catch (error) {
      console.log(`Heartbeat ping error: ${error.message}`);
    }
  }, HEARTBEAT_INTERVAL);
}
