import { css, useTheme } from '@emotion/react';
import { ReactElement } from 'react';
import PageLayout from '../../PageLayout';
import defaultTheme from '../../theme';
import PPINetwork from './PPINetwork';

const DiseaseModel = (): ReactElement => {
	const theme: typeof defaultTheme = useTheme();

	return (
		<PageLayout subtitle="Disease Model">
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
					Disease Model
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
					Protein–protein interaction network for ALS-associated genes. Nodes represent proteins;
					edges connect proteins with experimentally validated physical interactions.
				</p>
			</section>

			<PPINetwork />
		</PageLayout>
	);
};

export default DiseaseModel;
