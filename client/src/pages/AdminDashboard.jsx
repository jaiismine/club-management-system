import { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import Card from "../components/Card.jsx";
import { apiFetch, formatDate, venueName } from "../api/api.js";
import "./Landing.css";

function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [regStats, setRegStats] = useState([]);
  const [pointerForm, setPointerForm] = useState({
    clubName: "",
    meetingDate: "",
    pointers: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      const [eventsData, venuesData, statsData] = await Promise.all([
        apiFetch("/events"),
        apiFetch("/venues"),
        apiFetch("/registrations/stats"),
      ]);
      setEvents(eventsData);
      setVenues(venuesData);
      setRegStats(statsData);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await apiFetch(`/events/${id}/approve`, { method: "PATCH" });
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await apiFetch(`/events/${id}/reject`, {
        method: "PATCH",
        body: JSON.stringify({ reason: "Rejected by admin" }),
      });
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/events/${id}/delete`, { method: "PATCH" });
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleVenue = async (id) => {
    try {
      await apiFetch(`/venues/${id}/toggle`, { method: "PATCH" });
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSavePointers = async (e) => {
    e.preventDefault();
    try {
      await apiFetch("/meeting-pointers", {
        method: "POST",
        body: JSON.stringify(pointerForm),
      });
      setMessage("Meeting pointers saved.");
      setPointerForm({ clubName: "", meetingDate: "", pointers: "" });
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <Layout title="Admin Dashboard">
        <p className="page-subtitle">Loading...</p>
      </Layout>
    );
  }

  const totalRegistrations = regStats.reduce((s, r) => s + r.count, 0);

  return (
    <Layout title="Admin Dashboard">
      <p className="page-subtitle">Review proposals, manage venues, and document meetings.</p>
      {message && <p style={{ marginBottom: "1rem", color: "var(--gray-600)" }}>{message}</p>}

      <div className="grid-3" style={{ marginBottom: "2rem" }}>
        <Card className="card-stat">
          <div className="stat-value">
            {events.filter((e) => e.status === "pending").length}
          </div>
          <div className="stat-label">Pending Review</div>
        </Card>
        <Card className="card-stat">
          <div className="stat-value">
            {events.filter((e) => e.status === "approved").length}
          </div>
          <div className="stat-label">Approved</div>
        </Card>
        <Card className="card-stat">
          <div className="stat-value">{totalRegistrations}</div>
          <div className="stat-label">Total Registrations</div>
        </Card>
      </div>

      <section className="dashboard-section">
        <h2>All Proposals</h2>
        <Card>
          {events.map((event) => (
            <div key={event._id} className="list-item">
              <div className="list-item-info">
                <h4>{event.title}</h4>
                <p>
                  {event.clubName} · {formatDate(event.date)} · {venueName(event.venue)}
                </p>
              </div>
              <div className="list-item-actions">
                <StatusBadge status={event.status} />
                {event.status === "pending" && (
                  <>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleApprove(event._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleReject(event._id)}
                    >
                      Reject
                    </button>
                  </>
                )}
                {event.status === "approved" && (
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleDelete(event._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <p className="empty-state">No proposals to review.</p>
          )}
        </Card>
      </section>

      <section className="dashboard-section">
        <h2>Event Registrations</h2>
        <Card>
          {regStats.map((reg) => (
            <div key={reg.eventId} className="list-item">
              <div className="list-item-info">
                <h4>{reg.title}</h4>
              </div>
              <span style={{ fontWeight: 600 }}>{reg.count} students</span>
            </div>
          ))}
          {regStats.length === 0 && (
            <p className="empty-state">No registrations yet.</p>
          )}
        </Card>
      </section>

      <section className="dashboard-section">
        <h2>Update Venue Availability</h2>
        <div className="grid-2">
          {venues.map((venue) => (
            <Card key={venue._id} title={venue.name}>
              <div className="detail-row">
                <span>Current Status</span>
                <span>{venue.isActive ? "Available" : "Unavailable"}</span>
              </div>
              <button
                className="btn btn-outline btn-sm"
                style={{ marginTop: "0.75rem" }}
                onClick={() => handleToggleVenue(venue._id)}
              >
                Toggle Availability
              </button>
            </Card>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Document Meeting Pointers</h2>
        <Card>
          <form className="form-inline" onSubmit={handleSavePointers}>
            <div className="form-group">
              <label>Club Name</label>
              <input
                type="text"
                value={pointerForm.clubName}
                onChange={(e) =>
                  setPointerForm({ ...pointerForm, clubName: e.target.value })
                }
                placeholder="e.g. Tech Club"
                required
              />
            </div>
            <div className="form-group">
              <label>Meeting Date</label>
              <input
                type="date"
                value={pointerForm.meetingDate}
                onChange={(e) =>
                  setPointerForm({ ...pointerForm, meetingDate: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Pointers (one per line)</label>
              <textarea
                rows={4}
                value={pointerForm.pointers}
                onChange={(e) =>
                  setPointerForm({ ...pointerForm, pointers: e.target.value })
                }
                placeholder="Enter meeting pointers..."
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Save Pointers
            </button>
          </form>
        </Card>
      </section>
    </Layout>
  );
}
