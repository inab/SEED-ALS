import { MONARCH_API_BASE_URL, MONARCH_ASSOCIATION_CATEGORIES } from '../utils/constants';
import { MonarchEntity, MonarchAssociationResponse } from '../types/monarch';

/**
 * Fetches disease entity data from Monarch Initiative.
 */
export async function fetchDiseaseEntity(entityId: string): Promise<MonarchEntity> {
	const url = `${MONARCH_API_BASE_URL}/entity/${entityId}`;
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Monarch API error: ${response.status} ${response.statusText} for entity ${entityId}`);
	}

	return response.json();
}

/**
 * Fetches disease associations from Monarch Initiative.
 */
export async function fetchDiseaseAssociations(
	diseaseId: string,
	category: string,
	limit: number = 20,
	offset: number = 0,
): Promise<MonarchAssociationResponse> {
	// The query parameter depends on the direction of the association:
	// - PHENOTYPE: disease is the subject (disease → phenotype)
	// - GENE_TO_PHENOTYPE: uses 'entity' for indirect resolution (gene–phenotype links for disease-associated genes)
	// - All other categories (CAUSAL_GENE, CORRELATED_GENE, DISEASE_MODEL): disease is the object (gene/genotype → disease)
	let params: URLSearchParams;
	if (category === MONARCH_ASSOCIATION_CATEGORIES.PHENOTYPE) {
		params = new URLSearchParams({ subject: diseaseId, category, limit: String(limit), offset: String(offset) });
	} else if (category === MONARCH_ASSOCIATION_CATEGORIES.GENE_TO_PHENOTYPE) {
		params = new URLSearchParams({ entity: diseaseId, category, limit: String(limit), offset: String(offset) });
	} else {
		// CAUSAL_GENE, CORRELATED_GENE, DISEASE_MODEL — disease is the object
		params = new URLSearchParams({ object: diseaseId, category, limit: String(limit), offset: String(offset) });
	}

	const url = `${MONARCH_API_BASE_URL}/association?${params}`;
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Monarch API error: ${response.status} ${response.statusText} for associations ${category}`);
	}

	return response.json();
}
