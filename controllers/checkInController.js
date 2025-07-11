const checkInService = require('../services/checkInService');

// Get all check-ins for a resort
const getAllCheckIns = async (req, res) => {
    try{
        const {resortId} = req.params;
        const {date} = req.query;

        if(!resortId){
            return res.status(400).json({
                success:false,
                message: 'Resort ID is required'
            });
        }
        if(resortId === undefined){
            return res.status(200).json({
                success: true,
                count: checkIns.length,
                data: checkIns
            });
        }

        const checkIns = await checkInService.getCheckins(resortId, date ? new Date(date) : new Date());

        return res.status(200).json({
            success: true,
            count: checkIns.length,
            data: checkIns
        });
    } catch (error) {
        console.error('Error fetching check-ins:', error);
        return res.status(500).json({
            success: false,
            message: 'Could not fetch check-ins',
            err: error.message
        });
    }
};

// Process a new check-in
const processCheckIn = async (req,res) =>{
    try{
        const checkInData = req.body;

        // Validate required fields
        const requiredFields = ['resort_id', 'room_number', 'outlet_name', 'meal_type'];
        for (const field of requiredFields){
            if(!checkInData[field]){
                return res.status(400).json({
                    success: false,
                    message: `${field} is required`
                });
            }
        }

        // Validate meal type
        const validMealTypes = ['breakfast', 'lunch', 'dinner'];
        if(!validMealTypes.includes(checkInData.meal_type)){
            return res.status(400).json({
                success: false,
                message: 'Invalid meal type. Must be one of: breakfast, lunch, dinner'
            });
        }

        const checkin = await checkInService.createCheckIn(checkInData);

        return res.status(201).json({
            success: true,
            message: 'Check-in processed successfully',
            data: checkin
        });
    } catch (error) {
        if(error.message.includes('Resort with ID')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        if(error.message.includes('already checked in')){
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        if(error.message.includes('not available at this time')){
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        console.error('Error processing check-in:', error);
        return res.status(500).json({
            success: false,
            message: 'Could not process check-in',
            err: error.message
        });
    }
};

const getRoomCheckInStatus = async (req, res) => {
    try{
        const {resortId, mealType} = req.query;
        console.log('Resort ID:', resortId, 'Meal Type:', mealType);
        if(!resortId || !mealType){
            return res.status(400).json({
                success: false,
                message: 'resortId and mealType are required'
            });
        }

        const roomCheckInStatus = await checkInService.getRoomCheckInStatus(Number(resortId), mealType);
        return res.status(200).json({
            success: true,
            data: roomCheckInStatus
        });
    } catch (error) {
        console.error('Error fetching room check-in status:', error);
        return res.status(500).json({
            success: false,
            message: 'Could not fetch room check-in status',
            err: error.message
        });
    }
}



module.exports = {
    getAllCheckIns,
    processCheckIn,
    getRoomCheckInStatus
};


