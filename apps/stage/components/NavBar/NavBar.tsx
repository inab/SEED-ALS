// components/NavBar/NavBar.tsx
import { css, useTheme } from '@emotion/react';
import { useRouter } from 'next/router';
import { createRef, ReactElement } from 'react';

import { getConfig } from '../../global/config';
import useAuthContext from '../../global/hooks/useAuthContext';
import { INTERNAL_PATHS, LOGIN_PATH } from '../../global/utils/constants';
import { InternalLink, StyledLinkAsButton } from '../Link';
import defaultTheme from '../theme';
import UserDropdown from '../UserDropdown';

export const navBarRef = createRef<HTMLDivElement>();

const navItems = [
	{ path: INTERNAL_PATHS.ALS_OVERVIEW, label: 'ALS Overview' },
	{ path: INTERNAL_PATHS.EGA_EXPLORER, label: 'EGA Explorer' },
	{ path: INTERNAL_PATHS.DISEASE_MODEL, label: 'Disease Model' },
	{ path: INTERNAL_PATHS.DATA_SOURCES, label: 'Data Sources' },
	{ path: INTERNAL_PATHS.ABOUT, label: 'About' },
];

const NavBar = (): ReactElement => {
	const router = useRouter();
	const theme: typeof defaultTheme = useTheme();
	const { user } = useAuthContext();
	const { NEXT_PUBLIC_AUTH_PROVIDER } = getConfig();

	return (
		<div
			ref={navBarRef}
			css={css`
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: ${theme.dimensions.navbar.height}px;
				background: ${theme.colors.white};
				position: fixed;
				top: 0;
				left: 0;
				z-index: 666;
				width: 100%;
				box-sizing: border-box;
				padding: 0 24px;
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
			`}
		>
			{/* Logo */}
			<div
				css={css`
					display: flex;
					align-items: center;
					flex-shrink: 0;
				`}
			>
				<InternalLink path={INTERNAL_PATHS.HOME}>
					<a
						css={css`
							display: flex;
							align-items: center;
							text-decoration: none;
						`}
					>
						<img
							src="/seed-als/logos/SEED-ALS PNG/logo SEED-ALS_Azul.png"
							alt="SEED-ALS"
							css={css`
								height: 70px;
								width: auto;
							`}
						/>
					</a>
				</InternalLink>
			</div>

			{/* Nav links + Auth */}
			<div
				css={css`
					display: flex;
					align-items: center;
					height: 100%;
					gap: 0;
				`}
			>
				{/* Navigation links */}
				<nav
					css={css`
						display: flex;
						align-items: center;
						height: 100%;
						@media (max-width: 768px) {
							display: none;
						}
					`}
				>
					{navItems.map(({ path, label }) => {
						const isActive = router.pathname === path;
						return (
							<InternalLink key={path} path={path}>
								<a
									css={css`
										display: flex;
										align-items: center;
										justify-content: center;
										height: ${theme.dimensions.navbar.height}px;
										padding: 0 18px;
										font-family: 'Geomanist', sans-serif;
										font-size: 14px;
										font-weight: ${isActive ? '700' : '400'};
										letter-spacing: 0.3px;
										color: ${isActive ? theme.colors.primary : theme.colors.grey_5};
										text-decoration: none;
										background-color: ${isActive ? theme.colors.primary_palest : 'transparent'};
										border-radius: 6px;
										box-sizing: border-box;
										transition: color 0.2s, background-color 0.2s;
										&:hover {
											color: ${theme.colors.primary};
											background-color: ${theme.colors.primary_palest};
										}
									`}
								>
									{label}
								</a>
							</InternalLink>
						);
					})}
				</nav>

				{/* Auth Section — hidden for now, functionality preserved */}
				{NEXT_PUBLIC_AUTH_PROVIDER && (
					<div
						css={css`
							display: none;
							align-items: center;
							margin-left: 16px;
						`}
					>
						{user ? (
							<div
								css={(theme) => css`
									width: 195px;
									height: ${theme.dimensions.navbar.height}px;
									position: relative;
									display: flex;
									&:hover {
										background-color: ${theme.colors.grey_1};
									}
								`}
							>
								<UserDropdown />
							</div>
						) : (
							<InternalLink path={LOGIN_PATH}>
								<StyledLinkAsButton
									css={css`
										font-family: 'Geomanist', sans-serif;
										font-size: 13px;
										font-weight: 700;
										padding: 6px 20px;
										border-radius: 4px;
										background-color: ${theme.colors.primary};
										color: ${theme.colors.white};
										border: none;
										cursor: pointer;
										transition: background-color 0.2s;
										&:hover {
											background-color: ${theme.colors.primary_light};
										}
									`}
								>
									Log in
								</StyledLinkAsButton>
							</InternalLink>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default NavBar;
