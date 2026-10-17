import { createSignal, computed } from "@epoch32/visage";
import {
	ArrowRight,
	CheckCircle,
	Clock,
	Eye,
	GitBranch,
	Play,
	Plus,
	RefreshCw,
	Sparkles,
} from "lucide";

export function DirtyLoadingSimulator() {
	// Signal A: The root source
	const [signalA, setSignalA] = createSignal(0);

	// Custom interactive state to demonstrate dirty loading:
	const [isDirty, setIsDirty] = createSignal(false);
	const [cachedValue, setCachedValue] = createSignal(0);
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
								background: isDirty()
									? "rgba(245, 158, 11, 0.12)"
									: "rgba(34, 197, 94, 0.12)",
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
					<span>
						Calculations Executed:{" "}
						<strong style={{ color: "var(--pink-600)" }}>
							{computeRunCount}
						</strong>
					</span>
					<span>
						Pending Dirtiness:{" "}
						<strong style={{ color: isDirty() ? "#d97706" : "var(--text-muted)" }}>
							{() => (isDirty() ? "YES" : "NO")}
						</strong>
					</span>
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
					<button className="doc-btn" onClick={() => updateSignalA(1)}>
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

					<button className="doc-btn doc-btn-secondary" onClick={resetSimulator}>
						<RefreshCw size={14} />
						<span>Reset</span>
					</button>
				</div>
			</div>
		</div>
	);
}
