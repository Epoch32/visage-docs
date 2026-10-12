import { computed, createSignal, effect, render, ToastViewport } from "@epoch32/visage";
import { DocContent } from "./components/DocContent";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { TableOfContents } from "./components/TableOfContents";
import { getDocPage } from "./docs";
import "./styles/layout.css";
import "./styles/toast.css";

function getInitialSection(): string {
	if (typeof window !== "undefined") {
		const hash = window.location.hash.replace(/^#\/?/, "").trim();
		if (hash && getDocPage(hash)) {
			return hash;
		}
	}
	return "introduction";
}

function App() {
	const [activeSection, setActiveSection] = createSignal(getInitialSection(), {
		persist: "visage-active-page",
	});

	// If URL has a valid hash, honor it over persisted state
	if (typeof window !== "undefined") {
		const hash = window.location.hash.replace(/^#\/?/, "").trim();
		if (hash && getDocPage(hash) && hash !== activeSection()) {
			setActiveSection(hash);
		}

		// Keep URL hash in sync with signal
		effect(() => {
			const id = activeSection();
			if (window.location.hash !== `#${id}`) {
				window.history.replaceState(null, "", `#${id}`);
			}
		});

		// Listen for browser back / forward or link clicks
		window.addEventListener("hashchange", () => {
			const newHash = window.location.hash.replace(/^#\/?/, "").trim();
			if (newHash && getDocPage(newHash) && newHash !== activeSection()) {
				setActiveSection(newHash);
			}
		});
	}

	const currentToc = computed(() => {
		const doc = getDocPage(activeSection());
		return doc?.toc ?? [];
	});

	return (
		<div className="app-shell">
			<Header />

			<div className="app-layout">
				<Sidebar
					activeId={activeSection}
					onSelect={(id) => setActiveSection(id)}
				/>

				<main className="app-main">
					<DocContent activeSection={activeSection} />
				</main>

				<TableOfContents items={currentToc} />
			</div>

			<ToastViewport class="visage-toast-viewport" />
		</div>
	);
}

const root = document.getElementById("app");
if (root) {
	render(() => <App />, root);
}
