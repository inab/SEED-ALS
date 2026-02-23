import { useCallback, useEffect, useState } from 'react';

import { fetchDiseaseEntity, fetchDiseaseAssociations } from '../services/monarchApi';
import { MonarchEntity, MonarchAssociationResponse } from '../types/monarch';

interface UseMonarchDataResult {
	entity: MonarchEntity | null;
	loading: boolean;
	error: string | null;
	fetchAssociations: (
		category: string,
		limit?: number,
		offset?: number,
	) => Promise<MonarchAssociationResponse>;
}

/**
 * Hook that fetches disease entity data on mount and provides
 * a function to fetch associations on demand.
 */
export function useMonarchData(mondoId: string): UseMonarchDataResult {
	const [entity, setEntity] = useState<MonarchEntity | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch entity data on mount
	useEffect(() => {
		let isMounted = true;

		async function loadEntity() {
			setLoading(true);
			setError(null);

			try {
				const data = await fetchDiseaseEntity(mondoId);
				if (isMounted) {
					setEntity(data);
				}
			} catch (err) {
				if (isMounted) {
					setError(err instanceof Error ? err.message : 'Failed to fetch disease data');
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		}

		loadEntity();

		return () => {
			isMounted = false;
		};
	}, [mondoId]);

	// Fetch associations on demand — not automatic, called by the component when needed
	const fetchAssociations = useCallback(
		(category: string, limit?: number, offset?: number) => {
			return fetchDiseaseAssociations(mondoId, category, limit, offset);
		},
		[mondoId],
	);

	return { entity, loading, error, fetchAssociations };
}
