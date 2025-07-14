const express = require('express');
const router = express.Router();
const resortController = require('../controllers/resortController');

// Get all resorts
router.get('/', resortController.getAllResorts);

// Add new resort
router.post('/', resortController.createResort);
// Get rooms by resort ID
router.get('/:resortId/rooms', resortController.getRoomByResortId );
// Get resort by ID
router.get('/:resortId', resortController.getResortById);



module.exports = router;