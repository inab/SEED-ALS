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
				position: sticky;
				top: ${NAV_HEIGHT}px;
				align-self: flex-start;
				padding: 32px 0;
				background: transparent;
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

				{/* Separator + footer link */}
				<li css={css`margin-top: 8px;`}>
					<div
						css={css`
							margin: 0 20px 8px;
							border-top: 1px solid ${theme.colors.grey_2};
						`}
					/>
					<a href="#page-footer" onClick={scrollTo('page-footer')} css={linkCss}>
						Funding & Credits
					</a>
				</li>
			</ul>
		</nav>
	);
};

export default SideNav;
