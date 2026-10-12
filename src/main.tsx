import {
	computed,
	render,
	Router,
	ToastViewport,
	useLocation,
	useNavigate,
} from "@epoch32/visage";
import { DocContent } from "./components/DocContent";
import { Header } from "./components/Header";
import { MobileNav } from "./components/MobileNav";
import { Sidebar } from "./components/Sidebar";
import { TableOfContents } from "./components/TableOfContents";
import { getDocPage } from "./docs";
import "./styles/layout.css";
import "./styles/toast.css";

function DocsApp() {
	const location = useLocation();
	const navigate = useNavigate();

	// Resolve active section from current URL pathname (e.g. "/signals" or "/docs/signals")
	const activeSection = computed(() => {
		const rawPath = location
			.pathname()
			.replace(/^\/docs\/?/, "/")
			.replace(/^\//, "")
			.trim();

		if (rawPath && getDocPage(rawPath)) {
			return rawPath;
		}
		return "introduction";
	});

	// Migrate legacy hash URLs (e.g., incoming bookmarks to /#signals) to clean URL paths
	if (typeof window !== "undefined") {
		const legacyHash = window.location.hash.replace(/^#\/?/, "").trim();
		if (legacyHash && getDocPage(legacyHash)) {
			navigate(`/${legacyHash}`, { replace: true });
		}
	}

	const handleSelectSection = (id: string) => {
		navigate(`/${id}`);
		if (typeof window !== "undefined") {
			window.scrollTo({ top: 0, behavior: "instant" });
		}
	};

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
					onSelect={handleSelectSection}
				/>

				<main className="app-main">
					<DocContent activeSection={activeSection} />
				</main>

				<TableOfContents items={currentToc} />
			</div>

			<MobileNav
				activeId={activeSection}
				onSelect={handleSelectSection}
				toc={currentToc}
			/>

			<ToastViewport class="visage-toast-viewport" />
		</div>
	);
}

function App() {
	return (
		<Router mode="history">
			{() => <DocsApp />}
		</Router>
	);
}

const root = document.getElementById("app");
if (root) {
	render(() => <App />, root);
}
