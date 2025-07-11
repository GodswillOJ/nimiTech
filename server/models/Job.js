const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [200, "Title must be less than 200 characters"],
      minlength: [5, "Title must be at least 5 characters"],
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      default: "NimiTech",
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Job type is required"],
      enum: ["Full-Time", "Part-Time", "Remote", "Contract", "Internship"],
      default: "Full-Time",
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    experienceLevel: {
      type: String,
      required: [true, "Experience level is required"],
      enum: ["Entry", "Mid", "Senior", "Lead", "Executive"],
      default: "Mid",
    },
    salaryRange: {
      min: {
        type: Number,
        required: false,
      },
      max: {
        type: Number,
        required: false,
      },
      currency: {
        type: String,
        default: "USD",
      },
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
      maxlength: [5000, "Description must be less than 5000 characters"],
    },
    responsibilities: [
      {
        type: String,
        maxlength: [500, "Responsibility must be less than 500 characters"],
      },
    ],
    requirements: [
      {
        type: String,
        maxlength: [500, "Requirement must be less than 500 characters"],
      },
    ],
    benefits: [
      {
        type: String,
        maxlength: [300, "Benefit must be less than 300 characters"],
      },
    ],
    skills: [
      {
        type: String,
        maxlength: [50, "Skill must be less than 50 characters"],
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    applicationDeadline: {
      type: Date,
      required: false,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
jobSchema.index({ isActive: 1, createdAt: -1 });
jobSchema.index({ department: 1, type: 1 });
jobSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Job", jobSchema);
