import { createSignal, effect, onCleanup } from "@epoch32/visage";
import {
	Activity,
	AlertTriangle,
	CheckCircle2,
	Play,
	Plus,
	Power,
	RefreshCw,
	Sparkles,
	Trash2,
	Zap,
} from "lucide-react";
import { CodeBlock } from "../components/CodeBlock";
import type { TocItem } from "../components/TableOfContents";

export const title = "Side Effects (effect)";
export const breadcrumb = "Documentation / Reactivity";

export const toc: TocItem[] = [
	{ id: "overview", title: "Overview", level: 2 },
	{ id: "computed-vs-effect", title: "Computed vs Effect", level: 2 },
	{ id: "why-use-effects", title: "Why Use an Effect Over a Computed?", level: 2 },
	{ id: "interactive-demo", title: "Interactive Effect & Cleanup Logger", level: 2 },
	{ id: "cleanup-lifecycle", title: "Cleanups & Lifecycle", level: 2 },
	{ id: "batching-execution", title: "Batching & Microtasks", level: 2 },
	{ id: "common-pitfalls", title: "Infinite Loops & Gotchas", level: 2 },
	{ id: "api-reference", title: "API Reference", level: 2 },
];

export default function EffectsDoc() {
	// Interactive Demo State
	const [active, setActive] = createSignal(true);
	const [frequency, setFrequency] = createSignal(1);
	const [logs, setLogs] = createSignal<string[]>([]);

	// Real Visage Effect running inside the documentation page!
	effect(() => {
		if (!active()) {
			setLogs((prev) => [
				`[${new Date().toLocaleTimeString()}] Effect skipped (active = false)`,
				...prev.slice(0, 7),
			]);
			return;
		}

		const currentFreq = frequency();
		const timestamp = new Date().toLocaleTimeString();
		setLogs((prev) => [
			`[${timestamp}] Effect started running at frequency ${currentFreq}x`,
			...prev.slice(0, 7),
		]);

		// Return a cleanup function
		return () => {
			const cleanTime = new Date().toLocaleTimeString();
			setLogs((prev) => [
				`[${cleanTime}] Cleanup ran before next re-execution or stop`,
				...prev.slice(0, 7),
			]);
		};
	});

	const clearLogs = () => {
		setLogs([]);
	};

	return (
		<>
			<p className="doc-lead">
				Side effects allow your application to escape pure reactive computations
				and synchronize state with the outside world. An effect automatically
				tracks every signal read during its execution, runs immediately upon
				creation, and re-executes whenever those signals update.
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
						<div className="doc-feature-title">Eager & Push-Based</div>
					</div>
					<div className="doc-feature-desc">
						Unlike <code>computed</code> which is lazy and only evaluates when
						read, an <code>effect</code> is eager. It queues in pending effects
						and flushes automatically to execute side-effects like DOM updates,
						network requests, or timers.
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
						<Trash2 size={16} color="var(--pink-500)" />
						<div className="doc-feature-title">Self-Cleaning Lifecycle</div>
					</div>
					<div className="doc-feature-desc">
						Effects automatically execute their registered cleanups before each
						re-run and when their enclosing component scope disposes, preventing
						memory leaks and dangling event listeners.
					</div>
				</div>
			</div>

			{/* Computed vs Effect Comparison */}
			<h2 id="computed-vs-effect" className="doc-section-heading">
				Computed vs Effect: When to Use Which?
			</h2>
			<p className="doc-lead" style={{ fontSize: "15px", marginBottom: "16px" }}>
				Both <code>computed</code> and <code>effect</code> track reactive
				dependencies, but they serve completely different purposes:
			</p>

			<div className="doc-table-wrapper">
				<table className="doc-table">
					<thead>
						<tr>
							<th>Property</th>
							<th><code>computed(() =&gt; ...)</code></th>
							<th><code>effect(() =&gt; ...)</code></th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><strong>Purpose</strong></td>
							<td>Pure state derivation & transformation</td>
							<td>Side effects, DOM mutations, I/O, sync</td>
						</tr>
						<tr>
							<td><strong>Evaluation</strong></td>
							<td><strong>Lazy</strong> ("Dirty loading", only on read)</td>
							<td><strong>Eager</strong> (Runs immediately & on change)</td>
						</tr>
						<tr>
							<td><strong>Returns</strong></td>
							<td>A read-only signal accessor <code>() =&gt; T</code></td>
							<td>A manual disposal callback <code>() =&gt; void</code></td>
						</tr>
						<tr>
							<td><strong>Side Effects?</strong></td>
							<td>Never! Must remain pure without side effects</td>
							<td>Yes! Expected to perform external side effects</td>
						</tr>
					</tbody>
				</table>
			</div>

			<h2 id="why-use-effects" className="doc-section-heading">
				Why Use an Effect Over a Computed?
			</h2>
			<p className="doc-lead" style={{ fontSize: "15px", marginBottom: "16px" }}>
				You use an <code>effect</code> instead of a <code>computed</code> whenever
				you need to <strong>interact with the outside world</strong> rather than
				simply calculate a derived value.
			</p>

			<p className="doc-lead" style={{ fontSize: "15px", marginBottom: "16px" }}>
				Because Visage computeds use <strong>dirty loading</strong>, if nothing
				in your application is actively reading a computed value, it will{" "}
				<strong>never run</strong>. If you place side effects like network requests
				or analytics inside a <code>computed</code>, they will silently fail to
				fire. An <code>effect</code> runs eagerly whenever its dependencies change:
			</p>

			<CodeBlock
				filename="effect-use-cases.ts"
				lang="ts"
				code={`import { createSignal, effect } from "@epoch32/visage";

const [unreadCount, setUnreadCount] = createSignal(3);
const [room, setRoom] = createSignal("general");

// 1. Imperative Browser API synchronization
effect(() => {
  document.title = unreadCount() > 0 
    ? \`(\${unreadCount()}) Messages\` 
    : "Messages";
});

// 2. External socket / streaming connection with cleanup
effect(() => {
  const socket = new WebSocket(\`wss://api.example.com/chat/\${room()}\`);
  socket.onmessage = (event) => console.log("Received:", event.data);

  return () => {
    socket.close();
  };
});`}
			/>

			<div className="doc-callout">
				<div className="doc-callout-icon">
					<Sparkles size={18} color="var(--pink-500)" />
				</div>
				<div className="doc-callout-body">
					<div className="doc-callout-title">The Rule of Thumb</div>
					<ul style={{ paddingLeft: "18px", marginTop: "4px" }}>
						<li><strong>Do I need a value to display, compute, or pass around?</strong> Use <code>computed</code>.</li>
						<li><strong>Do I need to trigger an action or update an external system?</strong> Use <code>effect</code>.</li>
					</ul>
				</div>
			</div>

			{/* Interactive Playground Simulator */}
			<h2 id="interactive-demo" className="doc-section-heading">
				Interactive Effect & Cleanup Logger
			</h2>
			<p className="doc-lead" style={{ fontSize: "15px", marginBottom: "16px" }}>
				The logger below is wired to a live Visage <code>effect</code> with an
				embedded cleanup callback. Toggle the active state or change the
				frequency to observe the cleanup lifecycle executing before each run:
			</p>

			<div className="doc-playground">
				<div className="doc-playground-header">
					<span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
						<Play size={14} />
						<span>Live Effect Lifecycle Sandbox</span>
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
						Live System Hook
					</span>
				</div>

				<div className="doc-playground-body">
					{/* Controls Row */}
					<div
						style={{
							display: "flex",
							flexWrap: "wrap",
							gap: "12px",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<button
							className="doc-btn"
							style={{
								background: active()
									? "linear-gradient(135deg, #10b981, #059669)"
									: "linear-gradient(135deg, #f43f5e, #e11d48)",
								borderColor: active() ? "#047857" : "#be123c",
								color: "#ffffff",
							}}
							onClick={() => setActive((v) => !v)}
						>
							<Power size={14} />
							<span>{() => active() ? "Status: Active" : "Status: Paused"}</span>
						</button>

						<button
							className="doc-btn doc-btn-secondary"
							onClick={() => setFrequency((f) => (f >= 5 ? 1 : f + 1))}
						>
							<Plus size={14} />
							<span>Cycle Frequency ({frequency}x)</span>
						</button>

						<button
							className="doc-btn doc-btn-secondary"
							onClick={clearLogs}
						>
							<RefreshCw size={14} />
							<span>Clear Log Stream</span>
						</button>
					</div>

					{/* Live Terminal Log Stream */}
					<div
						style={{
							width: "100%",
							maxWidth: "680px",
							background: "var(--code-bg)",
							color: "var(--code-text)",
							borderRadius: "12px",
							padding: "16px 20px",
							fontFamily: "var(--font-mono)",
							fontSize: "12px",
							lineHeight: "1.6",
							border: "1px solid rgba(244, 167, 187, 0.2)",
							boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
							minHeight: "150px",
							overflowY: "auto",
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
								paddingBottom: "8px",
								marginBottom: "10px",
								color: "var(--text-faint)",
								fontSize: "11px",
							}}
						>
							<span>TERMINAL LOG STREAM</span>
							<span>Real-time Effect Dispatcher</span>
						</div>

						{() =>
							logs().length === 0 ? (
								<div style={{ color: "var(--text-faint)", fontStyle: "italic" }}>
									No log entries yet. Click a control above to trigger the effect.
								</div>
							) : (
								logs().map((entry) => (
									<div
										style={{
											color: entry.includes("Cleanup")
												? "#f472b6"
												: entry.includes("skipped")
												? "#fbbf24"
												: "#34d399",
											marginBottom: "4px",
										}}
									>
										{entry}
									</div>
								))
							)
						}
					</div>
				</div>
			</div>

			{/* Cleanups & Lifecycle */}
			<h2 id="cleanup-lifecycle" className="doc-section-heading">
				Cleanups & Lifecycle
			</h2>
			<p className="doc-lead" style={{ fontSize: "15px", marginBottom: "16px" }}>
				Effects frequently set up asynchronous operations like event listeners,
				intervals, WebSockets, or third-party canvas instances. Visage gives you
				two equivalent ways to register teardown logic:
			</p>

			<CodeBlock
				filename="cleanup-patterns.ts"
				lang="ts"
				code={`import { createSignal, effect, onCleanup } from "@epoch32/visage";

const [userId, setUserId] = createSignal(1);

// Pattern 1: Return a cleanup function directly
effect(() => {
  const socket = new WebSocket(\`wss://api.example.com/users/\${userId()}\`);
  
  // Returned callback runs before next run and on unmount:
  return () => {
    socket.close();
  };
});

// Pattern 2: Call onCleanup() anywhere inside the effect or scope
effect(() => {
  const handler = (e: MouseEvent) => console.log(e.clientX);
  window.addEventListener("mousemove", handler);

  onCleanup(() => {
    window.removeEventListener("mousemove", handler);
  });
});`}
			/>

			{/* Batching & Microtasks */}
			<h2 id="batching-execution" className="doc-section-heading">
				Batching & Execution Order
			</h2>
			<p className="doc-lead" style={{ fontSize: "15px", marginBottom: "16px" }}>
				When multiple signals change together inside a batch, Visage avoids
				redundant effect executions. Effects are added to a pending set and only
				flush once the batch depth returns to zero:
			</p>

			<CodeBlock
				filename="batching.ts"
				lang="ts"
				code={`import { createSignal, effect, batch } from "@epoch32/visage";

const [first, setFirst] = createSignal("Ada");
const [last, setLast] = createSignal("Lovelace");

effect(() => {
  console.log("Full Name:", first(), last());
});
// Logs once initially: "Full Name: Ada Lovelace"

// Without batch():
// setFirst("Grace"); -> effect runs!
// setLast("Hopper"); -> effect runs again!

// With batch():
batch(() => {
  setFirst("Grace");
  setLast("Hopper");
});
// Logs only ONCE at the end of the batch: "Full Name: Grace Hopper"`}
			/>

			{/* Common Pitfalls */}
			<h2 id="common-pitfalls" className="doc-section-heading">
				Infinite Loops & Common Traps
			</h2>

			<div className="doc-callout" style={{ borderLeftColor: "var(--pink-500)" }}>
				<div className="doc-callout-icon">
					<AlertTriangle size={18} color="var(--pink-500)" />
				</div>
				<div className="doc-callout-body">
					<div className="doc-callout-title">Trap 1: Writing to Read Signals</div>
					If an effect reads a signal and also writes to that same signal, it will
					trigger itself in an infinite loop! Visage includes built-in cycle
					detection to safeguard your app, but you should avoid writing to
					tracked dependencies inside an effect. Use <code>untrack()</code> if
					you need to read a signal's value without subscribing to it.
				</div>
			</div>

			<div className="doc-callout" style={{ borderLeftColor: "var(--pink-500)" }}>
				<div className="doc-callout-icon">
					<Sparkles size={18} color="var(--pink-500)" />
				</div>
				<div className="doc-callout-body">
					<div className="doc-callout-title">Trap 2: Using Effect for Derived State</div>
					Never use an <code>effect</code> to calculate a value and store it in
					another signal. That causes unnecessary double renders and timing
					glitches. Always use <code>computed(() =&gt; ...)</code> for derived
					state!
				</div>
			</div>

			{/* API Reference */}
			<h2 id="api-reference" className="doc-section-heading">
				API Reference
			</h2>

			<div className="doc-api-section">
				{/* Function: effect */}
				<div className="doc-fn-card">
					<div className="doc-fn-header">
						<div className="doc-fn-meta">
							<span className="doc-fn-kind">Function</span>
						</div>
						<div className="doc-fn-signature">
							effect(fn: () =&gt; void | CleanupFn): CleanupFn
						</div>
					</div>

					<div className="doc-fn-body">
						<div className="doc-fn-desc">
							Creates an eager reactive side-effect runner. Runs immediately and
							subscribes to all signals accessed during execution. Re-executes
							automatically when those dependencies change.
						</div>

						<div>
							<div className="doc-fn-subheading">Parameters</div>
							<div className="doc-params-list">
								<div className="doc-param-row">
									<div className="doc-param-meta">
										<span className="doc-param-name">fn</span>
										<span className="doc-param-type">() =&gt; void | CleanupFn</span>
										<span className="doc-param-badge required">Required</span>
									</div>
									<div className="doc-param-desc">
										The side-effect callback. May optionally return a cleanup function to teardown resources before re-execution or unmount.
									</div>
								</div>
							</div>
						</div>

						<div>
							<div className="doc-fn-subheading">Returns</div>
							<div className="doc-returns-card">
								<div className="doc-returns-header">
									<span className="doc-returns-type">CleanupFn</span>
								</div>
								<div className="doc-param-desc">
									A manual disposal function <code>() =&gt; void</code> that stops the effect and tears down all registered cleanups and subscriptions.
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Function: onCleanup */}
				<div className="doc-fn-card">
					<div className="doc-fn-header">
						<div className="doc-fn-meta">
							<span className="doc-fn-kind">Lifecycle Utility</span>
						</div>
						<div className="doc-fn-signature">
							onCleanup(fn: CleanupFn): void
						</div>
					</div>

					<div className="doc-fn-body">
						<div className="doc-fn-desc">
							Registers a teardown callback for the currently executing effect or active component scope. Runs right before the effect re-runs or when the scope is destroyed.
						</div>

						<div>
							<div className="doc-fn-subheading">Parameters</div>
							<div className="doc-params-list">
								<div className="doc-param-row">
									<div className="doc-param-meta">
										<span className="doc-param-name">fn</span>
										<span className="doc-param-type">() =&gt; void</span>
										<span className="doc-param-badge required">Required</span>
									</div>
									<div className="doc-param-desc">
										The cleanup function to execute on teardown.
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Alias: createEffect */}
				<div className="doc-fn-card">
					<div className="doc-fn-header">
						<div className="doc-fn-meta">
							<span className="doc-fn-kind">Alias</span>
						</div>
						<div className="doc-fn-signature">
							createEffect(fn: () =&gt; void | CleanupFn): CleanupFn
						</div>
					</div>

					<div className="doc-fn-body">
						<div className="doc-fn-desc">
							A drop-in, Solid-compatible alias for <code>effect</code>. Identical in behavior and signature.
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
