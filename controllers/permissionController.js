const { getAllPermissions, getAdminPermissions, getAllUserPermissions } = require('../services/permissionService');

const getAllPermissionsController = async (req, res) => {
    try {
        const permissions = await getAllPermissions();
        res.status(200).json({
            success: true,
            data: permissions
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const getAdminPermissionsController = async (req, res) => {
    try {
        const permissions = await getAdminPermissions();
        res.status(200).json({
            success: true,
            data: permissions
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllUserPermissionsController = async (req, res) => {
    try {
        const permissions = await getAllUserPermissions();
        res.status(200).json({
            success: true,
            data: permissions
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    getAllPermissionsController,
    getAdminPermissionsController,
    getAllUserPermissionsController
};