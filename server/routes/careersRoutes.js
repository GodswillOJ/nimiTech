const express = require("express");
const router = express.Router();
const { upload } = require("../config/cloudinary");
const { protect } = require("../middleware/authMiddleware");
const {
  getAllJobs,
  getJobById,
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/careersController");

// Public routes
router.get("/jobs", getAllJobs);
router.get("/jobs/:id", getJobById);

// Application submission route with file upload
router.post(
  "/jobs/:jobId/apply",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "coverLetter", maxCount: 1 },
  ]),
  submitApplication
);

// Protected routes (admin only)
router.post("/jobs", protect, createJob);
router.put("/jobs/:id", protect, updateJob);
router.delete("/jobs/:id", protect, deleteJob);
router.get("/applications", protect, getAllApplications);
router.get("/applications/:id", protect, getApplicationById);
router.patch("/applications/:id/status", protect, updateApplicationStatus);

module.exports = router;
