import { defineConfig } from "vite";
import visage, { visageLucide } from "@epoch32/visage/vite";

import { resolve } from "path";

export default defineConfig({
  plugins: [visage(), visageLucide()],
  resolve: {
    alias: {
      visage: resolve(__dirname, "../visage/dist"),
      "@epoch32/visage": resolve(__dirname, "../visage/dist")
    },
    dedupe: ["@epoch32/visage", "visage"]
  }
});
