const Blog = require("../models/Blog");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const { deleteFile } = require("../middleware/uploadMiddleware");

// Input sanitization function
const sanitizeInput = input => {
  if (typeof input !== "string") return input;
  return input
    .replace(/[<>]/g, "") // Remove potential XSS characters
    .trim();
};

// Get all blogs with pagination
const getAllBlogsPaginated = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const category = req.query.category;
    const search = req.query.search;

    // Build query
    let query = { isPublished: true };

    if (category && category !== "all") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const posts = await Blog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

    const totalPosts = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);

    res.status(200).json({
      posts,
      currentPage: page,
      totalPages,
      totalPosts,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error: error.message });
  }
};

// Get featured post
const getFeaturedPost = async (req, res) => {
  try {
    const featuredPost = await Blog.findOne({ isFeatured: true, isPublished: true }).sort({
      createdAt: -1,
    });

    if (!featuredPost) {
      return res.status(404).json({ message: "No featured post found" });
    }

    res.status(200).json(featuredPost);
  } catch (error) {
    res.status(500).json({ message: "Error fetching featured post", error: error.message });
  }
};

// Get blog by ID
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID parameter
    if (!id || id === "undefined") {
      return res.status(400).json({ message: "Blog ID is required" });
    }

    // Validate if ID is a valid ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid blog ID format" });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog", error: error.message });
  }
};

// Get related posts
const getRelatedPosts = async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 3;

    // Validate ID parameter
    if (!id || id === "undefined") {
      return res.status(400).json({ message: "Blog ID is required" });
    }

    // Validate if ID is a valid ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid blog ID format" });
    }

    const currentPost = await Blog.findById(id);
    if (!currentPost) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Find related posts by category, excluding the current post
    const relatedPosts = await Blog.find({
      _id: { $ne: id },
      category: currentPost.category,
      isPublished: true,
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    // If not enough related posts in same category, fill with recent posts
    if (relatedPosts.length < limit) {
      const additionalPosts = await Blog.find({
        _id: { $ne: id, $nin: relatedPosts.map(p => p._id) },
        isPublished: true,
      })
        .sort({ createdAt: -1 })
        .limit(limit - relatedPosts.length);

      relatedPosts.push(...additionalPosts);
    }

    res.status(200).json(relatedPosts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching related posts", error: error.message });
  }
};

// Create or update blog
const addEditBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const isUpdate = !!id;

    // Validate ID parameter for updates
    if (isUpdate) {
      if (!id || id === "undefined") {
        return res.status(400).json({
          success: false,
          message: "Blog ID is required for updates",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid blog ID format",
        });
      }
    }

    // Sanitize text inputs
    const sanitizedData = {};

    // Basic required fields
    if (req.body.title) sanitizedData.title = sanitizeInput(req.body.title);
    if (req.body.description) sanitizedData.description = sanitizeInput(req.body.description);
    if (req.body.category) sanitizedData.category = sanitizeInput(req.body.category);
    if (req.body.readTime) sanitizedData.readTime = sanitizeInput(req.body.readTime);

    // Author information
    if (req.body.author) {
      const author =
        typeof req.body.author === "string" ? JSON.parse(req.body.author) : req.body.author;
      sanitizedData.author = {
        name: sanitizeInput(author.name || ""),
        bio: sanitizeInput(author.bio || ""),
        date: author.date || new Date().toLocaleDateString(),
        avatar: author.avatar || null, // Will be updated from file upload
      };
    }

    // Content information
    if (req.body.content) {
      const content =
        typeof req.body.content === "string" ? JSON.parse(req.body.content) : req.body.content;
      sanitizedData.content = {
        subtitle: sanitizeInput(content.subtitle || ""),
        paragraphs: content.paragraphs || [],
        highlights: {
          title: sanitizeInput(content.highlights?.title || ""),
          benefits: content.highlights?.benefits || [],
        },
      };
    }

    // Other fields
    if (req.body.youtubeUrl) sanitizedData.youtubeUrl = sanitizeInput(req.body.youtubeUrl);
    if (req.body.contentImageTitle)
      sanitizedData.contentImageTitle = sanitizeInput(req.body.contentImageTitle);
    if (req.body.isFeatured !== undefined)
      sanitizedData.isFeatured = req.body.isFeatured === "true";
    if (req.body.isPublished !== undefined)
      sanitizedData.isPublished = req.body.isPublished === "true";
    if (req.body.tags) {
      const tags = typeof req.body.tags === "string" ? JSON.parse(req.body.tags) : req.body.tags;
      sanitizedData.tags = tags.map(tag => sanitizeInput(tag));
    }

    // Handle file uploads
    if (req.files) {
      // Featured image
      if (req.files.featuredImage && req.files.featuredImage[0]) {
        sanitizedData.image = `/uploads/blog/featured/${req.files.featuredImage[0].filename}`;
      }

      // Content image
      if (req.files.contentImage && req.files.contentImage[0]) {
        sanitizedData.contentImage = `/uploads/blog/content/${req.files.contentImage[0].filename}`;
      }

      // Author avatar
      if (req.files.authorAvatar && req.files.authorAvatar[0]) {
        if (!sanitizedData.author) sanitizedData.author = {};
        sanitizedData.author.avatar = `/uploads/avatars/${req.files.authorAvatar[0].filename}`;
      }
    }

    // Add admin ID for tracking
    if (req.admin) {
      sanitizedData.authorId = req.admin.id;
    }

    let blog;
    let oldBlog = null;

    if (isUpdate) {
      // Get old blog for cleanup
      oldBlog = await Blog.findById(id);
      if (!oldBlog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found",
        });
      }

      // Update existing blog
      blog = await Blog.findByIdAndUpdate(id, sanitizedData, {
        new: true,
        runValidators: true,
      });

      // Clean up replaced images
      if (oldBlog && req.files) {
        const imagesToCleanup = [];

        if (req.files.featuredImage && oldBlog.image) {
          imagesToCleanup.push(path.join(__dirname, "..", oldBlog.image));
        }
        if (req.files.contentImage && oldBlog.contentImage) {
          imagesToCleanup.push(path.join(__dirname, "..", oldBlog.contentImage));
        }
        if (req.files.authorAvatar && oldBlog.author?.avatar) {
          imagesToCleanup.push(path.join(__dirname, "..", oldBlog.author.avatar));
        }

        // Delete old images
        imagesToCleanup.forEach(imagePath => {
          deleteFile(imagePath);
        });
      }
    } else {
      // Validate required fields for new blog
      const requiredFields = ["title", "description", "category", "readTime"];
      const missingFields = requiredFields.filter(field => !sanitizedData[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }

      // Create new blog
      blog = new Blog(sanitizedData);
      await blog.save();
    }

    res.status(isUpdate ? 200 : 201).json({
      success: true,
      message: isUpdate ? "Blog updated successfully" : "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Add/Edit blog error:", error);

    // Clean up uploaded files on error
    if (req.files) {
      Object.values(req.files)
        .flat()
        .forEach(file => {
          deleteFile(file.path);
        });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error saving blog",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Delete blog
const deleteBlogPost = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID parameter
    if (!id || id === "undefined") {
      return res.status(400).json({
        success: false,
        message: "Blog ID is required",
      });
    }

    // Validate if ID is a valid ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID format",
      });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Check if admin owns this blog or is super_admin
    if (
      req.admin.role !== "super_admin" &&
      blog.authorId &&
      blog.authorId.toString() !== req.admin.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only delete your own blog posts.",
      });
    }

    // Delete associated images
    const imagePaths = [blog.image, blog.contentImage, blog.author?.avatar].filter(Boolean);
    imagePaths.forEach(imagePath => {
      if (imagePath && imagePath.startsWith("/uploads/")) {
        const fullPath = path.join(__dirname, "..", imagePath);
        deleteFile(fullPath);
      }
    });

    await Blog.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting blog",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Upload blog image
