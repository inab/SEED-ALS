import { ALS_EGA_ACCESSION_IDS, EGA_API_BASE_URL } from '@/global/utils/constants';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
	try {
		const results = await Promise.all(
			ALS_EGA_ACCESSION_IDS.map(async (id) => {
				const r = await fetch(`${EGA_API_BASE_URL}/studies/${id}`);
				if (!r.ok) return null;
				return r.json();
			}),
		);

		return res.status(200).json(results.filter(Boolean));
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Unknown error';
		return res.status(500).json({ error: message });
	}
}
