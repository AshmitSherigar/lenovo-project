import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ReferenceDot,
  Brush,
} from "recharts";

const severityColors = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#3b82f6",
  unknown: "#52525b",
};

const metricColors = {
  cpu: "#06b6d4",
  memory: "#6366f1",
  power: "#71717a",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: "var(--bg-elevated)",
        border: "1px solid var(--border-color)",
        borderRadius: "4px",
        padding: "0.4rem 0.75rem",
        fontSize: "0.8125rem",
      }}>
        <p style={{ margin: "0 0 0.375rem", color: "var(--text-dim)", fontSize: "0.75rem" }}>
          {label && !isNaN(new Date(label).getTime())
            ? new Date(label).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            : (label ? String(label) : "")}
        </p>
        {payload.map((entry, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", margin: "0.125rem 0" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--text-muted)" }}>
              <span style={{ width: "8px", height: "2px", borderRadius: "1px", backgroundColor: entry.stroke || entry.color || entry.payload?.fill, display: "inline-block" }}></span>
              {entry.name}
            </span>
            <span style={{ color: "var(--text-main)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
              {typeof entry.value === "number" ? entry.value.toFixed(2) : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const downsample = (data, threshold = 600) => {
  if (!data || data.length <= threshold) return data;
  const factor = Math.ceil(data.length / threshold);
  return data.filter((_, i) => i % factor === 0);
};

export const MetricCharts = ({ lineData, alerts, selectedAlert }) => {
  const [visibleMetrics, setVisibleMetrics] = useState({
    cpu: true,
    memory: true,
    power: true,
  });

  const toggleMetric = (key) => {
    setVisibleMetrics((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const processedData = useMemo(() => downsample(lineData), [lineData]);

  const anomalies = processedData
    .map((d) => (d.power > 250 || d.cpu > 85 || d.memory > 85 ? d : null))
    .filter(Boolean);

  const alertBySeverity = [
    { name: "high", value: alerts.filter((a) => a.severity === "high").length },
    {
      name: "medium",
      value: alerts.filter((a) => a.severity === "medium").length,
    },
    { name: "low", value: alerts.filter((a) => a.severity === "low").length },
  ];

  const filteredPie = alertBySeverity.filter((a) => a.value > 0);
  const totalAlerts = filteredPie.reduce((acc, curr) => acc + curr.value, 0);

  const selectedPoint = selectedAlert
    ? processedData.find((d) => d.time === selectedAlert.timestamp)
    : null;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem" }}>
      <div className="panel" style={{ padding: "1.25rem 1.25rem 0.75rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
          <div>
            <h2 style={{ margin: "0 0 0.125rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Resource Trends
            </h2>
            <p style={{ margin: 0, fontSize: "0.6875rem", color: "var(--text-dim)" }}>Historical utilization telemetry</p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {Object.keys(metricColors).map(key => (
              <button
                key={key}
                onClick={() => toggleMetric(key)}
                className={`metric-toggle ${visibleMetrics[key] ? 'active' : ''}`}
                style={{
                  borderColor: visibleMetrics[key] ? metricColors[key] : 'var(--border-color)',
                  color: visibleMetrics[key] ? 'var(--text-main)' : 'var(--text-dim)'
                }}
              >
                {key.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: "320px", width: "100%" }}>
          <ResponsiveContainer>
            <LineChart data={processedData} margin={{ top: 12, right: 8, left: -24, bottom: 0 }}>
              <CartesianGrid
                stroke="#1f1f23"
                strokeDasharray="none"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                stroke="transparent"
                minTickGap={50}
                tick={{ fill: "#52525b", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(t) => {
                  const d = new Date(t);
                  return String(d.getFullYear()) === "1970" ? "" : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }}
              />
              <YAxis
                stroke="transparent"
                tick={{ fill: "#52525b", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#27272a", strokeWidth: 1 }} />

              {visibleMetrics.cpu && (
                <Line type="monotone" dataKey="cpu" name="CPU" stroke={metricColors.cpu} strokeWidth={1} dot={false} activeDot={{ r: 2, strokeWidth: 0 }} />
              )}
              {visibleMetrics.memory && (
                <Line type="monotone" dataKey="memory" name="Memory" stroke={metricColors.memory} strokeWidth={1} dot={false} activeDot={{ r: 2, strokeWidth: 0 }} />
              )}
              {visibleMetrics.power && (
                <Line type="monotone" dataKey="power" name="Power" stroke={metricColors.power} strokeWidth={1} dot={false} activeDot={{ r: 2, strokeWidth: 0 }} />
              )}

              {anomalies.map((a, i) => (
                <ReferenceDot key={`a-${i}`} x={a.time} y={a.power} r={3} fill="#ef4444" stroke="none" />
              ))}

              {selectedPoint && (
                <ReferenceDot x={selectedPoint.time} y={selectedPoint.power} r={5} fill="#ef4444" stroke="var(--bg-card)" strokeWidth={2} />
              )}

            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel" style={{ padding: "1.25rem 1.25rem 0.75rem" }}>
        <h2 style={{ margin: "0 0 0.25rem", fontSize: "0.8125rem", fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Alert Distribution
        </h2>
        <p style={{ margin: "0 0 1rem", fontSize: "0.75rem", color: "var(--text-dim)" }}>Severity breakdown of current active alerts</p>

        <div style={{ position: "relative", height: "300px", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {filteredPie.length === 0 ? (
            <div style={{ color: "var(--text-dim)", fontSize: "0.875rem" }}>No alerts reported</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={filteredPie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  stroke="#18181b"
                  strokeWidth={2}
                >
                  {filteredPie.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={severityColors[entry.name] || "#52525b"} />
                  ))}
                </Pie>
                <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}

          {filteredPie.length > 0 && (
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: 600, color: "var(--text-main)" }}>{totalAlerts}</div>
              <div style={{ fontSize: "0.625rem", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Alerts</div>
            </div>
          )}
        </div>

        {filteredPie.length > 0 && (
          <div style={{ display: "flex", gap: "1.25rem", padding: "0.25rem 0", justifyContent: "center" }}>
            {filteredPie.map(entry => (
              <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.6875rem", color: "var(--text-dim)" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: severityColors[entry.name], display: "inline-block" }}></span>
                <span style={{ textTransform: "capitalize" }}>{entry.name}</span>
                <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>{entry.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};