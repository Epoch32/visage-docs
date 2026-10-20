import { Link, Show } from "@epoch32/visage";
import { Moon, Search, Sun } from "lucide";
import { theme, toggleTheme } from "../theme";
import "../styles/header-transitions.css";

interface HeaderProps {
	onOpenSearch?: () => void;
	activeTab?: () => string;
}

export function Header(props: HeaderProps) {
	return (
		<header
			className="app-header"
			style={{
				position: "sticky",
				top: 0,
				zIndex: 50,
				width: "100%",
				height: "60px",
				background: "var(--surface-header)",
				backdropFilter: "blur(16px)",
				WebkitBackdropFilter: "blur(16px)",
				borderBottom: "1px solid var(--border-pink)",
				transform: "translateZ(0)",
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				padding: "0 24px",
				boxSizing: "border-box",
			}}
		>
			{/* Left: Pure Wordmark Logo & Version Tag */}
			<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
				<Link href="/introduction" class="header-brand">
					<span className="header-brand-title">Visage</span>
				</Link>
				<span className="header-badge">v2.0</span>
			</div>

			{/* Right Actions: Search trigger, GitHub, Theme Toggle */}
			<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
				{/* Search Bar Trigger */}
				<div
					className="header-search"
					onClick={() => props.onOpenSearch?.()}
					role="button"
					tabIndex={0}
					aria-label="Open search documentation"
				>
					<Search size={13} className="header-search-icon" />
					<span style={{ flex: 1, fontSize: "12.5px" }}>Search docs...</span>
					<kbd className="header-search-kbd">⌘K</kbd>
				</div>

				{/* GitHub Button */}
				<a
					href="https://github.com/Epoch32/visage"
					target="_blank"
					rel="noreferrer"
					className="header-github-btn"
					aria-label="GitHub repository"
					title="GitHub repository"
				>
					<svg
						aria-hidden="true"
						width="15"
						height="15"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
					</svg>
					<span className="header-github-text">GitHub</span>
				</a>

				{/* Theme Toggle Button */}
				<button
					onClick={toggleTheme}
					type="button"
					aria-label="Toggle theme"
					title="Toggle theme"
					className="header-theme-btn"
				>
					<Show
						when={() => theme() === "dark"}
						fallback={() => <Moon size={16} color="#818cf8" />}
					>
						{() => <Sun size={16} color="#fbbf24" />}
					</Show>
				</button>
			</div>
		</header>
	);
}
