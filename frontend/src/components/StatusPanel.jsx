export const StatusPanel = ({ metricsCount = 0, alertsCount = 0 }) => (
  <div className="panel" style={{ 
    marginTop: "2rem", 
    padding: "0.875rem 1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
      <div className="pulse-dot"></div>
      <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Operational Status: Active</span>
    </div>
    
    <div style={{ display: "flex", gap: "2rem", color: "var(--text-dim)", fontSize: "0.8125rem" }}>
      <span>
        Log entries: <strong style={{ color: "var(--text-main)", fontWeight: 600 }}>{metricsCount}</strong>
      </span>
      <span>
        System incidents: <strong style={{ color: alertsCount > 0 ? "var(--color-danger)" : "var(--text-main)", fontWeight: 600 }}>{alertsCount}</strong>
      </span>
      <span>
        Analysis engine: <strong style={{ color: "var(--color-success)", fontWeight: 600 }}>Online</strong>
      </span>
    </div>
  </div>
);

