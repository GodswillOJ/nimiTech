const mongoose = require("mongoose");

const knowledgeBaseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    embedding: [
      {
        type: Number,
      },
    ],
    category: {
      type: String,
      required: true,
    },
    tags: [String],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    websiteId: {
      type: String,
      default: "nimitech",
    },
    priority: {
      type: Number,
      default: 1,
      min: 1,
      max: 10,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better search performance
knowledgeBaseSchema.index({ websiteId: 1, isActive: 1 });
knowledgeBaseSchema.index({ category: 1 });
knowledgeBaseSchema.index({ tags: 1 });
knowledgeBaseSchema.index({ title: "text", content: "text" });

module.exports = mongoose.model("KnowledgeBase", knowledgeBaseSchema);
