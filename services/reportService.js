const ExcelJS = require("exceljs");
const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");
const PdfPrinter = require('pdfmake');

const {
  getCheckInsinResort,
  getCheckInsinResortWithCount,
} = require("../services/checkInService");
const AppError = require("../utils/AppError");
const { stack } = require("sequelize/lib/utils");

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

    // Check if no check-ins found
    if (!response || !response.data || response.data.length === 0 || response.totalCount === 0) {
      throw new AppError(404, "No check-ins found for the specified criteria");
    }

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
    throw new AppError(
      error.statusCode || 500,
      error.message || "Failed to fetch preview data"
    );
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
        // Check if no check-ins found
        if (!response || response.length === 0) {
          reject(new AppError(404, "No check-ins found for the specified criteria"));
          return;
        }

        // Map Sequelize model instances to plain objects
        let checkIns = response.map((checkIn) => checkIn.dataValues);

        checkIns = checkIns.map((checkIn) => {
          return {
            id: checkIn.id,
            room_number: checkIn.Room
              ? checkIn.Room.dataValues.room_number
              : "-",
            resort_name: checkIn.Resort
              ? checkIn.Resort.dataValues.name
              : "-",
            outlet_name: checkIn.outlet_name,
            table_number: checkIn.table_number,
            meal_type: checkIn.meal_type,
            meal_plan: checkIn.meal_plan,
            check_in_date: checkIn.check_in_date,
            check_in_time: checkIn.check_in_time,
            check_out_date: checkIn.check_out_date || "-",
            check_out_time: checkIn.check_out_time || "-",
            status: checkIn.status,
            checkout_remarks: checkIn.checkout_remarks || "-",
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

        const filePath = `./assets/checkin_report_${Date.now()}.xlsx`;
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
  generatedBy
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
      generatedBy
    });
    console.log('Fetching all check-ins with filters:', where, order);

    // Fetch your check-ins data
    getCheckInsinResort({ where, order })
      .then((response) => {
        // Check if no check-ins found
        if (!response || response.length === 0) {
          reject(new AppError(404, "No check-ins found for the specified criteria"));
          return;
        }

        const checkIns = response.map((checkIn) => {
          const d = checkIn.dataValues;
          
          // Format dates properly
          const formatDate = (dateStr) => {
            if (!dateStr || dateStr === '-') return '-';
            try {
              return new Date(dateStr).toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              });
            } catch {
              return dateStr;
            }
          };

          const formatTime = (timeStr) => {
            if (!timeStr || timeStr === '-') return '-';
            try {
              return new Date(`1970-01-01T${timeStr}`).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              });
            } catch {
              return timeStr;
            }
          };

          return {
            id: d.id,
            room_number: d.Room ? d.Room.dataValues.room_number : '-',
            resort_name: d.Resort ? d.Resort.dataValues.name : '-',
            outlet_name: d.outlet_name || '-',
            table_number: d.table_number || '-',
            meal_type: d.meal_type || '-',
            meal_plan: d.meal_plan || '-',
            check_in_date: formatDate(d.check_in_date),
            check_in_time: formatTime(d.check_in_time),
            status: d.status || '-',
            check_out_date: formatDate(d.check_out_date),
            check_out_time: formatTime(d.check_out_time),
            checkout_remarks: d.checkout_remarks ? 
              (d.checkout_remarks.length > 80 ? 
                d.checkout_remarks.substring(0, 80) + '...' : 
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
            { text: 'Checkout Remarks', style: 'tableHeader', alignment: 'center' },
          ],
          // Map your dynamic data here, with formatting and styling
          ...checkIns.map((row, rowIndex) =>
            [
              { text: row.id.toString(), style: 'tableCell', alignment: 'center' },
              { text: row.room_number, style: 'tableCell', alignment: 'center' },
              { text: row.resort_name, style: 'tableCell', alignment: 'left' },
              { text: row.outlet_name, style: 'tableCell', alignment: 'left' },
              { text: row.table_number.toString(), style: 'tableCell', alignment: 'center' },
              { text: row.meal_type, style: 'tableCell', alignment: 'left' },
              { text: row.meal_plan, style: 'tableCell', alignment: 'left' },
              { text: row.check_in_date, style: 'tableCell', alignment: 'center' },
              { text: row.check_in_time, style: 'tableCell', alignment: 'center' },
              { 
                text: row.status, 
                style: row.status === 'checked-in' ? 'statusActive' : 'statusInactive', 
                alignment: 'center' 
              },
              { text: row.check_out_date, style: 'tableCell', alignment: 'center' },
              { text: row.check_out_time, style: 'tableCell', alignment: 'center' },
              { text: row.checkout_remarks, style: 'remarksCell', alignment: 'center' },
            ].map((cell) => ({
              ...cell,
              fillColor: rowIndex % 2 === 0 ? '#FFFFFF' : '#F9F7F4', // Professional zebra stripes
            }))
          ),
        ];

        // Define the PDF document structure
        const logoPath = path.join(__dirname, '../assets/Residence maldives log.png');
        const logoExists = fs.existsSync(logoPath);


        const docDefinition = {
          pageSize: 'A3',
          pageOrientation: 'landscape',
          pageMargins: [20, 20, 20, 20],
          images: logoExists ? {
            logo: logoPath
          } : {},
          content: [
            // ===== HEADER WITH LOGO AND CENTERED TITLE =====
            {
              columns: [
                // Logo on the left
                logoExists ? {
                  image: 'logo',
                  width: 100,
                  height: 65,
                  margin: [0, 10, 0, 0],
                } : {
                  text: 'THE RESIDENCE\nMALDIVES\nBY CENIZARO',
                  style: 'logoText',
                  width: 120,
                  margin: [0, 10, 0, 0]
                },
                {
                  stack: [
                    {
                      text: 'Guest Check-In Report',
                      style: 'header',
                      alignment: 'center',
                      margin: [0, 0, 0, 0],
                      width: '*'
                    },
                    {
                      text: `Generated on: ${new Date().toLocaleString()}`,
                      style: 'metaCentered',
                      alignment: 'center',
                      margin: [0, 10, 0, 5]
                    },
                    {
                      text: `Generated by: ${generatedBy}`,
                      style: 'metaCentered',
                      alignment: 'center',
                      margin: [0, 0, 0, 0]
                    }
                  ],
                  alignment: 'center',
                  margin: [0, 10, 0, 0],
                },
                
                {
                  text: '',
                  width: 120
                }
              ],
              margin: [0, 0, 0, 30]
            },

            
            // ===== DETAILED TABLE =====
            {
              text: 'Detailed Check-in Records',
              style: 'sectionHeader',
              margin: [0, 0, 0, 15]
            },
            {
              table: {
                headerRows: 1,
                widths: ['3%', '6%', '10%', '12%', '6%', '7%', '7%', '7%', '7%', '7%', '7%', '7%', '14%'],
                body: tableBody,
              },
              layout: {
                fillColor: (rowIndex) => (rowIndex === 0 ? '#614A24' : null),
                hLineWidth: (i, node) => (i === 0 || i === node.table.body.length ? 2 : 0.5),
                vLineWidth: () => 0.5,
                hLineColor: (i, node) =>
                  i === 0 || i === node.table.body.length ? '#614A24' : '#E0D6C7',
                vLineColor: () => '#E0D6C7',
                paddingLeft: () => 8,
                paddingRight: () => 8,
                paddingTop: () => 10,
                paddingBottom: () => 10,
              },
              margin: [0, 0, 0, 40]
            },
            // ===== FILTER SUMMARY =====
            {
              text: 'Report Summary',
              style: 'sectionHeader',
              margin: [0, 0, 0, 10]
            },
            {
              table: {
                widths: ['20%', '20%', '20%',],
                body: [
                  [
                    { text: 'Total Records', style: 'summaryHeader' },
                    { text: 'Check-ins', style: 'summaryHeader' },
                    { text: 'Check-outs', style: 'summaryHeader' },
                  ],
                  [
                    { text: checkIns.length.toString(), style: 'summaryValue' },
                    { text: checkIns.filter(c => c.status === 'checked-in').length.toString(), style: 'summaryValue' },
                    { text: checkIns.filter(c => c.status !== 'checked-in').length.toString(), style: 'summaryValue' },
                  ]
                ]
                
              },
              layout: {
                fillColor: (rowIndex) => (rowIndex === 0 ? '#614A24' : '#F9F7F4'),
                hLineWidth: () => 1,
                vLineWidth: () => 1,
                hLineColor: () => '#9A8768',
                vLineColor: () => '#9A8768',
                paddingLeft: () => 12,
                paddingRight: () => 12,
                paddingTop: () => 8,
                paddingBottom: () => 8,
                alignment: 'center',
              },
              margin: [0, 0, 0, 0],
            },

          ],
          styles: {
            logoText: {
              fontSize: 14,
              bold: true,
              color: '#614A24',
              alignment: 'center',
              lineHeight: 1.3
            },
            header: {
              fontSize: 28,
              bold: true,
              color: '#614A24',
              margin: [0, 0, 0, 5]
            },
            sectionHeader: {
              fontSize: 16,
              bold: true,
              color: '#614A24',
              margin: [0, 10, 0, 5]
            },
            metaLabel: {
              fontSize: 11,
              bold: true,
              color: '#614A24',
              alignment: 'right'
            },
            metaValue: {
              fontSize: 11,
              color: '#333333',
              alignment: 'left'
            },
            metaCentered: {
              fontSize: 12,
              color: '#614A24',
              bold: false
            },
            summaryHeader: {
              fontSize: 12,
              bold: true,
              color: 'white',
              alignment: 'center'
            },
            summaryValue: {
              fontSize: 13,
              bold: true,
              color: '#614A24',
              alignment: 'center'
            },
            tableHeader: {
              bold: true,
              fontSize: 11,
              color: 'white'
            },
            tableCell: {
              fontSize: 10,
              color: '#2C2C2C',
              margin: [0, 2, 0, 2]
            },
            statusActive: {
              fontSize: 10,
              bold: true,
              color: '#28a745',
              margin: [0, 2, 0, 2]
            },
            statusInactive: {
              fontSize: 10,
              bold: true,
              color: '#dc3545',
              margin: [0, 2, 0, 2]
            },
            remarksCell: {
              fontSize: 9,
              color: '#555555',
              margin: [0, 2, 0, 2]
            },
            noteHeader: {
              fontSize: 12,
              bold: true,
              color: '#614A24'
            },
            noteText: {
              fontSize: 10,
              color: '#666666',
              lineHeight: 1.4
            },
            footerText: {
              fontSize: 9,
              color: '#9A8768',
              italics: true,
              margin: [0, 10, 0, 20]
            },
            continuationHeader: {
              fontSize: 14,
              bold: true,
              color: '#614A24'
            }
          },
          defaultStyle: {
            font: 'Helvetica'
          },
          footer: function(currentPage, pageCount) {
            return {
              columns: [
                {
                  text: 'The Residence Maldives - Guest Check-in Report',
                  style: 'footerText',
                  alignment: 'left',
                  margin: [40, 10, 0, 0]
                },
                {
                  text: `Page ${currentPage} of ${pageCount}`,
                  style: 'footerText',
                  alignment: 'right',
                  margin: [0, 10, 40, 0]
                }
              ]
            };
          },
          header: function(currentPage, pageCount, pageSize) {
            if (currentPage > 1) {
              return {
                text: 'Guest Check-In Report (Continued)',
                style: 'continuationHeader',
                alignment: 'center',
                margin: [0, 20, 0, 20]
              };
            }
            return null;
          }
        };


        const pdfDoc = printer.createPdfKitDocument(docDefinition);

        const outputFile = `./assets/checkin_report_${Date.now()}.pdf`;
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
