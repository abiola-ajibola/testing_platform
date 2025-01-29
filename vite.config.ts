import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  server: {
    origin: "http://localhost:8000",
    cors: {
      origin: "http://localhost:8000",
    },
  },
  build: {
    manifest: true,
    rollupOptions: {
      input: path.resolve(__dirname, "./src/main.tsx"),
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
