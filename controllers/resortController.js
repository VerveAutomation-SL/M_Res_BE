const resortService = require('../services/resortService');

//Get all resorts
const getAllResorts = async(req,res)=>{
    try{
        const resorts = await resortService.getAllResorts();

        return res.status(200).json({
            success: true,
            count: resorts.length,
            data: resorts
        });
    }catch(err){
        console.error('Error fetching resorts:', err);
        return res.status(500).json({
            success: false,
            message: 'Could not fetch resorts',
            err: err.message
        });
    }
}

// Add new resort
const createResort = async(req,res)=>{
    const resortData = req.body;

    try{
        
        // Validate required fields
        if (!resortData.name || !resortData.location) {
            return res.status(400).json({
                success: false,
                message: 'Name and location are required'
            });
        }

        const newResort = await resortService.createResort(resortData);

        return res.status(201).json({
            success: true,
            message: 'Resort created successfully',
            data: newResort
        });
    }catch(error){
        console.error('Error creating resort:', error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};

// Get resort by ID
const getResortById = async(req, res) => {
    const { resortId } = req.params;

    try {
        const resort = await resortService.getResortById(resortId);
        if (!resort) {
            return res.status(404).json({
                success: false,
                message: 'Resort not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: resort
        });
    } catch (err) {
        console.error('Error fetching resort by ID:', err);
        return res.status(500).json({
            success: false,
            message: 'Could not fetch resort by ID',
            err: err.message
        });
    }
};

// Get rooms by resort ID
const getRoomByResortId = async (req, res) => {
    const { resortId } = req.params;

    try {
        const rooms = await resortService.getRoomByResortId(resortId);
        if (!rooms || rooms.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No rooms found for this resort'
            });
        }

        return res.status(200).json({
            success: true,
            data: rooms
        });
    } catch (err) {
        console.error('Error fetching rooms by resort ID:', err);
        return res.status(500).json({
            success: false,
            message: 'Could not fetch rooms by resort ID',
            err: err.message
        });
    }
};

// Update a resort
const updateResort = async (req, res) => {
    const resortId = req.params.id;
    const { name, location } = req.body;

    try {
        // Validate required fields
        if (!name || !location) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const updatedResort = await resortService.updateResort(resortId, { name, location });
        res.status(200).json({
            success: true,
            message: "Resort updated successfully",
            data: updatedResort
        });
    } catch (error) {
        console.error("Error updating resort:", error);
        res.status(error.statusCode || 500).json({ 
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

// Delete a resort
const deleteResort = async (req, res) => {
    const resortId = req.params.id;

    try {
        const deletedResort = await resortService.deleteResort(resortId);
        res.status(200).json({
            success: true,
            message: "Resort deleted successfully",
            data: deletedResort
        });
    } catch (error) {
        console.error("Error deleting resort:", error);
        res.status(error.statusCode || 500).json({ 
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

module.exports={
    getAllResorts,
    createResort,
    getResortById,
    getRoomByResortId,
    updateResort,
    deleteResort
};