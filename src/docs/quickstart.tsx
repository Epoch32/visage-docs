import { CodeBlock } from "../components/CodeBlock";
import type { TocItem } from "../components/TableOfContents";

export const title = "Quickstart Guide";
export const breadcrumb = "Documentation / Getting Started";

export const toc: TocItem[] = [
	{ id: "installation", title: "Installation", level: 2 },
	{ id: "setup", title: "Vite Configuration", level: 2 },
	{ id: "first-component", title: "Your First Component", level: 2 },
];

export default function QuickstartDoc() {
	return (
		<>
			<p className="doc-lead">
				Get up and running with Visage in under two minutes using Bun or npm.
			</p>

			<h2 id="installation" className="doc-section-heading">
				Installation
			</h2>
			<p
				className="doc-lead"
				style={{ fontSize: "15px", marginBottom: "16px" }}
			>
				Install Visage and the official Vite plugin for TypeScript support and
				fast HMR:
			</p>
			<CodeBlock
				filename="terminal"
				lang="bash"
				code={`# Using Bun
bun add @epoch32/visage

# Or using pnpm
pnpm add @epoch32/visage`}
			/>

			<h2 id="setup" className="doc-section-heading">
				Vite Configuration
			</h2>
			<CodeBlock
				filename="vite.config.ts"
				lang="ts"
				code={`import { defineConfig } from "vite";
import visage from "@epoch32/visage/vite";

export default defineConfig({
  plugins: [visage()]
});`}
			/>

			<h2 id="first-component" className="doc-section-heading">
				Your First Component
			</h2>
			<CodeBlock
				filename="src/main.tsx"
				lang="tsx"
				code={`import { createSignal, render } from "@epoch32/visage";

function App() {
  const [name, setName] = createSignal("World");

  return (
    <div>
      <h1>Hello, {name}!</h1>
      <input
        value={name()}
        onInput={(e) => setName((e.target as HTMLInputElement).value)}
      />
    </div>
  );
}

render(() => <App />, document.getElementById("app")!);`}
			/>
		</>
	);
}
