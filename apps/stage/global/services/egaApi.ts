import { ALS_EGA_KEYWORDS } from '../utils/constants';
import { EgaStudy, EgaDataset } from '../types/ega';

// Local Next.js api requests to avoid CORS
const EGA_PROXY_STUDIES = '/api/ega/studies';
const EGA_PROXY_STUDY_DATASETS = '/api/ega/study-datasets';

/**
 * Fetches all public studies from EGA via server-side proxy.
 */
export async function fetchAllStudies(): Promise<EgaStudy[]> {
	const response = await fetch(EGA_PROXY_STUDIES);

	if (!response.ok) {
		throw new Error(`EGA API error: ${response.status} ${response.statusText} for /studies`);
	}

	return response.json();
}

/**
 * Filters studies where title, description, or abstract contains any ALS keyword.
 * Also excludes deprecated studies and unreleased studies.
 */
export function filterAlsStudies(studies: EgaStudy[]): EgaStudy[] {
	return studies.filter((study) => {
		if (study.is_deprecated || !study.is_released) return false;

		const alsSearchText = [study.title, study.description, study.abstract]
			.filter(Boolean)
			.join(' ')
			.toLowerCase();

		return ALS_EGA_KEYWORDS.some((kw) => alsSearchText.includes(kw));
	});
}

/**
 * Fetches all public studies and returns only those related to ALS.
 */
export async function fetchAlsStudies(): Promise<EgaStudy[]> {
	const all = await fetchAllStudies();
	return filterAlsStudies(all);
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
