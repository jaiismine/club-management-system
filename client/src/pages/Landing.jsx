import { Link } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  return (
    <div className="landing">
      <header className="landing-header">
        <div className="container">
          <span className="landing-brand">Club Management System</span>
          <Link to="/login" className="btn btn-outline btn-sm">
            Login
          </Link>
        </div>
      </header>

      <section className="landing-hero">
        <div className="container">
          <h1>Manage campus club events in one place</h1>
          <Link to="/login" className="btn btn-primary">
            Sign In
          </Link>
        </div>
      </section>
    </div>
  );
}
