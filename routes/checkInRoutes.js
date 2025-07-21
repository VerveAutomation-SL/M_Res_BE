const express = require('express');
const router = express.Router();
const checkInController = require('../controllers/checkInController');

// Process a new check-in
router.post('/check-in',checkInController.processCheckIn);

// Get room check-in status for a specific resort and meal type
router.get('/room-status', checkInController.getRoomCheckInStatus);

// Get check-in details for a specific room and meal type
router.get('/details', checkInController.getCheckInDetails);

// Get today's check-ins for a specific resort
router.get('/today', checkInController.getTodayCheckIns);

// Get all check-ins for a resort
router.get('/:resortId', checkInController.getAllCheckIns);

// Process check-out for a room
router.post('/check-out', checkInController.checkOutRoom);




module.exports = router;