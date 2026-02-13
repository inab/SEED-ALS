import { css } from '@emotion/react';
import { ReactElement } from 'react';
import PageLayout from '../../PageLayout';

const DataSources = (): ReactElement => (
	<PageLayout subtitle="Data Sources">
		<div
			css={css`
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding: 60px 20px;
			`}
		>
			<h1>Data Sources</h1>
			<p>This section will explain the main data sources used in the portal: Monarch Initiative and EGA.</p>
		</div>
	</PageLayout>
);

export default DataSources;
