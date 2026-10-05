import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createIncident } from "../api";

const ATTACK_TYPES = ["Brute Force", "SQL Injection", "Malware", "DDoS", "Port Scan", "Phishing"];

function CreateIncident() {
  const [sourceIp, setSourceIp] = useState("");
  const [attackType, setAttackType] = useState("Brute Force");
  const [failedAttempts, setFailedAttempts] = useState("");
  const [targetAsset, setTargetAsset] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await createIncident({
        sourceIp,
        attackType,
        failedAttempts: failedAttempts ? parseInt(failedAttempts, 10) : null,
        targetAsset: targetAsset || null,
      });
      navigate(`/incidents/${res.data.id}`);
    } catch (err) {
      setError("Could not create incident. Check that all servers are running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Report New Incident</h1>
        <button style={styles.backButton} onClick={() => navigate("/incidents")}>
          Back to List
        </button>
      </div>

      <form style={styles.card} onSubmit={handleSubmit}>
        {error && <div style={styles.error}>{error}</div>}

        <label style={styles.label}>Source IP</label>
        <input
          style={styles.input}
          type="text"
          value={sourceIp}
          onChange={(e) => setSourceIp(e.target.value)}
          placeholder="e.g. 192.168.1.20"
          required
        />

        <label style={styles.label}>Attack Type</label>
        <select
          style={styles.input}
          value={attackType}
          onChange={(e) => setAttackType(e.target.value)}
        >
          {ATTACK_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <label style={styles.label}>Failed Attempts (optional)</label>
        <input
          style={styles.input}
          type="number"
          value={failedAttempts}
          onChange={(e) => setFailedAttempts(e.target.value)}
          placeholder="e.g. 15"
        />

        <label style={styles.label}>Target Asset (optional)</label>
        <input
          style={styles.input}
          type="text"
          value={targetAsset}
          onChange={(e) => setTargetAsset(e.target.value)}
          placeholder="e.g. Admin Account"
        />

        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? "Analyzing with AI engine..." : "Submit Incident"}
        </button>
      </form>
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
  backButton: {
    padding: "10px 18px",
    borderRadius: "6px",
    border: "1px solid #566573",
    backgroundColor: "transparent",
    color: "#D5DBDB",
    cursor: "pointer",
    fontSize: "14px",
  },
  card: {
    backgroundColor: "#2C3E50",
    borderRadius: "10px",
    padding: "28px",
    maxWidth: "480px",
  },
  error: {
    backgroundColor: "#943126",
    color: "white",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "13px",
    marginBottom: "16px",
  },
  label: { color: "#D5DBDB", fontSize: "13px", marginBottom: "6px", display: "block" },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "16px",
    borderRadius: "6px",
    border: "1px solid #566573",
    backgroundColor: "#1B2631",
    color: "white",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#2E86C1",
    color: "white",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "8px",
  },
};

export default CreateIncident;