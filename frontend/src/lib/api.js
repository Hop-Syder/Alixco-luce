import axios from "axios";

export const BACKEND_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("alix_token") || localStorage.getItem("alix_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const apiAdmin = axios.create({ baseURL: API });
apiAdmin.interceptors.request.use((config) => {
  const token = localStorage.getItem("alix_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const apiCustomer = axios.create({ baseURL: API });
apiCustomer.interceptors.request.use((config) => {
  const token = localStorage.getItem("alix_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const resolveImage = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${BACKEND_URL}${url}`;
};

export const formatFCFA = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return "0 FCFA";
  return `${Math.round(amount).toLocaleString("fr-FR").replace(/\u202f/g, " ").replace(/\u00a0/g, " ")} FCFA`;
};
