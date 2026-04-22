import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const backendTarget = process.env.VITE_API_PROXY_TARGET ?? "http://localhost:5000";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": {
        target: backendTarget,
        changeOrigin: true,
      },
      "/room": {
        target: backendTarget,
        changeOrigin: true,
      },
      "/socket.io": {
        target: backendTarget,
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
