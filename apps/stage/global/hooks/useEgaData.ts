import { useCallback, useEffect, useState } from 'react';

import { fetchAlsStudies, fetchStudyDatasets } from '../services/egaApi';
import { EgaStudy, EgaDataset } from '../types/ega';

interface UseEgaDataResult {
	studies: EgaStudy[];
	loading: boolean;
	error: string | null;
	fetchStudyDatasets: (studyId: string) => Promise<EgaDataset[]>;
}

/**
 * Hook that fetches ALS-related EGA studies on mount and provides
 * a function to fetch datasets for a given study on demand.
 */
export function useEgaData(): UseEgaDataResult {
	const [studies, setStudies] = useState<EgaStudy[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		async function loadStudies() {
			setLoading(true);
			setError(null);

			try {
				const data = await fetchAlsStudies();
				if (isMounted) {
					setStudies(data);
				}
			} catch (err) {
				if (isMounted) {
					setError(err instanceof Error ? err.message : 'Failed to fetch EGA studies');
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		}

		loadStudies();

		return () => {
			isMounted = false;
		};
	}, []);

	const fetchDatasets = useCallback((studyId: string) => {
		return fetchStudyDatasets(studyId);
	}, []);

	return { studies, loading, error, fetchStudyDatasets: fetchDatasets };
}
