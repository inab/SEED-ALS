#!/usr/bin/env node
/**
 * Fetches study + dataset metadata from the EGA Metadata API for every
 * accession ID in ALS_EGA_ACCESSION_IDS and writes the combined result to
 * apps/stage/public/data/ega-studies.json, used as the static data source
 * for the EGA Metadata Explorer page (issue #81).
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const EGA_BASE = 'https://metadata.ega-archive.org';
const CONSTANTS_PATH = path.join(__dirname, '../../apps/stage/global/utils/constants.ts');
const OUTPUT_PATH = path.join(__dirname, '../../apps/stage/public/data/ega-studies.json');

function fetch(url) {
	return new Promise((resolve, reject) => {
		https
			.get(url, (res) => {
				let data = '';
				res.on('data', (chunk) => (data += chunk));
				res.on('end', () => {
					if (res.statusCode >= 400) {
						reject(new Error(`HTTP ${res.statusCode} for ${url}`));
					} else {
						resolve(JSON.parse(data));
					}
				});
			})
			.on('error', reject);
	});
}

function getAccessionIds() {
	const src = fs.readFileSync(CONSTANTS_PATH, 'utf8');
	const match = src.match(/ALS_EGA_ACCESSION_IDS[^=]*=\s*\[([\s\S]*?)\];/);
	if (!match) throw new Error('Could not find ALS_EGA_ACCESSION_IDS in constants.ts');
	return [...match[1].matchAll(/'(EGAS\w+)'/g)].map((m) => m[1]);
}

async function main() {
	const ids = getAccessionIds();
	console.log(`Fetching ${ids.length} ALS studies from EGA...`);

	const studies = [];
	for (const id of ids) {
		console.log(`Fetching study ${id}...`);
		const study = await fetch(`${EGA_BASE}/studies/${id}`);
		const studyData = Array.isArray(study) ? study[0] : study;

		const datasets = await fetch(`${EGA_BASE}/studies/${id}/datasets`);

		studies.push({ ...studyData, datasets });
	}

	fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
	fs.writeFileSync(OUTPUT_PATH, JSON.stringify(studies, null, 2));
	console.log(`Wrote ${studies.length} studies to ${OUTPUT_PATH}`);
}

main().catch((err) => {
	console.error('Error:', err.message);
	process.exit(1);
});
