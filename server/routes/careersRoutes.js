const express = require("express");
const router = express.Router();
const { docsUpload, coverLetterUpload } = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const {
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
} = require("../controllers/careersController");
// Serve resume PDF
router.get("/resume/:filename", getResumePdf);

// Serve cover letter PDF
router.get("/coverLetter/:filename", getCoverLetterPdf);

// Secure document download endpoint
router.get("/api/upload/doc/:filename", downloadDocument);

// File upload endpoints
router.post("/upload-resume", docsUpload.single('resume'), uploadResume);
router.post("/upload-cover-letter", coverLetterUpload.single('coverLetter'), uploadCoverLetter);

// File delete endpoints
router.delete("/delete-resume/:filename", deleteResume);
router.delete("/delete-cover-letter/:filename", deleteCoverLetter);

// Public routes
router.get("/jobs", getAllJobs);
router.get("/jobs/:id", getJobById);

// Application submission route (JSON-based, files uploaded separately)
router.post("/jobs/:jobId/apply", submitApplication);

// Protected routes (admin only)
router.get("/admin/jobs", protect, getAllJobsAdmin);
router.post("/jobs", protect, createJob);
router.put("/jobs/:id", protect, updateJob);
router.delete("/jobs/:id", protect, deleteJob);
router.get("/applications", protect, getAllApplications);
router.get("/applications/:id", protect, getApplicationById);
router.patch("/applications/:id/status", protect, updateApplicationStatus);

module.exports = router;
