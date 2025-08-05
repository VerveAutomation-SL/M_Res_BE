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
    getActivehostsController,
    verifyUserPasswordController
} = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');

// General user management routes
router.get('/', getAllUsersController);
router.get('/stats/overview', getUserStatsController);
router.get('/admins', getAllAdminController);
router.get('/managers', getAllManagersController);
router.get('/hosts', getAllHostsController);
router.get('/:id', getUserByIdController);

router.post('/', authenticateToken, createUserController);

router.put('/:id', authenticateToken, updateUserController);
router.delete('/:id', authenticateToken, deleteUserController);

// Active hosts route
router.get('/active/hosts', getActivehostsController);

// Password verification route
router.post("/verify/password", verifyUserPasswordController);

module.exports = router;