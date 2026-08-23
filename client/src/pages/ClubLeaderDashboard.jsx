import { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import Card from "../components/Card.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { apiFetch, formatDate, venueName } from "../api/api.js";
import "./Landing.css";

function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}

const emptyForm = {
  title: "",
  description: "",
  date: "",
  time: "",
  venue: "",
  requirements: "",
};

export default function ClubLeaderDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [pointers, setPointers] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      const [eventsData, venuesData] = await Promise.all([
        apiFetch("/events"),
        apiFetch("/venues"),
      ]);
      setEvents(eventsData);
      setVenues(venuesData);

      if (user?.clubName) {
        const ptr = await apiFetch(
          `/meeting-pointers/latest/${encodeURIComponent(user.clubName)}`
        );
        setPointers(ptr);
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.clubName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      await apiFetch("/events", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setForm(emptyForm);
      setMessage("Proposal submitted successfully.");
      await loadData();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Club Leader Dashboard">
        <p className="page-subtitle">Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout title="Club Leader Dashboard">
      <p className="page-subtitle">
        {user?.clubName} — manage proposals and view updates.
      </p>
      {message && (
        <p style={{ color: "var(--gray-600)", marginBottom: "1rem" }}>{message}</p>
      )}

      <div className="grid-3" style={{ marginBottom: "2rem" }}>
        <Card className="card-stat">
          <div className="stat-value">{events.length}</div>
          <div className="stat-label">My Proposals</div>
        </Card>
        <Card className="card-stat">
          <div className="stat-value">
            {events.filter((e) => e.status === "pending").length}
          </div>
          <div className="stat-label">Pending</div>
        </Card>
        <Card className="card-stat">
          <div className="stat-value">
            {venues.filter((v) => v.isActive).length}
          </div>
          <div className="stat-label">Venues Available</div>
        </Card>
      </div>

      <section className="dashboard-section">
        <h2>Create Event Proposal</h2>
        <Card>
          <form className="form-inline" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Event Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter event title"
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the event"
                required
              />
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Venue</label>
              <select
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                required
              >
                <option value="">Select venue</option>
                {venues.map((v) => (
                  <option key={v._id} value={v._id} disabled={!v.isActive}>
                    {v.name} {!v.isActive ? "(Unavailable)" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Requirements</label>
              <input
                type="text"
                value={form.requirements}
                onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                placeholder="Equipment, setup needs"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Proposal"}
            </button>
          </form>
        </Card>
      </section>

      <section className="dashboard-section">
        <h2>My Proposals</h2>
        <Card>
          {events.map((event) => (
            <div key={event._id} className="list-item">
              <div className="list-item-info">
                <h4>{event.title}</h4>
                <p>
                  {formatDate(event.date)} · {venueName(event.venue)}
                </p>
              </div>
              <StatusBadge status={event.status} />
            </div>
          ))}
          {events.length === 0 && (
            <p className="empty-state">No proposals submitted yet.</p>
          )}
        </Card>
      </section>

      <section className="dashboard-section">
        <h2>Venue Availability</h2>
        <div className="grid-2">
          {venues.map((venue) => (
            <Card key={venue._id} title={venue.name}>
              <div className="detail-row">
                <span>Capacity</span>
                <span>{venue.capacity}</span>
              </div>
              <div className="detail-row">
                <span>Status</span>
                <span>{venue.isActive ? "Available" : "Unavailable"}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Latest Meeting Pointers</h2>
        <Card>
          {pointers?.pointers?.length ? (
            <ol className="pointer-list">
              {pointers.pointers.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ol>
          ) : (
            <p className="empty-state">No meeting pointers documented yet.</p>
          )}
        </Card>
      </section>
    </Layout>
  );
}
