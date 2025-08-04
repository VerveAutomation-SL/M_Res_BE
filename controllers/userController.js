
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUsersByRole,
    getUserStatistics,
    getActivehosts
} = require('../services/userService');

const getAllUsersController = async (req, res) => {
    try {
        const result = await getAllUsers();
        
        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: result.users,
            count: result.count
        });
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving users',
            error: error.message
        });
    }
};


const getUserByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await getUserById(id);
        res.status(200).json({
            success: true,
            message: 'User retrieved successfully',
            data: user
        });
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllAdminController = async (req, res) => {
    try {
        const Admin = await getUsersByRole('Admin');
        res.status(200).json({
            success: true,
            message: 'Admin retrieved successfully',
            data: Admin,
            count: Admin.length
        });
    } catch (error) {
        console.error('Error retrieving Admin:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving Admin',
            error: error.message
        });
    }
};
const getAllManagersController = async (req, res) => {
    try {
        const managers = await getUsersByRole('Manager');
        res.status(200).json({
            success: true,
            message: 'Managers retrieved successfully',
            data: managers,
            count: managers.length
        });
    } catch (error) {
        console.error('Error retrieving managers:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving managers',
            error: error.message
        });
    }
};

const getAllHostsController = async (req, res) => {
    try {
        const hosts = await getUsersByRole('Host');
        res.status(200).json({
            success: true,
            message: 'Hosts retrieved successfully',
            data: hosts,
            count: hosts.length
        });
    } catch (error) {
        console.error('Error retrieving hosts:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving hosts',
            error: error.message
        });
    }
};

const createUserController = async (req, res) => {
    const { username, email, password, role, meal_type, resortId, restaurantId, } = req.body;

    if (!username || !email || !password || !role || !meal_type) {
        return res.status(400).json({
            success: false,
            message: 'Username, email, password, role and meal type are required'
        });
    }
    if (!['Admin', 'Manager', 'Host'].includes(role)) {
        return res.status(400).json({
            success: false,
            message: 'Role must be either Admin, Manager, or Host'
        });
    }


    try {
        const newUser = await createUser({ username, email, password, role, meal_type, resortId, restaurantId });
        res.status(201).json({
            success: true,
            message: `User created successfully as ${role}`,
            data: newUser
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const updateUserController = async (req, res) => {
    const { id } = req.params;
    const { username, email, password, role, status, meal_type, resortId, restaurantId, } = req.body;

    if (status && !['Active', 'Inactive'].includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Status must be either Active or Inactive'
    })
    }

    if (!['Admin', 'Manager', 'Host'].includes(role)) {
        return res.status(400).json({
            success: false,
            message: 'Role must be either Admin, Manager, or User'
        });
    }

    try {
        const updatedUser = await updateUser(id, { 
            username, 
            email, 
            password, 
            role, 
            status,
            meal_type,
            resortId,
            restaurantId

        });
        res.status(200).json({
            success: true,
            message: `${role} updated successfully.`,
            data: updatedUser
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteUserController = async (req, res) => {
    const { id } = req.params;

    try {
        await deleteUser(id);
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const getUserStatsController = async (req, res) => {
    try {
        const stats = await getUserStatistics();
        res.status(200).json({
            success: true,
            message: 'User statistics retrieved successfully',
            data: stats
        });
    } catch (error) {
        console.error('Error retrieving user statistics:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving user statistics',
            error: error.message
        });
    }
};

const getActivehostsController = async (req, res) => {
    try {
        const count = await getActivehosts();
        res.status(200).json({
            success: true,
            message: 'Active hosts retrieved successfully',
            data: count
        });
    } catch (error) {
        console.error('Error retrieving active hosts:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving active hosts',
            error: error.message
        });
    }
};


module.exports = {
    getAllUsersController,
    getUserByIdController,
    getAllAdminController,
    getAllManagersController,
    getAllHostsController,
    createUserController,
    updateUserController,
    deleteUserController,
    getUserStatsController,
    getActivehostsController
};