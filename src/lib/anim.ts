import { interpolate, spring, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import { EASE } from '../theme';

export const easeOut = Easing.bezier(...EASE.out);
export const easeInOut = Easing.bezier(...EASE.inOut);

/** Spring in frames, fps-aware. Returns 0..1 */
export const springIn = (frame: number, fps: number, delay = 0, stiffness = 120, damping = 18) =>
  spring({ frame: frame - delay, fps, config: { stiffness, damping, mass: 0.8 } });

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** 0..1 progress between frame windows */
export const prog = (frame: number, start: number, dur: number) =>
  clamp01(interpolate(frame, [start, start + Math.max(1, dur)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOut,
  }));

export const useProg = (start: number, dur: number) => prog(useCurrentFrame(), start, dur);

/** fade + rise helper */
export const rise = (p: number, dist = 46) => ({
  opacity: clamp01(p * 1.6),
  transform: `translateY(${(1 - p) * dist}px)`,
});

/** Deterministic pseudo random */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const stagger = (i: number, per = 3, base = 0) => base + i * per;
