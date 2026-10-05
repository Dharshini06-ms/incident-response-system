import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getAllIncidents } from "../api";

const SEVERITY_COLORS = {
  CRITICAL: "#C0392B",
  HIGH: "#E67E22",
  MEDIUM: "#F1C40F",
  LOW: "#27AE60",
};

function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Analyst";

  useEffect(() => {
    getAllIncidents()
      .then((res) => {
        setIncidents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Could not load incidents. Is the backend running?");
        setLoading(false);
        console.error(err);
      });
  }, []);

  const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  incidents.forEach((i) => {
    if (i.severity && counts[i.severity] !== undefined) {
      counts[i.severity]++;
    }
  });

  const chartData = Object.entries(counts)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({ name, value }));

  const openCount = incidents.filter((i) => i.status === "OPEN").length;

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Security Dashboard</h1>
          <p style={styles.welcome}>Welcome, {username}</p>
        </div>
        <div>
          <button style={styles.navButton} onClick={() => navigate("/incidents")}>
            View All Incidents
          </button>
          <button style={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {loading && <p style={styles.message}>Loading...</p>}
      {error && <p style={{ ...styles.message, color: "#E74C3C" }}>{error}</p>}

      {!loading && !error && (
        <>
          <div style={styles.cardsRow}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{incidents.length}</div>
              <div style={styles.statLabel}>Total Incidents</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{openCount}</div>
              <div style={styles.statLabel}>Open</div>
            </div>
            {Object.entries(counts).map(([sev, count]) => (
              <div key={sev} style={{ ...styles.statCard, borderTop: `4px solid ${SEVERITY_COLORS[sev]}` }}>
                <div style={styles.statNumber}>{count}</div>
                <div style={styles.statLabel}>{sev}</div>
              </div>
            ))}
          </div>

          <div style={styles.chartContainer}>
            <h3 style={styles.chartTitle}>Severity Distribution</h3>
            {chartData.length === 0 ? (
              <p style={styles.message}>No incidents yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label
                  >
                    {chartData.map((entry) => (
                      <Cell key={entry.name} fill={SEVERITY_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "#1B2631",
    minHeight: "100vh",
    padding: "32px",
    fontFamily: "Segoe UI, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
  },
  title: { color: "white", fontSize: "26px", margin: 0 },
  welcome: { color: "#AEB6BF", fontSize: "13px", marginTop: "4px" },
  navButton: {
    padding: "10px 18px",
    marginRight: "10px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#2E86C1",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
  },
  logoutButton: {
    padding: "10px 18px",
    borderRadius: "6px",
    border: "1px solid #566573",
    backgroundColor: "transparent",
    color: "#D5DBDB",
    cursor: "pointer",
    fontSize: "14px",
  },
  message: { color: "#AEB6BF", fontSize: "15px" },
  cardsRow: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "32px",
  },
  statCard: {
    backgroundColor: "#2C3E50",
    borderRadius: "10px",
    padding: "20px 28px",
    minWidth: "120px",
    textAlign: "center",
  },
  statNumber: { color: "white", fontSize: "28px", fontWeight: "bold" },
  statLabel: { color: "#AEB6BF", fontSize: "13px", marginTop: "4px" },
  chartContainer: {
    backgroundColor: "#2C3E50",
    borderRadius: "10px",
    padding: "24px",
  },
  chartTitle: { color: "white", marginTop: 0, marginBottom: "16px" },
};

export default Dashboard;