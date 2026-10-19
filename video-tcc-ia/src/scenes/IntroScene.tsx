import {Lightbulb, Quote, Sparkles} from 'lucide-react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {mix, springAt} from '../anim';
import {Reveal} from '../components/Reveal';
import {SceneShell} from '../components/SceneShell';
import {COLORS, FONTS, alpha, gradientText} from '../theme';

type SceneProps = {duration: number};

const TITLE_LINES: {words: string[]; gradient?: boolean}[] = [
	{words: ['TCC', 'sem', 'Pânico:']},
	{words: ['IA', 'como', 'Sua'], gradient: true},
	{words: ['Assistente', 'Acadêmica'], gradient: true},
];

const Title: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	let index = 0;

	return (
		<div style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 84, lineHeight: 1.08, letterSpacing: -2}}>
			{TITLE_LINES.map((line, li) => (
				<div key={li} style={{display: 'flex', gap: 22}}>
					{line.words.map((w) => {
						const delay = 12 + index++ * 4;
						const p = springAt(frame, fps, delay);
						const o = springAt(frame, fps, delay, true);
						return (
							<span
								key={w}
								style={{
									display: 'inline-block',
									opacity: o,
									transform: `translateY(${(1 - p) * 70}px) rotate(${(1 - p) * 6}deg)`,
									...(line.gradient
										? gradientText(COLORS.purple, COLORS.cyan)
										: {color: COLORS.text}),
								}}
							>
								{w}
							</span>
						);
					})}
				</div>
			))}
		</div>
	);
};

const Paper: React.FC<{i: number; total: number}> = ({i, total}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const delay = 20 + i * 7;
	const p = springAt(frame, fps, delay);
	const o = springAt(frame, fps, delay, true);
	const rotations = [-9, 5, -3, 7, -1];
	const accent = [COLORS.purple, COLORS.cyan, COLORS.emerald, COLORS.coral, COLORS.purple][i];
	const isTop = i === total - 1;

	return (
		<div
			style={{
				position: 'absolute',
				left: 30 + (i % 2) * 14,
				bottom: 20 + i * 16,
				width: 230,
				height: 290,
				borderRadius: 14,
				background: 'linear-gradient(160deg, #F8FAFC, #E2E8F0)',
				boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
				opacity: o,
				transform: `translateY(${(1 - p) * -420}px) rotate(${rotations[i] * p}deg)`,
				padding: 22,
				boxSizing: 'border-box',
			}}
		>
			<div style={{height: 10, width: 90, borderRadius: 5, background: accent}} />
			{isTop ? (
				<div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 19, color: '#0F172A', marginTop: 14}}>
					Artigo Científico
				</div>
			) : null}
			{[0.95, 0.85, 0.92, 0.7, 0.88, 0.6, 0.8].map((w, k) => (
				<div
					key={k}
					style={{height: 8, width: `${w * 100}%`, borderRadius: 4, background: '#CBD5E1', marginTop: 14}}
				/>
			))}
		</div>
	);
};

const Hourglass: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const enter = springAt(frame, fps, 30);
	const sand = interpolate(frame, [40, 330], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const topLevel = 70 * (1 - sand);
	const bottomLevel = 70 * sand;

	return (
		<div
			style={{
				position: 'absolute',
				left: 40,
				top: 10,
				transform: `scale(${enter}) rotate(${Math.sin(frame / 18) * 4}deg)`,
				filter: `drop-shadow(0 0 24px ${alpha(COLORS.coral, 0.45)})`,
			}}
		>
			<svg width={150} height={210} viewBox="0 0 150 210">
				<defs>
					<clipPath id="glass-top">
						<path d="M30 22 L120 22 L120 40 Q120 70 80 100 L70 100 Q30 70 30 40 Z" />
					</clipPath>
					<clipPath id="glass-bottom">
						<path d="M70 110 L80 110 Q120 140 120 170 L120 188 L30 188 L30 170 Q30 140 70 110 Z" />
					</clipPath>
				</defs>
				<rect x={14} y={6} width={122} height={16} rx={8} fill={COLORS.coral} />
				<rect x={14} y={188} width={122} height={16} rx={8} fill={COLORS.coral} />
				<path
					d="M30 22 L120 22 L120 40 Q120 70 80 100 L80 110 Q120 140 120 170 L120 188 L30 188 L30 170 Q30 140 70 110 L70 100 Q30 70 30 40 Z"
					fill="rgba(248,250,252,0.08)"
					stroke="rgba(248,250,252,0.7)"
					strokeWidth={3}
				/>
				<rect x={0} y={100 - topLevel} width={150} height={topLevel} fill="#FDBA74" clipPath="url(#glass-top)" />
				<rect x={0} y={188 - bottomLevel} width={150} height={bottomLevel} fill="#FDBA74" clipPath="url(#glass-bottom)" />
				{sand < 1 ? (
					<line
						x1={75}
						y1={100}
						x2={75}
						y2={188 - bottomLevel}
						stroke="#FDBA74"
						strokeWidth={3}
						strokeDasharray="6 6"
						strokeDashoffset={-frame * 2}
					/>
				) : null}
			</svg>
		</div>
	);
};

