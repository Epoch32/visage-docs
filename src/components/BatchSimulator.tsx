import { batch, createSignal, effect } from "@epoch32/visage";
import { Play, RefreshCw, Zap } from "lucide-react";

export function BatchSimulator() {
	const [countA, setCountA] = createSignal(0);
	const [countB, setCountB] = createSignal(0);
	const [runsWithoutBatch, setRunsWithoutBatch] = createSignal(0);
	const [runsWithBatch, setRunsWithBatch] = createSignal(0);
	const [eventLogs, setEventLogs] = createSignal<string[]>([]);

	effect(() => {
		const a = countA();
		const b = countB();
		if (a > 0 || b > 0) {
			setEventLogs((prev) => [
				`[${new Date().toLocaleTimeString()}] Downstream Effect Triggered! (A=${a}, B=${b})`,
				...prev.slice(0, 5),
			]);
		}
	});

	const triggerUnbatched = () => {
		setEventLogs((prev) => [
			`--- Starting Unbatched Mutations ---`,
			...prev.slice(0, 5),
		]);
		setRunsWithoutBatch((c) => c + 2);
		setCountA((a) => a + 1);
		setCountB((b) => b + 1);
	};

	const triggerBatched = () => {
		setEventLogs((prev) => [
			`--- Starting Batched Mutation ---`,
			...prev.slice(0, 5),
		]);
		setRunsWithBatch((c) => c + 1);
		batch(() => {
			setCountA((a) => a + 1);
			setCountB((b) => b + 1);
		});
	};

	const resetDemo = () => {
		batch(() => {
			setCountA(0);
			setCountB(0);
			setRunsWithoutBatch(0);
			setRunsWithBatch(0);
			setEventLogs([]);
		});
	};

	return (
		<div className="doc-playground">
			<div className="doc-playground-header">
				<span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
					<Play size={14} />
					<span>Live Batching vs Sequential Dispatcher</span>
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
					Atomic Scheduling
				</span>
			</div>

			<div className="doc-playground-body">
				{/* State Cards */}
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "1fr 1fr",
						gap: "16px",
						width: "100%",
						maxWidth: "600px",
					}}
				>
					<div
						style={{
							padding: "16px 20px",
							background: "var(--surface-card)",
							borderRadius: "14px",
							border: "1px solid var(--border-pink)",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							gap: "6px",
						}}
					>
						<span
							style={{
								fontSize: "11px",
								fontWeight: 700,
								textTransform: "uppercase",
								color: "var(--text-muted)",
							}}
						>
							Signal A
						</span>
						<span
							style={{
								fontFamily: "var(--font-mono)",
								fontSize: "32px",
								fontWeight: 800,
								color: "var(--pink-600)",
							}}
						>
							{countA}
						</span>
					</div>

					<div
						style={{
							padding: "16px 20px",
							background: "var(--surface-card)",
							borderRadius: "14px",
							border: "1px solid var(--border-pink)",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							gap: "6px",
						}}
					>
						<span
							style={{
								fontSize: "11px",
								fontWeight: 700,
								textTransform: "uppercase",
								color: "var(--text-muted)",
							}}
						>
							Signal B
						</span>
						<span
							style={{
								fontFamily: "var(--font-mono)",
								fontSize: "32px",
								fontWeight: 800,
								color: "var(--pink-600)",
							}}
						>
							{countB}
						</span>
					</div>
				</div>

				{/* Buttons */}
				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						gap: "10px",
						justifyContent: "center",
					}}
				>
					<button
						className="doc-btn doc-btn-secondary"
						onClick={triggerUnbatched}
					>
						<span>Mutate Sequentially (No Batch)</span>
					</button>

					<button className="doc-btn" onClick={triggerBatched}>
						<Zap size={14} />
						<span>Mutate with batch()</span>
					</button>

					<button className="doc-btn doc-btn-secondary" onClick={resetDemo}>
						<RefreshCw size={14} />
						<span>Reset</span>
					</button>
				</div>

				{/* Live Execution Stream */}
				<div
					style={{
						width: "100%",
						maxWidth: "600px",
						background: "var(--code-bg)",
						color: "var(--code-text)",
						borderRadius: "12px",
						padding: "16px 20px",
						fontFamily: "var(--font-mono)",
						fontSize: "12px",
						lineHeight: "1.6",
						border: "1px solid rgba(244, 167, 187, 0.2)",
						minHeight: "120px",
					}}
				>
					<div
						style={{
							borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
							paddingBottom: "6px",
							marginBottom: "8px",
							color: "var(--text-faint)",
							fontSize: "11px",
						}}
					>
						DOWNSTREAM DISPATCH LOG
					</div>
					{() =>
						eventLogs().length === 0 ? (
							<div
								style={{
									color: "var(--text-faint)",
									fontStyle: "italic",
								}}
							>
								Click a mutation button above to view effect trigger timings.
							</div>
						) : (
							eventLogs().map((log) => (
								<div
									style={{
										color: log.includes("Batched")
											? "#34d399"
											: log.includes("Unbatched")
												? "#f472b6"
												: "#f1f5f9",
									}}
								>
									{log}
								</div>
							))
						)
					}
				</div>
			</div>
		</div>
	);
}
