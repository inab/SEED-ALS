#!/usr/bin/env node
/**
 * Queries the EGA Metadata API for ALS-related studies using keyword matching,
 * compares results against the current accession ID list in constants.ts,
 * and exits with code 1 if new IDs are found (signals the workflow to open a PR).
 *
 * New IDs are written to .github/scripts/new-als-ids.json for the workflow to read.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const EGA_BASE = 'https://metadata.ega-archive.org';
const KEYWORDS = ['als', 'amyotrophic', 'motor neuron disease'];
const CONSTANTS_PATH = path.join(__dirname, '../../apps/stage/global/utils/constants.ts');
const OUTPUT_PATH = path.join(__dirname, 'new-als-ids.json');

function fetch(url, method = 'GET') {
	return new Promise((resolve, reject) => {
		const urlObj = new URL(url);
		const options = {
			hostname: urlObj.hostname,
			path: urlObj.pathname + urlObj.search,
			method,
		};
		const req = https.request(options, (res) => {
			let data = '';
			res.on('data', (chunk) => (data += chunk));
			res.on('end', () => {
				if (res.statusCode >= 400) {
					reject(new Error(`HTTP ${res.statusCode} for ${url}`));
				} else {
					resolve({ status: res.statusCode, headers: res.headers, body: data });
				}
			});
		});
		req.on('error', reject);
		req.end();
	});
}

function matchesAls(study) {
	if (study.is_deprecated || !study.is_released) return false;
	const text = [study.title, study.description, study.abstract]
		.filter(Boolean)
		.join(' ')
		.toLowerCase();
	return KEYWORDS.some((kw) =>
		kw === 'als' ? /\bals\b/.test(text) : text.includes(kw),
	);
}

function getCurrentIds() {
	const src = fs.readFileSync(CONSTANTS_PATH, 'utf8');
	const match = src.match(/ALS_EGA_ACCESSION_IDS[^=]*=\s*\[([\s\S]*?)\];/);
	if (!match) throw new Error('Could not find ALS_EGA_ACCESSION_IDS in constants.ts');
	return [...match[1].matchAll(/'(EGAS\w+)'/g)].map((m) => m[1]);
}

async function main() {
	console.log('Fetching total study count from EGA...');
	const head = await fetch(`${EGA_BASE}/studies`, 'HEAD');
	const total = parseInt(head.headers['ega-api-total-count'] ?? '0', 10);
	const PAGE_SIZE = 500;
	const pages = Math.ceil(total / PAGE_SIZE);
	console.log(`Total studies: ${total} (${pages} pages)`);

	const allStudies = [];
	for (let page = 0; page < pages; page++) {
		const url = `${EGA_BASE}/studies?limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}`;
		console.log(`Fetching page ${page + 1}/${pages}...`);
		const res = await fetch(url);
		allStudies.push(...JSON.parse(res.body));
	}

	const foundIds = allStudies.filter(matchesAls).map((s) => s.accession_id).sort();
	console.log(`Found ${foundIds.length} ALS-related studies`);

	const currentIds = getCurrentIds();
	console.log(`Current list has ${currentIds.length} IDs`);

	const currentSet = new Set(currentIds);
	const newIds = foundIds.filter((id) => !currentSet.has(id));

	if (newIds.length === 0) {
		console.log('No new ALS studies found. List is up to date.');
		process.exit(0);
	}

	console.log(`Found ${newIds.length} new ID(s): ${newIds.join(', ')}`);
	fs.writeFileSync(OUTPUT_PATH, JSON.stringify(newIds, null, 2));
	process.exit(1);
}

main().catch((err) => {
	console.error('Error:', err.message);
	process.exit(2);
});
