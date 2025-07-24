const ExcelJS = require("exceljs");
const { Op, where } = require("sequelize");
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { getCheckInsinResort } = require("../services/checkInService");
const AppError = require("../utils/AppError");


const getPreviewDataService = async ({checkinStartDate, checkinEndDate, checkoutStartDate, checkoutEndDate, resort_id, outlet_name, room_id, table_number, meal_type, meal_plan, status }) => {
    try {
        const {where, order} = setFilters({checkinStartDate, checkinEndDate, checkoutStartDate, checkoutEndDate, resort_id, outlet_name, room_id, table_number, meal_type, meal_plan, status });
        console.log('Fetching preview data with filters:', where, order);

        // Fetch check-ins data
        const response = await getCheckInsinResort({where, order});
        
        // Map Sequelize model instances to plain objects
        let checkIns = response.map(checkIn => checkIn.dataValues);

        checkIns = checkIns.map(checkIn => {
            return {
                id: checkIn.id,
                room_number: checkIn.Room ? checkIn.Room.dataValues.room_number : 'N/A',
                resort_name: checkIn.Resort ? checkIn.Resort.dataValues.name : 'N/A',
                outlet_name: checkIn.outlet_name,
                table_number: checkIn.table_number,
                meal_type: checkIn.meal_type,
                meal_plan: checkIn.meal_plan,
                check_in_date: checkIn.check_in_date,
                check_in_time: checkIn.check_in_time,
                check_out_date: checkIn.check_out_date,
                check_out_time: checkIn.check_out_time,
                
                status: checkIn.status,
                checkout_remarks: checkIn.checkout_remarks || null
            };
        });

        return checkIns;
        
    } catch (error) {
        console.error("Error in getPreviewDataService:", error);
        throw new AppError(500, `Failed to fetch preview data: ${error.message}`);
    }
};

const generateExcelReportservice = ({checkinStartDate, checkinEndDate, checkoutStartDate, checkoutEndDate, resort_id, outlet_name, table_number, meal_type, room_id, meal_plan, status }) => {
    return new Promise((resolve, reject) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Check-In Report");

        worksheet.pageSetup.orientation = 'landscape';
        worksheet.pageSetup.paperSize = 9; // A4 paper
        worksheet.pageSetup.fitToPage = true;
        worksheet.pageSetup.fitToWidth = 1;
        worksheet.pageSetup.fitToHeight = 0;
        
        // Define columns
        worksheet.columns = [
            { header: "ID", key: "id", width: 10 },
            { header: "Room Number", key: "room_number", width: 15 },
            { header: "Resort Name", key: "resort_name", width: 20 },
            { header: "Outlet Name", key: "outlet_name", width: 20 },
            { header: "Table Number", key: "table_number", width: 15 },
            { header: "Meal Type", key: "meal_type", width: 15 },
            { header: "Meal Plan", key: "meal_plan", width: 20 },
            { header: "Check-In Date", key: "check_in_date", width: 20 },
            { header: "Check-In Time", key: "check_in_time", width: 20 },
            { header: "Status", key: "status", width: 15 },
            { header: "Check-Out Time", key: "check_out_time", width: 20 },
            { header: "Checkout Remarks", key: "checkout_remarks", width: 40 }
        ];

        const {where, order} = setFilters({checkinStartDate, checkinEndDate, checkoutStartDate, checkoutEndDate, resort_id, outlet_name, room_id, table_number, meal_type, meal_plan, status });
        console.log('Fetching all check-ins with filters:', where, order);


        // Fetch check-ins data
        getCheckInsinResort({where, order})
        .then(response => {
            // Map Sequelize model instances to plain objects
        

            let checkIns = response.map(checkIn => checkIn.dataValues);


            checkIns = checkIns.map(checkIn => {
                return {
                    id: checkIn.id,
                    room_number: checkIn.Room ? checkIn.Room.dataValues.room_number : 'N/A',
                    resort_name: checkIn.Resort ? checkIn.Resort.dataValues.name : 'N/A',
                    outlet_name: checkIn.outlet_name,
                    table_number: checkIn.table_number,
                    meal_type: checkIn.meal_type,
                    meal_plan: checkIn.meal_plan,
                    check_in_date: checkIn.check_in_date,
                    check_in_time: checkIn.check_in_time,
                    check_out_time: checkIn.check_out_time || "N/A",
                    status: checkIn.status,
                    checkout_remarks: checkIn.checkout_remarks || 'N/A'
                };
            });
    
            checkIns.forEach(checkIn => {
                worksheet.addRow(checkIn);
            });


            worksheet.addTable({
                name: 'CheckInReport',
                ref: 'A1',
                headerRow: true,
                totalsRow: false,
                style: {
                    theme: 'TableStyleMedium9', //TableStyleLight1 to Medium28, or TableStyleDark1-Dark11
                    showRowStripes: true,
                },
                columns: worksheet.columns.map(col => ({ name: col.header, filterButton: true, key: col.key, width: col.width, style: { alignment: { horizontal: 'center' } } })),
                rows: worksheet.getRows(2, worksheet.rowCount - 1).map(row => row.values.slice(1)) 
            });

            const filePath = `./reports/checkin_report_${Date.now()}.xlsx`;
            workbook.xlsx.writeFile(filePath)
            .then(() => {
                resolve(filePath);
            })
            .catch(err => {
                reject(err);
            });
        })
        .catch(err => {
            console.error("Error fetching check-ins:", err);
        });
    });
}

