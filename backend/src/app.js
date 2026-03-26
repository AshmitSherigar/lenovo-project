const express = require('express');
const cors = require('cors');

const metricsRoutes = require('./routes/metric.route');
const alertsRoutes = require('./routes/alert.route');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/metrics', metricsRoutes);
app.use('/api/alerts', alertsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: "OK" });
});

module.exports = app;