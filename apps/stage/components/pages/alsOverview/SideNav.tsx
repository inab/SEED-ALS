import { css, useTheme } from '@emotion/react';
import { ReactElement } from 'react';
import defaultTheme from '../../theme';

const NAV_HEIGHT = 72;

const NAV_ITEMS = [
	{ id: 'overview', label: 'Disease Overview' },
	{ id: 'phenotypes', label: 'Phenotypes' },
	{ id: 'genes', label: 'Genes' },
	{ id: 'disease-models', label: 'Disease Models' },
	{ id: 'hierarchy', label: 'Disease Hierarchy' },
];

const scrollTo = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
	e.preventDefault();
	document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const SideNav = (): ReactElement => {
	const theme: typeof defaultTheme = useTheme();

	const linkCss = css`
		display: block;
		font-family: 'Geomanist', sans-serif;
		font-size: 0.875rem;
		font-weight: 300;
		color: ${theme.colors.grey_6};
		text-decoration: none;
		padding: 15px 20px;
		border-left: 2px solid transparent;
		transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
		&:hover {
			color: ${theme.colors.primary};
			border-left-color: ${theme.colors.primary_pale};
			background: ${theme.colors.primary_palest};
		}
	`;

	return (
		<nav
			css={css`
				width: 220px;
				flex-shrink: 0;
				background: ${theme.colors.white};
				box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
				@media (max-width: 768px) {
					width: 100%;
					box-shadow: none;
					border-bottom: 1px solid ${theme.colors.grey_2};
				}
			`}
		>
			{/* Desktop: sticky vertical nav */}
			<div
				css={css`
					position: sticky;
					top: ${NAV_HEIGHT}px;
					padding: 32px 0;
					@media (max-width: 768px) {
						display: none;
					}
				`}
			>
				<p
					css={css`
						font-family: 'Geomanist', sans-serif;
						font-size: 0.8rem;
						font-weight: 700;
						text-transform: uppercase;
						letter-spacing: 0.8px;
						color: ${theme.colors.grey_5};
						margin: 0 0 8px;
						padding: 0 20px;
					`}
				>
					Contents
				</p>

				<ul css={css`list-style: none; margin: 0; padding: 0;`}>
					{NAV_ITEMS.map((item) => (
						<li key={item.id}>
							<a href={`#${item.id}`} onClick={scrollTo(item.id)} css={linkCss}>
								{item.label}
							</a>
						</li>
					))}
				</ul>

				<div
					css={css`
						margin-top: 40px;
						padding: 20px 20px 0;
						border-top: 1px solid ${theme.colors.grey_2};
					`}
				>
					<p
						css={css`
							font-family: 'Geomanist', sans-serif;
							font-size: 0.72rem;
							color: ${theme.colors.grey_4};
							margin: 0 0 10px;
							line-height: 1.4;
						`}
					>
						Data sourced from
					</p>
					<a href="https://monarchinitiative.org" target="_blank" rel="noopener noreferrer">
						<img
							src="/seed-als/logos/monarch-iniciative.png"
							alt="Monarch Initiative"
							css={css`
								width: 50%;
								max-width: 140px;
								display: block;
								opacity: 0.85;
								transition: opacity 0.15s ease;
								&:hover { opacity: 1; }
							`}
						/>
					</a>
				</div>
			</div>

			{/* Mobile: horizontal scrollable pills */}
			<div
				css={css`
					display: none;
					@media (max-width: 768px) {
						display: flex;
						overflow-x: auto;
						padding: 12px 16px;
						gap: 8px;
						-webkit-overflow-scrolling: touch;
						scrollbar-width: none;
						&::-webkit-scrollbar { display: none; }
					}
				`}
			>
				{NAV_ITEMS.map((item) => (
					<a
						key={item.id}
						href={`#${item.id}`}
						onClick={scrollTo(item.id)}
						css={css`
							font-family: 'Geomanist', sans-serif;
							font-size: 0.8rem;
							font-weight: 400;
							color: ${theme.colors.grey_6};
							text-decoration: none;
							white-space: nowrap;
							padding: 6px 14px;
							border: 1px solid ${theme.colors.grey_2};
							border-radius: 20px;
							background: ${theme.colors.white};
							flex-shrink: 0;
							transition: color 0.15s, background 0.15s, border-color 0.15s;
							&:hover {
								color: ${theme.colors.primary};
								border-color: ${theme.colors.primary_pale};
								background: ${theme.colors.primary_palest};
							}
						`}
					>
						{item.label}
					</a>
				))}
			</div>
		</nav>
	);
};

export default SideNav;
