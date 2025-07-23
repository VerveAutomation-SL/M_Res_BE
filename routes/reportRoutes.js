const express = require('express');
const router = express.Router();
const { generateExcelReportController, generatePDFReportController, getPreviewDataController } = require('../controllers/reportController');

router.post("/excel", generateExcelReportController);
router.post("/pdf", generatePDFReportController);
router.post("/preview", getPreviewDataController);

module.exports = router;