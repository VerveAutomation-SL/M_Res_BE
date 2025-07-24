const checkInService = require('../services/checkInService');

// Get all check-ins in a resort with optional filtering and ordering
const getCheckInsinResort = async (req, res) => {
    try {
        const checkIns = await checkInService.getCheckInsinResort();

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
}

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
        const requiredFields = ['resort_id', 'room_id', 'outlet_name', 'table_number', 'meal_type','meal_plan'];
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

        // Check if we're within the meal time period
        if(!checkInService.isWithinMealTime(checkInData.meal_type)){
            const mealPeriod = checkInService.MEAL_TIMES[checkInData.meal_type];
            return res.status(400).json({
                success: false,
                message: `Check-in for ${checkInData.meal_type} is only available between ${mealPeriod.start} and ${mealPeriod.end}`
            });
        }

        const checkin = await checkInService.createCheckIn(checkInData);

        return res.status(201).json({
            success: true,
            message: 'Check-in processed successfully',
            data: checkin
        });
    } catch (error) {
        console.error('Error processing check-in:', error);

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

        return res.status(500).json({
            success: false,
            message: 'Could not process check-in',
            err: error.message
        });
    }
};

const getRoomCheckInStatus = async (req, res) => {
    try{
        const {resortId, mealType,date} = req.query;

        console.log('Resort ID:', resortId, 'Meal Type:', mealType);

        if(!resortId || !mealType ){
            return res.status(400).json({
                success: false,
                message: 'resortId and mealType are required'
            });
        }

        const checkDate = date ? new Date(date) : new Date();
        const roomCheckInStatus = await checkInService.getRoomCheckInStatus(Number(resortId), mealType, checkDate);
        
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

// Get check-in details for a specific room and meal type
const getCheckInDetails = async (req, res) => {
    try {
        const { resortId, roomId, mealType, date } = req.query;

        if (!resortId || !roomId || !mealType) {
            return res.status(400).json({
                success: false,
                message: 'resortId, roomId, and mealType are required'
            });
        }

        const checkInDetails = await checkInService.getCheckInDetails(
            Number(resortId),
            Number(roomId),
            mealType,
            date ? new Date(date) : new Date()
        );

        return res.status(200).json({
            success: true,
            data: checkInDetails
        });
    } catch (error) {
        console.error('Error fetching check-in details:', error);
        return res.status(500).json({
            success: false,
            message: 'Could not fetch check-in details',
            err: error.message
        });
    }
};

// Process check-out for a room
const checkOutRoom = async (req, res) => {
    try{
        const {resortId, roomId, mealType, remarks, date} = req.body;

        if(!resortId || !roomId || !mealType){
            return res.status(400).json({
                success: false,
                message: 'resortId, roomId, and mealType are required'
            });
        }

        const checkOutResult = await checkInService.checkOutRoom(
            Number(resortId),
            Number(roomId),
            mealType,
            remarks,
            date ? new Date(date) : new Date()
        );

        return res.status(200).json({
            success: true,
            data: checkOutResult
        });
    } catch (error) {
        console.error('Error processing check-out:', error);

        if(error.message.includes('No active check-in found')){
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Could not process check-out',
            err: error.message
        });
    }
}

// get check-ins for today 
const getTodayCheckIns = async (req, res) => {
    try {
        const { resortId, date } = req.query;

        if (!resortId) {
            return res.status(400).json({
                success: false,
                message: 'resortId is required'
            });
        }

        const checkDate = date ? new Date(date) : new Date();
        const checkIns = await checkInService.getTodayCheckIns(Number(resortId), checkDate);

        return res.status(200).json({
            success: true,
            count: checkIns.length,
            data: checkIns,
            message: `Found ${checkIns.length} check-ins for ${checkDate.toDateString()}`
        });

    } catch (error) {
        console.error('Error fetching today\'s check-ins:', error);
        return res.status(500).json({
            success: false,
            message: 'Could not fetch today\'s check-ins',
            err: error.message
        });
    }
}

module.exports = {
    getAllCheckIns,
    processCheckIn,
    getRoomCheckInStatus,
    getCheckInDetails,
    getCheckInsinResort,
    checkOutRoom,
    getTodayCheckIns
};


