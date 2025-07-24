const CheckIn = require("../models/checkin");
const AppError = require("../utils/AppError");
const { Op, literal } = require("sequelize");

const getAnalyticsService = async () => {
    try {
        // Fetch total check-ins in Last 7 days
        const today = new Date(); 
        console.log('Current date:', today);

        const DaysAgo = new Date(today);
        DaysAgo.setDate(DaysAgo.getDate() - 7);

        console.log('Last week:', DaysAgo.toISOString().split('T')[0]);
        
        const checkInsLastWeek = await CheckIn.findAll({
            where: {
                check_in_date: {
                    [Op.gte]: DaysAgo.toISOString().split('T')[0] // Use formatted date string
                }
            },
            attributes: [
                'resort_id',
                [CheckIn.sequelize.fn('COUNT', CheckIn.sequelize.col('id')), 'total_checkins'],
                [CheckIn.sequelize.fn('DATE', CheckIn.sequelize.col('check_in_date')), 'checkin_date'],
            ],
            group: ['resort_id', "check_in_date"],
            order: [[literal('DATE(check_in_date)'), 'ASC']],
            raw: true
        });

        // Fetch meal distribution for today
        const todayString = today.toISOString().split('T')[0];
        
        const total_meals = await CheckIn.count({
            where: {
                check_in_date: todayString
            }
        });

        const mealDistribution = await CheckIn.findAll({
            where: {
                check_in_date: todayString
            },
            attributes: [
                'meal_type',
                [CheckIn.sequelize.fn('COUNT', CheckIn.sequelize.col('id')), 'meals_count'],
                [
                    CheckIn.sequelize.literal(
                      `ROUND(COUNT(id) * 100.0 / NULLIF(${total_meals}, 0), 2)`
                    ),
                    'meals_percentage'
                ],
            ],
            group: ['meal_type'],
            raw: true
        });

        // Get hourly trends for today
        const hourlyTrends = await CheckIn.findAll({
            where: {
                check_in_date: todayString
            },
            attributes: [
                [CheckIn.sequelize.fn('EXTRACT', CheckIn.sequelize.literal('HOUR FROM check_in_time')), 'hour'],
                [CheckIn.sequelize.fn('COUNT', CheckIn.sequelize.col('id')), 'checkins_count']
            ],
            group: [CheckIn.sequelize.fn('EXTRACT', CheckIn.sequelize.literal('HOUR FROM check_in_time'))],
            order: [[CheckIn.sequelize.fn('EXTRACT', CheckIn.sequelize.literal('HOUR FROM check_in_time')), 'ASC']],
            raw: true
        });

        // Transform hourly data to include all hours (0-23) with 0 for missing hours
        const hourlyTrendsFormatted = [];
        for (let hour = 0; hour < 24; hour++) {
            const existingHour = hourlyTrends.find(h => parseInt(h.hour) === hour);
            hourlyTrendsFormatted.push({
                hour: hour,
                time: `${hour.toString().padStart(2, '0')}:00`,
                checkIns: existingHour ? parseInt(existingHour.checkins_count) : 0
            });
        }

        return {
            checkInsLastWeek, 
            mealDistribution, 
            hourlyTrends: hourlyTrendsFormatted 
        };
    } catch (error) {
        console.error('Error fetching analytics data:', error);
        throw new AppError(500, 'Could not fetch analytics data');
    }
}

module.exports = {
    getAnalyticsService
};