const history = {};

function getFeatures(data) {
  const { serverId, cpu, memory, power, timestamp } = data;

  if (!history[serverId]) {
    history[serverId] = [];
  }

  const serverHistory = history[serverId];

  serverHistory.push({ cpu, memory, power, timestamp });

  if (serverHistory.length > 5) {
    serverHistory.shift();
  }

  if (serverHistory.length < 2) {
    return null;
  }

  const last = serverHistory[serverHistory.length - 1];
  const prev = serverHistory[serverHistory.length - 2];

  const cpu_change = last.cpu - prev.cpu;
  const memory_change = last.memory - prev.memory;
  const power_change = last.power - prev.power;

  const cpu_rolling_mean =
    serverHistory.reduce((sum, d) => sum + d.cpu, 0) / serverHistory.length;

  const power_rolling_mean =
    serverHistory.reduce((sum, d) => sum + d.power, 0) / serverHistory.length;

  const cpu_deviation = last.cpu - cpu_rolling_mean;
  const power_deviation = last.power - power_rolling_mean;

  const date = new Date(timestamp);

  return {
    cpu_util: last.cpu,
    memory_util: last.memory,
    cpu_change,
    memory_change,
    power_change,
    cpu_rolling_mean,
    power_rolling_mean,
    cpu_deviation,
    power_deviation,
    hour: date.getHours(),
    day_of_week: date.getDay()
  };
}

module.exports = { getFeatures };