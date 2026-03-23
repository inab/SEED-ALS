import { css } from '@emotion/react';
import { useEffect, useState, ReactElement } from 'react';
import PageLayout from '../../../PageLayout';
import { useEgaData } from '../../../../global/hooks/useEgaData';
import { fetchStudyDatasets } from '../../../../global/services/egaApi';
import { EgaDataset } from '../../../../global/types/ega';
import { EGA_API_BASE_URL, ALS_EGA_KEYWORDS } from '../../../../global/utils/constants';

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

// ─── Main page ───────────────────────────────────────────────────────────────

const EgaTest = (): ReactElement => {
	const { studies, loading, error } = useEgaData();

	const [datasets, setDatasets] = useState<EgaDataset[] | null>(null);
	const [datasetsLoading, setDatasetsLoading] = useState(false);
	const [datasetsError, setDatasetsError] = useState<string | null>(null);

	// Once we have at least one ALS study, fetch its datasets
	const firstStudy = studies[0] ?? null;

	useEffect(() => {
		if (!firstStudy) return;
		setDatasetsLoading(true);
		fetchStudyDatasets(firstStudy.accession_id)
			.then((data) => {
				setDatasets(data);
				setDatasetsLoading(false);
			})
			.catch((err) => {
				setDatasetsError(err instanceof Error ? err.message : 'Unknown error');
				setDatasetsLoading(false);
			});
	}, [firstStudy]);

	return (
		<PageLayout subtitle="API Test — EGA">
			<div
				css={css`
					max-width: 900px;
					margin: 0 auto;
					padding: 40px 24px 72px;
				`}
			>
				<h1 css={css`font-family: monospace; font-size: 1.4rem; margin-bottom: 8px;`}>
					EGA Metadata API — Integration Test
				</h1>
				<p css={css`font-family: monospace; font-size: 0.85rem; color: #6c757d; margin-bottom: 8px;`}>
					Real HTTP requests to <code>{EGA_API_BASE_URL}</code>
				</p>
				<p css={css`font-family: monospace; font-size: 0.85rem; color: #6c757d; margin-bottom: 40px;`}>
					ALS keywords: {ALS_EGA_KEYWORDS.map((kw) => <code key={kw} css={css`margin-right: 6px;`}>"{kw}"</code>)}
				</p>

				{/* ── Section 1: All studies + ALS filter ── */}
				<div css={sectionCss}>
					<p css={titleCss}>
						GET /studies?limit=0 → ALS filter
						{!loading && !error && <span css={statusCss(studies.length > 0)}>
							{studies.length > 0 ? 'OK' : 'NO RESULTS'}
						</span>}
						{!loading && error && <span css={statusCss(false)}>FAIL</span>}
					</p>

					{loading && <p css={rowCss}>⏳ fetching all studies and filtering ALS…</p>}
					{error && <p css={rowCss}>❌ Error: {error}</p>}

					{!loading && !error && (
						<>
							<p css={rowCss}>{check(studies.length > 0)} ALS studies found: <strong>{studies.length}</strong></p>

							{studies.slice(0, 3).map((study) => (
								<div key={study.accession_id} css={cardCss}>
									<span css={labelCss}>accession: </span>{study.accession_id}{' '}
									<span css={labelCss}>type: </span>{study.study_type ?? '—'}{' '}
									<span css={labelCss}>released: </span>{study.released_date?.slice(0, 10) ?? '—'}
									<br />
									<span css={labelCss}>title: </span>{study.title ?? '—'}
								</div>
							))}
						</>
					)}
				</div>

				<hr css={css`border: none; border-top: 1px solid #dee2e6; margin: 32px 0;`} />

				{/* ── Section 2: Datasets for first ALS study ── */}
				{!loading && !error && firstStudy && (
					<div css={sectionCss}>
						<p css={titleCss}>
							GET /studies/{firstStudy.accession_id}/datasets
							{!datasetsLoading && !datasetsError && datasets !== null && (
								<span css={statusCss(datasets.length > 0)}>
									{datasets.length > 0 ? 'OK' : 'EMPTY'}
								</span>
							)}
							{!datasetsLoading && datasetsError && <span css={statusCss(false)}>FAIL</span>}
						</p>

						{datasetsLoading && <p css={rowCss}>⏳ loading datasets…</p>}
						{datasetsError && <p css={rowCss}>❌ Error: {datasetsError}</p>}

						{datasets !== null && (
							<>
								<p css={rowCss}>{check(datasets.length > 0)} datasets found: <strong>{datasets.length}</strong></p>

								{datasets.slice(0, 3).map((ds) => (
									<div key={ds.accession_id} css={cardCss}>
										<span css={labelCss}>accession: </span>{ds.accession_id}{' '}
										<span css={labelCss}>access: </span>{ds.access_type}{' '}
										<span css={labelCss}>samples: </span>{ds.num_samples}
										<br />
										<span css={labelCss}>technologies: </span>{ds.technologies.join(', ') || '—'}
										<br />
										<span css={labelCss}>title: </span>{ds.title ?? '—'}
									</div>
								))}
							</>
						)}
					</div>
				)}
			</div>
		</PageLayout>
	);
};

export default EgaTest;
