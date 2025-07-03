const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Admin = require("../models/Admin");

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate 4-digit OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Dummy authentication handlers
const registerUser = (req, res) => {
  res.status(201).json({ message: "User registered" });
};

const loginUser = (req, res) => {
  res.status(200).json({ message: "User logged in" });
};

// Forgot Password - Send OTP
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if user exists
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address",
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP temporarily
    otpStore.set(email.toLowerCase(), {
      otp,
      expiry: otpExpiry,
      attempts: 0,
    });

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset - Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #9333ea; text-align: center;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>You requested to reset your password. Please use the following 4-digit verification code:</p>
          <div style="background: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #9333ea; font-size: 2em; margin: 0; letter-spacing: 0.5em;">${otp}</h1>
          </div>
          <p><strong>This code will expire in 10 minutes.</strong></p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p>Best regards,<br>NimiTech Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Verification code sent to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send verification code. Please try again.",
    });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const emailLower = email.toLowerCase();
    const storedOtpData = otpStore.get(emailLower);

    if (!storedOtpData) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please request a new one.",
      });
    }

    // Check if OTP expired
    if (Date.now() > storedOtpData.expiry) {
      otpStore.delete(emailLower);
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Check attempts
    if (storedOtpData.attempts >= 3) {
      otpStore.delete(emailLower);
      return res.status(400).json({
        success: false,
        message: "Too many attempts. Please request a new OTP.",
      });
    }

    // Verify OTP
    if (storedOtpData.otp !== otp) {
      storedOtpData.attempts += 1;
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again.",
      });
    }

    // OTP is valid, generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 30 * 60 * 1000; // 30 minutes

    // Store reset token (replace OTP data)
    otpStore.set(emailLower, {
      resetToken,
      expiry: resetTokenExpiry,
      verified: true,
    });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      resetToken,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP. Please try again.",
    });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and password are required",
      });
    }

    // Find email by reset token
    let userEmail = null;
    for (const [email, data] of otpStore.entries()) {
      if (data.resetToken === token && data.verified) {
        userEmail = email;
        break;
      }
    }

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const tokenData = otpStore.get(userEmail);

    // Check if token expired
    if (Date.now() > tokenData.expiry) {
      otpStore.delete(userEmail);
      return res.status(400).json({
        success: false,
        message: "Reset token has expired. Please request a new one.",
      });
    }

    // Update password
    const admin = await Admin.findOne({ email: userEmail });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    admin.password = password; // This should be hashed by the model
    await admin.save();

    // Clean up
    otpStore.delete(userEmail);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset password. Please try again.",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  verifyOTP,
  resetPassword,
};
