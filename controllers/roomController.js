const roomServices = require('../services/roomServices');

// Get all rooms
const getAllRooms = async (req, res) => {
    try{
        const rooms = await roomServices.getAllRooms();
        return res.status(200).json({
            success: true,
            count: rooms.length,
            data: rooms
        });
    }catch(err){
        console.error('Error fetching rooms:', err);
        return res.status(500).json({
            success: false,
            message: 'Could not fetch rooms',
            err: err.message
        });
    }
}

// Add new room
const createRoom = async (req, res) => {
    const roomData = req.body;

    try{
        const newRoom = await roomServices.createRoom(roomData);
        return res.status(201).json({
            success: true,
            data: newRoom
        });
    }catch(err){
        console.error('Error creating room:', err);
        return res.status(500).json({
            success: false,
            message: 'Could not create room',
            err: err.message
        });
    }
};

module.exports = {
    getAllRooms,
    createRoom
};