// Service layer for Monarch Initiative API v3
// Pure functions — no React dependencies

import { MONARCH_API_BASE_URL } from '../utils/constants';
import { MonarchEntity, MonarchAssociationResponse } from '../types/monarch';

/**
 * Fetches disease entity data from Monarch Initiative.
 *
 * Example: fetchDiseaseEntity('MONDO:0004976') returns ALS info
 * including description, phenotypes, genes, hierarchy, and association counts.
 *
 * Endpoint: GET /v3/api/entity/{id}
 */
export async function fetchDiseaseEntity(id: string): Promise<MonarchEntity> {
	const url = `${MONARCH_API_BASE_URL}/entity/${id}`;
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Monarch API error: ${response.status} ${response.statusText} for entity ${id}`);
	}

	return response.json();
}

/**
 * Fetches disease associations from Monarch Initiative.
 *
 * The "object" parameter is the disease ID — associations point TO this disease.
 * For example, genes that CAUSE ALS: the gene is the subject, ALS is the object.
 *
 * For phenotype associations, the disease is the "subject" (disease HAS phenotype),
 * so we use the "subject" parameter instead.
 *
 * Endpoint: GET /v3/api/association
 */
export async function fetchDiseaseAssociations(
	diseaseId: string,
	category: string,
	limit: number = 20,
	offset: number = 0,
): Promise<MonarchAssociationResponse> {
	// Phenotype associations use subject (disease → phenotype)
	// Gene associations use object (gene → disease)
	const isPhenotype = category.includes('DiseaseToPhenotypicFeature');
	const entityParam = isPhenotype ? 'subject' : 'object';

	const params = new URLSearchParams({
		[entityParam]: diseaseId,
		category,
		limit: String(limit),
		offset: String(offset),
	});

	const url = `${MONARCH_API_BASE_URL}/association?${params}`;
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Monarch API error: ${response.status} ${response.statusText} for associations ${category}`);
	}

	return response.json();
}
