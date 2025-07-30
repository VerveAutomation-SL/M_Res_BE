// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
    getAllUsersController,
    getUserByIdController,
    createUserController,
    updateUserController,
    deleteUserController,
    getAllAdminController,
    getAllHostsController,
    getAllManagersController,
    getUserStatsController,
    getActivehostsController
} = require('../controllers/userController');

// General user management routes
router.get('/', getAllUsersController);
router.get('/stats/overview', getUserStatsController);
router.get('/admins', getAllAdminController);
router.get('/managers', getAllManagersController);
router.get('/hosts', getAllHostsController);
router.get('/:id', getUserByIdController);

router.post('/', createUserController); 

router.put('/:id', updateUserController);
router.delete('/:id', deleteUserController);

// Active hosts route
router.get('/active/hosts', getActivehostsController);

module.exports = router;