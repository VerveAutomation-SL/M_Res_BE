const ExcelJS = require("exceljs");
const { Op } = require("sequelize");
// const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const PdfPrinter = require('pdfmake');

const {
  getCheckInsinResort,
  getCheckInsinResortWithCount,
} = require("../services/checkInService");
const AppError = require("../utils/AppError");

const fonts = {
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
};

const getPreviewDataService = async ({
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
  page = 1,
  limit = 20,
}) => {
  try {
    const { where, order } = setFilters({
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
    });

    console.log("Fetching preview data with filters:", where, order);
    console.log("Pagination params - Page:", page, "Limit:", limit);

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Use getCheckInsinResortWithCount for both data and count in one query
    const paginationOptions = {
      where,
      order,
      offset: parseInt(offset),
      limit: parseInt(limit),
    };

    const response = await getCheckInsinResortWithCount(paginationOptions);

    // Extract data and totalCount from the response
    const data = response.data; // This is the paginated data

    const flattenedData = data.map((checkIn) => {
      const plainCheckIn = checkIn.get ? checkIn.get({ plain: true }) : checkIn;
      return {
        id: plainCheckIn.id,
        room_number: plainCheckIn.Room ? plainCheckIn.Room.room_number : "N/A",
        resort_name: plainCheckIn.Resort ? plainCheckIn.Resort.name : "N/A",
        outlet_name: plainCheckIn.outlet_name,
        table_number: plainCheckIn.table_number,
        meal_type: plainCheckIn.meal_type,
        meal_plan: plainCheckIn.meal_plan,
        check_in_date: plainCheckIn.check_in_date,
        check_in_time: plainCheckIn.check_in_time,
        check_out_date: plainCheckIn.check_out_date,
        check_out_time: plainCheckIn.check_out_time,
        status: plainCheckIn.status,
        checkout_remarks: plainCheckIn.checkout_remarks || null,
      };
    });

    const totalCount = response.totalCount; // This is the total count from findAndCountAll

    console.log(
      "Fetched paginated check-ins:",
      data.length,
      "records for page",
      page
    );
    console.log("Total count of check-ins:", totalCount);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      data: flattenedData,
      pagination: {
        currentPage: parseInt(page),
        totalCount,
        totalPages,
        pageSize: parseInt(limit),
        hasNextPage,
        hasPrevPage,
      },
    };
  } catch (error) {
    console.error("Error in getPreviewDataService:", error);
    throw new AppError(500, `Failed to fetch preview data: ${error.message}`);
  }
};

const generateExcelReportservice = ({
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
}) => {
  return new Promise((resolve, reject) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Check-In Report");

    worksheet.pageSetup.orientation = "landscape";
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
      { header: "Check-Out Date", key: "check_out_date", width: 20 },
      { header: "Check-Out Time", key: "check_out_time", width: 20 },
      { header: "Checkout Remarks", key: "checkout_remarks", width: 40 },
    ];

    const { where, order } = setFilters({
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
    });
    console.log("Fetching all check-ins with filters:", where, order);

    // Fetch check-ins data
    getCheckInsinResort({ where, order })
      .then((response) => {
        // Map Sequelize model instances to plain objects
        let checkIns = response.map((checkIn) => checkIn.dataValues);

        checkIns = checkIns.map((checkIn) => {
          return {
            id: checkIn.id,
            room_number: checkIn.Room
              ? checkIn.Room.dataValues.room_number
              : "N/A",
            resort_name: checkIn.Resort
              ? checkIn.Resort.dataValues.name
              : "N/A",
            outlet_name: checkIn.outlet_name,
            table_number: checkIn.table_number,
            meal_type: checkIn.meal_type,
            meal_plan: checkIn.meal_plan,
            check_in_date: checkIn.check_in_date,
            check_in_time: checkIn.check_in_time,
            check_out_date: checkIn.check_out_date || "N/A",
            check_out_time: checkIn.check_out_time || "N/A",
            status: checkIn.status,
            checkout_remarks: checkIn.checkout_remarks || "N/A",
          };
        });

        checkIns.forEach((checkIn) => {
          worksheet.addRow(checkIn);
        });

        worksheet.addTable({
          name: "CheckInReport",
          ref: "A1",
          headerRow: true,
          totalsRow: false,
          style: {
            theme: "TableStyleMedium9", //TableStyleLight1 to Medium28, or TableStyleDark1-Dark11
            showRowStripes: true,
          },
          columns: worksheet.columns.map((col) => ({
            name: col.header,
            filterButton: true,
            key: col.key,
            width: col.width,
            style: { alignment: { horizontal: "center" } },
          })),
          rows: worksheet
            .getRows(2, worksheet.rowCount - 1)
            .map((row) => row.values.slice(1)),
        });

        const filePath = `./reports/checkin_report_${Date.now()}.xlsx`;
        workbook.xlsx
          .writeFile(filePath)
          .then(() => {
            resolve(filePath);
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        console.error("Error fetching check-ins:", err);
      });
  });
};

