import { Edit } from "lucide-react";
import "../styles/toc.css";

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
    <aside className="toc-container">
      <div className="toc-card">
        <div className="toc-header">
          <span className="toc-header-dot" />
          <span>On This Page</span>
        </div>

        <ul className="toc-list">
          {props.items.map((item) => (
            <li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 10}px` }}>
              <a href={`#${item.id}`} className="toc-link">
                {item.title}
              </a>
            </li>
          ))}
        </ul>

        <div className="toc-footer">
          <a
            href="https://github.com/Epoch32/visage-docs/issues/new"
            target="_blank"
            rel="noreferrer"
            className="toc-github-edit"
          >
            <Edit size={12} />
            <span>Edit on GitHub</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
