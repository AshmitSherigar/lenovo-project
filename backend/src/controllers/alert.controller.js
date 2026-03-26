const Alert = require('../models/alert.model');

const getAlerts = async (req, res) => {
  const alerts = await Alert.find().sort({ timestamp: -1 });
  res.json(alerts);
};

module.exports = { getAlerts };