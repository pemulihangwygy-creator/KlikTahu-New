import {useCurrentFrame} from 'remotion';
import {C, F} from '../theme';
import {springIn} from '../lib/anim';

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

/** Word-by-word masked reveal with keyword highlighting. */
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
}> = ({text, start = 0, size = 108, weight = 800, align = 'left', color = C.paper, maxWidth = 1180, line = 1.02, per = 2.4}) => {
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
        const s = springIn(frame, 90, start + i * per, 150, 20);
        return (
          <span key={i} style={{display: 'inline-block', overflow: 'hidden', paddingBottom: size * 0.06}}>
            <span
              style={{
                display: 'inline-block',
                transform: `translateY(${(1 - s) * 104}%) rotate(${(1 - s) * 3}deg)`,
                opacity: s,
                color: w.hi ? C.yellow : w.dim ? C.muted : color,
                textShadow: w.hi ? '0 0 42px rgba(255,174,31,0.35)' : undefined,
              }}
            >
              {w.t}
            </span>
          </span>
        );
      })}
    </div>
  );
};
