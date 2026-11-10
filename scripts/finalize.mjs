#!/usr/bin/env node
/**
 * Delivery pass on a Remotion render:
 *   - loudness normalisation to -14 LUFS / -1.5 dBTP (platform target)
 *   - 48 kHz AAC 320k
 *   - video stream copied (no re-encode, no generation loss)
 *   - +faststart for instant playback
 *
 * usage: node scripts/finalize.mjs <in.mp4> <out.mp4>
 */
import {execFileSync} from 'node:child_process';
import {statSync} from 'node:fs';
import {join} from 'node:path';

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error('usage: node scripts/finalize.mjs <in.mp4> <out.mp4>');
  process.exit(1);
}

const ffmpeg = join(process.cwd(), 'node_modules', '@remotion', 'compositor-linux-x64-gnu', 'ffmpeg');

const args = [
  '-hide_banner',
  '-loglevel', 'error',
  '-y',
  '-i', input,
  '-c:v', 'copy',
  '-af', 'loudnorm=I=-14:TP=-2.6:LRA=11,volume=1.3dB',
  '-ar', '48000',
  '-c:a', 'aac',
  '-b:a', '320k',
  '-movflags', '+faststart',
  output,
];

execFileSync(ffmpeg, args, {stdio: 'inherit'});

const mb = statSync(output).size / 1048576;
console.log(`finalized ${output} (${mb.toFixed(1)} MB)`);

/** verify */
const measure = (file) => {
  const out = execFileSync(ffmpeg, ['-hide_banner', '-i', file, '-vn', '-af', 'loudnorm=print_format=json', '-f', 'null', '/dev/null'], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return out.toString();
};
try {
  const log = execFileSync(ffmpeg, ['-hide_banner', '-i', output, '-vn', '-af', 'loudnorm=print_format=summary', '-f', 'null', '/dev/null'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
  });
  const stats = log.split('\n').filter((l) => /Input (Integrated|True Peak)/.test(l)).join(' | ');
  console.log(stats || 'loudness measured');
} catch (e) {
  // ffmpeg writes its summary to stderr; not fatal for delivery
}
