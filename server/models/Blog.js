const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Author name is required"],
    trim: true,
    maxlength: [100, "Author name must be less than 100 characters"],
  },
  avatar: {
    type: String,
    required: false, // Allow null for default avatar
    default: null,
  },
  date: {
    type: String,
    required: [true, "Author date is required"],
  },
  bio: {
    type: String,
    maxlength: [500, "Bio must be less than 500 characters"],
  },
});

const paragraphSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, "Paragraph type is required"],
    enum: ["text", "quote"],
    default: "text",
  },
  content: {
    type: String,
    required: [true, "Paragraph content is required"],
    maxlength: [2000, "Paragraph content must be less than 2000 characters"],
  },
});

const highlightsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Highlights title is required"],
    maxlength: [200, "Highlights title must be less than 200 characters"],
  },
  benefits: [
    {
      type: String,
      maxlength: [300, "Benefit description must be less than 300 characters"],
    },
  ],
});

const contentSchema = new mongoose.Schema({
  subtitle: {
    type: String,
    maxlength: [300, "Subtitle must be less than 300 characters"],
  },
  paragraphs: [paragraphSchema],
  highlights: highlightsSchema,
});

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      maxlength: [200, "Title must be less than 200 characters"],
      minlength: [5, "Title must be at least 5 characters"],
    },
    description: {
      type: String,
      required: [true, "Blog description is required"],
      trim: true,
      maxlength: [500, "Description must be less than 500 characters"],
      minlength: [10, "Description must be at least 10 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      maxlength: [50, "Category must be less than 50 characters"],
    },
    readTime: {
      type: String,
      required: [true, "Read time is required"],
      match: [/^\d+\s*(min|minute|minutes)\s*read$/i, 'Read time must be in format "X min read"'],
    },
    author: {
      type: authorSchema,
      required: [true, "Author information is required"],
    },
    image: {
      type: String, // File path to uploaded featured image
      required: [true, "Featured image is required"],
    },
    content: contentSchema,
    youtubeUrl: {
      type: String,
      validate: {
        validator: function (v) {
          if (!v) return true; // Allow empty
          return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(v);
        },
        message: "Please enter a valid YouTube URL",
      },
    },
    contentImage: {
      type: String, // File path to uploaded content image
      default: null,
    },
    contentImageTitle: {
      type: String,
      maxlength: [200, "Content image title must be less than 200 characters"],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
      min: [0, "Views cannot be negative"],
    },
    likes: {
      type: Number,
      default: 0,
      min: [0, "Likes cannot be negative"],
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: [50, "Tag must be less than 50 characters"],
      },
    ],
    slug: {
      type: String,
      unique: true,
      sparse: true, // Allow null values but ensure uniqueness when present
    },
    metaDescription: {
      type: String,
      maxlength: [160, "Meta description must be less than 160 characters"],
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: false, // For backward compatibility
    },
  },
  {
    timestamps: true,
  }
);

// Note: Explicit indexes removed to prevent duplicate index warnings
// Mongoose automatically creates indexes for unique fields (slug)
// Additional indexes can be added back selectively if needed for performance

// Virtual for URL-friendly slug
blogSchema.virtual("url").get(function () {
  return `/blog/${this.slug || this._id}`;
});

// Pre-save middleware to generate slug
blogSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single
      .trim("-"); // Remove leading/trailing hyphens

    // Add timestamp to ensure uniqueness
    this.slug += `-${Date.now()}`;
  }
  next();
});

// Static method for search (modified to work without text index)
blogSchema.statics.searchBlogs = function (query, options = {}) {
  const { page = 1, limit = 10, category, tags, isPublished = true } = options;

  // Use regex search instead of text search since we removed the text index
  const searchQuery = {
    isPublished,
    $or: [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { category: { $regex: query, $options: "i" } },
      { tags: { $in: [new RegExp(query, "i")] } },
    ],
  };

  if (category) searchQuery.category = category;
  if (tags && tags.length > 0) searchQuery.tags = { $in: tags };

  return this.find(searchQuery)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

// Static method for getting blog statistics
blogSchema.statics.getBlogStats = async function () {
  const totalBlogs = await this.countDocuments();
  const publishedBlogs = await this.countDocuments({ isPublished: true });
  const draftBlogs = await this.countDocuments({ isPublished: false });
  const featuredBlogs = await this.countDocuments({ isFeatured: true });

  const totalViews = await this.aggregate([
    { $group: { _id: null, totalViews: { $sum: "$views" } } },
  ]);

  const totalLikes = await this.aggregate([
    { $group: { _id: null, totalLikes: { $sum: "$likes" } } },
  ]);

  const categoriesStats = await this.aggregate([
    { $match: { isPublished: true } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  return {
    totalBlogs,
    publishedBlogs,
    draftBlogs,
    featuredBlogs,
    totalViews: totalViews[0]?.totalViews || 0,
    totalLikes: totalLikes[0]?.totalLikes || 0,
    categoriesStats,
  };
};

module.exports = mongoose.model("Blog", blogSchema);
