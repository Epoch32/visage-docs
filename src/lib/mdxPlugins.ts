import { visit } from "unist-util-visit";

export function slugify(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_-]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function getNodeText(node: any): string {
	if (!node) return "";
	if (node.type === "text") return node.value || "";
	if (Array.isArray(node.children)) {
		return node.children.map(getNodeText).join("");
	}
	return "";
}

/**
 * Rehype plugin to ensure all h1-h6 headings have an id attribute matching their slug
 */
export function rehypeHeadingIds() {
	return (tree: any) => {
		visit(tree, "element", (node: any) => {
			if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(node.tagName)) {
				if (!node.properties) node.properties = {};
				if (!node.properties.id) {
					const text = getNodeText(node);
					if (text) {
						node.properties.id = slugify(text);
					}
				}
			}
		});
	};
}

/**
 * Remark plugin to extract heading AST nodes and export an auto-generated TOC array
 */
export function remarkAutoToc() {
	return (tree: any) => {
		const headings: Array<{ id: string; title: string; level: number }> = [];

		visit(tree, "heading", (node: any) => {
			// Include h2 and h3
			if (node.depth === 2 || node.depth === 3) {
				const title = getNodeText(node).trim();
				if (title) {
					const id = slugify(title);
					headings.push({ id, title, level: node.depth });
				}
			}
		});

		// Export __autoToc as an MDX ESM export
		tree.children.push({
			type: "mdxjsEsm",
			value: "",
			data: {
				estree: {
					type: "Program",
					sourceType: "module",
					body: [
						{
							type: "ExportNamedDeclaration",
							declaration: {
								type: "VariableDeclaration",
								kind: "const",
								declarations: [
									{
										type: "VariableDeclarator",
										id: { type: "Identifier", name: "__autoToc" },
										init: {
											type: "Literal",
											value: JSON.stringify(headings),
											raw: JSON.stringify(JSON.stringify(headings)),
										},
									},
								],
							},
							specifiers: [],
							source: null,
						},
					],
				},
			},
		});
	};
}
