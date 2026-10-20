import { createSignal, For, Link, Show } from "@epoch32/visage";
import { Search } from "lucide";
import { getDocPage } from "../docs";
import "../styles/sidebar.css";

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
			{ id: "comparison", title: "Framework Comparison" },
			{ id: "typescript", title: "TypeScript Setup" },
			{ id: "roadmap", title: "Roadmap" },
		],
	},
	{
		title: "Reactivity Core",
		items: [
			{ id: "signals", title: "Signals (createSignal)" },
			{ id: "computed", title: "Derived State (computed)" },
			{ id: "effects", title: "Side Effects (effect)" },
			{ id: "store", title: "Deep State (createStore)" },
			{ id: "batch-scope", title: "Batching & Scopes" },
		],
	},
	{
		title: "DOM & Control Flow",
		items: [
			{ id: "rendering", title: "Fine-Grained DOM (render)" },
			{ id: "control-flow", title: "<Show>, <For> & <Index>" },
			{ id: "portals-suspense", title: "<Portal> & <Suspense>" },
			{ id: "spa-router", title: "SPA Router (<Router>)" },
			{ id: "template-literals", title: "HTML Template Literals" },
		],
	},
	{
		title: "Spatial & Styles",
		items: [
			{ id: "spatial-engine", title: "4px Spatial Grid Engine" },
			{ id: "layout-primitives", title: "<Stack>, <Row>, <Grid>" },
			{ id: "tactile-glass", title: "Tactile Glass & Shadows" },
		],
	},
	{
		title: "Headless UI & Data",
		items: [
			{ id: "ui-primitives", title: "Accessible UI Components" },
			{ id: "forms", title: "Reactive Forms & Validation" },
			{ id: "io-primitives", title: "IO & Drag-and-Drop" },
			{ id: "charts", title: "Reactive SVG Charts" },
			{ id: "virtual-lists", title: "Virtualizer (100k+ Rows)" },
		],
	},
	{
		title: "Full-Stack & Tools",
		items: [
			{ id: "query", title: "Async Query & Mutations" },
			{ id: "ssr", title: "Server-Side Rendering (SSR)" },
			{ id: "native", title: "Native Desktop Bridge" },
			{ id: "file-api", title: "Opinionated File-Based API" },
			{ id: "mpa-pages", title: "Opinionated MPA Pages" },
			{ id: "rpc-sse", title: "End-to-End Typed RPC & SSE" },
			{ id: "i18n", title: "I18n & Community Sync" },
			{ id: "devtools", title: "Live DAG Graph DevTools" },
			{ id: "vite-plugin", title: "Vite Plugin & Build Tooling" },
		],
	},
];

interface SidebarProps {
	activeId: () => string;
	onSelect?: (id: string) => void;
}

export function Sidebar(props: SidebarProps) {
	const [filterText, setFilterText] = createSignal("");

	const filteredSections = () => {
		const q = filterText().trim().toLowerCase();
		if (!q) return navigationSections;

		return navigationSections
			.map((section) => ({
				...section,
				items: section.items.filter(
					(item) =>
						item.title.toLowerCase().includes(q) || item.id.toLowerCase().includes(q),
				),
			}))
			.filter((section) => section.items.length > 0);
	};

	return (
		<aside class="sidebar-docked">
			{/* Quick Filter */}
			<div class="sidebar-filter-box">
				<div class="sidebar-filter-input-wrap">
					<Search size={13} />
					<input
						type="text"
						class="sidebar-filter-input"
						placeholder="Filter topics..."
						value={filterText}
						onInput={(e: any) => setFilterText(e.target.value)}
					/>
				</div>
			</div>

			{/* Navigation List */}
			<div class="sidebar-scroll sidebar-scroll-wrapper">
				<div class="sidebar-sections">
					<For each={filteredSections}>
						{(section) => (
							<div class="sidebar-section-group">
								<div class="sidebar-section-title">{section.title}</div>

								<nav class="sidebar-nav-list">
									<For each={() => section.items}>
										{(item) => (
											<Link
												href={`/${item.id}`}
												class={() =>
													`sidebar-nav-item ${props.activeId() === item.id ? "active" : ""}`
												}
												onPointerEnter={() => {
													getDocPage(item.id)?.preload();
												}}
												onClick={() => {
													if (typeof window !== "undefined") {
														window.scrollTo({ top: 0, behavior: "instant" });
													}
													props.onSelect?.(item.id);
												}}
											>
												<span
													style={{
														display: "flex",
														alignItems: "center",
														gap: "7px",
													}}
												>
													<span class="sidebar-active-indicator" />
													<span>{item.title}</span>
												</span>

												<Show when={() => Boolean(item.badge)}>
													<span class="sidebar-badge">
														{item.badge}
													</span>
												</Show>
											</Link>
										)}
									</For>
								</nav>
							</div>
						)}
					</For>
				</div>
			</div>
		</aside>
	);
}
