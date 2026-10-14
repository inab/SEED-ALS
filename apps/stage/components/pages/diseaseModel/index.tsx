import { css, useTheme } from '@emotion/react';
import { ReactElement } from 'react';
import PageLayout from '../../PageLayout';
import defaultTheme from '../../theme';
import PPINetwork from './PPINetwork';

const DiseaseModel = (): ReactElement => {
	const theme: typeof defaultTheme = useTheme();

	return (
		<PageLayout subtitle="Disease Model">
			{/* Page header */}
			<section
				css={css`
					background: linear-gradient(135deg, ${theme.colors.primary_darker} 10%, ${theme.colors.primary} 50%, ${theme.colors.primary_lightest} 100%);
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
					Disease Model
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
					Protein–protein interaction network for ALS-associated genes. Nodes represent proteins;
					edges connect proteins with experimentally validated physical interactions.
				</p>
			</section>

			{/* Work-in-progress disclaimer + data source attribution */}
			<div
				css={css`
					display: flex;
					flex-wrap: wrap;
					align-items: center;
					justify-content: space-between;
					gap: 16px 32px;
					padding: 16px 32px;
					background: ${theme.colors.white};
					border-bottom: 1px solid ${theme.colors.grey_2};
					@media (max-width: 768px) {
						padding: 16px;
					}
				`}
			>
				<div
					role="note"
					css={css`
						display: flex;
						align-items: flex-start;
						gap: 12px;
						flex: 1;
						min-width: 260px;
						max-width: 820px;
						padding: 12px 16px;
						background: ${theme.colors.primary_palest};
						border-left: 4px solid ${theme.colors.primary};
						border-radius: 6px;
					`}
				>
					<span
						css={css`
							font-family: 'Geomanist', sans-serif;
							font-size: 0.7rem;
							font-weight: 700;
							text-transform: uppercase;
							letter-spacing: 0.5px;
							color: ${theme.colors.white};
							background: ${theme.colors.primary};
							padding: 3px 10px;
							border-radius: 20px;
							white-space: nowrap;
							flex-shrink: 0;
						`}
					>
						Work in progress
					</span>
					<p
						css={css`
							font-family: 'Geomanist', sans-serif;
							font-size: 0.85rem;
							font-weight: 300;
							color: ${theme.colors.grey_6};
							margin: 0;
							line-height: 1.5;
						`}
					>
						This section is under active development. The network and its underlying data may change
						as the analysis workflows are finalized.
					</p>
				</div>

				<div css={css`display: flex; align-items: center; gap: 12px;`}>
					<span
						css={css`
							font-family: 'Geomanist', sans-serif;
							font-size: 0.72rem;
							color: ${theme.colors.grey_4};
							line-height: 1.4;
						`}
					>
						Data sourced from
					</span>
					<a href="https://thebiogrid.org" target="_blank" rel="noopener noreferrer">
						<img
							src="/seed-als/logos/biogrid.png"
							alt="BioGRID"
							css={css`
								height: 36px;
								display: block;
								opacity: 0.85;
								transition: opacity 0.15s ease;
								&:hover { opacity: 1; }
							`}
						/>
					</a>
				</div>
			</div>

			<PPINetwork />
		</PageLayout>
	);
};

export default DiseaseModel;
