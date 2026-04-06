import React from "react";

export const ServerRack = ({ servers = ["S1", "S2", "S3"], metrics = [], alerts = [], selectedServer, onSelect }) => {
  const getServerHealth = (serverId) => {
    const serverAlerts = alerts.filter(a => a.serverId === serverId && a.severity === "high");
    if (serverAlerts.length > 0) return "danger";
    
    const latestMetric = metrics.find(m => m.serverId === serverId);
    if (latestMetric) {
      if (latestMetric.cpu > 80 || latestMetric.memory > 80 || latestMetric.power > 230) {
        return "warning";
      }
    }
    
    return "success";
  };

  const getStatusColor = (status) => {
    if (status === "danger") return "var(--color-danger)";
    if (status === "warning") return "#facc15";
    return "var(--color-success)";
  };

  return (
    <div className="panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600, color: "var(--text-main)" }}>Server Rack</h3>
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", padding: "1rem", backgroundColor: "#09090b", borderRadius: "8px", border: "1px solid #27272a", flexGrow: 1 }}>
        <div
          onClick={() => onSelect("ALL")}
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "6px",
            border: `1px solid ${selectedServer === "ALL" ? "var(--color-primary)" : "#3f3f46"}`,
            backgroundColor: selectedServer === "ALL" ? "rgba(59, 130, 246, 0.1)" : "#18181b",
            cursor: "pointer",
            textAlign: "center",
            fontWeight: 500,
            fontSize: "0.875rem",
            color: selectedServer === "ALL" ? "var(--color-primary)" : "var(--text-muted)",
            marginBottom: "0.5rem",
            transition: "all 0.2s"
          }}
        >
          View Cluster Overview
        </div>

        {servers.map(server => {
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
                padding: "1rem",
                backgroundColor: isSelected ? "rgba(255,255,255,0.05)" : "#18181b",
                border: `1px solid ${isSelected ? "var(--color-primary)" : "#27272a"}`,
                borderRadius: "6px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: isSelected ? "0 0 0 1px var(--color-primary)" : "none"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ 
                  width: "14px", height: "6px", borderRadius: "3px", 
                  backgroundColor: color,
                  boxShadow: `0 0 10px ${color}`
                }}></div>
                <span style={{ fontWeight: 600, color: isSelected ? "var(--text-main)" : "var(--text-muted)", fontSize: "0.95rem" }}>
                  Server {server}
                </span>
              </div>
              
              <div style={{ display: "flex", gap: "4px" }}>
                <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "#3f3f46" }}></div>
                <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "#3f3f46" }}></div>
                <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "#3f3f46", animation: status === "success" ? "blink 2s infinite" : "none" }}></div>
              </div>
            </div>
          )
        })}
      </div>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; background-color: var(--color-success); box-shadow: 0 0 5px var(--color-success); }
        }
      `}</style>
    </div>
  );
};
