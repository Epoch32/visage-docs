import { lazy, type Child } from "@epoch32/visage";
import { docsMetadata } from "virtual:docs-metadata";
import type { TocItem } from "../components/TableOfContents";

export interface DocModule {
	title: string;
	breadcrumb?: string;
	toc: TocItem[];
	default: (props?: any) => Child;
	preload: () => Promise<any>;
}

// Vite auto-discovers all .mdx page files as on-demand code-split chunks (lazy dynamic imports)
const mdxLoaders = import.meta.glob<any>("./*.mdx");

export const docsRegistry: Record<string, DocModule> = {};

for (const path in mdxLoaders) {
	const key = path.replace(/^\.\//, "").replace(/\.mdx$/, "");
	const loader = mdxLoaders[path]!;
	const meta = docsMetadata[key] ?? {
		title: key,
		toc: [],
	};

	const LazyComponent = lazy(loader);

	docsRegistry[key] = {
		title: meta.title,
		breadcrumb: meta.breadcrumb,
		toc: meta.toc,
		default: LazyComponent,
		preload: () => LazyComponent.preload(),
	};
}

export function getDocPage(id: string): DocModule | undefined {
	return docsRegistry[id];
}
