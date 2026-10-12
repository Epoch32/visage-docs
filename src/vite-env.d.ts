/// <reference types="vite/client" />

declare module "*.mdx" {
	import type { Child } from "@epoch32/visage";
	export const title: string | undefined;
	export const breadcrumb: string | undefined;
	export const toc: Array<{ id: string; title: string; level: number }> | undefined;
	const Component: (props?: any) => Child;
	export default Component;
}
