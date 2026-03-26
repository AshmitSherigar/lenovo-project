export const formatTime = (timestamp) => {
  if (!timestamp) return "-";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "-";
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
};

export const normalizeMetric = (item) => {
  if (!item) return null;
  return {
    ...item,
    timestamp: item.timestamp ? new Date(item.timestamp).getTime() : Date.now(),
    cpu: Number(item.cpu) || 0,
    memory: Number(item.memory) || 0,
    power: Number(item.power) || 0,
    serverId: item.serverId || "unknown",
  };
};

export const preventEmptyString = (value, fallback = "-") =>
  value === undefined || value === null || `${value}`.trim() === ""
    ? fallback
    : value;
