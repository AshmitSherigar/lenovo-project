import { preventEmptyString, formatTime } from "../utils";

const severityStyle = {
  high: {
    color: "#fca5a5",
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
  },
  medium: {
    color: "#fcd34d",
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    border: "1px solid rgba(245, 158, 11, 0.3)",
  },
  low: {
    color: "#93c5fd",
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    border: "1px solid rgba(59, 130, 246, 0.3)",
  },
  unknown: {
    color: "#a1a1aa",
    backgroundColor: "rgba(161, 161, 170, 0.1)",
    border: "1px solid rgba(161, 161, 170, 0.2)",
  },
};

export const AlertTable = ({ alerts = [], onSelect }) => {
  const sortedAlerts = [...alerts]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 50);

  return (
    <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
      <div
        style={{
          padding: "1rem 1.5rem",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "0.8125rem",
            fontWeight: 500,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Incident Log
        </h2>
        <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
          Displaying {sortedAlerts.length} most recent incidents
        </span>
      </div>

      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        {sortedAlerts.length === 0 ? (
          <div
            style={{
              padding: "3rem",
              textAlign: "center",
              color: "var(--text-dim)",
              fontSize: "0.875rem",
            }}
          >
            No active incidents detected in the system.
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              fontSize: "0.8125rem",
            }}
          >
            <thead
              style={{
                position: "sticky",
                top: 0,
                backgroundColor: "var(--bg-card)",
                zIndex: 1,
              }}
            >
              <tr>
                <th style={thStyle}>Timestamp</th>
                <th style={thStyle}>Server ID</th>
                <th style={thStyle}>Severity Status</th>
                <th style={thStyle}>Detailed Description</th>
              </tr>
            </thead>
            <tbody>
              {sortedAlerts.map((alert, idx) => {
                const sev = alert.severity?.toLowerCase() || "unknown";
                const style = severityStyle[sev] || severityStyle.unknown;

                return (
                  <tr
                    key={idx}
                    className="row-animate"
                    onClick={() => onSelect && onSelect(alert)}
                    style={{
                      borderBottom: "1px solid var(--border-subtle)",
                      cursor: "pointer",
                      transition: "background-color 0.15s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgba(255,255,255,0.02)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <td
                      style={{
                        padding: "0.625rem 1.5rem",
                        whiteSpace: "nowrap",
                        fontVariantNumeric: "tabular-nums",
                        color: "var(--text-muted)",
                      }}
                    >
                      {formatTime(alert.timestamp)}
                    </td>
                    <td style={{ padding: "0.625rem 1.5rem", fontWeight: 500 }}>
                      {preventEmptyString(alert.serverId)}
                    </td>
                    <td style={{ padding: "0.625rem 1.5rem" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "0.125rem 0.5rem",
                          borderRadius: "9999px",
                          fontSize: "0.6875rem",
                          fontWeight: 500,
                          textTransform: "capitalize",
                          ...style,
                        }}
                      >
                        {sev}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "0.625rem 1.5rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      {preventEmptyString(alert.message)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const thStyle = {
  padding: "0.625rem 1.5rem",
  borderBottom: "1px solid var(--border-color)",
  color: "var(--text-dim)",
  fontWeight: 500,
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};
