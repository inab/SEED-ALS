import { css } from '@emotion/react';
import { useEffect, useState, ReactElement } from 'react';
import PageLayout from '../../../PageLayout';
import { useMonarchData } from '../../../../global/hooks/useMonarchData';
import { ALS_MONDO_ID, ALS_ASSOCIATION_CATEGORIES } from '../../../../global/utils/constants';
import { MonarchAssociationResponse } from '../../../../global/types/monarch';

// ─── helpers ────────────────────────────────────────────────────────────────

const check = (condition: boolean) => (condition ? '✅' : '❌');

const sectionCss = css`
	margin-bottom: 32px;
`;

const titleCss = css`
	font-size: 1rem;
	font-weight: 700;
	margin: 0 0 12px;
	font-family: monospace;
`;

const rowCss = css`
	font-family: monospace;
	font-size: 0.85rem;
	margin: 4px 0;
	line-height: 1.5;
`;

const cardCss = css`
	background: #f8f9fa;
	border: 1px solid #dee2e6;
	border-radius: 6px;
	padding: 16px 20px;
	margin-bottom: 8px;
	font-family: monospace;
	font-size: 0.8rem;
	line-height: 1.6;
`;

const labelCss = css`
	font-weight: 700;
	color: #495057;
`;

const statusCss = (ok: boolean) => css`
	display: inline-block;
	padding: 2px 8px;
	border-radius: 4px;
	font-size: 0.75rem;
	font-weight: 700;
	font-family: monospace;
	background: ${ok ? '#d4edda' : '#f8d7da'};
	color: ${ok ? '#155724' : '#721c24'};
	margin-left: 8px;
`;

// ─── Association block ───────────────────────────────────────────────────────

interface AssocBlockProps {
	label: string;
	category: string;
	fetchAssociations: (cat: string, limit?: number) => Promise<MonarchAssociationResponse>;
}

const AssocBlock = ({ label, category, fetchAssociations }: AssocBlockProps): ReactElement => {
	const [data, setData] = useState<MonarchAssociationResponse | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchAssociations(category, 3)
			.then((res) => {
				setData(res);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, [category, fetchAssociations]);

	return (
		<div css={sectionCss}>
			<p css={titleCss}>
				{label}
				{!loading && !error && (
					<span css={statusCss(data!.total > 0)}>
						{data!.total > 0 ? 'OK' : 'EMPTY'}
					</span>
				)}
			</p>

			{loading && <p css={rowCss}>⏳ loading...</p>}
			{error && <p css={rowCss}>❌ Error: {error}</p>}

			{data && (
				<>
					<p css={rowCss}>{check(data.total > 0)} total: {data.total}</p>
					<p css={rowCss}>{check(data.items.length > 0)} items returned: {data.items.length}</p>

					{data.items.slice(0, 3).map((item) => (
						<div key={item.id} css={cardCss}>
							<span css={labelCss}>subject: </span>{item.subject_label || '—'}{' '}
							<span css={labelCss}>predicate: </span>{item.predicate.replace('biolink:', '')}{' '}
							<span css={labelCss}>object: </span>{item.object_label || '—'}
						</div>
					))}
				</>
			)}
		</div>
	);
};

// ─── Main page ───────────────────────────────────────────────────────────────

const MonarchTest = (): ReactElement => {
	const { entity, loading, error, fetchAssociations } = useMonarchData(ALS_MONDO_ID);

	return (
		<PageLayout subtitle="API Test — Monarch">
			<div
				css={css`
					max-width: 900px;
					margin: 0 auto;
					padding: 40px 24px 72px;
				`}
			>
				<h1 css={css`font-family: monospace; font-size: 1.4rem; margin-bottom: 8px;`}>
					Monarch Initiative API — Integration Test
				</h1>
				<p css={css`font-family: monospace; font-size: 0.85rem; color: #6c757d; margin-bottom: 40px;`}>
					Disease ID: <strong>{ALS_MONDO_ID}</strong> · Real HTTP requests to{' '}
					<code>api-v3.monarchinitiative.org</code>
				</p>

				{/* ── Entity ── */}
				<div css={sectionCss}>
					<p css={titleCss}>
						GET /entity/{ALS_MONDO_ID}
						{!loading && !error && <span css={statusCss(true)}>OK</span>}
						{!loading && error && <span css={statusCss(false)}>FAIL</span>}
					</p>

					{loading && <p css={rowCss}>⏳ loading...</p>}
					{error && <p css={rowCss}>❌ Error: {error}</p>}

					{entity && (
						<>
							<p css={rowCss}>{check(entity.id === ALS_MONDO_ID)} id: {entity.id}</p>
							<p css={rowCss}>{check(entity.name.toLowerCase().includes('amyotrophic'))} name: {entity.name}</p>
							<p css={rowCss}>{check(!!entity.description)} description: {entity.description ? `"${entity.description.slice(0, 80)}…"` : 'null'}</p>
							<p css={rowCss}>{check(entity.synonym.length > 0)} synonyms: {entity.synonym.length}</p>
							<p css={rowCss}>{check(entity.association_counts.length > 0)} association_counts: {entity.association_counts.length} entries</p>
							<p css={rowCss}>
								{check(entity.node_hierarchy.super_classes.length > 0)}{' '}
								super_classes: {entity.node_hierarchy.super_classes.map((n) => n.name).join(', ') || 'none'}
							</p>
							<p css={rowCss}>
								{check(entity.node_hierarchy.sub_classes.length > 0)}{' '}
								sub_classes: {entity.node_hierarchy.sub_classes.length} entries
							</p>

							<p css={css`font-family: monospace; font-size: 0.8rem; margin-top: 12px; color: #6c757d;`}>
								association_counts:
							</p>
							{entity.association_counts.filter((ac) => ac.label !== 'Cases').map((ac) => (
								<p key={ac.category} css={css`font-family: monospace; font-size: 0.8rem; margin: 2px 0 2px 16px; color: #495057;`}>
									· {ac.label}: <strong>{ac.count}</strong>
								</p>
							))}
						</>
					)}
				</div>

				<hr css={css`border: none; border-top: 1px solid #dee2e6; margin: 32px 0;`} />

				{/* ── Associations (only after entity is ready) ── */}
				{entity && (
					<>
						<AssocBlock
							label={`GET /association — category: DiseaseToPhenotypicFeature`}
							category={ALS_ASSOCIATION_CATEGORIES.DISEASE_TO_PHENOTYPE}
							fetchAssociations={fetchAssociations}
						/>
						<AssocBlock
							label={`GET /association — category: CausalGeneToDiseaseAssociation`}
							category={ALS_ASSOCIATION_CATEGORIES.CAUSAL_GENE_TO_DISEASE}
							fetchAssociations={fetchAssociations}
						/>
						<AssocBlock
							label={`GET /association — category: CorrelatedGeneToDiseaseAssociation`}
							category={ALS_ASSOCIATION_CATEGORIES.CORRELATED_GENE_TO_DISEASE}
							fetchAssociations={fetchAssociations}
						/>
						<AssocBlock
							label={`GET /association — category: GeneToPhenotypicFeatureAssociation`}
							category={ALS_ASSOCIATION_CATEGORIES.GENE_TO_PHENOTYPE}
							fetchAssociations={fetchAssociations}
						/>
						<AssocBlock
							label={`GET /association — category: GenotypeToDiseaseAssociation (Disease Models)`}
							category={ALS_ASSOCIATION_CATEGORIES.GENOTYPE_TO_DISEASE}
							fetchAssociations={fetchAssociations}
						/>
					</>
				)}
			</div>
		</PageLayout>
	);
};

export default MonarchTest;
