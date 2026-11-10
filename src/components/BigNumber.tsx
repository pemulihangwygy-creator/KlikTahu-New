import {useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import {Trail} from '@remotion/motion-blur';
import {C, F, SPRING} from '../theme';
import {easeOut, clamp01} from '../lib/anim';

/**
 * V2 odometer number: counts up with a motion-blur trail while moving, then
 * lands with a spring pop + a brief chromatic-aberration flash. ID locale,
 * properly scaled decimal comma.
 */
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
  blur?: boolean;
}> = ({
  to,
  from = 0,
  decimals = 2,
  suffix = '%',
  prefix = '',
  start = 0,
  dur = 40,
  size = 300,
  color = C.paper,
  weight = 800,
  mono = false,
  prefixSize = 0.4,
  suffixSize = 0.34,
  blur = true,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOut,
  });
  const v = from + (to - from) * p;
  const [int, dec] = v.toFixed(decimals).split('.');
  const intFmt = Number(int).toLocaleString('id-ID');

  // landing: spring pop right when the count finishes, plus chromatic flash
  const land = spring({frame: frame - (start + dur), fps, config: SPRING.bouncy});
  const landK = clamp01(land);
  const flash = frame > start + dur ? clamp01(1 - (frame - (start + dur)) / 22) : 0;

  const body = (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
        fontFamily: mono ? F.mono : F.display,
        fontWeight: weight,
        color,
        letterSpacing: '-0.05em',
        lineHeight: 0.9,
        fontSize: size,
        fontVariantNumeric: 'tabular-nums',
        transform: `scale(${1 + (landK - 1) * 0.12})`,
        textShadow: flash > 0 ? `${-7 * flash}px 0 rgba(99,199,255,${0.75 * flash}), ${7 * flash}px 0 rgba(255,68,56,${0.75 * flash}), 0 0 ${60 * flash}px rgba(255,220,150,${0.5 * flash})` : undefined,
      }}
    >
      {prefix ? <span style={{fontSize: size * prefixSize, marginRight: size * 0.015, color: C.muted}}>{prefix}</span> : null}
      <span>{intFmt}</span>
      {decimals > 0 ? (
        <>
          <span style={{fontSize: size * 0.34, opacity: 0.72, margin: `0 ${size * 0.005}px`}}>,</span>
          <span>{dec}</span>
        </>
      ) : null}
      <span style={{fontSize: size * suffixSize, marginLeft: size * 0.012, color: C.amber, fontWeight: 700, letterSpacing: 0}}>{suffix}</span>
    </div>
  );

  if (!blur) return body;
  // trail only while the number is actually changing
  return (
    <Trail layers={Math.min(6, Math.max(2, Math.round(dur / 9)))} lagInFrames={2} trailOpacity={0.22}>
      {body}
    </Trail>
  );
};

export const Kicker: React.FC<{text: string; start?: number; color?: string; size?: number}> = ({
  text,
  start = 0,
  color = C.amber,
  size = 30,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - start, fps, config: SPRING.snappy});
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
        opacity: clamp01(s * 1.6),
        transform: `translateX(${(1 - s) * -36}px)`,
      }}
    >
      <span style={{width: size * 2, height: 3, background: color, display: 'block', opacity: 0.8, borderRadius: 2, boxShadow: `0 0 14px ${color}`}} />
      {text}
    </div>
  );
};
