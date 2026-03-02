import { css, useTheme } from '@emotion/react';
import { ReactElement } from 'react';
import PageLayout from '../../PageLayout';
import defaultTheme from '../../theme';
import { useMonarchData } from '../../../global/hooks/useMonarchData';
import { ALS_MONDO_ID } from '../../../global/utils/constants';
import DiseaseHeader from './DiseaseHeader';
import SideNav from './SideNav';
import SummaryCards from './SummaryCards';
import PhenotypeOverview from './PhenotypeOverview';
import GenesTable from './GenesTable';
import DiseaseModels from './DiseaseModels';
// import DiseaseHierarchy from './DiseaseHierarchy';        // pending

const AlsOverview = (): ReactElement => {
	const theme: typeof defaultTheme = useTheme();
	const { entity, loading, error, fetchAssociations } = useMonarchData(ALS_MONDO_ID);

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
			{/* Loading state */}
			{loading && (
				<div
					css={css`
						display: flex;
						justify-content: center;
						align-items: center;
						padding: 120px 24px;
						font-family: 'Geomanist', sans-serif;
						font-size: 0.9rem;
						color: ${theme.colors.grey_3};
					`}
				>
					Loading ALS data…
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
				<>
					<DiseaseHeader entity={entity} />

					<div
						css={css`
							display: flex;
							width: 100%;
							align-items: flex-start;
						`}
					>
						<SideNav />

						<main
							css={css`
								flex: 1;
								min-width: 0;
								padding: 32px 40px 72px;
								background: ${theme.colors.grey_1};
							`}
						>
							<SummaryCards associationCounts={entity.association_counts} />

							<div css={sectionCardCss}>
								<PhenotypeOverview fetchAssociations={fetchAssociations} />
							</div>

							<div css={sectionCardCss}>
								<GenesTable fetchAssociations={fetchAssociations} />
							</div>

							<div css={sectionCardCss}>
								<DiseaseModels fetchAssociations={fetchAssociations} />
							</div>
						</main>
					</div>
				</>
			)}
		</PageLayout>
	);
};

export default AlsOverview;
