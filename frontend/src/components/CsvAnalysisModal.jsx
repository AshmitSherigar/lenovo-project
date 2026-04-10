import { useState, useRef, useCallback } from "react";
import { postMetric } from "../api";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { MetricCharts } from "./MetricCharts";
import { AlertTable } from "./AlertTable";

const POWER_HIGH = 200;
const CPU_HIGH = 75;
const MEM_HIGH = 80;
const CPU_LOW = 30;
const MEM_LOW = 40;

function checkSeverity({ cpu, memory, power }) {
  const reasons = [];

  if (power > POWER_HIGH)
    reasons.push({
      text: `Power consumption of ${power.toFixed(2)}W exceeds normal operating limits`,
      severity: "high",
    });
  if (memory > 85)
    reasons.push({
      text: `Memory usage at ${memory.toFixed(2)}% requires immediate attention`,
      severity: "high",
    });
  if (cpu < 30 && power > 150)
    reasons.push({
      text: `Energy inefficiency detected: low CPU utilization (${cpu.toFixed(2)}%) with high power draw (${power.toFixed(2)}W)`,
      severity: "medium",
    });
  if (cpu > CPU_HIGH)
    reasons.push({
      text: `CPU utilization has reached ${cpu.toFixed(2)}%`,
      severity: "medium",
    });
  if (memory > MEM_HIGH)
    reasons.push({
      text: `Memory consumption is elevated at ${memory.toFixed(2)}%`,
      severity: "medium",
    });

  if (reasons.length === 0)
    return {
      severity: "normal",
      reasons: [
        {
          text: "All resource metrics are within optimal range",
          severity: "normal",
        },
      ],
    };

  const topSeverity = reasons.some((r) => r.severity === "high")
    ? "high"
    : "medium";
  return { severity: topSeverity, reasons };
}

const sevColor = {
  high: { bg: "rgba(239,68,68,0.15)", color: "#fca5a5", border: "#7f1d1d" },
  medium: { bg: "rgba(245,158,11,0.15)", color: "#fcd34d", border: "#78350f" },
  normal: { bg: "rgba(16,185,129,0.15)", color: "#6ee7b7", border: "#065f46" },
};

