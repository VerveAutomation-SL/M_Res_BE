const express = require('express');
const router = express.Router();
const { getAllResortsController, createResortController, updateResortController, deleteResortController } = require('../controller/resortController');


router.get('/', getAllResortsController);
router.post('/', createResortController);
router.put('/:id', updateResortController);
router.delete('/:id', deleteResortController);

module.exports = router;