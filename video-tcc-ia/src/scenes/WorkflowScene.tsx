import {BookOpenCheck, FileCheck2, HelpCircle, MessageSquareCode, RotateCcw, Sparkles, User} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {mix, springAt} from '../anim';
import {Reveal} from '../components/Reveal';
import {SceneHeader} from '../components/SceneHeader';
import {SceneShell} from '../components/SceneShell';
import {COLORS, FONTS, alpha} from '../theme';

type SceneProps = {duration: number};

type Step = {
	icon: LucideIcon;
	label: string;
	desc: string;
	color: string;
	actor: 'Você' | 'IA apoia';
};

const STEPS: Step[] = [
	{icon: HelpCircle, label: 'Pergunta de Pesquisa', desc: 'Defina recorte e objetivo', color: COLORS.purple, actor: 'Você'},
	{icon: MessageSquareCode, label: 'Prompt Estruturado', desc: 'Contexto + tarefa + formato + limites', color: '#6366F1', actor: 'Você'},
	{icon: Sparkles, label: 'IA Analisa & Sugere', desc: 'Rascunhos, comparações e sugestões', color: COLORS.cyan, actor: 'IA apoia'},
	{icon: BookOpenCheck, label: 'Leitura Crítica do Aluno', desc: 'Confronte com as fontes primárias', color: COLORS.coral, actor: 'Você'},
	{icon: FileCheck2, label: 'Texto Original com Referências Reais', desc: 'Sua voz + citações verificadas', color: COLORS.emerald, actor: 'Você'},
];

const NODE_W = 288;
const NODE_GAP = 60;
const LEFT = 120;
const TOP = 360;
const NODE_H = 345;
const nodeDelay = (i: number) => 24 + i * 26;
const TRAVEL_START = 175;
const HOP = 34;
const centerX = (i: number) => LEFT + i * (NODE_W + NODE_GAP) + NODE_W / 2;

const Arrow: React.FC<{index: number}> = ({index}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const draw = springAt(frame, fps, nodeDelay(index) + 16, true);
	const head = springAt(frame, fps, nodeDelay(index) + 24);
	const x = LEFT + index * (NODE_W + NODE_GAP) + NODE_W - 6;
	const len = NODE_GAP - 2;

	return (
		<svg
			width={NODE_GAP + 12}
			height={40}
			style={{position: 'absolute', left: x, top: TOP + 72, overflow: 'visible'}}
		>
			<line
				x1={4}
				y1={20}
				x2={4 + len}
				y2={20}
				stroke={COLORS.muted}
				strokeWidth={4}
				strokeLinecap="round"
				strokeDasharray={len}
				strokeDashoffset={len * (1 - draw)}
			/>
			<path
				d={`M${len - 8} 10 L${len + 6} 20 L${len - 8} 30`}
				fill="none"
				stroke={COLORS.text}
				strokeWidth={4}
				strokeLinecap="round"
				strokeLinejoin="round"
				opacity={head}
				transform={`translate(${(1 - head) * -16} 0)`}
			/>
		</svg>
	);
};

const Node: React.FC<{step: Step; index: number; active: number}> = ({step, index, active}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = springAt(frame, fps, nodeDelay(index));
	const o = springAt(frame, fps, nodeDelay(index), true);
	const Icon = step.icon;
	const isAi = step.actor === 'IA apoia';

	return (
		<div
			style={{
				position: 'absolute',
				left: LEFT + index * (NODE_W + NODE_GAP),
				top: TOP,
				width: NODE_W,
				height: NODE_H,
				boxSizing: 'border-box',
				padding: '28px 24px',
				borderRadius: 26,
				background: `linear-gradient(180deg, ${alpha(step.color, 0.1 + active * 0.12)}, ${COLORS.surface} 60%)`,
				border: `1.5px solid ${alpha(step.color, 0.3 + active * 0.6)}`,
				boxShadow: `0 26px 60px rgba(0,0,0,0.4), 0 0 ${50 * active}px ${alpha(step.color, 0.4 * active)}`,
				opacity: o,
				transform: `translateY(${(1 - p) * 120 - active * 10}px) scale(${mix(p, 0.8, 1)})`,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				textAlign: 'center',
			}}
		>
			<div
				style={{
					width: 92,
					height: 92,
					borderRadius: '50%',
					background: `linear-gradient(135deg, ${step.color}, ${alpha(step.color, 0.55)})`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					boxShadow: `0 0 ${20 + active * 30}px ${alpha(step.color, 0.6)}`,
					transform: `scale(${mix(active, 1, 1.1)})`,
				}}
			>
				<Icon size={46} color="#fff" strokeWidth={2} />
			</div>
			<div
				style={{
					fontFamily: FONTS.body,
					fontWeight: 700,
					fontSize: 16,
					letterSpacing: 2.5,
					color: step.color,
					marginTop: 18,
				}}
			>
				ETAPA {index + 1}
			</div>
			<div
				style={{
					fontFamily: FONTS.heading,
					fontWeight: 700,
					fontSize: 24,
					lineHeight: 1.2,
					color: COLORS.text,
					marginTop: 6,
					minHeight: 64,
				}}
			>
				{step.label}
			</div>
			<div style={{fontFamily: FONTS.body, fontSize: 19, lineHeight: 1.35, color: COLORS.muted, marginTop: 8}}>
				{step.desc}
			</div>
			<div
				style={{
					position: 'absolute',
					bottom: -18,
					display: 'flex',
					alignItems: 'center',
					gap: 8,
					padding: '6px 16px',
					borderRadius: 999,
					background: isAi ? COLORS.cyan : COLORS.surfaceSolid,
					border: `1.5px solid ${isAi ? COLORS.cyan : alpha(COLORS.purple, 0.7)}`,
					fontFamily: FONTS.body,
					fontWeight: 600,
					fontSize: 17,
					color: isAi ? '#06222A' : '#DDD6FE',
				}}
			>
				{isAi ? <Sparkles size={16} color="#06222A" /> : <User size={16} color="#DDD6FE" />}
				{step.actor}
			</div>
		</div>
	);
};

