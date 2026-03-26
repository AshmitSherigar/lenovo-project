const mongoose = require("mongoose");
// 

const metricSchema = new mongoose.Schema({
  serverId: String,
  cpu: Number,
  memory: Number,
  power: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Metric", metricSchema);
