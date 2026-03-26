import { MetricCharts } from "./components/MetricCharts";
import { AlertTable } from "./components/AlertTable";
import { StatusPanel } from "./components/StatusPanel";
import { LoadingError } from "./components/LoadingError";
import { useDashboardData } from "./hooks/useDashboardData";

function App() {
  const { metrics, alerts, lineData, alertBySeverity, loading, error } =
    useDashboardData();

  return (
    <div
      style={{
        padding: "1.5rem",
        minHeight: "100vh",
        background: "linear-gradient(160deg, #0a142e, #101d3c)",
      }}
    >
      <header style={{ marginBottom: "1.2rem" }}>
        <h1 style={{ margin: 0, fontSize: "2rem", color: "#fff" }}>
          Server Metrics Dashboard
        </h1>
        <p style={{ color: "#cdd6f9" }}>
          Live metrics, historical charts, and alerts overview.
        </p>
      </header>

      <LoadingError loading={loading} error={error} />

      {!loading && !error && (
        <>
          <MetricCharts lineData={lineData} alertBySeverity={alertBySeverity} />
          <AlertTable alerts={alerts} />
          <StatusPanel
            metricsCount={metrics.length}
            alertsCount={alerts.length}
          />
        </>
      )}
    </div>
  );
}

export default App;