export const WorkflowScene: React.FC<SceneProps> = ({duration}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Pulso que percorre o fluxo, salto a salto, com mola.
	const hops = STEPS.slice(1).map((_, i) => springAt(frame, fps, TRAVEL_START + i * HOP));
	const progress = hops.reduce((acc, h) => acc + h, 0);
	const dotX = mix(progress / (STEPS.length - 1), centerX(0), centerX(STEPS.length - 1));
	const dotO = springAt(frame, fps, TRAVEL_START - 12, true);
	const activeOf = (i: number) => Math.max(0, 1 - Math.abs(progress - i) * 1.4) * dotO;
	const trackY = TOP + NODE_H + 66;
	const done = springAt(frame, fps, TRAVEL_START + (STEPS.length - 1) * HOP + 6, true);

	return (
		<SceneShell duration={duration}>
			<SceneHeader
				index="04"
				color={COLORS.purple}
				title="O Fluxo Ideal de Trabalho"
				subtitle="A IA entra em uma etapa. Todas as decisões continuam sendo suas."
				delay={6}
			/>
			{STEPS.map((s, i) => (
				<Node key={s.label} step={s} index={i} active={Math.max(activeOf(i), i === STEPS.length - 1 ? done : 0)} />
			))}
			{STEPS.slice(0, -1).map((_, i) => (
				<Arrow key={i} index={i} />
			))}

			{/* Trilho do pulso */}
			<div
				style={{
					position: 'absolute',
					left: centerX(0),
					width: centerX(STEPS.length - 1) - centerX(0),
					top: trackY,
					height: 4,
					borderRadius: 2,
					background: 'rgba(148,163,184,0.18)',
					opacity: dotO,
				}}
			>
				<div
					style={{
						width: dotX - centerX(0),
						height: '100%',
						borderRadius: 2,
						background: `linear-gradient(90deg, ${COLORS.purple}, ${COLORS.cyan}, ${COLORS.coral}, ${COLORS.emerald})`,
					}}
				/>
			</div>
			<div
				style={{
					position: 'absolute',
					left: dotX - 14,
					top: trackY - 12,
					width: 28,
					height: 28,
					borderRadius: '50%',
					background: '#fff',
					boxShadow: `0 0 0 6px ${alpha(COLORS.cyan, 0.3)}, 0 0 30px ${COLORS.cyan}`,
					opacity: dotO,
					transform: `scale(${dotO})`,
				}}
			/>

			<Reveal
				delay={TRAVEL_START + (STEPS.length - 1) * HOP + 14}
				from="up"
				distance={30}
				style={{position: 'absolute', left: 0, right: 0, top: trackY + 34, display: 'flex', justifyContent: 'center'}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 12,
						fontFamily: FONTS.body,
						fontSize: 24,
						color: COLORS.muted,
					}}
				>
					<RotateCcw size={24} color={COLORS.cyan} style={{transform: `rotate(${-frame * 3}deg)`}} />
					Itere: refine o prompt e repita a leitura crítica quantas vezes precisar.
				</div>
			</Reveal>
		</SceneShell>
	);
};
