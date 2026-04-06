import { useState } from "react";
import { MetricCharts } from "./components/MetricCharts";
import { AlertTable } from "./components/AlertTable";
import { StatusPanel } from "./components/StatusPanel";
import { LoadingError } from "./components/LoadingError";
import { ServerRack } from "./components/ServerRack";
import { useDashboardData } from "./hooks/useDashboardData";

function App() {
  const {
    metrics,
    alerts,
    lineData,
    alertBySeverity,
    loading,
    error,
    paused,
    setPaused,
  } = useDashboardData();

  const [selectedAlert, setSelectedAlert] = useState(null);
  const [server, setServer] = useState("ALL");

  const avg = (arr, key) =>
    arr.length
      ? (arr.reduce((sum, m) => sum + (m[key] || 0), 0) / arr.length).toFixed(1)
      : 0;

  const filteredMetrics =
    server === "ALL" ? metrics : metrics.filter((m) => m.serverId === server);

  const maxPower = filteredMetrics.length
    ? Math.max(...filteredMetrics.map((m) => m.power || 0))
    : 0;

  const filteredLineData =
    server === "ALL"
      ? lineData
      : lineData.filter((_, i) => {
        const m = metrics[i];
        return m?.serverId === server;
      });

  const filteredAlerts =
    server === "ALL" ? alerts : alerts.filter((a) => a.serverId === server);

  return (
    <div style={{ padding: "2rem", maxWidth: "1600px", margin: "0 auto", width: "100%" }}>
      <header style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ margin: "0 0 0.5rem 0", fontSize: "1.875rem", fontWeight: 600 }}>
            System Dashboard
          </h1>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Monitor cluster metrics and predictive ML anomalies
          </p>
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button
            onClick={() => setPaused((p) => !p)}
            className="btn"
            style={paused ? { borderColor: "var(--color-danger)", color: "var(--color-danger)" } : {}}
          >
            {paused ? "Paused" : "Live"}
          </button>
        </div>
      </header>

      <LoadingError loading={loading} error={error} />

      {!loading && !error && (
        <div>
          {filteredAlerts.length > 0 && (
            <div
              className="panel"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                borderColor: "var(--color-danger)",
                padding: "1rem",
                marginBottom: "2rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <div style={{ color: "var(--color-danger)", fontWeight: 600 }}>
                {filteredAlerts.length} active alerts detected within cluster
              </div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2.5fr", gap: "1.5rem", marginBottom: "2rem" }}>
            <ServerRack
              servers={["S1", "S2", "S3"]}
              metrics={metrics}
              alerts={alerts}
              selectedServer={server}
              onSelect={setServer}
            />

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1fr 1fr",
              gap: "1.5rem",
            }}>
              <div className="panel" style={{ padding: "1.5rem" }}>
                <div style={{ color: "var(--text-muted)", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.75rem" }}>CPU Load (Avg)</div>
                <div style={{ fontSize: "2rem", fontWeight: 600 }}>
                  {avg(filteredMetrics, "cpu")}<span style={{ fontSize: "1rem", color: "var(--text-muted)", marginLeft: "0.25rem" }}>%</span>
                </div>
              </div>

              <div className="panel" style={{ padding: "1.5rem" }}>
                <div style={{ color: "var(--text-muted)", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.75rem" }}>Memory Usage (Avg)</div>
                <div style={{ fontSize: "2rem", fontWeight: 600 }}>
                  {avg(filteredMetrics, "memory")}<span style={{ fontSize: "1rem", color: "var(--text-muted)", marginLeft: "0.25rem" }}>%</span>
                </div>
              </div>

              <div className="panel" style={{ padding: "1.5rem" }}>
                <div style={{ color: "var(--text-muted)", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.75rem" }}>Peak Power</div>
                <div style={{ fontSize: "2rem", fontWeight: 600 }}>
                  {maxPower}<span style={{ fontSize: "1rem", color: "var(--text-muted)", marginLeft: "0.25rem" }}>W</span>
                </div>
              </div>

              <div className="panel" style={{ padding: "1.5rem" }}>
                <div style={{ color: "var(--text-muted)", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.75rem" }}>Total Alerts</div>
                <div style={{ fontSize: "2rem", fontWeight: 600, color: filteredAlerts.length > 0 ? "var(--color-danger)" : "var(--text-main)" }}>
                  {filteredAlerts.length}
                </div>
              </div>
            </div>
          </div>

          <MetricCharts
            lineData={filteredLineData}
            alerts={filteredAlerts}
            selectedAlert={selectedAlert}
          />

          <div style={{ marginTop: "2rem" }}>
            <AlertTable alerts={filteredAlerts} onSelect={setSelectedAlert} />
          </div>

          <StatusPanel
            metricsCount={filteredMetrics.length}
            alertsCount={filteredAlerts.length}
          />
        </div>
      )}
    </div>
  );
}

export default App;