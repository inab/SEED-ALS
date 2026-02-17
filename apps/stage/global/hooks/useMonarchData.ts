// Hook for fetching Monarch Initiative data in React components
// Usage: const { entity, loading, error, fetchAssociations } = useMonarchData('MONDO:0004976');

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
 *
 * - `entity` loads automatically when the component mounts
 * - `fetchAssociations` is called manually when you need association data
 *   (e.g. when a user clicks a tab or scrolls to a section)
 */
export function useMonarchData(mondoId: string): UseMonarchDataResult {
	const [entity, setEntity] = useState<MonarchEntity | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch entity data on mount
	useEffect(() => {
		let cancelled = false;

		async function loadEntity() {
			setLoading(true);
			setError(null);

			try {
				const data = await fetchDiseaseEntity(mondoId);
				if (!cancelled) {
					setEntity(data);
				}
			} catch (err) {
				if (!cancelled) {
					setError(err instanceof Error ? err.message : 'Failed to fetch disease data');
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		}

		loadEntity();

		// Cleanup: if the component unmounts before the fetch finishes,
		// we mark it as cancelled so we don't update state on an unmounted component
		return () => {
			cancelled = true;
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
