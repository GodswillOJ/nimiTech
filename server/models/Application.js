const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job reference is required"],
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name must be less than 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name must be less than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"],
    },
    message: {
      type: String,
      required: false,
      trim: true,
      maxlength: [1000, "Message must be less than 1000 characters"],
    },
    experience: {
      type: String,
      required: [true, "Experience level is required"],
      enum: ["0-2 years", "3-5 years", "+5 years"],
    },
    resume: {
      url: {
        type: String,
        required: [true, "Resume URL is required"],
      },
      publicId: {
        type: String,
        required: [true, "Resume public ID is required"],
      },
      originalName: {
        type: String,
        required: [true, "Original filename is required"],
      },
      size: {
        type: Number,
        required: true,
      },
    },
    coverLetter: {
      url: {
        type: String,
        required: false,
      },
      publicId: {
        type: String,
        required: false,
      },
      originalName: {
        type: String,
        required: false,
      },
      size: {
        type: Number,
        required: false,
      },
    },
    status: {
      type: String,
      enum: ["pending", "reviewing", "shortlisted", "rejected", "hired"],
      default: "pending",
    },
    notes: {
      type: String,
      required: false,
      maxlength: [2000, "Notes must be less than 2000 characters"],
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: false,
    },
    reviewedAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
applicationSchema.index({ job: 1, createdAt: -1 });
applicationSchema.index({ status: 1, createdAt: -1 });
applicationSchema.index({ email: 1 });

// Compound index for job applications by status
applicationSchema.index({ job: 1, status: 1 });

module.exports = mongoose.model("Application", applicationSchema);
