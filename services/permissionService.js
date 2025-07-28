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

module.exports = {
    getAllPermissions
};
