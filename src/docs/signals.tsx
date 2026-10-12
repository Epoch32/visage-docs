import { createSignal } from "@epoch32/visage";
import {
	AlertTriangle,
	Gauge,
	HelpCircle,
	Play,
	Plus,
	RefreshCw,
	Sparkles,
	Zap,
} from "lucide-react";
import { CodeBlock } from "../components/CodeBlock";
import type { TocItem } from "../components/TableOfContents";

export const title = "Signals (createSignal)";
export const breadcrumb = "Documentation / Reactivity";

export const toc: TocItem[] = [
	{ id: "overview", title: "Overview", level: 2 },
	{ id: "interactive-demo", title: "Interactive Playground", level: 2 },
	{ id: "anatomy", title: "Anatomy & Syntax", level: 2 },
	{ id: "mental-model", title: "Mental Model: Zero VDOM", level: 2 },
	{ id: "functional-updates", title: "Functional Updates", level: 2 },
	{ id: "custom-equality", title: "Equality & Deduplication", level: 2 },
	{ id: "pitfalls", title: "Common Traps to Avoid", level: 2 },
	{ id: "api-reference", title: "API Reference", level: 2 },
];

export default function SignalsDoc() {
	// Interactive demo signals
	const [count, setCount] = createSignal(0);
	const [step, setStep] = createSignal(1);

	return (
		<>
			<p className="doc-lead">
				Signals are the atomic reactive building blocks in Visage. Unlike
				frameworks that rely on Virtual DOM diffing and re-running entire
				component trees, Visage components execute <strong>exactly once</strong>
				. Signals establish direct point-to-point connections to the precise DOM
				text nodes and attributes they control.
			</p>

			{/* Feature Cards Grid */}
			<div className="doc-features-grid">
				<div className="doc-feature-card">
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "8px",
							marginBottom: "6px",
						}}
					>
						<Zap size={16} color="var(--pink-500)" />
						<div className="doc-feature-title">Microsecond Micro-Updates</div>
					</div>
					<div className="doc-feature-desc">
						Calling a signal setter updates only subscribed DOM text nodes
						directly, skipping whole-tree diffs, fiber reconciliation, and
						garbage collector pressure.
					</div>
				</div>

				<div className="doc-feature-card">
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "8px",
							marginBottom: "6px",
						}}
					>
						<Gauge size={16} color="var(--pink-500)" />
						<div className="doc-feature-title">Glitch-Free Execution</div>
					</div>
					<div className="doc-feature-desc">
						Visage tracks topological dependencies using a synchronous,
						deterministic push/pull algorithm that prevents intermediate
						inconsistent state across computed graphs.
					</div>
				</div>
			</div>

			{/* Interactive Playground */}
			<h2 id="interactive-demo" className="doc-section-heading">
				Interactive Playground
			</h2>
			<p className="doc-lead" style={{ fontSize: "15px", marginBottom: "16px" }}>
				Try modifying this live reactive counter. Observe how the DOM updates
				surgically without re-rendering the component:
			</p>

			<div className="doc-playground">
				<div className="doc-playground-header">
					<span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
						<Play size={14} />
						<span>Live Signal Demo</span>
					</span>
					<span
						style={{
							fontSize: "11px",
							background: "var(--pink-100)",
							padding: "2px 8px",
							borderRadius: "9999px",
							color: "var(--pink-600)",
							fontWeight: 700,
						}}
					>
						Fine-Grained Reactive
					</span>
				</div>

				<div className="doc-playground-body">
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							gap: "12px",
							padding: "16px 32px",
							background: "var(--surface-card)",
							borderRadius: "16px",
							border: "1px solid var(--border-pink)",
							boxShadow: "var(--shadow-card)",
						}}
					>
						<span
							style={{
								fontSize: "12px",
								fontWeight: 700,
								textTransform: "uppercase",
								letterSpacing: "0.08em",
								color: "var(--text-muted)",
							}}
						>
							Live Reactive Value
						</span>

						<span
							style={{
								fontFamily: "var(--font-mono)",
								fontSize: "44px",
								fontWeight: 800,
								color: "var(--pink-600)",
								lineHeight: 1,
							}}
						>
							{count}
						</span>

						<span
							style={{
								fontSize: "12px",
								color: "var(--text-muted)",
								fontFamily: "var(--font-mono)",
							}}
						>
							step: +{step}
						</span>
					</div>

					<div
						style={{
							display: "flex",
							flexWrap: "wrap",
							gap: "10px",
							justifyContent: "center",
						}}
					>
						<button
							className="doc-btn"
							onClick={() => setCount((c) => c + step())}
						>
							<Plus size={14} />
							<span>Increment (+{step})</span>
						</button>

						<button
							className="doc-btn doc-btn-secondary"
							onClick={() => setCount((c) => c - step())}
						>
							<span>Decrement (-{step})</span>
						</button>

						<button
							className="doc-btn doc-btn-secondary"
							onClick={() => setStep((s) => (s === 1 ? 5 : s === 5 ? 10 : 1))}
						>
							<Sparkles size={14} />
							<span>Toggle Step ({step})</span>
						</button>

						<button
							className="doc-btn doc-btn-secondary"
							onClick={() => {
								setCount(0);
								setStep(1);
							}}
						>
							<RefreshCw size={14} />
							<span>Reset</span>
						</button>
					</div>
				</div>
			</div>

			{/* Anatomy & Syntax */}
			<h2 id="anatomy" className="doc-section-heading">
				Anatomy & Syntax
			</h2>
			<p className="doc-lead" style={{ fontSize: "15px", marginBottom: "16px" }}>
				The <code>createSignal</code> function returns a 2-element tuple: a{" "}
				<strong>getter accessor</strong> and a <strong>setter function</strong>:
			</p>

			<CodeBlock
				filename="signals-basic.ts"
				lang="ts"
				code={`import { createSignal } from "@epoch32/visage";

// 1. Declare the signal with an initial value
const [count, setCount] = createSignal<number>(0);

// 2. Read the signal by invoking it as a function
console.log(count()); // -> 0

// 3. Update the signal by calling the setter
setCount(10);
console.log(count()); // -> 10`}
			/>

			{/* Callout: Direct In-JSX Interpolation */}
			<div className="doc-callout">
				<div className="doc-callout-icon">
					<Sparkles size={18} color="var(--pink-500)" />
				</div>
				<div className="doc-callout-body">
					<div className="doc-callout-title">Visage Pro-Tip: JSX Auto-Unwrapping</div>
					In Visage JSX, you can interpolate either <code>{"{count}"}</code> or{" "}
					<code>{"{count()}"}</code>. Both subscribe automatically to fine-grained
					updates, but passing <code>{"{count}"}</code> directly passes the accessor
					function without allocating an unnecessary wrapper closure.
				</div>
			</div>

			{/* Mental Model: Zero VDOM */}
			<h2 id="mental-model" className="doc-section-heading">
				Mental Model: React vs Visage
			</h2>
			<p className="doc-lead" style={{ fontSize: "15px", marginBottom: "16px" }}>
				Understanding the difference between React's render loop and Visage's
				reactive execution is crucial:
			</p>

			<div className="doc-table-wrapper">
				<table className="doc-table">
					<thead>
						<tr>
							<th>Feature</th>
							<th>React (Virtual DOM)</th>
							<th>Visage (Fine-Grained DOM)</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><strong>Component Execution</strong></td>
							<td>Runs on <em>every single state change</em></td>
							<td>Runs <strong>once</strong> during initialization</td>
						</tr>
						<tr>
							<td><strong>State Subscription</strong></td>
							<td>Implicitly scopes to entire component tree</td>
							<td>Dynamic dependency tracking at expression level</td>
						</tr>
						<tr>
							<td><strong>DOM Update Cost</strong></td>
							<td>Re-computes VDOM tree + diffs reconciliation</td>
							<td>Direct pointer mutation: <code>node.data = value</code></td>
						</tr>
						<tr>
							<td><strong>Hook Rules</strong></td>
							<td>Strict call order, no loops, no conditionals</td>
							<td>No Hook rules! Create signals anywhere, anytime</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* Functional Updates */}
			<h2 id="functional-updates" className="doc-section-heading">
				Functional Updates
			</h2>
			<p className="doc-lead" style={{ fontSize: "15px", marginBottom: "16px" }}>
				When your next state depends on the previous state, pass an updater
				callback to avoid race conditions or stale closures:
			</p>

			<CodeBlock
				filename="functional-update.ts"
				lang="ts"
				code={`const [count, setCount] = createSignal(1);

// Pass a callback taking the previous value:
setCount(prev => prev * 2); // count is now 2
setCount(prev => prev * 2); // count is now 4`}
			/>

			{/* Custom Equality & Deduplication */}
			<h2 id="custom-equality" className="doc-section-heading">
				Equality & Deduplication
			</h2>
			<p className="doc-lead" style={{ fontSize: "15px", marginBottom: "16px" }}>
				By default, Visage uses <code>Object.is</code> equality to prevent
				redundant downstream notifications. If you set the same value, no DOM
				updates fire. You can customize equality checks in options:
			</p>

			<CodeBlock
				filename="custom-equality.ts"
				lang="ts"
				code={`// Always trigger subscribers, even on identical values:
const [pulse, setPulse] = createSignal(0, { equals: false });

// Or specify custom comparison logic:
const [coords, setCoords] = createSignal(
  { x: 0, y: 0 },
  { equals: (a, b) => a.x === b.x && a.y === b.y }
);`}
			/>

			{/* Common Pitfalls */}
			<h2 id="pitfalls" className="doc-section-heading">
				Common Traps to Avoid
			</h2>

			<div className="doc-callout" style={{ borderLeftColor: "var(--pink-500)" }}>
				<div className="doc-callout-icon">
					<AlertTriangle size={18} color="var(--pink-500)" />
				</div>
				<div className="doc-callout-body">
					<div className="doc-callout-title">Trap 1: Destructuring Props</div>
					Because components execute only once, destructuring incoming props like{" "}
					<code>const &#123; value &#125; = props;</code> strips reactivity!
					Always access reactive properties on props as functions or
					properties (e.g., <code>props.value</code>).
				</div>
			</div>

			<div className="doc-callout" style={{ borderLeftColor: "var(--pink-500)" }}>
				<div className="doc-callout-icon">
					<HelpCircle size={18} color="var(--pink-500)" />
				</div>
				<div className="doc-callout-body">
					<div className="doc-callout-title">Trap 2: Reading Outside Reactive Scopes</div>
					Reading <code>count()</code> in the outer body of a component function
					only executes once during mount. If you want derived calculations that
					update dynamically when <code>count</code> changes, use{" "}
					<code>computed(() =&gt; count() * 2)</code> or wrap the expression in an
					accessor function <code>{"() => count() * 2"}</code>.
				</div>
			</div>

			{/* API Reference */}
			<h2 id="api-reference" className="doc-section-heading">
				API Reference
			</h2>

			<div className="doc-api-section">
				{/* Function 1: createSignal */}
				<div className="doc-fn-card">
					<div className="doc-fn-header">
						<div className="doc-fn-meta">
							<span className="doc-fn-kind">Function</span>
						</div>
						<div className="doc-fn-signature">
							createSignal&lt;T&gt;(initialValue: T, options?: SignalOptions&lt;T&gt;): [Accessor&lt;T&gt;, Setter&lt;T&gt;]
						</div>
					</div>

					<div className="doc-fn-body">
						<div className="doc-fn-desc">
							Creates a reactive state signal container. Returns a tuple containing a read-only getter accessor and a state setter function.
						</div>

						<div>
							<div className="doc-fn-subheading">Parameters</div>
							<div className="doc-params-list">
								<div className="doc-param-row">
									<div className="doc-param-meta">
										<span className="doc-param-name">initialValue</span>
										<span className="doc-param-type">T</span>
										<span className="doc-param-badge required">Required</span>
									</div>
									<div className="doc-param-desc">
										The initial value assigned to the signal upon creation.
									</div>
								</div>

								<div className="doc-param-row">
									<div className="doc-param-meta">
										<span className="doc-param-name">options.equals</span>
										<span className="doc-param-type">{"false | ((prev: T, next: T) => boolean)"}</span>
										<span className="doc-param-badge optional">Optional</span>
									</div>
									<div className="doc-param-desc">
										Custom equality comparator function. Pass <code>false</code> to bypass equality checks and always trigger downstream reactions.
									</div>
									<div className="doc-param-default">
										Default: <code>Object.is</code>
									</div>
								</div>

								<div className="doc-param-row">
									<div className="doc-param-meta">
										<span className="doc-param-name">options.persist</span>
										<span className="doc-param-type">string</span>
										<span className="doc-param-badge optional">Optional</span>
									</div>
									<div className="doc-param-desc">
										Storage key to automatically persist and rehydrate this signal's value in <code>localStorage</code> across browser reloads.
									</div>
								</div>
							</div>
						</div>

						<div>
							<div className="doc-fn-subheading">Returns</div>
							<div className="doc-returns-card">
								<div className="doc-returns-header">
									<span className="doc-returns-type">[Accessor&lt;T&gt;, Setter&lt;T&gt;]</span>
								</div>
								<div className="doc-param-desc">
									A 2-tuple where index 0 is the accessor function <code>() =&gt; T</code>, and index 1 is the setter function <code>(value: T | ((prev: T) =&gt; T)) =&gt; void</code>.
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Function 2: untrack */}
				<div className="doc-fn-card">
					<div className="doc-fn-header">
						<div className="doc-fn-meta">
							<span className="doc-fn-kind">Utility Function</span>
						</div>
						<div className="doc-fn-signature">
							untrack&lt;T&gt;(fn: () =&gt; T): T
						</div>
					</div>

					<div className="doc-fn-body">
						<div className="doc-fn-desc">
							Executes a block of code without registering any dynamic reactive subscriptions to signals read inside it. Useful when you need to read a signal's value inside an effect or computed without re-triggering when that specific signal changes.
						</div>

						<div>
							<div className="doc-fn-subheading">Parameters</div>
							<div className="doc-params-list">
								<div className="doc-param-row">
									<div className="doc-param-meta">
										<span className="doc-param-name">fn</span>
										<span className="doc-param-type">() =&gt; T</span>
										<span className="doc-param-badge required">Required</span>
									</div>
									<div className="doc-param-desc">
										Function to run in an untracked reactive execution scope.
									</div>
								</div>
							</div>
						</div>

						<div>
							<div className="doc-fn-subheading">Returns</div>
							<div className="doc-returns-card">
								<div className="doc-returns-header">
									<span className="doc-returns-type">T</span>
								</div>
								<div className="doc-param-desc">
									Returns the synchronous return value of <code>fn()</code>.
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
