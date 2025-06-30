const Room = require("../models/room");
const Resort = require("../models/resort");
const AppError = require("../utils/AppError");

const createRoom = async (roomData) => {
    // Validate roomData
    const existingRoom = await Room.findOne({
        where: {
            roomNumber: roomData.roomNumber,
        }
    });
    if (existingRoom) {
        throw new AppError(409, `Room with number ${roomData.roomNumber} already exists.`);
    }
    const resort = await Resort.findByPk(roomData.resortId);
    if (!resort) {
        throw new AppError(404, `Resort with ID ${roomData.resortId} not found.`);
    }
    return await Room.create(roomData);
}

const updateRoom = async (roomId, roomData) => {
    const room = await Room.findByPk(roomId);
    if (!room) {
        throw new AppError(404, `Room with ID ${roomId} not found`);
    }
    return await room.update(roomData);
}

const deleteRoom = async (roomId) => {
    const room = await Room.findByPk(roomId);
    if (!room) {
        throw new AppError(404, `Room with ID ${roomId} not found`);
    }
    return await room.destroy();
}

module.exports = {
    createRoom,
    updateRoom,
    deleteRoom
};