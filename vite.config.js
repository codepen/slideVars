import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "SlideVars",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "esm.js" : "js"}`,
    },
    rollupOptions: {
      // Make sure to externalize deps that shouldn't be bundled
      external: [],
    },
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: true, // Opens the demo/documentation page
  },
});
