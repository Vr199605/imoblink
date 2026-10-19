import {AlertTriangle, Ban, Bot, SearchX, ShieldCheck, XCircle} from 'lucide-react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {mix, springAt} from '../anim';
import {Reveal} from '../components/Reveal';
import {SceneShell} from '../components/SceneShell';
import {COLORS, FONTS, alpha, gradientText} from '../theme';

type SceneProps = {duration: number};

const NEVER = [
	{title: 'Gerar dados falsos', desc: 'Inventar resultados, entrevistas ou estatísticas.'},
	{title: 'Copiar sem checar fontes primárias', desc: 'Toda afirmação precisa de origem verificável.'},
	{title: 'Plagiar ou ocultar o uso da IA', desc: 'Paráfrase automática não é autoria.'},
];

const RULE_DELAY = 262;

/** Faixa de alerta que atravessa a tela na abertura da cena. */
const AlertSweep: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = springAt(frame, fps, 0, true);
	const glow = 1 - springAt(frame, fps, 16, true);

	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div
				style={{
					position: 'absolute',
					top: 420,
					left: mix(p, -2600, 2200),
					width: 2400,
					height: 120,
					transform: 'rotate(-6deg)',
					backgroundImage: `repeating-linear-gradient(45deg, ${COLORS.coral} 0 40px, #111827 40px 80px)`,
					opacity: 0.9 * glow,
					boxShadow: `0 0 80px ${alpha(COLORS.coral, 0.6)}`,
				}}
			/>
			<AbsoluteFill style={{boxShadow: `inset 0 0 ${200 * glow}px ${alpha(COLORS.coral, 0.55 * glow)}`}} />
		</AbsoluteFill>
	);
};

const NeverItem: React.FC<{item: (typeof NEVER)[number]; index: number}> = ({item, index}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const delay = 60 + index * 22;
	const strike = springAt(frame, fps, delay + 26, true);
	const iconPop = springAt(frame, fps, delay + 6);

	return (
		<Reveal delay={delay} from="left" distance={80}>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 22,
					padding: '18px 24px',
					borderRadius: 20,
					background: alpha(COLORS.coral, 0.07),
					border: `1px solid ${alpha(COLORS.coral, 0.25)}`,
					marginBottom: 16,
				}}
			>
				<XCircle size={44} color={COLORS.coral} strokeWidth={2.2} style={{flexShrink: 0, transform: `scale(${iconPop})`}} />
				<div>
					<div
						style={{
							position: 'relative',
							display: 'inline-block',
							fontFamily: FONTS.heading,
							fontWeight: 600,
							fontSize: 30,
							color: COLORS.text,
						}}
					>
						{item.title}
						<div
							style={{
								position: 'absolute',
								left: -4,
								top: '54%',
								height: 4,
								borderRadius: 2,
								width: `calc((100% + 8px) * ${strike})`,
								background: COLORS.coral,
								boxShadow: `0 0 12px ${alpha(COLORS.coral, 0.8)}`,
							}}
						/>
					</div>
					<div style={{fontFamily: FONTS.body, fontSize: 22, color: COLORS.muted, marginTop: 4}}>{item.desc}</div>
				</div>
			</div>
		</Reveal>
	);
};

const HallucinationCard: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const scan = springAt(frame, fps, 150, true);
	const stamp = springAt(frame, fps, 180);
	const stampO = springAt(frame, fps, 180, true);
	const scanning = frame > 150 && scan < 0.999;

	return (
		<Reveal delay={110} from="right" distance={100}>
			<div
				style={{
					position: 'relative',
					width: 780,
					padding: 30,
					boxSizing: 'border-box',
					borderRadius: 28,
					background: COLORS.surface,
					border: `1px solid ${COLORS.border}`,
					boxShadow: '0 30px 70px rgba(0,0,0,0.4)',
					overflow: 'hidden',
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 12,
						fontFamily: FONTS.body,
						fontWeight: 600,
						fontSize: 18,
						letterSpacing: 2,
						color: COLORS.muted,
						textTransform: 'uppercase',
					}}
				>
					<Bot size={24} color={COLORS.cyan} />
					Exemplo de alucinação
				</div>
				<div
					style={{
						marginTop: 18,
						padding: '18px 22px',
						borderRadius: '18px 18px 18px 4px',
						background: alpha(COLORS.cyan, 0.1),
						border: `1px solid ${alpha(COLORS.cyan, 0.3)}`,
						fontFamily: FONTS.body,
						fontSize: 24,
						lineHeight: 1.45,
						color: '#E2E8F0',
					}}
				>
					“Segundo <b>Fictício (2019)</b>, 87% dos estudantes melhoram suas notas usando IA.”
				</div>
				<div
					style={{
						marginTop: 16,
						padding: '16px 20px',
						borderRadius: 14,
						background: 'rgba(11,15,25,0.75)',
						border: `1px dashed ${COLORS.subtle}`,
						fontFamily: FONTS.body,
						fontSize: 19,
						lineHeight: 1.5,
						color: COLORS.muted,
					}}
				>
					FICTÍCIO, A. B. <i>Aprendizagem e algoritmos</i>. Revista Imaginária de Educação, v. 12, 2019.
				</div>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 10,
						marginTop: 16,
						fontFamily: FONTS.body,
						fontSize: 19,
						color: COLORS.coral,
						opacity: stampO,
					}}
				>
					<SearchX size={22} color={COLORS.coral} />
					Não encontrada no Google Acadêmico, SciELO ou Periódicos CAPES.
				</div>

				{/* Linha de verificação */}
				<div
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						top: mix(scan, 60, 330),
						height: 3,
						background: COLORS.cyan,
						boxShadow: `0 0 24px 6px ${alpha(COLORS.cyan, 0.6)}`,
						opacity: scanning ? 1 : 0,
					}}
				/>
				{/* Carimbo */}
				<div
					style={{
						position: 'absolute',
						right: 34,
						top: 104,
						padding: '10px 22px',
						border: `4px solid ${COLORS.coral}`,
						borderRadius: 12,
						fontFamily: FONTS.heading,
						fontWeight: 800,
						fontSize: 30,
						letterSpacing: 2,
						color: COLORS.coral,
						background: 'rgba(11,15,25,0.85)',
						opacity: stampO,
						transform: `rotate(-10deg) scale(${mix(stamp, 2.2, 1)})`,
						boxShadow: `0 0 30px ${alpha(COLORS.coral, 0.4)}`,
					}}
				>
					REFERÊNCIA INEXISTENTE
				</div>
			</div>
		</Reveal>
	);
};

