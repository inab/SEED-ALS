import { css, useTheme } from '@emotion/react';
import { ReactElement } from 'react';
import { INTERNAL_PATHS } from '../../../global/utils/constants';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';

const features = [
	{
		title: 'ALS Disease Overview',
		description:
			'Explore a comprehensive scientific overview of ALS: associated phenotypes, genes, biological pathways, and related conditions powered by the Monarch Initiative.',
		path: INTERNAL_PATHS.ALS_OVERVIEW,
	},
	{
		title: 'EGA Metadata Explorer',
		description:
			'Discover public metadata from ALS-related studies and datasets available in the European Genome-phenome Archive. Search, filter, and access study information.',
		path: INTERNAL_PATHS.EGA_EXPLORER,
	},
	{
		title: 'Disease Model',
		description:
			'Visualize computational analysis results: interactive charts, dimensionality reduction, feature importance plots, and patient stratification dashboards.',
		path: INTERNAL_PATHS.DISEASE_MODEL,
	},
];

const HomeContent = (): ReactElement => {
	const theme = useTheme();

	return (
		<main
			css={css`
				min-height: 100vh;
				font-family: 'Geomanist', sans-serif;
				background: linear-gradient(
					135deg,
					${theme.colors.primary_darker} 10%,
					${theme.colors.primary} 50%,
					${theme.colors.primary_lightest} 100%
				);
				display: flex;
				flex-direction: column;
			`}
		>
			<HomeHeader />

			<section
				css={css`
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					padding: 32px 24px 48px;
				`}
			>
				<img
					src="/seed-als/logos/SEED-ALS PNG/logo SEED-ALS_Blanco.png"
					alt="SEED-ALS"
					css={css`
						width: min(400px, 80vw);
						height: auto;
						margin-bottom: 36px;
					`}
				/>

				<h1
					css={css`
						font-size: clamp(1.6rem, 4vw, 2.4rem);
						font-weight: 300;
						color: ${theme.colors.white};
						margin: 0 0 18px 0;
						text-align: center;
						max-width: 1200px;
						line-height: 1.25;
					`}
				>
					A reference portal for Amyotrophic Lateral Sclerosis research
				</h1>

				<p
					css={css`
						font-size: clamp(0.95rem, 2vw, 1.15rem);
						font-weight: 300;
						color: ${theme.colors.white};
						opacity: 0.82;
						text-align: center;
						max-width: 1000px;
						line-height: 1.6;
						margin: 0 0 52px 0;
					`}
				>
					Centralizing biomedical information, public dataset metadata, and computational analysis
					results in a unified interface.
				</p>

				<div
					css={css`
						display: grid;
						grid-template-columns: repeat(3, 1fr);
						gap: 24px;
						max-width: 1400px;
						width: 100%;
						@media (min-width: 577px) and (max-width: 900px) {
							grid-template-columns: 1fr 1fr;
							& > a:last-child:nth-child(odd) {
								grid-column: 1 / -1;
								width: calc(50% - 12px);
								justify-self: center;
							}
						}
						@media (max-width: 576px) {
							grid-template-columns: 1fr;
						}
					`}
				>
					{features.map((feature) => (
						<a
							key={feature.path}
							href={feature.path}
							css={css`
								background: rgba(255, 255, 255, 0.1);
								border: 1px solid rgba(255, 255, 255, 0.22);
								border-radius: 14px;
								padding: 36px 32px;
								text-decoration: none;
								color: ${theme.colors.white};
								display: flex;
								flex-direction: column;
								transition: background 0.2s ease, transform 0.2s ease;

								&:hover {
									background: rgba(255, 255, 255, 0.18);
									transform: translateY(-3px);
								}
							`}
						>
							<h3
								css={css`
									font-size: 1.2rem;
									font-weight: 700;
									margin: 0 0 12px 0;
									color: ${theme.colors.white};
								`}
							>
								{feature.title}
							</h3>
							<p
								css={css`
									font-size: 1rem;
									line-height: 1.65;
									opacity: 0.82;
									margin: 0;
								`}
							>
								{feature.description}
							</p>
						</a>
					))}
				</div>
			</section>

			<HomeFooter />
		</main>
	);
};

export default HomeContent;
