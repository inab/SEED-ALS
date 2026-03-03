import { EGA_API_BASE_URL } from '@/global/utils/constants';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { studyId } = req.query;

	if (!studyId || typeof studyId !== 'string') {
		return res.status(400).json({ error: 'Missing studyId' });
	}

	try {
		const response = await fetch(`${EGA_API_BASE_URL}/studies/${studyId}/datasets`);

		if (!response.ok) {
			return res.status(response.status).json({ error: `EGA API error: ${response.statusText}` });
		}

		const data = await response.json();
		return res.status(200).json(data);
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Unknown error';
		return res.status(500).json({ error: message });
	}
}
