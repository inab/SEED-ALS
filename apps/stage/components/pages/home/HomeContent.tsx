import { css, useTheme } from '@emotion/react';
import { ReactElement } from 'react';
import HomeHero from './HomeHero';
import HomeFeatures from './HomeFeatures';

const HomeContent = (): ReactElement => {
	const theme = useTheme();

	return (
		<main
			css={css`
				background-color: ${theme.colors.grey_1};
				min-height: 100vh;
			`}
		>
			<HomeHero />
			<HomeFeatures />
		</main>
	);
};

export default HomeContent;
