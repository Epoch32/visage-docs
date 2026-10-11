export interface NavItem {
  id: string;
  title: string;
  badge?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navigationSections: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      { id: "introduction", title: "Introduction" },
      { id: "quickstart", title: "Quickstart" },
      { id: "philosophy", title: "Zero-VDOM Architecture" },
      { id: "typescript", title: "TypeScript Setup" }
    ]
  },
  {
    title: "Reactivity",
    items: [
      { id: "signals", title: "Signals (createSignal)" },
      { id: "computed", title: "Derived State (computed)" },
      { id: "effects", title: "Side Effects (effect)" },
      { id: "store", title: "Deep State (createStore)", badge: "New" },
      { id: "batch-scope", title: "Batching & Scopes" }
    ]
  },
  {
    title: "DOM & Control Flow",
    items: [
      { id: "rendering", title: "Fine-Grained DOM (render)" },
      { id: "control-flow", title: "<Show>, <For>, <Switch>" },
      { id: "portals-suspense", title: "<Portal> & <Suspense>" },
      { id: "template-literals", title: "HTML Template Literals" }
    ]
  },
  {
    title: "Spatial & Styles",
    items: [
      { id: "spatial-engine", title: "4px Spatial Grid Engine" },
      { id: "layout-primitives", title: "<Stack>, <Row>, <Grid>" },
      { id: "tactile-glass", title: "Tactile Glass & Shadows" }
    ]
  },
  {
    title: "Headless UI & Charts",
    items: [
      { id: "ui-primitives", title: "Accessible UI Components" },
      { id: "charts", title: "Reactive SVG Charts", badge: "v1.0" },
      { id: "virtual-lists", title: "Virtualizer (100k+ Rows)" }
    ]
  },
  {
    title: "Full-Stack & Tools",
    items: [
      { id: "file-api", title: "Opinionated File-Based API" },
      { id: "rpc-sse", title: "End-to-End Typed RPC & SSE" },
      { id: "devtools", title: "Live DAG Graph DevTools" },
      { id: "vite-plugin", title: "Vite Plugin & Fast HMR" }
    ]
  }
];

interface SidebarProps {
  activeId: () => string;
  onSelect: (id: string) => void;
}

export function Sidebar(props: SidebarProps) {
  return (
    <aside
      style={{
        width: "270px",
        height: "calc(100vh - 128px)",
        position: "sticky",
        top: "84px",
        margin: "32px 0 32px 24px",
        overflowY: "auto",
        padding: "24px 16px 32px 20px",
        background: "var(--surface-card)",
        borderRadius: "16px",
        border: "1px solid var(--border-pink)",
        boxShadow: "var(--shadow-card)",
        backdropFilter: "blur(12px)"
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {navigationSections.map((section) => (
          <div key={section.title}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text-muted)",
                marginBottom: "8px",
                paddingLeft: "10px"
              }}
            >
              {section.title}
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {section.items.map((item) => {
                const isActive = () => props.activeId() === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => props.onSelect(item.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      textAlign: "left",
                      padding: "7px 12px",
                      borderRadius: "8px",
                      fontSize: "13.5px",
                      fontWeight: isActive() ? 600 : 500,
                      color: isActive() ? "#be185d" : "var(--text-body)",
                      background: isActive() ? "var(--pink-badge-bg)" : "transparent",
                      border: isActive() ? "1px solid var(--pink-200)" : "1px solid transparent",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      outline: "none"
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {isActive() && (
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: "var(--pink-500)",
                            boxShadow: "0 0 8px rgba(236, 72, 153, 0.8)"
                          }}
                        />
                      )}
                      <span>{item.title}</span>
                    </span>

                    {item.badge && (
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          padding: "1px 6px",
                          borderRadius: "9999px",
                          background: "var(--pink-100)",
                          color: "var(--pink-600)",
                          border: "1px solid var(--pink-200)"
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}
