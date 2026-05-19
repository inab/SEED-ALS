import { fetchAlsStudies, fetchStudyDatasets } from '@/global/services/egaApi';

const mockStudies = [
	{
		accession_id: 'EGAS00001000001',
		title: 'ALS Study 1',
		abstract: 'An ALS study abstract.',
		description: null,
		study_type: 'Case-Control',
		pubmed_ids: null,
		external_links: null,
		is_released: true,
		released_date: '2020-01-01',
		is_deprecated: false,
	},
];

const mockDatasets = [
	{
		accession_id: 'EGAD00001000001',
		title: 'ALS Dataset 1',
		description: null,
		dataset_types: ['Genomic'],
		technologies: ['Whole Genome Sequencing'],
		num_samples: 100,
		access_type: 'controlled',
		is_in_beacon: false,
		is_released: true,
		released_date: '2020-01-01',
		is_deprecated: false,
		policy_accession_id: 'EGAP00001000001',
	},
];

beforeEach(() => {
	global.fetch = jest.fn();
});

afterEach(() => {
	jest.resetAllMocks();
});

describe('fetchAlsStudies', () => {
	it('returns studies array on success', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => mockStudies,
		});

		const result = await fetchAlsStudies();

		expect(global.fetch).toHaveBeenCalledWith('/api/ega/studies');
		expect(result).toEqual(mockStudies);
	});

	it('throws on non-ok response', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: false,
			status: 500,
			statusText: 'Internal Server Error',
		});

		await expect(fetchAlsStudies()).rejects.toThrow('EGA API error: 500 Internal Server Error');
	});
});

describe('fetchStudyDatasets', () => {
	it('returns datasets array on success', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => mockDatasets,
		});

		const result = await fetchStudyDatasets('EGAS00001000001');

		expect(global.fetch).toHaveBeenCalledWith('/api/ega/study-datasets/EGAS00001000001');
		expect(result).toEqual(mockDatasets);
	});

	it('throws on non-ok response', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: false,
			status: 404,
			statusText: 'Not Found',
		});

		await expect(fetchStudyDatasets('EGAS00001000001')).rejects.toThrow(
			'EGA API error: 404 Not Found for /studies/EGAS00001000001/datasets',
		);
	});
});
