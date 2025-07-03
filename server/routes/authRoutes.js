const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Define auth routes
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

// Forgot password routes
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-otp", authController.verifyOTP);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
