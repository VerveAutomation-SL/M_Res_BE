const Resort = require("../models/resort");
const Room = require("../models/room");
const AppError = require("../utils/AppError");

const getAllResorts = async () => {
    return await Resort.findAll({
        include: {
            model: Room,
    }});
};

const createResort = async (resortData) => {
    
    // Validate resortData
    const resort = await Resort.findOne({
        where: {
            resortId: resortData.resortId
        }
    });
    if (resort) {
        throw new AppError(409, `Resort with ${resortData.resortId} already exists`);
    }
    return await Resort.create(resortData);
};

const updateResort = async (resortId, resortData) => {
    const resort = await Resort.findByPk(resortId);
    if (!resort) {
        throw new AppError(404, `Resort with ID ${resortId} not found`);
    }
    return await resort.update(resortData);
};

const deleteResort = async (resortId) => {
    const resort = await Resort.findByPk(resortId);
    if (!resort) {
        throw new AppError(404, `Resort with ID ${resortId} not found`);
    }
    return await resort.destroy();
};


module.exports = {
    getAllResorts,
    createResort,
    updateResort,
    deleteResort
};