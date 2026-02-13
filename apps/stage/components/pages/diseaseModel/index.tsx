import { css } from '@emotion/react';
import { ReactElement } from 'react';
import PageLayout from '../../PageLayout';

const DiseaseModel = (): ReactElement => (
	<PageLayout subtitle="Disease Model">
		<div
			css={css`
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding: 60px 20px;
			`}
		>
			<h1>Disease Model</h1>
			<p>This section will display machine learning analysis results and visualizations.</p>
		</div>
	</PageLayout>
);

export default DiseaseModel;