// const generateExcelToPDFReportservice = async ({
//   checkinStartDate,
//   checkinEndDate,
//   checkoutStartDate,
//   checkoutEndDate,
//   resort_id,
//   outlet_name,
//   room_id,
//   table_number,
//   meal_type,
//   meal_plan,
//   status,
// }) => {
//   try {
//     // Generate Excel report
//     const excelFilePath = await generateExcelReportservice({
//       checkinStartDate,
//       checkinEndDate,
//       checkoutStartDate,
//       checkoutEndDate,
//       resort_id,
//       outlet_name,
//       room_id,
//       table_number,
//       meal_type,
//       meal_plan,
//       status,
//     });

//     if (!excelFilePath) {
//       throw new AppError(404, "Excel file path is not defined");
//     }

//     // Generate HTML from Excel
//     const { headers, rows } = await generateExcelToHtml(excelFilePath);

//     const pdfPath = path.join(__dirname, "../reports/report.pdf");
//     if (!pdfPath) {
//       throw new AppError(404, "PDF file path is not defined");
//     }

//     // Generate PDF from HTML
//     await generatePDFReportFromHtml({ headers, rows }, pdfPath);

//     const pdfBuffer = fs.readFileSync(pdfPath);

//     fs.unlinkSync(excelFilePath);
//     fs.unlinkSync(pdfPath);

//     return pdfBuffer;
//   } catch (err) {
//     throw new Error(`Failed to generate PDF: ${err.message}`);
//   }
// };

// const generateExcelToHtml = async (excelFilePath) => {
//   const workbook = new ExcelJS.Workbook();
//   await workbook.xlsx.readFile(excelFilePath);
//   const worksheet = workbook.worksheets[0];

//   const headers = [];
//   const rows = [];

//   worksheet.eachRow((row, rowNumber) => {
//     const cells = row.values.slice(1); // skip index 0
//     if (cells.length === 0) return; // skip empty rows

//     const htmlRow = cells.map((cell) => `<td>${cell}</td>`).join("");

//     if (rowNumber === 1) {
//       headers.push(...cells.map((cell) => `<th>${cell}</th>`));
//     } else {
//       rows.push(`<tr>${htmlRow}</tr>`);
//     }
//   });

//   return { headers, rows };
// };

// const generatePDFReportFromHtml = async ({ headers, rows }, pdfPath) => {
//   try {
//     const templatePath = path.join(__dirname, "../reports/template.html");
//     let html = fs.readFileSync(templatePath, "utf8");

//     html = html
//       .replace("{{TABLE_HEADERS}}", headers.join(""))
//       .replace("{{TABLE_ROWS}}", rows.join("\n"));

//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     await page.setContent(html, { waitUntil: "networkidle0" });
//     await page.pdf({
//       path: pdfPath,
//       format: "A3",
//       landscape: true,
//       printBackground: true,
//     });

//     await browser.close();
//   } catch (err) {
//     console.error("PDF generation error:", err);
//     throw new AppError(`Failed to generate PDF: ${err.message}`);
//   }
// };

