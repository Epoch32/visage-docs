import * as fs from "node:fs";
import * as path from "node:path";
import mdx from "@mdx-js/rollup";
import visage, { visageLucide } from "@epoch32/visage/vite";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { defineConfig, type Plugin } from "vite";
import { rehypeHeadingIds, remarkAutoToc, remarkPreHighlight, slugify } from "./src/lib/mdxPlugins.ts";

function docsMetadataPlugin(): Plugin {
	const virtualId = "virtual:docs-metadata";
	const resolvedVirtualId = `\0${virtualId}`;

	function scanMetadata() {
		const rootDir = import.meta.dirname || process.cwd();
		const docsDir = path.resolve(rootDir, "src/docs");
		if (!fs.existsSync(docsDir)) return {};
		const entries = fs.readdirSync(docsDir).filter((f) => f.endsWith(".mdx"));
		const metadata: Record<
			string,
			{
				title: string;
				breadcrumb?: string;
				toc: Array<{ id: string; title: string; level: number }>;
			}
		> = {};

		for (const file of entries) {
			const filePath = path.join(docsDir, file);
			const content = fs.readFileSync(filePath, "utf-8");
			const titleMatch = content.match(/export const title = ["'](.*?)["']/);
			const breadcrumbMatch = content.match(/export const breadcrumb = ["'](.*?)["']/);
			const headings: Array<{ id: string; title: string; level: number }> = [];
			const lines = content.split("\n");

			for (const line of lines) {
				const m = line.match(/^(#{2,3})\s+(.+)$/);
				if (m) {
					const depth = m[1].length;
					const title = m[2]
						.replace(/<[^>]+>/g, "")
						.replace(/`/g, "")
						.trim();
					const id = slugify(title);
					headings.push({ id, title, level: depth });
				}
			}

			const key = file.replace(/\.mdx$/, "");
			metadata[key] = {
				title: titleMatch ? titleMatch[1] : key,
				breadcrumb: breadcrumbMatch ? breadcrumbMatch[1] : undefined,
				toc: headings,
			};
		}

		return metadata;
	}

	return {
		name: "visage:docs-metadata",
		resolveId(id: string) {
			if (id === virtualId) {
				return resolvedVirtualId;
			}
		},
		load(id: string) {
			if (id === resolvedVirtualId) {
				const data = scanMetadata();
				return `export const docsMetadata = ${JSON.stringify(data)};`;
			}
		},
	};
}

export default defineConfig({
	plugins: [
		docsMetadataPlugin(),
		mdx({
			jsxImportSource: "@epoch32/visage",
			remarkPlugins: [remarkGfm, remarkFrontmatter, remarkAutoToc, remarkPreHighlight],
			rehypePlugins: [rehypeHeadingIds],
		}),
		visage(),
	],
	optimizeDeps: {
		exclude: ["@epoch32/visage", "visage"],
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes("node_modules/lucide")) {
						return "lucide";
					}
					if (id.includes("node_modules/@epoch32/visage")) {
						return "visage";
					}
				},
			},
		},
		rolldownOptions: {
			output: {
				codeSplitting: true
			}
		},
		chunkSizeWarningLimit: 700
	},
});
