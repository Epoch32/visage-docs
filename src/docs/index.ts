import type { Child } from "@epoch32/visage";
import type { TocItem } from "../components/TableOfContents";

export interface DocModule {
	title: string;
	breadcrumb?: string;
	toc: TocItem[];
	default: () => Child;
}

// Vite auto-discovers all doc page files in this directory
const docModules = import.meta.glob<DocModule>("./*.tsx", { eager: true });

export const docsRegistry: Record<string, DocModule> = {};

for (const path in docModules) {
	const key = path.replace(/^\.\//, "").replace(/\.tsx$/, "");
	docsRegistry[key] = docModules[path];
}

export function getDocPage(id: string): DocModule | undefined {
	return docsRegistry[id];
}
