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

// // get room for a specific resort
// const getRoomByResortId = async(resortId) => {
//     try {
//         return await Room.findAll({ where: { resort_id: resortId } });
//     } catch (err) {
//         console.error('Error fetching rooms by resort ID:', err);
//         throw new Error('Could not fetch rooms by resort ID');
//     }
// }

module.exports = {
    getAllRooms,
    createRoom
};