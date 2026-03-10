import { css, useTheme } from '@emotion/react';
import { useState, useEffect, ReactElement } from 'react';
import { MonarchAssociation, MonarchAssociationResponse } from '../../../global/types/monarch';
import { ALS_ASSOCIATION_CATEGORIES } from '../../../global/utils/constants';
import defaultTheme from '../../theme';

const PAGE_SIZE = 10;

type SortKey = 'model' | 'organism' | 'subtype';

interface DiseaseModelsProps {
	fetchAssociations: (cat: string, limit?: number, offset?: number) => Promise<MonarchAssociationResponse>;
	onLoaded?: () => void;
}

const DiseaseModels = ({ fetchAssociations, onLoaded }: DiseaseModelsProps): ReactElement => {
	const theme: typeof defaultTheme = useTheme();
	const [items, setItems] = useState<MonarchAssociation[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState('');
	const [deselectedOrgs, setDeselectedOrgs] = useState<Set<string>>(new Set());
	const [page, setPage] = useState(1);
	const [sortKey, setSortKey] = useState<SortKey>('model');
	const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

	useEffect(() => {
		fetchAssociations(ALS_ASSOCIATION_CATEGORIES.GENOTYPE_TO_DISEASE, 500, 0)
			.then((res) => {
				setItems(res.items);
				setLoading(false);
				onLoaded?.();
			})
			.catch((err) => {
				setError(err instanceof Error ? err.message : 'Failed to load disease models');
				setLoading(false);
				onLoaded?.();
			});
	}, [fetchAssociations]);

	// Count models per organism
	const orgCounts: Record<string, number> = {};
	items.forEach((item) => {
		const org = item.subject_taxon_label ?? 'Unknown';
		orgCounts[org] = (orgCounts[org] ?? 0) + 1;
	});
	const orgsSorted = Object.entries(orgCounts).sort((a, b) => b[1] - a[1]);

	const toggleOrg = (org: string) => {
		setDeselectedOrgs((prev) => {
			const next = new Set(prev);
			next.has(org) ? next.delete(org) : next.add(org);
			return next;
		});
		setPage(1);
	};

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
		if (sortKey === 'model') { va = a.subject_label ?? ''; vb = b.subject_label ?? ''; }
		else if (sortKey === 'organism') { va = a.subject_taxon_label ?? ''; vb = b.subject_taxon_label ?? ''; }
		else { va = a.object_label ?? ''; vb = b.object_label ?? ''; }
		const cmp = va.localeCompare(vb);
		return sortDir === 'asc' ? cmp : -cmp;
	});

	const filtered = sorted.filter(
		(item) =>
			(item.subject_label ?? '').toLowerCase().includes(search.toLowerCase()) &&
			!deselectedOrgs.has(item.subject_taxon_label ?? 'Unknown'),
	);

	const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
	const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

	const handleSearch = (value: string) => {
		setSearch(value);
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

	const columns: { label: string; width: string; sk: SortKey }[] = [
		{ label: 'Model', width: '70%', sk: 'model' },
		{ label: 'Organism', width: '10%', sk: 'organism' },
		{ label: 'ALS subtype', width: '20%', sk: 'subtype' },
	];

	return (
		<section
			id="disease-models"
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
					Disease Models
				</h2>
				{items.length > 0 && (
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
						{items.length}
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
				Experimental organism models (genotypes) used to study ALS.
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
						{/* Organism summary chips */}
						<div
							css={css`
								display: flex;
								flex-wrap: wrap;
								gap: 10px;
								margin-bottom: 24px;
							`}
						>
							{orgsSorted.map(([org, count]) => (
								<div
									key={org}
									css={css`
										display: flex;
										align-items: center;
										gap: 10px;
										background: ${theme.colors.grey_1};
										border-radius: 8px;
										padding: 10px 16px;
									`}
								>
									<span
										css={css`
											font-family: 'Geomanist', sans-serif;
											font-size: 0.85rem;
											font-style: italic;
											color: ${theme.colors.grey_6};
										`}
									>
										{org}
									</span>
									<span
										css={css`
											font-family: 'Geomanist', sans-serif;
											font-size: 0.75rem;
											font-weight: 700;
											font-style: normal;
											background: ${theme.colors.primary_pale};
											color: ${theme.colors.primary};
											padding: 1px 8px;
											border-radius: 10px;
										`}
									>
										{count}
									</span>
								</div>
							))}
						</div>

						{/* Organism filter */}
						<div
							css={css`
								display: flex;
								flex-wrap: wrap;
								align-items: center;
								gap: 8px 16px;
								margin-bottom: 12px;
							`}
						>
							{orgsSorted.map(([org]) => (
								<label
									key={org}
									css={css`
										display: flex;
										align-items: center;
										gap: 6px;
										font-family: 'Geomanist', sans-serif;
										font-size: 0.8rem;
										font-style: italic;
										color: ${theme.colors.grey_5};
										cursor: pointer;
										user-select: none;
									`}
								>
									<input
										type="checkbox"
										checked={!deselectedOrgs.has(org)}
										onChange={() => toggleOrg(org)}
										css={css`accent-color: ${theme.colors.primary}; cursor: pointer;`}
									/>
									{org}
									<span css={css`color: ${theme.colors.grey_3}; font-size: 0.75rem; font-style: normal;`}>
										({orgCounts[org]})
									</span>
								</label>
							))}
							{deselectedOrgs.size > 0 && (
								<button
									onClick={() => { setDeselectedOrgs(new Set()); setPage(1); }}
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
							placeholder="Search models…"
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
										{paginated.map((item) => (
											<tr
												key={item.id}
												css={css`
													border-bottom: 1px solid ${theme.colors.grey_1};
													&:hover { background: ${theme.colors.grey_1}; }
												`}
											>
												<td
													title={item.subject_label ?? undefined}
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
													{item.subject_label ?? '—'}
												</td>
												<td
													css={css`
														font-family: 'Geomanist', sans-serif;
														font-size: 0.8rem;
														font-style: italic;
														color: ${theme.colors.grey_5};
														padding: 9px 12px;
													`}
												>
													{item.subject_taxon_label ?? '—'}
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
													{item.object_label ?? '—'}
												</td>
											</tr>
										))}
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
									? `No models match "${search}" with the selected filters.`
									: 'No models match the selected filters.'}
							</p>
						)}
					</>
				)}
			</div>
		</section>
	);
};

export default DiseaseModels;
