import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { apiCustomer } from "../lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => {
    const token = localStorage.getItem("alix_token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await apiCustomer.get("/auth/me");
      setUser(res.data);
    } catch (e) {
      localStorage.removeItem("alix_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadMe(); }, [loadMe]);

  const login = async (email, password) => {
    const res = await apiCustomer.post("/auth/login", { email, password });
    localStorage.setItem("alix_token", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (payload) => {
    const res = await apiCustomer.post("/auth/register", payload);
    localStorage.setItem("alix_token", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem("alix_token");
    setUser(null);
  };

  const updateProfile = async (payload) => {
    const res = await apiCustomer.put("/auth/profile", payload);
    setUser(res.data);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
