const fs = require('fs');

const {generateExcelToPDFReportservice, generateExcelReportservice } = require('../services/reportService');

const generatePDFReportController = async (req, res) => {
    const { checkinStartDate, checkinEndDate, checkoutStartDate, checkoutEndDate, resort_id, outlet_name, room_id, table_number, meal_type, meal_plan, status } = req.body || {};

    try {
        const pdfBuffer = await generateExcelToPDFReportservice({checkinStartDate, checkinEndDate, checkoutStartDate, checkoutEndDate, resort_id, outlet_name, room_id, table_number, meal_type, meal_plan, status });
        const now = new Date();
        const formatted = now.toISOString().replace(/[:.]/g, '-'); // e.g. 2025-07-18T09-14-22-123Z
        const filename = `checkin_report_${formatted}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error('[generatePDFReportController] Error generating PDF report:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: 'Failed to generate PDF report',
            error: error.message
        });
    }
}

const generateExcelReportController = async (req, res) => {

    const { checkinStartDate, checkinEndDate, checkoutStartDate, checkoutEndDate, resort_id, outlet_name, room_id, table_number, meal_type, meal_plan, status } = req.body || {};
    let filePath = null;

    try {
        filePath = await generateExcelReportservice({checkinStartDate, checkinEndDate, checkoutStartDate, checkoutEndDate, resort_id, outlet_name, room_id, table_number,meal_type, meal_plan, status });
        const fileBuffer = fs.readFileSync(filePath);

        const now = new Date();
        const formatted = now.toISOString().replace(/[:.]/g, '-'); // e.g. 2025-07-18T09-14-22-123Z
        const filename = `checkin_report_${formatted}.xlsx`;
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.send(fileBuffer);

    } catch (error) {
        console.error('Error generating Excel report:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: 'Failed to generate Excel report',
            error: error.message
        });
    }
    finally {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    
}

module.exports = {
    generateExcelReportController,
    generatePDFReportController
};