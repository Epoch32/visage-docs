import { CodeBlock } from "../components/CodeBlock";
import type { TocItem } from "../components/TableOfContents";

export const title = "Signals (createSignal)";
export const breadcrumb = "Documentation / Reactivity";

export const toc: TocItem[] = [
	{ id: "overview", title: "Overview", level: 2 },
	{ id: "basic-usage", title: "Basic Usage", level: 2 },
	{ id: "updating-state", title: "Updating State", level: 2 },
];

export default function SignalsDoc() {
	return (
		<>
			<p className="doc-lead">
				Signals are the atomic reactive primitive in Visage. When a signal
				changes, only the precise DOM nodes subscribed to it update.
			</p>

			<h2 id="basic-usage" className="doc-section-heading">
				Basic Usage
			</h2>
			<p
				className="doc-lead"
				style={{ fontSize: "15px", marginBottom: "16px" }}
			>
				<code>createSignal</code> returns a getter function and a setter
				function:
			</p>
			<CodeBlock
				filename="signals.ts"
				lang="ts"
				code={`import { createSignal } from "@epoch32/visage";

const [count, setCount] = createSignal(0);

// Reading the signal
console.log(count()); // 0

// Writing to the signal
setCount(1);
console.log(count()); // 1`}
			/>

			<h2 id="updating-state" className="doc-section-heading">
				Updating State with Functional Form
			</h2>
			<CodeBlock
				filename="counter.ts"
				lang="ts"
				code={`// Pass an updater callback to receive previous value
setCount(prev => prev + 1);`}
			/>
		</>
	);
}
