import { css, useTheme } from '@emotion/react';
import { useState, useEffect, ReactElement } from 'react';
import { MonarchAssociation, MonarchAssociationResponse } from '../../../global/types/monarch';
import { ALS_ASSOCIATION_CATEGORIES } from '../../../global/utils/constants';
import defaultTheme from '../../theme';

const PAGE_SIZE = 10;
const GENE_PH_BATCH = 500;

const RELATIONSHIP_LABELS: Record<string, string> = {
	[ALS_ASSOCIATION_CATEGORIES.CAUSAL_GENE_TO_DISEASE]: 'Causal',
	[ALS_ASSOCIATION_CATEGORIES.CORRELATED_GENE_TO_DISEASE]: 'Correlated',
};

const cleanPredicate = (predicate: string) =>
	predicate.replace('biolink:', '').replace(/_/g, ' ');

interface TaggedAssociation extends MonarchAssociation {
	_relationshipType: string;
}

type SortKey = 'gene' | 'relationship' | 'disease';

interface GenesTableProps {
	fetchAssociations: (cat: string, limit?: number, offset?: number) => Promise<MonarchAssociationResponse>;
	onLoaded?: () => void;
}

const GenesTable = ({ fetchAssociations, onLoaded }: GenesTableProps): ReactElement => {
	const theme: typeof defaultTheme = useTheme();
	const [items, setItems] = useState<TaggedAssociation[]>([]);
	const [totals, setTotals] = useState<Record<string, number>>({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState('');
	const [deselectedTypes, setDeselectedTypes] = useState<Set<string>>(new Set());
	const [page, setPage] = useState(1);
	const [sortKey, setSortKey] = useState<SortKey>('gene');
	const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

	// Gene → phenotype map (loaded in parallel)
	const [genePhMap, setGenePhMap] = useState<Record<string, string[]>>({});
	const [genePhLoading, setGenePhLoading] = useState(true);

	// Modal state
	const [selectedGene, setSelectedGene] = useState<string | null>(null);

	useEffect(() => {
		async function loadGenes() {
			try {
				const [causal, correlated] = await Promise.all([
					fetchAssociations(ALS_ASSOCIATION_CATEGORIES.CAUSAL_GENE_TO_DISEASE, 100, 0),
					fetchAssociations(ALS_ASSOCIATION_CATEGORIES.CORRELATED_GENE_TO_DISEASE, 100, 0),
				]);

				const tag = (assocs: MonarchAssociation[], type: string): TaggedAssociation[] =>
					assocs.map((item) => ({ ...item, _relationshipType: type }));

				const merged = [
					...tag(causal.items, ALS_ASSOCIATION_CATEGORIES.CAUSAL_GENE_TO_DISEASE),
					...tag(correlated.items, ALS_ASSOCIATION_CATEGORIES.CORRELATED_GENE_TO_DISEASE),
				];

				setItems(merged);
				setTotals({
					[ALS_ASSOCIATION_CATEGORIES.CAUSAL_GENE_TO_DISEASE]: causal.total,
					[ALS_ASSOCIATION_CATEGORIES.CORRELATED_GENE_TO_DISEASE]: correlated.total,
				});
				setLoading(false);
				onLoaded?.();
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to load genes');
				setLoading(false);
				onLoaded?.();
			}
		}

		async function loadGenePhenotypes() {
			try {
				const first = await fetchAssociations(ALS_ASSOCIATION_CATEGORIES.GENE_TO_PHENOTYPE, GENE_PH_BATCH, 0);
				let all = first.items;
				let offset = GENE_PH_BATCH;
				while (offset < first.total) {
					const next = await fetchAssociations(
						ALS_ASSOCIATION_CATEGORIES.GENE_TO_PHENOTYPE,
						GENE_PH_BATCH,
						offset,
					);
					all = [...all, ...next.items];
					offset += GENE_PH_BATCH;
				}

				const map: Record<string, string[]> = {};
				all.forEach((item) => {
					const gene = item.subject_label ?? 'Unknown';
					if (!map[gene]) map[gene] = [];
					if (item.object_label && !map[gene].includes(item.object_label)) {
						map[gene].push(item.object_label);
					}
				});
				Object.keys(map).forEach((g) => map[g].sort((a, b) => a.localeCompare(b)));

				setGenePhMap(map);
				setGenePhLoading(false);
			} catch {
				setGenePhLoading(false);
			}
		}

		loadGenes();
		loadGenePhenotypes();
	}, [fetchAssociations]);

	const totalAll = Object.values(totals).reduce((a, b) => a + b, 0);

	const toggleSort = (key: SortKey) => {
		if (sortKey === key) {
			setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
		} else {
			setSortKey(key);
			setSortDir('asc');
		}
		setPage(1);
	};

	const sorted = [...items].sort((a, b) => {
		let va: string, vb: string;
		if (sortKey === 'gene') { va = a.subject_label ?? ''; vb = b.subject_label ?? ''; }
		else if (sortKey === 'relationship') { va = cleanPredicate(a.predicate); vb = cleanPredicate(b.predicate); }
		else { va = a.object_label ?? ''; vb = b.object_label ?? ''; }
		const cmp = va.localeCompare(vb);
		return sortDir === 'asc' ? cmp : -cmp;
	});

	const filtered = sorted.filter(
		(item) =>
			item.subject_label?.toLowerCase().includes(search.toLowerCase()) &&
			!deselectedTypes.has(item._relationshipType),
	);

	const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
	const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

	const handleSearch = (value: string) => {
		setSearch(value);
		setPage(1);
	};

	const toggleType = (type: string) => {
		setDeselectedTypes((prev) => {
			const next = new Set(prev);
			next.has(type) ? next.delete(type) : next.add(type);
			return next;
		});
		setPage(1);
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
		&:hover:not(:disabled) {
			background: ${theme.colors.grey_1};
		}
		&:disabled {
			opacity: 0.4;
			cursor: default;
		}
	`;

	const selectedPhenotypes = selectedGene ? (genePhMap[selectedGene] ?? []) : [];

	const columns: { label: string; width: string; sk: SortKey }[] = [
		{ label: 'Gene', width: '30%', sk: 'gene' },
		{ label: 'Relationship', width: '30%', sk: 'relationship' },
		{ label: 'Disease', width: '40%', sk: 'disease' },
	];

	return (
		<>
			<section
				id="genes"
				css={css`
					margin-bottom: 48px;
					scroll-margin-top: 80px;
				`}
			>
				{/* Section header */}
				<div css={css`display: flex; align-items: baseline; gap: 10px; margin-bottom: 6px;`}>
					<h2
						css={css`
							font-family: 'Geomanist', sans-serif;
							font-size: 1.15rem;
							font-weight: 700;
							color: ${theme.colors.primary};
							margin: 0;
						`}
					>
						Genes
					</h2>
					{totalAll > 0 && (
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
							{totalAll.toLocaleString()}
						</span>
					)}
				</div>
				<p
					css={css`
						font-family: 'Geomanist', sans-serif;
						font-size: 0.85rem;
						color: ${theme.colors.grey_5};
						margin: 6px 0 0;
						line-height: 1.5;
					`}
				>
					Genes causally linked to or statistically correlated with ALS. Click a gene name to see its associated phenotypes.
				</p>

				<div
					css={css`
						border-top: 1px solid ${theme.colors.grey_2};
						margin-top: 16px;
						padding-top: 24px;
					`}
				>
					{error && (
						<p css={css`font-family: 'Geomanist', sans-serif; font-size: 0.875rem; color: ${theme.colors.error};`}>
							Error: {error}
						</p>
					)}

					{!loading && !error && (
						<>
							{/* Relationship type filter */}
							<div
								css={css`
									display: flex;
									flex-wrap: wrap;
									align-items: center;
									gap: 8px 16px;
									margin-bottom: 12px;
								`}
							>
								{Object.entries(RELATIONSHIP_LABELS).map(([type, label]) => (
									<label
										key={type}
										css={css`
											display: flex;
											align-items: center;
											gap: 6px;
											font-family: 'Geomanist', sans-serif;
											font-size: 0.8rem;
											color: ${theme.colors.grey_5};
											cursor: pointer;
											user-select: none;
										`}
									>
										<input
											type="checkbox"
											checked={!deselectedTypes.has(type)}
											onChange={() => toggleType(type)}
											css={css`accent-color: ${theme.colors.primary}; cursor: pointer;`}
										/>
										{label}
										{totals[type] !== undefined && (
											<span css={css`color: ${theme.colors.grey_3}; font-size: 0.75rem;`}>
												({totals[type]})
											</span>
										)}
									</label>
								))}
								{deselectedTypes.size > 0 && (
									<button
										onClick={() => { setDeselectedTypes(new Set()); setPage(1); }}
										css={css`
											font-family: 'Geomanist', sans-serif;
											font-size: 0.75rem;
											padding: 3px 10px;
											border: 1px solid ${theme.colors.grey_2};
											border-radius: 6px;
											background: ${theme.colors.white};
											color: ${theme.colors.grey_3};
											cursor: pointer;
											margin-left: 4px;
											&:hover { color: ${theme.colors.primary}; border-color: ${theme.colors.primary_pale}; }
										`}
									>
										Reset filters
									</button>
								)}
							</div>

							{/* Search */}
							<input
								type="text"
								placeholder="Search genes…"
								value={search}
								onChange={(e) => handleSearch(e.target.value)}
								css={css`
									font-family: 'Geomanist', sans-serif;
									font-size: 0.875rem;
									width: 100%;
									box-sizing: border-box;
									padding: 8px 12px;
									border: 1px solid ${theme.colors.grey_2};
									border-radius: 6px;
									outline: none;
									margin-bottom: 12px;
									color: ${theme.colors.black};
									&:focus { border-color: ${theme.colors.primary_pale}; }
								`}
							/>

							{filtered.length > 0 ? (
								<>
									<table css={css`width: 100%; border-collapse: collapse; table-layout: fixed;`}>
										<thead>
											<tr>
												{columns.map((col) => {
													const isActive = sortKey === col.sk;
													return (
														<th
															key={col.label}
															onClick={() => toggleSort(col.sk)}
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
																cursor: pointer;
																user-select: none;
																&:hover { color: ${theme.colors.primary}; }
															`}
														>
															<span css={css`display: inline-flex; align-items: center; gap: 4px;`}>
																{col.label}
																<span
																	css={css`
																		font-size: 0.6rem;
																		opacity: ${isActive ? 1 : 0.35};
																	`}
																>
																	{isActive ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
																</span>
															</span>
														</th>
													);
												})}
											</tr>
										</thead>
										<tbody>
											{paginated.map((item) => {
												const geneName = item.subject_label ?? null;
												const hasPhenotypes = !genePhLoading && geneName !== null && (genePhMap[geneName]?.length ?? 0) > 0;
												return (
													<tr
														key={item.id}
														css={css`
															border-bottom: 1px solid ${theme.colors.grey_1};
															&:hover { background: ${theme.colors.grey_1}; }
														`}
													>
														<td css={css`padding: 9px 12px;`}>
															{hasPhenotypes ? (
																<button
																	onClick={() => setSelectedGene(geneName)}
																	css={css`
																		font-family: 'Geomanist', sans-serif;
																		font-size: 0.875rem;
																		font-weight: 700;
																		color: ${theme.colors.primary};
																		background: none;
																		border: none;
																		padding: 0;
																		cursor: pointer;
																		text-align: left;
																		display: inline-flex;
																		align-items: center;
																		gap: 4px;
																		&:hover { text-decoration: underline; }
																	`}
																>
																	{geneName}
																	<span css={css`font-size: 0.65rem; opacity: 0.6;`}>↗</span>
																</button>
															) : (
																<span
																	css={css`
																		font-family: 'Geomanist', sans-serif;
																		font-size: 0.875rem;
																		font-weight: 700;
																		color: ${theme.colors.primary};
																	`}
																>
																	{geneName ?? '—'}
																</span>
															)}
														</td>
														<td
															css={css`
																font-family: 'Geomanist', sans-serif;
																font-size: 0.8rem;
																color: ${theme.colors.grey_5};
																padding: 9px 12px;
															`}
														>
															{cleanPredicate(item.predicate)}
														</td>
														<td
															css={css`
																font-family: 'Geomanist', sans-serif;
																font-size: 0.8rem;
																color: ${theme.colors.grey_5};
																padding: 9px 12px;
															`}
														>
															{item.object_label ?? '—'}
														</td>
													</tr>
												);
											})}
										</tbody>
									</table>

									{/* Pagination */}
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
											{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of{' '}
											{filtered.length}
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
								</>
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
									{search
										? `No genes match "${search}" with the selected filters.`
										: 'No genes match the selected filters.'}
								</p>
							)}
						</>
					)}
				</div>
			</section>

			{/* Phenotype modal */}
			{selectedGene && (
				<div
					onClick={() => setSelectedGene(null)}
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
							max-width: 520px;
							max-height: 72vh;
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
							<div>
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
									Associated phenotypes
								</p>
								<h3
									css={css`
										font-family: 'Geomanist', sans-serif;
										font-size: 1.1rem;
										font-weight: 700;
										color: ${theme.colors.primary};
										margin: 0;
									`}
								>
									{selectedGene}
								</h3>
								<p
									css={css`
										font-family: 'Geomanist', sans-serif;
										font-size: 0.8rem;
										color: ${theme.colors.grey_3};
										margin: 4px 0 0;
									`}
								>
									{selectedPhenotypes.length} phenotype{selectedPhenotypes.length !== 1 ? 's' : ''}
								</p>
							</div>
							<button
								onClick={() => setSelectedGene(null)}
								css={css`
									font-family: 'Geomanist', sans-serif;
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
								padding: 16px 24px 24px;
							`}
						>
							{selectedPhenotypes.length > 0 ? (
								<ul css={css`list-style: none; margin: 0; padding: 0;`}>
									{selectedPhenotypes.map((ph) => (
										<li
											key={ph}
											css={css`
												display: flex;
												align-items: baseline;
												gap: 10px;
												padding: 7px 0;
												border-bottom: 1px solid ${theme.colors.grey_1};
												&:last-child { border-bottom: none; }
											`}
										>
											<span
												css={css`
													width: 6px;
													height: 6px;
													border-radius: 50%;
													background: ${theme.colors.primary_pale};
													flex-shrink: 0;
													margin-top: 5px;
												`}
											/>
											<span
												css={css`
													font-family: 'Geomanist', sans-serif;
													font-size: 0.875rem;
													color: ${theme.colors.black};
													line-height: 1.4;
												`}
											>
												{ph}
											</span>
										</li>
									))}
								</ul>
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
									No phenotype data available for this gene.
								</p>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default GenesTable;
