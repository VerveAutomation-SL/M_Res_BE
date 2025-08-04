// services/userService.js
const AppError = require('../utils/AppError');
const User = require('../models/Users');
const { Op, Model } = require('sequelize');
const Resort = require('../models/resort');
const Restaurant = require('../models/restaurant');

const getAllUsers = async () => {
    const whereClause = {
        role: {
            [Op.or]: ['Manager', 'Host']
        }
    };
    
    const { rows: users, count } = await User.findAndCountAll({
        where: whereClause,
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']],
    });
    
    return {
        users,
        count,
    };
};

const getUserById = async (id) => {
    const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
        include: [
            {
                model: Resort,
                as: "resorts",
            },
            {
                model: Restaurant,
                as: "restaurant",
            }
        ],
    });
    
    if (!user) {
        throw new AppError(404, 'User not found');
    }
    return user;
};

const getUsersByRole = async (role) => {
    return await User.findAll({
        where: { role },
        attributes: { exclude: ['password'] },
        order: [['username', 'ASC']]
    });
};

const createUser = async ({ username, email, password, role, meal_type, resortId, restaurantId, }) => {
    // Check if user already exists
    const existingUser = await User.findOne({
        where: {
            [Op.or]: [
                { username: username },
                { email: email }
            ]
        }
    });
    
    if (existingUser) {
        if (existingUser.username === username) {
            throw new AppError(400, `User with username ${username} already exists`);
        }
        if (existingUser.email === email) {
            throw new AppError(400, `User with email ${email} already exists`);
        }
    }
    
    const user = await User.create({
        username,
        email,
        password,
        role,
        meal_type: meal_type || 'All',
        resortId: resortId || null,
        restaurantId: restaurantId || null 
    });
    
    // Return user with permission details
    return await User.findByPk(user.UserId, {
        attributes: { exclude: ['password'] }
    });
};

const updateUser = async (id, { username, email, password, role, status, resortId, restaurantId, meal_type }) => {
    const user = await getUserById(id);
    if (!user) {
        throw new AppError(404, 'User not found');
    }
    
    console.log(`Updating user ${user.username} with new data: username=${username}, email=${email}, role=${role}, status=${status}, resortId=${resortId}, restaurantId=${restaurantId}, meal_type=${meal_type}`);

    await user.update({
        username,
        email,
        password,
        role,
        status,
        resortId,
        restaurantId,
        meal_type
    });
    
    // Return updated user with permission details
    return await User.findByPk(id, {
        attributes: { exclude: ['password'] }
    });
};

const deleteUser = async (id) => {
    const user = await getUserById(id);
    if (!user) {
        throw new AppError(404, 'User not found');
    }
    await user.destroy();
};

const getUserStatistics = async () => {
    const totalUsers = await User.count();
    const totalAdmins = await User.count({ where: { role: 'Admin' } });
    const totalManagers = await User.count({ where: { role: 'Manager' } });
    const totalHosts = await User.count({ where: { role: 'Host' } });
    
    return {
        totalUsers,
        totalAdmins,
        totalManagers,
        totalHosts,
    };
};

// Additional utility functions
const getUserByEmail = async (email) => {
    return await User.findOne({
        where: { email },
        attributes: { exclude: ['password'] }
    });
};

const getUserByUsername = async (username) => {
    return await User.findOne({
        where: { username },
        attributes: { exclude: ['password'] }
    });
};


const getActivehosts = async () => {
    return await User.count({
        where: { role: 'Host', status: 'Active' }
    });
};

module.exports = {
    getAllUsers,
    getUserById,
    getUsersByRole,
    createUser,
    updateUser,
    deleteUser,
    getUserStatistics,
    getUserByEmail,
    getUserByUsername,
    getActivehosts
};