import { createEffect, createSignal, For, onCleanup } from "@epoch32/visage";
import { Edit } from "lucide";
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
	const [activeId, setActiveId] = createSignal("");

	const getItems = () =>
		typeof props.items === "function" ? props.items() : props.items;

	// Performant scrollspy tracking using IntersectionObserver (zero layout reflow during scroll)
	if (typeof window !== "undefined") {
		let observer: IntersectionObserver | null = null;
		const visibleHeadings = new Set<string>();

		createEffect(() => {
			const items = getItems();
			if (observer) {
				observer.disconnect();
				observer = null;
			}
			visibleHeadings.clear();

			if (!items || items.length === 0) return;

			// Schedule observation after DOM paints new section headings
			requestAnimationFrame(() => {
				observer = new IntersectionObserver(
					(entries) => {
						for (const entry of entries) {
							if (entry.isIntersecting) {
								visibleHeadings.add(entry.target.id);
							} else {
								visibleHeadings.delete(entry.target.id);
							}
						}

						if (visibleHeadings.size > 0) {
							for (const item of items) {
								if (visibleHeadings.has(item.id)) {
									setActiveId(item.id);
									break;
								}
							}
						}
					},
					{
						rootMargin: "-64px 0px -75% 0px",
						threshold: 0,
					}
				);

				for (const item of items) {
					const el = document.getElementById(item.id);
					if (el) {
						observer.observe(el);
					}
				}
			});
		});

		onCleanup(() => {
			if (observer) {
				observer.disconnect();
			}
		});
	}

	return (
		<aside class="toc-docked">
			<div class="toc-docked-inner">
				<div class="toc-header">
					<span class="toc-header-dot" />
					<span>On This Page</span>
				</div>

				<ul class="toc-list">
					<For each={getItems}>
						{(item) => (
							<li style={{ paddingLeft: `${(item.level - 2) * 8}px` }}>
								<a
									href={`#${item.id}`}
									class={() => `toc-link ${activeId() === item.id ? "active" : ""}`}
									onClick={(e) => {
										e.preventDefault();
										if (item.id === "overview") {
											window.scrollTo({ top: 0, behavior: "smooth" });
											return;
										}
										const target = document.getElementById(item.id);
										if (target) {
											target.scrollIntoView({ behavior: "smooth", block: "start" });
										} else {
											window.scrollTo({ top: 0, behavior: "smooth" });
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
