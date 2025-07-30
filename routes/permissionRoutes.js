const express = require('express');
const router = express.Router();
const { getAllPermissionsController, getAdminPermissionsController, getAllUserPermissionsController } = require('../controllers/permissionController');

router.get('/', getAllPermissionsController);
router.get('/admin', getAdminPermissionsController);
router.get('/user', getAllUserPermissionsController);

module.exports = router;