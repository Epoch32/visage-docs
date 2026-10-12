import { createSignal } from "@epoch32/visage";
import { Play, Plus, RefreshCw, Sparkles, Zap } from "lucide-react";

export function SignalPlayground() {
	const [count, setCount] = createSignal(0);
	const [step, setStep] = createSignal(1);

	return (
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
	);
}
