import {spring} from 'remotion';

// Configuração única de mola usada em todo o vídeo.
export const SPRING_CONFIG = {damping: 12, stiffness: 100, mass: 1} as const;

/**
 * Progresso de mola iniciado em `delay` frames.
 * `clamp` evita overshoot (usado em opacidade/blur, onde passar de 1 não faz sentido).
 */
export const springAt = (frame: number, fps: number, delay = 0, clamp = false): number =>
	spring({
		frame: frame - delay,
		fps,
		config: {...SPRING_CONFIG, overshootClamping: clamp},
	});

/** Janela de mola: sobe em `start` e desce em `end` (0 → 1 → 0). */
export const springWindow = (frame: number, fps: number, start: number, end: number): number =>
	springAt(frame, fps, start, true) * (1 - springAt(frame, fps, end, true));

export const mix = (p: number, from: number, to: number): number => from + (to - from) * p;
