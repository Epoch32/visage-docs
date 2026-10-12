import { createSignal, createStore, mutateStore, unwrapStore } from "@epoch32/visage";
import {
	Boxes,
	Check,
	FolderTree,
	Layers,
	PenTool,
	Play,
	Plus,
	RefreshCw,
	Sparkles,
	Trash2,
	Unlock,
	Zap,
} from "lucide-react";
import { CodeBlock } from "../components/CodeBlock";
import type { TocItem } from "../components/TableOfContents";

export const title = "Deep State (createStore)";
export const breadcrumb = "Documentation / Reactivity";

export const toc: TocItem[] = [
	{ id: "overview", title: "Overview", level: 2 },
	{ id: "interactive-demo", title: "Interactive Store Sandbox", level: 2 },
	{ id: "how-stores-work", title: "How Stores Work: Proxy Architecture", level: 2 },
	{ id: "mutation-patterns", title: "Direct Mutation & Arrays", level: 2 },
	{ id: "batched-mutations", title: "Batched Updates with mutateStore", level: 2 },
	{ id: "unwrapping", title: "Unwrapping Raw Objects", level: 2 },
	{ id: "api-reference", title: "API Reference", level: 2 },
];

export default function StoreDoc() {
	// Interactive deep store sandbox
	const store = createStore({
		user: {
			name: "Alice",
			role: "Engineer",
			status: "Online",
		},
		stats: {
			commits: 42,
			reviews: 15,
		},
	});

	// Metrics tracking independent updates
	const [nameUpdateCount, setNameUpdateCount] = createSignal(0);
	const [commitsUpdateCount, setCommitsUpdateCount] = createSignal(0);

	const updateName = () => {
		const names = ["Alice", "Bob", "Charlie", "Dana", "Evan"];
		const currentIdx = names.indexOf(store.user.name);
		store.user.name = names[(currentIdx + 1) % names.length]!;
		setNameUpdateCount((c) => c + 1);
	};

	const incrementCommits = () => {
		store.stats.commits++;
		setCommitsUpdateCount((c) => c + 1);
	};

	const resetStore = () => {
		mutateStore(store, (draft) => {
			draft.user.name = "Alice";
			draft.user.role = "Engineer";
			draft.user.status = "Online";
			draft.stats.commits = 42;
			draft.stats.reviews = 15;
		});
		setNameUpdateCount(0);
		setCommitsUpdateCount(0);
	};

	return (
		<>
			<p className="doc-lead">
				While signals manage primitive and discrete values, <code>createStore</code>{" "}
				provides deeply reactive proxy trees for objects and arrays. Visage stores
				enable natural, direct mutations while maintaining surgical per-property
				signal subscriptions behind the scenes.
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
						<FolderTree size={16} color="var(--pink-500)" />
						<div className="doc-feature-title">Per-Property Signals</div>
					</div>
					<div className="doc-feature-desc">
						Modifying <code>store.user.name</code> only notifies subscribers
						listening specifically to <code>name</code>. The rest of the object
						tree remains untouched with zero re-rendering overhead.
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
						<PenTool size={16} color="var(--pink-500)" />
						<div className="doc-feature-title">Natural Direct Mutation</div>
					</div>
					<div className="doc-feature-desc">
						No spread operators, immutability helpers, or draft boilerplate.
						Direct assignments like <code>store.count++</code> or{" "}
						<code>store.items.push(item)</code> trigger precise reactive updates.
					</div>
				</div>
			</div>

			{/* Interactive Playground Simulator */}
			<h2 id="interactive-demo" className="doc-section-heading">
				Interactive Store Sandbox
			</h2>
			<p className="doc-lead" style={{ fontSize: "15px", marginBottom: "16px" }}>
				Try modifying individual nested fields below. Notice how changing the
				user's name does not trigger or dirty the commits counter:
			</p>

			<div className="doc-playground">
				<div className="doc-playground-header">
					<span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
						<Play size={14} />
						<span>Live Deep State Store Sandbox</span>
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
						Fine-Grained Proxy
					</span>
				</div>

				<div className="doc-playground-body">
					{/* Nested State Bento Cards */}
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gap: "16px",
							width: "100%",
							maxWidth: "600px",
						}}
					>
						{/* User Card */}
						<div
							style={{
								padding: "16px 20px",
								background: "var(--surface-card)",
								borderRadius: "14px",
								border: "1px solid var(--border-pink)",
								display: "flex",
								flexDirection: "column",
								gap: "8px",
							}}
						>
							<div
								style={{
									fontSize: "11px",
									fontWeight: 700,
									textTransform: "uppercase",
									color: "var(--text-muted)",
									letterSpacing: "0.05em",
								}}
							>
								store.user
							</div>

							<div style={{ fontSize: "14px", color: "var(--text-main)" }}>
								Name: <strong style={{ color: "var(--pink-600)" }}>{() => store.user.name}</strong>
							</div>
							<div style={{ fontSize: "13px", color: "var(--text-body)" }}>
								Role: {() => store.user.role}
							</div>
							<div style={{ fontSize: "13px", color: "var(--text-body)" }}>
								Status: {() => store.user.status}
							</div>

							<div
								style={{
									fontSize: "11px",
									color: "var(--text-muted)",
									marginTop: "6px",
									fontFamily: "var(--font-mono)",
								}}
							>
								Name Updates: {nameUpdateCount}
							</div>
						</div>

						{/* Stats Card */}
						<div
							style={{
								padding: "16px 20px",
								background: "var(--surface-card)",
								borderRadius: "14px",
								border: "1px solid var(--border-pink)",
								display: "flex",
								flexDirection: "column",
								gap: "8px",
							}}
						>
							<div
								style={{
									fontSize: "11px",
									fontWeight: 700,
									textTransform: "uppercase",
									color: "var(--text-muted)",
									letterSpacing: "0.05em",
								}}
							>
								store.stats
							</div>

							<div style={{ fontSize: "14px", color: "var(--text-main)" }}>
								Commits: <strong style={{ color: "var(--pink-600)" }}>{() => store.stats.commits}</strong>
							</div>
							<div style={{ fontSize: "13px", color: "var(--text-body)" }}>
								Code Reviews: {() => store.stats.reviews}
							</div>

							<div
								style={{
									fontSize: "11px",
									color: "var(--text-muted)",
									marginTop: "16px",
									fontFamily: "var(--font-mono)",
								}}
							>
								Commit Updates: {commitsUpdateCount}
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div
						style={{
							display: "flex",
							flexWrap: "wrap",
							gap: "10px",
							justifyContent: "center",
						}}
					>
						<button className="doc-btn" onClick={updateName}>
							<Sparkles size={14} />
							<span>Mutate store.user.name</span>
						</button>

						<button className="doc-btn doc-btn-secondary" onClick={incrementCommits}>
							<Plus size={14} />
							<span>Increment store.stats.commits</span>
						</button>

						<button className="doc-btn doc-btn-secondary" onClick={resetStore}>
							<RefreshCw size={14} />
							<span>Reset Store</span>
						</button>
					</div>
				</div>
			</div>

			{/* How Stores Work: Proxy Architecture */}
			<h2 id="how-stores-work" className="doc-section-heading">
				How Stores Work: Proxy Architecture
			</h2>
			<p className="doc-lead" style={{ fontSize: "15px", marginBottom: "16px" }}>
				In traditional frameworks, updating a deeply nested object requires
				creating copies of every parent object along the tree:
			</p>

			<CodeBlock
				filename="comparison.ts"
				lang="ts"
				code={`// The React / Immutable way (spread copies every level):
setUser(prev => ({
  ...prev,
  profile: {
    ...prev.profile,
    address: {
      ...prev.profile.address,
      city: "Austin"
    }
  }
}));

// The Visage way (direct mutation with surgical proxy interception):
user.profile.address.city = "Austin";`}
			/>

			<p className="doc-lead" style={{ fontSize: "15px", marginBottom: "16px" }}>
				Visage achieves this through a lazy proxy system:
			</p>

			<ul
				style={{
					paddingLeft: "24px",
					fontSize: "14px",
					lineHeight: "1.8",
					color: "var(--text-body)",
					marginBottom: "24px",
				}}
			>
				<li>
					<strong>Lazy Proxy Wrapping:</strong> Nested objects are not wrapped up
					front; they are wrapped on demand as you traverse properties.
				</li>
				<li>
					<strong>Property-Level Signals:</strong> When a property like{" "}
					<code>store.user.name</code> is read inside a computation or JSX
					expression, Visage generates an internal atomic signal for that
					specific property key and registers the subscription.
				</li>
				<li>
					<strong>Deduplicated Writes:</strong> If you assign an identical value
					(<code>store.user.name = store.user.name</code>), Visage uses{" "}
					<code>Object.is</code> equality to prevent redundant downstream
					notifications.
				</li>
			</ul>

			{/* Mutation Patterns & Arrays */}
			<h2 id="mutation-patterns" className="doc-section-heading">
				Direct Mutation & Arrays
			</h2>
			<p className="doc-lead" style={{ fontSize: "15px", marginBottom: "16px" }}>
				Visage stores seamlessly support standard JavaScript array mutation
				methods. Mutating an array automatically updates both individual index
				subscribers and length subscribers:
			</p>

			<CodeBlock
				filename="arrays.ts"
				lang="ts"
				code={`import { createStore } from "@epoch32/visage";

const store = createStore({
  todos: [
    { id: 1, title: "Build fine-grained UI", done: true },
    { id: 2, title: "Deploy to Cloudflare", done: false }
  ]
});

// Mutate items directly:
store.todos[1].done = true;

// Standard array methods work automatically:
store.todos.push({ id: 3, title: "Write documentation", done: false });
store.todos.splice(0, 1);`}
			/>

			{/* Batched Updates with mutateStore */}
			<h2 id="batched-mutations" className="doc-section-heading">
				Batched Updates with mutateStore
			</h2>
			<p className="doc-lead" style={{ fontSize: "15px", marginBottom: "16px" }}>
				When performing multiple related mutations at once, use{" "}
				<code>mutateStore</code>. It wraps all mutations in a synchronous{" "}
				<code>batch()</code>, ensuring effects and subscribers only notify once
				after all mutations complete:
			</p>

			<CodeBlock
				filename="batched-mutation.ts"
				lang="ts"
				code={`import { createStore, mutateStore } from "@epoch32/visage";

const store = createStore({
  counter: 0,
  step: 1,
  status: "idle"
});

// All mutations inside the callback run in a single atomic batch:
mutateStore(store, (draft) => {
  draft.counter += 10;
  draft.step = 5;
  draft.status = "updated";
});`}
			/>

			{/* Unwrapping Raw Objects */}
			<h2 id="unwrapping" className="doc-section-heading">
				Unwrapping Raw Objects
			</h2>
			<p className="doc-lead" style={{ fontSize: "15px", marginBottom: "16px" }}>
				Sometimes you need to pass a clean, un-proxied JavaScript object to an
				external library, web worker, or serialization pipeline. Use{" "}
				<code>unwrapStore</code> to retrieve the raw underlying object:
			</p>

			<CodeBlock
				filename="unwrap.ts"
				lang="ts"
				code={`import { createStore, unwrapStore } from "@epoch32/visage";

const store = createStore({
  config: { theme: "dark", retries: 3 }
});

// Returns the underlying plain JavaScript object without proxy traps:
const rawObject = unwrapStore(store);

// Ideal for structured cloning or posting to Web Workers:
window.postMessage(unwrapStore(store.config), "*");`}
			/>

			{/* API Reference */}
			<h2 id="api-reference" className="doc-section-heading">
				API Reference
			</h2>

			<div className="doc-api-section">
				{/* Function: createStore */}
				<div className="doc-fn-card">
					<div className="doc-fn-header">
						<div className="doc-fn-meta">
							<span className="doc-fn-kind">Function</span>
						</div>
						<div className="doc-fn-signature">
							createStore&lt;T extends object&gt;(initialState: T): Store&lt;T&gt;
						</div>
					</div>

					<div className="doc-fn-body">
						<div className="doc-fn-desc">
							Creates a deeply reactive proxy store with per-property signal
							tracking. Supports direct assignments, nested objects, and array
							mutations.
						</div>

						<div>
							<div className="doc-fn-subheading">Parameters</div>
							<div className="doc-params-list">
								<div className="doc-param-row">
									<div className="doc-param-meta">
										<span className="doc-param-name">initialState</span>
										<span className="doc-param-type">T extends object</span>
										<span className="doc-param-badge required">Required</span>
									</div>
									<div className="doc-param-desc">
										An object or array representing the initial state tree.
									</div>
								</div>
							</div>
						</div>

						<div>
							<div className="doc-fn-subheading">Returns</div>
							<div className="doc-returns-card">
								<div className="doc-returns-header">
									<span className="doc-returns-type">Store&lt;T&gt;</span>
								</div>
								<div className="doc-param-desc">
									A reactive proxy wrapping the state tree. Reading properties
									subscribes to them; writing properties triggers fine-grained
									notifications.
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Function: mutateStore */}
				<div className="doc-fn-card">
					<div className="doc-fn-header">
						<div className="doc-fn-meta">
							<span className="doc-fn-kind">Utility Function</span>
						</div>
						<div className="doc-fn-signature">
							mutateStore&lt;T extends object&gt;(store: Store&lt;T&gt;, mutator: (draft: T) =&gt; void): void
						</div>
					</div>

					<div className="doc-fn-body">
						<div className="doc-fn-desc">
							Executes a mutator callback inside an atomic synchronous batch,
							preventing intermediate updates and triggering subscribers once.
						</div>

						<div>
							<div className="doc-fn-subheading">Parameters</div>
							<div className="doc-params-list">
								<div className="doc-param-row">
									<div className="doc-param-meta">
										<span className="doc-param-name">store</span>
										<span className="doc-param-type">Store&lt;T&gt;</span>
										<span className="doc-param-badge required">Required</span>
									</div>
									<div className="doc-param-desc">The store to mutate.</div>
								</div>

								<div className="doc-param-row">
									<div className="doc-param-meta">
										<span className="doc-param-name">mutator</span>
										<span className="doc-param-type">(draft: T) =&gt; void</span>
										<span className="doc-param-badge required">Required</span>
									</div>
									<div className="doc-param-desc">
										Synchronous callback receiving the store to perform multiple mutations.
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Function: unwrapStore */}
				<div className="doc-fn-card">
					<div className="doc-fn-header">
						<div className="doc-fn-meta">
							<span className="doc-fn-kind">Utility Function</span>
						</div>
						<div className="doc-fn-signature">
							unwrapStore&lt;T&gt;(store: T): T
						</div>
					</div>

					<div className="doc-fn-body">
						<div className="doc-fn-desc">
							Unwraps a reactive store proxy to access the underlying raw,
							un-proxied JavaScript object. Useful for serialization, cloning,
							or third-party libraries.
						</div>

						<div>
							<div className="doc-fn-subheading">Parameters</div>
							<div className="doc-params-list">
								<div className="doc-param-row">
									<div className="doc-param-meta">
										<span className="doc-param-name">store</span>
										<span className="doc-param-type">T</span>
										<span className="doc-param-badge required">Required</span>
									</div>
									<div className="doc-param-desc">The store proxy to unwrap.</div>
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
									The raw underlying JavaScript object.
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