const uploadBlogImage = async (req, res) => {
  try {
    const { type } = req.body; // 'featuredImage' | 'contentImage' | 'authorAvatar' | 'image'

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    // Construct the URL path for the uploaded image
    const imagePath = `/uploads/${req.file.destination.split("/").pop()}/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        imagePath,
        originalName: req.file.originalname,
        size: req.file.size,
        type: type || "image",
      },
    });
  } catch (error) {
    console.error("Upload image error:", error);

    // Clean up uploaded file on error
    if (req.file) {
      deleteFile(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: "Error uploading image",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get blog categories
const getBlogCategories = async (req, res) => {
  try {
    const categories = await Blog.distinct("category", { isPublished: true });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
};

// Get blog statistics (for admin dashboard)
const getBlogStats = async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ isPublished: true });
    const draftBlogs = await Blog.countDocuments({ isPublished: false });
    const featuredBlogs = await Blog.countDocuments({ isFeatured: true });

    const totalViews = await Blog.aggregate([
      { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);

    const totalLikes = await Blog.aggregate([
      { $group: { _id: null, totalLikes: { $sum: "$likes" } } },
    ]);

    res.status(200).json({
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      featuredBlogs,
      totalViews: totalViews[0]?.totalViews || 0,
      totalLikes: totalLikes[0]?.totalLikes || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog stats", error: error.message });
  }
};

module.exports = {
  getAllBlogsPaginated,
  getFeaturedPost,
  getBlogById,
  getRelatedPosts,
  addEditBlogPost,
  deleteBlogPost,
  uploadBlogImage,
  getBlogCategories,
  getBlogStats,
};
