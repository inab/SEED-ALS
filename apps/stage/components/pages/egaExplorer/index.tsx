import { css, useTheme } from '@emotion/react';
import { useState, useEffect, ReactElement } from 'react';
import { EgaDataset } from '../../../global/types/ega';
import { useEgaData } from '../../../global/hooks/useEgaData';
import PageLayout from '../../PageLayout';
import Loader from '../../Loader';
import defaultTheme from '../../theme';

const EGA_STUDY_URL = (id: string) => `https://ega-archive.org/studies/${id}`;
const EGA_DATASET_URL = (id: string) => `https://ega-archive.org/datasets/${id}`;
const DESC_LIMIT = 320;
const PAGE_SIZE = 10;
const NAV_HEIGHT = 72;

type SortKey = 'accession_id' | 'title' | 'study_type' | 'released_date' | 'samples';
type SortDir = 'asc' | 'desc';

const EgaExplorer = (): ReactElement => {
	const theme: typeof defaultTheme = useTheme();
	const { studies, loading, error, fetchStudyDatasets } = useEgaData();

	// Datasets pre-fetch
	const [datasetsMap, setDatasetsMap] = useState<Record<string, EgaDataset[]>>({});
	const [datasetsAllLoading, setDatasetsAllLoading] = useState(true);
	const [totalDatasets, setTotalDatasets] = useState(0);
	const [totalSamples, setTotalSamples] = useState(0);

	// Filter state
	const [searchText, setSearchText] = useState('');
	const [selectedStudyTypes, setSelectedStudyTypes] = useState<string[]>([]);

	// Pagination
	const [page, setPage] = useState(1);

	// Sort state
	const [sortKey, setSortKey] = useState<SortKey>('accession_id');
	const [sortDir, setSortDir] = useState<SortDir>('asc');

	// Modal state
	const [selectedStudyId, setSelectedStudyId] = useState<string | null>(null);
	const [showFullDesc, setShowFullDesc] = useState(false);

	useEffect(() => {
		if (loading) return;
		if (studies.length === 0) {
			setDatasetsAllLoading(false);
			return;
		}

		setDatasetsAllLoading(true);

		Promise.all(
			studies.map((study) =>
				fetchStudyDatasets(study.accession_id).catch(() => [] as EgaDataset[]),
			),
		).then((allDatasets) => {
			const newMap: Record<string, EgaDataset[]> = {};
			let ds = 0;
			let smpl = 0;
			studies.forEach((study, i) => {
				newMap[study.accession_id] = allDatasets[i];
				ds += allDatasets[i].length;
				smpl += allDatasets[i].reduce((a, d) => a + d.num_samples, 0);
			});
			setDatasetsMap(newMap);
			setTotalDatasets(ds);
			setTotalSamples(smpl);
			setDatasetsAllLoading(false);
		});
	}, [studies, loading, fetchStudyDatasets]);

	// Reset to page 1 when filters or sort change
	useEffect(() => {
		setPage(1);
	}, [searchText, selectedStudyTypes, sortKey, sortDir]);

	// Derived filter values
	const allStudyTypes = Array.from(
		new Set(studies.map((s) => s.study_type).filter(Boolean)),
	) as string[];

	const filteredStudies = studies.filter((study) => {
		if (searchText) {
			const q = searchText.toLowerCase();
			const haystack = [study.accession_id, study.title, study.abstract, study.description]
				.filter(Boolean)
				.join(' ')
				.toLowerCase();
			if (!haystack.includes(q)) return false;
		}
		if (selectedStudyTypes.length > 0) {
			if (!selectedStudyTypes.includes(study.study_type ?? '')) return false;
		}
		return true;
	});

	const studyTypeCount = allStudyTypes.length;
	const hasActiveFilters = searchText !== '' || selectedStudyTypes.length > 0;

	const selectedStudy = studies.find((s) => s.accession_id === selectedStudyId) ?? null;
	const selectedDatasets = selectedStudyId ? (datasetsMap[selectedStudyId] ?? null) : null;

	const openModal = (studyId: string) => {
		setSelectedStudyId(studyId);
		setShowFullDesc(false);
	};

	const descText = selectedStudy
		? (selectedStudy.abstract || selectedStudy.description || '')
		: '';
	const descTruncated =
		descText.length > DESC_LIMIT && !showFullDesc
			? descText.substring(0, DESC_LIMIT) + '…'
			: descText;

	const studySampleTotal = (studyId: string): number | null => {
		const ds = datasetsMap[studyId];
		if (!ds) return null;
		return ds.reduce((a, d) => a + d.num_samples, 0);
	};

	// Sort filtered studies
	const sortedStudies = [...filteredStudies].sort((a, b) => {
		let va: string | number;
		let vb: string | number;
		if (sortKey === 'samples') {
			va = studySampleTotal(a.accession_id) ?? -1;
			vb = studySampleTotal(b.accession_id) ?? -1;
		} else {
			va = (a[sortKey] ?? '') as string;
			vb = (b[sortKey] ?? '') as string;
		}
		if (va < vb) return sortDir === 'asc' ? -1 : 1;
		if (va > vb) return sortDir === 'asc' ? 1 : -1;
		return 0;
	});

	const totalPages = Math.ceil(sortedStudies.length / PAGE_SIZE);
	const paginated = sortedStudies.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

	const toggleStudyType = (type: string) => {
		setSelectedStudyTypes((prev) =>
			prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
		);
	};

	const clearFilters = () => {
		setSearchText('');
		setSelectedStudyTypes([]);
	};

	const toggleSort = (key: SortKey) => {
		if (sortKey === key) {
			setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
		} else {
			setSortKey(key);
			setSortDir('asc');
		}
	};

	const btnCss = css`
		font-family: 'Geomanist', sans-serif;
		font-size: 0.8rem;
		padding: 5px 14px;
		border: 1px solid ${theme.colors.grey_2};
		border-radius: 6px;
		background: ${theme.colors.white};
		color: ${theme.colors.primary};
		cursor: pointer;
		&:hover:not(:disabled) { background: ${theme.colors.grey_1}; }
		&:disabled { opacity: 0.4; cursor: default; }
	`;

	const accessBadgeCss = (accessType: string) => css`
		font-family: 'Geomanist', sans-serif;
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.4px;
		padding: 3px 8px;
		border-radius: 10px;
		background: ${accessType === 'controlled'
			? theme.colors.warning_light
			: theme.colors.success_light};
		color: ${accessType === 'controlled'
			? theme.colors.warning_dark
			: theme.colors.success_dark};
	`;

	const sectionLabelCss = css`
		font-family: 'Geomanist', sans-serif;
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.8px;
		color: ${theme.colors.grey_5};
		margin: 0 0 8px;
		padding: 0 20px;
	`;

	const columns: { label: string; width: string; sk: SortKey | null }[] = [
		{ label: 'Accession', width: '13%', sk: 'accession_id' },
		{ label: 'Title', width: '37%', sk: 'title' },
		{ label: 'Study Type', width: '15%', sk: 'study_type' },
		{ label: 'Released', width: '10%', sk: 'released_date' },
		{ label: 'Samples', width: '11%', sk: 'samples' },
		{ label: 'Details', width: '14%', sk: null },
	];

	return (
		<PageLayout subtitle="EGA Explorer">
			{/* Loading state */}
			{loading && (
				<div
					css={css`
						display: flex;
						justify-content: center;
						align-items: center;
						min-height: 60vh;
						padding: 120px 24px;
					`}
				>
					<Loader message="Loading EGA studies…" />
				</div>
			)}
			{error && (
				<p
					css={css`
						font-family: 'Geomanist', sans-serif;
						font-size: 0.875rem;
						color: ${theme.colors.error};
						text-align: center;
						padding: 48px 0;
					`}
				>
					Error: {error}
				</p>
			)}

			{!loading && !error && (
				<>
					{/* Page header */}
					<section
						css={css`
							background: linear-gradient(135deg, ${theme.colors.primary_dark} 0%, ${theme.colors.primary} 100%);
							color: ${theme.colors.white};
							padding: 56px 24px;
							text-align: center;
						`}
					>
						<h1
							css={css`
								font-family: 'Geomanist', sans-serif;
								font-size: 2rem;
								font-weight: 700;
								margin: 0 0 16px;
							`}
						>
							EGA Metadata Explorer
						</h1>
						<p
							css={css`
								font-family: 'Geomanist', sans-serif;
								font-size: 1.05rem;
								font-weight: 300;
								opacity: 0.88;
								max-width: 640px;
								margin: 0 auto;
								line-height: 1.6;
							`}
						>
							Public metadata from ALS-related studies and datasets available in the European
							Genome-phenome Archive.
						</p>
					</section>

					{/* Two-column layout */}
					<div css={css`display: flex; width: 100%; align-items: flex-start;`}>

						{/* Left filter panel */}
						<aside
							css={css`
								width: 220px;
								flex-shrink: 0;
								position: sticky;
								top: ${NAV_HEIGHT}px;
								align-self: flex-start;
								padding: 32px 0;
								background: ${theme.colors.white};
								box-shadow: 2px 0 8px rgba(0, 0, 0, 0.07);
							`}
						>
							{/* Search */}
							<p css={sectionLabelCss}>Search</p>
							<div css={css`padding: 0 12px; margin-bottom: 24px;`}>
								<input
									type="text"
									value={searchText}
									onChange={(e) => setSearchText(e.target.value)}
									placeholder="Title, accession…"
									css={css`
										width: 100%;
										box-sizing: border-box;
										font-family: 'Geomanist', sans-serif;
										font-size: 0.825rem;
										color: ${theme.colors.grey_6};
										padding: 7px 10px;
										border: 1px solid ${theme.colors.grey_2};
										border-radius: 6px;
										outline: none;
										&:focus { border-color: ${theme.colors.primary}; }
										&::placeholder { color: ${theme.colors.grey_3}; }
									`}
								/>
							</div>

							{/* Study Type */}
							{allStudyTypes.length > 0 && (
								<>
									<p css={sectionLabelCss}>Study Type</p>
									<ul css={css`list-style: none; margin: 0 0 24px; padding: 0;`}>
										{allStudyTypes.map((type) => (
											<li key={type}>
												<label
													css={css`
														display: flex;
														align-items: center;
														gap: 8px;
														padding: 8px 20px;
														font-family: 'Geomanist', sans-serif;
														font-size: 0.825rem;
														font-weight: 300;
														color: ${theme.colors.grey_6};
														cursor: pointer;
														border-left: 2px solid transparent;
														transition: background 0.15s ease, border-color 0.15s ease;
														&:hover {
															color: ${theme.colors.primary};
															border-left-color: ${theme.colors.primary_pale};
															background: ${theme.colors.primary_palest};
														}
													`}
												>
													<input
														type="checkbox"
														checked={selectedStudyTypes.includes(type)}
														onChange={() => toggleStudyType(type)}
														css={css`cursor: pointer; accent-color: ${theme.colors.primary};`}
													/>
													{type}
												</label>
											</li>
										))}
									</ul>
								</>
							)}

							{/* Clear filters */}
							{hasActiveFilters && (
								<>
									<div css={css`margin: 0 20px 8px; border-top: 1px solid ${theme.colors.grey_2};`} />
									<div css={css`padding: 8px 20px;`}>
										<button
											onClick={clearFilters}
											css={css`
												font-family: 'Geomanist', sans-serif;
												font-size: 0.8rem;
												color: ${theme.colors.grey_5};
												background: none;
												border: 1px solid ${theme.colors.grey_2};
												border-radius: 6px;
												padding: 6px 12px;
												cursor: pointer;
												width: 100%;
												&:hover { color: ${theme.colors.primary}; border-color: ${theme.colors.primary}; }
											`}
										>
											Reset filters
										</button>
									</div>
								</>
							)}
						</aside>

						{/* Main content */}
						<main
							css={css`
								flex: 1;
								min-width: 0;
								padding: 32px 40px 72px;
								background: ${theme.colors.grey_1};
							`}
						>
							{/* Summary cards */}
							<div
								css={css`
									display: flex;
									flex-wrap: wrap;
									gap: 16px;
									margin-bottom: 40px;
								`}
							>
								{[
									{ value: studies.length.toLocaleString(), label: 'ALS Studies', loading: false },
									{ value: studyTypeCount.toLocaleString(), label: 'Study Types', loading: false },
									{
										value: datasetsAllLoading ? '…' : totalDatasets.toLocaleString(),
										label: 'ALS Datasets',
										loading: datasetsAllLoading,
									},
									{
										value: datasetsAllLoading ? '…' : totalSamples.toLocaleString(),
										label: 'ALS Samples',
										loading: datasetsAllLoading,
									},
								].map((card) => (
									<div
										key={card.label}
										css={css`
											background: ${theme.colors.white};
											border: 1px solid ${theme.colors.grey_2};
											border-radius: 10px;
											padding: 20px 24px;
											min-width: 130px;
											flex: 1;
										`}
									>
										<p
											css={css`
												font-family: 'Geomanist', sans-serif;
												font-size: 1.9rem;
												font-weight: 700;
												color: ${card.loading ? theme.colors.grey_3 : theme.colors.primary};
												margin: 0 0 4px;
												line-height: 1;
											`}
										>
											{card.value}
										</p>
										<p
											css={css`
												font-family: 'Geomanist', sans-serif;
												font-size: 0.75rem;
												font-weight: 700;
												text-transform: uppercase;
												letter-spacing: 0.5px;
												color: ${theme.colors.grey_3};
												margin: 0;
											`}
										>
											{card.label}
										</p>
									</div>
								))}
							</div>

							{/* Studies table */}
							{sortedStudies.length > 0 ? (
								<div
									css={css`
										background: ${theme.colors.white};
										border-radius: 8px;
										padding: 32px 40px 40px;
										box-shadow: 0 3px 16px rgba(0, 0, 0, 0.07);
									`}
								>
									{/* Filter result info */}
									{hasActiveFilters && (
										<p
											css={css`
												font-family: 'Geomanist', sans-serif;
												font-size: 0.8rem;
												color: ${theme.colors.grey_3};
												margin: 0 0 16px;
											`}
										>
											Showing {filteredStudies.length} of {studies.length} studies
										</p>
									)}

									<table css={css`width: 100%; border-collapse: collapse; table-layout: fixed;`}>
										<thead>
											<tr>
												{columns.map((col) => {
													const isActive = col.sk !== null && sortKey === col.sk;
													return (
														<th
															key={col.label}
															onClick={col.sk !== null ? () => toggleSort(col.sk!) : undefined}
															css={css`
																width: ${col.width};
																text-align: left;
																font-family: 'Geomanist', sans-serif;
																font-size: 0.72rem;
																font-weight: 700;
																text-transform: uppercase;
																letter-spacing: 0.5px;
																color: ${isActive ? theme.colors.primary : theme.colors.grey_3};
																padding: 8px 12px;
																border-bottom: 2px solid ${theme.colors.grey_2};
																${col.sk !== null ? 'cursor: pointer; user-select: none;' : ''}
																${col.sk !== null ? `&:hover { color: ${theme.colors.primary}; }` : ''}
															`}
														>
															<span css={css`display: inline-flex; align-items: center; gap: 4px;`}>
																{col.label}
																{col.sk !== null && (
																	<span
																		css={css`
																			font-size: 0.6rem;
																			opacity: ${isActive ? 1 : 0.35};
																		`}
																	>
																		{isActive ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
																	</span>
																)}
															</span>
														</th>
													);
												})}
											</tr>
										</thead>
										<tbody>
											{paginated.map((study) => {
												const sampleTotal = studySampleTotal(study.accession_id);
												return (
													<tr
														key={study.accession_id}
														css={css`
															border-bottom: 1px solid ${theme.colors.grey_1};
															&:hover { background: ${theme.colors.grey_1}; }
														`}
													>
														<td css={css`padding: 9px 12px;`}>
															<a
																href={EGA_STUDY_URL(study.accession_id)}
																target="_blank"
																rel="noopener noreferrer"
																css={css`
																	font-family: 'Geomanist', sans-serif;
																	font-size: 0.8rem;
																	font-weight: 700;
																	color: ${theme.colors.primary};
																	text-decoration: none;
																	display: inline-flex;
																	align-items: center;
																	gap: 3px;
																	&:hover { text-decoration: underline; opacity: 0.8; }
																`}
															>
																{study.accession_id}
																<span css={css`font-size: 0.65rem; opacity: 0.55;`}>↗</span>
															</a>
														</td>
														<td
															title={study.title ?? undefined}
															css={css`
																font-family: 'Geomanist', sans-serif;
																font-size: 0.825rem;
																color: ${theme.colors.black};
																padding: 9px 12px;
																overflow: hidden;
																text-overflow: ellipsis;
																white-space: nowrap;
															`}
														>
															{study.title ?? '—'}
														</td>
														<td
															css={css`
																font-family: 'Geomanist', sans-serif;
																font-size: 0.8rem;
																color: ${theme.colors.grey_5};
																padding: 9px 12px;
																overflow: hidden;
																text-overflow: ellipsis;
																white-space: nowrap;
															`}
														>
															{study.study_type ?? '—'}
														</td>
														<td
															css={css`
																font-family: 'Geomanist', sans-serif;
																font-size: 0.8rem;
																color: ${theme.colors.grey_5};
																padding: 9px 12px;
															`}
														>
															{study.released_date ? study.released_date.substring(0, 10) : '—'}
														</td>
														<td
															css={css`
																font-family: 'Geomanist', sans-serif;
																font-size: 0.8rem;
																color: ${datasetsAllLoading ? theme.colors.grey_3 : theme.colors.grey_5};
																padding: 9px 12px;
															`}
														>
															{datasetsAllLoading
																? '…'
																: sampleTotal !== null
																	? sampleTotal.toLocaleString()
																	: '—'}
														</td>
														<td css={css`padding: 9px 12px;`}>
															<button
																onClick={() => openModal(study.accession_id)}
																css={css`
																	display: inline-flex;
																	align-items: center;
																	gap: 4px;
																	font-family: 'Geomanist', sans-serif;
																	font-size: 0.75rem;
																	font-weight: 700;
																	color: ${theme.colors.primary};
																	background: ${theme.colors.primary_pale};
																	border: none;
																	border-radius: 20px;
																	padding: 4px 11px;
																	cursor: pointer;
																	transition: filter 0.15s ease;
																	&:hover { filter: brightness(0.93); }
																`}
															>
																Details
																<span css={css`font-size: 0.65rem; opacity: 0.65;`}>↗</span>
															</button>
														</td>
													</tr>
												);
											})}
										</tbody>
									</table>

									{/* Pagination */}
									{totalPages > 1 && (
										<div
											css={css`
												display: flex;
												align-items: center;
												justify-content: space-between;
												margin-top: 16px;
											`}
										>
											<span
												css={css`
													font-family: 'Geomanist', sans-serif;
													font-size: 0.8rem;
													color: ${theme.colors.grey_3};
												`}
											>
												{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sortedStudies.length)} of{' '}
												{sortedStudies.length}
											</span>
											<div css={css`display: flex; gap: 8px;`}>
												{[
													{ label: '«', action: () => setPage(1), disabled: page === 1, title: 'First page' },
													{ label: 'Previous', action: () => setPage((p) => p - 1), disabled: page === 1, title: 'Previous page' },
													{ label: 'Next', action: () => setPage((p) => p + 1), disabled: page === totalPages, title: 'Next page' },
													{ label: '»', action: () => setPage(totalPages), disabled: page === totalPages, title: 'Last page' },
												].map((btn) => (
													<button
														key={btn.label}
														onClick={btn.action}
														disabled={btn.disabled}
														title={btn.title}
														css={btnCss}
													>
														{btn.label}
													</button>
												))}
											</div>
										</div>
									)}
								</div>
							) : (
								<p
									css={css`
										font-family: 'Geomanist', sans-serif;
										font-size: 0.85rem;
										color: ${theme.colors.grey_3};
										text-align: center;
										padding: 24px 0;
									`}
								>
									{hasActiveFilters
										? 'No studies match the current filters.'
										: 'No ALS-related studies found.'}
								</p>
							)}
						</main>
					</div>
				</>
			)}

			{/* Datasets modal */}
			{selectedStudy && (
				<div
					onClick={() => setSelectedStudyId(null)}
					css={css`
						position: fixed;
						inset: 0;
						background: rgba(0, 0, 0, 0.45);
						z-index: 1000;
						display: flex;
						align-items: center;
						justify-content: center;
						padding: 24px;
					`}
				>
					<div
						onClick={(e) => e.stopPropagation()}
						css={css`
							background: ${theme.colors.white};
							border-radius: 10px;
							width: 100%;
							max-width: 960px;
							max-height: 80vh;
							display: flex;
							flex-direction: column;
							box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
						`}
					>
						{/* Modal header */}
						<div
							css={css`
								display: flex;
								align-items: flex-start;
								justify-content: space-between;
								padding: 20px 24px 16px;
								border-bottom: 1px solid ${theme.colors.grey_2};
								flex-shrink: 0;
							`}
						>
							<div css={css`flex: 1; min-width: 0;`}>
								<p
									css={css`
										font-family: 'Geomanist', sans-serif;
										font-size: 0.72rem;
										font-weight: 700;
										text-transform: uppercase;
										letter-spacing: 0.6px;
										color: ${theme.colors.grey_3};
										margin: 0 0 4px;
									`}
								>
									Study
								</p>
								<h3
									css={css`
										font-family: 'Geomanist', sans-serif;
										font-size: 1.05rem;
										font-weight: 700;
										color: ${theme.colors.primary};
										margin: 0 0 10px;
										line-height: 1.35;
										overflow-wrap: break-word;
										word-break: break-word;
									`}
								>
									{selectedStudy.title ?? selectedStudy.accession_id}
								</h3>
								{/* Metadata */}
								<div css={css`display: flex; flex-wrap: wrap; align-items: center; gap: 8px;`}>
									<a
										href={EGA_STUDY_URL(selectedStudy.accession_id)}
										target="_blank"
										rel="noopener noreferrer"
										css={css`
											font-family: 'Geomanist', sans-serif;
											font-size: 0.75rem;
											font-weight: 700;
											color: ${theme.colors.primary};
											background: ${theme.colors.primary_pale};
											text-decoration: none;
											padding: 3px 10px;
											border-radius: 20px;
											display: inline-flex;
											align-items: center;
											gap: 3px;
											&:hover { filter: brightness(0.93); }
										`}
									>
										{selectedStudy.accession_id}
										<span css={css`font-size: 0.65rem; opacity: 0.65;`}>↗</span>
									</a>
									{selectedStudy.study_type && (
										<span
											css={css`
												font-family: 'Geomanist', sans-serif;
												font-size: 0.75rem;
												color: ${theme.colors.grey_5};
												background: ${theme.colors.grey_1};
												padding: 3px 10px;
												border-radius: 20px;
											`}
										>
											{selectedStudy.study_type}
										</span>
									)}
									{selectedStudy.released_date && (
										<span
											css={css`
												font-family: 'Geomanist', sans-serif;
												font-size: 0.75rem;
												color: ${theme.colors.grey_5};
												background: ${theme.colors.grey_1};
												padding: 3px 10px;
												border-radius: 20px;
											`}
										>
											Released {selectedStudy.released_date.substring(0, 10)}
										</span>
									)}
								</div>
							</div>
							<button
								onClick={() => setSelectedStudyId(null)}
								css={css`
									font-size: 1rem;
									color: ${theme.colors.grey_3};
									background: none;
									border: none;
									cursor: pointer;
									padding: 4px 8px;
									border-radius: 4px;
									line-height: 1;
									margin-left: 16px;
									flex-shrink: 0;
									&:hover { background: ${theme.colors.grey_1}; color: ${theme.colors.grey_5}; }
								`}
							>
								✕
							</button>
						</div>

						{/* Modal body — scrollable */}
						<div
							css={css`
								overflow-y: auto;
								padding: 20px 24px 24px;
								display: flex;
								flex-direction: column;
								gap: 24px;
							`}
						>
							{/* Abstract */}
							{descText && (
								<div>
									<p
										css={css`
											font-family: 'Geomanist', sans-serif;
											font-size: 0.72rem;
											font-weight: 700;
											text-transform: uppercase;
											letter-spacing: 0.6px;
											color: ${theme.colors.grey_3};
											margin: 0 0 8px;
										`}
									>
										{selectedStudy.abstract ? 'Abstract' : 'Description'}
									</p>
									<p
										css={css`
											font-family: 'Geomanist', sans-serif;
											font-size: 0.875rem;
											color: ${theme.colors.grey_5};
											line-height: 1.65;
											margin: 0 0 8px;
										`}
									>
										{descTruncated}
									</p>
									{descText.length > DESC_LIMIT && (
										<button
											onClick={() => setShowFullDesc(!showFullDesc)}
											css={css`
												font-family: 'Geomanist', sans-serif;
												font-size: 0.8rem;
												color: ${theme.colors.primary};
												background: none;
												border: none;
												padding: 0;
												cursor: pointer;
												text-decoration: underline;
												&:hover { opacity: 0.7; }
											`}
										>
											{showFullDesc ? 'Show less' : 'Show more'}
										</button>
									)}
								</div>
							)}

							{/* Datasets */}
							<div>
								<div
									css={css`
										display: flex;
										align-items: baseline;
										gap: 10px;
										margin-bottom: 12px;
									`}
								>
									<p
										css={css`
											font-family: 'Geomanist', sans-serif;
											font-size: 0.72rem;
											font-weight: 700;
											text-transform: uppercase;
											letter-spacing: 0.6px;
											color: ${theme.colors.grey_3};
											margin: 0;
										`}
									>
										Datasets
									</p>
									{selectedDatasets && selectedDatasets.length > 0 && (
										<span
											css={css`
												font-family: 'Geomanist', sans-serif;
												font-size: 0.75rem;
												font-weight: 700;
												background: ${theme.colors.primary_pale};
												color: ${theme.colors.primary};
												padding: 2px 8px;
												border-radius: 10px;
											`}
										>
											{selectedDatasets.length}
										</span>
									)}
									{selectedDatasets && selectedDatasets.length > 0 && (
										<span
											css={css`
												font-family: 'Geomanist', sans-serif;
												font-size: 0.75rem;
												color: ${theme.colors.grey_3};
											`}
										>
											{selectedDatasets
												.reduce((a, d) => a + d.num_samples, 0)
												.toLocaleString()}{' '}
											samples total
										</span>
									)}
								</div>

								{selectedDatasets === null && (
									<p
										css={css`
											font-family: 'Geomanist', sans-serif;
											font-size: 0.8rem;
											color: ${theme.colors.grey_3};
											padding: 12px 0;
										`}
									>
										Loading datasets…
									</p>
								)}
								{selectedDatasets && selectedDatasets.length === 0 && (
									<p
										css={css`
											font-family: 'Geomanist', sans-serif;
											font-size: 0.8rem;
											color: ${theme.colors.grey_3};
											padding: 12px 0;
										`}
									>
										No datasets found for this study.
									</p>
								)}
								{selectedDatasets && selectedDatasets.length > 0 && (
									<table
										css={css`
											width: 100%;
											border-collapse: collapse;
										`}
									>
										<thead>
											<tr>
												{['Accession', 'Title', 'Technologies', 'Samples', 'Access'].map(
													(col) => (
														<th
															key={col}
															css={css`
																text-align: left;
																font-family: 'Geomanist', sans-serif;
																font-size: 0.68rem;
																font-weight: 700;
																text-transform: uppercase;
																letter-spacing: 0.5px;
																color: ${theme.colors.grey_3};
																padding: 6px 10px;
																border-bottom: 1px solid ${theme.colors.grey_2};
															`}
														>
															{col}
														</th>
													),
												)}
											</tr>
										</thead>
										<tbody>
											{selectedDatasets.map((ds) => (
												<tr
													key={ds.accession_id}
													css={css`
														border-bottom: 1px solid ${theme.colors.grey_1};
														&:last-child { border-bottom: none; }
														&:hover { background: ${theme.colors.grey_1}; }
													`}
												>
													<td css={css`padding: 8px 10px;`}>
														<a
															href={EGA_DATASET_URL(ds.accession_id)}
															target="_blank"
															rel="noopener noreferrer"
															css={css`
																font-family: 'Geomanist', sans-serif;
																font-size: 0.775rem;
																font-weight: 700;
																color: ${theme.colors.primary};
																text-decoration: none;
																display: inline-flex;
																align-items: center;
																gap: 3px;
																white-space: nowrap;
																&:hover { text-decoration: underline; opacity: 0.8; }
															`}
														>
															{ds.accession_id}
															<span css={css`font-size: 0.6rem; opacity: 0.55;`}>↗</span>
														</a>
													</td>
													<td
														title={ds.title ?? undefined}
														css={css`
															font-family: 'Geomanist', sans-serif;
															font-size: 0.775rem;
															color: ${theme.colors.black};
															padding: 8px 10px;
															overflow: hidden;
															text-overflow: ellipsis;
															white-space: nowrap;
															max-width: 260px;
														`}
													>
														{ds.title ?? '—'}
													</td>
													<td
														css={css`
															font-family: 'Geomanist', sans-serif;
															font-size: 0.775rem;
															color: ${theme.colors.grey_5};
															padding: 8px 10px;
														`}
													>
														{ds.technologies?.join(', ') || '—'}
													</td>
													<td
														css={css`
															font-family: 'Geomanist', sans-serif;
															font-size: 0.775rem;
															color: ${theme.colors.grey_5};
															padding: 8px 10px;
															white-space: nowrap;
														`}
													>
														{ds.num_samples.toLocaleString()}
													</td>
													<td css={css`padding: 8px 10px;`}>
														<span css={accessBadgeCss(ds.access_type)}>
															{ds.access_type}
														</span>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</PageLayout>
	);
};

export default EgaExplorer;
