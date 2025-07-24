const AppError = require('../utils/AppError');
const Restaurant = require('../models/restaurant');
const Table = require('../models/table');

const getAllTables = async () => {
    return await Table.findAll();
}

const getTableById = async (id) => {
    const table = await Table.findByPk(id);
    if (!table) {
        throw new AppError(404, 'Table not found');
    }
    return table;
}

const createTable = async ({ diningTableNumber, restaurantId }) => {
    const existingTable = await Table.findOne({ where: { diningTableNumber: diningTableNumber } });
    if (existingTable) {
        throw new AppError(400, 'Table with this number already exists');
    }
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
        throw new AppError(404, 'Restaurant not found');
    }
    const table = await Table.create({ diningTableNumber, restaurantId });
    return table;
}

const updateTable = async (id, { diningTableNumber, restaurantId }) => {
    const table = await getTableById(id);
    if (!table) {
        throw new AppError(404, 'Table not found');
    }
    await table.update({ diningTableNumber, restaurantId });
    return table;
}

const deleteTable = async (id) => {
    const table = await getTableById(id);
    if (!table) {
        throw new AppError(404, 'Table not found');
    }
    await table.destroy();
}

module.exports = {
    getAllTables,
    getTableById,
    createTable,
    updateTable,
    deleteTable
};