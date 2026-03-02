import { css, useTheme } from '@emotion/react';
import { useState, useEffect, ReactElement } from 'react';
import { MonarchAssociation, MonarchAssociationResponse } from '../../../global/types/monarch';
import { ALS_ASSOCIATION_CATEGORIES } from '../../../global/utils/constants';
import defaultTheme from '../../theme';

const PAGE_SIZE = 10;

const RELATIONSHIP_LABELS: Record<string, string> = {
	[ALS_ASSOCIATION_CATEGORIES.CAUSAL_GENE_TO_DISEASE]: 'Causal',
	[ALS_ASSOCIATION_CATEGORIES.CORRELATED_GENE_TO_DISEASE]: 'Correlated',
};

const cleanPredicate = (predicate: string) =>
	predicate.replace('biolink:', '').replace(/_/g, ' ');

interface TaggedAssociation extends MonarchAssociation {
	_relationshipType: string;
}

interface GenesTableProps {
	fetchAssociations: (cat: string, limit?: number, offset?: number) => Promise<MonarchAssociationResponse>;
}

const GenesTable = ({ fetchAssociations }: GenesTableProps): ReactElement => {
	const theme: typeof defaultTheme = useTheme();
	const [items, setItems] = useState<TaggedAssociation[]>([]);
	const [totals, setTotals] = useState<Record<string, number>>({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState('');
	const [deselectedTypes, setDeselectedTypes] = useState<Set<string>>(new Set());
	const [page, setPage] = useState(1);

	useEffect(() => {
		async function loadAll() {
			try {
				const [causal, correlated] = await Promise.all([
					fetchAssociations(ALS_ASSOCIATION_CATEGORIES.CAUSAL_GENE_TO_DISEASE, 100, 0),
					fetchAssociations(ALS_ASSOCIATION_CATEGORIES.CORRELATED_GENE_TO_DISEASE, 100, 0),
				]);

				const tag = (items: MonarchAssociation[], type: string): TaggedAssociation[] =>
					items.map((item) => ({ ...item, _relationshipType: type }));

				const merged = [
					...tag(causal.items, ALS_ASSOCIATION_CATEGORIES.CAUSAL_GENE_TO_DISEASE),
					...tag(correlated.items, ALS_ASSOCIATION_CATEGORIES.CORRELATED_GENE_TO_DISEASE),
				].sort((a, b) => (a.subject_label ?? '').localeCompare(b.subject_label ?? ''));

				setItems(merged);
				setTotals({
					[ALS_ASSOCIATION_CATEGORIES.CAUSAL_GENE_TO_DISEASE]: causal.total,
					[ALS_ASSOCIATION_CATEGORIES.CORRELATED_GENE_TO_DISEASE]: correlated.total,
				});
				setLoading(false);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to load genes');
				setLoading(false);
			}
		}

		loadAll();
	}, [fetchAssociations]);

	const totalAll = Object.values(totals).reduce((a, b) => a + b, 0);

	const filtered = items.filter(
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

	return (
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
				Genes causally linked to or statistically correlated with ALS.
			</p>

			<div
				css={css`
					border-top: 1px solid ${theme.colors.grey_2};
					margin-top: 16px;
					padding-top: 24px;
				`}
			>
				{loading && (
					<p css={css`font-family: 'Geomanist', sans-serif; font-size: 0.875rem; color: ${theme.colors.grey_3};`}>
						Loading genes…
					</p>
				)}
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
											{[
												{ label: 'Gene', width: '20%' },
												{ label: 'Relationship', width: '30%' },
												{ label: 'Disease', width: '50%' },
											].map((col) => (
												<th
													key={col.label}
													css={css`
														width: ${col.width};
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
													{col.label}
												</th>
											))}
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
													css={css`
														font-family: 'Geomanist', sans-serif;
														font-size: 0.875rem;
														font-weight: 700;
														color: ${theme.colors.primary};
														padding: 9px 12px;
													`}
												>
													{item.subject_label ?? '—'}
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
									? `No genes match "${search}" with the selected filters.`
									: 'No genes match the selected filters.'}
							</p>
						)}
					</>
				)}
			</div>
		</section>
	);
};

export default GenesTable;
