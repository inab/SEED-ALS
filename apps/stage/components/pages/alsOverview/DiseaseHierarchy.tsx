import { css, useTheme } from '@emotion/react';
import { ReactElement } from 'react';
import { NodeHierarchy } from '../../../global/types/monarch';
import defaultTheme from '../../theme';

const MONARCH_BASE = 'https://monarchinitiative.org/disease/';

interface DiseaseHierarchyProps {
	hierarchy: NodeHierarchy;
	diseaseName: string;
	diseaseId: string;
}

const DiseaseHierarchy = ({ hierarchy, diseaseName, diseaseId }: DiseaseHierarchyProps): ReactElement => {
	const theme: typeof defaultTheme = useTheme();

	const nodeChipCss = (highlight = false) => css`
		display: inline-block;
		font-family: 'Geomanist', sans-serif;
		font-size: 0.85rem;
		font-weight: ${highlight ? 700 : 300};
		padding: 6px 14px;
		border-radius: 20px;
		background: ${highlight ? theme.colors.primary : theme.colors.primary_palest};
		color: ${highlight ? theme.colors.white : theme.colors.primary};
		border: 1px solid ${highlight ? theme.colors.primary : theme.colors.primary_pale};
		text-decoration: none;
		transition: opacity 0.15s ease;

		&:hover {
			opacity: ${highlight ? 1 : 0.75};
		}
	`;

	const connectorCss = css`
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 4px;
		padding-left: 24px;
		border-left: 2px solid ${theme.colors.primary_pale};
		margin: 6px 0 6px 16px;
	`;

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
				Classification context: parent conditions (broader categories) and known subtypes of ALS.
			</p>

			<div
				css={css`
					border-top: 1px solid ${theme.colors.grey_2};
					margin-top: 16px;
					padding-top: 24px;
					display: flex;
					flex-direction: column;
					gap: 0;
				`}
			>
				{/* Super-classes (parent diseases) */}
				{hierarchy.super_classes.length > 0 && (
					<div>
						<p
							css={css`
								font-family: 'Geomanist', sans-serif;
								font-size: 0.72rem;
								font-weight: 700;
								text-transform: uppercase;
								letter-spacing: 0.6px;
								color: ${theme.colors.grey_3};
								margin: 0 0 10px;
							`}
						>
							Parent conditions
						</p>
						<div css={css`display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 4px;`}>
							{hierarchy.super_classes.map((node) => (
								<a
									key={node.id}
									href={`${MONARCH_BASE}${node.id}`}
									target="_blank"
									rel="noopener noreferrer"
									css={nodeChipCss(false)}
								>
									{node.name}
								</a>
							))}
						</div>
					</div>
				)}

				{/* Connector line */}
				<div css={connectorCss}>
					<span
						css={css`
							font-family: 'Geomanist', sans-serif;
							font-size: 0.72rem;
							color: ${theme.colors.grey_3};
							font-style: italic;
						`}
					>
						includes
					</span>
				</div>

				{/* ALS — current disease (highlighted) */}
				<div css={css`margin-bottom: 4px;`}>
					<a
						href={`${MONARCH_BASE}${diseaseId}`}
						target="_blank"
						rel="noopener noreferrer"
						css={nodeChipCss(true)}
					>
						{diseaseName}
					</a>
				</div>

				{/* Sub-classes (subtypes) */}
				{hierarchy.sub_classes.length > 0 && (
					<>
						<div css={connectorCss}>
							<span
								css={css`
									font-family: 'Geomanist', sans-serif;
									font-size: 0.72rem;
									color: ${theme.colors.grey_3};
									font-style: italic;
								`}
							>
								has subtypes
							</span>
						</div>
						<div>
							<p
								css={css`
									font-family: 'Geomanist', sans-serif;
									font-size: 0.72rem;
									font-weight: 700;
									text-transform: uppercase;
									letter-spacing: 0.6px;
									color: ${theme.colors.grey_3};
									margin: 0 0 10px;
								`}
							>
								Subtypes
							</p>
							<div css={css`display: flex; flex-wrap: wrap; gap: 8px;`}>
								{hierarchy.sub_classes.map((node) => (
									<a
										key={node.id}
										href={`${MONARCH_BASE}${node.id}`}
										target="_blank"
										rel="noopener noreferrer"
										css={nodeChipCss(false)}
									>
										{node.name}
									</a>
								))}
							</div>
						</div>
					</>
				)}

				{hierarchy.sub_classes.length === 0 && (
					<p
						css={css`
							font-family: 'Geomanist', sans-serif;
							font-size: 0.85rem;
							color: ${theme.colors.grey_3};
							margin-top: 8px;
							padding-left: 24px;
						`}
					>
						No subtypes defined.
					</p>
				)}
			</div>
		</section>
	);
};

export default DiseaseHierarchy;
