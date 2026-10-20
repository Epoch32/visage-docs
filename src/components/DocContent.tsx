import { Show, Suspense, toast } from "@epoch32/visage";
import { Share2 } from "lucide";
import { getDocPage } from "../docs";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { Feature, FeatureCard, FeatureGrid } from "./FeatureGrid";
import "../styles/doc-content.css";

const defaultMdxComponents = {
	Callout,
	Feature,
	FeatureCard,
	FeatureGrid,
	CodeBlock,
	table: (props: any) => (
		<div class="doc-table-wrapper">
			<table {...props} />
		</div>
	),
};

interface DocContentProps {
	activeSection: () => string;
}

export function DocContent(props: DocContentProps) {
	return (
		<div class="content-wrapper">
			<div class="doc-article-inner">
				<article class="doc-article">
					<Show
						when={() => getDocPage(props.activeSection())}
						fallback={
							<div>
								<div class="doc-breadcrumb-bar">
									<div class="doc-breadcrumb">
										<span>Documentation</span>
										<span>/</span>
										<span>Reference</span>
									</div>
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
							const handleCopyLink = () => {
								const url = window.location.href;
								navigator.clipboard.writeText(url).then(() => {
									toast.info("Link copied to clipboard!");
								});
							};

							return (
								<div>
									<div class="doc-breadcrumb-bar">
										<div class="doc-breadcrumb">
											{page().breadcrumb ?? "Documentation"}
										</div>

										<button
											type="button"
											class="doc-share-btn"
											onClick={handleCopyLink}
											title="Copy link to this page"
										>
											<Share2 size={13} />
											<span>Share</span>
										</button>
									</div>

									<div class="doc-header-row">
										<h1 class="doc-title">{page().title}</h1>
									</div>

									<Suspense
										fallback={
											<div style={{ padding: "40px 0", color: "var(--text-muted)" }}>
												Loading documentation...
											</div>
										}
									>
										<Content components={defaultMdxComponents} />
									</Suspense>
								</div>
							);
						}}
					</Show>
				</article>
			</div>
		</div>
	);
}
