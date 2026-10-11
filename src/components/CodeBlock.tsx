import { createSignal } from "@epoch32/visage";
import { codeToHtml } from "shiki";

interface CodeBlockProps {
  code: string;
  lang?: string;
  filename?: string;
}

export function CodeBlock(props: CodeBlockProps) {
  const [html, setHtml] = createSignal("");
  const [copied, setCopied] = createSignal(false);

  const lang = props.lang ?? "tsx";

  codeToHtml(props.code.trim(), {
    lang,
    theme: "rose-pine-moon"
  }).then((res) => {
    setHtml(res);
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(props.code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid var(--border-pink)",
        boxShadow: "var(--shadow-sm)",
        margin: "20px 0",
        background: "#232136"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          background: "rgba(35, 33, 54, 0.95)",
          borderBottom: "1px solid rgba(244, 167, 187, 0.15)",
          fontSize: "12px",
          fontFamily: "var(--font-mono)",
          color: "var(--pink-300)"
        }}
      >
        <span style={{ fontWeight: 600 }}>{props.filename ?? lang}</span>
        <button
          onClick={handleCopy}
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(244, 167, 187, 0.2)",
            borderRadius: "6px",
            color: "var(--pink-200)",
            padding: "4px 10px",
            fontSize: "11px",
            fontFamily: "var(--font-body)",
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          {() => (copied() ? "Copied!" : "Copy")}
        </button>
      </div>

      <div
        dangerouslySetInnerHTML={() => ({
          __html:
            html() ||
            `<pre class="shiki" style="background-color: #232136; color: #e0def4;"><code>${props.code.trim()}</code></pre>`
        })}
      />
    </div>
  );
}
