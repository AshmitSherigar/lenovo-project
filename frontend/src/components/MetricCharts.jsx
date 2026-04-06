import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ReferenceDot,
} from "recharts";

const severityColors = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#3b82f6",
  unknown: "#10b981",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="panel" style={{ padding: "0.75rem 1.25rem", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)", zIndex: 100 }}>
        <p style={{ margin: "0 0 0.75rem 0", color: "var(--text-muted)", fontSize: "0.875rem", fontWeight: 500 }}>
          {label && !isNaN(new Date(label).getTime())
            ? new Date(label).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            : (label ? label.charAt(0).toUpperCase() + label.slice(1) : "")}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem", fontSize: "0.875rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ width: "12px", height: "4px", borderRadius: "2px", backgroundColor: entry.stroke || entry.color || entry.payload.fill }}></span>
                <span style={{ color: "var(--text-muted)", textTransform: "capitalize" }}>{entry.name}</span>
              </div>
              <span style={{ color: "var(--text-main)", fontWeight: 600 }}>{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const MetricCharts = ({ lineData, alerts, selectedAlert }) => {
  const anomalies = lineData
    .map((d) => (d.power > 250 || d.cpu > 85 || d.memory > 85 ? d : null))
    .filter(Boolean);

  const alertBySeverity = [
    { name: "high", value: alerts.filter((a) => a.severity === "high").length },
    { name: "medium", value: alerts.filter((a) => a.severity === "medium").length },
    { name: "low", value: alerts.filter((a) => a.severity === "low").length },
  ];

  const filteredPie = alertBySeverity.filter((a) => a.value > 0);
  const totalAlerts = filteredPie.reduce((acc, curr) => acc + curr.value, 0);

  const selectedPoint = selectedAlert ? lineData.find((d) => d.time === selectedAlert.timestamp) : null;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem" }}>
      <div className="panel" style={{ padding: "1.5rem", paddingBottom: "1rem" }}>
        <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1.25rem", fontWeight: 500, textAlign: "center", color: "var(--text-main)" }}>
          Resource Trends
        </h2>
        <div style={{ height: "340px", width: "100%" }}>
          <ResponsiveContainer>
            <LineChart data={lineData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#71717a"
                minTickGap={30}
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#3f3f46" }}
                tickFormatter={(t) => String(new Date(t).getFullYear()) === "1970" ? t : new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              />
              <YAxis
                stroke="#71717a"
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#3f3f46" }}
                tickFormatter={(val) => `${val}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#52525b", strokeWidth: 1 }} />

              <Legend
                verticalAlign="top"
                align="center"
                iconType="plainline"
                wrapperStyle={{ paddingBottom: "1.5rem" }}
              />

              <Line type="monotone" dataKey="cpu" name="CPU" stroke="#3b82f6" strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
              <Line type="monotone" dataKey="memory" name="Memory" stroke="#facc15" strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
              <Line type="monotone" dataKey="power" name="Power" stroke="#f43f5e" strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />

              {anomalies.map((a, i) => (
                <ReferenceDot key={`a-${i}`} x={a.time} y={a.power} r={4} fill="#ef4444" stroke="none" />
              ))}

              {selectedPoint && (
                <ReferenceDot x={selectedPoint.time} y={selectedPoint.power} r={7} fill="#f59e0b" stroke="var(--bg-card)" strokeWidth={2} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel" style={{ padding: "1.5rem", paddingBottom: "1rem" }}>
        <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1.25rem", fontWeight: 500, textAlign: "center", color: "var(--text-main)" }}>
          Alert Distribution
        </h2>

        <div style={{ position: "relative", height: "340px", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {filteredPie.length === 0 ? (
            <div style={{ color: "var(--text-muted)" }}>No alerts available</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <Pie
                    data={filteredPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={130}
                    stroke="#18181b"
                    strokeWidth={2}
                  >
                    {filteredPie.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={severityColors[entry.name] || "#a1a1aa"} />
                    ))}
                  </Pie>
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    content={<CustomTooltip />}
                  />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ fontSize: "0.95rem", lineHeight: "2.5rem" }}
                    formatter={(value, entry) => (
                      <span style={{ color: "var(--text-main)", marginLeft: "4px" }}>
                        <span style={{ textTransform: "capitalize" }}>{value}</span>
                        <span style={{ color: "var(--text-muted)", marginLeft: "8px", fontWeight: 600 }}>{entry.payload?.value || 0}</span>
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>

            </>
          )}
        </div>
      </div>
    </div>
  );
};