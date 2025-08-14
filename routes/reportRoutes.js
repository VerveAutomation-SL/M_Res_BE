const express = require('express');
const router = express.Router();
const { generateExcelReportController, getPreviewDataController, generatePdfReport } = require('../controllers/reportController');

router.post("/excel", generateExcelReportController);
router.post("/pdf", generatePdfReport);
router.post("/preview", getPreviewDataController);

module.exports = router;