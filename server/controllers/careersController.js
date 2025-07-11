const Job = require("../models/Job");
const Application = require("../models/Application");
const mongoose = require("mongoose");
const { deleteFromCloudinary } = require("../config/cloudinary");
const { sendApplicationConfirmation, sendAdminNotification } = require("../services/emailService");

// Input sanitization function
const sanitizeInput = input => {
  if (typeof input !== "string") return input;
  return input
    .replace(/[<>]/g, "") // Remove potential XSS characters
    .trim();
};

// Get all active jobs with pagination
const getAllJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const department = req.query.department;
    const type = req.query.type;
    const search = req.query.search;
    const isActive = req.query.isActive;
    const includeInactive = req.query.includeInactive; // For admin panel

    // Build query
    let query = {};

    // For admin panel, allow viewing all jobs; otherwise only active ones
    if (includeInactive !== "true") {
      if (isActive !== undefined) {
        query.isActive = isActive === "true";
      } else {
        query.isActive = true; // Default to active jobs only
      }
    }

    if (department && department !== "all") {
      query.department = department;
    }

    if (type && type !== "all") {
      query.type = type;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
      ];
    }

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("postedBy", "name email");

    const totalJobs = await Job.countDocuments(query);
    const totalPages = Math.ceil(totalJobs / limit);

    // Add caching headers
    res.set({
      "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
      Vary: "Accept-Encoding",
    });

    res.status(200).json({
      jobs,
      currentPage: page,
      totalPages,
      totalJobs,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      message: "Failed to fetch jobs",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    });
  }
};

// Get single job by ID
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    const job = await Job.findById(id).populate("postedBy", "name email");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (!job.isActive) {
      return res.status(410).json({ message: "This job posting is no longer active" });
    }

    // Add caching headers for individual jobs
    res.set({
      "Cache-Control": "public, max-age=1800, stale-while-revalidate=7200", // 30 min cache
      ETag: `"job-${id}-${job.updatedAt.getTime()}"`,
    });

    res.status(200).json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({
      message: "Failed to fetch job",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    });
  }
};

// Submit job application
const submitApplication = async (req, res) => {
  try {
    const { jobId } = req.params;
    let { firstName, lastName, email, phone, message, experience } = req.body;

    // Sanitize inputs
    firstName = sanitizeInput(firstName);
    lastName = sanitizeInput(lastName);
    email = sanitizeInput(email);
    phone = sanitizeInput(phone);
    message = sanitizeInput(message);

    // Validate job ID
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (!job.isActive) {
      return res.status(410).json({ message: "This job posting is no longer active" });
    }

    // Check if application deadline has passed
    if (job.applicationDeadline && new Date() > job.applicationDeadline) {
      return res.status(410).json({ message: "Application deadline has passed" });
    }

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !experience) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Check if files were uploaded
    if (!req.files || !req.files.resume) {
      return res.status(400).json({ message: "Resume is required" });
    }

    // Check for duplicate application
    const existingApplication = await Application.findOne({
      job: jobId,
      email: email.toLowerCase(),
    });

    if (existingApplication) {
      return res.status(409).json({
        message: "You have already applied for this position",
      });
    }

    // Prepare application data
    const applicationData = {
      job: jobId,
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      message,
      experience,
      resume: {
        url: req.files.resume[0].path,
        publicId: req.files.resume[0].filename,
        originalName: req.files.resume[0].originalname,
        size: req.files.resume[0].size,
      },
    };

    // Add cover letter if provided
    if (req.files.coverLetter && req.files.coverLetter[0]) {
      applicationData.coverLetter = {
        url: req.files.coverLetter[0].path,
        publicId: req.files.coverLetter[0].filename,
        originalName: req.files.coverLetter[0].originalname,
        size: req.files.coverLetter[0].size,
      };
    }

    // Create application
    const application = new Application(applicationData);
    await application.save();

    // Update job applications count
    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicationsCount: 1 },
    });

    // Populate job data for emails
    await application.populate("job");

    try {
      // Send confirmation email to applicant
      await sendApplicationConfirmation(applicationData, job);

      // Send notification email to admin
      await sendAdminNotification(applicationData, job, application._id);
    } catch (emailError) {
      console.error("Error sending emails:", emailError);
      // Don't fail the application submission if emails fail
    }

    res.status(201).json({
      message: "Application submitted successfully",
      applicationId: application._id,
    });
  } catch (error) {
    console.error("Error submitting application:", error);

    // If there's an error, try to clean up uploaded files
    if (req.files) {
      try {
        if (req.files.resume && req.files.resume[0]) {
          await deleteFromCloudinary(req.files.resume[0].filename);
        }
        if (req.files.coverLetter && req.files.coverLetter[0]) {
          await deleteFromCloudinary(req.files.coverLetter[0].filename);
        }
      } catch (cleanupError) {
        console.error("Error cleaning up files:", cleanupError);
      }
    }

    res.status(500).json({
      message: "Failed to submit application",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    });
  }
};

