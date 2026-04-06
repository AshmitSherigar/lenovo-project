export const StatusPanel = ({ metricsCount = 0, alertsCount = 0 }) => (
  <div className="panel" style={{ 
    marginTop: "2.5rem", 
    padding: "1rem 1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "var(--color-success)", boxShadow: "0 0 8px rgba(16, 185, 129, 0.4)"}}></div>
      <h2 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600, color: "var(--text-main)", letterSpacing: "0.5px", textTransform: "uppercase" }}>System Operational</h2>
    </div>
    
    <div style={{ display: "flex", gap: "2.5rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#52525b" }}></span>
        <span>
          Metrics tracking: <strong style={{ color: "var(--text-main)", fontWeight: 600 }}>{metricsCount}</strong>
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#52525b" }}></span>
        <span>
          Alerts evaluated: <strong style={{ color: "var(--text-main)", fontWeight: 600 }}>{alertsCount}</strong>
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--color-success)" }}></span>
        <span>
          ML Pipeline: <strong style={{ color: "var(--color-success)", fontWeight: 600 }}>Online</strong>
        </span>
      </div>
    </div>
  </div>
);
