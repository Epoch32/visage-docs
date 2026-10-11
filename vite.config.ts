import { defineConfig } from "vite";
import visage, { visageLucide } from "@epoch32/visage/vite";

export default defineConfig({
  plugins: [visage(), visageLucide()],
  resolve: {
    alias: {
      visage: "@epoch32/visage"
    }
  }
});
