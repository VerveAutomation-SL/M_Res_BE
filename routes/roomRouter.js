const express = require('express');
const router = express.Router();
const { createRoomController, updateRoomController, deleteRoomController } = require('../controller/roomController');

router.post('/', createRoomController);
router.put('/:id', updateRoomController);
router.delete('/:id', deleteRoomController);

module.exports = router;