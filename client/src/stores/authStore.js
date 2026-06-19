import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

// ─── Axios instance ─────────────────────────────────────────────────────────
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10_000,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("purepuff_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err),
);

// Intercept 401s globally — clear session without full store reset
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("purepuff_token");
    }
    return Promise.reject(err);
  },
);

// ─── Auth store ──────────────────────────────────────────────────────────────
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      sessionChecked: false,

      // Clear error manually (call on form focus)
      clearError: () => set({ error: null }),

      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const res = await API.post("/auth/login", credentials);
          const { token, user } = res.data;
          localStorage.setItem("purepuff_token", token);
          set({ user, token, loading: false, sessionChecked: true });
          return true;
        } catch (err) {
          set({
            error: err.response?.data?.message || "Invalid email or password.",
            loading: false,
          });
          return false;
        }
      },

      register: async (payload) => {
        set({ loading: true, error: null });
        try {
          const res = await API.post("/auth/register", payload);
          const { token, user } = res.data;
          localStorage.setItem("purepuff_token", token);
          set({ user, token, loading: false, sessionChecked: true });
          return true;
        } catch (err) {
          set({
            error:
              err.response?.data?.message ||
              "Registration failed. Please try again.",
            loading: false,
          });
          return false;
        }
      },

      logout: () => {
        localStorage.removeItem("purepuff_token");
        set({ user: null, token: null, sessionChecked: true, error: null });
      },

      checkSession: async () => {
        // Already verified this session
        if (get().sessionChecked) return;

        const token = localStorage.getItem("purepuff_token");
        if (!token) {
          set({ user: null, token: null, sessionChecked: true });
          return;
        }

        try {
          const res = await API.get("/auth/me");
          set({ user: res.data.user, token, sessionChecked: true });
        } catch {
          localStorage.removeItem("purepuff_token");
          set({ user: null, token: null, sessionChecked: true });
        }
      },
    }),
    {
      name: "purepuff-auth",
      // Only persist token + user — not transient loading/error states
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    },
  ),
);

export { API };
