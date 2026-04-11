const express = require('express');
const router = express.Router();

const { createMetric, getHistory, startLocalMonitoring, stopLocalMonitoring } = require('../controllers/metric.controller');

router.post('/', createMetric);
router.get('/history', getHistory);
router.post('/start-monitoring', startLocalMonitoring);
router.post('/stop-monitoring', stopLocalMonitoring);

module.exports = router;