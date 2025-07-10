const express = require("express");
const router = express.Router();
const {
  startConversation,
  sendMessage,
  getConversationHistory,
  requestHandoff,
  endConversation,
} = require("../controllers/chatController");

// Middleware for rate limiting (simple implementation)
const rateLimiter = (req, res, next) => {
  // Simple rate limiting - can be enhanced with redis
  const ip = req.ip;
  const now = Date.now();

  if (!req.app.locals.rateLimitStore) {
    req.app.locals.rateLimitStore = new Map();
  }

  const userRequests = req.app.locals.rateLimitStore.get(ip) || [];
  const recentRequests = userRequests.filter(time => now - time < 60000); // 1 minute window

  if (recentRequests.length >= 30) {
    // 30 requests per minute
    return res.status(429).json({
      success: false,
      message: "Too many requests. Please wait a moment.",
    });
  }

  recentRequests.push(now);
  req.app.locals.rateLimitStore.set(ip, recentRequests);

  next();
};

// Middleware to validate session
const validateSession = (req, res, next) => {
  const { sessionId } = req.body || req.params;

  if (!sessionId) {
    return res.status(400).json({
      success: false,
      message: "Session ID is required",
    });
  }

  next();
};

// Routes
router.post("/start", rateLimiter, startConversation);
router.post("/message", rateLimiter, validateSession, sendMessage);
router.get("/history/:sessionId", validateSession, getConversationHistory);
router.post("/handoff", validateSession, requestHandoff);
router.post("/end", validateSession, endConversation);

module.exports = router;
