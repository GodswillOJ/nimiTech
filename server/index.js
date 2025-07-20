const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

// Debug: Check if environment variables are loaded
console.log("Environment check:");

// Now import modules that depend on environment variables
const blogRoutes = require("./routes/blogRoutes");
const businessRoutes = require("./routes/businessRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const careersRoutes = require("./routes/careersRoutes");
const chatRoutes = require("./routes/chatRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { handleJsonParsingError } = require("./controllers/authController");
const connectDB = require("./config/db");

connectDB();

const app = express();
const server = http.createServer(app);

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
      "https://nimitech-demo.onrender.com",
    ];
    if (process.env.CORS_ORIGIN && !allowedOrigins.includes(process.env.CORS_ORIGIN)) {
      allowedOrigins.push(process.env.CORS_ORIGIN);
    }

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

// Socket.IO setup
const io = new Server(server, {
  cors: corsOptions,
  transports: ["websocket", "polling"],
});

// Make io available to routes
app.set("io", io);

// Socket.IO connection handling
io.on("connection", socket => {
  console.log("Client connected:", socket.id);

  // Join conversation room
  socket.on("join_conversation", sessionId => {
    socket.join(sessionId);
    console.log(`Socket ${socket.id} joined conversation ${sessionId}`);
  });

  // Handle typing indicators
  socket.on("typing_start", data => {
    socket.to(data.sessionId).emit("user_typing", { typing: true });
  });

  socket.on("typing_stop", data => {
    socket.to(data.sessionId).emit("user_typing", { typing: false });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Handle preflight requests explicitly
app.options("*", cors(corsOptions));

app.use(cookieParser()); // Parse cookies

// Add caching middleware
const cacheMiddleware = require("./middleware/cacheMiddleware");
app.use(cacheMiddleware);

// Skip JSON parsing for file upload routes
app.use((req, res, next) => {
  // Skip JSON parsing for file upload endpoints only (not job application)
  if (
    req.path.includes("/upload-avatar") ||
    req.path.includes("/upload-image") ||
    req.path.includes("/upload-resume") ||
    req.path.includes("/upload-cover-letter")
  ) {
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
app.use("/api/careers", careersRoutes);
app.use("/api/chat", chatRoutes);

// Serve uploads under API path for consistency with optimized caching
app.use(
  "/api/uploads",
  (req, res, next) => {
    // Add CORS headers for static files
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  },
  express.static(path.join(__dirname, "/uploads"), {
    maxAge: "1y",
    etag: true,
    lastModified: true,
    cacheControl: true,
    setHeaders: (res, filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      if ([".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"].includes(ext)) {
        res.set("Cache-Control", "public, max-age=31536000, immutable");
      } else {
        res.set("Cache-Control", "public, max-age=2592000");
      }
    },
  })
);

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

// Static file serving with optimized caching
app.use(
  "/uploads",
  (req, res, next) => {
    // Add CORS headers for static files
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  },
  express.static(path.join(__dirname, "/uploads"), {
    maxAge: "1y", // Cache images for 1 year
    etag: true,
    lastModified: true,
    cacheControl: true,
    setHeaders: (res, filePath) => {
      // Different caching strategies based on file type
      const ext = path.extname(filePath).toLowerCase();
      if ([".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"].includes(ext)) {
        // Images - cache for 1 year (they rarely change)
        res.set("Cache-Control", "public, max-age=31536000, immutable");
      } else if ([".css", ".js"].includes(ext)) {
        // CSS/JS - cache for 1 month
        res.set("Cache-Control", "public, max-age=2592000");
      } else {
        // Other files - cache for 1 week
        res.set("Cache-Control", "public, max-age=604800");
      }
    },
  })
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

// Root route
app.get("/", (req, res) => {
  res.json({ message: "NimiTech API Server is live." });
});

app.use(notFound);
app.use(handleJsonParsingError);
app.use(errorHandler);

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);

  // Seed knowledge base on startup (development only)
  if (process.env.NODE_ENV !== "production") {
    const { seedKnowledgeBase } = require("./utils/seedKnowledgeBase");
    seedKnowledgeBase();
  }

  // Start heartbeat pinging in production to prevent server from sleeping
  if (process.env.NODE_ENV === "production") {
    startHeartbeat();
  }
});

// Heartbeat function to keep server alive
function startHeartbeat() {
  const HEARTBEAT_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
  const SERVER_URL = "https://nimitech-website.onrender.com" || `http://localhost:${PORT}`;

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
