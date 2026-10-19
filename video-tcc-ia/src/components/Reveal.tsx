import type {CSSProperties, ReactNode} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {mix, springAt} from '../anim';

type Direction = 'up' | 'down' | 'left' | 'right' | 'scale' | 'none';

type RevealProps = {
	delay?: number;
	from?: Direction;
	distance?: number;
	blur?: boolean;
	style?: CSSProperties;
	children: ReactNode;
};

/** Entrada com mola: deslocamento com amortecimento natural + opacidade sem overshoot. */
export const Reveal: React.FC<RevealProps> = ({
	delay = 0,
	from = 'up',
	distance = 60,
	blur = true,
	style,
	children,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = springAt(frame, fps, delay);
	const o = springAt(frame, fps, delay, true);

	const offset = (1 - p) * distance;
	const transforms: Record<Direction, string> = {
		up: `translateY(${offset}px)`,
		down: `translateY(${-offset}px)`,
		left: `translateX(${-offset}px)`,
		right: `translateX(${offset}px)`,
		scale: `scale(${mix(p, 0.6, 1)})`,
		none: 'none',
	};

	return (
		<div
			style={{
				opacity: o,
				transform: transforms[from],
				filter: blur && o < 1 ? `blur(${(1 - o) * 8}px)` : undefined,
				...style,
			}}
		>
			{children}
		</div>
	);
};
