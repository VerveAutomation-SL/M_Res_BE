const Resort = require('../models/resort');
const Room = require('../models/room');

// Get all resorts
const getAllResorts = async() =>{
    try{
        return await Resort.findAll();
    }catch(err){
        console.error('Error fetching resorts:', err);
        throw new Error('Could not fetch resorts');
    }
}

// Add new resort
const createResort = async(resortData)=>{
    try{
        return await Resort.create(resortData);
    }catch(err){
        console.error('Error creating resort:', err);
        throw new Error('Could not create resort');
    }
}

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


module.exports ={
    getAllResorts,
    createResort,
    getResortById,
    getRoomByResortId
};