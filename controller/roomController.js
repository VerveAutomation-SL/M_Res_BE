const { createRoom, updateRoom, deleteRoom } = require('../service/roomService');

const createRoomController = async (req, res) => {
    try {
        const {roomNumber, resortId, roomType} = req.body;

        // Validate required fields
        if (!roomNumber || !resortId || !roomType) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const newRoom = await createRoom({roomNumber, resortId, roomType});
        res.status(201).json({
            success: true,
            message: 'Room created successfully',
            data: newRoom
        });
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
}

const updateRoomController = async (req, res) => {
    const roomId = req.params.id;
    const { roomNumber, resortId, roomType } = req.body;

    try {
        // Validate required fields
        if (!roomNumber || !resortId || !roomType) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const updatedRoom = await updateRoom(roomId, { roomNumber, resortId, roomType });
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
};

const deleteRoomController = async (req, res) => {
    const roomId = req.params.id;

    try {
        const deletedRoom = await deleteRoom(roomId);
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
    createRoomController,
    updateRoomController,
    deleteRoomController
};