const GoldenRule: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = springAt(frame, fps, RULE_DELAY);
	const o = springAt(frame, fps, RULE_DELAY, true);
	const shine = springAt(frame, fps, RULE_DELAY + 18, true);

	return (
		<div
			style={{
				position: 'absolute',
				left: 120,
				right: 120,
				top: 752,
				height: 124,
				borderRadius: 26,
				display: 'flex',
				alignItems: 'center',
				gap: 28,
				padding: '0 40px',
				boxSizing: 'border-box',
				background: `linear-gradient(90deg, ${alpha(COLORS.emerald, 0.22)}, ${alpha(COLORS.emerald, 0.06)})`,
				border: `2px solid ${alpha(COLORS.emerald, 0.7)}`,
				boxShadow: `0 0 60px ${alpha(COLORS.emerald, 0.35)}, 0 24px 60px rgba(0,0,0,0.4)`,
				opacity: o,
				transform: `translateY(${(1 - p) * 120}px) scale(${mix(p, 0.9, 1)})`,
				overflow: 'hidden',
			}}
		>
			<div
				style={{
					position: 'absolute',
					top: 0,
					bottom: 0,
					width: 220,
					left: mix(shine, -300, 1900),
					background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.18), transparent)',
				}}
			/>
			<div
				style={{
					width: 76,
					height: 76,
					borderRadius: 22,
					background: COLORS.emerald,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					boxShadow: `0 0 30px ${alpha(COLORS.emerald, 0.7)}`,
					flexShrink: 0,
				}}
			>
				<ShieldCheck size={44} color="#fff" strokeWidth={2.2} />
			</div>
			<div>
				<div
					style={{
						fontFamily: FONTS.body,
						fontWeight: 700,
						fontSize: 20,
						letterSpacing: 3,
						color: '#6EE7B7',
					}}
				>
					REGRA DE OURO
				</div>
				<div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 46, color: COLORS.text, letterSpacing: -0.5}}>
					Verificação Humana <span style={{color: COLORS.emerald}}>+</span> Citação Transparente
				</div>
			</div>
		</div>
	);
};

export const EthicalGuardrailsScene: React.FC<SceneProps> = ({duration}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const pulse = (frame % 45) / 45;
	const iconPop = springAt(frame, fps, 14);
	const settle = springAt(frame, fps, RULE_DELAY, true);

	return (
		<SceneShell duration={duration}>
			<div style={{position: 'absolute', left: 120, top: 140, display: 'flex', alignItems: 'center', gap: 30}}>
				<div style={{position: 'relative', width: 104, height: 104, transform: `scale(${iconPop})`}}>
					<div
						style={{
							position: 'absolute',
							inset: 0,
							borderRadius: '50%',
							border: `3px solid ${COLORS.coral}`,
							transform: `scale(${1 + pulse * 0.35})`,
							opacity: 1 - pulse,
						}}
					/>
					<div
						style={{
							position: 'absolute',
							inset: 0,
							borderRadius: '50%',
							background: alpha(COLORS.coral, 0.18),
							border: `2px solid ${alpha(COLORS.coral, 0.7)}`,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<AlertTriangle size={54} color={COLORS.coral} strokeWidth={2.2} />
					</div>
				</div>
				<Reveal delay={18} from="left" distance={60}>
					<div style={{fontFamily: FONTS.heading, fontWeight: 800, fontSize: 66, letterSpacing: -1.5, lineHeight: 1.05}}>
						<span style={gradientText(COLORS.coral, '#FB7185')}>Linha Vermelha Ética</span>
						<span style={{color: COLORS.text}}> & Alucinações</span>
					</div>
					<div style={{fontFamily: FONTS.body, fontSize: 26, color: COLORS.muted, marginTop: 8}}>
						A responsabilidade acadêmica é sempre de quem assina o trabalho.
					</div>
				</Reveal>
			</div>

			<div style={{position: 'absolute', left: 120, top: 318, width: 860, opacity: 1 - settle * 0.35}}>
				<Reveal delay={44} from="up" distance={30}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 12,
							fontFamily: FONTS.body,
							fontWeight: 700,
							fontSize: 22,
							letterSpacing: 3,
							color: COLORS.coral,
							marginBottom: 16,
						}}
					>
						<Ban size={26} color={COLORS.coral} />O QUE NUNCA FAZER
					</div>
				</Reveal>
				{NEVER.map((item, i) => (
					<NeverItem key={item.title} item={item} index={i} />
				))}
			</div>

			<div style={{position: 'absolute', left: 1020, top: 318, opacity: 1 - settle * 0.35}}>
				<HallucinationCard />
			</div>

			<GoldenRule />
			<AlertSweep />
		</SceneShell>
	);
};
