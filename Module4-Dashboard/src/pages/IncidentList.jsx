import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllIncidents } from "../api";

const SEVERITY_COLORS = {
  CRITICAL: "#C0392B",
  HIGH: "#E67E22",
  MEDIUM: "#F1C40F",
  LOW: "#27AE60",
};

function IncidentList() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>All Incidents</h1>
        <div>
          <button style={styles.newButton} onClick={() => navigate("/incidents/new")}>
            + New Incident
          </button>
          <button style={styles.backButton} onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>

      {loading && <p style={styles.message}>Loading...</p>}
      {error && <p style={{ ...styles.message, color: "#E74C3C" }}>{error}</p>}

      {!loading && !error && (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Source IP</th>
                <th style={styles.th}>Attack Type</th>
                <th style={styles.th}>Severity</th>
                <th style={styles.th}>Priority</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {incidents.length === 0 ? (
                <tr>
                  <td colSpan="7" style={styles.emptyCell}>
                    No incidents yet
                  </td>
                </tr>
              ) : (
                incidents.map((incident) => (
                  <tr
                    key={incident.id}
                    style={styles.row}
                    onClick={() => navigate(`/incidents/${incident.id}`)}
                  >
                    <td style={styles.td}>{incident.id}</td>
                    <td style={styles.td}>{incident.sourceIp}</td>
                    <td style={styles.td}>{incident.attackType}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          backgroundColor: SEVERITY_COLORS[incident.severity] || "#566573",
                        }}
                      >
                        {incident.severity || "N/A"}
                      </span>
                    </td>
                    <td style={styles.td}>{incident.priority || "N/A"}</td>
                    <td style={styles.td}>{incident.status}</td>
                    <td style={styles.td}>
                      {incident.timestamp ? new Date(incident.timestamp).toLocaleString() : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
  newButton: {
    padding: "10px 18px",
    marginRight: "10px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#27AE60",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
  backButton: {
    padding: "10px 18px",
    borderRadius: "6px",
    border: "1px solid #566573",
    backgroundColor: "transparent",
    color: "#D5DBDB",
    cursor: "pointer",
    fontSize: "14px",
  },
  message: { color: "#AEB6BF", fontSize: "15px" },
  tableContainer: {
    backgroundColor: "#2C3E50",
    borderRadius: "10px",
    padding: "8px",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "14px 16px",
    color: "#AEB6BF",
    fontSize: "13px",
    borderBottom: "1px solid #3B4A5A",
  },
  td: {
    padding: "14px 16px",
    color: "white",
    fontSize: "14px",
    borderBottom: "1px solid #3B4A5A",
  },
  row: {
    cursor: "pointer",
  },
  badge: {
    padding: "4px 10px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "bold",
    color: "white",
  },
  emptyCell: {
    textAlign: "center",
    padding: "32px",
    color: "#AEB6BF",
  },
};

export default IncidentList;