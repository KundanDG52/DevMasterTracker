import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // set base to "./" so the production build also works when opened
  // from a sub-path or a static host without a custom domain.
  base: "./",
});
