import { io } from "socket.io-client";

const apiBase = import.meta.env.VITE_API_URL || "";

const safeFetch = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const text = await response.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
    const error = new Error(
      `Request failed: ${response.status} ${response.statusText}`,
    );
    error.status = response.status;
    error.body = json ?? text;
    throw error;
  }
  return response.json();
};

export const fetchMetricsHistory = async () => {
  return safeFetch(`${apiBase}/api/metrics/history`);
};

export const fetchAlerts = async () => {
  return safeFetch(`${apiBase}/api/alerts`);
};

export const postMetric = async (metric) => {
  return safeFetch(`${apiBase}/api/metrics`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(metric),
  });
};

export const postMetricBatch = async (metrics) => {
  return safeFetch(`${apiBase}/api/metrics/batch`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(metrics),
  });
};

export const uploadMetricsFile = async (file) => {
  const form = new FormData();
  form.append("file", file);

  const response = await fetch(`${apiBase}/api/metrics/upload`, {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    const text = await response.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
    const error = new Error(
      `Request failed: ${response.status} ${response.statusText}`,
    );
    error.status = response.status;
    error.body = json ?? text;
    throw error;
  }

  return response.json();
};

export const startSystemMonitoring = async () => {
  return safeFetch(`${apiBase}/api/metrics/start-monitoring`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const stopSystemMonitoring = async () => {
  return safeFetch(`${apiBase}/api/metrics/stop-monitoring`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const generateCSV = (metrics) => {
  if (!metrics || metrics.length === 0) {
    return null;
  }

  const headers = ["timestamp", "cpu", "memory", "power"];
  const rows = metrics.map((m) => [
    m.timestamp || "",
    m.cpu || 0,
    m.memory || 0,
    m.power || 0,
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  return csv;
};

export const downloadCSV = (csvContent, filename = "system_metrics.csv") => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const createSocket = ({ onData, onError, onConnect, onDisconnect }) => {
  const socketUrl = apiBase || "http://localhost:5000";
  const socket = io(socketUrl, {
    path: "/socket.io",
    transports: ["websocket", "polling"],
    timeout: 15000,
  });

  socket.on("connect", () => onConnect?.(socket.id));
  socket.on("disconnect", () => onDisconnect?.());
  socket.on("power-data", (payload) => onData?.(payload));
  socket.on("connect_error", (err) => onError?.(err));
  socket.on("error", (err) => onError?.(err));

  return socket;
};
