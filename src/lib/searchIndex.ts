import { docsRegistry, type DocModule } from "../docs";
import { navigationSections } from "../components/Sidebar";

export interface SearchResultItem {
	id: string; // url target e.g. "/signals" or "/signals#custom-equality"
	title: string;
	category: string;
	subtitle?: string;
	keywords: string[];
	type: "page" | "section";
}

export function buildSearchIndex(): SearchResultItem[] {
	const items: SearchResultItem[] = [];

	for (const section of navigationSections) {
		for (const navItem of section.items) {
			const doc: DocModule | undefined = docsRegistry[navItem.id];
			const pageTitle = doc?.title ?? navItem.title;

			// Add primary page item
			items.push({
				id: `/${navItem.id}`,
				title: pageTitle,
				category: section.title,
				subtitle: doc?.breadcrumb ?? section.title,
				keywords: [
					navItem.id,
					pageTitle,
					section.title,
					...(navItem.id.split("-")),
				],
				type: "page",
			});

			// Add section sub-items from TOC
			if (doc?.toc) {
				for (const heading of doc.toc) {
					if (heading.id === "overview") continue;
					items.push({
						id: `/${navItem.id}#${heading.id}`,
						title: heading.title,
						category: pageTitle,
						subtitle: `${pageTitle} › ${heading.title}`,
						keywords: [
							navItem.id,
							heading.id,
							heading.title,
							pageTitle,
							...(heading.id.split("-")),
						],
						type: "section",
					});
				}
			}
		}
	}

	return items;
}
