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
    <nav
      style={{
        width: "220px",
        height: "calc(100vh - 64px)",
        position: "sticky",
        top: "64px",
        padding: "28px 16px 28px 20px",
        fontSize: "13px"
      }}
    >
      <div
        style={{
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--text-muted)",
          marginBottom: "12px"
        }}
      >
        On This Page
      </div>

      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
        {props.items.map((item) => (
          <li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 12}px` }}>
            <a
              href={`#${item.id}`}
              style={{
                color: "var(--text-muted)",
                textDecoration: "none",
                display: "block",
                lineHeight: 1.4,
                transition: "color 0.15s ease"
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--pink-600)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-muted)")}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>

      <div
        style={{
          marginTop: "32px",
          paddingTop: "20px",
          borderTop: "1px solid var(--border-pink)"
        }}
      >
        <a
          href="https://github.com/Epoch32/visage/issues/new"
          target="_blank"
          rel="noreferrer"
          style={{
            fontSize: "12px",
            color: "var(--text-muted)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          <span>Edit this page on GitHub</span>
        </a>
      </div>
    </nav>
  );
}
