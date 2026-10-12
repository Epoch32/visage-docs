import { Show } from "@epoch32/visage";
import { Moon, Sun } from "lucide-react";
import { theme, toggleTheme } from "../theme";
import "../styles/header-transitions.css";

export function Header() {
	return (
		<header
			style={{
				position: "sticky",
				top: 0,
				zIndex: 50,
				width: "100%",
				height: "64px",
				background: "var(--surface-header)",
				backdropFilter: "blur(12px)",
				borderBottom: "1px solid var(--border-pink)",
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				padding: "0 28px",
			}}
		>
			{/* Brand & Logo */}
			<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
				<a href="/" className="header-brand">
					<span className="header-brand-title">Visage</span>
				</a>
			</div>

			{/* Center Search Bar */}
			<div className="header-search">
				<svg
					className="header-search-icon"
					aria-hidden="true"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<circle cx="11" cy="11" r="8" />
					<line x1="21" y1="21" x2="16.65" y2="16.65" />
				</svg>
				<span style={{ flex: 1 }}>Search documentation...</span>
				<kbd className="header-search-kbd">⌘K</kbd>
			</div>

			{/* Nav Links & Social */}
			<nav style={{ display: "flex", alignItems: "center", gap: "20px" }}>
				<a href="#docs" className="header-nav-link active">
					Documentation
				</a>
				<a href="#api" className="header-nav-link">
					API Reference
				</a>
				<a href="#showcase" className="header-nav-link">
					Showcase
				</a>
				<a
					href="https://github.com/Epoch32/visage"
					target="_blank"
					rel="noreferrer"
					className="header-github-btn"
				>
					<svg
						aria-hidden="true"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
					</svg>
					<span>GitHub</span>
				</a>

				{/* Theme Toggle Button (Icon only) */}
				<button
					onClick={toggleTheme}
					type="button"
					aria-label="Toggle theme"
					title="Toggle theme"
					className="header-theme-btn"
				>
					<Show
						when={() => theme() === "dark"}
						fallback={() => <Moon size={18} color="#818cf8" />}
					>
						{() => <Sun size={18} color="#fbbf24" />}
					</Show>
				</button>
			</nav>
		</header>
	);
}
