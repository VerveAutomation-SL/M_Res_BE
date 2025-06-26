const express = require('express');
const router = express.Router();
const resortController = require('../controllers/resortController');

// Get all resorts
router.get('/', resortController.getAllResorts);

// Add new resort
router.post('/', resortController.createResort);

module.exports = router;