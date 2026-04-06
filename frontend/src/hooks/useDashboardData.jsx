import { useEffect, useMemo, useState, useRef } from "react";
import { createSocket, fetchAlerts, fetchMetricsHistory } from "../api";
import { normalizeMetric } from "../utils";

export const useDashboardData = () => {
  const [metrics, setMetrics] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [paused, setPaused] = useState(() => {
    return window.localStorage.getItem("dashboard_paused") === "true";
  });
  
  const [pausedAt, setPausedAt] = useState(() => {
    const val = window.localStorage.getItem("dashboard_paused_at");
    return val ? parseInt(val, 10) : null;
  });

  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
    window.localStorage.setItem("dashboard_paused", paused.toString());
    
    if (paused) {
      if (!pausedAt) {
        const now = Date.now();
        setPausedAt(now);
        window.localStorage.setItem("dashboard_paused_at", now.toString());
      }
    } else {
      setPausedAt(null);
      window.localStorage.removeItem("dashboard_paused_at");
    }
  }, [paused, pausedAt]);

  useEffect(() => {
    let socket;

    const loadInitial = async () => {
      try {
        const [metricsRes, alertsRes] = await Promise.allSettled([
          fetchMetricsHistory(),
          fetchAlerts(),
        ]);

        const isCurrentlyPaused = window.localStorage.getItem("dashboard_paused") === "true";
        const freezeTime = parseInt(window.localStorage.getItem("dashboard_paused_at"), 10);

        if (metricsRes.status === "fulfilled" && Array.isArray(metricsRes.value)) {
          let loaded = metricsRes.value.map(normalizeMetric);
          if (isCurrentlyPaused && freezeTime) {
            loaded = loaded.filter(m => new Date(m.timestamp).getTime() <= freezeTime);
          }
          setMetrics(loaded);
        }

        if (alertsRes.status === "fulfilled" && Array.isArray(alertsRes.value)) {
          let loaded = alertsRes.value;
          if (isCurrentlyPaused && freezeTime) {
            loaded = loaded.filter(a => new Date(a.timestamp).getTime() <= freezeTime);
          }
          setAlerts(loaded);
        }

        if (
          metricsRes.status === "rejected" ||
          alertsRes.status === "rejected"
        ) {
          const errMsg = [metricsRes, alertsRes]
            .filter((x) => x.status === "rejected")
            .map((x) => x.reason?.message || "Unknown error")
            .join("; ");

          setError(`Fetch error: ${errMsg}`);
        }
      } catch (e) {
        setError(e.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    loadInitial();

    socket = createSocket({
      onConnect: () => setError(null),
      onDisconnect: () => console.info("Socket disconnected"),
      onError: (err) =>
        setError(err?.message || "Socket error"),

      onData: (incoming) => {
        if (pausedRef.current) return;

        const n = normalizeMetric(incoming);

        setMetrics((prev) => [
          ...prev.slice(-199),
          n,
        ]);

        if (
          incoming?.serverId &&
          (incoming?.alert || incoming?.severity)
        ) {
          setAlerts((prev) => [
            {
              serverId: incoming.serverId,
              message:
                incoming.alert || "Realtime alert",
              severity:
                incoming.severity || "low",
              timestamp:
                incoming.timestamp ||
                new Date().toISOString(),
            },
            ...prev.slice(0, 1999),
          ]);
        }
      },
    });

    return () => {
      if (socket?.disconnect) socket.disconnect();
    };
  }, []);

  const sortedMetrics = useMemo(
    () =>
      [...metrics].sort(
        (a, b) =>
          new Date(a.timestamp) - new Date(b.timestamp)
      ),
    [metrics]
  );

  const lineData = useMemo(
    () =>
      sortedMetrics.map((item) => ({
        time: item.timestamp,
        cpu: item.cpu,
        memory: item.memory,
        power: item.power,
      })),
    [sortedMetrics]
  );

  const alertBySeverity = useMemo(() => {
    const counts = {
      high: 0,
      medium: 0,
      low: 0,
      unknown: 0,
    };

    alerts.forEach((alert) => {
      const sev = (
        alert?.severity || "unknown"
      ).toLowerCase();

      counts[sev] = (counts[sev] ?? 0) + 1;
    });

    return Object.entries(counts).map(
      ([name, value]) => ({ name, value })
    );
  }, [alerts]);

  return {
    metrics: sortedMetrics,
    alerts,
    lineData,
    alertBySeverity,
    loading,
    error,
    paused,
    setPaused,
  };
};