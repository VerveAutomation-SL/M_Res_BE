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

// Get room by resort ID
// const getRoomByResortId = async (req, res) => {
//     const { resortId } = req.params;

//     try {
//         const rooms = await roomServices.getRoomByResortId(resortId);
//         if (!rooms || rooms.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'No rooms found for this resort'
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             data: rooms
//         });
//     } catch (err) {
//         console.error('Error fetching rooms by resort ID:', err);
//         return res.status(500).json({
//             success: false,
//             message: 'Could not fetch rooms by resort ID',
//             err: err.message
//         });
//     }
// };

module.exports = {
    getAllRooms,
    createRoom
};