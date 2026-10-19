import {CheckCircle2, Library, ListTree, SpellCheck, TerminalSquare} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {mix, springAt, springWindow} from '../anim';
import {SceneHeader} from '../components/SceneHeader';
import {SceneShell} from '../components/SceneShell';
import {COLORS, FONTS, alpha} from '../theme';

type SceneProps = {duration: number};

type UseCase = {
	icon: LucideIcon;
	title: string;
	color: string;
	bullets: string[];
	prompt: string;
	focus: [number, number];
};

// Janelas de foco (frames locais) alinhadas às legendas da cena.
const CASES: UseCase[] = [
	{
		icon: Library,
		title: 'Mapeamento Bibliográfico',
		color: COLORS.cyan,
		bullets: ['Busca por artigos seminais', 'Resumos comparativos de autores', 'Identificação de lacunas'],
		prompt: 'Quais lacunas aparecem nos estudos sobre o meu tema desde 2015?',
		focus: [120, 300],
	},
	{
		icon: ListTree,
		title: 'Estruturação Lógica',
		color: COLORS.purple,
		bullets: ['Tópicos do sumário', 'Refinamento do problema de pesquisa', 'Formulação de hipóteses'],
		prompt: 'Sugira 3 recortes possíveis para o meu problema de pesquisa.',
		focus: [300, 490],
	},
	{
		icon: SpellCheck,
		title: 'Revisão Textual & ABNT',
		color: COLORS.emerald,
		bullets: ['Coesão e coerência', 'Gramática formal', 'Citações (ABNT NBR 10520)'],
		prompt: 'Revise a coesão deste parágrafo sem alterar o sentido.',
		focus: [490, 675],
	},
];

const CARD_W = 530;
const CARD_GAP = 45;

const Card: React.FC<{data: UseCase; index: number; dim: number; emphasis: number}> = ({
	data,
	index,
	dim,
	emphasis,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const delay = 22 + index * 14;
	const enter = springAt(frame, fps, delay);
	const o = springAt(frame, fps, delay, true);
	const Icon = data.icon;
	const [focusStart, focusEnd] = data.focus;
	const typed = Math.floor(
		interpolate(frame, [focusStart + 50, focusStart + 120], [0, data.prompt.length], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}),
	);
	const typing = frame >= focusStart + 50 && frame < focusEnd;
	const caretOn = Math.floor(frame / 8) % 2 === 0;

	return (
		<div
			style={{
				position: 'absolute',
				left: 120 + index * (CARD_W + CARD_GAP),
				top: 330,
				width: CARD_W,
				height: 540,
				boxSizing: 'border-box',
				padding: 36,
				borderRadius: 28,
				background: `linear-gradient(170deg, ${alpha(data.color, 0.12 + emphasis * 0.08)}, ${COLORS.surface} 45%)`,
				border: `1.5px solid ${alpha(data.color, 0.25 + emphasis * 0.55)}`,
				boxShadow: `0 30px 70px rgba(0,0,0,0.4), 0 0 ${60 * emphasis}px ${alpha(data.color, 0.35 * emphasis)}`,
				opacity: o * (1 - dim * 0.5),
				transform: `translateY(${(1 - enter) * 160 - emphasis * 14}px) scale(${mix(emphasis, 1, 1.035)})`,
			}}
		>
			<div
				style={{
					position: 'absolute',
					right: 32,
					top: 18,
					fontFamily: FONTS.heading,
					fontWeight: 800,
					fontSize: 96,
					color: alpha(data.color, 0.14),
				}}
			>
				0{index + 1}
			</div>
			<div
				style={{
					width: 84,
					height: 84,
					borderRadius: 22,
					background: `linear-gradient(135deg, ${data.color}, ${alpha(data.color, 0.55)})`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					boxShadow: `0 14px 34px ${alpha(data.color, 0.45)}`,
					transform: `rotate(${(1 - enter) * -30}deg) scale(${mix(emphasis, 1, 1.08)})`,
				}}
			>
				<Icon size={44} color="#fff" strokeWidth={2} />
			</div>
			<div
				style={{
					fontFamily: FONTS.heading,
					fontWeight: 700,
					fontSize: 34,
					color: COLORS.text,
					marginTop: 26,
					letterSpacing: -0.5,
				}}
			>
				{data.title}
			</div>
			<div style={{marginTop: 22, display: 'flex', flexDirection: 'column', gap: 16}}>
				{data.bullets.map((b, k) => {
					const bp = springAt(frame, fps, focusStart + 8 + k * 12);
					const bo = springAt(frame, fps, focusStart + 8 + k * 12, true);
					return (
						<div
							key={b}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 14,
								fontFamily: FONTS.body,
								fontSize: 24,
								color: '#E2E8F0',
								opacity: 0.25 + bo * 0.75,
								transform: `translateX(${(1 - bp) * 30}px)`,
							}}
						>
							<CheckCircle2 size={26} color={data.color} style={{flexShrink: 0, transform: `scale(${bp})`}} />
							{b}
						</div>
					);
				})}
			</div>
			<div
				style={{
					position: 'absolute',
					left: 36,
					right: 36,
					bottom: 34,
					padding: '16px 20px',
					borderRadius: 16,
					background: 'rgba(11,15,25,0.7)',
					border: `1px solid ${COLORS.border}`,
					borderLeft: `4px solid ${data.color}`,
					minHeight: 104,
					boxSizing: 'border-box',
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 8,
						fontFamily: FONTS.body,
						fontWeight: 600,
						fontSize: 16,
						letterSpacing: 1.5,
						color: data.color,
						textTransform: 'uppercase',
					}}
				>
					<TerminalSquare size={18} color={data.color} />
					Exemplo de prompt
				</div>
				<div style={{fontFamily: FONTS.body, fontSize: 21, lineHeight: 1.4, color: '#CBD5E1', marginTop: 6}}>
					“{data.prompt.slice(0, typed)}
					<span
						style={{
							display: 'inline-block',
							width: 2,
							height: 22,
							marginLeft: 2,
							verticalAlign: 'middle',
							background: data.color,
							opacity: typing && caretOn ? 1 : 0,
						}}
					/>
					<span style={{opacity: 0.22}}>{data.prompt.slice(typed)}</span>”
				</div>
			</div>
		</div>
	);
};

export const UseCasesScene: React.FC<SceneProps> = ({duration}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const emphasis = CASES.map((c) => springWindow(frame, fps, c.focus[0], c.focus[1]));

	return (
		<SceneShell duration={duration}>
			<SceneHeader
				index="02"
				color={COLORS.cyan}
				title="Casos Práticos de Aplicação"
				subtitle="Onde a IA realmente ajuda — sem terceirizar o seu pensamento."
				delay={6}
			/>
			{CASES.map((c, i) => {
				const dim = Math.max(0, ...emphasis.filter((_, j) => j !== i));
				return <Card key={c.title} data={c} index={i} dim={dim} emphasis={emphasis[i]} />;
			})}
		</SceneShell>
	);
};
