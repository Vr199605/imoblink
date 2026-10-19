import type {ReactNode} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {mix, springAt} from '../anim';

type SceneShellProps = {
	duration: number;
	children: ReactNode;
};

/** Envelope de cena: entra e sai com mola (zoom sutil + opacidade + desfoque). */
export const SceneShell: React.FC<SceneShellProps> = ({duration, children}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const enter = springAt(frame, fps, 0, true);
	const exit = springAt(frame, fps, duration - 20, true);
	const visible = enter * (1 - exit);

	return (
		<AbsoluteFill
			style={{
				opacity: visible,
				transform: `scale(${mix(enter, 0.965, 1) + exit * 0.035})`,
				filter: visible < 1 ? `blur(${(1 - visible) * 10}px)` : undefined,
			}}
		>
			{children}
		</AbsoluteFill>
	);
};
