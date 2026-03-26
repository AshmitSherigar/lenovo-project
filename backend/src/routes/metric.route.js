const express = require('express');
const router = express.Router();

const { createMetric, getHistory } = require('../controllers/metric.controller');

router.post('/', createMetric);
router.get('/history', getHistory);

module.exports = router;