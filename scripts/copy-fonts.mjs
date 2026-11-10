#!/usr/bin/env node
/** Copies only the woff2 files we use into public/fonts (self-hosted, no CDN at render time). */
import {copyFileSync, mkdirSync, existsSync} from 'node:fs';
import {join} from 'node:path';

const root = process.cwd();
const out = join(root, 'public', 'fonts');
mkdirSync(out, {recursive: true});

const files = [
  ['@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2', 'bricolage-var.woff2'],
  ['@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2', 'jakarta-var.woff2'],
  ['@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2', 'jetbrains-var.woff2'],
];

for (const [src, dest] of files) {
  const from = join(root, 'node_modules', src);
  if (!existsSync(from)) {
    console.error('missing', src);
    process.exitCode = 1;
    continue;
  }
  copyFileSync(from, join(out, dest));
}
console.log('fonts:', files.map((f) => f[1]).join(', '));