const generateExcelToPDFReportservice = async ({checkinStartDate, checkinEndDate, checkoutStartDate, checkoutEndDate, resort_id, outlet_name, room_id, table_number, meal_type, meal_plan, status }) => {

    try {
        // Generate Excel report
        const excelFilePath = await generateExcelReportservice({checkinStartDate, checkinEndDate, checkoutStartDate, checkoutEndDate, resort_id, outlet_name, room_id, table_number, meal_type, meal_plan, status });

        if (!excelFilePath) {
            throw new AppError(404, 'Excel file path is not defined');
        }

        // Generate HTML from Excel
        const { headers, rows } = await generateExcelToHtml(excelFilePath);


        const pdfPath = path.join(__dirname, '../reports/report.pdf');
        if (!pdfPath) {
            throw new AppError(404, 'PDF file path is not defined');
        }

        // Generate PDF from HTML
        await generatePDFReportFromHtml({ headers, rows }, pdfPath);

        const pdfBuffer = fs.readFileSync(pdfPath);

        fs.unlinkSync(excelFilePath);
        fs.unlinkSync(pdfPath);

        return pdfBuffer;

    } catch (err) {
        throw new Error(`Failed to generate PDF: ${err.message}`);
    }

}

const generateExcelToHtml = async (excelFilePath) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelFilePath);
    const worksheet = workbook.worksheets[0];

    const headers = [];
    const rows = [];

    worksheet.eachRow((row, rowNumber) => {

        const cells = row.values.slice(1); // skip index 0
        if (cells.length === 0) return; // skip empty rows

        const htmlRow = cells.map(cell => `<td>${cell}</td>`).join('');

        if (rowNumber === 1) {
            headers.push(...cells.map(cell => `<th>${cell}</th>`));
        } else {
            rows.push(`<tr>${htmlRow}</tr>`);
        }

    });

    return { headers, rows };


}

const generatePDFReportFromHtml = async ({ headers, rows }, pdfPath) => {

    try {

        const templatePath = path.join(__dirname, '../reports/template.html');
        let html = fs.readFileSync(templatePath, 'utf8');

        html = html
            .replace('{{TABLE_HEADERS}}', headers.join(''))
            .replace('{{TABLE_ROWS}}', rows.join('\n'));

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(html, { waitUntil: 'networkidle0' });
        await page.pdf({
            path: pdfPath,
            format: 'A3',
            landscape: true,
            printBackground: true
        });

        await browser.close();

  } catch (err) {
    console.error('PDF generation error:', err);
    throw new AppError(`Failed to generate PDF: ${err.message}`);
  }
}

const setFilters = ({checkinStartDate, checkinEndDate, checkoutStartDate, checkoutEndDate, resort_id, outlet_name, room_id, table_number, meal_type, meal_plan, status }) => {

    console.log('Setting filters for report generation:', { checkinStartDate, checkinEndDate, checkoutStartDate, checkoutEndDate, resort_id, outlet_name, room_id, table_number, meal_type, meal_plan, status });
    
    let where = {};
    let order = [['check_in_date', 'DESC'], ['check_in_time', 'DESC']]; // default order

    if (resort_id) {
        where.resort_id = resort_id;
    }

    if (outlet_name) {
        where.outlet_name = outlet_name;
    }

    if (room_id) {
        where.room_id = room_id;
    }

    if (table_number) {
        where.table_number = table_number
    }

    if (meal_type) {
        where.meal_type = meal_type;
    }

    if (meal_plan) {
        where.meal_plan = meal_plan;
    }

    if (checkinStartDate && checkinEndDate) {
        where.check_in_date = {
        [Op.between]: [new Date(checkinStartDate), new Date(checkinEndDate)],
        };
    }else if (checkinStartDate) {
        where.check_in_date = {
            [Op.gte]: new Date(checkinStartDate),
        };
    } else if (checkinEndDate) {
        where.check_in_date = {
            [Op.lte]: new Date(checkinEndDate),
        };
    }

    if (checkoutStartDate && checkoutEndDate) {
        where.check_out_date = {
            [Op.between]: [new Date(checkoutStartDate), new Date(checkoutEndDate)],
        };
    }else if( checkoutStartDate) {
        where.check_out_date = {
            [Op.gte]: new Date(checkoutStartDate),
        };
    } else if (checkoutEndDate) {
        where.check_out_date = {
            [Op.lte]: new Date(checkoutEndDate),
        };
    }

    if (status) {
        where.status = status;
    }

    return { where, order };
};

module.exports = {
    getPreviewDataService,
    generateExcelToPDFReportservice,
    generateExcelReportservice,
};