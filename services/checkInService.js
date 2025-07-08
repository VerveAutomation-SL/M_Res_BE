const CheckIn = require('../models/checkin');
const Resort = require('../models/resort');

// Meal time periods
const MEAL_TIMES ={
    breakfast: { start: '06:00:00', end: '10:00:00' },
    lunch: { start: '12:00:00', end: '15:00:00' },
    dinner: { start: '19:00:00', end: '22:00:00' }
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
const hasCheckedInForMeal = async(roomNumber, mealType, date = new Date()) => {
    try{
        const formattedDate = date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD

        const checkIn = await CheckIn.findOne({
            where: {
                room_number: roomNumber,
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
        const { resort_id, room_number, outlet_name, meal_type, check_in_date, check_in_time, guest_name } = checkInData;

        const now = new Date();
        const currentTime = now.toTimeString().split(' ')[0]; // Get current time in HH:MM:SS format

        const resort = await Resort.findByPk(resort_id);
        if (!resort) {
            throw new Error(`Resort with ID ${resort_id} not found`);
        }
        
        const alreadyCheckedIn = await hasCheckedInForMeal(room_number, meal_type, check_in_date);
        if (alreadyCheckedIn) {
            throw new Error('Guest has already checked in for this meal');
        }

        const mealPeriod = MEAL_TIMES[meal_type];
        if (currentTime < mealPeriod.start || currentTime > mealPeriod.end){
            throw new Error(`Check-in time for ${meal_type} must be between ${mealPeriod.start} and ${mealPeriod.end}`);
        }

        //Create new check-in record
        return await CheckIn.create({
            resort_id,
            room_number,
            outlet_name,
            meal_type,
            check_in_date: check_in_date || now.toISOString().split('T')[0], // Default to today if not provided
            check_in_time: check_in_time || currentTime // Default to current time if not provided
        });
    } catch (error) {
        console.error('Error creating check-in:', error);
        throw error;
    }
    
};


module.exports = {
    getCheckins,
    hasCheckedInForMeal,
    createCheckIn
};