const IDEAS = ['Tema', 'Problema', 'Objetivos', 'Hipótese'];
const SCATTER = [
	{x: 250, y: 210, r: -14},
	{x: 470, y: 40, r: 10},
	{x: 230, y: 70, r: 8},
	{x: 440, y: 230, r: -9},
];

const IdeaChips: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const organize = springAt(frame, fps, 150);

	return (
		<>
			{IDEAS.map((idea, i) => {
				const enter = springAt(frame, fps, 70 + i * 10);
				const o = springAt(frame, fps, 70 + i * 10, true);
				const target = {x: 330, y: 20 + i * 72, r: 0};
				const x = mix(organize, SCATTER[i].x, target.x);
				const y = mix(organize, SCATTER[i].y, target.y);
				const r = mix(organize, SCATTER[i].r, target.r);
				const color = [COLORS.purple, COLORS.cyan, COLORS.emerald, COLORS.coral][i];
				return (
					<div
						key={idea}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							width: mix(organize, 170, 300),
							opacity: o,
							transform: `scale(${enter}) rotate(${r}deg)`,
							display: 'flex',
							alignItems: 'center',
							gap: 12,
							padding: '12px 18px',
							borderRadius: 16,
							background: COLORS.surface,
							border: `1.5px solid ${alpha(color, 0.55)}`,
							boxShadow: `0 10px 30px rgba(0,0,0,0.3), 0 0 22px ${alpha(color, 0.18)}`,
							fontFamily: FONTS.heading,
							fontWeight: 600,
							fontSize: 24,
							color: COLORS.text,
							boxSizing: 'border-box',
						}}
					>
						<div
							style={{
								width: 30,
								height: 30,
								borderRadius: 9,
								background: color,
								fontSize: 17,
								fontWeight: 700,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								opacity: organize,
								transform: `scale(${organize})`,
							}}
						>
							{i + 1}
						</div>
						{idea}
					</div>
				);
			})}
		</>
	);
};

const Student: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = springAt(frame, fps, 45);
	const o = springAt(frame, fps, 45, true);
	const bulb = springAt(frame, fps, 140);
	const breathe = Math.sin(frame / 14) * 2;

	return (
		<div style={{position: 'absolute', left: 300, top: 330, opacity: o, transform: `translateY(${(1 - p) * 80}px)`}}>
			<div
				style={{
					position: 'absolute',
					left: 130,
					top: -10,
					transform: `scale(${bulb}) translateY(${Math.sin(frame / 12) * 4}px)`,
					filter: `drop-shadow(0 0 18px ${alpha('#FACC15', 0.8)})`,
				}}
			>
				<Lightbulb size={64} color="#FACC15" strokeWidth={2} />
			</div>
			<svg width={360} height={330} viewBox="0 0 360 330">
				{/* Corpo */}
				<path
					d={`M95 ${300 + breathe} Q95 ${180 + breathe} 170 ${175 + breathe} Q245 ${180 + breathe} 245 ${300 + breathe} Z`}
					fill={COLORS.purple}
				/>
				<circle cx={170} cy={130 + breathe} r={42} fill="#FCD9B6" />
				<path d={`M128 ${125 + breathe} Q130 ${80 + breathe} 172 ${84 + breathe} Q212 ${86 + breathe} 212 ${122 + breathe} Q190 ${104 + breathe} 150 ${110 + breathe} Z`} fill="#1E293B" />
				{/* Notebook */}
				<rect x={150} y={232} width={170} height={10} rx={5} fill="#94A3B8" />
				<path d="M175 232 L200 150 L330 150 L305 232 Z" fill="#1E293B" stroke={COLORS.cyan} strokeWidth={3} />
				<circle cx={252} cy={190} r={8} fill={COLORS.cyan} opacity={0.6 + Math.sin(frame / 10) * 0.3} />
				{/* Mesa */}
				<rect x={20} y={242} width={330} height={14} rx={7} fill="#334155" />
				<rect x={50} y={256} width={12} height={70} rx={6} fill="#334155" />
				<rect x={310} y={256} width={12} height={70} rx={6} fill="#334155" />
			</svg>
		</div>
	);
};

