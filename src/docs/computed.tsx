import { createSignal, computed } from "@epoch32/visage";
import {
	Activity,
	ArrowRight,
	Brain,
	CheckCircle,
	Clock,
	Cpu,
	Eye,
	GitBranch,
	Play,
	Plus,
	RefreshCw,
	Sparkles,
	Zap,
} from "lucide-react";
import { CodeBlock } from "../components/CodeBlock";
import type { TocItem } from "../components/TableOfContents";

export const title = "Derived State (computed)";
export const breadcrumb = "Documentation / Reactivity";

export const toc: TocItem[] = [
	{ id: "overview", title: "Overview", level: 2 },
	{ id: "dirty-loading", title: "How Dirty Loading Works", level: 2 },
	{ id: "interactive-demo", title: "Interactive Subscriber Simulator", level: 2 },
	{ id: "syntax", title: "Basic Syntax & Usage", level: 2 },
	{ id: "subscriber-tree", title: "The Subscriber Tree", level: 2 },
	{ id: "memoization", title: "Memoization & Deduplication", level: 2 },
	{ id: "dynamic-dependencies", title: "Dynamic Dependency Pruning", level: 2 },
	{ id: "api-reference", title: "API Reference", level: 2 },
];

export default function ComputedDoc() {
	// Signal A: The root source
	const [signalA, setSignalA] = createSignal(0);

	// Custom interactive state to demonstrate dirty loading:
	// isDirty tracks whether Z has been marked dirty since signalA changed
	const [isDirty, setIsDirty] = createSignal(false);
	// lastComputedValue tracks the value Z holds after an explicit read
	const [cachedValue, setCachedValue] = createSignal(0);
	// computeRunCount tracks how many times the calculation actually ran
	const [computeRunCount, setComputeRunCount] = createSignal(0);

	// The actual Visage computed node running in background
	const realComputeZ = computed(() => {
		return signalA() * 2;
	});

	const updateSignalA = (delta: number) => {
		setSignalA((prev) => prev + delta);
		// When A changes, Z is NOT recalculated! It is marked dirty.
		setIsDirty(true);
	};

	const readComputeZ = () => {
		// Reading Z evaluates the dirty load and clears the dirty flag
		const val = realComputeZ();
		setCachedValue(val);
		setIsDirty(false);
		setComputeRunCount((c) => c + 1);
	};

	const resetSimulator = () => {
		setSignalA(0);
		setIsDirty(false);
		setCachedValue(0);
		setComputeRunCount(0);
	};

	return (
		<>
			<p className="doc-lead">
				A computed node is a derived reactive container calculated from the
				values of one or more signals. Computed nodes cannot be written to
				manually; they exist strictly as pure transformations of upstream state.
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
						<Cpu size={16} color="var(--pink-500)" />
						<div className="doc-feature-title">Dirty Loading Architecture</div>
					</div>
					<div className="doc-feature-desc">
						When upstream signals change, computed nodes do not recalculate.
						They simply mark themselves dirty. Zero CPU cycles are spent until a
						subscriber explicitly reads the value.
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
						<Brain size={16} color="var(--pink-500)" />
						<div className="doc-feature-title">Automatic Memoization</div>
					</div>
					<div className="doc-feature-desc">
						If an upstream signal hasn't changed, reading a computed node 100
						times returns the cached value in sub-nanoseconds without
						re-executing the derivation callback.
					</div>
				</div>
			</div>

			{/* Dirty Loading Explanation */}
			<h2 id="dirty-loading" className="doc-section-heading">
				How Dirty Loading Works
			</h2>
			<p className="doc-lead" style={{ fontSize: "15px", marginBottom: "16px" }}>
				In naive reactive systems, updating a signal immediately triggers an
				eager recalculation of every derived calculation connected to it. If you
				have a network of calculations that are currently offscreen, hidden in a
				collapsed accordion, or not currently rendered, that is wasted CPU time.
			</p>

			<p className="doc-lead" style={{ fontSize: "15px", marginBottom: "20px" }}>
				Visage solves this with <strong>Dirty Loading</strong>:
			</p>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr 1fr",
					gap: "12px",
					marginBottom: "28px",
				}}
			>
				<div
					style={{
						padding: "16px",
						background: "var(--surface-card)",
						borderRadius: "12px",
						border: "1px solid var(--border-pink)",
					}}
				>
					<div
						style={{
							fontSize: "12px",
							fontWeight: 700,
							color: "var(--pink-600)",
							marginBottom: "4px",
						}}
					>
						1. Upstream Signal Changes
					</div>
					<div style={{ fontSize: "13px", color: "var(--text-body)" }}>
						Signal <code>A</code> updates from <code>0</code> to <code>1</code>.
						Signal <code>A</code> notifies its subscriber tree that a change
						occurred.
					</div>
				</div>

				<div
					style={{
						padding: "16px",
						background: "var(--surface-card)",
						borderRadius: "12px",
						border: "1px solid var(--border-pink)",
					}}
				>
					<div
						style={{
							fontSize: "12px",
							fontWeight: 700,
							color: "var(--pink-600)",
							marginBottom: "4px",
						}}
					>
						2. Mark as Dirty
					</div>
					<div style={{ fontSize: "13px", color: "var(--text-body)" }}>
						Computed node <code>Z</code> is <strong>not</strong> calculated yet.
						Instead, it marks its internal state as <code>DIRTY</code>.
					</div>
				</div>

				<div
					style={{
						padding: "16px",
						background: "var(--surface-card)",
						borderRadius: "12px",
						border: "1px solid var(--border-pink)",
					}}
				>
					<div
						style={{
							fontSize: "12px",
							fontWeight: 700,
							color: "var(--pink-600)",
							marginBottom: "4px",
						}}
					>
						3. Compute On Read
					</div>
					<div style={{ fontSize: "13px", color: "var(--text-body)" }}>
						When someone reads <code>Z()</code>, Visage sees that <code>Z</code>{" "}
						is dirty, performs the calculation using <code>A</code>'s latest
						value, caches it, and marks it <code>CLEAN</code>.
					</div>
				</div>
			</div>

			{/* Interactive Playground Simulator */}
			<h2 id="interactive-demo" className="doc-section-heading">
				Interactive Subscriber Simulator
			</h2>
			<p className="doc-lead" style={{ fontSize: "15px", marginBottom: "16px" }}>
				Try incrementing Signal <code>A</code> below. Notice that Compute Node{" "}
				<code>Z</code> flips to <span style={{ color: "#f59e0b", fontWeight: 700 }}>DIRTY</span>,
				but its cached value does not update and the calculation does not run
				until you click <strong>"Read Compute Node Z"</strong>:
			</p>

			<div className="doc-playground">
				<div className="doc-playground-header">
					<span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
						<Play size={14} />
						<span>Live Dirty Loading Simulator</span>
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
						Subscriber Tree Demo
					</span>
				</div>

				<div className="doc-playground-body">
					{/* DAG Visualizer Nodes */}
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: "24px",
							width: "100%",
							flexWrap: "wrap",
						}}
					>
						{/* Node A (Signal) */}
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								padding: "16px 24px",
								background: "var(--surface-card)",
								borderRadius: "14px",
								border: "1px solid var(--border-pink)",
								boxShadow: "var(--shadow-card)",
								minWidth: "150px",
							}}
						>
							<span
								style={{
									fontSize: "11px",
									fontWeight: 700,
									textTransform: "uppercase",
									color: "var(--text-muted)",
									marginBottom: "4px",
								}}
							>
								Signal A (Source)
							</span>
							<span
								style={{
									fontFamily: "var(--font-mono)",
									fontSize: "36px",
									fontWeight: 800,
									color: "var(--pink-600)",
									lineHeight: 1,
									margin: "8px 0",
								}}
							>
								{signalA}
							</span>
							<span
								style={{
									fontSize: "11px",
									padding: "2px 8px",
									borderRadius: "9999px",
									background: "var(--pink-50)",
									color: "var(--pink-600)",
									border: "1px solid var(--pink-200)",
									fontWeight: 600,
								}}
							>
								Writable Root
							</span>
						</div>

						{/* Dependency Edge */}
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								gap: "4px",
								color: isDirty() ? "#f59e0b" : "var(--pink-400)",
								transition: "color 0.2s ease",
							}}
						>
							<GitBranch size={20} />
							<span
								style={{
									fontSize: "10px",
									fontFamily: "var(--font-mono)",
									fontWeight: 700,
								}}
							>
								Z = A * 2
							</span>
							<ArrowRight size={18} />
						</div>

						{/* Node Z (Computed) */}
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								padding: "16px 24px",
								background: "var(--surface-card)",
								borderRadius: "14px",
								border: isDirty()
									? "2px solid #f59e0b"
									: "1px solid var(--border-pink)",
								boxShadow: isDirty()
									? "0 0 16px rgba(245, 158, 11, 0.25)"
									: "var(--shadow-card)",
								minWidth: "170px",
								transition: "all 0.2s ease",
							}}
						>
							<span
								style={{
									fontSize: "11px",
									fontWeight: 700,
									textTransform: "uppercase",
									color: "var(--text-muted)",
									marginBottom: "4px",
								}}
							>
								Compute Node Z
							</span>
							<span
								style={{
									fontFamily: "var(--font-mono)",
									fontSize: "36px",
									fontWeight: 800,
									color: isDirty() ? "#f59e0b" : "var(--pink-600)",
									lineHeight: 1,
									margin: "8px 0",
									transition: "color 0.2s ease",
								}}
							>
								{cachedValue}
							</span>
							<span
								style={{
									fontSize: "11px",
									padding: "2px 8px",
									borderRadius: "9999px",
									background: isDirty() ? "rgba(245, 158, 11, 0.12)" : "rgba(34, 197, 94, 0.12)",
									color: isDirty() ? "#d97706" : "#16a34a",
									border: isDirty()
										? "1px solid rgba(245, 158, 11, 0.3)"
										: "1px solid rgba(34, 197, 94, 0.3)",
									fontWeight: 700,
									display: "flex",
									alignItems: "center",
									gap: "4px",
								}}
							>
								{isDirty() ? (
									<>
										<Clock size={11} />
										<span>DIRTY (Uncomputed)</span>
									</>
								) : (
									<>
										<CheckCircle size={11} />
										<span>CLEAN (Cached)</span>
									</>
								)}
							</span>
						</div>
					</div>

					{/* Execution Metrics */}
					<div
						style={{
							display: "flex",
							gap: "16px",
							fontSize: "12px",
							color: "var(--text-muted)",
							fontFamily: "var(--font-mono)",
							background: "var(--surface-glass)",
							padding: "6px 14px",
							borderRadius: "8px",
							border: "1px solid var(--border-subtle)",
						}}
					>
						<span>Calculations Executed: <strong style={{ color: "var(--pink-600)" }}>{computeRunCount}</strong></span>
						<span>Pending Dirtiness: <strong style={{ color: isDirty() ? "#d97706" : "var(--text-muted)" }}>{() => isDirty() ? "YES" : "NO"}</strong></span>
					</div>

					{/* Action Controls */}
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
							onClick={() => updateSignalA(1)}
						>
							<Plus size={14} />
							<span>Update Signal A (+1)</span>
						</button>

						<button
							className="doc-btn doc-btn-secondary"
							onClick={() => updateSignalA(5)}
						>
							<Sparkles size={14} />
							<span>Update Signal A (+5)</span>
						</button>

						<button
							className="doc-btn"
							style={{
								background: isDirty()
									? "linear-gradient(135deg, #f59e0b, #d97706)"
									: undefined,
								borderColor: isDirty() ? "#b45309" : undefined,
								color: isDirty() ? "#ffffff" : undefined,
							}}
							onClick={readComputeZ}
						>
							<Eye size={14} />
							<span>Read Compute Node Z (Execute Dirty Load)</span>
						</button>

						<button
							className="doc-btn doc-btn-secondary"
							onClick={resetSimulator}
						>
							<RefreshCw size={14} />
							<span>Reset</span>
						</button>
					</div>
				</div>
			</div>

			{/* Basic Syntax & Usage */}
			<h2 id="syntax" className="doc-section-heading">
				Basic Syntax & Usage
			</h2>
			<p className="doc-lead" style={{ fontSize: "15px", marginBottom: "16px" }}>
				To create a computed node, import <code>computed</code> from{" "}
				<code>@epoch32/visage</code> and pass a pure computation function. It
				returns a read-only signal accessor:
			</p>

			<CodeBlock
				filename="computed-basic.ts"
				lang="ts"
				code={`import { createSignal, computed } from "@epoch32/visage";

const [count, setCount] = createSignal(2);

// 1. Declare derived computed node
const double = computed(() => count() * 2);

// 2. Read the computed value by invoking it
console.log(double()); // -> 4

// 3. Update upstream signal
setCount(5);

// double is NOT calculated yet! It will calculate on next read:
console.log(double()); // -> 10`}
			/>

			{/* The Subscriber Tree */}
			<h2 id="subscriber-tree" className="doc-section-heading">
				The Subscriber Tree
			</h2>
			<p className="doc-lead" style={{ fontSize: "15px", marginBottom: "16px" }}>
				Every signal maintains an internal subscriber set of all nodes watching
				it. When a signal changes, it notifies each subscriber in its tree to
				mark itself dirty.
			</p>

			<p className="doc-lead" style={{ fontSize: "15px", marginBottom: "16px" }}>
				This dirtiness propagates recursively down the entire graph:
			</p>

			<CodeBlock
				filename="subscriber-tree.ts"
				lang="ts"
				code={`const [a, setA] = createSignal(1);
const b = computed(() => a() * 2);      // Depends on A
const c = computed(() => b() + 10);     // Depends on B
const d = computed(() => c() ** 2);     // Depends on C

// When A changes, A notifies B, B notifies C, and C notifies D.
// None of them run any math until someone reads d().`}
			/>

			{/* Memoization & Deduplication */}
			<h2 id="memoization" className="doc-section-heading">
				Memoization & Deduplication
			</h2>
			<p className="doc-lead" style={{ fontSize: "15px", marginBottom: "16px" }}>
				Once computed, a node caches its output. Subsequent reads return the
				cached value directly without calling your function:
			</p>

			<div className="doc-callout">
				<div className="doc-callout-icon">
					<Sparkles size={18} color="var(--pink-500)" />
				</div>
				<div className="doc-callout-body">
					<div className="doc-callout-title">Glitch-Free Guarantee</div>
					If a computed node depends on multiple signals that change within the
					same microtask batch, Visage topological versioning ensures the
					computed value never executes against an inconsistent intermediate
					state.
				</div>
			</div>

			{/* Dynamic Dependencies */}
			<h2 id="dynamic-dependencies" className="doc-section-heading">
				Dynamic Dependency Pruning
			</h2>
			<p className="doc-lead" style={{ fontSize: "15px", marginBottom: "16px" }}>
				Dependencies are not static. During each execution, Visage tracks
				precisely which signals were read during that specific run. Branches
				that were not taken unsubscribe automatically:
			</p>

			<CodeBlock
				filename="dynamic-dependencies.ts"
				lang="ts"
				code={`const [showAdmin, setShowAdmin] = createSignal(false);
const [userStats, setUserStats] = createSignal({ visits: 42 });
const [adminStats, setAdminStats] = createSignal({ revenue: 9999 });

const dashboardData = computed(() => {
  if (showAdmin()) {
    return adminStats(); // Subscribes to adminStats
  }
  return userStats();   // Subscribes to userStats
});

// While showAdmin() is false, changing adminStats() will NOT mark dashboardData dirty!`}
			/>

			{/* API Reference */}
			<h2 id="api-reference" className="doc-section-heading">
				API Reference
			</h2>

			<div className="doc-api-section">
				{/* Function: computed */}
				<div className="doc-fn-card">
					<div className="doc-fn-header">
						<div className="doc-fn-meta">
							<span className="doc-fn-kind">Function</span>
						</div>
						<div className="doc-fn-signature">
							computed&lt;T&gt;(fn: () =&gt; T, options?: ComputedOptions): ReadonlySignal&lt;T&gt;
						</div>
					</div>

					<div className="doc-fn-body">
						<div className="doc-fn-desc">
							Creates a lazy, memoized, glitch-free derived reactive signal.
							Recalculates on demand only when accessed after an upstream
							dependency has marked it dirty.
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
										The pure reactive computation function whose return value is derived and cached.
									</div>
								</div>

								<div className="doc-param-row">
									<div className="doc-param-meta">
										<span className="doc-param-name">options.name</span>
										<span className="doc-param-type">string</span>
										<span className="doc-param-badge optional">Optional</span>
									</div>
									<div className="doc-param-desc">
										Optional debug name displayed in the Visage DAG DevTools graph.
									</div>
								</div>
							</div>
						</div>

						<div>
							<div className="doc-fn-subheading">Returns</div>
							<div className="doc-returns-card">
								<div className="doc-returns-header">
									<span className="doc-returns-type">ReadonlySignal&lt;T&gt;</span>
								</div>
								<div className="doc-param-desc">
									A read-only accessor function <code>() =&gt; T</code> with <code>.value</code> property getter support.
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Alias: createMemo */}
				<div className="doc-fn-card">
					<div className="doc-fn-header">
						<div className="doc-fn-meta">
							<span className="doc-fn-kind">Alias</span>
						</div>
						<div className="doc-fn-signature">
							createMemo&lt;T&gt;(fn: () =&gt; T, options?: ComputedOptions): ReadonlySignal&lt;T&gt;
						</div>
					</div>

					<div className="doc-fn-body">
						<div className="doc-fn-desc">
							A drop-in, Solid-compatible alias for <code>computed</code>. Identical in performance, semantics, and behavior.
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
