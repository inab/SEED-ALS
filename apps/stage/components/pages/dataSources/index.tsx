import { css, useTheme } from '@emotion/react';
import { ReactElement } from 'react';
import PageLayout from '../../PageLayout';
import defaultTheme from '../../theme';

const DATA_SOURCES = [
	{
		key: 'monarch',
		name: 'Monarch Initiative',
		logo: '/seed-als/logos/monarch-iniciative.png',
		tagline: 'Open biomedical knowledge graph for disease–gene–phenotype relationships',
		accessModel: 'Open Access',
		accessColor: 'success',
		description:
			'The Monarch Initiative is an international consortium that leads key global standards and semantic data integration technologies. Monarch resources and integrated data are foundational to many downstream applications. We collaborate with stakeholders to continuously improve the platform, which is composed of multiple open-source, open-access components. Our mission is to enhance data utility, accessibility, and transparency to improve rare disease diagnosis and treatment.',
		role: 'SEED-ALS uses the Monarch Initiative API to power the ALS Disease Overview page. It provides the scientific backbone of the portal: disease descriptions, associated phenotypes, causal and correlated genes, gene–phenotype links, experimental models, and the disease classification hierarchy.',
		details: [
			'Disease entity information and synonyms',
			'Phenotype associations (signs and symptoms)',
			'Causal and correlated gene associations',
			'Gene–phenotype direct links',
			'Experimental organism disease models',
			'Disease classification hierarchy (parent conditions and subtypes)',
		],
		links: [
			{ label: 'Monarch Initiative website', url: 'https://monarchinitiative.org/' },
			{ label: 'API documentation (v3)', url: 'https://api-v3.monarchinitiative.org/v3/docs' },
			{ label: 'ALS entry (MONDO:0004976)', url: 'https://monarchinitiative.org/disease/MONDO:0004976' },
		],
	},
	{
		key: 'ega',
		name: 'European Genome-phenome Archive (EGA)',
		logo: '/seed-als/logos/ega.png',
		tagline: 'Controlled-access repository for human genomic and phenotypic data',
		accessModel: 'Controlled Access',
		accessColor: 'warning',
		description:
			'The European Genome-phenome Archive (EGA) is a service for permanent archiving and sharing of personally identifiable genetic, phenotypic, and clinical data generated for the purposes of biomedical research projects or in the context of research-focused healthcare systems.',
		role: 'SEED-ALS uses the EGA Metadata API to surface public study and dataset metadata related to ALS research. The portal allows users to discover available studies, browse metadata, and navigate to the EGA portal to formally request controlled access to the data.',
		details: [
			'Study-level metadata (title, description, publications)',
			'Dataset metadata (type, technology, sample size)',
			'Data access information and policies',
			'Direct links to official EGA portal for access requests',
		],
		links: [
			{ label: 'EGA website', url: 'https://ega-archive.org/' },
			{ label: 'Metadata API documentation', url: 'https://metadata.ega-archive.org/spec/#/' },
			{ label: 'Data access request guide', url: 'https://ega-archive.org/access/request-data/how-to-request-data/' },
		],
	},
];

