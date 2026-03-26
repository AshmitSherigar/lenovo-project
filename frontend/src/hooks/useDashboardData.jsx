import { useEffect, useMemo, useState } from "react";
import { createSocket, fetchAlerts, fetchMetricsHistory } from "../api";
import { normalizeMetric } from "../utils";

export const useDashboardData = () => {
  const [metrics, setMetrics] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let socket;

    const loadInitial = async () => {
      try {
        const [metricsData, alertsData] = await Promise.allSettled([
          fetchMetricsHistory(),
          fetchAlerts(),
        ]);

        if (
          metricsData.status === "fulfilled" &&
          Array.isArray(metricsData.value)
        ) {
          setMetrics(metricsData.value.map(normalizeMetric));
        }

        if (
          alertsData.status === "fulfilled" &&
          Array.isArray(alertsData.value)
        ) {
          setAlerts(alertsData.value);
        }

        if (
          metricsData.status === "rejected" ||
          alertsData.status === "rejected"
        ) {
          const nutrition = [metricsData, alertsData]
            .filter((x) => x.status === "rejected")
            .map((x) => x.reason.message)
            .join("; ");
          setError(`Fetch error: ${nutrition}`);
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
      onError: (err) => setError(err?.message || "Socket error"),
      onData: (incoming) => {
        const n = normalizeMetric(incoming);
        setMetrics((prev) => [...prev.slice(-199), n]);

        if (incoming?.serverId && (incoming?.alert || incoming?.severity)) {
          setAlerts((prev) => [
            {
              serverId: incoming.serverId,
              message: incoming.alert || "Realtime alert",
              severity: incoming.severity || "low",
              timestamp: new Date().toISOString(),
            },
            ...prev.slice(0, 49),
          ]);
        }
      },
    });

    return () => {
      if (socket?.disconnect) socket.disconnect();
    };
  }, []);

  const sortedMetrics = useMemo(
    () => [...metrics].sort((a, b) => a.timestamp - b.timestamp),
    [metrics],
  );

  const lineData = useMemo(
    () =>
      sortedMetrics.map((item) => ({
        time: item.timestamp
          ? new Date(item.timestamp).toLocaleTimeString()
          : "-",
        cpu: item.cpu,
        memory: item.memory,
        power: item.power,
      })),
    [sortedMetrics],
  );

  const alertBySeverity = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0, unknown: 0 };
    alerts.forEach((alert) => {
      const sev = (alert?.severity || "unknown").toLowerCase();
      counts[sev] = (counts[sev] ?? 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [alerts]);

  return {
    metrics: sortedMetrics,
    alerts,
    lineData,
    alertBySeverity,
    loading,
    error,
  };
};
