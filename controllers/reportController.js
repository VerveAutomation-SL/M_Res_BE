const fs = require('fs');
const path = require('path');


const {getPreviewDataService, generatePdfReportservice, generateExcelReportservice } = require('../services/reportService');

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
            message: error.message || 'Failed to generate Excel report',
        });
    }
    finally {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    
}

const getPreviewDataController = async (req, res) => {
    const { 
        checkinStartDate, 
        checkinEndDate, 
        checkoutStartDate, 
        checkoutEndDate, 
        resort_id, 
        outlet_name, 
        room_id, 
        table_number, 
        meal_type, 
        meal_plan, 
        status ,
        page = 1,
        limit = 20
    } = req.body || {};

    try {

        // Validate pagination parameters
        const validatedPage = Math.max(1, parseInt(page) || 1);
        const validatedLimit = Math.min(100, Math.max(1, parseInt(limit) || 20)); // Cap at 100 items per page

        const result = await getPreviewDataService({
            checkinStartDate, 
            checkinEndDate, 
            checkoutStartDate, 
            checkoutEndDate, 
            resort_id, 
            outlet_name, 
            room_id, 
            table_number, 
            meal_type, 
            meal_plan, 
            status,
            page : validatedPage,
            limit : validatedLimit
        });

        res.status(200).json({
            success: true,
            data: result.data,
            pagination: result.pagination,

            meta:{
                filters:{
                    checkinStartDate,
                    checkinEndDate,
                    checkoutStartDate,
                    checkoutEndDate,
                    resort_id,
                    outlet_name,
                    room_id,
                    table_number,
                    meal_type,
                    meal_plan,
                    status
                },
                requestedAt: new Date().toISOString(),
                requestedPage: validatedPage,
                requestedLimit: validatedLimit
            }
        });
    } catch (error) {
        console.error(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
            pagination:{
                currentPage:1,
                totalPages:0,
                totalCount:0,
                pageSize:parseInt(limit) || 20,
                hasNextPage: false,
                hasPrevPage: false
            }
        });
    }
}

const generatePdfReport = async (req, res) => {
    
    try {
    const {
      checkinStartDate,
      checkinEndDate,
      checkoutStartDate,
      checkoutEndDate,
      resort_id,
      outlet_name,
      table_number,
      meal_type,
      room_id,
      meal_plan,
      status,
    } = req.body;

    // Call your PDF generation service
    const pdfPath = await generatePdfReportservice({
      checkinStartDate,
      checkinEndDate,
      checkoutStartDate,
      checkoutEndDate,
      resort_id,
      outlet_name,
      table_number,
      meal_type,
      room_id,
      meal_plan,
      status,
    });

    // Check if file exists
    if (!fs.existsSync(pdfPath)) {
      return res.status(500).json({
        success: false,
        message: 'PDF file generation failed'
      });
    }

    // Get file stats for content length
    const stat = fs.statSync(pdfPath);
    const filename = path.basename(pdfPath);

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', stat.size);

    // Create read stream and pipe to response
    const fileStream = fs.createReadStream(pdfPath);
    
    fileStream.pipe(res);

    // Clean up - delete the file after sending (optional)
    fileStream.on('end', () => {
      fs.unlink(pdfPath, (err) => {
        if (err) console.error('Error deleting temp PDF file:', err);
      });
    });

    fileStream.on('error', (err) => {
      console.error('Error reading PDF file:', err);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Error downloading PDF file'
        });
      }
    });

  } catch (error) {
    res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Failed to generate Excel report',
    });
  }
};

module.exports = {
    generateExcelReportController,
    getPreviewDataController,
    generatePdfReport
};