// Get all applications for admin (with pagination and filters)
const getAllApplications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const status = req.query.status;
    const jobId = req.query.jobId;

    // Build query
    let query = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (jobId && mongoose.Types.ObjectId.isValid(jobId)) {
      query.job = jobId;
    }

    const applications = await Application.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("job", "title department location type")
      .populate("reviewedBy", "name email");

    const totalApplications = await Application.countDocuments(query);
    const totalPages = Math.ceil(totalApplications / limit);

    res.status(200).json({
      applications,
      currentPage: page,
      totalPages,
      totalApplications,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({
      message: "Failed to fetch applications",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    });
  }
};

// Get single application by ID
const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }

    const application = await Application.findById(id)
      .populate("job")
      .populate("reviewedBy", "name email");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({
      message: "Failed to fetch application",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    });
  }
};

// Update application status (admin only)
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }

    const validStatuses = ["pending", "reviewing", "shortlisted", "rejected", "hired"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findByIdAndUpdate(
      id,
      {
        status,
        notes: sanitizeInput(notes),
        reviewedBy: req.user.id, // Assuming auth middleware sets req.user
        reviewedAt: new Date(),
      },
      { new: true }
    )
      .populate("job")
      .populate("reviewedBy", "name email");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({
      message: "Failed to update application status",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    });
  }
};

// Create a new job (admin only)
const createJob = async (req, res) => {
  try {
    const {
      title,
      department,
      type,
      location,
      description,
      requirements,
      responsibilities,
      benefits,
      salaryRange,
      status,
      applicationDeadline,
    } = req.body;

    // Validate required fields
    if (!title || !department || !type || !location || !description) {
      return res.status(400).json({
        success: false,
        message: "Title, department, type, location, and description are required",
      });
    }

    // Validate requirements and responsibilities
    if (!requirements || !Array.isArray(requirements) || requirements.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one requirement is needed",
      });
    }

    if (!responsibilities || !Array.isArray(responsibilities) || responsibilities.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one responsibility is needed",
      });
    }

    // Validate salary range
    if (
      !salaryRange ||
      !salaryRange.min ||
      !salaryRange.max ||
      salaryRange.min >= salaryRange.max
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid salary range is required",
      });
    }

    const newJob = new Job({
      title: sanitizeInput(title),
      department: sanitizeInput(department),
      type: sanitizeInput(type),
      location: sanitizeInput(location),
      description: sanitizeInput(description),
      requirements: requirements.map(req => sanitizeInput(req)),
      responsibilities: responsibilities.map(resp => sanitizeInput(resp)),
      benefits: benefits ? benefits.map(benefit => sanitizeInput(benefit)) : [],
      salaryRange: {
        min: parseInt(salaryRange.min),
        max: parseInt(salaryRange.max),
        currency: salaryRange.currency || "$",
      },
      status: status || "draft",
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : undefined,
      isActive: status === "active",
      postedBy: req.user?.id, // Assuming user is available from auth middleware
    });

    const savedJob = await newJob.save();

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: savedJob,
    });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create job",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    });
  }
};

// Update a job (admin only)
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    // Sanitize string inputs
    if (updateData.title) updateData.title = sanitizeInput(updateData.title);
    if (updateData.department) updateData.department = sanitizeInput(updateData.department);
    if (updateData.type) updateData.type = sanitizeInput(updateData.type);
    if (updateData.location) updateData.location = sanitizeInput(updateData.location);
    if (updateData.description) updateData.description = sanitizeInput(updateData.description);

    // Sanitize arrays
    if (updateData.requirements) {
      updateData.requirements = updateData.requirements.map(req => sanitizeInput(req));
    }
    if (updateData.responsibilities) {
      updateData.responsibilities = updateData.responsibilities.map(resp => sanitizeInput(resp));
    }
    if (updateData.benefits) {
      updateData.benefits = updateData.benefits.map(benefit => sanitizeInput(benefit));
    }

    // Update isActive based on status
    if (updateData.status) {
      updateData.isActive = updateData.status === "active";
    }

    // Convert applicationDeadline to Date if provided
    if (updateData.applicationDeadline) {
      updateData.applicationDeadline = new Date(updateData.applicationDeadline);
    }

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate("postedBy", "name email");

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update job",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    });
  }
};

// Delete a job (admin only)
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    // Check if job has applications
    const applicationCount = await Application.countDocuments({ job: id });

    if (applicationCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete job with existing applications. Please close the job instead.",
      });
    }

    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete job",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    });
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  createJob,
  updateJob,
  deleteJob,
};
