const express = require("express");
const router = express.Router();
const {
  getAllBlogsPaginated,
  getFeaturedPost,
  getBlogById,
  getRelatedPosts,
  addEditBlogPost,
  deleteBlogPost,
  uploadBlogImage,
  getBlogCategories,
  getBlogStats,
} = require("../controllers/blogController");
const {
  upload,
  uploadMultiple,
  handleMulterError,
  cleanupOnError,
} = require("../middleware/uploadMiddleware");
const { protect, authorize, securityHeaders } = require("../middleware/authMiddleware");

// Apply security headers to all routes
router.use(securityHeaders);

// Public routes
router.get("/", getAllBlogsPaginated);
router.get("/featured", getFeaturedPost);
router.get("/categories", getBlogCategories);
router.get("/stats", getBlogStats);
router.get("/:id", getBlogById);
router.get("/:id/related", getRelatedPosts);

// Protected routes (admin only)
router.use(protect); // All routes below require authentication
router.use(authorize("admin", "super_admin")); // Only admins can create/edit/delete

router.post("/", cleanupOnError, uploadMultiple, handleMulterError, addEditBlogPost); // POST /api/blogs
router.put("/:id", cleanupOnError, uploadMultiple, handleMulterError, addEditBlogPost); // PUT /api/blogs/:id
router.delete("/:id", deleteBlogPost); // DELETE /api/blogs/:id

// File upload route (admin only)
router.post("/upload-image", upload, handleMulterError, uploadBlogImage); // POST /api/blogs/upload-image

module.exports = router;
