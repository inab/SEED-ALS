import { EGA_API_BASE_URL } from '@/global/utils/constants';
import type { NextApiRequest, NextApiResponse } from 'next';

const PAGE_SIZE = 500;

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
	try {
		// Get the total number of studies from the HEAD request
		const headResponse = await fetch(`${EGA_API_BASE_URL}/studies`, { method: 'HEAD' });

		if (!headResponse.ok) {
			return res
				.status(headResponse.status)
				.json({ error: `EGA API error: ${headResponse.statusText}` });
		}

		const totalCount = parseInt(headResponse.headers.get('ega-api-total-count') ?? '0', 10);
		const totalPages = Math.ceil(totalCount / PAGE_SIZE);

		const allStudies: unknown[] = [];

		for (let page = 0; page < totalPages; page++) {
			const response = await fetch(
				`${EGA_API_BASE_URL}/studies?limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}`,
			);

			if (!response.ok) {
				return res
					.status(response.status)
					.json({ error: `EGA API error: ${response.statusText}` });
			}

			const pageData: unknown[] = await response.json();

			if (!Array.isArray(pageData)) break;

			allStudies.push(...pageData);
		}

		return res.status(200).json(allStudies);
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Unknown error';
		return res.status(500).json({ error: message });
	}
}
