import { EGA_API_BASE_URL } from '@/global/utils/constants';
import type { NextApiRequest, NextApiResponse } from 'next';

const PAGE_SIZE = 500;

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
	try {
		const allStudies: unknown[] = [];
		let offset = 0;

		while (true) {
			const response = await fetch(
				`${EGA_API_BASE_URL}/studies?limit=${PAGE_SIZE}&offset=${offset}`,
			);

			if (!response.ok) {
				return res
					.status(response.status)
					.json({ error: `EGA API error: ${response.statusText}` });
			}

			const page: unknown[] = await response.json();

			if (!Array.isArray(page) || page.length === 0) break;

			allStudies.push(...page);
			offset += page.length;

			// If we got fewer than PAGE_SIZE we've reached the end
			if (page.length < PAGE_SIZE) break;
		}

		return res.status(200).json(allStudies);
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Unknown error';
		return res.status(500).json({ error: message });
	}
}
