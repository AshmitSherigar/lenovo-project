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
} from "recharts";

const severityColors = {
  high: "#ff4c60",
  medium: "#ffb74d",
  low: "#42a5f5",
  unknown: "#9e9e9e",
};

export const MetricCharts = ({ lineData, alertBySeverity }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
      gap: "1rem",
      marginBottom: "1rem",
    }}
  >
    <section
      style={{
        background: "#12214b",
        borderRadius: 14,
        padding: "1rem",
        boxShadow: "0 10px 30px rgba(0,0,0,.5)",
      }}
    >
      <h2 style={{ marginTop: 0, color: "#c6d3ff" }}>Resource Trends</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a3c75" />
          <XAxis dataKey="time" stroke="#aab9ff" minTickGap={20} />
          <YAxis stroke="#aab9ff" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="cpu"
            stroke="#40c1ff"
            strokeWidth={2.5}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="memory"
            stroke="#ffb65d"
            strokeWidth={2.5}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="power"
            stroke="#8adf8a"
            strokeWidth={2.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </section>

    <section
      style={{
        background: "#12214b",
        borderRadius: 14,
        padding: "1rem",
        boxShadow: "0 10px 30px rgba(0,0,0,.5)",
      }}
    >
      <h2 style={{ marginTop: 0, color: "#c6d3ff" }}>
        Alert Severity Distribution
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={alertBySeverity}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label
          >
            {alertBySeverity.map((entry, idx) => (
              <Cell
                key={`cell-${idx}`}
                fill={severityColors[entry.name] || "#8884d8"}
              />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </section>
  </div>
);
