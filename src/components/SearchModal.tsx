import {
	createSignal,
	effect,
	For,
	onCleanup,
	Show,
	useNavigate,
} from "@epoch32/visage";
import { CommandDialog } from "@epoch32/visage/ui";
import { BookOpen, FileText, Hash, Search } from "lucide-react";
import { buildSearchIndex, type SearchResultItem } from "../lib/searchIndex";
import "../styles/search-modal.css";

interface SearchModalProps {
	open: () => boolean;
	onOpenChange: (open: boolean) => void;
}

export function SearchModal(props: SearchModalProps) {
	const navigate = useNavigate();
	const [query, setQuery] = createSignal("");
	const [activeIndex, setActiveIndex] = createSignal(0);

	let allItems: SearchResultItem[] = [];

	effect(() => {
		if (props.open()) {
			allItems = buildSearchIndex();
			setQuery("");
			setActiveIndex(0);
		}
	});

	const filteredResults = () => {
		const q = query().trim().toLowerCase();
		if (!q) {
			// Show top pages when search is empty
			return allItems.filter((i) => i.type === "page").slice(0, 10);
		}

		return allItems
			.filter((item) => {
				if (item.title.toLowerCase().includes(q)) return true;
				if (item.category.toLowerCase().includes(q)) return true;
				if (item.keywords.some((k) => k.toLowerCase().includes(q))) return true;
				return false;
			})
			.slice(0, 15);
	};

	const handleSelect = (item: SearchResultItem) => {
		props.onOpenChange(false);
		navigate(item.id);

		if (item.id.includes("#")) {
			const hash = item.id.split("#")[1];
			setTimeout(() => {
				const el = document.getElementById(hash);
				if (el) {
					el.scrollIntoView({ behavior: "smooth", block: "start" });
				}
			}, 50);
		} else {
			window.scrollTo({ top: 0, behavior: "instant" });
		}
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		const items = filteredResults();
		if (items.length === 0) return;

		if (e.key === "ArrowDown") {
			e.preventDefault();
			setActiveIndex((prev) => (prev + 1) % items.length);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
		} else if (e.key === "Enter") {
			e.preventDefault();
			const selected = items[activeIndex()];
			if (selected) {
				handleSelect(selected);
			}
		}
	};

	return (
		<CommandDialog
			open={props.open}
			onOpenChange={props.onOpenChange}
			overlayClass="search-command-overlay"
			contentClass="search-command-dialog"
		>
			<div class="search-input-wrapper">
				<Search size={18} class="search-input-icon" />
				<input
					type="text"
					class="search-command-input"
					placeholder="Search documentation, components, reactivity..."
					value={query}
					onInput={(e: any) => {
						setQuery(e.target.value);
						setActiveIndex(0);
					}}
					onKeyDown={handleKeyDown}
					autofocus
				/>
				<kbd class="search-input-badge">ESC</kbd>
			</div>

			<div class="search-command-list">
				<Show
					when={() => filteredResults().length > 0}
					fallback={
						<div class="search-command-empty">
							No documentation pages found for "{() => query()}".
						</div>
					}
				>
					<div>
						<div class="search-command-group-title">
							{() => (query().trim() ? "Search Results" : "Quick Links")}
						</div>
						<For each={filteredResults}>
							{(item, idx) => {
								const isSelected = () => activeIndex() === idx();
								return (
									<div
										class={() =>
											`search-command-item ${isSelected() ? "selected" : ""}`
										}
										aria-selected={isSelected}
										onClick={() => handleSelect(item())}
										onMouseEnter={() => setActiveIndex(idx())}
									>
										<div class="search-command-item-main">
											{item().type === "page" ? (
												<BookOpen size={16} class="search-command-item-icon" />
											) : (
												<Hash size={16} class="search-command-item-icon" />
											)}
											<div class="search-command-item-text">
												<span class="search-command-item-title">
													{item().title}
												</span>
												<span class="search-command-item-subtitle">
													{item().subtitle}
												</span>
											</div>
										</div>
										<span class="search-command-item-badge">
											{item().category}
										</span>
									</div>
								);
							}}
						</For>
					</div>
				</Show>
			</div>

			<div class="search-command-footer">
				<div class="search-command-footer-keys">
					<span class="search-command-footer-key">
						<kbd>↑</kbd> <kbd>↓</kbd> Navigate
					</span>
					<span class="search-command-footer-key">
						<kbd>↵</kbd> Select
					</span>
					<span class="search-command-footer-key">
						<kbd>esc</kbd> Close
					</span>
				</div>
				<span>Visage Fast Docs Search</span>
			</div>
		</CommandDialog>
	);
}
