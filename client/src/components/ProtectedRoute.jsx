import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const fallback = {
      student: "/dashboard/student",
      club_leader: "/dashboard/club-leader",
      admin: "/dashboard/admin",
      super_admin: "/dashboard/super-admin",
    };
    return <Navigate to={fallback[user.role]} replace />;
  }

  return children;
}
