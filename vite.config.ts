import visage, { visageLucide } from "@epoch32/visage/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [visage(), visageLucide()],
	optimizeDeps: {
		exclude: ["@epoch32/visage", "visage"],
	}
});
