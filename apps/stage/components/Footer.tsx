import { css } from '@emotion/react';
import defaultTheme from './theme';

const Footer = () => {
	return (
		<div
			id="page-footer"
			css={(theme: typeof defaultTheme) => css`
				background-color: ${theme.colors.white};
				box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 40px 24px 32px;
				gap: 28px;
			`}
		>
			{/* Row 1: BSC + Overture logos */}
			<div
				css={css`
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 60px;
					flex-wrap: wrap;
				`}
			>
				<a href="https://www.bsc.es/" target="_blank" rel="noopener noreferrer">
					<img
						src="/seed-als/footer/BSC-blue.svg"
						alt="Barcelona Supercomputing Center"
						css={css`
							height: 50px;
							width: auto;
						`}
					/>
				</a>
				<a href="https://www.overture.bio/" target="_blank" rel="noopener noreferrer">
					<img
						src="/seed-als/footer/overture.svg"
						alt="Overture"
						css={css`
							height: 30px;
							width: auto;
						`}
					/>
				</a>
				<a
					href="https://github.com/inab/SEED-ALS/tree/TechBioLab"
					target="_blank"
					rel="noopener noreferrer"
					css={(theme: typeof defaultTheme) => css`
						display: flex;
						align-items: center;
						gap: 8px;
						text-decoration: none;
						color: ${theme.colors.grey_5};
						font-family: 'Geomanist', sans-serif;
						font-size: 13px;
						opacity: 0.75;
						transition: opacity 0.15s ease;
						&:hover { opacity: 1; }
					`}
				>
					<img
						src="/seed-als/logos/github.svg"
						alt="GitHub"
						css={css`
							height: 50px;
							width: auto;
						`}
					/>
					SEED-ALS
				</a>
			</div>

			{/* Row 2: Financing acknowledgement */}
			<div
				css={css`
					text-align: center;
					max-width: 720px;
					display: flex;
					flex-direction: column;
					gap: 6px;
				`}
			>
				<p
					css={(theme: typeof defaultTheme) => css`
						font-family: 'Geomanist', sans-serif;
						font-size: 12px;
						font-weight: 700;
						color: ${theme.colors.grey_5};
						margin: 0;
						letter-spacing: 0.3px;
					`}
				>
					PMPER24/00017 (IP. ADOLFO L&Oacute;PEZ DE MUNAIN)
				</p>
				<p
					css={(theme: typeof defaultTheme) => css`
						font-family: 'Geomanist', sans-serif;
						font-size: 11px;
						font-weight: 400;
						color: ${theme.colors.grey_5};
						margin: 0;
						line-height: 1.5;
					`}
				>
					ENTIDAD FINANCIADORA: INSTITUTO DE SALUD CARLOS III (ISCIII). PROYECTO FINANCIADO CON CARGO A FONDOS NEXTGENERATION EU, QUE FINANCIAN LAS ACTUACIONES DEL MRR
				</p>
			</div>

			{/* Row 3: Financing entity logos */}
			<div
				css={css`
					display: flex;
					justify-content: center;
				`}
			>
				<img
					src="/seed-als/footer/financing-logos.png"
					alt="Entidades financiadoras: Gobierno de España, ISCIII, Plan de Recuperación, Unión Europea"
					css={css`
						height: 50px;
						width: auto;
						max-width: 100%;
					`}
				/>
			</div>
		</div>
	);
};

export default Footer;
