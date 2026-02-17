// Types for Monarch Initiative API v3 responses
// Docs: https://api-v3.monarchinitiative.org/v3/docs

// --- Entity endpoint: /v3/api/entity/{id} ---

export interface AssociationCount {
	label: string;
	count: number;
	category: string;
}

export interface HierarchyNode {
	id: string;
	name: string;
	category: string;
}

export interface NodeHierarchy {
	super_classes: HierarchyNode[];
	sub_classes: HierarchyNode[];
}

export interface EntityMapping {
	id: string;
	url: string | null;
}

export interface MonarchEntity {
	id: string;
	name: string;
	category: string;
	description: string | null;
	synonym: string[];
	exact_synonym: string[];
	namespace: string;
	has_phenotype: string[];
	has_phenotype_label: string[];
	has_phenotype_count: number;
	has_descendant: string[];
	has_descendant_label: string[];
	has_descendant_count: number;
	causal_gene: string[];
	inheritance: string | null;
	mappings: EntityMapping[];
	association_counts: AssociationCount[];
	node_hierarchy: NodeHierarchy;
}

// --- Association endpoint: /v3/api/association ---

export interface MonarchAssociation {
	id: string;
	category: string;
	subject: string;
	subject_label: string;
	subject_namespace: string;
	subject_category: string;
	subject_taxon: string | null;
	subject_taxon_label: string | null;
	predicate: string;
	object: string;
	object_label: string;
	object_namespace: string;
	object_category: string;
	object_closure_label: string[];
	provided_by: string;
	frequency_qualifier: string | null;
	frequency_qualifier_label: string | null;
	onset_qualifier: string | null;
	onset_qualifier_label: string | null;
}

export interface MonarchAssociationResponse {
	limit: number;
	offset: number;
	total: number;
	items: MonarchAssociation[];
}
