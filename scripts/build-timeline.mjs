#!/usr/bin/env node
/**
 * Reads public/vo/*.mp3 (ffprobe from the Remotion compositor) and writes
 * src/data/vo-durations.json. Missing clips are listed as pending so the
 * composition still builds while narration is being produced.
 */
import {execFileSync} from 'node:child_process';
import {existsSync, readdirSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const root = process.cwd();
const voDir = join(root, 'public', 'vo');
const ffprobe = join(
  root, 'node_modules', '@remotion', 'compositor-linux-x64-gnu', 'ffprobe',
);

const texts = (await import('node:fs')).readFileSync(join(root, 'src', 'data', 'script.ts'), 'utf8');
const ids = [...texts.matchAll(/id: '(v\d+)'/g)].map((m) => m[1]);

const files = existsSync(voDir) ? readdirSync(voDir).filter((f) => f.endsWith('.mp3')) : [];
const durations = {};
const missing = [];
for (const id of ids) {
  const f = `${id}.mp3`;
  if (!files.includes(f)) {
    missing.push(id);
    continue;
  }
  const out = execFileSync(ffprobe, [
    '-v', 'error', '-show_entries', 'format=duration',
    '-of', 'default=nw=1:nk=1', join(voDir, f),
  ]).toString().trim();
  durations[id] = Math.round(parseFloat(out) * 1000) / 1000;
}

const payload = {generatedAt: new Date().toISOString(), durations, missing};
writeFileSync(join(root, 'src', 'data', 'vo-durations.json'), JSON.stringify(payload, null, 2) + '\n');
const total = Object.values(durations).reduce((a, b) => a + b, 0);
console.log(`vo clips: ${Object.keys(durations).length}, missing: ${missing.length ? missing.join(', ') : '-'}`);
console.log(`narration: ${total.toFixed(1)}s`);
