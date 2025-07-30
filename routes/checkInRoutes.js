const express = require('express');
const router = express.Router();
const checkInController = require('../controllers/checkInController');

router.get('/check-ins', checkInController.getCheckInsinResort);

// Process a new check-in
router.post('/check-in',checkInController.processCheckIn);

// Get room check-in status for a specific resort and meal type
router.get('/room-status', checkInController.getRoomCheckInStatus);

// Get check-in details for a specific room and meal type
router.get('/details', checkInController.getCheckInDetails);

// Get today's check-ins for a specific resort
router.get('/today', checkInController.getTodayCheckIns);

// Get today's check-ins for all resorts
router.get('/today/all', checkInController.getTodayAllCheckIns);

// Get all check-ins for a resort
router.get('/:resortId', checkInController.getAllCheckIns);

// Process check-out for a room
router.post('/check-out', checkInController.checkOutRoom);




module.exports = router;