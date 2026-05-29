/**
 * Preprocessing script for BioGRID PPI data.
 *
 * Usage:
 *   node scripts/biogrid/preprocess-ppi.mjs <path-to-biogrid-tab2.txt>
 *
 * Input:
 *   BioGRID tab2 file for Homo sapiens (unzipped).
 *   Download from: https://downloads.thebiogrid.org/BioGRID/Latest-Release/
 *   File: BIOGRID-ORGANISM-Homo_sapiens-LATEST.tab2.zip → unzip → .txt
 *
 * Output:
 *   apps/stage/public/data/ppi-network.json
 */

import { createReadStream, writeFileSync, mkdirSync } from 'fs';
import { createInterface } from 'readline';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, '../../apps/stage/public/data/ppi-network.json');

const MONARCH_API_BASE = 'https://api-v3.monarchinitiative.org/v3/api';
const ALS_MONDO_ID = 'MONDO:0004976';
const HUMAN_TAX_ID = '9606';
const MIN_ALS_CONNECTIONS = 2; // interactors must connect to ≥ this many ALS genes

const EXCLUDED_TECHNIQUES = new Set([
	'Affinity Capture-Luminescence',
	'Affinity Capture-MS',
	'Affinity Capture-Western',
	'Biochemical Activity',
	'Co-crystal Structure',
	'Co-fractionation',
	'Co-localization',
	'Co-purification',
	'Far Western',
	'FRET',
	'PCA',
	'Protein-peptide',
	'Reconstituted Complex',
	'Two-hybrid',
]);

// BioGRID tab2 column indices
const COL_SYMBOL_A = 7;
const COL_SYMBOL_B = 8;
const COL_TECHNIQUE = 11;
const COL_TAX_A = 15;
const COL_TAX_B = 16;

async function fetchAlsGenes() {
	const categories = [
		'biolink:CausalGeneToDiseaseAssociation',
		'biolink:CorrelatedGeneToDiseaseAssociation',
	];
	const genes = new Set();

	for (const category of categories) {
		let offset = 0;
		const limit = 500;
		while (true) {
			const url = `${MONARCH_API_BASE}/association?object=${ALS_MONDO_ID}&category=${category}&limit=${limit}&offset=${offset}`;
			const res = await fetch(url);
			if (!res.ok) throw new Error(`Monarch API error: ${res.status}`);
			const data = await res.json();
			for (const item of data.items) {
				if (item.subject_label) genes.add(item.subject_label);
			}
			if (offset + limit >= data.total) break;
			offset += limit;
		}
	}

	return genes;
}

async function processBioGRID(inputFile, alsGenes) {
	const interactions = new Map();

	const rl = createInterface({
		input: createReadStream(inputFile, { encoding: 'utf8' }),
		crlfDelay: Infinity,
	});

	let lineCount = 0;
	for await (const line of rl) {
		if (line.startsWith('#') || line.trim() === '') continue;
		lineCount++;

		const cols = line.split('\t');
		if (cols.length < 17) continue;

		const geneA = cols[COL_SYMBOL_A]?.trim();
		const geneB = cols[COL_SYMBOL_B]?.trim();
		const technique = cols[COL_TECHNIQUE]?.trim();
		const taxA = cols[COL_TAX_A]?.trim();
		const taxB = cols[COL_TAX_B]?.trim();

		if (!geneA || !geneB) continue;
		if (taxA !== HUMAN_TAX_ID || taxB !== HUMAN_TAX_ID) continue;
		if (geneA === geneB) continue;
		if (EXCLUDED_TECHNIQUES.has(technique)) continue;
		if (!alsGenes.has(geneA) && !alsGenes.has(geneB)) continue;

		const [a, b] = [geneA, geneB].sort();
		const key = `${a}|${b}`;
		if (interactions.has(key)) {
			interactions.get(key).count++;
		} else {
			interactions.set(key, { source: geneA, target: geneB, count: 1 });
		}
	}

	console.log(`  Parsed ${lineCount.toLocaleString()} interactions from BioGRID`);
	return interactions;
}

function buildNetwork(interactions, alsGenes) {
	// Count how many distinct ALS genes each non-ALS interactor connects to
	const interactorAlsConnections = new Map();

	for (const { source, target } of interactions.values()) {
		const aIsAls = alsGenes.has(source);
		const bIsAls = alsGenes.has(target);

		if (aIsAls && !bIsAls) {
			if (!interactorAlsConnections.has(target)) interactorAlsConnections.set(target, new Set());
			interactorAlsConnections.get(target).add(source);
		}
		if (bIsAls && !aIsAls) {
			if (!interactorAlsConnections.has(source)) interactorAlsConnections.set(source, new Set());
			interactorAlsConnections.get(source).add(target);
		}
	}

	// Valid non-ALS interactors: connect to ≥ MIN_ALS_CONNECTIONS ALS genes
	const validInteractors = new Set(
		[...interactorAlsConnections.entries()]
			.filter(([, alsSet]) => alsSet.size >= MIN_ALS_CONNECTIONS)
			.map(([gene]) => gene),
	);

	const validGenes = new Set([...alsGenes, ...validInteractors]);

	// Build deduplicated links
	const links = [];
	for (const interaction of interactions.values()) {
		if (validGenes.has(interaction.source) && validGenes.has(interaction.target)) {
			links.push({ source: interaction.source, target: interaction.target, count: interaction.count });
		}
	}

	// Collect nodes actually used in links
	const usedGenes = new Set();
	links.forEach((l) => { usedGenes.add(l.source); usedGenes.add(l.target); });

	const nodes = [...usedGenes].map((id) => ({
		id,
		name: id,
		isAlsGene: alsGenes.has(id),
	}));

	return { nodes, links };
}

// ── Main ────────────────────────────────────────────────────────────────────

const inputFile = process.argv[2];
if (!inputFile) {
	console.error('Usage: node scripts/biogrid/preprocess-ppi.mjs <path-to-biogrid-tab2.txt>');
	process.exit(1);
}

console.log('Fetching ALS genes from Monarch Initiative...');
const alsGenes = await fetchAlsGenes();
console.log(`  Found ${alsGenes.size} ALS-associated genes`);

console.log('Processing BioGRID file...');
const interactions = await processBioGRID(inputFile, alsGenes);
console.log(`  ${interactions.size.toLocaleString()} unique interactions after filtering`);

console.log(`Building network (interactors with ≥${MIN_ALS_CONNECTIONS} ALS connections)...`);
const network = buildNetwork(interactions, alsGenes);
console.log(`  Nodes: ${network.nodes.length}  |  Links: ${network.links.length}`);

mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, JSON.stringify(network));
console.log(`\nDone. Written to ${OUTPUT_PATH}`);
