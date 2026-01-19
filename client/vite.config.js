import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  server: {
    proxy: {
      // Proxy /product/* requests to backend port 8000
      "/product": "http://localhost:8000",
      // Proxy /admin/* requests to backend port 8000
      "/admin": "http://localhost:8000",
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
    pool: "threads", // important: avoids fork issues on Windows
  },
});
