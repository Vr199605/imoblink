import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {springAt, springWindow} from '../anim';
import {COLORS, SCENES, alpha} from '../theme';

const ethics = SCENES.find((s) => s.id === 'ethics')!;
const outro = SCENES.find((s) => s.id === 'outro')!;

/** Fundo persistente: gradientes radiais em deriva lenta + grade técnica. */
export const Background: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const drift = (speed: number, amp: number, phase: number) => Math.sin(frame / speed + phase) * amp;
	const alert = springWindow(frame, fps, ethics.from, ethics.from + ethics.duration - 30);
	const success = springAt(frame, fps, outro.from, true);

	const blob = (x: number, y: number, size: number, color: string, a: number) =>
		`radial-gradient(circle ${size}px at ${x}px ${y}px, ${alpha(color, a)}, transparent 70%)`;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<AbsoluteFill
				style={{
					backgroundImage: [
						blob(300 + drift(110, 80, 0), 220 + drift(90, 60, 1), 760, COLORS.purple, 0.28 * (1 - alert * 0.6)),
						blob(1650 + drift(130, 90, 2), 860 + drift(100, 50, 3), 820, COLORS.cyan, 0.22 * (1 - alert * 0.6)),
						blob(1500 + drift(95, 60, 4), 160 + drift(120, 40, 5), 600, COLORS.coral, 0.32 * alert),
						blob(960 + drift(140, 70, 6), 540, 900, COLORS.emerald, 0.16 * success),
					].join(', '),
				}}
			/>
			<AbsoluteFill
				style={{
					backgroundImage:
						'linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)',
					backgroundSize: '80px 80px',
					backgroundPosition: `${(frame * 0.4) % 80}px ${(frame * 0.4) % 80}px`,
					maskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, black 30%, transparent 85%)',
					WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, black 30%, transparent 85%)',
				}}
			/>
			<AbsoluteFill
				style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(5,7,12,0.65) 100%)'}}
			/>
		</AbsoluteFill>
	);
};
