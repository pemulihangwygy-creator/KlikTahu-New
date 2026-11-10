#!/usr/bin/env node
/**
 * Procedural audio asset generator — no external samples, fully reproducible.
 *   public/sfx/*.mp3          one-shot sound design
 *   public/music/bed.mp3      long-form underscore (ducked in Remotion)
 *   public/music/short.mp3    tighter variant for the vertical short
 */
import {writeFileSync, mkdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {join} from 'node:path';

const SR = 48000;
const root = process.cwd();
const ffmpeg = join(root, 'node_modules', '@remotion', 'compositor-linux-x64-gnu', 'ffmpeg');
mkdirSync(join(root, 'public', 'sfx'), {recursive: true});
mkdirSync(join(root, 'public', 'music'), {recursive: true});
mkdirSync(join(root, '.tmp'), {recursive: true});

const TAU = Math.PI * 2;
const clamp = (v, a = -1, b = 1) => Math.min(b, Math.max(a, v));
let seed = 1337;
const noise = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return (seed / 4294967296) * 2 - 1;
};
const env = (t, dur, attack, release, curve = 2) => {
  const a = attack <= 0 ? 1 : Math.min(1, t / attack);
  const r = Math.max(0, 1 - Math.max(0, t - (dur - release)) / release);
  return Math.pow(a, 1 / curve) * Math.pow(r, curve);
};
const onePoleLow = () => {
  let y = 0;
  return (x, a) => (y = y + a * (x - y));
};

const writeWav = (path, samples) => {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) buf.writeInt16LE(Math.round(clamp(samples[i]) * 32767), 44 + i * 2);
  writeFileSync(path, buf);
};

const toMp3 = (wav, mp3, kbps = '192k') =>
  execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-i', wav, '-c:a', 'libmp3lame', '-b:a', kbps, mp3]);

const make = (dur, fn) => {
  const n = Math.floor(dur * SR);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = fn(i / SR, i);
  return out;
};

// ---------------------------------------------------------------- sound design
const sfx = {
  // air movement, band-passed noise swelling up
  whoosh: () => {
    const dur = 0.62;
    return make(dur, (t) => {
      const p = t / dur;
      const hp = onePoleLow();
      const lp = onePoleLow();
      const cut = 0.02 + 0.35 * Math.sin(Math.PI * p);
      const n = noise();
      const low = lp(n, 0.08 + 0.5 * p);
      const high = n - hp(n, cut);
      return (low * 0.35 + high * 0.5) * Math.pow(Math.sin(Math.PI * p), 1.6) * 0.75;
    });
  },
  // soft UI blip, falling pitch
  pop: () => {
    const dur = 0.19;
    return make(dur, (t) => {
      const f = 520 * Math.exp(-t * 9) + 180;
      return Math.sin(TAU * f * t) * Math.exp(-t * 16) * 0.5;
    });
  },
  // low impact for stat reveals
  impact: () => {
    const dur = 0.95;
    const lp = onePoleLow();
    return make(dur, (t) => {
      const f = 92 * Math.exp(-t * 5) + 38;
      const body = Math.sin(TAU * f * t) * Math.exp(-t * 4.2);
      const crack = lp(noise(), 0.22) * Math.exp(-t * 28);
      return clamp(body * 0.85 + crack * 0.5);
    });
  },
  // tension riser (2.4 s) — used into the 1998 reveal
  riser: () => {
    const dur = 2.4;
    const lp = onePoleLow();
    return make(dur, (t) => {
      const p = t / dur;
      const f = 120 + 900 * Math.pow(p, 2.2);
      const tone = Math.sin(TAU * f * t + 2 * Math.sin(TAU * f * 0.5 * t));
      const air = lp(noise(), 0.05 + 0.55 * p);
      return (tone * 0.16 + air * 0.55) * Math.pow(p, 2.1) * 0.9;
    });
  },
  // tiny click for counting
  tick: () => {
    const dur = 0.07;
    return make(dur, (t) => {
      const noiseClick = noise() * Math.exp(-t * 90) * 0.35;
      return noiseClick + Math.sin(TAU * 2200 * t) * Math.exp(-t * 120) * 0.25;
    });
  },
  // bright sparkle for the yellow accent moments
  shimmer: () => {
    const dur = 1.25;
    const notes = [1760, 2349, 2960, 3520];
    return make(dur, (t) => {
      let s = 0;
      notes.forEach((f, i) => {
        const delay = i * 0.055;
        const tt = t - delay;
        if (tt > 0) s += Math.sin(TAU * f * tt) * Math.exp(-tt * 5.5) * 0.12;
      });
      return s;
    });
  },
  // typewriter-ish burst
  type: () => {
    const dur = 0.12;
    return make(dur, (t, i) => {
      const spike = i % 240 === 0 ? 1 : 0;
      return (noise() * 0.25 * Math.exp(-((i % 240) / SR) * 60)) + spike * 0;
    });
  },
  // section transition downlifter
  sweep: () => {
    const dur = 0.9;
    const lp = onePoleLow();
    return make(dur, (t) => {
      const p = t / dur;
      const air = lp(noise(), 0.4 - 0.35 * p);
      return air * (1 - p) * 0.5;
    });
  },
};

