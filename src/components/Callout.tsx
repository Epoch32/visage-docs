import { AlertCircle, AlertTriangle, HelpCircle, Sparkles } from "lucide";
import "../styles/doc-content.css";

export interface CalloutProps {
	type?: "info" | "warning" | "tip" | "danger";
	title?: string;
	tag?: string;
	children: any;
}

export function Callout(props: CalloutProps) {
	const type = props.type ?? "info";

	const getIcon = () => {
		switch (type) {
			case "warning":
			case "danger":
				return <AlertTriangle size={18} color="var(--pink-500)" />;
			case "tip":
				return <Sparkles size={18} color="var(--pink-500)" />;
			case "info":
			default:
				return <HelpCircle size={18} color="var(--pink-500)" />;
		}
	};

	const getTitle = () => {
		if (props.title) return props.title;
		switch (type) {
			case "warning":
				return "Warning";
			case "danger":
				return "Caution";
			case "tip":
				return "Tip";
			case "info":
			default:
				return "Note";
		}
	};

	return (
		<div class="doc-callout">
			<div class="doc-callout-icon">{getIcon()}</div>
			<div class="doc-callout-body">
				<div class="doc-callout-title">
					<span>{getTitle()}</span>
					{props.tag && <span class="doc-callout-tag">{props.tag}</span>}
				</div>
				<div>{props.children}</div>
			</div>
		</div>
	);
}
