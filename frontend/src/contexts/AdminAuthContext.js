import React, { createContext, useContext, useEffect, useState } from "react";
import { apiAdmin } from "../lib/api";

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("alix_admin_token");
    if (!t) { setLoading(false); return; }
    apiAdmin.get("/admin/me")
      .then(r => setAdmin(r.data))
      .catch(() => { localStorage.removeItem("alix_admin_token"); setAdmin(null); })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await apiAdmin.post("/admin/login", { email, password });
    localStorage.setItem("alix_admin_token", res.data.token);
    setAdmin(res.data.admin);
    return res.data.admin;
  };

  const logout = () => {
    localStorage.removeItem("alix_admin_token");
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
