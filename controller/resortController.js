const { getAllResorts, createResort, updateResort, deleteResort } = require("../service/resortService");

const getAllResortsController = async (req, res) => {
    try {
        const resorts = await getAllResorts();
        res.status(200).json({
            success: true,
            message: "All Resorts fetched successfully",
            data: resorts
        });
    } catch (error) {
        console.error("Error fetching resorts:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
}

const createResortController = async (req, res) => {
    try {
        const {resortNumber, resortName, location, totalRooms } = req.body;

        // Validate required fields
        if (!resortNumber || !resortName || !location || !totalRooms) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const newResort = await createResort({ resortNumber, resortName, location, totalRooms });
        res.status(201).json({
            success: true,
            message: "Resort created successfully",
            data: newResort
        });
    } catch (error) {
        console.error("Error creating resort:", error);
        res.status(error.statusCode || 500).json({ 
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
}

const updateResortController = async (req, res) => {
    const resortId = req.params.id;
    const { resortNumber, resortName, location, totalRooms } = req.body;

    try {
        // Validate required fields
        if (!resortNumber || !resortName || !location || !totalRooms) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const updatedResort = await updateResort(resortId, { resortNumber, resortName, location, totalRooms });
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
}

const deleteResortController = async (req, res) => {
    const resortId = req.params.id;

    try {
        const deletedResort = await deleteResort(resortId);
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
}

module.exports = {
    getAllResortsController,
    createResortController,
    updateResortController,
    deleteResortController
};