export const IntroScene: React.FC<SceneProps> = ({duration}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const counter = Math.round(48 * springAt(frame, fps, 60, true));

	return (
		<SceneShell duration={duration}>
			<div style={{position: 'absolute', left: 120, top: 190, width: 1000}}>
				<Reveal delay={4} from="left" distance={40}>
					<div
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 10,
							padding: '10px 20px',
							borderRadius: 999,
							background: alpha(COLORS.purple, 0.14),
							border: `1.5px solid ${alpha(COLORS.purple, 0.45)}`,
							fontFamily: FONTS.body,
							fontWeight: 600,
							fontSize: 22,
							color: '#C4B5FD',
							marginBottom: 30,
						}}
					>
						<Sparkles size={22} color="#C4B5FD" />
						Guia prático · Ética acadêmica
					</div>
				</Reveal>
				<Title />
				<Reveal delay={200} from="up" distance={50} style={{marginTop: 48}}>
					<div
						style={{
							display: 'flex',
							gap: 22,
							alignItems: 'flex-start',
							width: 900,
							padding: '26px 32px',
							borderRadius: 24,
							background: COLORS.surface,
							border: `1px solid ${COLORS.border}`,
							boxShadow: `0 24px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)`,
						}}
					>
						<div
							style={{
								flexShrink: 0,
								width: 56,
								height: 56,
								borderRadius: 16,
								background: `linear-gradient(135deg, ${COLORS.emerald}, ${COLORS.cyan})`,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Quote size={28} color="#fff" />
						</div>
						<div style={{fontFamily: FONTS.body, fontSize: 32, lineHeight: 1.4, color: COLORS.text}}>
							A IA <b style={{color: COLORS.coral}}>não substitui</b> a autoria; ela{' '}
							<b style={{color: COLORS.emerald}}>potencializa</b> o rigor da pesquisa.
						</div>
					</div>
				</Reveal>
			</div>

			<div style={{position: 'absolute', left: 1160, top: 170, width: 660, height: 680}}>
				<div
					style={{
						position: 'absolute',
						inset: 40,
						borderRadius: '50%',
						background: `radial-gradient(circle, ${alpha(COLORS.purple, 0.25)}, transparent 70%)`,
					}}
				/>
				<Hourglass />
				<div style={{position: 'absolute', left: 0, top: 330, width: 300, height: 340}}>
					{[0, 1, 2, 3, 4].map((i) => (
						<Paper key={i} i={i} total={5} />
					))}
					<Reveal delay={60} from="scale" style={{position: 'absolute', left: 150, top: -64}}>
						<div
							style={{
								padding: '8px 16px',
								borderRadius: 999,
								background: COLORS.coral,
								fontFamily: FONTS.heading,
								fontWeight: 700,
								fontSize: 22,
								color: '#fff',
								whiteSpace: 'nowrap',
								boxShadow: `0 10px 26px ${alpha(COLORS.coral, 0.5)}`,
							}}
						>
							+{counter} artigos
						</div>
					</Reveal>
				</div>
				<Student />
				<IdeaChips />
			</div>
		</SceneShell>
	);
};
