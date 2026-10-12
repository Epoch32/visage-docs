import {
	computed,
	createSignal,
	onCleanup,
	render,
	Router,
	ToastViewport,
	useLocation,
	useNavigate,
} from "@epoch32/visage";
import { DocContent } from "./components/DocContent";
import { Header } from "./components/Header";
import { MobileNav } from "./components/MobileNav";
import { SearchModal } from "./components/SearchModal";
import { Sidebar } from "./components/Sidebar";
import { TableOfContents } from "./components/TableOfContents";
import { getDocPage } from "./docs";
import "./styles/layout.css";
import "./styles/toast.css";

function DocsApp() {
	const location = useLocation();
	const navigate = useNavigate();
	const [searchOpen, setSearchOpen] = createSignal(false);

	// Global Command+K / Ctrl+K keyboard shortcut
	if (typeof window !== "undefined") {
		const handleGlobalKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setSearchOpen((prev) => !prev);
			}
		};
		window.addEventListener("keydown", handleGlobalKeyDown);
		onCleanup(() => {
			window.removeEventListener("keydown", handleGlobalKeyDown);
		});
	}

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
			<Header onOpenSearch={() => setSearchOpen(true)} />

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
				onOpenSearch={() => setSearchOpen(true)}
			/>

			<SearchModal
				open={searchOpen}
				onOpenChange={setSearchOpen}
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
