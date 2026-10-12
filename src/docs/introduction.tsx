import { CodeBlock } from "../components/CodeBlock";
import type { TocItem } from "../components/TableOfContents";

export const title = "Introduction to Visage";
export const breadcrumb = "Documentation / Getting Started";

export const toc: TocItem[] = [
	{ id: "overview", title: "Overview", level: 2 },
	{ id: "key-features", title: "Core Architecture", level: 2 },
	{ id: "quickstart", title: "Quickstart Example", level: 2 },
];

export default function IntroductionDoc() {
	return (
		<>
			<p className="doc-lead">
				Visage is a lightning-fast, zero-VDOM, fine-grained reactive UI library
				for TypeScript. Components run exactly once to build a surgical DOM
				dependency graph; subsequent state changes update precise text nodes and
				attributes directly with microsecond latency.
			</p>

			<h2 id="key-features" className="doc-section-heading">
				Core Architecture
			</h2>

			<div className="doc-features-grid">
				<div className="doc-feature-card">
					<div className="doc-feature-title">Zero Virtual DOM</div>
					<div className="doc-feature-desc">
						Real DOM nodes clone in nanoseconds via native template cloning. No
						fiber trees, diffing algorithms, or VNode allocations.
					</div>
				</div>

				<div className="doc-feature-card">
					<div className="doc-feature-title">Fine-Grained Reactivity</div>
					<div className="doc-feature-desc">
						Glitch-free push/pull state graph. State reads register dynamic
						subscriptions; updates trigger only the exact bindings that changed.
					</div>
				</div>
			</div>

			<h2 id="quickstart" className="doc-section-heading">
				Quickstart Example
			</h2>

			<CodeBlock
				filename="Counter.tsx"
				lang="tsx"
				code={`import { createSignal, render } from "@epoch32/visage";

function Counter() {
  const [count, setCount] = createSignal(0);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count is: {count}
    </button>
  );
}

render(() => <Counter />, document.getElementById("app")!);`}
			/>
		</>
	);
}
