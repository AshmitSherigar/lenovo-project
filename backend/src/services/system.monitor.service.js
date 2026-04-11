const si = require("systeminformation");

let monitoringInterval = null;
let isMonitoring = false;
let io = null;

const setSocketInstance = (socketInstance) => {
  io = socketInstance;
};

const getSystemMetrics = async () => {
  try {
    const cpu = await si.currentLoad();
    const mem = await si.mem();

    return {
      cpu: Math.round(cpu.currentLoad),
      memory: Math.round((mem.used / mem.total) * 100),
      power: Math.round(200 + Math.random() * 30), // Simulated power value
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    console.error("Error collecting system metrics:", err.message);
    throw err;
  }
};

const startMonitoring = async () => {
  if (isMonitoring) {
    return { error: "Monitoring already running on this system" };
  }

  isMonitoring = true;

  monitoringInterval = setInterval(async () => {
    try {
      const metrics = await getSystemMetrics();

      const data = {
        serverId: "LOCAL",
        cpu: metrics.cpu,
        memory: metrics.memory,
        power: metrics.power,
        timestamp: metrics.timestamp,
      };

      if (io) {
        io.emit("power-data", data);
      }
    } catch (err) {
      console.error("Monitoring interval error:", err.message);
    }
  }, 5000);

  return { success: true, message: "Monitoring started" };
};

const stopMonitoring = () => {
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
    monitoringInterval = null;
  }
  isMonitoring = false;
  return { success: true, message: "Monitoring stopped" };
};

module.exports = {
  setSocketInstance,
  startMonitoring,
  stopMonitoring,
  getSystemMetrics,
};
