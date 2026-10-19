import {GraduationCap} from 'lucide-react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {mix, springAt, springWindow} from '../anim';
import {CAPTIONS} from '../captions';
import {COLORS, FONTS, SCENES, TOTAL_FRAMES, alpha} from '../theme';

const currentSceneIndex = (frame: number) =>
	Math.max(
		0,
		SCENES.findIndex((s) => frame >= s.from && frame < s.from + s.duration),
	);

const TopBar: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const enter = springAt(frame, fps, 4, true);
	const exit = springAt(frame, fps, TOTAL_FRAMES - 24, true);
	const active = currentSceneIndex(frame);

	return (
		<div
			style={{
				position: 'absolute',
				top: 48,
				left: 120,
				right: 120,
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				opacity: enter * (1 - exit),
				transform: `translateY(${(1 - springAt(frame, fps, 4)) * -30}px)`,
			}}
		>
			<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
				<div
					style={{
						width: 52,
						height: 52,
						borderRadius: 14,
						background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.cyan})`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						boxShadow: `0 10px 30px ${alpha(COLORS.purple, 0.4)}`,
					}}
				>
					<GraduationCap size={30} color="#fff" strokeWidth={2.2} />
				</div>
				<div>
					<div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 24, color: COLORS.text}}>
						IA & TCC
					</div>
					<div style={{fontFamily: FONTS.body, fontSize: 16, color: COLORS.muted}}>Guia de uso ético e prático</div>
				</div>
			</div>

			<div style={{display: 'flex', alignItems: 'center', gap: 22}}>
				<div style={{position: 'relative', height: 30, width: 320}}>
					{SCENES.map((s, i) => {
						const vis = springWindow(frame, fps, s.from, s.from + s.duration - 12);
						return (
							<div
								key={s.id}
								style={{
									position: 'absolute',
									right: 0,
									top: 0,
									whiteSpace: 'nowrap',
									opacity: vis,
									transform: `translateY(${(1 - vis) * 14}px)`,
									fontFamily: FONTS.body,
									fontWeight: 600,
									fontSize: 20,
									color: COLORS.text,
								}}
							>
								<span style={{color: s.color}}>{String(i + 1).padStart(2, '0')}</span>
								<span style={{color: COLORS.subtle}}> / 05 · </span>
								{s.label}
							</div>
						);
					})}
				</div>
				<div style={{display: 'flex', gap: 8}}>
					{SCENES.map((s, i) => {
						const on = springWindow(frame, fps, s.from, s.from + s.duration);
						return (
							<div
								key={s.id}
								style={{
									height: 10,
									width: mix(on, 10, 34),
									borderRadius: 5,
									background: i <= active ? s.color : 'rgba(148,163,184,0.25)',
									opacity: i < active ? 0.55 : 1,
								}}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
};

const Captions: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const cue = CAPTIONS.find((c) => frame >= c.from && frame < c.to + 4);
	if (!cue) {
		return null;
	}
	const local = frame - cue.from;
	const box = springAt(local, fps, 0, true) * (1 - springAt(frame, fps, cue.to - 8, true));
	const lift = springAt(local, fps, 0);
	const color = SCENES[currentSceneIndex(cue.from)].color;
	const words = cue.text.split(' ');

	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				bottom: 70,
				display: 'flex',
				justifyContent: 'center',
				opacity: box,
				transform: `translateY(${(1 - lift) * 24}px)`,
			}}
		>
			<div
				style={{
					maxWidth: 1500,
					display: 'flex',
					alignItems: 'center',
					gap: 18,
					padding: '16px 30px',
					borderRadius: 20,
					background: 'rgba(11, 15, 25, 0.82)',
					border: `1px solid ${COLORS.border}`,
					boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
				}}
			>
				<div
					style={{
						width: 6,
						alignSelf: 'stretch',
						borderRadius: 3,
						background: color,
						boxShadow: `0 0 16px ${alpha(color, 0.8)}`,
					}}
				/>
				<div style={{fontFamily: FONTS.body, fontWeight: 500, fontSize: 30, lineHeight: 1.35, color: COLORS.text}}>
					{words.map((w, i) => {
						const p = springAt(local, fps, i * 1.4, true);
						return (
							<span
								key={i}
								style={{
									display: 'inline-block',
									opacity: p,
									transform: `translateY(${(1 - p) * 10}px)`,
									marginRight: i === words.length - 1 ? 0 : '0.28em',
								}}
							>
								{w}
							</span>
						);
					})}
				</div>
			</div>
		</div>
	);
};

const ProgressBar: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const enter = springAt(frame, fps, 6, true);
	const exit = springAt(frame, fps, TOTAL_FRAMES - 24, true);
	const gap = 8;

	return (
		<div
			style={{
				position: 'absolute',
				left: 120,
				right: 120,
				bottom: 34,
				display: 'flex',
				gap,
				opacity: enter * (1 - exit),
			}}
		>
			{SCENES.map((s) => {
				const progress = Math.min(1, Math.max(0, (frame - s.from) / s.duration));
				return (
					<div
						key={s.id}
						style={{
							flex: s.duration,
							height: 6,
							borderRadius: 3,
							background: 'rgba(148,163,184,0.16)',
							overflow: 'hidden',
						}}
					>
						<div
							style={{
								width: `${progress * 100}%`,
								height: '100%',
								borderRadius: 3,
								background: `linear-gradient(90deg, ${alpha(s.color, 0.7)}, ${s.color})`,
								boxShadow: `0 0 12px ${alpha(s.color, 0.8)}`,
							}}
						/>
					</div>
				);
			})}
		</div>
	);
};

export const Hud: React.FC = () => (
	<AbsoluteFill style={{pointerEvents: 'none'}}>
		<TopBar />
		<Captions />
		<ProgressBar />
	</AbsoluteFill>
);
