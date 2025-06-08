// routes/businessRoutes.js
const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');

router.get('/', businessController.getAllBusinessPosts);
router.post('/', businessController.createBusinessPost);

module.exports = router;
