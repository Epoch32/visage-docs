import { computed, createSignal, render, ToastViewport } from "@epoch32/visage";
import { DocContent } from "./components/DocContent";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { TableOfContents } from "./components/TableOfContents";
import { getDocPage } from "./docs";
import "./styles/layout.css";
import "./styles/toast.css";

function App() {
	const [activeSection, setActiveSection] = createSignal("introduction");

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
