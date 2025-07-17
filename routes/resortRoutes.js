const express = require('express');
const router = express.Router();
const resortController = require('../controllers/resortController');

// Get all resorts
router.get('/', resortController.getAllResorts);

// Create a new resort
router.post('/', resortController.createResort);

// Get rooms by resort ID
router.get('/:resortId/rooms', resortController.getRoomByResortId);

// Get resort by ID
router.get('/:resortId', resortController.getResortById);

// Update a resort
router.put('/:id', resortController.updateResort);

// Delete a resort
router.delete('/:id', resortController.deleteResort);

module.exports = router;