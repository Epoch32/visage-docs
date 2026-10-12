import { For, Show, createSignal } from "@epoch32/visage";
import {
	CheckCircle,
	CheckCircle2,
	Eye,
	Filter,
	Layers,
	ListOrdered,
	Play,
	Plus,
	RotateCcw,
	Sparkles,
	Split,
	Trash2,
	Zap,
} from "lucide-react";
import { CodeBlock } from "../components/CodeBlock";
import type { TocItem } from "../components/TableOfContents";

export const title = "Control Flow (<Show> & <For>)";
export const breadcrumb = "Documentation / DOM & Control Flow";

export const toc: TocItem[] = [
	{ id: "overview", title: "Overview", level: 2 },
	{ id: "show-primitive", title: "Conditional Rendering (<Show>)", level: 2 },
	{ id: "for-primitive", title: "Keyed List Reconciliation (<For>)", level: 2 },
	{ id: "interactive-demo", title: "Interactive Control Flow Sandbox", level: 2 },
	{ id: "type-narrowing", title: "Type Narrowing with Accessor Children", level: 2 },
	{ id: "why-not-map-ternaries", title: "Why Not Ternaries or .map()?", level: 2 },
	{ id: "api-reference", title: "API Reference", level: 2 },
];

interface TodoItem {
	id: number;
	text: string;
	completed: boolean;
}

