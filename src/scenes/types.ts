import type {VoPlacement} from '../lib/timeline';
export type SceneProps = {lines: VoPlacement[]; dur: number};
export const at = (lines: VoPlacement[], i: number, frac = 0) =>
  (lines[i]?.start ?? 0) + (lines[i]?.dur ?? 0) * frac;
