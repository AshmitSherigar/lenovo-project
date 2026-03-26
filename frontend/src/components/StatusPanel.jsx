export const StatusPanel = ({ metricsCount = 0, alertsCount = 0 }) => (
  <section
    style={{
      marginTop: "1rem",
      padding: "1rem",
      borderRadius: 14,
      background: "#0f1e46",
      boxShadow: "0 10px 30px rgba(0,0,0,.5)",
    }}
  >
    <h2 style={{ color: "#c6d3ff" }}>Status</h2>
    <p style={{ margin: 0, color: "#b0c0e8" }}>
      Metrics points tracked: <strong>{metricsCount}</strong>, alerts tracked:{" "}
      <strong>{alertsCount}</strong>.
    </p>
  </section>
);
