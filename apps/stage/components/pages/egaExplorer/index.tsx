import { css } from '@emotion/react';
import { ReactElement } from 'react';
import PageLayout from '../../PageLayout';

const EgaExplorer = (): ReactElement => (
	<PageLayout subtitle="EGA Explorer">
		<div
			css={css`
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding: 60px 20px;
			`}
		>
			<h1>EGA Metadata Explorer</h1>
			<p>This section will allow exploring public metadata from ALS-related studies in the European Genome-phenome Archive.</p>
		</div>
	</PageLayout>
);

export default EgaExplorer;
