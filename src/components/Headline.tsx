import {useCurrentFrame} from 'remotion';
import {C, F} from '../theme';
import {springPop, clamp01, prog} from '../lib/anim';

type Seg = {t: string; hi?: boolean; dim?: boolean};

/**
 * Tiny inline markup: **highlight** and _muted_. Highlights may span
 * several words, so this tokenizes the whole string instead of words.
 */
export const parse = (raw: string): Seg[] => {
  const out: Seg[] = [];
  const rx = /(\*\*[^*]+\*\*|_[^_]+_)/g;
  let last = 0;
  for (const m of raw.matchAll(rx)) {
    const i = m.index ?? 0;
    if (i > last) out.push({t: raw.slice(last, i)});
    const token = m[0];
    if (token.startsWith('**')) out.push({t: token.slice(2, -2), hi: true});
    else out.push({t: token.slice(1, -1), dim: true});
    last = i + token.length;
  }
  if (last < raw.length) out.push({t: raw.slice(last)});
  // split into words but remember which words are highlighted
  const words: Seg[] = [];
  for (const seg of out) {
    seg.t.split(/(\s+)/).forEach((piece) => {
      if (!piece) return;
      if (/^\s+$/.test(piece)) return;
      words.push({t: piece, hi: seg.hi, dim: seg.dim});
    });
  }
  return words;
};

/**
 * V2 kinetic headline: each word springs in from below with rotation and a
 * scale overshoot; highlighted words get a warm gradient + a sweep underline.
 */
export const Headline: React.FC<{
  text: string;
  start?: number;
  size?: number;
  weight?: number;
  align?: 'left' | 'center';
  color?: string;
  maxWidth?: number;
  line?: number;
  per?: number;
}> = ({text, start = 0, size = 108, weight = 800, align = 'left', color = C.paper, maxWidth = 1180, line = 1.04, per = 2.6}) => {
  const frame = useCurrentFrame();
  const words = parse(text);
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: `0 ${size * 0.26}px`,
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        width: '100%',
        maxWidth,
        margin: align === 'center' ? '0 auto' : undefined,
        fontFamily: F.display,
        fontWeight: weight,
        fontSize: size,
        lineHeight: line,
        letterSpacing: '-0.03em',
        color,
        textAlign: align,
      }}
    >
      {words.map((w, i) => {
        const delay = start + i * per;
        const s = springPop(frame, 90, delay, 'bouncy');
        const rise = clamp01(s * 1.4);
        const underline = w.hi ? prog(frame, delay + 6, 26) : 0;
        return (
          <span key={i} style={{display: 'inline-block', overflow: 'hidden', paddingBottom: size * 0.1, marginBottom: size * -0.04}}>
            <span
              style={{
                position: 'relative',
                display: 'inline-block',
                transform: `translateY(${(1 - rise) * 112}%) rotate(${(1 - rise) * 4}deg) scale(${0.86 + s * 0.14})`,
                transformOrigin: '0% 100%',
                opacity: clamp01(rise * 1.8),
                background: w.hi ? `linear-gradient(100deg, ${C.yellow} 10%, ${C.orange} 90%)` : undefined,
                WebkitBackgroundClip: w.hi ? 'text' : undefined,
                backgroundClip: w.hi ? 'text' : undefined,
                color: w.hi ? 'transparent' : w.dim ? C.muted : color,
              }}
            >
              {w.t}
              {w.hi ? (
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: size * 0.02,
                    height: Math.max(4, size * 0.055),
                    width: `${underline * 100}%`,
                    borderRadius: 99,
                    background: `linear-gradient(90deg, ${C.yellow}, ${C.orange})`,
                    boxShadow: `0 0 24px rgba(255,174,31,0.55)`,
                  }}
                />
              ) : null}
            </span>
          </span>
        );
      })}
    </div>
  );
};
