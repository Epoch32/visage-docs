import { createSignal, createStore, mutateStore } from "@epoch32/visage";
import { Play, Plus, RefreshCw, Sparkles } from "lucide";

export function StoreSandbox() {
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
							Name:{" "}
							<strong style={{ color: "var(--pink-600)" }}>
								{() => store.user.name}
							</strong>
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
							Commits:{" "}
							<strong style={{ color: "var(--pink-600)" }}>
								{() => store.stats.commits}
							</strong>
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

					<button
						className="doc-btn doc-btn-secondary"
						onClick={incrementCommits}
					>
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
	);
}
