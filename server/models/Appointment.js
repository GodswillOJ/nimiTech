const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    appointmentType: {
      type: String,
      enum: ["consultation", "demo", "support"],
      required: true,
    },
    scheduledTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      default: 30, // minutes
    },
    status: {
      type: String,
      enum: ["scheduled", "confirmed", "cancelled", "completed"],
      default: "scheduled",
    },
    attendees: [
      {
        name: String,
        email: String,
        phone: String,
      },
    ],
    metadata: {
      timezone: {
        type: String,
        default: "UTC",
      },
      notes: String,
      remindersSent: [Date],
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
appointmentSchema.index({ scheduledTime: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ conversationId: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);
