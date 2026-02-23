import { css, useTheme } from '@emotion/react';
import { ReactElement } from 'react';
import PageLayout from '../../PageLayout';
import defaultTheme from '../../theme';
import { useMonarchData } from '../../../global/hooks/useMonarchData';
import { ALS_MONDO_ID } from '../../../global/utils/constants';
import DiseaseHeader from './DiseaseHeader';
// import SideNav from './SideNav';                          // pending
// import SummaryCards from './SummaryCards';                // pending
// import PhenotypeOverview from './PhenotypeOverview';      // pending
// import GenesTable from './GenesTable';                    // pending
// import GeneToPhenotype from './GeneToPhenotype';          // pending
// import DiseaseModels from './DiseaseModels';              // pending
// import DiseaseHierarchy from './DiseaseHierarchy';        // pending

const AlsOverview = (): ReactElement => {
	const theme: typeof defaultTheme = useTheme();
	const { entity, loading, error } = useMonarchData(ALS_MONDO_ID);

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

			{/* Main content */}
			{entity && (
				<DiseaseHeader entity={entity} />
			)}
		</PageLayout>
	);
};

export default AlsOverview;
