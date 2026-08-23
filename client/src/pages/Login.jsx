import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Card from "../components/Card.jsx";
import "./Landing.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const route = await login(email, password);
      navigate(route);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Card className="login-card">
        <div className="login-heading">
          <h1>Sign In</h1>
          <p>Club Management System</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <p style={{ color: "var(--red)", fontSize: "0.875rem", marginBottom: "1rem" }}>
              {error}
            </p>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@test.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password123"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <Link to="/" className="login-back">
          Back to home
        </Link>
      </Card>
    </div>
  );
}
