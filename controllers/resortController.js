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
        const newResort = await resortService.createResort(resortData);

        return res.status(201).json({
            success: true,
            data: newResort
        });
    }catch(err){
        console.error('Error creating resort:', err);
        return res.status(500).json({
            success: false,
            message: 'Could not create resort',
            err: err.message
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

module.exports={
    getAllResorts,
    createResort,
    getResortById,
    getRoomByResortId

};