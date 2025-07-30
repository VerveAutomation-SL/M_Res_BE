// services/userService.js
const AppError = require('../utils/AppError');
const User = require('../models/Users');
const Permission = require('../models/Permission');
const { Op } = require('sequelize');

const getAllUsers = async () => {
    const whereClause = {
        role: {
            [Op.or]: ['Manager', 'Host']
        }
    };
    
    const { rows: users, count } = await User.findAndCountAll({
        where: whereClause,
        include: [{
            model: Permission,
            as: 'permission',
        }],
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
        include: [{
            model: Permission,
            as: 'permission',
        }],
        attributes: { exclude: ['password'] }
    });
    
    if (!user) {
        throw new AppError(404, 'User not found');
    }
    return user;
};

const getUsersByRole = async (role) => {
    return await User.findAll({
        where: { role },
        include: [{
            model: Permission,
            as: 'permission',
        }],
        attributes: { exclude: ['password'] },
        order: [['username', 'ASC']]
    });
};

const createUser = async ({ username, email, password, role, PermissionId }) => {
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
    
    // Check if permission exists if provided
    if (PermissionId) {
        const permission = await Permission.findByPk(PermissionId);
        if (!permission) {
            throw new AppError(404, 'Permission not found');
        }
    }
    
    const user = await User.create({
        username,
        email,
        password,
        role,
        PermissionId
    });
    
    // Return user with permission details
    return await User.findByPk(user.UserId, {
        include: [{
            model: Permission,
            as: 'permission',
        }],
        attributes: { exclude: ['password'] }
    });
};

const updateUser = async (id, { username, email, password, role, status, PermissionId }) => {
    const user = await getUserById(id);
    if (!user) {
        throw new AppError(404, 'User not found');
    }
    
    console.log(`Updating user ${user.username} with new data: username=${username}, email=${email}, role=${role}, status=${status}, PermissionId=${PermissionId}`);
    
    // Check if permission exists if provided
    if (PermissionId) {
        const permission = await Permission.findByPk(PermissionId);
        if (!permission) {
            throw new AppError(404, 'Permission not found');
        }
    }
    
    
    await user.update({
        username,
        email,
        password,
        role,
        status,
        PermissionId
    });
    
    // Return updated user with permission details
    return await User.findByPk(id, {
        include: [{
            model: Permission,
            as: 'permission',
        }],
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
        include: [{
            model: Permission,
            as: 'permission',
        }],
        attributes: { exclude: ['password'] }
    });
};

const getUserByUsername = async (username) => {
    return await User.findOne({
        where: { username },
        include: [{
            model: Permission,
            as: 'permission',
        }],
        attributes: { exclude: ['password'] }
    });
};

const getUsersByPermission = async (permissionId) => {
    return await User.findAll({
        where: { PermissionId: permissionId },
        include: [{
            model: Permission,
            as: 'permission',
        }],
        attributes: { exclude: ['password'] },
        order: [['username', 'ASC']]
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
    getUsersByPermission,
    getActivehosts
};