const generatePdfReportservice = ({
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
}) => {
  return new Promise((resolve, reject) => {
    const printer = new PdfPrinter(fonts);

    // Build your filters
    const { where, order } = setFilters({
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
    });
    console.log('Fetching all check-ins with filters:', where, order);

    // Fetch your check-ins data
    getCheckInsinResort({ where, order })
      .then((response) => {
        const checkIns = response.map((checkIn) => {
          const d = checkIn.dataValues;
          return {
            id: d.id,
            room_number: d.Room ? d.Room.dataValues.room_number : '-',
            resort_name: d.Resort ? d.Resort.dataValues.name : '-',
            outlet_name: d.outlet_name,
            table_number: d.table_number,
            meal_type: d.meal_type,
            meal_plan: d.meal_plan,
            check_in_date: d.check_in_date,
            check_in_time: d.check_in_time,
            status: d.status,
            check_out_date: d.check_out_date || '-',
            check_out_time: d.check_out_time || '-',
            checkout_remarks: d.checkout_remarks ? 
              (d.checkout_remarks.length > 50 ? 
                d.checkout_remarks.substring(0, 50) + '...' : 
                d.checkout_remarks) : '-',
          };
        });

        // Build table body (header + data rows)
        const tableBody = [
          [
            { text: 'ID', style: 'tableHeader', alignment: 'center' },
            { text: 'Room Number', style: 'tableHeader', alignment: 'center' },
            { text: 'Resort Name', style: 'tableHeader', alignment: 'left' },
            { text: 'Outlet Name', style: 'tableHeader', alignment: 'left' },
            { text: 'Table Number', style: 'tableHeader', alignment: 'center' },
            { text: 'Meal Type', style: 'tableHeader', alignment: 'left' },
            { text: 'Meal Plan', style: 'tableHeader', alignment: 'left' },
            { text: 'Check-In Date', style: 'tableHeader', alignment: 'center' },
            { text: 'Check-In Time', style: 'tableHeader', alignment: 'center' },
            { text: 'Status', style: 'tableHeader', alignment: 'center' },
            { text: 'Check-Out Date', style: 'tableHeader', alignment: 'center' },
            { text: 'Check-Out Time', style: 'tableHeader', alignment: 'center' },
            { text: 'Checkout Remarks', style: 'tableHeader', alignment: 'left' },
          ],
          // Map your dynamic data here, with formatting and styling
          ...checkIns.map((row, rowIndex) =>
            [
              { text: row.id.toString(), alignment: 'center', fontSize: 9 },
              { text: row.room_number, alignment: 'center', fontSize: 9 },
              { text: row.resort_name, alignment: 'left', fontSize: 9 },
              { text: row.outlet_name, alignment: 'left', fontSize: 9 },
              { text: row.table_number.toString(), alignment: 'center', fontSize: 9 },
              { text: row.meal_type, alignment: 'left', fontSize: 9 },
              { text: row.meal_plan, alignment: 'left', fontSize: 9 },
              { text: row.check_in_date, alignment: 'center', fontSize: 9 },
              { text: row.check_in_time, alignment: 'center', fontSize: 9 },
              { text: row.status, alignment: 'center', fontSize: 9 },
              { text: row.check_out_date, alignment: 'center', fontSize: 9 },
              { text: row.check_out_time, alignment: 'center', fontSize: 9 },
              { text: row.checkout_remarks, alignment: 'left', fontSize: 8 },
            ].map((cell) => ({
              ...cell,
              fillColor: rowIndex % 2 === 0 ? null : '#F8F9FA', // Zebra stripes
            }))
          ),
        ];

        // Define the PDF document structure
        const docDefinition = {
          pageSize: 'A3',
          pageOrientation: 'landscape',
          pageMargins: [20, 20, 20, 20],
          content: [
            // ===== HEADER =====
            {
              columns: [
                // {
                //   image: 'logo',
                //   width: 60,
                // },
                {
                  stack: [
                    { text: 'Guest Check-In Report', style: 'header' },
                    // {
                    //   text: `From: ${startDate}  To: ${endDate}`,
                    //   style: 'subheader'
                    // },
                    {
                      text: `Generated on: ${new Date().toLocaleString()}`,
                      style: 'meta'
                    },
                    // {
                    //   text: `Generated by: ${generatedBy}`,
                    //   style: 'meta'
                    // }
                  ],
                  width: '*'
                }
              ],
              margin: [0, 0, 0, 20]
            },
            // ===== DETAILED TABLE =====
            {
              table: {
                headerRows: 1,
                widths: ['3%', '6%', '10%', '12%', '6%', '7%', '7%', '7%', '7%', '7%', '7%', '7%', '14%'],
                body: tableBody,
              },
              width: '100%',
              layout: {
                fillColor: (rowIndex) => (rowIndex === 0 ? '#2F4454' : null),
                hLineWidth: (i, node) => (i === 0 || i === node.table.body.length ? 2 : 0.8),
                vLineWidth: () => 0.8,
                hLineColor: (i, node) =>
                  i === 0 || i === node.table.body.length ? '#2F4454' : '#dee2e6',
                vLineColor: () => '#dee2e6',
                paddingLeft: () => 10,
                paddingRight: () => 10,
                paddingTop: () => 15,
                paddingBottom: () => 15,
              },
            },
            // ===== SUMMARY SECTION =====
            {
              style: 'summaryTable',
              table: {
                widths: ['25%', '25%', '25%', '25%'],
                body: [
                  [
                    { text: 'Total Check-Ins', style: 'summaryHeader' },
                    //{ text: 'Average Stay Duration', style: 'summaryHeader' },
                    //{ text: 'Occupancy Rate', style: 'summaryHeader' },
                    //{ text: 'Returning Guests', style: 'summaryHeader' }
                  ],
                  [
                    { text: checkIns.length.toString(), style: 'summaryValue' },
                    //{ text: avgStayDuration + ' days', style: 'summaryValue' },
                    //{ text: occupancyRate + '%', style: 'summaryValue' },
                    //{ text: returningGuests.toString(), style: 'summaryValue' }
                  ]
                ]
              },
              layout: 'lightHorizontalLines',
              margin: [0, 0, 0, 20]
            },

          ],
          styles: {
            header: {
              fontSize: 22,
              bold: true,
              color: '#2F4454',
              margin: [0, 0, 0, 8]
            },
            subheader: {
              fontSize: 12,
              bold: true,
              margin: [0, 0, 0, 2]
            },
            meta: {
              fontSize: 10,
              color: '#666',
              margin: [0, 0, 0, 2]
            },
            summaryTable: {
              margin: [0, 0, 0, 10]
            },
            summaryHeader: {
              fontSize: 11,
              bold: true,
              fillColor: '#2F4454',
              color: 'white',
              alignment: 'center',
              margin: [0, 5, 0, 5]
            },
            summaryValue: {
              fontSize: 11,
              bold: true,
              alignment: 'center',
              margin: [0, 5, 0, 5]
            },
            tableHeader: {
              bold: true,
              fontSize: 10,
              color: 'white'
            },
            tableCell: {
              fontSize: 9,
              color: '#212529'
            },
            sectionHeader: {
              fontSize: 14,
              bold: true,
              color: '#2F4454'
            },
            notes: {
              fontSize: 10,
              color: '#444'
            }
          },
          defaultStyle: {
            font: 'Helvetica'
          }
        };


        const pdfDoc = printer.createPdfKitDocument(docDefinition);

        const outputFile = `./reports/checkin_report_${Date.now()}.pdf`;
        const stream = fs.createWriteStream(outputFile);

        pdfDoc.pipe(stream);

        pdfDoc.end();

        stream.on('finish', () => {
          resolve(outputFile);
        });

        stream.on('error', (err) => {
          reject(err);
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const setFilters = ({
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
}) => {
  console.log("Setting filters for report generation:", {
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
  });

  let where = {};
  let order = [
    ["check_in_date", "DESC"],
    ["check_in_time", "DESC"],
  ]; // default order

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
    where.table_number = table_number;
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
  } else if (checkinStartDate) {
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
  } else if (checkoutStartDate) {
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
  generatePdfReportservice,
  generateExcelReportservice
};
