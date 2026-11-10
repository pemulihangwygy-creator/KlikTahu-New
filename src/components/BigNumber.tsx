import {useCurrentFrame} from 'remotion';
import {C, F} from '../theme';
import {springIn, easeOut} from '../lib/anim';
import {interpolate} from 'remotion';

/** Odometer-style number with a comma decimal, ID locale. */
export const BigNumber: React.FC<{
  to: number;
  from?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  start?: number;
  dur?: number;
  size?: number;
  color?: string;
  weight?: number;
  mono?: boolean;
  prefixSize?: number;
  suffixSize?: number;
}> = ({to, from = 0, decimals = 2, suffix = '%', prefix = '', start = 0, dur = 40, size = 300, color = C.paper, weight = 800, mono = false, prefixSize = 0.4, suffixSize = 0.34}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOut,
  });
  const v = from + (to - from) * p;
  const [int, dec] = v.toFixed(decimals).split('.');
  const intFmt = Number(int).toLocaleString('id-ID');
  return (
    <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'center', whiteSpace: 'nowrap', fontFamily: mono ? F.mono : F.display, fontWeight: weight, color, letterSpacing: '-0.05em', lineHeight: 0.9, fontSize: size, fontVariantNumeric: 'tabular-nums'}}>
      {prefix ? <span style={{fontSize: size * prefixSize, marginRight: size * 0.015, color: C.muted}}>{prefix}</span> : null}
      <span>{intFmt}</span>
      {decimals > 0 ? (
        <>
          <span style={{opacity: 0.5, margin: `0 ${size * 0.012}px`}}>,</span>
          <span>{dec}</span>
        </>
      ) : null}
      <span style={{fontSize: size * suffixSize, marginLeft: size * 0.012, color: C.amber, fontWeight: 700, letterSpacing: 0}}>{suffix}</span>
    </div>
  );
};

export const Kicker: React.FC<{text: string; start?: number; color?: string; size?: number}> = ({
  text,
  start = 0,
  color = C.amber,
  size = 30,
}) => {
  const frame = useCurrentFrame();
  const s = springIn(frame, 90, start, 160, 22);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size * 0.5,
        fontFamily: F.mono,
        fontSize: size,
        letterSpacing: '0.26em',
        textTransform: 'uppercase',
        color,
        opacity: s,
        transform: `translateX(${(1 - s) * -30}px)`,
      }}
    >
      <span style={{width: size * 2, height: 3, background: color, display: 'block', opacity: 0.8}} />
      {text}
    </div>
  );
};
