import { create } from "zustand";
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("purepuff_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err),
);

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("purepuff_token"),
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const res = await API.post("/auth/login", credentials);
      localStorage.setItem("purepuff_token", res.data.token);
      set({ user: res.data.user, token: res.data.token, loading: false });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Verification Error",
        loading: false,
      });
      return false;
    }
  },

  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await API.post("/auth/register", payload);
      localStorage.setItem("purepuff_token", res.data.token);
      set({ user: res.data.user, token: res.data.token, loading: false });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Registration Unsuccessful",
        loading: false,
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("purepuff_token");
    set({ user: null, token: null });
  },

  checkSession: async () => {
    const token = localStorage.getItem("purepuff_token");

    if (!token) {
      set({ user: null, token: null });
      return;
    }
    try {
      const res = await API.get("/auth/me");
      set({ user: res.data.user });
    } catch {
      localStorage.removeItem("purepuff_token");
      set({ user: null, token: null });
    }
  },
}));

export { API };
