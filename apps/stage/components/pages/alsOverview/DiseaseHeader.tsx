import { css, useTheme } from '@emotion/react';
import { ReactElement } from 'react';
import { MonarchEntity } from '../../../global/types/monarch';
import defaultTheme from '../../theme';

interface DiseaseHeaderProps {
	entity: MonarchEntity;
}

const DiseaseHeader = ({ entity }: DiseaseHeaderProps): ReactElement => {
	const theme: typeof defaultTheme = useTheme();

	return (
		<header
			id="overview"
			css={css`
				background: linear-gradient(135deg, ${theme.colors.primary_dark} 0%, ${theme.colors.primary} 100%);
				color: ${theme.colors.white};
				padding: 56px 40px;
				scroll-margin-top: 80px;
			`}
		>
			<div css={css`max-width: 1400px; margin: 0 auto;`}>
				<a
					href={`https://monarchinitiative.org/disease/${entity.id}`}
					target="_blank"
					rel="noopener noreferrer"
					css={css`
						font-family: 'Geomanist', sans-serif;
						font-size: 0.75rem;
						font-weight: 700;
						letter-spacing: 0.5px;
						background: rgba(255, 255, 255, 0.15);
						padding: 3px 12px;
						border-radius: 12px;
						display: inline-block;
						margin-bottom: 18px;
						color: ${theme.colors.white};
						text-decoration: none;
						transition: background 0.15s ease;

						&:hover {
							background: rgba(255, 255, 255, 0.25);
						}
					`}
				>
					{entity.id} ↗
				</a>

				{/* Disease name */}
				<h1
					css={css`
						font-family: 'Geomanist', sans-serif;
						font-size: 2.2rem;
						font-weight: 700;
						margin: 0 0 20px;
						text-transform: capitalize;
						line-height: 1.2;
					`}
				>
					{entity.name}
				</h1>

				{/* Description */}
				{entity.description && (
					<p
						css={css`
							font-family: 'Geomanist', sans-serif;
							font-size: 1rem;
							font-weight: 300;
							opacity: 0.9;
							line-height: 1.7;
							max-width: 960px;
							margin: 0 0 28px;
						`}
					>
						{entity.description}
					</p>
				)}

				{/* Synonyms */}
				{entity.synonym.length > 0 && (
					<div css={css`display: flex; flex-wrap: wrap; gap: 8px; align-items: center;`}>
						<span
							css={css`
								font-family: 'Geomanist', sans-serif;
								font-size: 0.72rem;
								font-weight: 700;
								opacity: 0.65;
								text-transform: uppercase;
								letter-spacing: 0.6px;
								flex-shrink: 0;
							`}
						>
							Also known as
						</span>
						{entity.synonym.map((s) => (
							<span
								key={s}
								css={css`
									font-family: 'Geomanist', sans-serif;
									font-size: 0.8rem;
									font-weight: 300;
									background: rgba(255, 255, 255, 0.15);
									padding: 3px 10px;
									border-radius: 12px;
								`}
							>
								{s}
							</span>
						))}
					</div>
				)}
			</div>
		</header>
	);
};

export default DiseaseHeader;
