import path from "node:path";
import visage, { visageLucide } from "@epoch32/visage/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [visage(), visageLucide()],
	optimizeDeps: {
		exclude: ["@epoch32/visage", "visage"],
	},
	resolve: {
		alias: [
			{
				find: /^@epoch32\/visage\/(.*)$/,
				replacement: path.resolve(__dirname, "../visage/src/$1"),
			},
			{
				find: "@epoch32/visage",
				replacement: path.resolve(__dirname, "../visage/src"),
			},
			{
				find: /^visage\/(.*)$/,
				replacement: path.resolve(__dirname, "../visage/src/$1"),
			},
			{
				find: "visage",
				replacement: path.resolve(__dirname, "../visage/src"),
			},
		],
	},
});
