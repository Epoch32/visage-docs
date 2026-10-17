import { Show, toast } from "@epoch32/visage";
import { Share2 } from "lucide";
import { getDocPage } from "../docs";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { Feature, FeatureCard, FeatureGrid } from "./FeatureGrid";
import { BatchSimulator } from "./BatchSimulator";
import { ControlFlowSandbox } from "./ControlFlowSandbox";
import { DirtyLoadingSimulator } from "./DirtyLoadingSimulator";
import { EffectLoggerSandbox } from "./EffectLoggerSandbox";
import { SignalPlayground } from "./SignalPlayground";
import { StoreSandbox } from "./StoreSandbox";
import "../styles/doc-content.css";

const defaultMdxComponents = {
	Callout,
	Feature,
	FeatureCard,
	FeatureGrid,
	CodeBlock,
	BatchSimulator,
	ControlFlowSandbox,
	DirtyLoadingSimulator,
	EffectLoggerSandbox,
	SignalPlayground,
	StoreSandbox,
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
					const handleCopyLink = () => {
						const url = window.location.href;
						navigator.clipboard.writeText(url).then(() => {
							toast.info("Link copied to clipboard!");
						});
					};

					return (
						<div>
							<div class="doc-breadcrumb">
								{page().breadcrumb ?? "Documentation"}
							</div>
							<div class="doc-header-row">
								<h1 class="doc-title">{page().title}</h1>
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
							<Content components={defaultMdxComponents} />
						</div>
					);
				}}
			</Show>
		</article>
	);
}
