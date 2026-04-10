import { useEffect, useMemo, useState } from "react";
import { createSocket, fetchAlerts, fetchMetricsHistory } from "../api";
import { normalizeMetric } from "../utils";
import { toast } from "sonner";

export const useDashboardData = () => {
  const [metrics, setMetrics] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let socket;

    const loadInitial = async () => {
      try {
        const [metricsRes, alertsRes] = await Promise.allSettled([
          fetchMetricsHistory(),
          fetchAlerts(),
        ]);

        if (metricsRes.status === "fulfilled" && Array.isArray(metricsRes.value)) {
          setMetrics(metricsRes.value.map(normalizeMetric));
        }

        if (alertsRes.status === "fulfilled" && Array.isArray(alertsRes.value)) {
          setAlerts(alertsRes.value);
        }

        if (metricsRes.status === "rejected" || alertsRes.status === "rejected") {
          const errMsg = [metricsRes, alertsRes]
            .filter((x) => x.status === "rejected")
            .map((x) => x.reason?.message || "Internal system error")
            .join("; ");
          setError(`Unable to synchronize dashboard data: ${errMsg}`);
        }
      } catch (e) {
        setError(e.message || "An unexpected error occurred during initialization");
      } finally {
        setLoading(false);
      }
    };

    loadInitial();

    socket = createSocket({
      onConnect: () => setError(null),
      onDisconnect: () => console.info("Data stream interrupted"),
      onError: (err) => setError(err?.message || "Connection failure"),

      onData: (incoming) => {
        const n = normalizeMetric(incoming);

        setMetrics((prev) => [...prev.slice(-199), n]);

        if (incoming?.serverId && (incoming?.alert || incoming?.severity)) {
          const alertData = {
            serverId: incoming.serverId,
            message: incoming.alert || "Unusual behavior detected",
            severity: incoming.severity || "low",
            timestamp: incoming.timestamp || new Date().toISOString(),
          };

          setAlerts((prev) => [alertData, ...prev.slice(0, 1999)]);

          const sev = (alertData.severity || "low").toLowerCase();
          const time = new Date(alertData.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });

          const description = `${alertData.message} on server ${alertData.serverId} at ${time}. Internal system logs indicate immediate attention may be needed.`;

          if (sev === "high") {
            toast.error("Critical System Alert", { description });
          } else if (sev === "medium") {
            toast.warning("System Warning", { description });
          } else {
            toast.info("System Notification", { description });
          }
        }
      },
    });

    return () => {
      if (socket?.disconnect) socket.disconnect();
    };
  }, []);

  const sortedMetrics = useMemo(
    () => [...metrics].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
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