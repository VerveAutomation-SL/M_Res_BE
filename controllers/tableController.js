const {getAllTables, getTableById, createTable, updateTable, deleteTable} = require('../services/tableService');

const getAllTablesController = async (req, res) => {
    try {
        const tables = await getAllTables();
        res.status(200).json({
            success: true,
            message: 'Tables retrieved successfully',
            data: tables
        });
    } catch (error) {
        console.error('Error retrieving tables:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving tables',
            error: error.message
        });
    }
}

const getTableByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const table = await getTableById(id);
        res.status(200).json({
            success: true,
            message: 'Table retrieved successfully',
            data: table
        });
    } catch (error) {
        console.error('Error retrieving table:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
}

const createTableController = async (req, res) => {
    const { diningTableNumber, restaurantId } = req.body;

    if (!diningTableNumber || !restaurantId) {
        return res.status(400).json({
            success: false,
            message: 'Table number and restaurant ID are required'
        });
    }

    try {
        const newTable = await createTable({ diningTableNumber, restaurantId });
        res.status(201).json({
            success: true,
            message: 'Table created successfully',
            data: newTable
        });
    } catch (error) {
        console.error('Error creating table:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const updateTableController = async (req, res) => {
    const { id } = req.params;
    const { diningTableNumber, restaurantId } = req.body;

    if (!diningTableNumber || !restaurantId) {
        return res.status(400).json({
            success: false,
            message: 'Table number and restaurant ID are required'
        });
    }

    try {
        const updatedTable = await updateTable(id, { diningTableNumber, restaurantId });
        res.status(200).json({
            success: true,
            message: 'Table updated successfully',
            data: updatedTable
        });
    } catch (error) {
        console.error('Error updating table:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteTableController = async (req, res) => {
    const { id } = req.params;
    try {
        await deleteTable(id);
        res.status(200).json({
            success: true,
            message: 'Table deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting table:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAllTablesController,
    getTableByIdController,
    createTableController,
    updateTableController,
    deleteTableController
};