import { Tabs, TabsList, TabsTrigger } from "@epoch32/visage";
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
			{ id: "typescript", title: "TypeScript Setup" },
		],
	},
	{
		title: "Reactivity",
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
			{ id: "control-flow", title: "<Show> & <For>" },
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
		title: "Headless UI & Charts",
		items: [
			{ id: "ui-primitives", title: "Accessible UI Components" },
			{ id: "charts", title: "Reactive SVG Charts" },
			{ id: "virtual-lists", title: "Virtualizer (100k+ Rows)" },
		],
	},
	{
		title: "Full-Stack & Tools",
		items: [
			{ id: "file-api", title: "Opinionated File-Based API" },
			{ id: "rpc-sse", title: "End-to-End Typed RPC & SSE" },
			{ id: "devtools", title: "Live DAG Graph DevTools" },
			{ id: "vite-plugin", title: "Vite Plugin & Fast HMR" },
		],
	},
];

interface SidebarProps {
	activeId: () => string;
	onSelect: (id: string) => void;
}

export function Sidebar(props: SidebarProps) {
	return (
		<aside class="sidebar-container">
			<div class="sidebar-scroll sidebar-scroll-wrapper">
				<Tabs
					value={props.activeId}
					onValueChange={props.onSelect}
					orientation="vertical"
					class="sidebar-sections"
				>
					{() => (
						<TabsList class="sidebar-tabs-list">
							{navigationSections.map((section) => (
								<div class="sidebar-section-group">
									<div class="sidebar-section-title">{section.title}</div>

									<nav class="sidebar-nav-list">
										{section.items.map((item) => (
											<TabsTrigger value={item.id} class="sidebar-nav-item">
												<span
													style={{
														display: "flex",
														alignItems: "center",
														gap: "8px",
													}}
												>
													<span class="sidebar-active-indicator" />
													<span>{item.title}</span>
												</span>

												{item.badge && (
													<span class="sidebar-badge">{item.badge}</span>
												)}
											</TabsTrigger>
										))}
									</nav>
								</div>
							))}
						</TabsList>
					)}
				</Tabs>
			</div>
		</aside>
	);
}
