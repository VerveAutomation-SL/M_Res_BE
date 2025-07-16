const CheckIn = require('../models/checkin');
const Resort = require('../models/resort');
const Room = require('../models/room');

// Meal time periods
const MEAL_TIMES ={
    breakfast: { start: '06:00:00', end: '09:30:00' },
    lunch: { start: '09:40:00', end: '15:00:00' },
    dinner: { start: '18:00:00', end: '23:30:00' }
};

// Helper function to get current meal type based on time
const getCurrentMealType = () => {
    const now = new Date();
    const currentTime = now.toTimeString().split(' ')[0]; // Get current time

    if (currentTime >= MEAL_TIMES.breakfast.start && currentTime <= MEAL_TIMES.breakfast.end) {
        return 'breakfast';
    }
    if (currentTime >= MEAL_TIMES.lunch.start && currentTime <= MEAL_TIMES.lunch.end) {
        return 'lunch';
    }
    if (currentTime >= MEAL_TIMES.dinner.start && currentTime <= MEAL_TIMES.dinner.end) {
        return 'dinner';
    }
    // If not in any meal period, return the next upcoming meal
    if (currentTime < MEAL_TIMES.breakfast.start) {
        return "breakfast";
    } else if (currentTime < MEAL_TIMES.lunch.start) {
        return "lunch";
    } else if (currentTime < MEAL_TIMES.dinner.start) {
        return "dinner";
    } else {
        return "breakfast"; // After dinner, show next day's breakfast
    }
};

// Helper funtion to check if current time is wihthin meal time period
const isWithinMealTime = (mealType) => {
    const now = new Date();
    const currentTime = now.toTimeString().split(' ')[0]; // Get current time in HH:MM:SS format
    const mealPeriod = MEAL_TIMES[mealType];

    if (!mealPeriod) return false; 

    return currentTime >= mealPeriod.start && currentTime <= mealPeriod.end;
};


// Get all check-ins for a resort
const getCheckins = async(resortId, date = new Date()) => {
    try{
        const formattedDate = date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD

        return await CheckIn.findAll({
            where:{
                resort_id: resortId,
                check_in_date: formattedDate
            },
            include: [
                {
                    model: Resort
                }
            ],
            order: [['check_in_time', 'DESC']]
        });
    } catch(err) {
        console.error('Error fetching check-ins:', err);
        throw new Error('Could not fetch check-ins');
    }
};

// Check if guest has already checked in for a meal
const hasCheckedInForMeal = async(roomId, mealType,date = new Date()) => {
    try{
        const formattedDate = date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD

        const checkIn = await CheckIn.findOne({
            where: {
                room_id: roomId,
                meal_type: mealType,
                check_in_date: formattedDate
            }
        });

        return checkIn !== null; // Returns true if a check-in exists, false otherwise
    } catch (error) {
        console.error('Error checking meal check-in status:', error);
        throw new Error('Could not check meal check-in status');
    }
};

// Process a new check-in
const createCheckIn = async(checkInData) => {
    try{
        const { resort_id, room_id, outlet_name, table_number, meal_type, meal_plan, check_in_date, check_in_time} = checkInData;

        const now = new Date();
        const currentTime = now.toTimeString().split(' ')[0]; // Get current time in HH:MM:SS format
        const checkInDate = check_in_date ? new Date(check_in_date) : now;

        const resort = await Resort.findByPk(resort_id);
        if (!resort) {
            throw new Error(`Resort with ID ${resort_id} not found`);
        }

        const alreadyCheckedIn = await hasCheckedInForMeal(room_id, meal_type, checkInDate);
        if (alreadyCheckedIn) {
            throw new Error('Guest has already checked in for this meal');
        }

        const mealPeriod = MEAL_TIMES[meal_type];
        if (!mealPeriod) {
            throw new Error(`Invalid meal type: ${meal_type}.`);
        }

        // Check if current time is within the meal period
        if (!isWithinMealTime(meal_type)) {
            throw new Error(`Check-in for ${meal_type} is only available between ${mealPeriod.start} and ${mealPeriod.end}`);
        }

        //Create new check-in record
        return await CheckIn.create({
            resort_id,
            room_id,
            outlet_name,
            table_number,
            meal_type,
            meal_plan,
            check_in_date: checkInDate.toISOString().split('T')[0], // Default to today if not provided
            check_in_time: check_in_time || currentTime // Default to current time if not provided
        });
    } catch (error) {
        console.error('Error creating check-in:', error);
        throw error;
    }
    
};

// Get check-ins for a specific resort in a specific time period
const getRoomCheckInStatus = async(resortId , mealType, date = new Date()) => {
    try {
        const formattedDate = date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD

        const rooms = await Room.findAll({
            where : {resort_id:resortId}
        });

        const checkIns = await CheckIn.findAll({
            where:{
                resort_id: resortId,
                meal_type: mealType,
                check_in_date: formattedDate
            },
            include:[{
                model: Room,
                attributes: ['room_number']
            }]
        });

        console.log('Check-ins found:', checkIns.length);
        console.log('Rooms found:', rooms.length);

        const checkedInRoomIds = new Set(checkIns.map(checkIn => checkIn.room_id));

        const roomStatus = rooms.map(room => ({
            room_id: room.id,
            room_number: room.room_number,
            checked_in: checkedInRoomIds.has(room.id),
            resort_id: resortId,
        }));

        return roomStatus;
    } catch (error) {
        console.error('Error fetching room check-in status:', error);
        throw new Error('Could not fetch room check-in status');
        
    }
};

// Get checkin details 
const getCheckInDetails = async(resortId, roomId, mealType, date = new Date()) => {
    try {
        const formattedDate = date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD

        const checkIn = await CheckIn.findOne({
            where: {
                resort_id: resortId,
                room_id: roomId,
                meal_type: mealType,
                check_in_date: formattedDate
            }
        });

        if (!checkIn) {
            throw new Error('No check-in found for the specified criteria');
        }

        return checkIn;
    } catch (error) {
        console.error('Error fetching check-in details:', error);
        throw new Error('Could not fetch check-in details');
    }
};

module.exports = {
    getCheckins,
    getRoomCheckInStatus,
    hasCheckedInForMeal,
    getCheckInDetails,
    createCheckIn,
    getCurrentMealType,
    isWithinMealTime,
    MEAL_TIMES
};