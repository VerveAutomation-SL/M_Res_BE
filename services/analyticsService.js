const CheckIn = require("../models/checkin");
const AppError = require("../utils/AppError");
const { Op, literal } = require("sequelize");

const getAnalyticsService = async () => {
    try {
        // Fetch total check-ins in LAst 7 days
        const today = new Date(); 
        console.log('Current date:', today);

        const DaysAgo = new Date(today);
        DaysAgo.setDate(DaysAgo.getDate() - 7);
        // Get today's date in YYYY-MM-DD format

        console.log('Last week:', DaysAgo.toISOString().split('T')[0]);
        
        const checkInsLastWeek = await CheckIn.findAll({
            where: {
                check_in_date: {
                    [Op.gte]: DaysAgo
                }
            },
            attributes: [
                'resort_id',
                [CheckIn.sequelize.fn('COUNT', CheckIn.sequelize.col('id')), 'total_checkins'],
                [CheckIn.sequelize.fn('DATE', CheckIn.sequelize.col('check_in_date')), 'checkin_date'],             // ← group key (YYYY‑MM‑DD)

            ],
            group: ['resort_id', "check_in_date"],
            order: [[literal('DATE(check_in_date)'), 'ASC']],
            raw: true
        });

        const total_meals = await CheckIn.count({
            where: {
                check_in_date: {
                    [Op.gte]: today
                }
            }
        });
        const mealDistribution = await CheckIn.findAll({
            where: {
                check_in_date: {
                    [Op.gte]: today
                }
            },
            attributes: [
                'meal_type',
                [CheckIn.sequelize.fn('COUNT', CheckIn.sequelize.col('id')), 'meals_count'],
                [
                    CheckIn.sequelize.literal(
                      `ROUND(COUNT(id) * 100.0 / ${total_meals}, 2)`
                    ),
                    'meals_percentage'
                  ],            ],
            group: ['meal_type'],
            raw: true
        });

        

        return {checkInsLastWeek, mealDistribution};
    } catch (error) {
        console.error('Error fetching analytics data:', error);
        throw new AppError(500, 'Could not fetch analytics data', error.message);
    }
}

module.exports = {
    getAnalyticsService
};