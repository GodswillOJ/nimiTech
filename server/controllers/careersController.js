// Serve resume PDF
const getResumePdf = (req, res) => {
  try {
    const { filename } = req.params;

    // Validate filename to prevent path traversal
    if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return res.status(400).json({ message: "Invalid filename" });
    }

    const filePath = path.join(__dirname, "../uploads/docs/resume", filename);

    // Check if file exists and get stats
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const stats = fs.statSync(filePath);

    // Set proper headers for PDF serving
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", stats.size);
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    res.setHeader("Cache-Control", "public, max-age=3600"); // Cache for 1 hour
    res.setHeader("Accept-Ranges", "bytes");

    // Send file with proper error handling
    res.sendFile(path.resolve(filePath), err => {
      if (err) {
        console.error("Error serving resume PDF:", err);
        if (!res.headersSent) {
          res.status(500).json({ message: "Error serving resume file" });
        }
      }
    });
  } catch (error) {
    console.error("Error in getResumePdf:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Serve cover letter PDF
const getCoverLetterPdf = (req, res) => {
  try {
    const { filename } = req.params;

    // Validate filename to prevent path traversal
    if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return res.status(400).json({ message: "Invalid filename" });
    }

    const filePath = path.join(__dirname, "../uploads/docs/coverLetter", filename);

    // Check if file exists and get stats
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Cover letter not found" });
    }

    const stats = fs.statSync(filePath);

    // Set proper headers for PDF serving
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", stats.size);
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    res.setHeader("Cache-Control", "public, max-age=3600"); // Cache for 1 hour
    res.setHeader("Accept-Ranges", "bytes");

    // Send file with proper error handling
    res.sendFile(path.resolve(filePath), err => {
      if (err) {
        console.error("Error serving cover letter PDF:", err);
        if (!res.headersSent) {
          res.status(500).json({ message: "Error serving cover letter file" });
        }
      }
    });
  } catch (error) {
    console.error("Error in getCoverLetterPdf:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const Job = require("../models/Job");
const Application = require("../models/Application");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const { docsUpload, coverLetterUpload } = require("../middleware/uploadMiddleware");
const cloudinaryService = require("../services/cloudinaryService");
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

    // Auto-close jobs that have passed their application deadline
    await Job.updateMany(
      {
        applicationDeadline: { $lt: new Date() },
        isActive: true,
        status: { $ne: "closed" },
      },
      {
        $set: {
          isActive: false,
          status: "closed",
        },
      }
    );

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("postedBy", "name email");

    const totalJobs = await Job.countDocuments(query);
    const totalPages = Math.ceil(totalJobs / limit);

    // Add no-cache headers for instant updates
    res.set({
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
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

// Get all jobs for admin (includes all statuses: active, draft, closed, etc.)
const getAllJobsAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const department = req.query.department;
    const type = req.query.type;
    const search = req.query.search;
    const status = req.query.status;

    // Build query - no isActive filter for admin
    let query = {};

    // Filter by status if provided
    if (status && status !== "all") {
      query.status = status;
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

    // Auto-close jobs past deadline
    await Job.updateMany(
      {
        applicationDeadline: { $lt: new Date() },
        status: { $ne: "closed" },
      },
      {
        $set: {
          isActive: false,
          status: "closed",
        },
      }
    );

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("postedBy", "name email");

    const totalJobs = await Job.countDocuments(query);
    const totalPages = Math.ceil(totalJobs / limit);

    // Add no-cache headers for instant updates
    res.set({
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
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
    console.error("Error fetching admin jobs:", error);
    res.status(500).json({
      message: "Failed to fetch admin jobs",
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

    // Add no-cache headers for instant updates
    res.set({
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
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
    let {
      firstName,
      lastName,
      email,
      phone,
      message,
      experience,
      city,
      stateCountry,
      workExperience,
      startDate,
      salaryExpectations,
      authorizedUS,
      sponsorship,
      contractOpen,
      portfolio,
      resumeUrl,
      coverLetterUrl,
    } = req.body;

    // Sanitize inputs
    firstName = sanitizeInput(firstName);
    lastName = sanitizeInput(lastName);
    email = sanitizeInput(email);
    phone = sanitizeInput(phone);
    message = sanitizeInput(message);
    city = sanitizeInput(city);
    stateCountry = sanitizeInput(stateCountry);
    workExperience = sanitizeInput(workExperience);
    startDate = sanitizeInput(startDate);
    salaryExpectations = sanitizeInput(salaryExpectations);
    authorizedUS = sanitizeInput(authorizedUS);
    sponsorship = sanitizeInput(sponsorship);
    contractOpen = sanitizeInput(contractOpen);
    portfolio = sanitizeInput(portfolio);

    // Validate job ID
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // if (!job.isActive) {
    //   return res.status(410).json({ message: "This job posting is no longer active" });
    // }

    // Check if application deadline has passed
    if (job.applicationDeadline && new Date() > job.applicationDeadline) {
      return res.status(410).json({ message: "Application deadline has passed" });
    }

    // Validate required fields
    const requiredFields = {
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      email: email?.trim(),
      phone: phone?.trim(),
      experience: experience?.trim(),
      city: city?.trim(),
      stateCountry: stateCountry?.trim(),
      workExperience: workExperience?.trim(),
      startDate: startDate?.trim(),
      salaryExpectations: salaryExpectations?.trim(),
      authorizedUS: authorizedUS?.trim(),
      sponsorship: sponsorship?.trim(),
      contractOpen: contractOpen?.trim(),
    };

    const missingFields = [];
    Object.entries(requiredFields).forEach(([field, value]) => {
      if (!value) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      console.log("Missing required fields:", missingFields);
      console.log("Received data:", req.body);
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
        missingFields,
      });
    }

    // Check if resume URL is provided (files uploaded separately)
    if (!req.body.resumeUrl) {
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

    // Prepare application data (using pre-uploaded file URLs)
    const applicationData = {
      job: jobId,
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      message,
      experience,
      city,
      stateCountry,
      workExperience,
      startDate,
      salaryExpectations,
      authorizedUS,
      sponsorship,
      contractOpen,
      ...(portfolio && { portfolio }),
      resume: {
        url: resumeUrl,
      },
    };

    // Add cover letter if provided
    if (coverLetterUrl) {
      applicationData.coverLetter = {
        url: coverLetterUrl,
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
          fs.unlinkSync(req.files.resume[0].path);
        }
        if (req.files.coverLetter && req.files.coverLetter[0]) {
          fs.unlinkSync(req.files.coverLetter[0].path);
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
      .limit(limit);

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

    const application = await Application.findById(id);

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

    // Check if user is authenticated since reviewedBy is required
    if (!req.admin || !req.admin?.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required to update application status",
      });
    }

    const application = await Application.findByIdAndUpdate(
      id,
      {
        status,
        notes: sanitizeInput(notes),
        reviewedBy: req.admin?.id,
        reviewedAt: new Date(),
      },
      { new: true }
    )
      // .populate("job")
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

    // Validate salary range if provided
    if (salaryRange) {
      if (
        salaryRange.min == null ||
        salaryRange.max == null ||
        salaryRange.min < 0 ||
        salaryRange.max < 0 ||
        salaryRange.min >= salaryRange.max
      ) {
        return res.status(400).json({
          success: false,
          message: "If provided, salary range must have valid min/max values",
        });
      }
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
      salaryRange: salaryRange
        ? {
            min: parseInt(salaryRange.min),
            max: parseInt(salaryRange.max),
            currency: salaryRange.currency || "$",
          }
        : null,
      status: status || "draft",
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : undefined,
      isActive: status === "active",
      postedBy: req.admin?.id, // Assuming user is available from auth middleware
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

// Upload resume file
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No resume file uploaded",
      });
    }

    // Use Cloudinary for cloud document storage
    const uploadOptions = {
      storageType: 'documents',
      subfolder: 'resume',
      prefix: 'resume'
    };

    const result = await cloudinaryService.uploadFile(req.file, uploadOptions);
    
    // Use direct Cloudinary URL for fast downloads
    const resumeUrl = result.url;

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      resumeUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("Error uploading resume:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload resume",
    });
  }
};

// Upload cover letter file
const uploadCoverLetter = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No cover letter file uploaded",
      });
    }

    // Use Cloudinary for cloud document storage
    const uploadOptions = {
      storageType: 'documents',
      subfolder: 'coverLetter',
      prefix: 'cover_letter'
    };

    const result = await cloudinaryService.uploadFile(req.file, uploadOptions);
    
    // Use direct Cloudinary URL for fast downloads
    const coverLetterUrl = result.url;

    res.status(200).json({
      success: true,
      message: "Cover letter uploaded successfully",
      coverLetterUrl,
      filename: result.filename,
      // Additional data from new service
      fileInfo: {
        url: result.url,
        size: result.size,
        originalName: result.originalname
      }
    });
  } catch (error) {
    console.error("Error uploading cover letter:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload cover letter",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Delete resume file
const deleteResume = async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Validate filename to prevent path traversal
    if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return res.status(400).json({
        success: false,
        message: "Invalid filename"
      });
    }

    // Extract public_id from filename (remove extension if present)
    const publicId = filename.replace(/\.[^/.]+$/, '');
    
    // Use Cloudinary service for deletion
    const result = await cloudinaryService.deleteFile(publicId, 'documents');

    if (result.success) {
      res.status(200).json({
        success: true,
        message: "Resume deleted successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Resume file not found",
      });
    }
  } catch (error) {
    console.error("Error deleting resume:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete resume",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Delete cover letter file
const deleteCoverLetter = async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Validate filename to prevent path traversal
    if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return res.status(400).json({
        success: false,
        message: "Invalid filename"
      });
    }

    // Extract public_id from filename (remove extension if present)
    const publicId = filename.replace(/\.[^/.]+$/, '');
    
    // Use Cloudinary service for deletion
    const result = await cloudinaryService.deleteFile(publicId, 'documents');

    if (result.success) {
      res.status(200).json({
        success: true,
        message: "Cover letter deleted successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Cover letter file not found",
      });
    }
  } catch (error) {
    console.error("Error deleting cover letter:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete cover letter",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const downloadDocument = async (req, res) => {
  try {
    const fileName = req.params.filename;
    const allowedExtensions = [".pdf", ".docx", ".doc"];

    if (fileName.includes("..") || fileName.includes("/")) {
      return res.status(400).json({ message: "Invalid filename." });
    }
    const fileExt = path.extname(fileName).toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
      return res.status(403).json({ message: "File type not allowed." });
    }

    // Extract public_id from filename (remove extension if present)
    const publicId = fileName.replace(/\.[^/.]+$/, '');
    
    try {
      // Get file info from Cloudinary
      const fileInfo = await cloudinaryService.getFileInfo(publicId, 'documents');
      
      if (!fileInfo) {
        return res.status(404).json({ message: "File not found." });
      }

      // Redirect to Cloudinary URL for download
      res.redirect(fileInfo.url);
      
    } catch (error) {
      console.error("File access error:", error);
      return res.status(404).json({ message: "File not found." });
    }
  } catch (error) {
    console.error("Error in downloadDocument:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal server error." });
    }
  }
};

module.exports = {
  getAllJobs,
  getAllJobsAdmin,
  getJobById,
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  createJob,
  updateJob,
  deleteJob,
  getResumePdf,
  getCoverLetterPdf,
  uploadResume,
  uploadCoverLetter,
  deleteResume,
  deleteCoverLetter,
  downloadDocument,
};
