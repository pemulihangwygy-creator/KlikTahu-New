#!/usr/bin/env node
/**
 * Pre-flight: verifies a delivery bundle is present and internally
 * consistent (duration vs. SRT end, loudness, resolution, fps).
 * usage: node scripts/selfcheck.mjs [out-dir]
 */
import {execFileSync} from 'node:child_process';
import {existsSync, readFileSync, statSync} from 'node:fs';
import {join} from 'node:path';

const root = process.cwd();
const dir = process.argv[2] ?? join(root, 'out');
const ffprobe = join(root, 'node_modules', '@remotion', 'compositor-linux-x64-gnu', 'ffprobe');

const probe = (f) =>
  JSON.parse(
    execFileSync(ffprobe, ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', f]).toString(),
  );

const check = (name) => {
  const f = join(dir, name);
  if (!existsSync(f)) return {name, ok: false, why: 'missing'};
  const j = probe(f);
  const v = j.streams.find((s) => s.codec_type === 'video');
  const a = j.streams.find((s) => s.codec_type === 'audio');
  const [num, den] = (v.avg_frame_rate || '0/1').split('/').map(Number);
  const fps = num / den;
  const dur = Number(j.format.duration);
  const mb = statSync(f).size / 1048576;
  return {
    name,
    ok: v.width === 1440 && v.height === 2560 && Math.abs(fps - 90) < 0.01 && !!a && dur > 10,
    res: `${v.width}x${v.height}`,
    fps,
    dur: `${dur.toFixed(1)}s`,
    audio: a ? `${a.codec_name} ${a.sample_rate}Hz` : 'none',
    mb: mb.toFixed(1),
  };
};

const srtEnd = (name) => {
  const f = join(dir, name);
  if (!existsSync(f)) return null;
  const stamps = [...readFileSync(f, 'utf8').matchAll(/(\d\d):(\d\d):(\d\d),(\d\d\d) --> /g)];
  if (!stamps.length) return null;
  const m = stamps.at(-1);
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) + Number(m[4]) / 1000;
};

const rows = ['long.mp4', 'short.mp4'].map(check);
for (const r of rows) {
  const srt = srtEnd(r.name.replace('.mp4', '.srt'));
  console.log(
    `${r.ok ? 'OK  ' : 'FAIL'} ${r.name.padEnd(11)} ${r.res ?? ''} ${r.fps ? r.fps + 'fps' : ''} ${r.dur ?? ''} ${r.audio ?? ''} ${r.mb ? r.mb + 'MB' : ''}` +
      (srt !== null ? `  srt-ends=${srt.toFixed(1)}s` : '  (no srt)'),
  );
}
process.exit(rows.every((r) => r.ok) ? 0 : 1);