export const CsvAnalysisModal = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState("upload");
  const [parseError, setParseError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const [manualInput, setManualInput] = useState({
    serverId: "",
    cpu: "",
    memory: "",
    power: "",
  });
  const [manualResult, setManualResult] = useState(null);

  const [apiResult, setApiResult] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [uploadResult, setUploadResult] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [localMetrics, setLocalMetrics] = useState([]);
  const [localAlerts, setLocalAlerts] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFile = useCallback(async (file) => {
    if (!file) return;

    setParseError(null);
    setUploadError(null);
    setUploadResult(null);
    setUploading(true);

    const processData = async (data) => {
      const payload = data.map((row) => ({
        serverId: row.Server_ID ?? row.serverId ?? row.server_id,
        cpu: Number(row["CPU_Utilization_%"] ?? row.cpu),
        memory: Number(row["Memory_Utilization_%"] ?? row.memory),
        power: Number(row.Power_Usage_Watts ?? row.power),
        timestamp: row.Timestamp ?? row.timestamp ?? new Date().toISOString(),
      }));

      const detectedAlerts = [];
      payload.forEach((item) => {
        const analysis = checkSeverity(item);
        if (analysis.severity !== "normal") {
          analysis.reasons.forEach((reason) => {
            detectedAlerts.push({
              serverId: item.serverId,
              message: reason.text,
              severity: reason.severity,
              timestamp: item.timestamp,
            });
          });
        }
      });

      setLocalMetrics(payload.map((d) => ({ ...d, time: d.timestamp })));
      setLocalAlerts(detectedAlerts);
      setIsAnalyzing(true);
      setUploading(false);
    };

    if (file.name.endsWith(".csv")) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (result) => {
          try {
            await processData(result.data);
          } catch (err) {
            setUploadError(err.message);
            setUploading(false);
          }
        },
        error: (err) => {
          setParseError(err.message);
          setUploading(false);
        },
      });
    } else {
      const reader = new FileReader();
      reader.onload = async ({ target }) => {
        try {
          const workbook = XLSX.read(target.result, { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
          await processData(rows);
        } catch (err) {
          setUploadError(err.message);
          setUploading(false);
        }
      };
      reader.onerror = () => {
        setUploadError("File reading failed");
        setUploading(false);
      };
      reader.readAsArrayBuffer(file);
    }
  }, []);

  const handleManualCheck = async () => {
    const cpu = Number(manualInput.cpu);
    const memory = Number(manualInput.memory);
    const power = Number(manualInput.power);

    if (isNaN(cpu) || isNaN(memory) || isNaN(power)) {
      setManualResult({
        severity: "error",
        reasons: [
          { text: "Input must contain numerical values", severity: "error" },
        ],
      });
      return;
    }

    setSubmitting(true);
    try {
      const analysis = checkSeverity({ cpu, memory, power });
      setManualResult(analysis);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsAnalyzing(false);
    setLocalMetrics([]);
    setLocalAlerts([]);
    setUploadResult(null);
    setUploadError(null);
    setParseError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            backgroundColor: "var(--bg-card)",
            zIndex: 10,
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600 }}>
              Operational Insight Analytics
            </h2>
            <p
              style={{
                margin: "0.25rem 0 0",
                fontSize: "0.8125rem",
                color: "var(--text-muted)",
              }}
            >
              Evaluate infrastructure performance
            </p>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button
              className="btn"
              onClick={onClose}
              style={{ padding: "0.4rem 0.875rem", fontSize: "0.75rem" }}
            >
              Close
            </button>
          </div>
        </div>

        <div className="tab-bar">
          <button
            className={`tab-btn ${mode === "upload" ? "active" : ""}`}
            onClick={() => setMode("upload")}
          >
            File Processing
          </button>
          <button
            className={`tab-btn ${mode === "manual" ? "active" : ""}`}
            onClick={() => setMode("manual")}
          >
            Direct Input
          </button>
        </div>

        <div style={{ padding: "1.5rem" }}>
          {isAnalyzing ? (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "var(--text-main)",
                    }}
                  >
                    Analysis Results
                  </h3>
                  <p
                    style={{
                      margin: "0.25rem 0 0",
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    Viewing local analysis for {localMetrics.length} records and{" "}
                    {localAlerts.length} detected incidents.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button className="btn" onClick={handleReset}>
                    Analyze New File
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                <MetricCharts
                  lineData={localMetrics}
                  alerts={localAlerts}
                  selectedAlert={null}
                />
                <AlertTable alerts={localAlerts} onSelect={() => {}} />
              </div>
            </div>
          ) : (
            <>
              {mode === "upload" && (
                <>
                  <div
                    className={`drag-zone ${dragOver ? "drag-over" : ""}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      handleFile(e.dataTransfer.files[0]);
                    }}
                    onClick={() => fileRef.current?.click()}
                  >
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      style={{ display: "none" }}
                      onChange={(e) => handleFile(e.target.files[0])}
                    />
                    <div>
                      {uploading ? "Processing data..." : "Select or drop file"}
                    </div>
                  </div>

                  {parseError && (
                    <div style={{ marginTop: "1rem", color: "red" }}>
                      {parseError}
                    </div>
                  )}
                  {uploadError && (
                    <div style={{ marginTop: "1rem", color: "red" }}>
                      {uploadError}
                    </div>
                  )}
                </>
              )}

              {mode === "manual" && (
                <>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                    }}
                  >
                    <input
                      className="input-field"
                      placeholder="Server ID"
                      value={manualInput.serverId}
                      onChange={(e) =>
                        setManualInput((p) => ({
                          ...p,
                          serverId: e.target.value,
                        }))
                      }
                    />
                    <input
                      className="input-field"
                      type="number"
                      placeholder="CPU %"
                      value={manualInput.cpu}
                      onChange={(e) =>
                        setManualInput((p) => ({ ...p, cpu: e.target.value }))
                      }
                    />
                    <input
                      className="input-field"
                      type="number"
                      placeholder="Memory %"
                      value={manualInput.memory}
                      onChange={(e) =>
                        setManualInput((p) => ({
                          ...p,
                          memory: e.target.value,
                        }))
                      }
                    />
                    <input
                      className="input-field"
                      type="number"
                      placeholder="Power (W)"
                      value={manualInput.power}
                      onChange={(e) =>
                        setManualInput((p) => ({ ...p, power: e.target.value }))
                      }
                    />
                  </div>

                  <button
                    className="btn btn-primary"
                    style={{ marginTop: "1rem", width: "100%" }}
                    onClick={handleManualCheck}
                  >
                    {submitting ? "Processing..." : "Perform Diagnostic Review"}
                  </button>

                  {manualResult && (
                    <div
                      style={{
                        marginTop: "1rem",
                        padding: "1rem",
                        borderRadius: "8px",
                        backgroundColor: sevColor[manualResult.severity]?.bg,
                        border: `1px solid ${sevColor[manualResult.severity]?.border}`,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 600,
                          marginBottom: "0.5rem",
                          color: sevColor[manualResult.severity]?.color,
                        }}
                      >
                        Diagnostic Result: {manualResult.severity.toUpperCase()}
                      </div>
                      {manualResult.reasons.map((r, i) => (
                        <div key={i} style={{ fontSize: "0.875rem" }}>
                          • {r.text}
                        </div>
                      ))}
                    </div>
                  )}

                  {apiError && (
                    <div style={{ marginTop: "1rem", color: "red" }}>
                      {apiError}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
