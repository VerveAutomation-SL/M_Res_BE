const express = require('express');
const router = express.Router();

const { getAllResorts, createResort, updateResortController, deleteResortController,getRoomByResortId, getResortById } = require('../controller/resortController');


router.get('/', getAllResorts);
router.post('/', createResort);
// Get rooms by resort ID
router.get('/:resortId/rooms', getRoomByResortId );
// Get resort by ID
router.get('/:resortId', getResortById);

router.put('/:id', updateResortController);
router.delete('/:id', deleteResortController);





module.exports = router;