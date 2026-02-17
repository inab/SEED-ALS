import { Html, Head, Main, NextScript } from 'next/document';
import urlJoin from 'url-join';

import { getConfig } from '../global/config';

const Document = () => {
	const { NEXT_PUBLIC_BASE_PATH } = getConfig();

	return (
		<Html>
			<Head>
				<style
					dangerouslySetInnerHTML={{
						__html: `
							@font-face {
								font-family: 'Geomanist';
								src: url('/seed-als/fonts/woff2/Geomanist-Light-WZ.woff2') format('woff2');
								font-weight: 300;
								font-style: normal;
								font-display: swap;
							}
							@font-face {
								font-family: 'Geomanist';
								src: url('/seed-als/fonts/woff2/Geomanist-Book-WZ.woff2') format('woff2');
								font-weight: 400;
								font-style: normal;
								font-display: swap;
							}
							@font-face {
								font-family: 'Geomanist';
								src: url('/seed-als/fonts/woff2/Geomanist-Bold-WZ.woff2') format('woff2');
								font-weight: 700;
								font-style: normal;
								font-display: swap;
							}
						`,
					}}
				/>
				<link rel="shortcut icon" href={urlJoin(NEXT_PUBLIC_BASE_PATH, '/images/favicon.ico')} />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
};

export default Document;
