const Metric = require("../models/metric.model");
const Alert = require("../models/alert.model");
const { checkAnomaly } = require("../services/detection.service");
const { getFeatures } = require("../services/feature.service");
const { checkMLAnomaly } = require("../services/ml.service");
const { sendAlertEmail } = require("../services/email.service");
const { startMonitoring, stopMonitoring } = require("../services/system.monitor.service");

let io;
let lastAlertTime = {};

const setSocket = (socketInstance) => {
  io = socketInstance;
};

const createMetric = async (req, res) => {
  try {
    const data = req.body;

    const metric = await Metric.create(data);

    const ruleAlert = checkAnomaly(data);

    const features = getFeatures(data);

    let mlResult = null;

    if (features) {
      mlResult = await checkMLAnomaly(features);
    }

    if (ruleAlert || mlResult?.is_anomaly) {
      const alertData = {
        serverId: data.serverId,
        message: ruleAlert?.message || `ML anomaly`,
        severity: ruleAlert?.severity || (mlResult?.is_anomaly ? "high" : "low"),
      };

      await Alert.create(alertData);

      if (
        !lastAlertTime[data.serverId] ||
        Date.now() - lastAlertTime[data.serverId] > 60000
      ) {
        await sendAlertEmail(alertData);
        lastAlertTime[data.serverId] = Date.now();
      }
      
      data.alert = alertData.message;
      data.severity = alertData.severity;
    }

    if (io) {
      io.emit("power-data", data);
    }

    res.status(201).json(metric);
  } catch (err) {
    console.error("Metric Controller Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const getHistory = async (req, res) => {
  try {
    const { limit = 200, serverId } = req.query;
    const query = serverId ? { serverId } : {};
    const metrics = await Metric.find(query)
      .sort({ timestamp: -1 })
      .limit(Number(limit));
    res.json(metrics);
  } catch (err) {
    console.error("getHistory Controller Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const startLocalMonitoring = async (req, res) => {
  try {
    const result = await startMonitoring();
    if (result.error) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Start Monitoring Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const stopLocalMonitoring = async (req, res) => {
  try {
    const result = stopMonitoring();
    res.status(200).json(result);
  } catch (err) {
    console.error("Stop Monitoring Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createMetric, setSocket, getHistory, startLocalMonitoring, stopLocalMonitoring };