export default function ControlFlowDoc() {
	// Interactive Demo State
	const [isLoggedIn, setIsLoggedIn] = createSignal(true);
	const [filter, setFilter] = createSignal<"all" | "active" | "completed">("all");
	const [todos, setTodos] = createSignal<TodoItem[]>([
		{ id: 1, text: "Explore Visage reactivity engine", completed: true },
		{ id: 2, text: "Build zero-VDOM components", completed: false },
		{ id: 3, text: "Deploy to Cloudflare Workers", completed: false },
	]);

	const toggleTodo = (id: number) => {
		setTodos((prev) =>
			prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
		);
	};

	const addTodo = () => {
		const newId = Date.now();
		setTodos((prev) => [
			...prev,
			{ id: newId, text: `New task #${prev.length + 1}`, completed: false },
		]);
	};

	const removeTodo = (id: number) => {
		setTodos((prev) => prev.filter((t) => t.id !== id));
	};

	const resetDemo = () => {
		setIsLoggedIn(true);
		setFilter("all");
		setTodos([
			{ id: 1, text: "Explore Visage reactivity engine", completed: true },
			{ id: 2, text: "Build zero-VDOM components", completed: false },
			{ id: 3, text: "Deploy to Cloudflare Workers", completed: false },
		]);
	};

	const filteredTodos = () => {
		const currentFilter = filter();
		const list = todos();
		if (currentFilter === "active") return list.filter((t) => !t.completed);
		if (currentFilter === "completed") return list.filter((t) => t.completed);
		return list;
	};

	return (
		<>
			<p className="doc-lead">
				Because Visage components execute <strong>exactly once</strong> at mount
				time, traditional JavaScript expressions like ternary operators{" "}
				<code>condition ? &lt;A /&gt; : &lt;B /&gt;</code> and{" "}
				<code>items.map()</code> do not automatically re-evaluate when signals
				change. Instead, Visage provides reactive control flow primitives:{" "}
				<code>&lt;Show&gt;</code> and <code>&lt;For&gt;</code>.
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
						<Split size={16} color="var(--pink-500)" />
						<div className="doc-feature-title">Fine-Grained DOM Splicing</div>
					</div>
					<div className="doc-feature-desc">
						<code>&lt;Show&gt;</code> and <code>&lt;For&gt;</code> insert DOM
						comment markers to splice nodes in place, cleanly disposing internal
						reactive scopes when branches hide or items are removed.
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
						<ListOrdered size={16} color="var(--pink-500)" />
						<div className="doc-feature-title">Keyed Item Reuse</div>
					</div>
					<div className="doc-feature-desc">
						<code>&lt;For&gt;</code> reuses existing DOM elements across array
						reorders and mutations. When an item moves or the array is sorted,
						existing DOM nodes simply reposition rather than re-creating.
					</div>
				</div>
			</div>

			{/* Show Primitive */}
			<h2 id="show-primitive" className="doc-section-heading">
				Conditional Rendering (&lt;Show&gt;)
			</h2>
			<p className="doc-lead" style={{ fontSize: "15px", marginBottom: "16px" }}>
				The <code>&lt;Show&gt;</code> component conditionally renders its
				children based on the truthiness of the <code>when</code> prop. It
				supports an optional <code>fallback</code> prop for falsey states:
			</p>

			<CodeBlock
				filename="ShowExample.tsx"
				lang="tsx"
				code={`import { Show, createSignal } from "@epoch32/visage";

function Profile() {
  const [user, setUser] = createSignal<{ name: string } | null>(null);

  return (
    <Show
      when={user}
      fallback={<button onClick={() => setUser({ name: "Alice" })}>Log In</button>}
    >
      {(item) => <div>Welcome back, {item().name}!</div>}
    </Show>
  );
}`}
			/>

			{/* For Primitive */}
			<h2 id="for-primitive" className="doc-section-heading">
				Keyed List Reconciliation (&lt;For&gt;)
			</h2>
			<p className="doc-lead" style={{ fontSize: "15px", marginBottom: "16px" }}>
				The <code>&lt;For&gt;</code> component renders a list of items with
				fine-grained referential stability. The children render callback receives
				the item along with a reactive <code>index</code> accessor function:
			</p>

			<CodeBlock
				filename="ForExample.tsx"
				lang="tsx"
				code={`import { For, createSignal } from "@epoch32/visage";

function FruitList() {
  const [fruits, setFruits] = createSignal(["Apple", "Banana", "Cherry"]);

  return (
    <ul>
      <For each={fruits} fallback={<li>No fruits available</li>}>
        {(fruit, index) => (
          <li>
            #{index() + 1}: {fruit}
          </li>
        )}
      </For>
    </ul>
  );
}`}
			/>

			{/* Interactive Playground Simulator */}
			<h2 id="interactive-demo" className="doc-section-heading">
				Interactive Control Flow Sandbox
			</h2>
			<p className="doc-lead" style={{ fontSize: "15px", marginBottom: "16px" }}>
				This live task dashboard demonstrates both <code>&lt;Show&gt;</code> and{" "}
				<code>&lt;For&gt;</code> in action with dynamic filtering, toggling, and
				disposal:
			</p>

			<div className="doc-playground">
				<div className="doc-playground-header">
					<span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
						<Play size={14} />
						<span>Live &lt;Show&gt; and &lt;For&gt; Playground</span>
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
						Fine-Grained DOM Splicing
					</span>
				</div>

				<div className="doc-playground-body">
					{/* Controls Toolbar */}
					<div
						style={{
							display: "flex",
							flexWrap: "wrap",
							gap: "10px",
							alignItems: "center",
							justifyContent: "space-between",
							width: "100%",
							maxWidth: "600px",
							padding: "12px 16px",
							background: "var(--surface-card)",
							borderRadius: "12px",
							border: "1px solid var(--border-pink)",
						}}
					>
						<button
							className="doc-btn"
							style={{ padding: "6px 14px", fontSize: "12.5px" }}
							onClick={() => setIsLoggedIn((v) => !v)}
						>
							<Eye size={13} />
							<span>{() => isLoggedIn() ? "Simulate Sign Out" : "Sign In"}</span>
						</button>

						<div style={{ display: "flex", gap: "6px" }}>
							{(["all", "active", "completed"] as const).map((mode) => (
								<button
									className="doc-btn doc-btn-secondary"
									style={{
										padding: "4px 10px",
										fontSize: "12px",
										background:
											filter() === mode ? "var(--pink-100)" : undefined,
										color:
											filter() === mode ? "var(--pink-600)" : undefined,
										borderColor:
											filter() === mode ? "var(--pink-300)" : undefined,
										fontWeight: filter() === mode ? 700 : 500,
									}}
									onClick={() => setFilter(mode)}
								>
									{mode.toUpperCase()}
								</button>
							))}
						</div>

						<button
							className="doc-btn doc-btn-secondary"
							style={{ padding: "6px 12px", fontSize: "12.5px" }}
							onClick={addTodo}
						>
							<Plus size={13} />
							<span>Add Task</span>
						</button>
					</div>

					{/* Task List Container with <Show> and <For> */}
					<div
						style={{
							width: "100%",
							maxWidth: "600px",
							background: "var(--surface-card)",
							borderRadius: "14px",
							border: "1px solid var(--border-pink)",
							overflow: "hidden",
							boxShadow: "var(--shadow-card)",
						}}
					>
						<Show
							when={isLoggedIn}
							fallback={
								<div
									style={{
										padding: "36px 20px",
										textAlign: "center",
										color: "var(--text-muted)",
										fontSize: "13.5px",
									}}
								>
									<p style={{ marginBottom: "12px" }}>
										You are currently signed out.
									</p>
									<button
										className="doc-btn"
										onClick={() => setIsLoggedIn(true)}
									>
										Sign In to View Tasks
									</button>
								</div>
							}
						>
							<div
								style={{
									padding: "12px 18px",
									borderBottom: "1px solid var(--border-subtle)",
									fontSize: "12px",
									fontWeight: 700,
									textTransform: "uppercase",
									color: "var(--text-muted)",
									letterSpacing: "0.05em",
									display: "flex",
									justifyContent: "space-between",
								}}
							>
								<span>Active Tasks ({() => filteredTodos().length})</span>
								<span>Filter: {() => filter().toUpperCase()}</span>
							</div>

							<div style={{ display: "flex", flexDirection: "column" }}>
								<For
									each={filteredTodos}
									fallback={
										<div
											style={{
												padding: "24px",
												textAlign: "center",
												color: "var(--text-muted)",
												fontSize: "13px",
											}}
										>
											No tasks match the current filter.
										</div>
									}
								>
									{(item, idx) => (
										<div
											style={{
												display: "flex",
												alignItems: "center",
												justifyContent: "space-between",
												padding: "12px 18px",
												borderBottom: "1px solid var(--border-subtle)",
												background: "var(--surface-glass)",
											}}
										>
											<div
												style={{
													display: "flex",
													alignItems: "center",
													gap: "10px",
													cursor: "pointer",
												}}
												onClick={() => toggleTodo(item.id)}
											>
												<span
													style={{
														width: "18px",
														height: "18px",
														borderRadius: "6px",
														border: item.completed
															? "1px solid var(--pink-500)"
															: "1px solid var(--border-subtle)",
														background: item.completed
															? "var(--pink-500)"
															: "transparent",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														color: "#ffffff",
														fontSize: "12px",
														transition: "all 0.15s ease",
													}}
												>
													{item.completed ? "✓" : ""}
												</span>

												<span
													style={{
														fontSize: "13.5px",
														textDecoration: item.completed
															? "line-through"
															: "none",
														color: item.completed
															? "var(--text-faint)"
															: "var(--text-main)",
													}}
												>
													{item.text}
												</span>
											</div>

											<div
												style={{
													display: "flex",
													alignItems: "center",
													gap: "12px",
												}}
											>
												<span
													style={{
														fontFamily: "var(--font-mono)",
														fontSize: "11px",
														color: "var(--text-muted)",
													}}
												>
													index: {idx}
												</span>

												<button
													type="button"
													style={{
														background: "transparent",
														border: "none",
														color: "var(--text-muted)",
														cursor: "pointer",
														padding: "4px",
													}}
													onClick={() => removeTodo(item.id)}
													title="Delete task"
												>
													<Trash2 size={14} />
												</button>
											</div>
										</div>
									)}
								</For>
							</div>
						</Show>
					</div>

					<button
						className="doc-btn doc-btn-secondary"
						onClick={resetDemo}
					>
						<RotateCcw size={13} />
						<span>Reset Sandbox</span>
					</button>
				</div>
			</div>

			{/* Type Narrowing with Accessor Children */}
			<h2 id="type-narrowing" className="doc-section-heading">
				Type Narrowing with Accessor Children
			</h2>
			<p className="doc-lead" style={{ fontSize: "15px", marginBottom: "16px" }}>
				In TypeScript, if your <code>when</code> condition evaluates a nullable
				object (such as <code>User | null</code>), you can pass a callback as the
				child. Visage supplies a narrowed accessor <code>() =&gt; User</code>{" "}
				where <code>null</code> and <code>undefined</code> are guaranteed to be
				filtered out:
			</p>

			<CodeBlock
				filename="type-narrowing.tsx"
				lang="tsx"
				code={`interface User {
  id: string;
  name: string;
  email: string;
}

const [currentUser, setCurrentUser] = createSignal<User | null>(null);

<Show when={currentUser} fallback={<div>Guest User</div>}>
  {/* 'user' is guaranteed to be an Accessor<User> (non-null!) */}
  {(user) => (
    <div>
      <h3>{user().name}</h3>
      <p>{user().email}</p>
    </div>
  )}
</Show>`}
			/>

			{/* Why Not Map and Ternaries? */}
			<h2 id="why-not-map-ternaries" className="doc-section-heading">
				Why Not Ternaries or .map()?
			</h2>
			<p className="doc-lead" style={{ fontSize: "15px", marginBottom: "16px" }}>
				Developers coming from React often wonder why standard JavaScript loops
				and conditionals are discouraged in Visage JSX:
			</p>

			<div className="doc-table-wrapper">
				<table className="doc-table">
					<thead>
						<tr>
							<th>Pattern</th>
							<th>React (Virtual DOM)</th>
							<th>Visage (Fine-Grained DOM)</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>items.map()</code></td>
							<td>Re-runs on every render; diffs entire array</td>
							<td>Only runs once on mount; does not track changes</td>
						</tr>
						<tr>
							<td><code>&lt;For each=&#123;items&#125;&gt;</code></td>
							<td>Not standard</td>
							<td>Reuses existing DOM nodes; updates indices surgically</td>
						</tr>
						<tr>
							<td><code>condition ? &lt;A /&gt; : &lt;B /&gt;</code></td>
							<td>Re-evaluated on every component re-render</td>
							<td>Runs once; static unless wrapped in a function</td>
						</tr>
						<tr>
							<td><code>&lt;Show when=&#123;c&#125;&gt;</code></td>
							<td>Not standard</td>
							<td>Creates comment markers; disposes inactive scopes</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div className="doc-callout">
				<div className="doc-callout-icon">
					<Sparkles size={18} color="var(--pink-500)" />
				</div>
				<div className="doc-callout-body">
					<div className="doc-callout-title">The Scope Disposal Guarantee</div>
					When a <code>&lt;Show&gt;</code> flips to false or an item is removed
					from <code>&lt;For&gt;</code>, Visage automatically disposes all
					effects and signal subscriptions created inside that subtree. You never
					have to worry about detached DOM nodes listening to global signals in
					the background.
				</div>
			</div>

			{/* API Reference */}
			<h2 id="api-reference" className="doc-section-heading">
				API Reference
			</h2>

			<div className="doc-api-section">
				{/* Component: <Show> */}
				<div className="doc-fn-card">
					<div className="doc-fn-header">
						<div className="doc-fn-meta">
							<span className="doc-fn-kind">Component</span>
						</div>
						<div className="doc-fn-signature">
							&lt;Show&lt;T&gt; when=&#123;ReactiveValue&lt;T&gt;&#125; fallback=&#123;Child&#125;&gt;&#123;children&#125;&lt;/Show&gt;
						</div>
					</div>

					<div className="doc-fn-body">
						<div className="doc-fn-desc">
							Conditionally mounts JSX children when the <code>when</code> condition
							evaluates to a truthy value. Manages fine-grained scope disposal
							when switching branches.
						</div>

						<div>
							<div className="doc-fn-subheading">Props</div>
							<div className="doc-params-list">
								<div className="doc-param-row">
									<div className="doc-param-meta">
										<span className="doc-param-name">when</span>
										<span className="doc-param-type">ReactiveValue&lt;T | false | null | undefined&gt;</span>
										<span className="doc-param-badge required">Required</span>
									</div>
									<div className="doc-param-desc">
										The reactive condition signal or accessor to observe.
									</div>
								</div>

								<div className="doc-param-row">
									<div className="doc-param-meta">
										<span className="doc-param-name">fallback</span>
										<span className="doc-param-type">Child</span>
										<span className="doc-param-badge optional">Optional</span>
									</div>
									<div className="doc-param-desc">
										Fallback JSX rendered when the condition is falsy.
									</div>
								</div>

								<div className="doc-param-row">
									<div className="doc-param-meta">
										<span className="doc-param-name">children</span>
										<span className="doc-param-type">Child | ((item: () =&gt; T) =&gt; Child)</span>
										<span className="doc-param-badge required">Required</span>
									</div>
									<div className="doc-param-desc">
										Child nodes to render, or a function accepting a narrowed accessor for non-null items.
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Component: <For> */}
				<div className="doc-fn-card">
					<div className="doc-fn-header">
						<div className="doc-fn-meta">
							<span className="doc-fn-kind">Component</span>
						</div>
						<div className="doc-fn-signature">
							&lt;For&lt;T&gt; each=&#123;ReactiveValue&lt;readonly T[]&gt;&#125; fallback=&#123;Child&#125;&gt;&#123;(item, index) =&gt; Child&#125;&lt;/For&gt;
						</div>
					</div>

					<div className="doc-fn-body">
						<div className="doc-fn-desc">
							Keyed list renderer that maps an array of items to DOM elements
							with referential stability, reusing existing elements on updates
							and reorders.
						</div>

						<div>
							<div className="doc-fn-subheading">Props</div>
							<div className="doc-params-list">
								<div className="doc-param-row">
									<div className="doc-param-meta">
										<span className="doc-param-name">each</span>
										<span className="doc-param-type">ReactiveValue&lt;readonly T[]&gt;</span>
										<span className="doc-param-badge required">Required</span>
									</div>
									<div className="doc-param-desc">
										The reactive array signal or getter to render.
									</div>
								</div>

								<div className="doc-param-row">
									<div className="doc-param-meta">
										<span className="doc-param-name">fallback</span>
										<span className="doc-param-type">Child</span>
										<span className="doc-param-badge optional">Optional</span>
									</div>
									<div className="doc-param-desc">
										Fallback JSX rendered when the array is empty or null.
									</div>
								</div>

								<div className="doc-param-row">
									<div className="doc-param-meta">
										<span className="doc-param-name">children</span>
										<span className="doc-param-type">(item: T, index: () =&gt; number) =&gt; Child</span>
										<span className="doc-param-badge required">Required</span>
									</div>
									<div className="doc-param-desc">
										Render function called once per item, providing the raw item and a reactive index getter.
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
