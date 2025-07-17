const Resort = require('../models/resort');
const Room = require('../models/room');
const AppError = require('../utils/AppError');

// Get all resorts
const getAllResorts = async() =>{
    try{
        return await Resort.findAll({
        include: {
            model: Room,
        }
    });
    }catch(err){
        console.error('Error fetching resorts:', err);
        throw new Error('Could not fetch resorts');
    }
}

// Add new resort
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

// get resort by ID
const getResortById = async(resortId) => {
    try {
        return await Resort.findByPk(resortId);
    } catch (err) {
        console.error('Error fetching resort by ID:', err);
        throw new Error('Could not fetch resort by ID');
    }
}

// get room for a specific resort
const getRoomByResortId = async(resortId) => {
    try {
        return await Room.findAll({ where: { resort_id: resortId } });
    } catch (err) {
        console.error('Error fetching rooms by resort ID:', err);
        throw new Error('Could not fetch rooms by resort ID');
    }
}

// update a resort
const updateResort = async (resortId, resortData) => {
    const resort = await Resort.findByPk(resortId);
    if (!resort) {
        throw new AppError(404, `Resort with ID ${resortId} not found`);
    }
    return await resort.update(resortData);
};

// delete a resort
const deleteResort = async (resortId) => {
    const resort = await Resort.findByPk(resortId);
    if (!resort) {
        throw new AppError(404, `Resort with ID ${resortId} not found`);
    }
    return await resort.destroy();
};

module.exports ={
    getAllResorts,
    createResort,
    getResortById,
    getRoomByResortId,
    updateResort,
    deleteResort
};