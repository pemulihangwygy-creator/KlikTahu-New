#!/usr/bin/env node
/**
 * Builds SRT captions from the same timing model the video uses
 * (scene order + measured VO durations + the caption chunker), so the
 * subtitle file matches the burned-in words frame-accurately.
 */
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {join} from 'node:path';

const root = process.cwd();
const FPS = 90;
const SCALE = FPS / 30;
const durations = JSON.parse(readFileSync(join(root, 'src/data/vo-durations.json'), 'utf8')).durations;
const kind = process.argv[2] === 'short' ? 'SHORT_SCENES' : 'LONG_SCENES';
const out = process.argv[3] ?? (kind === 'SHORT_SCENES' ? 'out/short.srt' : 'out/long.srt');

const script = readFileSync(join(root, 'src/data/script.ts'), 'utf8');
const TEXT = Object.fromEntries([...script.matchAll(/id: '(v\d+)', file: '[^']+', text: '([^']*)'/g)].map((m) => [m[1], m[2]]));

const scenesSrc = readFileSync(join(root, 'src/data/scenes.ts'), 'utf8').split(`export const ${kind}`)[1].split('];')[0];
const scenes = [...scenesSrc.matchAll(/\{\s*id:\s*'([^']+)',\s*lines:\s*\[([^\]]*)\],\s*lead:\s*(\d+),\s*hold:\s*(\d+)(?:,\s*beat:\s*(\d+))?\s*\}/g)]
  .map((m) => ({id: m[1], lines: (m[2].match(/v\d+/g) || []), lead: +m[3], hold: +m[4], beat: +(m[5] || 0)}));

const chunksOf = (text) => {
  const parts = text.replace(/[—:]/g, ',').split(/(?<=[.,?!])\s+/);
  const out = [];
  for (const p of parts) {
    const words = p.trim().split(/\s+/).filter(Boolean);
    if (!words.length) continue;
    if (words.length <= 6) out.push(words.join(' '));
    else for (let i = 0; i < words.length; i += 5) out.push(words.slice(i, i + 5).join(' '));
  }
  return out;
};

const tc = (frames) => {
  const total = frames / FPS;
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = Math.floor(total % 60);
  const ms = Math.round((total - Math.floor(total)) * 1000);
  const p = (n, l = 2) => String(n).padStart(l, '0');
  return `${p(h)}:${p(m)}:${p(s)},${p(ms, 3)}`;
};

let cursor = 0;
const cues = [];
for (const s of scenes) {
  if (s.lines.length) {
    if (!s.lines.every((id) => durations[id] > 0)) {
      console.error(`skip ${s.id}: narration missing (${s.lines.filter((id) => !durations[id]).join(', ')})`);
      break;
    }
  }
  let t = cursor + Math.round(s.lead * SCALE);
  const placed = [];
  s.lines.forEach((id, i) => {
    const dur = Math.round(durations[id] * FPS);
    placed.push({id, start: t, dur});
    t += dur + (i === s.lines.length - 1 ? 0 : Math.round(s.beat * SCALE));
  });
  for (const p of placed) {
    const chunks = chunksOf(TEXT[p.id]);
    const weights = chunks.map((c) => c.length + 6);
    const total = weights.reduce((a, b) => a + b, 0);
    let acc = 0;
    chunks.forEach((c, i) => {
      const start = p.start + Math.round((acc / total) * p.dur);
      acc += weights[i];
      const end = p.start + Math.round((acc / total) * p.dur);
      cues.push({start, end, text: c.replace(/\s+/g, ' ').trim()});
    });
  }
  const end = placed.length ? placed.at(-1).start + placed.at(-1).dur : cursor + s.lead * SCALE;
  cursor += Math.max(Math.round(2.2 * FPS), Math.round(end - cursor + s.hold * SCALE));
}

const srt = cues
  .map((c, i) => `${i + 1}\n${tc(c.start)} --> ${tc(c.end)}\n${c.text}\n`)
  .join('\n');
mkdirSync(join(root, 'out'), {recursive: true});
writeFileSync(join(root, out), srt);
console.log(`${out}: ${cues.length} cues, ${tc(cursor)} total`);
