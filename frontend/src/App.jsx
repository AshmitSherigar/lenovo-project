import { useState } from "react";
import { MetricCharts } from "./components/MetricCharts";
import { AlertTable } from "./components/AlertTable";
import { StatusPanel } from "./components/StatusPanel";
import { LoadingError } from "./components/LoadingError";
import { ServerRack } from "./components/ServerRack";
import { CsvAnalysisModal } from "./components/CsvAnalysisModal";
import { useDashboardData } from "./hooks/useDashboardData";
import { toast } from "sonner";

function App() {
  const { metrics, alerts, lineData, loading, error } = useDashboardData();

  const [selectedAlert, setSelectedAlert] = useState(null);
  const [server, setServer] = useState("ALL");
  const [showCsvModal, setShowCsvModal] = useState(false);

  const avg = (arr, key) =>
    arr.length
      ? (arr.reduce((sum, m) => sum + (m[key] || 0), 0) / arr.length).toFixed(2)
      : "0.00";

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
    <div
      style={{
        padding: "2rem",
        maxWidth: "1600px",
        margin: "0 auto",
        width: "100%",
      }}
    >
      <header
        style={{
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div>
            <h1
              style={{
                margin: "0 0 0.125rem 0",
                fontSize: "1.75rem",
                fontWeight: 700,
                letterSpacing: "-0.025em",
              }}
            >
              System Dashboard
            </h1>
          </div>
          <button
            className="btn"
            onClick={() => setShowCsvModal(true)}
            style={{ marginTop: "0.25rem" }}
          >
            Analyze CSV Data
          </button>
          <button
            className="btn"
            onClick={() => toast.dismiss()}
            style={{ marginTop: "0.25rem", color: "var(--text-muted)" }}
          >
            Clear Notifications
          </button>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        </div>
      </header>

      <LoadingError loading={loading} error={error} />

      {!loading && !error && (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2.5fr",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            <ServerRack
              servers={["S1", "S2", "S3"]}
              metrics={metrics}
              alerts={alerts}
              selectedServer={server}
              onSelect={setServer}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridTemplateRows: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div className="stat-card">
                <div
                  style={{
                    color: "var(--text-dim)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    marginBottom: "0.625rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  CPU Load
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    letterSpacing: "-0.025em",
                  }}
                >
                  {avg(filteredMetrics, "cpu")}
                  <span
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--text-dim)",
                      marginLeft: "0.125rem",
                      fontWeight: 500,
                    }}
                  >
                    %
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "0.6875rem",
                    color: "var(--text-dim)",
                    marginTop: "0.25rem",
                  }}
                >
                  Average across{" "}
                  {filteredMetrics.length > 0
                    ? server === "ALL"
                      ? "cluster nodes"
                      : `server ${server}`
                    : "—"}
                </div>
              </div>

              <div className="stat-card">
                <div
                  style={{
                    color: "var(--text-dim)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    marginBottom: "0.625rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Memory Usage
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    letterSpacing: "-0.025em",
                  }}
                >
                  {avg(filteredMetrics, "memory")}
                  <span
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--text-dim)",
                      marginLeft: "0.125rem",
                      fontWeight: 500,
                    }}
                  >
                    %
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "0.6875rem",
                    color: "var(--text-dim)",
                    marginTop: "0.25rem",
                  }}
                >
                  Average utilization statistics
                </div>
              </div>

              <div className="stat-card">
                <div
                  style={{
                    color: "var(--text-dim)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    marginBottom: "0.625rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Peak Power
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    letterSpacing: "-0.025em",
                  }}
                >
                  {maxPower}
                  <span
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--text-dim)",
                      marginLeft: "0.125rem",
                      fontWeight: 500,
                    }}
                  >
                    W
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "0.6875rem",
                    color: "var(--text-dim)",
                    marginTop: "0.25rem",
                  }}
                >
                  Highest recorded consumption
                </div>
              </div>

              <div className="stat-card">
                <div
                  style={{
                    color: "var(--text-dim)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    marginBottom: "0.625rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Active Alerts
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    letterSpacing: "-0.025em",
                    color:
                      filteredAlerts.length > 0
                        ? "var(--color-danger)"
                        : "var(--text-main)",
                  }}
                >
                  {filteredAlerts.length}
                </div>
                <div
                  style={{
                    fontSize: "0.6875rem",
                    color: "var(--text-dim)",
                    marginTop: "0.25rem",
                  }}
                >
                  Detections requiring attention
                </div>
              </div>
            </div>
          </div>

          <MetricCharts
            lineData={filteredLineData}
            alerts={filteredAlerts}
            selectedAlert={selectedAlert}
          />

          <div style={{ marginTop: "1.5rem" }}>
            <AlertTable alerts={filteredAlerts} onSelect={setSelectedAlert} />
          </div>
        </div>
      )}

      <CsvAnalysisModal
        isOpen={showCsvModal}
        onClose={() => setShowCsvModal(false)}
      />
    </div>
  );
}

export default App;
