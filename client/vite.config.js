import { defineConfig } from "vite";
import react            from "@vitejs/plugin-react";
import path             from "path";
import tailwindcss      from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Faster refresh in development
      fastRefresh: true,
    }),
    tailwindcss(),
  ],

  // ── Path aliases ────────────────────────────────────────────────────────────
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // ── Dev server ──────────────────────────────────────────────────────────────
  server: {
    port: 5173,
    proxy: {
      // Proxy API calls during development to avoid CORS issues
      "/api": {
        target:       "http://localhost:5000",
        changeOrigin: true,
        secure:       false,
      },
    },
  },

  // ── Build optimisations ─────────────────────────────────────────────────────
  build: {
    target:    "es2015",
    outDir:    "dist",
    sourcemap: false, // set true for debugging prod builds

    rollupOptions: {
      output: {
        // Manual chunk splitting — keeps initial bundle lean
        manualChunks: {
          // React core
          "vendor-react": ["react", "react-dom"],

          // Router
          "vendor-router": ["react-router-dom"],

          // Animation library (largest single dep)
          "vendor-motion": ["framer-motion"],

          // State management
          "vendor-state": ["zustand"],

          // UI / icons
          "vendor-ui": ["lucide-react", "react-icons"],

          // Form handling
          "vendor-forms": ["react-hook-form"],

          // HTTP
          "vendor-axios": ["axios"],
        },
      },
    },

    // Warn if any chunk exceeds 500 KB (Vite default is 500)
    chunkSizeWarningLimit: 500,
  },

  // ── CSS ─────────────────────────────────────────────────────────────────────
  css: {
    devSourcemap: true,
  },
});
