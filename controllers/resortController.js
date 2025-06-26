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

module.exports={
    getAllResorts,
    createResort
};