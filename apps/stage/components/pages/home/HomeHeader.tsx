import { css } from '@emotion/react';
import { ReactElement } from 'react';
import { INTERNAL_PATHS } from '../../../global/utils/constants';

const navItems = [
	{ path: INTERNAL_PATHS.ALS_OVERVIEW, label: 'ALS Overview' },
	{ path: INTERNAL_PATHS.EGA_EXPLORER, label: 'EGA Explorer' },
	{ path: INTERNAL_PATHS.DISEASE_MODEL, label: 'Disease Model' },
	{ path: INTERNAL_PATHS.DATA_SOURCES, label: 'Data Sources' },
	{ path: INTERNAL_PATHS.ABOUT, label: 'About' },
];

const HomeHeader = (): ReactElement => (
	<header
		css={css`
			height: 70px;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
		`}
	>
		<nav
			css={css`
				display: flex;
				align-items: center;
				gap: 0;
			`}
		>
			{navItems.map(({ path, label }) => (
				<a
					key={path}
					href={path}
					css={css`
						padding: 6px 18px;
						font-family: 'Geomanist', sans-serif;
						font-size: 14px;
						font-weight: 400;
						letter-spacing: 0.3px;
						color: rgba(255, 255, 255, 0.68);
						text-decoration: none;
						border-radius: 6px;
						transition: color 0.2s ease, background 0.2s ease;

						&:hover {
							color: rgba(255, 255, 255, 0.95);
							background: rgba(255, 255, 255, 0.08);
						}
					`}
				>
					{label}
				</a>
			))}
		</nav>
	</header>
);

export default HomeHeader;
