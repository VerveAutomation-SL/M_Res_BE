const express = require('express');
const router = express.Router();
const checkInController = require('../controllers/checkInController');

// Get all check-ins
router.get('/:resortId', checkInController.getAllCheckIns);

// Process a new check-in
router.post('/check-in',checkInController.processCheckIn);

module.exports = router;