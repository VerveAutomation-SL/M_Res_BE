const express = require('express');
const router = express.Router();
const { getAllPermissionsController } = require('../controllers/permissionController');

router.get('/', getAllPermissionsController);

module.exports = router;