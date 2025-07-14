const express = require('express');
const router = express.Router();
const checkInController = require('../controllers/checkInController');

// Process a new check-in
router.post('/check-in',checkInController.processCheckIn);

// Get room check-in status for a specific resort and meal type
router.get('/room-status', checkInController.getRoomCheckInStatus);

// Get all check-ins for a resort
router.get('/:resortId', checkInController.getAllCheckIns);

module.exports = router;