import { createSignal, Show, toast } from "@epoch32/visage";
import { Check, Copy } from "lucide";
import "../styles/codeblock.css";

interface CodeBlockProps {
	code: string;
	lang?: string;
	filename?: string;
	highlightedHtml?: string;
}

export function CodeBlock(props: CodeBlockProps) {
	const [copied, setCopied] = createSignal(false);
	const lang = props.lang ?? "tsx";

	const handleCopy = () => {
		navigator.clipboard.writeText(props.code.trim());
		setCopied(true);

		toast.success("Copied to clipboard!", {
			description: props.filename ?? `${lang} snippet`,
			duration: 2500,
		});

		setTimeout(() => setCopied(false), 2000);
	};

	const showHeader = () =>
		Boolean(props.filename && props.filename !== "signature" && props.filename !== lang);

	return (
		<div className="codeblock-container">
			<Show when={showHeader}>
				<div className="codeblock-header">
					<span className="codeblock-filename">{props.filename}</span>
				</div>
			</Show>

			<button
				type="button"
				onClick={handleCopy}
				className={() => `code-copy-btn ${copied() ? "copied" : ""}`}
				aria-label="Copy code"
				title="Copy code to clipboard"
			>
				{() =>
					copied() ? (
						<span className="code-copy-inner">
							<Check size={12} className="code-copy-icon" />
							<span>Copied!</span>
						</span>
					) : (
						<span className="code-copy-inner">
							<Copy size={12} className="code-copy-icon" />
							<span>Copy</span>
						</span>
					)
				}
			</button>

			<div
				ref={(el) => {
					if (!el) return;
					if (props.highlightedHtml) {
						el.innerHTML = props.highlightedHtml;
					}
				}}
			>
				<Show when={() => !props.highlightedHtml}>
					<pre
						class="shiki"
						style="background-color: #141320; color: #e0def4; padding: 14px 18px; margin: 0;"
					>
						<code>{props.code.trim()}</code>
					</pre>
				</Show>
			</div>
		</div>
	);
}
