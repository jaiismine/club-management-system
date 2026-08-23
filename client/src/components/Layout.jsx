import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./Layout.css";

const ROLE_LABELS = {
  student: "Student",
  club_leader: "Club Leader",
  admin: "Admin",
  super_admin: "Super Admin",
};

export default function Layout({ children, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="container layout-header-inner">
          <Link to="/" className="layout-brand">
            Club Management
          </Link>
          {user && (
            <div className="layout-user">
              <span className="layout-user-info">
                {user.name}{" "}
                <span className="layout-role">
                  ({ROLE_LABELS[user.role]})
                </span>
              </span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="layout-main">
        <div className="container">
          {title && <h1 className="page-title">{title}</h1>}
          {children}
        </div>
      </main>
    </div>
  );
}
