const express = require("express");
const router = express.Router();
const businessController = require("../controllers/businessController");

// New route for contact form
router.post("/contact", businessController.contactBusiness);
router.post("/inquiry", businessController.inquireService);

module.exports = router;
