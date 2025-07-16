const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// Get all rooms
router.get('/', roomController.getAllRooms);

// Add new room
router.post('/', roomController.createRoom);

// Get room by ID
router.get('/:roomId', roomController.getRoomById);

module.exports = router;
