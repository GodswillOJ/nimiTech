const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  getProfile,
  updateProfile,
  getAllAdmins,
  toggleAdminStatus,
  deleteAdmin,
  changePassword,
  refreshToken,
  logoutAdmin,
} = require("../controllers/adminController");
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
router.post("/register", rateLimit(5, 15 * 60 * 1000), decryptRequest, registerAdmin);
router.post("/login", rateLimit(10, 15 * 60 * 1000), decryptRequest, loginAdmin);

// Protected routes
router.use(protect); // All routes below require authentication

// Profile routes
router.get("/profile", getProfile);
router.put("/profile", decryptRequest, updateProfile);
router.put("/change-password", rateLimit(5, 60 * 60 * 1000), decryptRequest, changePassword);
router.post("/refresh-token", refreshToken);
router.post("/logout", logoutAdmin);

// Admin management routes (super_admin only)
router.get("/all", authorize("super_admin"), getAllAdmins);
router.put("/:id/toggle-status", authorize("super_admin"), toggleAdminStatus);
router.delete("/:id", authorize("super_admin"), deleteAdmin);

module.exports = router;
