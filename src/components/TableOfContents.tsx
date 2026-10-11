export interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents(props: TableOfContentsProps) {
  return (
    <aside
      style={{
        width: "240px",
        position: "sticky",
        top: "84px",
        height: "fit-content",
        margin: "32px 24px 32px 0"
      }}
    >
      <div
        style={{
          background: "var(--surface-card)",
          borderRadius: "16px",
          padding: "24px 20px",
          border: "1px solid var(--border-pink)",
          boxShadow: "var(--shadow-card)",
          backdropFilter: "blur(12px)"
        }}
      >
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--text-muted)",
            marginBottom: "14px",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--pink-400)"
            }}
          />
          <span>On This Page</span>
        </div>

        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
          {props.items.map((item) => (
            <li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 10}px` }}>
              <a
                href={`#${item.id}`}
                style={{
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  display: "block",
                  fontSize: "13px",
                  lineHeight: 1.4,
                  fontWeight: 500,
                  transition: "all 0.15s ease"
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = "var(--pink-600)";
                  el.style.paddingLeft = "4px";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = "var(--text-muted)";
                  el.style.paddingLeft = "0px";
                }}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>

        <div
          style={{
            marginTop: "20px",
            paddingTop: "14px",
            borderTop: "1px solid var(--border-subtle)"
          }}
        >
          <a
            href="https://github.com/Epoch32/visage-docs/issues/new"
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: "12px",
              color: "var(--text-muted)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: 500,
              transition: "color 0.15s ease"
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--pink-600)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-muted)")}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span>Edit on GitHub</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
