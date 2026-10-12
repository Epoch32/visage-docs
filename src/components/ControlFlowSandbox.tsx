import { For, Show, createSignal } from "@epoch32/visage";
import { Eye, Play, Plus, RotateCcw, Trash2 } from "lucide-react";

interface TodoItem {
	id: number;
	text: string;
	completed: boolean;
}

export function ControlFlowSandbox() {
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
						<span>{() => (isLoggedIn() ? "Simulate Sign Out" : "Sign In")}</span>
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
									color: filter() === mode ? "var(--pink-600)" : undefined,
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

				<button className="doc-btn doc-btn-secondary" onClick={resetDemo}>
					<RotateCcw size={13} />
					<span>Reset Sandbox</span>
				</button>
			</div>
		</div>
	);
}
