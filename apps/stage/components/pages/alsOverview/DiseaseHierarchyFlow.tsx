import { useCallback, useMemo } from 'react';
import ReactFlow, { Edge, Handle, MarkerType, Node, NodeMouseHandler, Position } from 'reactflow';
import 'reactflow/dist/style.css';
import { HierarchyNode, NodeHierarchy } from '../../../global/types/monarch';

const MONARCH_BASE = 'https://monarchinitiative.org/disease/';
const NODE_WIDTH = 190;
const NODE_HEIGHT = 44;
const H_GAP = 20;
const V_GAP = 80;

interface Colors {
	primary: string;
	primary_palest: string;
	primary_pale: string;
	white: string;
}

interface NodeData {
	label: string;
	url: string;
	highlight: boolean;
	colors: Colors;
}

function DiseaseNode({ data }: { data: NodeData }) {
	return (
		<div
			style={{
				width: NODE_WIDTH,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: NODE_HEIGHT,
				padding: '8px 14px',
				boxSizing: 'border-box',
				borderRadius: 20,
				background: data.highlight ? data.colors.primary : data.colors.primary_palest,
				color: data.highlight ? data.colors.white : data.colors.primary,
				border: `1.5px solid ${data.highlight ? data.colors.primary : data.colors.primary_pale}`,
				fontFamily: 'Geomanist, sans-serif',
				fontSize: '0.82rem',
				fontWeight: data.highlight ? 700 : 400,
				textAlign: 'center',
				lineHeight: 1.35,
				cursor: 'pointer',
			}}
		>
			<Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} />
			{data.label}
			<Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
		</div>
	);
}

const nodeTypes = { disease: DiseaseNode };

interface Props {
	hierarchy: NodeHierarchy;
	diseaseName: string;
	diseaseId: string;
	colors: Colors;
}

function makeRow(items: HierarchyNode[], y: number, prefix: string, highlight: boolean, colors: Colors): Node<NodeData>[] {
	const total = items.length * NODE_WIDTH + Math.max(0, items.length - 1) * H_GAP;
	const startX = -total / 2;
	return items.map((item, i) => ({
		id: `${prefix}-${item.id}`,
		type: 'disease' as const,
		position: { x: startX + i * (NODE_WIDTH + H_GAP), y },
		data: { label: item.name, url: `${MONARCH_BASE}${item.id}`, highlight, colors },
	}));
}

export default function DiseaseHierarchyFlow({ hierarchy, diseaseName, diseaseId, colors }: Props) {
	const { nodes, edges, height } = useMemo(() => {
		const nodes: Node[] = [];
		const edges: Edge[] = [];
		const rowStep = NODE_HEIGHT + V_GAP;
		const hasParents = hierarchy.super_classes.length > 0;
		const hasSubtypes = hierarchy.sub_classes.length > 0;

		const alsY = hasParents ? rowStep : 0;
		const subtypeY = alsY + rowStep;

		// Parents row
		if (hasParents) {
			const parentNodes = makeRow(hierarchy.super_classes, 0, 'parent', false, colors);
			nodes.push(...parentNodes);
			parentNodes.forEach((p) => {
				edges.push({
					id: `e-${p.id}-als`,
					source: p.id,
					target: 'als',
					style: { stroke: colors.primary_pale, strokeWidth: 1.5 },
					markerEnd: { type: MarkerType.ArrowClosed, color: colors.primary_pale },
				});
			});
		}

		// ALS node (central, highlighted)
		nodes.push({
			id: 'als',
			type: 'disease',
			position: { x: -NODE_WIDTH / 2, y: alsY },
			data: { label: diseaseName, url: `${MONARCH_BASE}${diseaseId}`, highlight: true, colors },
		});

		// Subtypes row
		if (hasSubtypes) {
			const subtypeNodes = makeRow(hierarchy.sub_classes, subtypeY, 'sub', false, colors);
			nodes.push(...subtypeNodes);
			subtypeNodes.forEach((s) => {
				edges.push({
					id: `e-als-${s.id}`,
					source: 'als',
					target: s.id,
					style: { stroke: colors.primary_pale, strokeWidth: 1.5 },
					markerEnd: { type: MarkerType.ArrowClosed, color: colors.primary_pale },
				});
			});
		}

		const rowCount = (hasParents ? 1 : 0) + 1 + (hasSubtypes ? 1 : 0);
		const height = rowCount * NODE_HEIGHT + (rowCount - 1) * V_GAP + 80;

		return { nodes, edges, height };
	}, [hierarchy, diseaseName, diseaseId, colors]);

	const handleNodeClick: NodeMouseHandler = useCallback((_event, node) => {
		const data = node.data as NodeData;
		window.open(data.url, '_blank', 'noopener,noreferrer');
	}, []);

	return (
		<div style={{ height: Math.max(height, 200), width: '100%' }}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				onNodeClick={handleNodeClick}
				fitView
				fitViewOptions={{ padding: 0.3 }}
				minZoom={0.2}
				nodesDraggable={false}
				nodesConnectable={false}
				elementsSelectable={false}
				zoomOnScroll={false}
				panOnScroll={false}
				panOnDrag={true}
				proOptions={{ hideAttribution: true }}
			/>
		</div>
	);
}
