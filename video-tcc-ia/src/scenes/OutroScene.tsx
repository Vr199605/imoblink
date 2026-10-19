import {Award, GraduationCap, Quote, ShieldCheck, SpellCheck} from 'lucide-react';
import {random, useCurrentFrame, useVideoConfig} from 'remotion';
import {mix, springAt} from '../anim';
import {Reveal} from '../components/Reveal';
import {SceneShell} from '../components/SceneShell';
import {COLORS, FONTS, alpha, gradientText} from '../theme';

type SceneProps = {duration: number};

const PARTICLES = Array.from({length: 26}, (_, i) => ({
	x: random(`px-${i}`) * 900 - 450,
	y: random(`py-${i}`) * 420 - 210,
	size: 4 + random(`ps-${i}`) * 6,
	color: [COLORS.purple, COLORS.cyan, COLORS.emerald, '#FACC15'][i % 4],
	phase: random(`ph-${i}`) * Math.PI * 2,
}));

const Diploma: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = springAt(frame, fps, 8);
	const o = springAt(frame, fps, 8, true);
	const sign = springAt(frame, fps, 40, true);
	const seal = springAt(frame, fps, 62);
	const float = Math.sin(frame / 20) * 6;

	return (
		<div
			style={{
				position: 'absolute',
				left: 960 - 330,
				top: 150,
				width: 660,
				height: 340,
				opacity: o,
				transform: `translateY(${(1 - p) * 120 + float}px) rotate(${(1 - p) * -8}deg) scale(${mix(p, 0.7, 1)})`,
			}}
		>
			{PARTICLES.map((pt, i) => {
				const twinkle = (Math.sin(frame / 9 + pt.phase) + 1) / 2;
				const appear = springAt(frame, fps, 30 + (i % 8) * 4, true);
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: 330 + pt.x * mix(appear, 0.4, 1),
							top: 170 + pt.y * mix(appear, 0.4, 1) - frame * 0.15,
							width: pt.size,
							height: pt.size,
							borderRadius: '50%',
							background: pt.color,
							opacity: appear * (0.25 + twinkle * 0.6),
							boxShadow: `0 0 10px ${pt.color}`,
						}}
					/>
				);
			})}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					borderRadius: 26,
					padding: 10,
					boxSizing: 'border-box',
					background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.cyan}, ${COLORS.emerald})`,
					boxShadow: `0 40px 90px rgba(0,0,0,0.5), 0 0 80px ${alpha(COLORS.purple, 0.35)}`,
				}}
			>
				<div
					style={{
						width: '100%',
						height: '100%',
						borderRadius: 18,
						background: 'linear-gradient(160deg, #FFFFFF, #E9EEF5)',
						position: 'relative',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						paddingTop: 30,
						boxSizing: 'border-box',
					}}
				>
					<GraduationCap size={54} color={COLORS.purple} strokeWidth={2} />
					<div
						style={{
							fontFamily: FONTS.body,
							fontWeight: 700,
							fontSize: 17,
							letterSpacing: 5,
							color: COLORS.subtle,
							marginTop: 10,
						}}
					>
						CERTIFICADO DE CONCLUSÃO
					</div>
					<div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 34, color: '#0F172A', marginTop: 6}}>
						Trabalho de Conclusão de Curso
					</div>
					<div style={{fontFamily: FONTS.body, fontSize: 19, color: '#475569', marginTop: 6}}>
						Autoria: <b style={{color: COLORS.purple}}>você</b> · Apoio: IA, com transparência
					</div>
					<svg width={300} height={60} style={{position: 'absolute', left: 60, bottom: 26}}>
						<path
							d="M10 40 C 40 5, 60 55, 90 30 S 140 10, 160 35 S 220 50, 290 22"
							fill="none"
							stroke="#1E293B"
							strokeWidth={3}
							strokeLinecap="round"
							pathLength={1}
							strokeDasharray={1}
							strokeDashoffset={1 - sign}
						/>
						<line x1={10} y1={54} x2={290} y2={54} stroke="#CBD5E1" strokeWidth={2} />
					</svg>
					<div
						style={{
							position: 'absolute',
							right: 44,
							bottom: -26,
							width: 104,
							height: 104,
							transform: `scale(${seal}) rotate(${(1 - seal) * 90}deg)`,
						}}
					>
						<div
							style={{
								position: 'absolute',
								left: 22,
								top: 70,
								width: 24,
								height: 56,
								background: COLORS.emerald,
								transform: 'rotate(18deg)',
								borderRadius: 4,
							}}
						/>
						<div
							style={{
								position: 'absolute',
								right: 22,
								top: 70,
								width: 24,
								height: 56,
								background: '#059669',
								transform: 'rotate(-18deg)',
								borderRadius: 4,
							}}
						/>
						<div
							style={{
								position: 'absolute',
								inset: 0,
								borderRadius: '50%',
								background: `radial-gradient(circle at 35% 30%, #34D399, ${COLORS.emerald} 60%, #047857)`,
								border: '4px solid #fff',
								boxShadow: `0 10px 30px ${alpha(COLORS.emerald, 0.6)}`,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Award size={52} color="#fff" strokeWidth={2} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const PILLARS = [
	{icon: ShieldCheck, text: 'Verifique sempre', color: COLORS.emerald},
	{icon: Quote, text: 'Cite com transparência', color: COLORS.cyan},
	{icon: SpellCheck, text: 'Revise com olhar crítico', color: COLORS.purple},
];

export const OutroScene: React.FC<SceneProps> = ({duration}) => (
	<SceneShell duration={duration}>
		<Diploma />
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				top: 540,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				fontFamily: FONTS.heading,
				letterSpacing: -1.5,
			}}
		>
			<div style={{display: 'flex', gap: 26, fontWeight: 700, fontSize: 62, color: COLORS.text}}>
				<Reveal delay={70} distance={50}>
					A tese é sua.
				</Reveal>
				<Reveal delay={86} distance={50}>
					A autoria é sua.
				</Reveal>
			</div>
			<Reveal delay={120} from="scale" style={{marginTop: 6}}>
				<div style={{fontWeight: 800, fontSize: 80, ...gradientText(COLORS.purple, COLORS.cyan)}}>
					A IA é apenas a alavanca.
				</div>
			</Reveal>
			<div style={{display: 'flex', gap: 24, marginTop: 34, letterSpacing: 0}}>
				{PILLARS.map((pl, i) => {
					const Icon = pl.icon;
					return (
						<Reveal key={pl.text} delay={160 + i * 10} distance={40}>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 12,
									padding: '12px 24px',
									borderRadius: 999,
									background: alpha(pl.color, 0.12),
									border: `1.5px solid ${alpha(pl.color, 0.5)}`,
									fontFamily: FONTS.body,
									fontWeight: 600,
									fontSize: 24,
									color: COLORS.text,
								}}
							>
								<Icon size={24} color={pl.color} />
								{pl.text}
							</div>
						</Reveal>
					);
				})}
			</div>
		</div>
	</SceneShell>
);
