const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const crypto = require("crypto");

// Encryption/Decryption utilities for request data
const algorithm = "aes-256-gcm";

// Lazy-load encryption key to ensure dotenv is loaded first2
let secretKey = null;
const getEncryptionKey = () => {
  if (secretKey) return secretKey;

  const secret = process.env.ENCRYPTION_SECRET;

  if (!secret) {
    console.error("ENCRYPTION_SECRET environment variable is not set");
    console.error(
      "Available env vars:",
      Object.keys(process.env).filter(key => key.includes("SECRET"))
    );

    // For development, use a fallback key
    if (process.env.NODE_ENV === "development") {
      console.warn("Using fallback encryption key for development");
      secretKey = crypto.randomBytes(32);
      return secretKey;
    }
    throw new Error("Server configuration error: Missing encryption secret");
  }

  // Remove quotes if present and validate hex format
  const cleanSecret = secret.replace(/['"]/g, "");

  if (!/^[0-9a-fA-F]{64}$/.test(cleanSecret)) {
    console.error("ENCRYPTION_SECRET format error. Expected: 64-character hex string");
    console.error("Received:", cleanSecret.length, "characters");

    // For development, use a fallback key
    if (process.env.NODE_ENV === "development") {
      console.warn("Using fallback encryption key for development due to format error");
      secretKey = crypto.randomBytes(32);
      return secretKey;
    }
    throw new Error("Server configuration error: Invalid encryption secret format");
  }

  secretKey = Buffer.from(cleanSecret, "hex");
  console.log("Encryption key loaded successfully");
  return secretKey;
};

const encrypt = text => {
  try {
    const key = getEncryptionKey(); // Lazy-load the key
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipherGCM(algorithm, key, iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    return iv.toString("hex") + ":" + authTag.toString("hex") + ":" + encrypted;
  } catch (error) {
    throw new Error("Failed to encrypt data: " + error.message);
  }
};

const decrypt = encryptedData => {
  try {
    const key = getEncryptionKey(); // Lazy-load the key
    const parts = encryptedData.split(":");
    if (parts.length !== 3) {
      throw new Error("Invalid encrypted data format - expected 3 parts");
    }

    const iv = Buffer.from(parts[0], "hex");
    const authTag = Buffer.from(parts[1], "hex");
    const encrypted = parts[2];

    // Validate IV and authTag lengths
    if (iv.length !== 16) {
      throw new Error("Invalid IV length");
    }
    if (authTag.length !== 16) {
      throw new Error("Invalid auth tag length");
    }

    const decipher = crypto.createDecipherGCM(algorithm, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    // Don't log error here - let the middleware handle it
    throw new Error("Failed to decrypt data");
  }
};

// Input sanitization and validation
const sanitizeInput = input => {
  if (typeof input !== "string") return input;
  return input
    .replace(/[<>]/g, "") // Remove XSS characters
    .replace(/['"]/g, "") // Remove SQL injection quotes
    .trim();
};

const validateInput = (data, requiredFields = []) => {
  const errors = [];

  for (const field of requiredFields) {
    if (!data[field] || data[field].toString().trim() === "") {
      errors.push(`${field} is required`);
    }
  }

  return errors;
};

// Decrypt request middleware
const decryptRequest = (req, res, next) => {
  try {
    // Only process if encryptedData is present
    if (req.body && req.body.encryptedData) {
      // Validate that encryptedData is a string
      if (typeof req.body.encryptedData !== "string") {
        throw new Error("Encrypted data must be a string");
      }

      let decryptedData;

      // Try AES-GCM decryption first
      // try {
      //   decryptedData = decrypt(req.body.encryptedData);
      // } catch (aesError) {
        // Fallback to base64 decoding for frontend compatibility (development only)
        // if (process.env.NODE_ENV === "development") {
        try {
          const base64Decoded = Buffer.from(req.body.encryptedData, "base64").toString("utf8");

          const base64Parsed = JSON.parse(base64Decoded);

          // Extract the actual data from the wrapper object
          decryptedData = JSON.stringify(base64Parsed.data || base64Parsed);
        } catch (base64Error) {
          throw new Error("base64 decryption failed");
        }
        // } else {
        //   throw aesError;
        // }
      // }

      // Validate JSON format
      let parsedData;
      try {
        parsedData = JSON.parse(decryptedData);
      } catch (parseError) {
        throw new Error("Decrypted data is not valid JSON");
      }

      req.body = parsedData;

      // Sanitize all string inputs
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === "string") {
          req.body[key] = sanitizeInput(req.body[key]);
        }
      });
    }
    // If no encryptedData, just continue without processing
    next();
  } catch (error) {
    console.error(`Decrypt request error on ${req.method} ${req.originalUrl}:`, error.message);
    return res.status(400).json({
      success: false,
      message: "Invalid request data format",
      error: error.message,
    });
  }
};

// JWT Authentication middleware - Updated for cookie-based auth
const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from HttpOnly cookie first, then fallback to Authorization header
    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find admin and attach to request
      const admin = await Admin.findById(decoded.id).select("-password");

      if (!admin) {
        return res.status(401).json({
          success: false,
          message: "Token is not valid. Admin not found.",
        });
      }

      if (!admin.isActive) {
        return res.status(401).json({
          success: false,
          message: "Account is deactivated. Contact support.",
        });
      }

      req.admin = admin;
      next();
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token has expired. Please login again.",
        });
      } else if (jwtError.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Invalid token format.",
        });
      } else {
        throw jwtError;
      }
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during authentication",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Please authenticate first.",
      });
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(" or ")}`,
      });
    }

    next();
  };
};

// Rate limiting middleware (basic implementation)
const rateLimitMap = new Map();

const rateLimit = (maxRequests = 10, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, []);
    }

    const requests = rateLimitMap.get(ip);
    // Remove old requests outside the window
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);

    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
        retryAfter: Math.ceil(windowMs / 1000),
      });
    }

    recentRequests.push(now);
    rateLimitMap.set(ip, recentRequests);
    next();
  };
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  next();
};

// Utility function to generate a proper encryption key
const generateEncryptionKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

module.exports = {
  protect,
  authorize,
  decryptRequest,
  rateLimit,
  securityHeaders,
  encrypt,
  decrypt,
  sanitizeInput,
  validateInput,
  generateEncryptionKey,
};
