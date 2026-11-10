import {SCRIPT} from '../data/script';
import {SHORT_SCENES, LONG_SCENES, type SceneDef} from '../data/scenes';

export type VoPlacement = {id: string; text: string; start: number; dur: number};
export type SceneTiming = {
  id: string;
  start: number;
  dur: number;
  lines: VoPlacement[];
};

export type Timeline = {
  fps: number;
  scenes: SceneTiming[];
  total: number;
  chapterOf: Record<string, number>;
};

const TEXT = Object.fromEntries(SCRIPT.map((l) => [l.id, l.text]));

export const buildTimeline = (
  defs: SceneDef[],
  durations: Record<string, number>,
  fps: number,
  opts: {beat: number; minScene: number},
): Timeline => {
  let cursor = 0;
  const scenes: SceneTiming[] = [];
  for (const def of defs) {
    const hasAll = def.lines.every((id) => durations[id] > 0);
    if (def.lines.length > 0 && !hasAll) continue; // pending narration → skip for now
    const lines: VoPlacement[] = [];
    let t = cursor + Math.round(def.lead * (fps / 30));
    for (const [i, id] of def.lines.entries()) {
      const dur = Math.round((durations[id] ?? 0) * fps);
      lines.push({id, text: TEXT[id], start: t - cursor, dur});
      t += dur + Math.round((def.beat ?? 0) * (fps / 30)) * (i === def.lines.length - 1 ? 0 : 1);
    }
    const bodyEnd = lines.length ? lines[lines.length - 1].start + lines[lines.length - 1].dur : def.lead * (fps / 30);
    const dur = Math.max(Math.round(opts.minScene * fps), Math.round(bodyEnd + def.hold * (fps / 30)));
    scenes.push({id: def.id, start: cursor, dur, lines});
    cursor += dur;
  }
  return {fps, scenes, total: cursor, chapterOf: {}};
};

export const SCENES_BY_ID = Object.fromEntries(
  [...LONG_SCENES, ...SHORT_SCENES].map((s) => [s.id, s]),
);
