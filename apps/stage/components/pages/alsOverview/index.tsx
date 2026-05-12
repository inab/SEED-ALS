import { css, useTheme } from '@emotion/react';
import { ReactElement, useState, useCallback } from 'react';
import PageLayout from '../../PageLayout';
import Loader from '../../Loader';
import defaultTheme from '../../theme';
import { useMonarchData } from '../../../global/hooks/useMonarchData';
import { ALS_MONDO_ID } from '../../../global/utils/constants';
import DiseaseHeader from './DiseaseHeader';
import SideNav from './SideNav';
import SummaryCards from './SummaryCards';
import PhenotypeOverview from './PhenotypeOverview';
import GenesTable from './GenesTable';
import DiseaseModels from './DiseaseModels';
import DiseaseHierarchy from './DiseaseHierarchy';

const SECTION_COUNT = 3;

const AlsOverview = (): ReactElement => {
	const theme: typeof defaultTheme = useTheme();
	const { entity, loading, error, fetchAssociations } = useMonarchData(ALS_MONDO_ID);
	const [sectionsLoaded, setSectionsLoaded] = useState(0);
	const allSectionsLoaded = sectionsLoaded >= SECTION_COUNT;

	const handleSectionLoaded = useCallback(() => {
		setSectionsLoaded((n) => n + 1);
	}, []);

	const sectionCardCss = css`
		background: ${theme.colors.white};
		border-radius: 8px;
		padding: 32px 40px 40px;
		margin-bottom: 20px;
		box-shadow: 0 3px 16px rgba(0, 0, 0, 0.07);
		& > section {
			margin-bottom: 0;
		}
	`;

	return (
		<PageLayout subtitle="ALS Overview">
			{/* Unified loading state — entity fetch + all sections */}
			{(loading || (entity && !allSectionsLoaded)) && !error && (
				<div
					css={css`
						display: flex;
						justify-content: center;
						align-items: center;
						min-height: 60vh;
						padding: 120px 24px;
					`}
				>
					<Loader message="Loading ALS data…" />
				</div>
			)}

			{/* Error state */}
			{error && (
				<div
					css={css`
						display: flex;
						justify-content: center;
						align-items: center;
						padding: 120px 24px;
						font-family: 'Geomanist', sans-serif;
						font-size: 0.9rem;
						color: ${theme.colors.error};
					`}
				>
					Failed to load data: {error}
				</div>
			)}

			{entity && (
				<div css={css`display: ${allSectionsLoaded ? 'block' : 'none'};`}>
					<DiseaseHeader entity={entity} />

					<div
						css={css`
							display: flex;
							width: 100%;
							align-items: stretch;
							@media (max-width: 768px) {
								flex-direction: column;
							}
						`}
					>
						<SideNav />

						<main
							css={css`
								flex: 1;
								min-width: 0;
								padding: 32px 40px 72px;
								background: ${theme.colors.grey_1};
								@media (max-width: 768px) {
									padding: 24px 16px 48px;
								}
							`}
						>
							<SummaryCards associationCounts={entity.association_counts} />

							<div css={sectionCardCss}>
								<PhenotypeOverview fetchAssociations={fetchAssociations} onLoaded={handleSectionLoaded} />
							</div>

							<div css={sectionCardCss}>
								<GenesTable fetchAssociations={fetchAssociations} onLoaded={handleSectionLoaded} />
							</div>

							<div css={sectionCardCss}>
								<DiseaseModels fetchAssociations={fetchAssociations} onLoaded={handleSectionLoaded} />
							</div>

							<div css={sectionCardCss}>
								<DiseaseHierarchy
									hierarchy={entity.node_hierarchy}
									diseaseName={entity.name}
									diseaseId={entity.id}
								/>
							</div>
						</main>
					</div>
				</div>
			)}
		</PageLayout>
	);
};

export default AlsOverview;
