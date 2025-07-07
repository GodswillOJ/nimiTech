const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mongoose = require("mongoose");

// Generate JWT token with extended expiry
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
    issuer: "nimitech-blog",
    audience: "nimitech-admin",
  });
};

// Input sanitization function
const sanitizeInput = input => {
  if (typeof input !== "string") return input;
  return input
    .replace(/[<>]/g, "") // Remove potential XSS characters
    .trim();
};

// Validate password strength
const validatePasswordStrength = password => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    return "Password must be at least 8 characters long";
  }
  if (!hasUpperCase) {
    return "Password must contain at least one uppercase letter";
  }
  if (!hasLowerCase) {
    return "Password must contain at least one lowercase letter";
  }
  if (!hasNumbers) {
    return "Password must contain at least one number";
  }
  if (!hasSpecialChar) {
    return "Password must contain at least one special character";
  }
  return null;
};

// Encrypt sensitive data
const encryptData = data => {
  const algorithm = "aes-256-gcm";
  const secretKey = crypto.scryptSync(process.env.JWT_SECRET, "salt", 32);
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipher(algorithm, secretKey);
  cipher.setAAD(Buffer.from("nimitech-admin", "utf8"));

  let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
  };
};

// Decrypt sensitive data
const decryptData = encryptedData => {
  try {
    const algorithm = "aes-256-gcm";
    const secretKey = crypto.scryptSync(process.env.JWT_SECRET, "salt", 32);

    const decipher = crypto.createDecipher(algorithm, secretKey);
    decipher.setAAD(Buffer.from("nimitech-admin", "utf8"));
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, "hex"));

    let decrypted = decipher.update(encryptedData.encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return JSON.parse(decrypted);
  } catch (error) {
    throw new Error("Invalid encrypted data");
  }
};

// Create admin user
const createAdminUser = async (req, res) => {
  try {
    // Data is already decrypted by the decryptRequest middleware
    const { username, email, password, firstName, lastName, role = "admin" } = req.body;

    // Sanitize inputs
    const sanitizedData = {
      username: sanitizeInput(username),
      email: sanitizeInput(email?.toLowerCase()),
      firstName: sanitizeInput(firstName),
      lastName: sanitizeInput(lastName),
      role: sanitizeInput(role),
    };

    // Validate required fields
    if (
      !sanitizedData.username ||
      !sanitizedData.email ||
      !password ||
      !sanitizedData.firstName ||
      !sanitizedData.lastName
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate password strength
    const passwordError = validatePasswordStrength(password);
    if (passwordError) {
      return res.status(400).json({
        success: false,
        message: passwordError,
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ email: sanitizedData.email }, { username: sanitizedData.username }],
    });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Admin with this email or username already exists",
      });
    }

    // Create new admin
    const admin = new Admin({
      ...sanitizedData,
      password,
    });

    await admin.save();

    // Generate tokens
    const token = generateToken(admin._id, admin.role);
    const refreshToken = generateToken(admin._id, admin.role); // In production, use different secret/expiry

    // Set secure HttpOnly cookies
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 1 * 60 * 60 * 1000, // 1 hour for better persistence
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 1 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: {
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: admin.role,
          avatar: admin.avatar,
          createdAt: admin.createdAt,
        },
      },
      csrfToken: crypto.randomBytes(32).toString("hex"), // CSRF token for frontend
    });
  } catch (error) {
    console.error("Create admin error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Admin with this email or username already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error occurred while creating admin",
    });
  }
};

// Admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Decrypt the incoming data
    // const decryptedData = decryptData(data);
    // const { email, password } = decryptedData;

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email?.toLowerCase());

    if (!sanitizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find admin and include password field
    const admin = await Admin.findOne({
      email: sanitizedEmail,
      isActive: true,
    }).select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if account is locked
    if (admin.isLocked) {
      return res.status(423).json({
        success: false,
        message: "Account is temporarily locked due to too many failed login attempts",
      });
    }

    // Verify password
    const isPasswordCorrect = await admin.comparePassword(password);

    if (!isPasswordCorrect) {
      // Increment login attempts
      await admin.incLoginAttempts();

      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Reset login attempts and update last login
    await admin.resetLoginAttempts();

    // Generate tokens
    const token = generateToken(admin._id, admin.role);
    const refreshToken = generateToken(admin._id, admin.role); // In production, use different secret/expiry

    // Set secure HttpOnly cookies
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours for better persistence
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: admin.role,
          avatar: admin.avatar,
          lastLogin: admin.lastLogin,
        },
      },
      csrfToken: crypto.randomBytes(32).toString("hex"), // CSRF token for frontend
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred during login",
    });
  }
};

