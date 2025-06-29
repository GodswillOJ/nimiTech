const express = require("express");
const router = express.Router();
const {
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  getAllSubscriptions,
  getSubscriptionStats,
  deleteSubscription,
  exportSubscriptions,
  bulkImportSubscriptions,
} = require("../controllers/newsletterController");
const {
  protect,
  authorize,
  decryptRequest,
  rateLimit,
  securityHeaders,
} = require("../middleware/authMiddleware");

// Apply security headers to all routes
router.use(securityHeaders);

// Public routes with rate limiting
router.post("/subscribe", rateLimit(5, 15 * 60 * 1000), decryptRequest, subscribeToNewsletter);
router.post("/unsubscribe/:token", unsubscribeFromNewsletter);

// Protected admin routes
router.use(protect); // All routes below require authentication
router.use(authorize("admin", "super_admin")); // Only admins can access

// Admin newsletter management
router.get("/subscriptions", getAllSubscriptions);
router.get("/stats", getSubscriptionStats);
router.delete("/subscriptions/:id", deleteSubscription);
router.get("/export", exportSubscriptions);
router.post("/import", bulkImportSubscriptions);

module.exports = router;
