import React from "react";

export const ServerRack = ({
  servers = ["S1", "S2", "S3"],
  metrics = [],
  alerts = [],
  selectedServer,
  onSelect,
  localSystemMetrics = [],
  monitoringActive = false,
}) => {
  const getServerHealth = (serverId) => {
    const serverAlerts = alerts.filter(
      (a) => a.serverId === serverId && a.severity === "high",
    );
    if (serverAlerts.length > 0) return "critical";

    const latestMetric = metrics.find((m) => m.serverId === serverId);
    if (latestMetric) {
      if (
        latestMetric.cpu > 80 ||
        latestMetric.memory > 80 ||
        latestMetric.power > 230
      ) {
        return "elevated";
      }
    }

    return "stable";
  };

  const getStatusColor = (status) => {
    if (status === "critical") return "var(--color-danger)";
    if (status === "elevated") return "#facc15";
    return "var(--color-success)";
  };

  const getLocalSystemHealth = () => {
    if (localSystemMetrics.length === 0) return "stable";
    const latest = localSystemMetrics[localSystemMetrics.length - 1];
    if (latest.cpu > 80 || latest.memory > 80) {
      return "elevated";
    }
    return "stable";
  };

  const getLocalMetricValue = (key) => {
    if (localSystemMetrics.length === 0) return "—";
    return localSystemMetrics[localSystemMetrics.length - 1][key] || "—";
  };

  return (
    <div
      className="panel"
      style={{
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div style={{ marginBottom: "1rem" }}>
        <h3
          style={{
            margin: 0,
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Server Rack
        </h3>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          padding: "0.75rem",
          backgroundColor: "var(--bg-main)",
          borderRadius: "8px",
          border: "1px solid var(--border-subtle)",
          flexGrow: 1,
          overflowY: "auto",
        }}
      >
        <div
          onClick={() => onSelect("ALL")}
          style={{
            padding: "0.5rem 0.75rem",
            borderRadius: "6px",
            border: `1px solid ${selectedServer === "ALL" ? "var(--color-primary)" : "var(--border-color)"}`,
            backgroundColor:
              selectedServer === "ALL"
                ? "rgba(59, 130, 246, 0.05)"
                : "var(--bg-card)",
            cursor: "pointer",
            textAlign: "center",
            fontWeight: 600,
            fontSize: "0.75rem",
            color:
              selectedServer === "ALL"
                ? "var(--color-primary)"
                : "var(--text-muted)",
            marginBottom: "0.25rem",
          }}
        >
          View Cluster Overview
        </div>

        {monitoringActive && (
          <div
            onClick={() => onSelect("LOCAL")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.625rem 0.75rem",
              backgroundColor:
                selectedServer === "LOCAL"
                  ? "rgba(255,255,255,0.02)"
                  : "var(--bg-card)",
              border: `1px solid ${selectedServer === "LOCAL" ? "var(--color-primary)" : "var(--border-color)"}`,
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                flex: 1,
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: getStatusColor(getLocalSystemHealth()),
                }}
              ></div>
              <span
                style={{
                  fontWeight: selectedServer === "LOCAL" ? 600 : 500,
                  color:
                    selectedServer === "LOCAL"
                      ? "var(--text-main)"
                      : "var(--text-muted)",
                  fontSize: "0.875rem",
                  transition: "color 0.15s",
                  flex: 1,
                }}
              >
                YOUR COMPUTER
              </span>
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                fontSize: "0.625rem",
                color: "var(--text-muted)",
              }}
            >
              <span>CPU: {getLocalMetricValue("cpu")}%</span>
              <span>MEM: {getLocalMetricValue("memory")}%</span>
            </div>
          </div>
        )}

        {servers.map((server) => {
          const status = getServerHealth(server);
          const color = getStatusColor(status);
          const isSelected = selectedServer === server;

          return (
            <div
              key={server}
              onClick={() => onSelect(server)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.625rem 0.75rem",
                backgroundColor: isSelected
                  ? "rgba(255,255,255,0.02)"
                  : "var(--bg-card)",
                border: `1px solid ${isSelected ? "var(--color-primary)" : "var(--border-color)"}`,
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: color,
                  }}
                ></div>
                <span
                  style={{
                    fontWeight: isSelected ? 600 : 500,
                    color: isSelected
                      ? "var(--text-main)"
                      : "var(--text-muted)",
                    fontSize: "0.875rem",
                    transition: "color 0.15s",
                  }}
                >
                  Server {server}
                </span>
              </div>

              <span
                style={{
                  fontSize: "0.6875rem",
                  color: "var(--text-dim)",
                  textTransform: "capitalize",
                  fontWeight: 500,
                }}
              >
                {status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
