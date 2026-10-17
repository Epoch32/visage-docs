/// <reference types="vite/client" />

declare module "*.mdx" {
	import type { Child } from "@epoch32/visage";
	export const title: string | undefined;
	export const breadcrumb: string | undefined;
	export const toc: Array<{ id: string; title: string; level: number }> | undefined;
	const Component: (props?: any) => Child;
	export default Component;
}

declare module "virtual:docs-metadata" {
	export interface DocMetadata {
		title: string;
		breadcrumb?: string;
		toc: Array<{ id: string; title: string; level: number }>;
	}
	export const docsMetadata: Record<string, DocMetadata>;
}
