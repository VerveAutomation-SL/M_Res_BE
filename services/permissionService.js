const { Op } = require('sequelize');
const Permission = require('../models/Permission');
const AppError = require('../utils/AppError');

const getAllPermissions = async () => {
    try {
        const permissions = await Permission.findAll({
            order: [['description', 'ASC']]
        });
        return permissions;
    } catch (err) {
        console.error('Error fetching permissions:', err);
        throw new AppError(500, 'Could not fetch permissions');
    }
}

const getAdminPermissions = async () => {
    try {
        const permissions = await Permission.findAll({
            where: {
                meal_type: 'All',
                restaurantId: null,
                name: "Admin"
            },
            order: [['description', 'ASC']]
        });
        return permissions;
    } catch (err) {
        console.error('Error fetching admin permissions:', err);
        throw new AppError(500, 'Could not fetch admin permissions');
    }
}

const getAllUserPermissions = async () => {
    try {
        const permissions = await Permission.findAll({
            where: {
                name: {
                    [Op.not]: 'Admin'
                },
            },
            order: [['description', 'ASC']]
        });
        return permissions;
    } catch (err) {
        console.error('Error fetching user permissions:', err);
        throw new AppError(500, 'Could not fetch user permissions');
    }
}

module.exports = {
    getAllPermissions,
    getAdminPermissions,
    getAllUserPermissions
};
