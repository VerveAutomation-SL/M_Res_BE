const express = require('express');
const router = express.Router();
const { getAnalyticsController } = require('../controllers/analyticsController');

router.get('/', getAnalyticsController);


module.exports = router;