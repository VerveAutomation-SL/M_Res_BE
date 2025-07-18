const express = require('express');
const router = express.Router();
const { generateExcelReportController, generatePDFReportController } = require('../controllers/reportController');

router.get("/excel", generateExcelReportController);
router.get("/pdf", generatePDFReportController);


module.exports = router;