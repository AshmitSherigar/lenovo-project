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
