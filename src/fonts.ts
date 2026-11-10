import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

/**
 * Self-hosted variable fonts. loadFont() registers the FontFace and its
 * delayRender handle, so the first frame is only rendered once type is ready.
 */
const FACES = [
  {family: 'Bricolage Grotesque Variable', file: 'fonts/bricolage-var.woff2', weight: '200 800'},
  {family: 'Plus Jakarta Sans Variable', file: 'fonts/jakarta-var.woff2', weight: '200 800'},
  {family: 'JetBrains Mono Variable', file: 'fonts/jetbrains-var.woff2', weight: '200 800'},
];

let started = false;

export const useFonts = () => {
  if (started) return;
  started = true;
  for (const f of FACES) {
    loadFont({
      family: f.family,
      url: staticFile(f.file),
      weight: f.weight,
      format: 'woff2',
    });
  }
};

/** Kept for studio previews where a <style> block is handy. */
export const FONT_CSS = FACES.map(
  (f) =>
    `@font-face{font-family:'${f.family}';src:url('${staticFile(f.file)}') format('woff2-variations');font-weight:${f.weight};font-style:normal;font-display:block;}`,
).join('\n');
