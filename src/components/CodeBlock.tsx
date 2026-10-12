import { createSignal, effect, toast } from "@epoch32/visage";
import { Check, Copy } from "lucide-react";
import { codeToHtml } from "shiki";
import "../styles/codeblock.css";

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
  })
    .then((res) => {
      setHtml(res);
    })
    .catch((err) => {
      console.error("[Shiki] Failed to highlight code:", err);
    });

  const handleCopy = () => {
    navigator.clipboard.writeText(props.code.trim());
    setCopied(true);

    toast.success("Copied to clipboard!", {
      description: props.filename ?? `${lang} snippet`,
      duration: 2500
    });

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="codeblock-container">
      <div className="codeblock-header">
        <span className="codeblock-filename">{props.filename ?? lang}</span>
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
      </div>

      <div
        ref={(el) => {
          if (!el) return;
          effect(() => {
            const content = html();
            if (content) {
              el.innerHTML = content;
            }
          });
        }}
      >
        <pre class="shiki" style="background-color: #232136; color: #e0def4; padding: 18px 20px; margin: 0;">
          <code>{props.code.trim()}</code>
        </pre>
      </div>
    </div>
  );
}
