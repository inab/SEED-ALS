import { css, useTheme } from '@emotion/react';
import { ReactElement } from 'react';
import { INTERNAL_PATHS } from '../../../global/utils/constants';

const HomeHero = (): ReactElement => {
	const theme = useTheme();

	return (
		<section
			css={css`
				background: linear-gradient(135deg, ${theme.colors.primary_dark} 0%, ${theme.colors.primary} 50%, ${theme.colors.primary_light} 100%);
				color: ${theme.colors.white};
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				text-align: center;
				padding: 80px 24px;
				min-height: 420px;

				@media (max-width: 768px) {
					padding: 48px 16px;
					min-height: 320px;
				}
			`}
		>
			<img
				src="/seed-als/logos/SEED-ALS PNG/logo SEED-ALS_Blanco.png"
				alt="SEED-ALS"
				css={css`
					width: 280px;
					height: auto;
					margin-bottom: 32px;

					@media (max-width: 768px) {
						width: 200px;
						margin-bottom: 24px;
					}
				`}
			/>
			<h1
				css={css`
					font-size: 2rem;
					font-weight: 300;
					margin: 0 0 16px 0;
					max-width: 700px;
					line-height: 1.3;

					@media (max-width: 768px) {
						font-size: 1.5rem;
					}
				`}
			>
				A reference portal for Amyotrophic Lateral Sclerosis research
			</h1>
			<p
				css={css`
					font-size: 1.1rem;
					font-weight: 300;
					opacity: 0.85;
					max-width: 560px;
					line-height: 1.6;
					margin: 0 0 36px 0;

					@media (max-width: 768px) {
						font-size: 0.95rem;
						margin-bottom: 28px;
					}
				`}
			>
				Centralizing biomedical information, public dataset metadata, and computational analysis results in a unified interface.
			</p>
			<a
				href={INTERNAL_PATHS.ALS_OVERVIEW}
				css={css`
					display: inline-block;
					background-color: ${theme.colors.white};
					color: ${theme.colors.primary};
					text-decoration: none;
					padding: 14px 36px;
					border-radius: 8px;
					font-size: 1rem;
					font-weight: 700;
					transition: transform 0.2s ease, box-shadow 0.2s ease;

					&:hover {
						transform: translateY(-2px);
						box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
					}
				`}
			>
				Explore the Portal
			</a>
		</section>
	);
};

export default HomeHero;
