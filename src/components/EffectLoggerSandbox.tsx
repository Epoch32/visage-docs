import { createSignal, effect } from "@epoch32/visage";
import { Play, Plus, Power, RefreshCw } from "lucide";

export function EffectLoggerSandbox() {
	const [active, setActive] = createSignal(true);
	const [frequency, setFrequency] = createSignal(1);
	const [logs, setLogs] = createSignal<string[]>([]);

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
						<span>{() => (active() ? "Status: Active" : "Status: Paused")}</span>
					</button>

					<button
						className="doc-btn doc-btn-secondary"
						onClick={() => setFrequency((f) => (f >= 5 ? 1 : f + 1))}
					>
						<Plus size={14} />
						<span>Cycle Frequency ({frequency}x)</span>
					</button>

					<button className="doc-btn doc-btn-secondary" onClick={clearLogs}>
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
							<div
								style={{
									color: "var(--text-faint)",
									fontStyle: "italic",
								}}
							>
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
	);
}
