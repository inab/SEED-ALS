
export interface EgaStudy {
	accession_id: string;
	title: string | null;
	abstract: string | null;
	description: string | null;
	study_type: string | null;
	pubmed_ids: string | null;
	external_links: string | null;
	is_released: boolean;
	released_date: string | null;
	is_deprecated: boolean;
}

export interface EgaDataset {
	accession_id: string;
	title: string | null;
	description: string | null;
	dataset_types: string[] | null;
	technologies: string[];
	num_samples: number;
	access_type: string;
	is_in_beacon: boolean;
	is_released: boolean;
	released_date: string | null;
	is_deprecated: boolean;
	policy_accession_id: string | null;
}
