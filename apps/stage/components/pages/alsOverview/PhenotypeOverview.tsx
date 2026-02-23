import { css, useTheme } from '@emotion/react';
import { useState, useEffect, ReactElement } from 'react';
import { MonarchAssociation, MonarchAssociationResponse } from '../../../global/types/monarch';
import { MONARCH_ASSOCIATION_CATEGORIES } from '../../../global/utils/constants';
import defaultTheme from '../../theme';

const FREQ_RANK: Record<string, number> = {
	'Obligate': 6,
	'Very frequent': 5,
	'Frequent': 4,
	'Occasional': 3,
	'Very rare': 2,
	'Excluded': 1,
};

const NOT_REPORTED = 'Not reported';
const PAGE_SIZE = 10;

interface PhenotypeOverviewProps {
	fetchAssociations: (cat: string, limit?: number, offset?: number) => Promise<MonarchAssociationResponse>;
}

const PhenotypeOverview = ({ fetchAssociations }: PhenotypeOverviewProps): ReactElement => {
	const theme: typeof defaultTheme = useTheme();
	const [items, setItems] = useState<MonarchAssociation[]>([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState('');
	const [deselectedFreqs, setDeselectedFreqs] = useState<Set<string>>(new Set());
	const [page, setPage] = useState(1);

	useEffect(() => {
		const BATCH = 500;

		async function loadAll() {
			try {
				const first = await fetchAssociations(MONARCH_ASSOCIATION_CATEGORIES.PHENOTYPE, BATCH, 0);
				let all = first.items;

				let offset = BATCH;
				while (offset < first.total) {
					const next = await fetchAssociations(MONARCH_ASSOCIATION_CATEGORIES.PHENOTYPE, BATCH, offset);
					all = [...all, ...next.items];
					offset += BATCH;
				}

				setItems(all);
				setTotal(first.total);
				setLoading(false);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to load phenotypes');
				setLoading(false);
			}
		}

		loadAll();
	}, [fetchAssociations]);

	// Count occurrences of each phenotype across all ALS subtypes
	const phenotypeCounts: Record<string, number> = {};
	items.forEach((item) => {
		if (item.object_label) {
			phenotypeCounts[item.object_label] = (phenotypeCounts[item.object_label] ?? 0) + 1;
		}
	});

	const top15 = Object.entries(phenotypeCounts)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 15);

	const maxCount = top15.length > 0 ? top15[0][1] : 1;

	// Deduplicated phenotypes: one row per phenotype
	const uniqueMap: Record<string, MonarchAssociation> = {};
	items.forEach((item) => {
		if (!item.object) return;
		const existing = uniqueMap[item.object];
		if (!existing) {
			uniqueMap[item.object] = item;
		} else {
			const existingRank = FREQ_RANK[existing.frequency_qualifier_label ?? ''] ?? 0;
			const newRank = FREQ_RANK[item.frequency_qualifier_label ?? ''] ?? 0;
			if (newRank > existingRank) uniqueMap[item.object] = item;
		}
	});

	// Alphabetical sort
	const uniquePhenotypes = Object.values(uniqueMap).sort((a, b) =>
		(a.object_label ?? '').localeCompare(b.object_label ?? ''),
	);

	// Derive available frequency labels from actual data
	const availableFreqs: string[] = [
		...Object.keys(FREQ_RANK).filter((label) =>
			uniquePhenotypes.some((item) => item.frequency_qualifier_label === label),
		),
		...(uniquePhenotypes.some((item) => !item.frequency_qualifier_label) ? [NOT_REPORTED] : []),
	];

	const freqLabel = (item: MonarchAssociation) => item.frequency_qualifier_label ?? NOT_REPORTED;

	// Reset page on filter/search change
	const handleSearch = (value: string) => {
		setSearch(value);
		setPage(1);
	};

	const toggleFreq = (label: string) => {
		setDeselectedFreqs((prev) => {
			const next = new Set(prev);
			next.has(label) ? next.delete(label) : next.add(label);
			return next;
		});
		setPage(1);
	};

	const filtered = uniquePhenotypes.filter(
		(item) =>
			item.object_label?.toLowerCase().includes(search.toLowerCase()) &&
			!deselectedFreqs.has(freqLabel(item)),
	);

	const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
	const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

	const sectionTitleCss = css`
		font-family: 'Geomanist', sans-serif;
		font-size: 1.15rem;
		font-weight: 700;
		color: ${theme.colors.primary};
		margin: 0;
	`;

	const sectionDescCss = css`
		font-family: 'Geomanist', sans-serif;
		font-size: 0.85rem;
		color: ${theme.colors.grey_5};
		margin: 6px 0 0;
		line-height: 1.5;
	`;

	return (
		<section
			id="phenotypes"
			css={css`
				margin-bottom: 48px;
				scroll-margin-top: 80px;
			`}
		>
			{/* Section header */}
			<div
				css={css`
					display: flex;
					align-items: baseline;
					gap: 10px;
					margin-bottom: 6px;
				`}
			>
				<h2 css={sectionTitleCss}>Phenotypes</h2>
				{total > 0 && (
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
						{total.toLocaleString()}
					</span>
				)}
			</div>
			<p css={sectionDescCss}>Clinical signs and symptoms associated with ALS, grouped by reported frequency.</p>

			<div
				css={css`
					border-top: 1px solid ${theme.colors.grey_2};
					margin-top: 16px;
					padding-top: 24px;
				`}
			>
				{loading && (
					<p
						css={css`
							font-family: 'Geomanist', sans-serif;
							font-size: 0.875rem;
							color: ${theme.colors.grey_3};
						`}
					>
						Loading phenotypes…
					</p>
				)}
				{error && (
					<p
						css={css`
							font-family: 'Geomanist', sans-serif;
							font-size: 0.875rem;
							color: ${theme.colors.error};
						`}
					>
						Error: {error}
					</p>
				)}

				{!loading && !error && (
					<>

						<div css={css`margin-bottom: 32px;`}>
							<p
								css={css`
									font-family: 'Geomanist', sans-serif;
									font-size: 0.75rem;
									font-weight: 700;
									text-transform: uppercase;
									letter-spacing: 0.6px;
									color: ${theme.colors.grey_3};
									margin: 0 0 14px;
								`}
							>
								Top 15 most reported phenotypes across ALS subtypes
							</p>
							<div css={css`display: flex; flex-direction: column; gap: 10px;`}>
								{top15.map(([label, count]) => {
									const pct = Math.round((count / maxCount) * 100);
									return (
										<div key={label} css={css`display: flex; align-items: center; gap: 12px;`}>
											<span
												css={css`
													font-family: 'Geomanist', sans-serif;
													font-size: 0.8rem;
													color: ${theme.colors.grey_5};
													width: 240px;
													flex-shrink: 0;
													white-space: nowrap;
													overflow: hidden;
													text-overflow: ellipsis;
												`}
												title={label}
											>
												{label}
											</span>
											<div
												css={css`
													flex: 1;
													background: ${theme.colors.grey_1};
													border-radius: 4px;
													height: 22px;
													overflow: hidden;
												`}
											>
												<div
													css={css`
														width: ${pct}%;
														height: 100%;
														background: ${theme.colors.primary};
														border-radius: 4px;
														transition: width 0.4s ease;
													`}
												/>
											</div>
											<span
												css={css`
													font-family: 'Geomanist', sans-serif;
													font-size: 0.8rem;
													font-weight: 700;
													color: ${theme.colors.grey_5};
													width: 36px;
													text-align: right;
													flex-shrink: 0;
												`}
											>
												{count}
											</span>
										</div>
									);
								})}
							</div>
						</div>

						<div
							css={css`
								display: flex;
								flex-wrap: wrap;
								align-items: center;
								gap: 8px 16px;
								margin-bottom: 12px;
							`}
						>
							{availableFreqs.map((label) => (
								<label
									key={label}
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
										checked={!deselectedFreqs.has(label)}
										onChange={() => toggleFreq(label)}
										css={css`
											accent-color: ${theme.colors.primary};
											cursor: pointer;
										`}
									/>
									{label}
								</label>
							))}
							{deselectedFreqs.size > 0 && (
								<button
									onClick={() => { setDeselectedFreqs(new Set()); setPage(1); }}
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
							placeholder="Search phenotypes…"
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

								&:focus {
									border-color: ${theme.colors.primary_pale};
								}
							`}
						/>

						{/* Table */}
						{filtered.length > 0 ? (
							<>
								<table css={css`width: 100%; border-collapse: collapse; table-layout: fixed;`}>
									<thead>
										<tr>
											{['Phenotype', 'Frequency'].map((h) => (
												<th
													key={h}
													css={css`
														text-align: left;
														font-family: 'Geomanist', sans-serif;
														font-size: 0.72rem;
														font-weight: 700;
														text-transform: uppercase;
														letter-spacing: 0.5px;
														color: ${theme.colors.grey_3};
														padding: 8px 12px;
														border-bottom: 2px solid ${theme.colors.grey_2};
													`}
												>
													{h}
												</th>
											))}
										</tr>
									</thead>
									<tbody>
										{paginated.map((item) => (
											<tr
												key={item.object}
												css={css`
													border-bottom: 1px solid ${theme.colors.grey_1};
													&:hover {
														background: ${theme.colors.grey_1};
													}
												`}
											>
												<td
													css={css`
														font-family: 'Geomanist', sans-serif;
														font-size: 0.875rem;
														color: ${theme.colors.black};
														padding: 9px 12px;
													`}
												>
													{item.object_label ?? 'Unknown phenotype'}
												</td>
												<td
													css={css`
														font-family: 'Geomanist', sans-serif;
														font-size: 0.8rem;
														color: ${item.frequency_qualifier_label
															? theme.colors.grey_5
															: theme.colors.grey_3};
														padding: 9px 12px;
														font-style: ${item.frequency_qualifier_label ? 'normal' : 'italic'};
													`}
												>
													{item.frequency_qualifier_label ?? 'No frequency data reported'}
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
												css={css`
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
												`}
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
									? `No phenotypes match "${search}" with the selected frequency filters.`
									: 'No phenotypes match the selected frequency filters.'}
							</p>
						)}
					</>
				)}
			</div>
		</section>
	);
};

export default PhenotypeOverview;
