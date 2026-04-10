import React from "react";

export const ServerRack = ({
  servers = ["S1", "S2", "S3"],
  metrics = [],
  alerts = [],
  selectedServer,
  onSelect,
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
            fontSize: "0.8125rem",
            fontWeight: 500,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
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
        }}
      >
        <div
          onClick={() => onSelect("ALL")}
          style={{
            padding: "0.625rem 0.875rem",
            borderRadius: "6px",
            border: `1px solid ${selectedServer === "ALL" ? "var(--color-primary)" : "var(--border-color)"}`,
            backgroundColor:
              selectedServer === "ALL"
                ? "rgba(59, 130, 246, 0.08)"
                : "var(--bg-card)",
            cursor: "pointer",
            textAlign: "center",
            fontWeight: 500,
            fontSize: "0.8125rem",
            color:
              selectedServer === "ALL"
                ? "var(--color-primary)"
                : "var(--text-muted)",
            marginBottom: "0.25rem",
            transition: "all 0.15s ease",
          }}
        >
          View Cluster Overview
        </div>

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
                padding: "0.75rem 0.875rem",
                backgroundColor: isSelected
                  ? "rgba(255,255,255,0.04)"
                  : "var(--bg-card)",
                border: `1px solid ${isSelected ? "var(--color-primary)" : "var(--border-color)"}`,
                borderRadius: "6px",
                cursor: "pointer",
                transition: "all 0.15s ease, transform 0.15s ease",
                transform: isSelected ? "scale(1)" : "scale(1)",
              }}
              onMouseOver={(e) => {
                if (!isSelected)
                  e.currentTarget.style.transform = "translateX(3px)";
                e.currentTarget.style.borderColor = isSelected
                  ? "var(--color-primary)"
                  : "#3f3f46";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.borderColor = isSelected
                  ? "var(--color-primary)"
                  : "var(--border-color)";
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
                    boxShadow: `0 0 8px ${color}`,
                    animation:
                      status === "stable"
                        ? "pulse 2s ease-in-out infinite"
                        : "none",
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
