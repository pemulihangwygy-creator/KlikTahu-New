#!/usr/bin/env node
/**
 * Renders thumbnail / poster JPEGs from the compositions themselves.
 * Run after `npm run timeline` (needs measured VO durations).
 */
import {execFileSync} from 'node:child_process';
import {mkdirSync, existsSync} from 'node:fs';
import {join} from 'node:path';

const root = process.cwd();
const out = join(root, 'out');
mkdirSync(out, {recursive: true});

/** frames chosen from src/data/scenes.ts timings: hook (receipt) and the 1998 reveal */
const shots = [
  ['KlikTahuLong', 'long-poster', 663],
  ['KlikTahuLong', 'long-crisis', 8700],
  ['KlikTahuShort', 'short-poster', 900],
];

for (const [comp, name, frame] of shots) {
  const dest = join(out, `${name}.jpg`);
  try {
    execFileSync(
      'npx',
      ['remotion', 'still', comp, dest, `--frame=${frame}`, '--image-format=jpeg', '--jpeg-quality=92', '--log=error'],
      {cwd: root, stdio: 'inherit'},
    );
    if (existsSync(dest)) console.log('poster', name);
  } catch (e) {
    console.error(`poster ${name} failed (frame ${frame}); composition may be shorter than that frame`);
  }
}
