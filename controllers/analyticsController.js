const { getAnalyticsService } = require("../services/analyticsService");

const getAnalyticsController = async (req, res) => {
    try {
        const analyticsData = await getAnalyticsService(); 

        return res.status(200).json({
            success: true,
            message: 'Lat 7 days checkins data and meal Distribution of last day fetched successfully',
            data: analyticsData
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
}

module.exports = {
    getAnalyticsController
};    