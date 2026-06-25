import { EgaStudy, EgaDataset, EgaStudyWithDatasets } from '../types/ega';

const EGA_STATIC_DATA_URL = '/data/ega-studies.json';

let cachedStudies: Promise<EgaStudyWithDatasets[]> | null = null;

/**
 * Loads the static EGA studies+datasets file once and caches the in-flight
 * promise so concurrent callers share the same fetch.
 */
function loadStaticData(): Promise<EgaStudyWithDatasets[]> {
	if (!cachedStudies) {
		cachedStudies = fetch(EGA_STATIC_DATA_URL).then((response) => {
			if (!response.ok) {
				throw new Error(`EGA static data error: ${response.status} ${response.statusText}`);
			}
			return response.json();
		});
	}

	return cachedStudies;
}

/**
 * Returns ALS studies from the static EGA data file.
 */
export async function fetchAlsStudies(): Promise<EgaStudy[]> {
	const studies = await loadStaticData();
	return studies.map(({ datasets, ...study }) => study);
}

/**
 * Returns the datasets belonging to a specific study from the static EGA data file.
 */
export async function fetchStudyDatasets(studyId: string): Promise<EgaDataset[]> {
	const studies = await loadStaticData();
	const study = studies.find((s) => s.accession_id === studyId);
	return study?.datasets ?? [];
}
