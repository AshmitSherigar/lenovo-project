export const LoadingError = ({ loading, error }) => {
  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center",
        height: "50vh",
        color: "var(--text-muted)"
      }}>
        <div style={{
          width: "32px",
          height: "32px",
          border: "3px solid var(--border-color)",
          borderTop: "3px solid var(--color-primary)",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: "1rem"
        }}></div>
        <div style={{ fontSize: "0.875rem", fontWeight: 500 }}>Loading dashboard...</div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="panel" style={{
        marginTop: "2rem",
        backgroundColor: "#fef2f2",
        borderColor: "#f87171",
        color: "#991b1b"
      }}>
        <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", fontWeight: 600 }}>
          Error loading data
        </h3>
        <p style={{ margin: 0, fontSize: "0.875rem" }}>
          {error}
        </p>
      </div>
    );
  }
  
  return null;
};
