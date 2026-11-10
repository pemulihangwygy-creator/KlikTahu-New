import {useCurrentFrame} from 'remotion';
import {C, F} from '../theme';
import {springIn} from '../lib/anim';

type Seg = {t: string; hi?: boolean; dim?: boolean};

export const parse = (raw: string): Seg[] =>
  raw.split(' ').map((t) => {
    if (t.startsWith('**') && t.endsWith('**')) return {t: t.slice(2, -2), hi: true};
    if (t.startsWith('_') && t.endsWith('_')) return {t: t.slice(1, -1), dim: true};
    return {t};
  });

/** Word-by-word masked reveal with a keyword highlight. */
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
        maxWidth,
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
        const hi = w.hi;
        return (
          <span key={i} style={{display: 'inline-block', overflow: 'hidden', paddingBottom: size * 0.06}}>
            <span
              style={{
                display: 'inline-block',
                transform: `translateY(${(1 - s) * 104}%) rotate(${(1 - s) * 3}deg)`,
                opacity: s,
                color: hi ? C.yellow : w.dim ? C.muted : color,
                position: 'relative',
                ...(hi
                  ? {
                      textShadow: '0 0 42px rgba(255,174,31,0.35)',
                    }
                  : null),
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
