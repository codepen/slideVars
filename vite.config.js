import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

const isLibraryBuild = process.env.BUILD_MODE === "library";

export default defineConfig({
  base: isLibraryBuild ? "/" : "/slideVars/",
  build: isLibraryBuild
    ? {
        // Library build configuration
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
      }
    : {
        // Demo/docs site build configuration
        outDir: "docs",
        sourcemap: true,
      },
  plugins: isLibraryBuild ? [dts({ rollupTypes: true })] : [],
  server: {
    port: 3000,
    open: true, // Opens the demo/documentation page
  },
});
