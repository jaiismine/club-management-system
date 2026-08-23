import { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import Card from "../components/Card.jsx";
import { apiFetch, formatDate, venueName } from "../api/api.js";
import "./Landing.css";

export default function StudentDashboard() {
  const [events, setEvents] = useState([]);
  const [registered, setRegistered] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/events")
      .then(setEvents)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleRegister = async (eventId) => {
    try {
      await apiFetch("/registrations", {
        method: "POST",
        body: JSON.stringify({ eventId }),
      });
      setRegistered((prev) => new Set([...prev, eventId]));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <Layout title="Student Dashboard">
        <p className="page-subtitle">Loading events...</p>
      </Layout>
    );
  }

  return (
    <Layout title="Student Dashboard">
      <p className="page-subtitle">Browse approved events and register.</p>
      {error && <p style={{ color: "var(--red)", marginBottom: "1rem" }}>{error}</p>}

      <section className="dashboard-section">
        <h2>Approved Events</h2>
        <div className="grid-2">
          {events.map((event) => (
            <Card key={event._id} title={event.title}>
              <div className="detail-row">
                <span>Date</span>
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="detail-row">
                <span>Time</span>
                <span>{event.time}</span>
              </div>
              <div className="detail-row">
                <span>Venue</span>
                <span>{venueName(event.venue)}</span>
              </div>
              <div className="detail-row">
                <span>Club</span>
                <span>{event.clubName}</span>
              </div>
              <p
                style={{
                  marginTop: "0.75rem",
                  fontSize: "0.875rem",
                  color: "var(--gray-600)",
                }}
              >
                {event.description}
              </p>
              <button
                className="btn btn-primary btn-sm"
                style={{ marginTop: "1rem" }}
                onClick={() => handleRegister(event._id)}
                disabled={registered.has(event._id)}
              >
                {registered.has(event._id) ? "Registered" : "Register"}
              </button>
            </Card>
          ))}
        </div>
        {events.length === 0 && (
          <Card>
            <p className="empty-state">No approved events available right now.</p>
          </Card>
        )}
      </section>
    </Layout>
  );
}
