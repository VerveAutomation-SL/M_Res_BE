const Room = require('../models/room');

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
    try{
        return await Room.create(roomData);
    }catch(err){
        console.error('Error creating room:', err);
        throw new Error('Could not create room');
    }
}

module.exports = {
    getAllRooms,
    createRoom
};