import {
	createSignal,
	For,
	Show,
} from "@epoch32/visage";
import {
	BottomBar,
	BottomBarAction,
	BottomBarItem,
} from "@epoch32/visage/ui";
import { BookOpen, ChevronRight, Layers, ListTree, Menu, Search, X, Zap } from "lucide-react";
import { navigationSections } from "./Sidebar";
import type { TocItem } from "./TableOfContents";
import "../styles/mobile-nav.css";

interface MobileNavProps {
	activeId: () => string;
	onSelect: (id: string) => void;
	toc: () => TocItem[];
	onOpenSearch?: () => void;
}

export function MobileNav(props: MobileNavProps) {
	const [drawerOpen, setDrawerOpen] = createSignal(false);
	const [tocOpen, setTocOpen] = createSignal(false);

	const closeAll = () => {
		setDrawerOpen(false);
		setTocOpen(false);
	};

	const handleItemSelect = (id: string) => {
		props.onSelect(id);
		closeAll();
	};

	const handleTocClick = (id: string) => {
		closeAll();
		if (id === "overview") {
			window.scrollTo({ top: 0, behavior: "smooth" });
			return;
		}
		const target = document.getElementById(id);
		if (target) {
			target.scrollIntoView({ behavior: "smooth", block: "start" });
		} else {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const activeCategory = () => {
		const id = props.activeId();
		if (id === "introduction" || id === "quickstart" || id === "philosophy" || id === "typescript") {
			return "intro";
		}
		if (["signals", "computed", "effects", "store", "batch-scope"].includes(id)) {
			return "reactivity";
		}
		if (["rendering", "control-flow", "portals-suspense", "template-literals"].includes(id)) {
			return "dom";
		}
		return "more";
	};

	return (
		<div class="mobile-bottom-nav">
			{/* Bottom Center Floating Toolbar */}
			<BottomBar
				value={activeCategory}
				variant="floating"
			>
				{() => (
					<>
						<BottomBarItem
							value="intro"
							icon={<BookOpen size={18} />}
							label="Intro"
							onClick={() => handleItemSelect("introduction")}
						/>

						<BottomBarItem
							value="reactivity"
							icon={<Zap size={18} />}
							label="Reactivity"
							onClick={() => handleItemSelect("signals")}
						/>

						<BottomBarAction
							icon={() => (drawerOpen() ? <X size={20} /> : <Menu size={20} />)}
							label="All Topics"
							onClick={() => {
								setTocOpen(false);
								setDrawerOpen(!drawerOpen());
							}}
						/>

						<BottomBarItem
							value="dom"
							icon={<Layers size={18} />}
							label="DOM"
							onClick={() => handleItemSelect("control-flow")}
						/>

						<BottomBarItem
							value="toc"
							icon={<ListTree size={18} />}
							label="On Page"
							onClick={() => {
								setDrawerOpen(false);
								setTocOpen(!tocOpen());
							}}
						/>
					</>
				)}
			</BottomBar>

			{/* Backdrop Overlay */}
			<div
				class={() =>
					`mobile-drawer-overlay ${drawerOpen() || tocOpen() ? "open" : ""}`
				}
				onClick={closeAll}
			/>

			{/* Full Topics Navigation Sheet */}
			<div
				class={() =>
					`mobile-drawer-sheet ${drawerOpen() ? "open" : ""}`
				}
			>
				<div class="mobile-drawer-handle" />
				<div class="mobile-drawer-header">
					<span class="mobile-drawer-title">Documentation Menu</span>
					<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
						<button
							type="button"
							class="mobile-drawer-close"
							onClick={() => {
								closeAll();
								props.onOpenSearch?.();
							}}
							aria-label="Search documentation"
							title="Search documentation"
						>
							<Search size={18} />
						</button>
						<button
							type="button"
							class="mobile-drawer-close"
							onClick={closeAll}
							aria-label="Close menu"
						>
							<X size={18} />
						</button>
					</div>
				</div>

				<div class="mobile-drawer-content">
					<For each={() => navigationSections}>
						{(section) => (
							<div class="mobile-nav-group">
								<div class="mobile-nav-group-title">{section.title}</div>
								<div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
									<For each={() => section.items}>
										{(item) => (
											<button
												type="button"
												class={() =>
													`mobile-nav-item-btn ${props.activeId() === item.id ? "active" : ""}`
												}
												onClick={() => handleItemSelect(item.id)}
											>
												<span>{item.title}</span>
												<ChevronRight size={14} color="var(--text-muted)" />
											</button>
										)}
									</For>
								</div>
							</div>
						)}
					</For>
				</div>
			</div>

			{/* On-Page Table of Contents Sheet */}
			<div
				class={() =>
					`mobile-drawer-sheet ${tocOpen() ? "open" : ""}`
				}
			>
				<div class="mobile-drawer-handle" />
				<div class="mobile-drawer-header">
					<span class="mobile-drawer-title">On This Page</span>
					<button
						type="button"
						class="mobile-drawer-close"
						onClick={closeAll}
						aria-label="Close table of contents"
					>
						<X size={18} />
					</button>
				</div>

				<div class="mobile-drawer-content">
					<Show
						when={() => props.toc().length > 0}
						fallback={
							<p style={{ color: "var(--text-muted)", fontSize: "13px", padding: "12px" }}>
								No subsections found on this page.
							</p>
						}
					>
						<div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
							<For each={props.toc}>
								{(item) => (
									<a
										href={`#${item.id}`}
										class="mobile-toc-item"
										style={{ paddingLeft: `${(item.level - 2) * 16 + 12}px` }}
										onClick={(e) => {
											e.preventDefault();
											handleTocClick(item.id);
										}}
									>
										{item.title}
									</a>
								)}
							</For>
						</div>
					</Show>
				</div>
			</div>
		</div>
	);
}
