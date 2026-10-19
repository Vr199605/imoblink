import type {CSSProperties} from 'react';

export const COLORS = {
	bg: '#0B0F19',
	bgAlt: '#0F172A',
	surface: 'rgba(19, 27, 46, 0.78)',
	surfaceSolid: '#131B2E',
	border: 'rgba(148, 163, 184, 0.16)',
	text: '#F8FAFC',
	muted: '#94A3B8',
	subtle: '#64748B',
	purple: '#8B5CF6',
	cyan: '#06B6D4',
	emerald: '#10B981',
	coral: '#F97316',
} as const;

export const FONTS = {
	heading: "'Poppins', sans-serif",
	body: "'Inter', sans-serif",
} as const;

export const VIDEO = {
	width: 1920,
	height: 1080,
	fps: 30,
} as const;

export type SceneId = 'intro' | 'useCases' | 'ethics' | 'workflow' | 'outro';

export type SceneMeta = {
	id: SceneId;
	label: string;
	from: number;
	duration: number;
	color: string;
};

// Linha do tempo (30 fps): 0–12s, 12–35s, 35–50s, 50–65s, 65–75s
export const SCENES: SceneMeta[] = [
	{id: 'intro', label: 'O Desafio', from: 0, duration: 360, color: COLORS.purple},
	{id: 'useCases', label: 'Casos Práticos', from: 360, duration: 690, color: COLORS.cyan},
	{id: 'ethics', label: 'Linha Vermelha', from: 1050, duration: 450, color: COLORS.coral},
	{id: 'workflow', label: 'Fluxo Ideal', from: 1500, duration: 450, color: COLORS.purple},
	{id: 'outro', label: 'Encerramento', from: 1950, duration: 300, color: COLORS.emerald},
];

export const TOTAL_FRAMES = SCENES.reduce((acc, s) => acc + s.duration, 0);

export const gradientText = (from: string, to: string): CSSProperties => ({
	backgroundImage: `linear-gradient(90deg, ${from}, ${to})`,
	WebkitBackgroundClip: 'text',
	backgroundClip: 'text',
	color: 'transparent',
});

export const alpha = (hex: string, a: number): string => {
	const n = parseInt(hex.slice(1), 16);
	return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};
