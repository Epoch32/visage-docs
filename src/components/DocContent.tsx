import { Show, toast } from "@epoch32/visage";
import { Share2 } from "lucide-react";
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
							<Content />
						</div>
					);
				}}
			</Show>
		</article>
	);
}
