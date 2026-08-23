import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import ClubLeaderDashboard from "./pages/ClubLeaderDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import SuperAdminDashboard from "./pages/SuperAdminDashboard.jsx";

function HomeRedirect() {
  const { user, ROLE_ROUTES } = useAuth();
  if (user) return <Navigate to={ROLE_ROUTES[user.role]} replace />;
  return <Landing />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard/student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/club-leader"
        element={
          <ProtectedRoute allowedRoles={["club_leader"]}>
            <ClubLeaderDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/super-admin"
        element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
