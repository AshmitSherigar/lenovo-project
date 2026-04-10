export const LoadingError = ({ loading, error, title }) => {
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
    const displayTitle = title || (typeof error === 'object' ? error.title : "Connection lost");
    const displayMessage = typeof error === 'object' ? error.message : error;

    return (
      <div className="error-view-container">
        <div className="error-view-content">
          <h2 className="error-title">{displayTitle}</h2>
          <p className="error-message">
            {displayMessage || "We're having trouble completing this request. Please check your connection or try again."}
          </p>
        </div>
      </div>
    );
  }
  
  return null;
};
