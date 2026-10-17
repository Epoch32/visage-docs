import {
	Activity,
	AlignCenter,
	AppWindow,
	ArrowDownToLine,
	ArrowLeftRight,
	BarChart3,
	Brain,
	Check,
	CheckCheck,
	CheckCircle,
	CheckCircle2,
	Code2,
	Columns,
	Compass,
	Copy,
	Cpu,
	Database,
	ExternalLink,
	Eye,
	FileCheck,
	FileCode2,
	Flame,
	FolderTree,
	FolderUp,
	Gauge,
	GitFork,
	Globe,
	Grid3x3,
	Heart,
	Hourglass,
	Languages,
	Layers,
	Layout,
	LayoutGrid,
	LineChart,
	ListOrdered,
	Maximize2,
	MousePointer,
	Move,
	Network,
	Package,
	PackageCheck,
	PenTool,
	PieChart,
	Play,
	Radio,
	RefreshCw,
	Rows,
	Ruler,
	Server,
	Shield,
	ShieldAlert,
	ShieldCheck,
	Sliders,
	Sparkles,
	Split,
	Sun,
	Terminal,
	Trash2,
	Users,
	Zap,
} from "lucide";
import "../styles/doc-content.css";

const iconMap: Record<string, any> = {
	zap: Zap,
	cpu: Cpu,
	shield: ShieldCheck,
	"shield-check": ShieldCheck,
	"shield-alert": ShieldAlert,
	globe: Globe,
	database: Database,
	refresh: RefreshCw,
	sparkles: Sparkles,
	layers: Layers,
	terminal: Terminal,
	"app-window": AppWindow,
	window: AppWindow,
	"file-code": FileCode2,
	check: CheckCheck,
	"check-circle": CheckCircle,
	"check-circle-2": CheckCircle2,
	flame: Flame,
	package: PackageCheck,
	sliders: Sliders,
	grid: LayoutGrid,
	"grid-3x3": Grid3x3,
	split: Split,
	list: ListOrdered,
	"list-ordered": ListOrdered,
	gauge: Gauge,
	brain: Brain,
	activity: Activity,
	"bar-chart": BarChart3,
	"line-chart": LineChart,
	"pie-chart": PieChart,
	chart: LineChart,
	compass: Compass,
	eye: Eye,
	fork: GitFork,
	"git-fork": GitFork,
	trash: Trash2,
	network: Network,
	languages: Languages,
	users: Users,
	download: ArrowDownToLine,
	copy: Copy,
	"file-check": FileCheck,
	folder: FolderUp,
	"folder-tree": FolderTree,
	pointer: MousePointer,
	align: AlignCenter,
	columns: Columns,
	layout: Layout,
	rows: Rows,
	link: ExternalLink,
	"external-link": ExternalLink,
	hourglass: Hourglass,
	play: Play,
	radio: Radio,
	server: Server,
	maximize: Maximize2,
	move: Move,
	ruler: Ruler,
	pen: PenTool,
	sun: Sun,
	code: Code2,
	heart: Heart,
};

export interface FeatureCardProps {
	title: string;
	icon?: string | any;
	children: any;
}

export function FeatureCard(props: FeatureCardProps) {
	const renderIcon = () => {
		if (!props.icon) return null;
		if (typeof props.icon === "string") {
			const IconComponent = iconMap[props.icon.toLowerCase()] ?? Sparkles;
			return <IconComponent size={16} color="var(--pink-500)" />;
		}
		return props.icon;
	};

	return (
		<div class="doc-feature-card">
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "8px",
					marginBottom: "6px",
				}}
			>
				{renderIcon()}
				<div class="doc-feature-title">{props.title}</div>
			</div>
			<div class="doc-feature-desc">{props.children}</div>
		</div>
	);
}

export interface FeatureGridProps {
	children: any;
}

export function FeatureGrid(props: FeatureGridProps) {
	return <div class="doc-features-grid">{props.children}</div>;
}

export const Feature = FeatureCard;
