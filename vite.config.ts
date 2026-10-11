import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "@epoch32/visage"
  },
  oxc: {
    jsx: {
      runtime: "automatic",
      importSource: "@epoch32/visage"
    }
  }
});
