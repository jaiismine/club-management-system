import { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import Card from "../components/Card.jsx";
import { apiFetch, formatDate, formatDateTime } from "../api/api.js";
import "./Landing.css";

export default function SuperAdminDashboard() {
  const [logs, setLogs] = useState([]);
  const [draft, setDraft] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [annForm, setAnnForm] = useState({
    title: "",
    content: "",
    targetAudience: "both",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      const [logsData, draftData, annData] = await Promise.all([
        apiFetch("/approval-logs"),
        apiFetch("/weekly-drafts/current"),
        apiFetch("/announcements"),
      ]);
      setLogs(logsData);
      setDraft(draftData);
      setAnnouncements(annData);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveDraft = async () => {
    if (!draft?._id) return;
    try {
      await apiFetch(`/weekly-drafts/${draft._id}/approve`, { method: "POST" });
      setMessage("Weekly draft approved. Events are now published.");
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await apiFetch("/announcements", {
        method: "POST",
        body: JSON.stringify(annForm),
      });
      setAnnForm({ title: "", content: "", targetAudience: "both" });
      setMessage("Announcement posted.");
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <Layout title="Super Admin Dashboard">
        <p className="page-subtitle">Loading...</p>
      </Layout>
    );
  }

  const weekLabel =
    draft?.weekStart && draft?.weekEnd
      ? `${formatDate(draft.weekStart)} – ${formatDate(draft.weekEnd)}`
      : "—";

  return (
    <Layout title="Super Admin Dashboard">
      <p className="page-subtitle">
        Audit approvals, publish weekly drafts, and post announcements.
      </p>
      {message && <p style={{ marginBottom: "1rem", color: "var(--gray-600)" }}>{message}</p>}

      <div className="grid-3" style={{ marginBottom: "2rem" }}>
        <Card className="card-stat">
          <div className="stat-value">{logs.length}</div>
          <div className="stat-label">Recent Actions</div>
        </Card>
        <Card className="card-stat">
          <div className="stat-value">{draft?.events?.length || 0}</div>
          <div className="stat-label">Draft Events</div>
        </Card>
        <Card className="card-stat">
          <div className="stat-value">{announcements.length}</div>
          <div className="stat-label">Announcements</div>
        </Card>
      </div>

      <section className="dashboard-section">
        <h2>Approval Audit Log</h2>
        <Card>
          {logs.map((log) => (
            <div key={log._id} className="list-item">
              <div className="list-item-info">
                <h4>{log.event?.title || "Event"}</h4>
                <p>
                  {log.action} by {log.performedBy?.name || "Admin"} on{" "}
                  {formatDateTime(log.createdAt)}
                </p>
              </div>
              <span
                className={`badge ${
                  log.action === "approved" || log.action === "published"
                    ? "badge-approved"
                    : "badge-rejected"
                }`}
              >
                {log.action}
              </span>
            </div>
          ))}
          {logs.length === 0 && (
            <p className="empty-state">No approval actions logged yet.</p>
          )}
        </Card>
      </section>

      <section className="dashboard-section">
        <h2>Weekly Event Draft</h2>
        <Card>
          <div className="detail-row">
            <span>Week</span>
            <span>{weekLabel}</span>
          </div>
          <div className="detail-row">
            <span>Status</span>
            <span className={`badge badge-${draft?.status || "pending"}`}>
              {draft?.status || "pending"}
            </span>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <p
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              Events in draft:
            </p>
            <ul className="role-list">
              {draft?.events?.map((e) => (
                <li key={e._id}>{e.title}</li>
              ))}
            </ul>
          </div>
          {draft?.status === "pending" && (
            <button
              className="btn btn-primary btn-sm"
              style={{ marginTop: "1rem" }}
              onClick={handleApproveDraft}
            >
              Approve Weekly Draft
            </button>
          )}
        </Card>
      </section>

      <section className="dashboard-section">
        <h2>Post Announcement</h2>
        <Card>
          <form className="form-inline" onSubmit={handlePostAnnouncement}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={annForm.title}
                onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                placeholder="Announcement title"
                required
              />
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea
                rows={3}
                value={annForm.content}
                onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })}
                placeholder="Write announcement..."
                required
              />
            </div>
            <div className="form-group">
              <label>Target Audience</label>
              <select
                value={annForm.targetAudience}
                onChange={(e) =>
                  setAnnForm({ ...annForm, targetAudience: e.target.value })
                }
              >
                <option value="both">Admins &amp; Club Leaders</option>
                <option value="admin">Admins only</option>
                <option value="club_leader">Club Leaders only</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Post Announcement
            </button>
          </form>
        </Card>
      </section>

      <section className="dashboard-section">
        <h2>Recent Announcements</h2>
        <div className="grid-2">
          {announcements.map((ann) => (
            <Card key={ann._id} title={ann.title}>
              <p style={{ fontSize: "0.875rem", color: "var(--gray-600)", marginBottom: "0.75rem" }}>
                {ann.content}
              </p>
              <div className="detail-row">
                <span>Posted</span>
                <span>{formatDate(ann.createdAt)}</span>
              </div>
              <div className="detail-row">
                <span>Audience</span>
                <span>{ann.targetAudience.join(", ")}</span>
              </div>
            </Card>
          ))}
          {announcements.length === 0 && (
            <Card>
              <p className="empty-state">No announcements yet.</p>
            </Card>
          )}
        </div>
      </section>
    </Layout>
  );
}
