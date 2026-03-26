import { preventEmptyString, formatTime } from "../utils";

export const AlertTable = ({ alerts = [] }) => (
  <section
    style={{
      background: "#12214b",
      borderRadius: 14,
      padding: "1rem",
      boxShadow: "0 10px 30px rgba(0,0,0,.5)",
    }}
  >
    <h2 style={{ marginTop: 0, color: "#c6d3ff" }}>Latest Alerts</h2>
    <div style={{ maxHeight: 280, overflowY: "auto" }}>
      {alerts.length === 0 ? (
        <p style={{ color: "#9dbbe8" }}>No alerts yet.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            color: "#e6ecff",
          }}
        >
          <thead style={{ background: "#0f1d43" }}>
            <tr>
              <th style={{ textAlign: "left", padding: "8px" }}>Time</th>
              <th style={{ textAlign: "left", padding: "8px" }}>Server</th>
              <th style={{ textAlign: "left", padding: "8px" }}>Severity</th>
              <th style={{ textAlign: "left", padding: "8px" }}>Message</th>
            </tr>
          </thead>
          <tbody>
            {alerts.slice(0, 50).map((alert, idx) => (
              <tr
                key={`${alert._id || idx}-${alert.timestamp}`}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
              >
                <td style={{ padding: "8px" }}>
                  {formatTime(alert.timestamp)}
                </td>
                <td style={{ padding: "8px" }}>
                  {preventEmptyString(alert.serverId)}
                </td>
                <td style={{ padding: "8px", color: "#fff" }}>
                  {preventEmptyString(alert.severity, "unknown")}
                </td>
                <td style={{ padding: "8px" }}>
                  {preventEmptyString(alert.message)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </section>
);
