import { EgaStudy, EgaDataset } from '../types/ega';

const EGA_PROXY_STUDIES = '/api/ega/studies';
const EGA_PROXY_STUDY_DATASETS = '/api/ega/study-datasets';

/**
 * Fetches ALS studies from the server-side proxy.
 * The proxy resolves the predefined accession ID list directly against the EGA API.
 */
export async function fetchAlsStudies(): Promise<EgaStudy[]> {
	const response = await fetch(EGA_PROXY_STUDIES);

	if (!response.ok) {
		throw new Error(`EGA API error: ${response.status} ${response.statusText}`);
	}

	return response.json();
}

/**
 * Fetches all datasets belonging to a specific study via server-side proxy.
 */
export async function fetchStudyDatasets(studyId: string): Promise<EgaDataset[]> {
	const response = await fetch(`${EGA_PROXY_STUDY_DATASETS}/${studyId}`);

	if (!response.ok) {
		throw new Error(`EGA API error: ${response.status} ${response.statusText} for /studies/${studyId}/datasets`);
	}

	return response.json();
}
