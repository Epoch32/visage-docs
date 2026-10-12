import type { Child } from "@epoch32/visage";
import type { TocItem } from "../components/TableOfContents";

export interface DocModule {
	title: string;
	breadcrumb?: string;
	toc: TocItem[];
	default: () => Child;
}

// Vite auto-discovers both .mdx and .tsx doc page files in this directory
const tsxModules = import.meta.glob<DocModule>("./*.tsx", { eager: true });
const mdxModules = import.meta.glob<DocModule>("./*.mdx", { eager: true });

export const docsRegistry: Record<string, DocModule> = {};

// Register TSX docs first
for (const path in tsxModules) {
	const key = path.replace(/^\.\//, "").replace(/\.tsx$/, "");
	docsRegistry[key] = tsxModules[path]!;
}

// MDX docs override or complement TSX docs
for (const path in mdxModules) {
	const key = path.replace(/^\.\//, "").replace(/\.mdx$/, "");
	const mod = mdxModules[path] as any;
	let toc: TocItem[] = mod.toc ?? [];

	if (mod.__autoToc) {
		try {
			toc = typeof mod.__autoToc === "string" ? JSON.parse(mod.__autoToc) : mod.__autoToc;
		} catch {
			// fallback to mod.toc
		}
	}

	docsRegistry[key] = {
		...mod,
		toc,
	};
}

export function getDocPage(id: string): DocModule | undefined {
	return docsRegistry[id];
}
