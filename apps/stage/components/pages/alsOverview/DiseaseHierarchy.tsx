import { css, useTheme } from '@emotion/react';
import dynamic from 'next/dynamic';
import { ReactElement } from 'react';
import { NodeHierarchy } from '../../../global/types/monarch';
import defaultTheme from '../../theme';

const DiseaseHierarchyFlow = dynamic(() => import('./DiseaseHierarchyFlow'), { ssr: false });

interface DiseaseHierarchyProps {
	hierarchy: NodeHierarchy;
	diseaseName: string;
	diseaseId: string;
}

const DiseaseHierarchy = ({ hierarchy, diseaseName, diseaseId }: DiseaseHierarchyProps): ReactElement => {
	const theme: typeof defaultTheme = useTheme();

	return (
		<section
			id="hierarchy"
			css={css`
				margin-bottom: 48px;
				scroll-margin-top: 80px;
			`}
		>
			<div css={css`display: flex; align-items: baseline; gap: 10px; margin-bottom: 6px;`}>
				<h2
					css={css`
						font-family: 'Geomanist', sans-serif;
						font-size: 1.15rem;
						font-weight: 700;
						color: ${theme.colors.primary};
						margin: 0;
					`}
				>
					Disease Hierarchy
				</h2>
			</div>
			<p
				css={css`
					font-family: 'Geomanist', sans-serif;
					font-size: 0.85rem;
					color: ${theme.colors.grey_5};
					margin: 6px 0 0;
					line-height: 1.5;
				`}
			>
				Classification context: parent conditions (broader categories) and known subtypes of ALS. Click any node to view it
				on the Monarch Initiative.
			</p>

			<div
				css={css`
					border-top: 1px solid ${theme.colors.grey_2};
					margin-top: 16px;
					padding-top: 16px;
				`}
			>
				<DiseaseHierarchyFlow
					hierarchy={hierarchy}
					diseaseName={diseaseName}
					diseaseId={diseaseId}
					colors={{
						primary: theme.colors.primary,
						primary_palest: theme.colors.primary_palest,
						primary_pale: theme.colors.primary_pale,
						white: theme.colors.white,
					}}
				/>
			</div>
		</section>
	);
};

export default DiseaseHierarchy;
