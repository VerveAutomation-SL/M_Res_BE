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
    try{
        const { room_number, resort_id } = req.body;

        // Validate required fields
        if (!room_number || !resort_id) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (!room_number.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Room number cannot be empty'
            });
        }

        if (isNaN(resort_id) || resort_id <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Valid resort ID is required'
            });
        }

        const newRoom = await roomServices.createRoom({ room_number, resort_id });
        return res.status(201).json({
            success: true,
            message: 'Room created successfully',
            data: newRoom
        });
    }catch(error){
        console.error('Error creating room:', error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
}

// Get room by ID
const getRoomById = async (req, res) => {
    const { roomId } = req.params;

    try {
        const room = await roomServices.getRoomById(roomId);
        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: room
        });
    } catch (err) {
        console.error('Error fetching room by ID:', err);
        return res.status(500).json({
            success: false,
            message: 'Could not fetch room by ID',
            err: err.message
        });
    }
}

// Update a room
const updateRoom = async (req, res) => {
    const roomId = req.params.roomId;
    const { room_number, resort_id} = req.body;
    console.log('Updating room:', roomId);
    console.log('Room data:', req.body);

    try {
        // Validate required fields
        if (!room_number || !resort_id) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        console.log('Updating room:', roomId);
        const updatedRoom = await roomServices.updateRoom(roomId, { room_number, resort_id });
        res.status(200).json({
            success: true,
            message: 'Room updated successfully',
            data: updatedRoom
        });
    } catch (error) {
        console.error('Error updating room:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
}

// Delete a room
const deleteRoom = async (req, res) => {
    const roomId = req.params.roomId;

    try {
        const deletedRoom = await roomServices.deleteRoom(roomId);
        res.status(200).json({
            success: true,
            message: 'Room deleted successfully',
            data: deletedRoom
        });
    } catch (error) {
        console.error('Error deleting room:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
}


module.exports = {
    getAllRooms,
    createRoom,
    getRoomById,
    updateRoom,
    deleteRoom
};