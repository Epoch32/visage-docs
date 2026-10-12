import mdx from "@mdx-js/rollup";
import visage, { visageLucide } from "@epoch32/visage/vite";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		mdx({
			jsxImportSource: "@epoch32/visage",
			remarkPlugins: [remarkGfm, remarkFrontmatter],
		}),
		visage(),
		visageLucide(),
	],
	optimizeDeps: {
		exclude: ["@epoch32/visage", "visage"],
	},
});