// Get admin profile
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
          bio: admin.bio,
          role: admin.role,
          avatar: admin.avatar,
          lastLogin: admin.lastLogin,
          createdAt: admin.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Get admin profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while fetching profile",
    });
  }
};

// Update admin profile
const updateAdminProfile = async (req, res) => {
  try {
    const { firstName, lastName, username, avatar, bio } = req.body;

    // Sanitize inputs
    const updateData = {
      ...(firstName && { firstName: sanitizeInput(firstName) }),
      ...(lastName && { lastName: sanitizeInput(lastName) }),
      ...(username && { username: sanitizeInput(username) }),
      ...(avatar && { avatar: sanitizeInput(avatar) }),
      ...(bio !== undefined && { bio: sanitizeInput(bio) }), // Allow empty string
    };

    const admin = await Admin.findByIdAndUpdate(req.admin.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { admin },
    });
  } catch (error) {
    console.error("Update admin profile error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error occurred while updating profile",
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    // Data is already decrypted by the decryptRequest middleware
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    // Validate new password strength
    const passwordError = validatePasswordStrength(newPassword);
    if (passwordError) {
      return res.status(400).json({
        success: false,
        message: passwordError,
      });
    }

    const admin = await Admin.findById(req.admin.id).select("+password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Verify current password
    const isCurrentPasswordCorrect = await admin.comparePassword(currentPassword);

    if (!isCurrentPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while changing password",
    });
  }
};

// Get all admins (super admin only)
const getAllAdmins = async (req, res) => {
  try {
    if (req.admin.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Super admin role required.",
      });
    }

    const { page = 1, limit = 10, search } = req.query;

    let query = {};
    if (search) {
      query = {
        $or: [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    const admins = await Admin.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Admin.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        admins,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalAdmins: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get all admins error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while fetching admins",
    });
  }
};

// Upload admin avatar
const uploadAvatarController = async (req, res) => {
  try {
    console.log("Upload avatar request received");
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
    console.log("Request files:", req.files);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No avatar file provided",
      });
    }

    // Construct the URL path for the uploaded avatar
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // Update admin's avatar in database
    const admin = await Admin.findByIdAndUpdate(
      req.admin.id,
      { avatar: avatarUrl },
      { new: true, runValidators: true }
    ).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      avatarUrl: avatarUrl,
      data: { admin },
    });
  } catch (error) {
    console.error("Upload avatar error:", error);

    // Clean up uploaded file on error
    if (req.file && req.file.path) {
      try {
        const fs = require("fs");
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error("Error cleaning up uploaded file:", cleanupError);
      }
    }

    res.status(500).json({
      success: false,
      message: "Error uploading avatar",
    });
  }
};

// Helper function to create encrypted response for frontend
const createEncryptedResponse = data => {
  return encryptData(data);
};

module.exports = {
  registerAdmin: createAdminUser,
  loginAdmin: adminLogin,
  getProfile: getAdminProfile,
  updateProfile: updateAdminProfile,
  uploadAvatar: uploadAvatarController,
  getAllAdmins,
  toggleAdminStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const admin = await Admin.findById(id);

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      admin.isActive = !admin.isActive;
      await admin.save();

      res.status(200).json({
        success: true,
        message: `Admin ${admin.isActive ? "activated" : "deactivated"} successfully`,
        data: { admin: admin },
      });
    } catch (error) {
      console.error("Toggle admin status error:", error);
      res.status(500).json({
        success: false,
        message: "Server error occurred",
      });
    }
  },
  deleteAdmin: async (req, res) => {
    try {
      const { id } = req.params;

      if (id === req.admin.id) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete your own account",
        });
      }

      const admin = await Admin.findByIdAndDelete(id);

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Admin deleted successfully",
      });
    } catch (error) {
      console.error("Delete admin error:", error);
      res.status(500).json({
        success: false,
        message: "Server error occurred",
      });
    }
  },
  changePassword,
  refreshToken: async (req, res) => {
    try {
      const token = generateToken(req.admin.id, req.admin.role);

      res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        data: { token },
      });
    } catch (error) {
      console.error("Refresh token error:", error);
      res.status(500).json({
        success: false,
        message: "Server error occurred",
      });
    }
  },
  logoutAdmin: async (req, res) => {
    try {
      // Clear HttpOnly cookies
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Match cookie settings
      });

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Match cookie settings
      });

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        success: false,
        message: "Server error occurred",
      });
    }
  },
  encryptData,
  decryptData,
};
