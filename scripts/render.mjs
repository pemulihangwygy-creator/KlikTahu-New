#!/usr/bin/env node
/**
 * Node-API renderer (no CLI overhead, live progress, deterministic settings).
 *
 *   node scripts/render.mjs long|short [--frames=a-b] [--out=path]
 *
 * Defaults mirror remotion.config.ts: h264, yuv420p, JPEG frames.
 */
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import {mkdirSync} from 'node:fs';
import {join} from 'node:path';

const which = process.argv[2] === 'short' ? 'short' : 'long';
const id = which === 'short' ? 'KlikTahuShort' : 'KlikTahuLong';
const outArg = process.argv.find((a) => a.startsWith('--out='))?.slice(6);
const framesArg = process.argv.find((a) => a.startsWith('--frames='))?.slice(9);

const root = process.cwd();
const outDir = join(root, 'out');
mkdirSync(outDir, {recursive: true});
const outputLocation = outArg ?? join(outDir, `${which}-raw.mp4`);

const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE;
const concurrency = Number(process.env.REMOTION_CONCURRENCY ?? 2);
const chromiumOptions = {gl: process.env.REMOTION_GL ?? 'swangle'};

const t0 = Date.now();
const stamp = () => `${((Date.now() - t0) / 1000).toFixed(0)}s`;

const serveUrl = await bundle({entryPoint: join(root, 'src', 'index.ts')});
console.log(`[${stamp()}] bundled`);

const composition = await selectComposition({serveUrl, id, browserExecutable, chromiumOptions});
console.log(`[${stamp()}] ${id}: ${composition.durationInFrames} frames @ ${composition.fps}fps ${composition.width}x${composition.height}`);

const frameRange = framesArg
  ? framesArg.split('-').map((n) => parseInt(n, 10))
  : null;

let last = 0;
await renderMedia({
  composition,
  serveUrl,
  codec: 'h264',
  outputLocation,
  imageFormat: 'jpeg',
  jpegQuality: 92,
  pixelFormat: 'yuv420p',
  crf: 18,
  concurrency,
  chromiumOptions,
  browserExecutable,
  ...(frameRange ? {frameRange} : {}),
  onProgress: ({renderedFrames, encodedFrames}) => {
    const pct = ((renderedFrames / (frameRange ? frameRange[1] - frameRange[0] + 1 : composition.durationInFrames)) * 100).toFixed(1);
    if (renderedFrames - last >= 100 || renderedFrames === 0) {
      last = renderedFrames;
      console.log(`[${stamp()}] rendered ${renderedFrames} (${pct}%), encoded ${encodedFrames}`);
    }
  },
  logLevel: 'error',
});

console.log(`[${stamp()}] wrote ${outputLocation}`);
