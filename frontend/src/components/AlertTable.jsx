import { preventEmptyString, formatTime } from "../utils";

const severityStyle = {
  high: {
    color: "#7f1d1d",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
  },
  medium: {
    color: "#78350f",
    backgroundColor: "#fffbeb",
    border: "1px solid #fde68a",
  },
  low: {
    color: "#1e3a8a",
    backgroundColor: "#eff6ff",
    border: "1px solid #bfdbfe",
  },
  unknown: {
    color: "#334155",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
  },
};

export const AlertTable = ({ alerts = [], onSelect }) => {
  const sortedAlerts = [...alerts]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 50);

  return (
    <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600 }}>
          Recent Alerts
        </h2>
      </div>

      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        {sortedAlerts.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
            No active alerts found.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
            <thead style={{ position: "sticky", top: 0, backgroundColor: "var(--bg-card)", zIndex: 1 }}>
              <tr>
                <th style={{ padding: "0.75rem 1.5rem", borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)", fontWeight: 500 }}>Time</th>
                <th style={{ padding: "0.75rem 1.5rem", borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)", fontWeight: 500 }}>Server</th>
                <th style={{ padding: "0.75rem 1.5rem", borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)", fontWeight: 500 }}>Severity</th>
                <th style={{ padding: "0.75rem 1.5rem", borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)", fontWeight: 500 }}>Message</th>
              </tr>
            </thead>
            <tbody>
              {sortedAlerts.map((alert, idx) => {
                const sev = alert.severity?.toLowerCase() || "unknown";
                const style = severityStyle[sev] || severityStyle.unknown;

                return (
                  <tr
                    key={idx}
                    onClick={() => onSelect && onSelect(alert)}
                    style={{
                      borderBottom: "1px solid var(--border-color)",
                      cursor: "pointer",
                      transition: "background-color 0.1s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <td style={{ padding: "1rem 1.5rem", whiteSpace: "nowrap" }}>
                      {formatTime(alert.timestamp)}
                    </td>
                    <td style={{ padding: "1rem 1.5rem", fontWeight: 500 }}>
                      {preventEmptyString(alert.serverId)}
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <span style={{
                        display: "inline-block",
                        padding: "0.125rem 0.5rem",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        textTransform: "capitalize",
                        ...style
                      }}>
                        {sev}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
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