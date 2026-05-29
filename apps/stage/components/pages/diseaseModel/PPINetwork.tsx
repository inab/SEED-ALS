import { css, useTheme } from '@emotion/react';
import { useEffect, useRef, useState, ReactElement, useCallback } from 'react';
import defaultTheme from '../../theme';

interface PPINode {
	id: string;
	name: string;
	isAlsGene: boolean;
	x?: number;
	y?: number;
	fx?: number;
	fy?: number;
}

interface PPILink {
	source: string | PPINode;
	target: string | PPINode;
	count: number;
}

interface PPINetworkData {
	nodes: PPINode[];
	links: PPILink[];
}

const NODE_ALS_RADIUS = 7;
const NODE_INTERACTOR_RADIUS = 4;
const LABEL_ZOOM_THRESHOLD = 2.5;

const PPINetwork = (): ReactElement => {
	const theme: typeof defaultTheme = useTheme();
	const containerRef = useRef<HTMLDivElement>(null);
	const graphRef = useRef<any>(null);

	const [ForceGraph2D, setForceGraph2D] = useState<any>(null);
	const [data, setData] = useState<PPINetworkData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
	const [hoveredNode, setHoveredNode] = useState<PPINode | null>(null);
	const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

	useEffect(() => {
		import('react-force-graph-2d').then((mod) => {
			setForceGraph2D(() => mod.default ?? mod);
		});
	}, []);

	useEffect(() => {
		fetch('/data/ppi-network.json')
			.then((r) => {
				if (!r.ok) throw new Error(`Failed to load PPI network (${r.status})`);
				return r.json();
			})
			.then((json: PPINetworkData) => {
				setData(json);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, []);

	useEffect(() => {
		if (!containerRef.current) return;
		const ro = new ResizeObserver((entries) => {
			const { width, height } = entries[0].contentRect;
			setDimensions({ width, height: Math.max(height, 500) });
		});
		ro.observe(containerRef.current);
		return () => ro.disconnect();
	}, []);

	const fitView = useCallback(() => {
		if (typeof graphRef.current?.zoomToFit === 'function') {
			graphRef.current.zoomToFit(400, 40);
		}
	}, []);

	const handleFitView = fitView;

	const nodeCanvasObject = useCallback(
		(node: PPINode, ctx: CanvasRenderingContext2D, globalScale: number) => {
			const isAls = node.isAlsGene;
			const r = isAls ? NODE_ALS_RADIUS : NODE_INTERACTOR_RADIUS;
			const x = node.x ?? 0;
			const y = node.y ?? 0;

			ctx.beginPath();
			ctx.arc(x, y, r, 0, 2 * Math.PI);
			ctx.fillStyle = isAls ? theme.colors.primary : theme.colors.grey_3;
			ctx.fill();

			if (isAls) {
				ctx.strokeStyle = theme.colors.primary_light ?? '#4a7ab5';
				ctx.lineWidth = 1.5 / globalScale;
				ctx.stroke();
			}

			if (globalScale >= LABEL_ZOOM_THRESHOLD || (isAls && globalScale >= 1.2)) {
				const fontSize = Math.max(10 / globalScale, 3);
				ctx.font = `${fontSize}px sans-serif`;
				ctx.fillStyle = isAls ? theme.colors.primary : theme.colors.grey_5;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'top';
				ctx.fillText(node.name, x, y + r + 2 / globalScale);
			}
		},
		[theme],
	);

	const nodePointerAreaPaint = useCallback((node: PPINode, color: string, ctx: CanvasRenderingContext2D) => {
		const r = (node.isAlsGene ? NODE_ALS_RADIUS : NODE_INTERACTOR_RADIUS) + 4;
		ctx.beginPath();
		ctx.arc(node.x ?? 0, node.y ?? 0, r, 0, 2 * Math.PI);
		ctx.fillStyle = color;
		ctx.fill();
	}, []);

	const alsCount = data?.nodes.filter((n) => n.isAlsGene).length ?? 0;
	const interactorCount = data ? data.nodes.length - alsCount : 0;

	return (
		<section
			css={css`
				flex: 1;
				background-color: ${theme.colors.primary_palest};
				display: flex;
				flex-direction: column;
			`}
		>
			{/* Stats bar */}
			<div
				css={css`
					display: flex;
					flex-wrap: wrap;
					gap: 12px 32px;
					padding: 20px 32px;
					background: ${theme.colors.white};
					border-bottom: 1px solid ${theme.colors.grey_2};
					align-items: center;
					justify-content: space-between;
				`}
			>
				<div css={css`display: flex; gap: 32px; flex-wrap: wrap;`}>
					{[
						{ label: 'ALS genes', value: alsCount, color: theme.colors.primary },
						{ label: 'Interactors', value: interactorCount, color: theme.colors.grey_5 },
						{ label: 'Interactions', value: data?.links.length ?? 0, color: theme.colors.grey_5 },
					].map(({ label, value, color }) => (
						<div key={label} css={css`display: flex; flex-direction: column; gap: 2px;`}>
							<span
								css={css`
									font-family: 'Geomanist', sans-serif;
									font-size: 1.4rem;
									font-weight: 700;
									color: ${color};
									line-height: 1;
								`}
							>
								{value.toLocaleString()}
							</span>
							<span
								css={css`
									font-family: 'Geomanist', sans-serif;
									font-size: 0.75rem;
									color: ${theme.colors.grey_3};
									text-transform: uppercase;
									letter-spacing: 0.5px;
								`}
							>
								{label}
							</span>
						</div>
					))}
				</div>

				<div css={css`display: flex; gap: 16px; align-items: center; flex-wrap: wrap;`}>
					{/* Legend */}
					<div css={css`display: flex; gap: 16px;`}>
						{[
							{ color: theme.colors.primary, label: 'ALS gene' },
							{ color: theme.colors.grey_3, label: 'Interactor (≥2 ALS connections)' },
						].map(({ color, label }) => (
							<div key={label} css={css`display: flex; align-items: center; gap: 6px;`}>
								<div
									css={css`
										width: 10px;
										height: 10px;
										border-radius: 50%;
										background: ${color};
										flex-shrink: 0;
									`}
								/>
								<span
									css={css`
										font-family: 'Geomanist', sans-serif;
										font-size: 0.78rem;
										color: ${theme.colors.grey_5};
									`}
								>
									{label}
								</span>
							</div>
						))}
					</div>

					<button
						onClick={handleFitView}
						css={css`
							font-family: 'Geomanist', sans-serif;
							font-size: 0.8rem;
							padding: 6px 14px;
							border: 1px solid ${theme.colors.grey_2};
							border-radius: 6px;
							background: ${theme.colors.white};
							color: ${theme.colors.primary};
							cursor: pointer;
							white-space: nowrap;
							&:hover { background: ${theme.colors.grey_1}; }
						`}
					>
						Fit view
					</button>
				</div>
			</div>

			{/* Graph container */}
			<div
				ref={containerRef}
				css={css`
					flex: 1;
					min-height: 500px;
					position: relative;
					overflow: hidden;
					background: ${theme.colors.white};
					border-radius: 0 0 8px 8px;
				`}
			>
				{loading && (
					<div
						css={css`
							position: absolute;
							inset: 0;
							display: flex;
							align-items: center;
							justify-content: center;
							flex-direction: column;
							gap: 12px;
						`}
					>
						<div
							css={css`
								width: 32px;
								height: 32px;
								border: 3px solid ${theme.colors.primary_pale};
								border-top-color: ${theme.colors.primary};
								border-radius: 50%;
								animation: spin 0.8s linear infinite;
								@keyframes spin { to { transform: rotate(360deg); } }
							`}
						/>
						<span
							css={css`
								font-family: 'Geomanist', sans-serif;
								font-size: 0.85rem;
								color: ${theme.colors.grey_3};
							`}
						>
							Loading network…
						</span>
					</div>
				)}

				{error && (
					<div
						css={css`
							position: absolute;
							inset: 0;
							display: flex;
							align-items: center;
							justify-content: center;
						`}
					>
						<p
							css={css`
								font-family: 'Geomanist', sans-serif;
								font-size: 0.9rem;
								color: ${theme.colors.error};
							`}
						>
							{error}
						</p>
					</div>
				)}

				{!loading && !error && data && ForceGraph2D && (
					<>
						<ForceGraph2D
							ref={graphRef}
							graphData={data}
							width={dimensions.width}
							height={dimensions.height}
							nodeId="id"
							nodeLabel=""
							nodeCanvasObject={nodeCanvasObject}
							nodePointerAreaPaint={nodePointerAreaPaint}
							linkColor={() => 'rgba(124, 135, 149, 0.25)'}
							linkWidth={(link: PPILink) => Math.max(0.5, Math.log((link.count ?? 1) + 1) * 0.8)}
							onNodeHover={(node: PPINode | null, prevNode: PPINode | null, event?: MouseEvent) => {
								setHoveredNode(node);
								if (node && event) {
									const rect = containerRef.current?.getBoundingClientRect();
									setTooltipPos({
										x: event.clientX - (rect?.left ?? 0) + 12,
										y: event.clientY - (rect?.top ?? 0) - 10,
									});
								}
							}}
							cooldownTicks={100}
							onEngineStop={fitView}
							backgroundColor="#ffffff"
						/>

						{/* Hover tooltip */}
						{hoveredNode && (
							<div
								css={css`
									position: absolute;
									left: ${tooltipPos.x}px;
									top: ${tooltipPos.y}px;
									background: ${theme.colors.primary};
									color: ${theme.colors.white};
									font-family: 'Geomanist', sans-serif;
									font-size: 0.78rem;
									font-weight: 700;
									padding: 4px 10px;
									border-radius: 6px;
									pointer-events: none;
									white-space: nowrap;
									box-shadow: 0 2px 8px rgba(0,0,0,0.2);
									z-index: 10;
								`}
							>
								{hoveredNode.name}
								{hoveredNode.isAlsGene && (
									<span
										css={css`
											margin-left: 6px;
											font-size: 0.7rem;
											opacity: 0.8;
											font-weight: 400;
										`}
									>
										ALS gene
									</span>
								)}
							</div>
						)}
					</>
				)}
			</div>
		</section>
	);
};

export default PPINetwork;
