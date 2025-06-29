const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');

router.get('/', businessController.getAllBusinessPosts);
router.post('/', businessController.createBusinessPost);

// New route for contact form
router.post('/contact', businessController.contactBusiness);

module.exports = router;
