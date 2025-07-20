const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: String,
      enum: ["user", "ai", "agent"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      confidence: {
        type: Number,
        min: 0,
        max: 1,
      },
      knowledgeBaseRefs: [String],
      handoffTrigger: {
        type: Boolean,
        default: false,
      },
      attachments: [
        {
          type: String,
          url: String,
          size: Number,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
messageSchema.index({ conversationId: 1, timestamp: -1 });
messageSchema.index({ sender: 1 });

module.exports = mongoose.model("Message", messageSchema);
