export const LoadingError = ({ loading, error }) => {
  if (loading) {
    return <div style={{ color: "#b5c3e6" }}>Loading dashboard data…</div>;
  }
  if (error) {
    return (
      <div
        style={{
          marginBottom: "1rem",
          padding: "0.8rem",
          background: "#5c2121",
          color: "#fff",
          borderRadius: 8,
        }}
      >
        Error: {error}
      </div>
    );
  }
  return null;
};
