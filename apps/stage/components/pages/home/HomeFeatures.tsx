import { css, useTheme } from '@emotion/react';
import { ReactElement } from 'react';
import { INTERNAL_PATHS } from '../../../global/utils/constants';

const features = [
	{
		title: 'ALS Disease Overview',
		description:
			'Explore a comprehensive scientific overview of ALS: associated phenotypes, genes, biological pathways, and related conditions powered by the Monarch Initiative.',
		path: INTERNAL_PATHS.ALS_OVERVIEW,
		cta: 'View Overview',
	},
	{
		title: 'EGA Metadata Explorer',
		description:
			'Discover public metadata from ALS-related studies and datasets available in the European Genome-phenome Archive. Search, filter, and access study information.',
		path: INTERNAL_PATHS.EGA_EXPLORER,
		cta: 'Explore Metadata',
	},
	{
		title: 'Disease Model',
		description:
			'Visualize computational analysis results: interactive charts, dimensionality reduction, feature importance plots, and patient stratification dashboards.',
		path: INTERNAL_PATHS.DISEASE_MODEL,
		cta: 'View Results',
	},
];

const HomeFeatures = (): ReactElement => {
	const theme = useTheme();

	return (
		<section
			css={css`
				max-width: 1200px;
				margin: 0 auto;
				padding: 64px 24px;

				@media (max-width: 768px) {
					padding: 40px 16px;
				}
			`}
		>
			<h2
				css={css`
					text-align: center;
					font-size: 1.6rem;
					font-weight: 700;
					color: ${theme.colors.primary};
					margin: 0 0 12px 0;
				`}
			>
				Core Functionalities
			</h2>
			<p
				css={css`
					text-align: center;
					font-size: 1rem;
					color: ${theme.colors.grey_5};
					margin: 0 0 48px 0;
					max-width: 600px;
					margin-left: auto;
					margin-right: auto;

					@media (max-width: 768px) {
						margin-bottom: 32px;
					}
				`}
			>
				Three integrated modules to explore ALS from different perspectives.
			</p>
			<div
				css={css`
					display: grid;
					grid-template-columns: repeat(3, 1fr);
					gap: 28px;

					@media (max-width: 1024px) {
						grid-template-columns: repeat(2, 1fr);
					}
					@media (max-width: 640px) {
						grid-template-columns: 1fr;
					}
				`}
			>
				{features.map((feature) => (
					<article
						key={feature.path}
						css={css`
							background-color: ${theme.colors.white};
							border-radius: 12px;
							border: 1px solid ${theme.colors.grey_2};
							padding: 32px 28px;
							display: flex;
							flex-direction: column;
							transition: transform 0.2s ease, box-shadow 0.2s ease;

							&:hover {
								transform: translateY(-4px);
								box-shadow: 0 12px 32px rgba(0, 59, 117, 0.12);
							}
						`}
					>
						<h3
							css={css`
								font-size: 1.2rem;
								font-weight: 700;
								color: ${theme.colors.primary};
								margin: 0 0 12px 0;
							`}
						>
							{feature.title}
						</h3>
						<p
							css={css`
								font-size: 0.9rem;
								color: ${theme.colors.grey_5};
								line-height: 1.6;
								margin: 0 0 24px 0;
								flex: 1;
							`}
						>
							{feature.description}
						</p>
						<a
							href={feature.path}
							css={css`
								display: inline-block;
								align-self: flex-start;
								color: ${theme.colors.primary};
								font-size: 0.9rem;
								font-weight: 700;
								text-decoration: none;
								padding: 10px 20px;
								border: 2px solid ${theme.colors.primary};
								border-radius: 6px;
								transition: background-color 0.2s ease, color 0.2s ease;

								&:hover {
									background-color: ${theme.colors.primary};
									color: ${theme.colors.white};
								}
							`}
						>
							{feature.cta}
						</a>
					</article>
				))}
			</div>
		</section>
	);
};

export default HomeFeatures;
