import { fetchDiseaseEntity, fetchDiseaseAssociations } from '@/global/services/monarchApi';
import { ALS_ASSOCIATION_CATEGORIES, MONARCH_API_BASE_URL } from '@/global/utils/constants';

const mockEntity = {
	id: 'MONDO:0004976',
	name: 'amyotrophic lateral sclerosis',
	category: 'biolink:Disease',
	description: 'A motor neuron disease.',
	synonym: [],
	exact_synonym: [],
	namespace: 'MONDO',
	has_phenotype: [],
	has_phenotype_label: [],
	has_phenotype_count: 0,
	has_descendant: [],
	has_descendant_label: [],
	has_descendant_count: 0,
	causal_gene: [],
	inheritance: null,
	mappings: [],
	association_counts: [],
	node_hierarchy: { super_classes: [], sub_classes: [] },
};

const mockAssociationResponse = {
	limit: 20,
	offset: 0,
	total: 1,
	items: [
		{
			id: 'uuid-1',
			category: ALS_ASSOCIATION_CATEGORIES.DISEASE_TO_PHENOTYPE,
			subject: 'MONDO:0004976',
			subject_label: 'amyotrophic lateral sclerosis',
			subject_namespace: 'MONDO',
			subject_category: 'biolink:Disease',
			subject_taxon: null,
			subject_taxon_label: null,
			predicate: 'biolink:has_phenotype',
			object: 'HP:0002355',
			object_label: 'Difficulty walking',
			object_namespace: 'HP',
			object_category: 'biolink:PhenotypicFeature',
			object_closure_label: [],
			provided_by: 'monarch_kg',
			frequency_qualifier: null,
			frequency_qualifier_label: null,
			onset_qualifier: null,
			onset_qualifier_label: null,
		},
	],
};

beforeEach(() => {
	global.fetch = jest.fn();
});

afterEach(() => {
	jest.resetAllMocks();
});

describe('fetchDiseaseEntity', () => {
	it('returns disease entity on success', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => mockEntity,
		});

		const result = await fetchDiseaseEntity('MONDO:0004976');

		expect(global.fetch).toHaveBeenCalledWith(`${MONARCH_API_BASE_URL}/entity/MONDO:0004976`);
		expect(result).toEqual(mockEntity);
	});

	it('throws on non-ok response', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: false,
			status: 404,
			statusText: 'Not Found',
		});

		await expect(fetchDiseaseEntity('MONDO:0004976')).rejects.toThrow(
			'Monarch API error: 404 Not Found for entity MONDO:0004976',
		);
	});
});

describe('fetchDiseaseAssociations', () => {
	it('uses subject param for DISEASE_TO_PHENOTYPE category', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => mockAssociationResponse,
		});

		await fetchDiseaseAssociations('MONDO:0004976', ALS_ASSOCIATION_CATEGORIES.DISEASE_TO_PHENOTYPE);

		const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
		expect(calledUrl).toContain('subject=MONDO%3A0004976');
		expect(calledUrl).not.toContain('entity=');
		expect(calledUrl).not.toContain('object=');
	});

	it('uses entity param for GENE_TO_PHENOTYPE category', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => mockAssociationResponse,
		});

		await fetchDiseaseAssociations('MONDO:0004976', ALS_ASSOCIATION_CATEGORIES.GENE_TO_PHENOTYPE);

		const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
		expect(calledUrl).toContain('entity=MONDO%3A0004976');
		expect(calledUrl).not.toContain('subject=');
		expect(calledUrl).not.toContain('object=');
	});

	it('uses object param for CAUSAL_GENE_TO_DISEASE category', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => mockAssociationResponse,
		});

		await fetchDiseaseAssociations('MONDO:0004976', ALS_ASSOCIATION_CATEGORIES.CAUSAL_GENE_TO_DISEASE);

		const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
		expect(calledUrl).toContain('object=MONDO%3A0004976');
		expect(calledUrl).not.toContain('subject=');
		expect(calledUrl).not.toContain('entity=');
	});

	it('uses object param for CORRELATED_GENE_TO_DISEASE category', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => mockAssociationResponse,
		});

		await fetchDiseaseAssociations('MONDO:0004976', ALS_ASSOCIATION_CATEGORIES.CORRELATED_GENE_TO_DISEASE);

		const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
		expect(calledUrl).toContain('object=MONDO%3A0004976');
	});

	it('uses object param for GENOTYPE_TO_DISEASE category', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => mockAssociationResponse,
		});

		await fetchDiseaseAssociations('MONDO:0004976', ALS_ASSOCIATION_CATEGORIES.GENOTYPE_TO_DISEASE);

		const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
		expect(calledUrl).toContain('object=MONDO%3A0004976');
	});

	it('applies limit and offset to the URL', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => mockAssociationResponse,
		});

		await fetchDiseaseAssociations('MONDO:0004976', ALS_ASSOCIATION_CATEGORIES.DISEASE_TO_PHENOTYPE, 50, 100);

		const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
		expect(calledUrl).toContain('limit=50');
		expect(calledUrl).toContain('offset=100');
	});

	it('returns association response on success', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => mockAssociationResponse,
		});

		const result = await fetchDiseaseAssociations(
			'MONDO:0004976',
			ALS_ASSOCIATION_CATEGORIES.DISEASE_TO_PHENOTYPE,
		);

		expect(result).toEqual(mockAssociationResponse);
	});

	it('throws on non-ok response', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: false,
			status: 503,
			statusText: 'Service Unavailable',
		});

		await expect(
			fetchDiseaseAssociations('MONDO:0004976', ALS_ASSOCIATION_CATEGORIES.DISEASE_TO_PHENOTYPE),
		).rejects.toThrow(
			`Monarch API error: 503 Service Unavailable for associations ${ALS_ASSOCIATION_CATEGORIES.DISEASE_TO_PHENOTYPE}`,
		);
	});
});
