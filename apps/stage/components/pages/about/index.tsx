import { css, useTheme } from '@emotion/react';
import { ReactElement } from 'react';
import PageLayout from '../../PageLayout';
import defaultTheme from '../../theme';

const About = (): ReactElement => {
	const theme: typeof defaultTheme = useTheme();

	return (
		<PageLayout subtitle="About">
			{/* Project section — fills all available space between navbar and footer */}
			<section
				css={css`
					flex: 1;
					background-color: ${theme.colors.primary_palest};
					border-bottom: 1px solid ${theme.colors.primary_pale};
					padding: 80px 64px;
					display: flex;
					align-items: center;
					@media (max-width: 768px) {
						padding: 40px 20px;
					}
				`}
			>
				<div
					css={css`
						max-width: 1200px;
						width: 100%;
						margin: 0 auto;
						display: grid;
						grid-template-columns: 1fr 520px;
						gap: 72px;
						align-items: stretch;
						border-left: 5px solid ${theme.colors.primary};
						padding-left: 40px;

						@media (max-width: 860px) {
							grid-template-columns: 1fr;
							gap: 40px;
						}
					`}
				>
					{/* Left — text content */}
					<div
						css={css`
							display: flex;
							flex-direction: column;
							gap: 28px;
							justify-content: center;
						`}
					>
						<h2
							css={css`
								font-family: 'Geomanist', sans-serif;
								font-size: 1.9rem;
								font-weight: 700;
								color: ${theme.colors.primary};
								margin: 0;
								line-height: 1.2;
							`}
						>
							The SEED-ALS Project
						</h2>

						<p
							css={css`
								font-family: 'Geomanist', sans-serif;
								font-size: 1rem;
								color: ${theme.colors.grey_5};
								line-height: 1.8;
								margin: 0;
							`}
						>
							SEED-ALS is a research initiative focused on Amyotrophic Lateral Sclerosis (ALS), a
							progressive and fatal neurodegenerative disease that selectively affects upper and lower
							motor neurons, leading to muscle weakness, paralysis, and respiratory failure. With a
							global incidence of approximately 2–3 per 100,000 people and a median survival of 2–5
							years after symptom onset, ALS represents one of the most devastating rare diseases.
						</p>

						<p
							css={css`
								font-family: 'Geomanist', sans-serif;
								font-size: 1rem;
								color: ${theme.colors.grey_5};
								line-height: 1.8;
								margin: 0;
							`}
						>
							The project brings together computational biology, clinical data science, and
							bioinformatics expertise to centralise and integrate publicly available biomedical
							knowledge on ALS — including disease mechanisms, associated genes and phenotypes, and
							genomic datasets — with the goal of accelerating research and supporting the broader
							scientific and clinical community.
						</p>

						<div>
							<a
								href="https://seed-als.es/"
								target="_blank"
								rel="noopener noreferrer"
								css={css`
									font-family: 'Geomanist', sans-serif;
									font-size: 0.9rem;
									font-weight: 700;
									color: ${theme.colors.white};
									background-color: ${theme.colors.primary};
									text-decoration: none;
									padding: 12px 28px;
									border-radius: 6px;
									display: inline-flex;
									align-items: center;
									gap: 6px;
									transition: background-color 0.15s ease;

									&:hover {
										background-color: ${theme.colors.primary_dark};
									}

									&::after {
										content: '↗';
										font-size: 0.8rem;
										opacity: 0.8;
									}
								`}
							>
								seed-als.es
							</a>
						</div>
					</div>

					{/* Right — map image, same height as left column */}
					<div
						css={css`
							display: flex;
							align-items: stretch;
						`}
					>
						<img
							src="/seed-als/images/seed-als-map.jpg"
							alt="SEED-ALS network map"
							css={css`
								width: 100%;
								height: 100%;
								min-height: 320px;
								object-fit: contain;
								object-position: center;
								display: block;
								-webkit-mask-image: radial-gradient(ellipse 88% 80% at 62% 50%, black 45%, transparent 100%);
								mask-image: radial-gradient(ellipse 88% 80% at 62% 50%, black 45%, transparent 100%);
							`}
						/>
					</div>
				</div>
			</section>
			{/* Portal section */}
			<section
				css={css`
					background-color: ${theme.colors.white};
					border-top: 1px solid ${theme.colors.grey_2};
					padding: 64px 64px;
					@media (max-width: 768px) {
						padding: 40px 20px;
					}
				`}
			>
				<div
					css={css`
						max-width: 1200px;
						margin: 0 auto;
						display: grid;
						grid-template-columns: 1fr 1fr;
						gap: 80px;
						align-items: start;

						@media (max-width: 860px) {
							grid-template-columns: 1fr;
							gap: 40px;
						}
					`}
				>
					{/* Left */}
					<div
						css={css`
							display: flex;
							flex-direction: column;
							gap: 20px;
						`}
					>
						<h2
							css={css`
								font-family: 'Geomanist', sans-serif;
								font-size: 1.4rem;
								font-weight: 700;
								color: ${theme.colors.primary};
								margin: 0;
							`}
						>
							This Portal
						</h2>
						<p
							css={css`
								font-family: 'Geomanist', sans-serif;
								font-size: 0.95rem;
								color: ${theme.colors.grey_5};
								line-height: 1.8;
								margin: 0;
							`}
						>
							Developed at the{' '}
							<a
								href="https://www.bsc.es/"
								target="_blank"
								rel="noopener noreferrer"
								css={css`
									color: ${theme.colors.primary};
									text-decoration: none;
									&:hover { text-decoration: underline; }
								`}
							>
								Barcelona Supercomputing Center (BSC-CNS)
							</a>
							, this portal provides a unified interface for publicly available biomedical data on
							ALS — aggregating disease knowledge, genomic study metadata, and in the future,
							outputs from computational models developed within the SEED-ALS project.
						</p>
					</div>

					{/* Right — portal sections */}
					<div
						css={css`
							display: flex;
							flex-direction: column;
							gap: 24px;
						`}
					>
						{[
							{
								title: 'ALS Disease Overview',
								description:
									'Genes, phenotypes, experimental models, and disease classification hierarchy, powered by the Monarch Initiative API.',
							},
							{
								title: 'EGA Metadata Explorer',
								description:
									'Discovery of public ALS study and dataset metadata from the European Genome-phenome Archive, with direct links to request access.',
							},
							{
								title: 'Disease Model',
								description:
									'Future visualisation of machine learning analysis results generated by the SEED-ALS computational team.',
							},
						].map((item) => (
							<div
								key={item.title}
								css={css`
									display: flex;
									gap: 16px;
									align-items: flex-start;
								`}
							>
								<span
									css={css`
										color: ${theme.colors.primary};
										font-weight: 700;
										font-size: 1rem;
										flex-shrink: 0;
										margin-top: 2px;
									`}
								>
									→
								</span>
								<div>
									<p
										css={css`
											font-family: 'Geomanist', sans-serif;
											font-size: 0.9rem;
											font-weight: 700;
											color: ${theme.colors.primary};
											margin: 0 0 4px;
										`}
									>
										{item.title}
									</p>
									<p
										css={css`
											font-family: 'Geomanist', sans-serif;
											font-size: 0.86rem;
											color: ${theme.colors.grey_5};
											line-height: 1.65;
											margin: 0;
										`}
									>
										{item.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</PageLayout>
	);
};

export default About;
