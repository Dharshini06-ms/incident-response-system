import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await registerUser(username, password);
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError("Username already exists");
      } else {
        setError("Could not reach server. Is the backend running?");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleRegister}>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Register as Security Analyst</p>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <label style={styles.label}>Username</label>
        <input
          style={styles.input}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username"
        />

        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Choose a password"
        />

        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>

        <p style={styles.loginText}>
          Already have an account?{" "}
          <Link to="/" style={styles.link}>
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#1B2631",
  },
  card: {
    backgroundColor: "#2C3E50",
    padding: "40px",
    borderRadius: "12px",
    width: "320px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
  },
  title: { color: "white", fontSize: "20px", marginBottom: "4px", textAlign: "center" },
  subtitle: { color: "#AEB6BF", fontSize: "13px", marginBottom: "20px", textAlign: "center" },
  error: {
    backgroundColor: "#943126",
    color: "white",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "13px",
    marginBottom: "16px",
    textAlign: "center",
  },
  success: {
    backgroundColor: "#1E8449",
    color: "white",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "13px",
    marginBottom: "16px",
    textAlign: "center",
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
    backgroundColor: "#27AE60",
    color: "white",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "8px",
  },
  loginText: { color: "#AEB6BF", fontSize: "13px", textAlign: "center", marginTop: "16px" },
  link: { color: "#5DADE2" },
};

export default Register;