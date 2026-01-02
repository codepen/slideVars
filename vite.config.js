import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

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
      external: ["lit"],
    },
    sourcemap: true,
  },
  plugins: [dts({ rollupTypes: true })],
  server: {
    port: 3000,
    open: true, // Opens the demo/documentation page
  },
});
