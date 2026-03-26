const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  serverId: String,
  message: String,
  severity: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Alert', alertSchema);