import { createHighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import tsx from "shiki/langs/tsx.mjs";
import typescript from "shiki/langs/typescript.mjs";
import bash from "shiki/langs/bash.mjs";
import json from "shiki/langs/json.mjs";
import rosePineMoon from "shiki/themes/rose-pine-moon.mjs";

let highlighterPromise: Promise<any> | null = null;

function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighterCore({
			themes: [rosePineMoon],
			langs: [tsx, typescript, bash, json],
			engine: createOnigurumaEngine(import("shiki/wasm")),
		});
	}
	return highlighterPromise;
}

const highlightCache = new Map<string, string>();

export async function highlightCode(code: string, lang = "tsx"): Promise<string> {
	const normalizedLang = lang === "ts" ? "typescript" : lang;
	const cacheKey = `${normalizedLang}:${code}`;
	const cached = highlightCache.get(cacheKey);
	if (cached) return cached;

	const highlighter = await getHighlighter();
	const html = highlighter.codeToHtml(code, {
		lang: normalizedLang,
		theme: "rose-pine-moon",
	});

	highlightCache.set(cacheKey, html);
	return html;
}
