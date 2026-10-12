import { For } from "@epoch32/visage";
import { Edit } from "lucide-react";
import "../styles/toc.css";

export interface TocItem {
	id: string;
	title: string;
	level: number;
}

interface TableOfContentsProps {
	items: TocItem[] | (() => TocItem[]);
}

export function TableOfContents(props: TableOfContentsProps) {
	const getItems = () =>
		typeof props.items === "function" ? props.items() : props.items;

	return (
		<aside class="toc-container">
			<div class="toc-card">
				<div class="toc-header">
					<span class="toc-header-dot" />
					<span>On This Page</span>
				</div>

				<ul class="toc-list">
					<For each={getItems}>
						{(item) => (
							<li style={{ paddingLeft: `${(item.level - 2) * 10}px` }}>
								<a
									href={`#${item.id}`}
									class="toc-link"
									onClick={(e) => {
										e.preventDefault();
										const target = document.getElementById(item.id);
										if (target) {
											target.scrollIntoView({ behavior: "smooth", block: "start" });
										}
									}}
								>
									{item.title}
								</a>
							</li>
						)}
					</For>
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
