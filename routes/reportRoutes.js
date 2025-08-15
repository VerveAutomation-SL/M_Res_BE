const express = require('express');
const router = express.Router();
const { generateExcelReportController, getPreviewDataController, generatePdfReport } = require('../controllers/reportController');
const authenticateToken = require('../middleware/authMiddleware');

router.post("/excel", generateExcelReportController);
router.post("/pdf", authenticateToken, generatePdfReport);
router.post("/preview", getPreviewDataController);

module.exports = router;