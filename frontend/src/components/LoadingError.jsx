export const LoadingError = ({ loading, error }) => {
  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center",
        height: "50vh",
        color: "var(--text-dim)"
      }}>
        <div style={{
          width: "28px",
          height: "28px",
          border: "2px solid var(--border-color)",
          borderTop: "2px solid var(--color-primary)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          marginBottom: "1rem"
        }}></div>
        <div style={{ fontSize: "0.8125rem", fontWeight: 500 }}>Initializing system telemetry and analytical models...</div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="panel" style={{
        marginTop: "2rem",
        padding: "1.25rem 1.5rem",
        backgroundColor: "rgba(239, 68, 68, 0.08)",
        borderColor: "rgba(239, 68, 68, 0.3)",
      }}>
        <h3 style={{ margin: "0 0 0.375rem 0", fontSize: "0.875rem", fontWeight: 600, color: "#fca5a5" }}>
          Synchronisation failure
        </h3>
        <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--text-muted)" }}>
          {error}
        </p>
      </div>
    );
  }
  
  return null;
};

