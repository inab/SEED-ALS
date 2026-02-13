import { css } from '@emotion/react';
import { ReactElement } from 'react';
import PageLayout from '../../PageLayout';

const About = (): ReactElement => (
	<PageLayout subtitle="About">
		<div
			css={css`
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding: 60px 20px;
			`}
		>
			<h1>About SEED-ALS</h1>
			<p>Information about the SEED-ALS project, team, institutions, and acknowledgements.</p>
		</div>
	</PageLayout>
);

export default About;
