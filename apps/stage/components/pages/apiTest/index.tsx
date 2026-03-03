import { css } from '@emotion/react';
import { ReactElement } from 'react';
import PageLayout from '../../PageLayout';

const API_TESTS = [
	{
		key: 'monarch',
		label: 'Monarch Initiative API',
		description: 'Entity endpoint + all association categories (phenotypes, genes, disease models)',
		href: '/api-test/monarch',
	},
	{
		key: 'ega',
		label: 'EGA Metadata API',
		description: 'Studies and datasets metadata endpoints',
		href: '/api-test/ega',
	},
];

const ApiTestIndex = (): ReactElement => (
	<PageLayout subtitle="API Tests">
		<div
			css={css`
				max-width: 700px;
				margin: 0 auto;
				padding: 40px 24px 72px;
			`}
		>
			<h1 css={css`font-family: monospace; font-size: 1.4rem; margin-bottom: 8px;`}>
				API Integration Tests
			</h1>
			<p css={css`font-family: monospace; font-size: 0.85rem; color: #6c757d; margin-bottom: 40px;`}>
				Live integration tests against external APIs. Each page makes real HTTP requests and
				validates the responses.
			</p>

			<div css={css`display: flex; flex-direction: column; gap: 12px;`}>
				{API_TESTS.map((test) => (
					<a
						key={test.key}
						href={test.href}
						css={css`
							display: block;
							padding: 20px 24px;
							background: #f8f9fa;
							border: 1px solid #dee2e6;
							border-radius: 8px;
							text-decoration: none;
							color: inherit;
							transition: border-color 0.15s ease, background 0.15s ease;

							&:hover {
								border-color: #adb5bd;
								background: #f1f3f5;
							}
						`}
					>
						<p css={css`font-family: monospace; font-size: 0.95rem; font-weight: 700; margin: 0 0 4px;`}>
							{test.label}
						</p>
						<p css={css`font-family: monospace; font-size: 0.8rem; color: #6c757d; margin: 0;`}>
							{test.description}
						</p>
					</a>
				))}
			</div>
		</div>
	</PageLayout>
);

export default ApiTestIndex;
