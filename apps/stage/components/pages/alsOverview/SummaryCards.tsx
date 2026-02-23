import { css, useTheme } from '@emotion/react';
import { ReactElement } from 'react';
import { AssociationCount } from '../../../global/types/monarch';
import defaultTheme from '../../theme';

const LABEL_MAP: Record<string, string> = {
	'Disease to Phenotype': 'Phenotypes',
	'Gene to Phenotype': 'Gene–Phenotype Links',
	'Causal Gene': 'Causal Genes',
	'Correlated Gene': 'Correlated Genes',
	'Disease Model': 'Disease Models',
};

interface SummaryCardsProps {
	associationCounts: AssociationCount[];
}

const SummaryCards = ({ associationCounts }: SummaryCardsProps): ReactElement => {
	const theme: typeof defaultTheme = useTheme();

	const counts = associationCounts.filter((ac) => LABEL_MAP[ac.label]);

	return (
		<div
			css={css`
				display: flex;
				flex-wrap: wrap;
				gap: 16px;
				margin-bottom: 48px;
			`}
		>
			{counts.map((ac) => (
				<div
					key={ac.category}
					css={css`
						background: ${theme.colors.white};
						border: 1px solid ${theme.colors.grey_2};
						border-radius: 10px;
						padding: 20px 24px;
						min-width: 130px;
						flex: 1;
					`}
				>
					<p
						css={css`
							font-family: 'Geomanist', sans-serif;
							font-size: 1.9rem;
							font-weight: 700;
							color: ${theme.colors.primary};
							margin: 0 0 4px;
							line-height: 1;
						`}
					>
						{ac.count.toLocaleString()}
					</p>
					<p
						css={css`
							font-family: 'Geomanist', sans-serif;
							font-size: 0.75rem;
							font-weight: 700;
							text-transform: uppercase;
							letter-spacing: 0.5px;
							color: ${theme.colors.grey_3};
							margin: 0;
						`}
					>
						{LABEL_MAP[ac.label]}
					</p>
				</div>
			))}
		</div>
	);
};

export default SummaryCards;
