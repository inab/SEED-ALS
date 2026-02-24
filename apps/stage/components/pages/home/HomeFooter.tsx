import { css } from '@emotion/react';

const HomeFooter = () => {
	return (
		<div
			css={css`
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 40px 24px 32px;
				gap: 28px;
				flex-shrink: 0;
			`}
		>
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
							filter: brightness(0) invert(1);
							opacity: 0.8;
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
							filter: brightness(0) invert(1);
							opacity: 0.8;
						`}
					/>
				</a>
			</div>

		</div>
	);
};

export default HomeFooter;
