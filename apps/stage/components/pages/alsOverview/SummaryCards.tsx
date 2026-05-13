import { css, useTheme } from '@emotion/react';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { AssociationCount } from '../../../global/types/monarch';
import defaultTheme from '../../theme';

const LABEL_MAP: Record<string, string> = {
	'Disease to Phenotype': 'Phenotypes',
	'Gene to Phenotype': 'Gene–Phenotype Links',
	'Causal Gene': 'Causal Genes',
	'Correlated Gene': 'Correlated Genes',
	'Disease Model': 'Disease Models',
};

function useCountUp(target: number, duration = 1400) {
	const [count, setCount] = useState(0);
	const ref = useRef<HTMLParagraphElement>(null);
	const started = useRef(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !started.current) {
					started.current = true;
					const start = performance.now();
					const step = (now: number) => {
						const elapsed = now - start;
						const progress = Math.min(elapsed / duration, 1);
						const eased = 1 - Math.pow(1 - progress, 3);
						setCount(Math.round(eased * target));
						if (progress < 1) requestAnimationFrame(step);
					};
					requestAnimationFrame(step);
				}
			},
			{ threshold: 0.3 },
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, [target, duration]);

	return { count, ref };
}

interface SummaryCardProps {
	count: number;
	label: string;
	theme: typeof defaultTheme;
}

function SummaryCard({ count, label, theme }: SummaryCardProps): ReactElement {
	const { count: animatedCount, ref } = useCountUp(count);

	return (
		<div
			css={css`
				background: ${theme.colors.white};
				border: 1px solid ${theme.colors.grey_2};
				border-radius: 10px;
				padding: 20px 24px;
				min-width: 130px;
				flex: 1;
			`}
		>
			<p
				ref={ref}
				css={css`
					font-family: 'Geomanist', sans-serif;
					font-size: 1.9rem;
					font-weight: 700;
					color: ${theme.colors.primary};
					margin: 0 0 4px;
					line-height: 1;
				`}
			>
				{animatedCount.toLocaleString()}
			</p>
			<p
				css={css`
					font-family: 'Geomanist', sans-serif;
					font-size: 0.75rem;
					font-weight: 700;
					text-transform: uppercase;
					letter-spacing: 0.5px;
					color: ${theme.colors.grey_3};
					margin: 0;
				`}
			>
				{label}
			</p>
		</div>
	);
}

interface SummaryCardsProps {
	associationCounts: AssociationCount[];
}

const SummaryCards = ({ associationCounts }: SummaryCardsProps): ReactElement => {
	const theme: typeof defaultTheme = useTheme();

	const counts = associationCounts.filter((ac) => LABEL_MAP[ac.label]);

	return (
		<div
			css={css`
				display: flex;
				flex-wrap: wrap;
				gap: 16px;
				margin-bottom: 48px;
			`}
		>
			{counts.map((ac) => (
				<SummaryCard
					key={ac.category}
					count={ac.count}
					label={LABEL_MAP[ac.label]}
					theme={theme}
				/>
			))}
		</div>
	);
};

export default SummaryCards;
