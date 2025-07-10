const express = require('express');
const router = express.Router();
const { getAllTablesController, getTableByIdController, createTableController, updateTableController, deleteTableController } = require('../controller/tableController');

router.get('/', getAllTablesController);
router.get('/:id', getTableByIdController);
router.post('/', createTableController);
router.put('/:id', updateTableController);
router.delete('/:id', deleteTableController);

module.exports = router;