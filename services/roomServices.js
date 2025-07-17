const Room = require('../models/room');
const AppError = require('../utils/AppError');

// Get all rooms
const getAllRooms = async() =>{
    try{
        return await Room.findAll();
    }catch(err){
        console.error('Error fetching rooms:', err);
        throw new Error('Could not fetch rooms');
    }
}

// Add new room
const createRoom = async(roomData)=>{
    // Validate roomData
    const resortId = await Resort.findByPk(roomData.resort_id);
    if (!resortId) {
        throw new AppError(404, `Resort with ID ${roomData.resort_id} not found.`);
    }

    // Check if room already exists
    const existingRoom = await Room.findOne({
        where: {
            room_number: roomData.room_number,
            resort_id: resortId
        }
    });
    if (existingRoom) {
        throw new AppError(409, `Room with number ${roomData.room_number} already exists in resort ${resortId}.`);
    }

    return await Room.create(roomData);
}

// Get room by id
const getRoomById = async(roomId) => {
    try {
        return await Room.findByPk(roomId);
    } catch (err) {
        console.error('Error fetching room by ID:', err);
        throw new Error('Could not fetch room by ID');
    }
}

// Update a room
const updateRoom = async (roomId, roomData) => {
    const room = await Room.findByPk(roomId);
    if (!room) {
        throw new AppError(404, `Room with ID ${roomId} not found`);
    }
    return await room.update(roomData);
}

// Delete a room
const deleteRoom = async (roomId) => {
    const room = await Room.findByPk(roomId);
    if (!room) {
        throw new AppError(404, `Room with ID ${roomId} not found`);
    }
    return await room.destroy();
}

module.exports = {
    getAllRooms,
    createRoom,
    getRoomById,
    updateRoom,
    deleteRoom
};