import { createContext, useContext, useState } from "react";
import { apiFetch } from "../api/api.js";

const AuthContext = createContext(null);

const ROLE_ROUTES = {
  student: "/dashboard/student",
  club_leader: "/dashboard/club-leader",
  admin: "/dashboard/admin",
  super_admin: "/dashboard/super-admin",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("cms_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem("cms_token", data.token);
    localStorage.setItem("cms_user", JSON.stringify(data.user));
    setUser(data.user);
    return ROLE_ROUTES[data.user.role];
  };

  const logout = () => {
    localStorage.removeItem("cms_token");
    localStorage.removeItem("cms_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, ROLE_ROUTES }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
