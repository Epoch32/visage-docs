import { createHighlighter, type Highlighter } from "shiki";
import { visit } from "unist-util-visit";

let highlighterPromise: Promise<Highlighter> | null = null;
function getBuildHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({
			themes: ["rose-pine-moon"],
			langs: ["tsx", "typescript", "bash", "json", "html", "css", "javascript", "text"],
		});
	}
	return highlighterPromise;
}

/**
 * Remark plugin to pre-highlight all <CodeBlock> and fenced code blocks at build time using Shiki.
 * Eliminates shiki, wasm, and all syntax grammars from the client bundle.
 */
export function remarkPreHighlight() {
	return async (tree: any) => {
		const highlighter = await getBuildHighlighter();
		const loadedLangs = new Set(highlighter.getLoadedLanguages());

		visit(tree, (node: any, index: any, parent: any) => {
			if (node.type === "mdxJsxFlowElement" && node.name === "CodeBlock") {
				let code = "";
				let lang = "tsx";

				for (const attr of node.attributes || []) {
					if (attr.name === "lang" && typeof attr.value === "string") {
						lang = attr.value;
					} else if (attr.name === "code") {
						if (typeof attr.value === "string") {
							code = attr.value;
						} else if (attr.value?.value) {
							const val = String(attr.value.value).trim();
							if (val.startsWith("`") && val.endsWith("`")) {
								code = val.slice(1, -1);
							} else {
								code = val;
							}
						} else if (attr.value?.data?.estree) {
							const expr = attr.value.data.estree.body?.[0]?.expression;
							if (expr?.type === "TemplateLiteral") {
								code = expr.quasis.map((q: any) => q.value.raw).join("");
							}
						}
					}
				}

				if (code) {
					const cleanCode = code.replace(/\\`/g, "`").replace(/\\\$/g, "$").trim();
					let normalizedLang = lang.toLowerCase();
					if (normalizedLang === "ts") normalizedLang = "typescript";
					else if (normalizedLang === "js") normalizedLang = "javascript";
					else if (normalizedLang === "sh") normalizedLang = "bash";
					else if (normalizedLang === "en") normalizedLang = "text";

					if (!loadedLangs.has(normalizedLang)) {
						normalizedLang = "text";
					}

					const html = highlighter.codeToHtml(cleanCode, {
						lang: normalizedLang,
						theme: "rose-pine-moon",
					});

					node.attributes.push({
						type: "mdxJsxAttribute",
						name: "highlightedHtml",
						value: html,
					});
				}
			} else if (node.type === "code" && parent && typeof index === "number") {
				let lang = (node.lang || "text").toLowerCase();
				let normalizedLang = lang;
				if (normalizedLang === "ts") normalizedLang = "typescript";
				else if (normalizedLang === "js") normalizedLang = "javascript";
				else if (normalizedLang === "sh") normalizedLang = "bash";
				else if (normalizedLang === "en") normalizedLang = "text";

				if (!loadedLangs.has(normalizedLang)) {
					normalizedLang = "text";
				}

				const html = highlighter.codeToHtml(node.value.trim(), {
					lang: normalizedLang,
					theme: "rose-pine-moon",
				});

				parent.children[index] = {
					type: "mdxJsxFlowElement",
					name: "CodeBlock",
					attributes: [
						{ type: "mdxJsxAttribute", name: "code", value: node.value },
						{ type: "mdxJsxAttribute", name: "lang", value: lang },
						{ type: "mdxJsxAttribute", name: "highlightedHtml", value: html },
					],
					children: [],
				};
			}
		});
	};
}

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