for (const [name, fn] of Object.entries(sfx)) {
  const wav = join(root, '.tmp', `${name}.wav`);
  writeWav(wav, fn());
  toMp3(wav, join(root, 'public', 'sfx', `${name}.mp3`), '160k');
}

// ------------------------------------------------------------------- music bed
const CHORDS = {
  Dm: [146.83, 174.61, 220.0, 293.66],
  Bb: [116.54, 146.83, 174.61, 233.08],
  F: [130.81, 174.61, 220.0, 261.63],
  C: [130.81, 164.81, 196.0, 261.63],
};
const PROG = ['Dm', 'Bb', 'F', 'C'];
const BPM = 92;
const BEAT = 60 / BPM;

const renderMusic = (bars, level) => {
  const dur = bars * 4 * BEAT;
  const n = Math.floor(dur * SR);
  const out = new Float32Array(n);
  const lp = onePoleLow();
  const lp2 = onePoleLow();

  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const bar = Math.floor(t / (4 * BEAT));
    const chord = CHORDS[PROG[bar % PROG.length]] ?? CHORDS.Dm;
    const beatPos = (t % BEAT) / BEAT;
    const barPos = (t % (4 * BEAT)) / (4 * BEAT);
    // sidechain dip on every beat
    const duck = 1 - 0.62 * Math.exp(-beatPos * 6);
    // sub
    const sub = Math.sin(TAU * chord[0] * 0.5 * t) * 0.16 * duck;
    // pad — additive, slow swell
    let pad = 0;
    chord.forEach((f, k) => {
      pad += Math.sin(TAU * f * t + k * 1.7) * 0.032 * (1 + 0.25 * Math.sin(TAU * 0.13 * t + k));
      pad += Math.sin(TAU * f * 2.002 * t + k) * 0.012;
    });
    pad *= (0.55 + 0.45 * Math.sin(Math.PI * barPos)) * duck;
    // pluck arpeggio: 8th notes
    const step = Math.floor(t / (BEAT / 2)) % 8;
    const noteIdx = [0, 2, 1, 3, 2, 1, 3, 0][step];
    const plTime = t % (BEAT / 2);
    const pl = Math.sin(TAU * chord[noteIdx] * 2 * plTime) * Math.exp(-plTime * 11) * 0.075;
    // kick
    const kt = t % (BEAT * 2);
    const kick = Math.sin(TAU * (58 * Math.exp(-kt * 18) + 42) * kt) * Math.exp(-kt * 9) * 0.3;
    // hats on offbeat
    const ht = (t + BEAT / 2) % (BEAT / 2);
    const hat = (noise() - lp2(noise(), 0.45)) * Math.exp(-ht * 55) * 0.055;
    out[i] = (sub + pad + pl + kick + hat) * level;
  }
  // gentle fade in/out
  const fade = Math.floor(1.5 * SR);
  for (let i = 0; i < fade; i++) {
    out[i] *= i / fade;
    out[n - 1 - i] *= i / fade;
  }
  return out;
};

writeWav(join(root, '.tmp', 'bed.wav'), renderMusic(64, 0.85));
toMp3(join(root, '.tmp', 'bed.wav'), join(root, 'public', 'music', 'bed.mp3'), '160k');
writeWav(join(root, '.tmp', 'short.wav'), renderMusic(16, 0.95));
toMp3(join(root, '.tmp', 'short.wav'), join(root, 'public', 'music', 'short.mp3'), '160k');

console.log('audio assets written:', Object.keys(sfx).length + 2, 'files');
