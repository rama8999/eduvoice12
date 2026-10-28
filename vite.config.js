import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // "./" = relative paths, so the build works on GitHub Pages under any
  // repo name (e.g. /Eduvoice1/), on other hosts, and even from a folder.
  base: "./",
});
