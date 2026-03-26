let lastPower = {};

function checkAnomaly(data) {
  const { serverId, cpu, memory, power } = data;

  if (power > 200) {
    return { serverId, message: "High power usage", severity: "high" };
  }

  if (memory > 85) {
    return { serverId, message: "Memory overload", severity: "high" };
  }

  if (cpu < 30 && power > 150) {
    return { serverId, message: "Inefficient usage", severity: "medium" };
  }

  if (lastPower[serverId] && power > lastPower[serverId] * 1.5) {
    return { serverId, message: "Sudden spike", severity: "high" };
  }

  lastPower[serverId] = power;

  return null;
}

module.exports = { checkAnomaly };