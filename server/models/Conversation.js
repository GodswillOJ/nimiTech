const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    websiteId: {
      type: String,
      default: "nimitech",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "closed", "transferred"],
      default: "active",
    },
    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      default: null,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
      default: null,
    },
    metadata: {
      userAgent: String,
      ip: String,
      referrer: String,
      deviceType: String,
    },
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({ status: 1 });
conversationSchema.index({ startTime: -1 });

module.exports = mongoose.model("Conversation", conversationSchema);
