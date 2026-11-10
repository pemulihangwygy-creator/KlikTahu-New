/**
 * Prints a per-scene frame table (start / duration / a good hero still).
 * Stops when narration for a scene is not generated yet (prints "pending").
 */
import {readFileSync} from 'node:fs';

const FPS = 90;
const SCALE = FPS / 30; // scene timings are authored in 30fps "beats"
const durations = JSON.parse(readFileSync('src/data/vo-durations.json', 'utf8')).durations;
const kind = process.argv[2] === 'short' ? 'SHORT_SCENES' : 'LONG_SCENES';
const src = readFileSync('src/data/scenes.ts', 'utf8');
const body = src.split(`export const ${kind}`)[1].split('];')[0];
const scenes = [...body.matchAll(/\{\s*id:\s*'([^']+)',\s*lines:\s*\[([^\]]*)\],\s*lead:\s*(\d+),\s*hold:\s*(\d+)(?:,\s*beat:\s*(\d+))?\s*\}/g)]
  .map((m) => ({id: m[1], lines: (m[2].match(/v\d+/g) || []), lead: +m[3], hold: +m[4], beat: +(m[5] || 0)}));

let cursor = 0;
for (const s of scenes) {
  if (s.lines.length && !s.lines.every((id) => durations[id] > 0)) {
    console.log(`${s.id.padEnd(14)} pending narration (${s.lines.join(', ')})`);
    break;
  }
  let t = cursor + Math.round(s.lead * SCALE);
  const placed = [];
  s.lines.forEach((id, i) => {
    const dur = Math.round(durations[id] * FPS);
    placed.push({id, start: t, dur});
    t += dur + (i === s.lines.length - 1 ? 0 : Math.round(s.beat * SCALE));
  });
  const end = placed.length ? placed.at(-1).start + placed.at(-1).dur : cursor + s.lead * SCALE;
  const dur = Math.max(Math.round(2.2 * FPS), Math.round(end - cursor + s.hold * SCALE));
  console.log(
    `${s.id.padEnd(14)} start=${String(cursor).padStart(6)} dur=${String(dur).padStart(5)} still=${cursor + Math.round(dur * 0.5)} ` +
      placed.map((p) => `${p.id}@${p.start - cursor}`).join(' '),
  );
  cursor += dur;
}
console.log('TOTAL frames', cursor, (cursor / FPS).toFixed(1) + 's');
