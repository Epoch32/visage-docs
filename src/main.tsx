import { render } from "@epoch32/visage/dom";
import { createSignal } from "@epoch32/visage/signals";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { TableOfContents } from "./components/TableOfContents";
import { CodeBlock } from "./components/CodeBlock";

function App() {
  const [activeSection, setActiveSection] = createSignal("introduction");

  const sampleToc = [
    { id: "overview", title: "Overview", level: 2 },
    { id: "key-features", title: "Key Features", level: 2 },
    { id: "quickstart", title: "Quickstart Example", level: 2 }
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <div
        style={{
          display: "flex",
          maxWidth: "1440px",
          width: "100%",
          margin: "0 auto",
          flex: 1
        }}
      >
        {/* Left Navigation Sidebar */}
        <Sidebar activeId={activeSection} onSelect={(id) => setActiveSection(id)} />

        {/* Center Main Content Area */}
        <main
          style={{
            flex: 1,
            padding: "32px 24px",
            maxWidth: "880px"
          }}
        >
          {/* Main Card Surface */}
          <article
            style={{
              background: "var(--surface-card)",
              borderRadius: "16px",
              padding: "40px 44px",
              border: "1px solid var(--border-pink)",
              boxShadow: "var(--shadow-card)"
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--pink-600)",
                background: "var(--pink-50)",
                border: "1px solid var(--pink-200)",
                borderRadius: "9999px",
                padding: "3px 10px",
                marginBottom: "16px"
              }}
            >
              <span>Documentation</span>
              <span>/</span>
              <span>Getting Started</span>
            </div>

            <h1
              id="overview"
              style={{
                fontSize: "36px",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "var(--text-main)",
                marginBottom: "12px",
                lineHeight: 1.2
              }}
            >
              Introduction to Visage
            </h1>

            <p
              style={{
                fontSize: "17px",
                lineHeight: 1.6,
                color: "var(--text-body)",
                marginBottom: "28px"
              }}
            >
              Visage is a lightning-fast, zero-VDOM, fine-grained reactive UI library for TypeScript.
              Components run exactly once to build a surgical DOM dependency graph—subsequent state changes
              update precise text nodes and attributes directly with microsecond latency.
            </p>

            <h2
              id="key-features"
              style={{
                fontSize: "22px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--text-main)",
                marginTop: "32px",
                marginBottom: "14px"
              }}
            >
              Core Architecture
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "32px"
              }}
            >
              <div
                style={{
                  background: "var(--surface-glass)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "12px",
                  padding: "18px 20px"
                }}
              >
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)", marginBottom: "4px" }}>
                  Zero Virtual DOM
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.5 }}>
                  Real DOM nodes clone in nanoseconds via native template cloning. No fiber trees, diffing algorithms, or VNode allocations.
                </div>
              </div>

              <div
                style={{
                  background: "var(--surface-glass)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "12px",
                  padding: "18px 20px"
                }}
              >
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)", marginBottom: "4px" }}>
                  Fine-Grained Reactivity
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.5 }}>
                  Glitch-free push/pull state graph. State reads register dynamic subscriptions; updates trigger only the exact bindings that changed.
                </div>
              </div>
            </div>

            <h2
              id="quickstart"
              style={{
                fontSize: "22px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--text-main)",
                marginTop: "32px",
                marginBottom: "14px"
              }}
            >
              Quickstart Example
            </h2>

            <CodeBlock
              filename="Counter.tsx"
              lang="tsx"
              code={`import { render } from "@epoch32/visage/dom";
import { createSignal } from "@epoch32/visage/signals";

function Counter() {
  const [count, setCount] = createSignal(0);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count is: {count}
    </button>
  );
}

render(() => <Counter />, document.getElementById("app")!);`}
            />
          </article>
        </main>

        {/* Right Table of Contents */}
        <TableOfContents items={sampleToc} />
      </div>
    </div>
  );
}

const root = document.getElementById("app");
if (root) {
  render(() => <App />, root);
}