const DataSources = (): ReactElement => {
	const theme: typeof defaultTheme = useTheme();

	return (
		<PageLayout subtitle="Data Sources">
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
					Data Sources
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
					SEED-ALS integrates data from two established biomedical resources to provide a comprehensive
					and scientifically accurate view of Amyotrophic Lateral Sclerosis.
				</p>
			</section>

			{/* Data source cards — side by side on large screens */}
			<div
				css={css`
					max-width: 1600px;
					margin: 0 auto;
					padding: 56px 40px 72px;
					display: grid;
					grid-template-columns: 1fr 1fr;
					gap: 32px;
					align-items: stretch;

					@media (max-width: 900px) {
						grid-template-columns: 1fr;
					}
					@media (max-width: 768px) {
						padding: 32px 16px 48px;
					}
				`}
			>
				{DATA_SOURCES.map((source) => (
					<article
						key={source.key}
						css={css`
							background-color: ${theme.colors.white};
							border: 1px solid ${theme.colors.grey_2};
							border-radius: 12px;
							overflow: hidden;
							display: flex;
							flex-direction: column;
						`}
					>
						{/* Card header */}
						<div
							css={css`
								background-color: ${theme.colors.primary_palest};
								border-bottom: 1px solid ${theme.colors.grey_2};
								padding: 24px 28px;
							`}
						>
							{/* Logo row */}
							<div
								css={css`
									display: flex;
									align-items: flex-start;
									justify-content: space-between;
									gap: 12px;
									margin-bottom: 20px;
								`}
							>
								<img
									src={source.logo}
									alt={source.name}
									css={css`
										height: 44px;
										width: auto;
										max-width: 160px;
										object-fit: contain;
										object-position: left center;
									`}
								/>
								<span
									css={css`
										font-family: 'Geomanist', sans-serif;
										font-size: 0.75rem;
										font-weight: 700;
										letter-spacing: 0.5px;
										text-transform: uppercase;
										padding: 4px 10px;
										border-radius: 20px;
										white-space: nowrap;
										flex-shrink: 0;
										background-color: ${source.accessColor === 'success'
											? theme.colors.success_light
											: theme.colors.warning_light};
										color: ${source.accessColor === 'success'
											? theme.colors.success_dark
											: theme.colors.warning_dark};
									`}
								>
									{source.accessModel}
								</span>
							</div>

							{/* Name + tagline */}
							<h2
								css={css`
									font-family: 'Geomanist', sans-serif;
									font-size: 1.25rem;
									font-weight: 700;
									color: ${theme.colors.primary};
									margin: 0 0 6px;
								`}
							>
								{source.name}
							</h2>
							<p
								css={css`
									font-family: 'Geomanist', sans-serif;
									font-size: 0.85rem;
									color: ${theme.colors.grey_5};
									margin: 0;
									line-height: 1.4;
								`}
							>
								{source.tagline}
							</p>
						</div>

						{/* Card body — single column */}
						<div
							css={css`
								padding: 28px;
								display: flex;
								flex-direction: column;
								gap: 24px;
								flex: 1;
							`}
						>
							{/* About */}
							<div>
								<h3
									css={css`
										font-family: 'Geomanist', sans-serif;
										font-size: 0.75rem;
										font-weight: 700;
										color: ${theme.colors.grey_3};
										text-transform: uppercase;
										letter-spacing: 0.6px;
										margin: 0 0 8px;
									`}
								>
									About
								</h3>
								<p
									css={css`
										font-family: 'Geomanist', sans-serif;
										font-size: 0.88rem;
										color: ${theme.colors.grey_5};
										line-height: 1.65;
										margin: 0;
									`}
								>
									{source.description}
								</p>
							</div>

							{/* Role in SEED-ALS */}
							<div>
								<h3
									css={css`
										font-family: 'Geomanist', sans-serif;
										font-size: 0.75rem;
										font-weight: 700;
										color: ${theme.colors.grey_3};
										text-transform: uppercase;
										letter-spacing: 0.6px;
										margin: 0 0 8px;
									`}
								>
									Role in SEED-ALS
								</h3>
								<p
									css={css`
										font-family: 'Geomanist', sans-serif;
										font-size: 0.88rem;
										color: ${theme.colors.grey_5};
										line-height: 1.65;
										margin: 0;
									`}
								>
									{source.role}
								</p>
							</div>

							{/* Data provided */}
							<div>
								<h3
									css={css`
										font-family: 'Geomanist', sans-serif;
										font-size: 0.75rem;
										font-weight: 700;
										color: ${theme.colors.grey_3};
										text-transform: uppercase;
										letter-spacing: 0.6px;
										margin: 0 0 10px;
									`}
								>
									Data Provided
								</h3>
								<ul
									css={css`
										list-style: none;
										margin: 0;
										padding: 0;
										display: flex;
										flex-direction: column;
										gap: 7px;
									`}
								>
									{source.details.map((detail) => (
										<li
											key={detail}
											css={css`
												font-family: 'Geomanist', sans-serif;
												font-size: 0.86rem;
												color: ${theme.colors.black};
												display: flex;
												align-items: flex-start;
												gap: 8px;

												&::before {
													content: '→';
													color: ${theme.colors.primary};
													font-weight: 700;
													flex-shrink: 0;
													margin-top: 1px;
												}
											`}
										>
											{detail}
										</li>
									))}
								</ul>
							</div>

							{/* External links */}
							<div
								css={css`
									margin-top: auto;
									padding-top: 8px;
									border-top: 1px solid ${theme.colors.grey_2};
								`}
							>
								<h3
									css={css`
										font-family: 'Geomanist', sans-serif;
										font-size: 0.75rem;
										font-weight: 700;
										color: ${theme.colors.grey_3};
										text-transform: uppercase;
										letter-spacing: 0.6px;
										margin: 0 0 10px;
									`}
								>
									External Links
								</h3>
								<div
									css={css`
										display: flex;
										flex-direction: column;
										gap: 7px;
									`}
								>
									{source.links.map((link) => (
										<a
											key={link.url}
											href={link.url}
											target="_blank"
											rel="noopener noreferrer"
											css={css`
												font-family: 'Geomanist', sans-serif;
												font-size: 0.86rem;
												color: ${theme.colors.primary};
												text-decoration: none;
												display: inline-flex;
												align-items: center;
												gap: 4px;
												transition: opacity 0.15s ease;

												&:hover {
													opacity: 0.7;
													text-decoration: underline;
												}

												&::after {
													content: '↗';
													font-size: 0.72rem;
													opacity: 0.55;
												}
											`}
										>
											{link.label}
										</a>
									))}
								</div>
							</div>
						</div>
					</article>
				))}

				{/* Note on controlled access — spans full width */}
				<div
					css={css`
						grid-column: 1 / -1;
						background-color: ${theme.colors.primary_palest};
						border: 1px solid ${theme.colors.primary_pale};
						border-radius: 10px;
						padding: 24px 28px;
					`}
				>
					<h3
						css={css`
							font-family: 'Geomanist', sans-serif;
							font-size: 1rem;
							font-weight: 700;
							color: ${theme.colors.primary};
							margin: 0 0 8px;
						`}
					>
						A note on controlled-access data
					</h3>
					<p
						css={css`
							font-family: 'Geomanist', sans-serif;
							font-size: 0.9rem;
							color: ${theme.colors.grey_5};
							line-height: 1.65;
							margin: 0;
						`}
					>
						EGA facilitates the secure distribution of personally identifiable genetic and phenotypic
						data under controlled access. Each dataset is governed by a Data Access Committee
						(DAC) — a body responsible for evaluating and approving access requests based on
						participant consent and research ethics terms. Researchers must register an EGA
						account, locate the desired dataset, and submit an access request explaining their
						research purpose. The DAC then reviews the application.
						{' '}
						<br />
						SEED-ALS exposes only public metadata — no controlled-access data is available
						through this portal. To request access to the underlying datasets, users are
						redirected to the official EGA portal.
					</p>
				</div>
			</div>
		</PageLayout>
	);
};

export default DataSources;
