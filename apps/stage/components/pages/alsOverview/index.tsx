import { css } from '@emotion/react';
import { ReactElement } from 'react';
import PageLayout from '../../PageLayout';

const AlsOverview = (): ReactElement => (
	<PageLayout subtitle="ALS Overview">
		<div
			css={css`
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding: 60px 20px;
			`}
		>
			<h1>ALS Disease Overview</h1>
			<p>This section will provide a comprehensive overview of Amyotrophic Lateral Sclerosis.</p>
		</div>
	</PageLayout>
);

export default AlsOverview;
