import { Show } from "@epoch32/visage";
import { getDocPage } from "../docs";
import "../styles/doc-content.css";

interface DocContentProps {
	activeSection: () => string;
}

export function DocContent(props: DocContentProps) {
	return (
		<article class="doc-article">
			<Show
				when={() => getDocPage(props.activeSection())}
				fallback={
					<div>
						<div class="doc-breadcrumb">
							<span>Documentation</span>
							<span>/</span>
							<span>Reference</span>
						</div>
						<h1 class="doc-title">Coming Soon</h1>
						<p class="doc-lead">
							Documentation for this module is currently being written. Check
							back soon or submit a pull request on GitHub!
						</p>
					</div>
				}
			>
				{(page) => {
					const Content = page().default;
					return (
						<div>
							<div class="doc-breadcrumb">
								{page().breadcrumb ?? "Documentation"}
							</div>
							<h1 class="doc-title">{page().title}</h1>
							<Content />
						</div>
					);
				}}
			</Show>
		</article>
	);
}
