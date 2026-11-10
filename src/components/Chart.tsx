import {useCurrentFrame} from 'remotion';
import {C, F} from '../theme';
import {clamp01, easeOut, rand} from '../lib/anim';
import {interpolate} from 'remotion';

type Point = {label: string; value: number; note?: string};

/** Baseline grid + axis labels for a 0..max chart. */
const Grid: React.FC<{max: number; ticks: number[]; x: number; y: number; w: number; h: number; unit: string}> = ({
  ticks,
  max,
  x,
  y,
  w,
  h,
  unit,
}) => (
  <>
    {ticks.map((t) => {
      const yy = y + h - (t / max) * h;
      return (
        <div key={t}>
          <div style={{position: 'absolute', left: x, top: yy, width: w, height: 1, background: 'rgba(247,242,232,0.09)'}} />
          <div
            style={{
              position: 'absolute',
              left: x - 22,
              top: yy,
              transform: 'translate(-100%,-50%)',
              fontFamily: F.mono,
              fontSize: 26,
              color: 'rgba(247,242,232,0.38)',
            }}
          >
            {t}
            {unit}
          </div>
        </div>
      );
    })}
  </>
);

export const BarChart: React.FC<{
  series: Point[];
  progress: number;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  max?: number;
  ticks?: number[];
  unit?: string;
  highlight?: number;
  compare?: number;
  showValues?: boolean;
  gap?: number;
}> = ({
  series,
  progress,
  x = 150,
  y = 900,
  w = 1140,
  h = 760,
  max = 6,
  ticks = [0, 2, 4, 6],
  unit = '%',
  highlight,
  compare,
  showValues = true,
  gap = 26,
}) => {
  const bw = (w - gap * (series.length - 1)) / series.length;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Grid max={max} ticks={ticks} x={x} y={y} w={w} h={h} unit={unit} />
      <div style={{position: 'absolute', left: x, top: y + h, width: w, height: 2, background: 'rgba(247,242,232,0.26)'}} />
      {series.map((p, i) => {
        const local = clamp01((progress - i * 0.045) / 0.55);
        const grow = easeOut(local);
        const bh = (p.value / max) * h * grow;
        const isHi = highlight === i;
        const isCompare = compare === i;
        const left = x + i * (bw + gap);
        return (
          <div key={p.label}>
            <div
              style={{
                position: 'absolute',
                left,
                top: y + h - bh,
                width: bw,
                height: bh,
                borderRadius: `${Math.min(18, bw * 0.16)}px ${Math.min(18, bw * 0.16)}px 4px 4px`,
                background: isHi
                  ? `linear-gradient(180deg, ${C.yellow}, ${C.orange})`
                  : isCompare
                    ? `linear-gradient(180deg, ${C.mint}, rgba(59,227,167,0.45))`
                    : 'linear-gradient(180deg, rgba(247,242,232,0.5), rgba(247,242,232,0.14))',
                boxShadow: isHi ? `0 0 70px rgba(255,150,40,0.35)` : undefined,
              }}
            />
            {showValues ? (
              <div
                style={{
                  position: 'absolute',
                  left,
                  width: bw,
                  top: y + h - bh - 52,
                  textAlign: 'center',
                  fontFamily: F.display,
                  fontWeight: 800,
                  fontSize: 40,
                  letterSpacing: '-0.03em',
                  color: isHi ? C.yellow : isCompare ? C.mint : 'rgba(247,242,232,0.72)',
                  opacity: local,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {p.value.toFixed(2).replace('.', ',')}
              </div>
            ) : null}
            <div
              style={{
                position: 'absolute',
                left,
                width: bw,
                top: y + h + 22,
                textAlign: 'center',
                fontFamily: F.mono,
                fontSize: 30,
                letterSpacing: '0.06em',
                color: isHi ? C.yellow : 'rgba(247,242,232,0.5)',
              }}
            >
              {p.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** One enormous spike (1998) with a thin frame — the chart becomes the wall. */
export const SpikeChart: React.FC<{progress: number; peak?: number; label?: string}> = ({
  progress,
  peak = 77.63,
  label = '1998',
}) => {
  const frame = useCurrentFrame();
  const max = 80;
  const baseY = 1930;
  const topY = 700;
  const h = baseY - topY;
  const grow = easeOut(clamp01(progress / 0.7));
  const spikes = [
    {l: '1997', v: 11.6},
    {l: '1998', v: peak},
    {l: '1999', v: 2.0},
    {l: '2000', v: 9.3},
  ];
  const bw = 190;
  const gap = 70;
  const startX = 210;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      {[0, 20, 40, 60, 80].map((t) => {
        const yy = baseY - (t / max) * h;
        return (
          <div key={t}>
            <div style={{position: 'absolute', left: 150, top: yy, width: 1140, height: 1, background: 'rgba(247,242,232,0.08)'}} />
            <div style={{position: 'absolute', left: 128, top: yy, transform: 'translate(-100%,-50%)', fontFamily: F.mono, fontSize: 24, color: 'rgba(247,242,232,0.35)'}}>{t}%</div>
          </div>
        );
      })}
      {spikes.map((s, i) => {
        const local = easeOut(clamp01((progress - i * 0.06) / 0.6));
        const bh = (s.v / max) * h * local;
        const isPeak = i === 1;
        return (
          <div key={s.l}>
            <div
              style={{
                position: 'absolute',
                left: startX + i * (bw + gap),
                top: baseY - bh,
                width: bw,
                height: bh,
                background: isPeak
                  ? `repeating-linear-gradient(180deg, ${C.red} 0 14px, ${C.deepOrange} 14px 28px)`
                  : 'rgba(247,242,232,0.22)',
                borderRadius: '10px 10px 0 0',
                boxShadow: isPeak ? `0 0 120px rgba(255,68,56,${0.25 + 0.1 * Math.sin(frame / 9)})` : undefined,
              }}
            />
            <div style={{position: 'absolute', left: startX + i * (bw + gap), width: bw, top: baseY + 18, textAlign: 'center', fontFamily: F.mono, fontSize: 30, color: isPeak ? C.red : 'rgba(247,242,232,0.45)'}}>{s.l}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 150, top: baseY, width: 1140, height: 2, background: 'rgba(247,242,232,0.3)'}} />
    </div>
  );
};

/** Horizontal comparison bars with animated widths. */
export const HBars: React.FC<{
  rows: {label: string; value: number; hi?: boolean; note?: string}[];
  progress: number;
  max?: number;
  x?: number;
  y?: number;
  w?: number;
  rowH?: number;
  unit?: string;
  size?: number;
}> = ({rows, progress, max = 80, x = 150, y = 980, w = 1140, rowH = 150, unit = '%', size = 62}) => {
  return (
    <div style={{position: 'absolute', inset: 0}}>
      {rows.map((r, i) => {
        const local = easeOut(clamp01((progress - i * 0.08) / 0.6));
        const bw = (r.value / max) * w * local;
        const yy = y + i * rowH;
        return (
          <div key={r.label} style={{position: 'absolute', left: x, top: yy, width: w}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: F.mono, fontSize: 28, letterSpacing: '0.14em', color: r.hi ? C.yellow : 'rgba(247,242,232,0.55)', textTransform: 'uppercase'}}>
              <span>{r.label}</span>
              <span style={{color: r.hi ? C.yellow : 'rgba(247,242,232,0.75)'}}>
                {r.value.toFixed(2).replace('.', ',')}
                {unit}
              </span>
            </div>
            <div style={{marginTop: 14, width: w, height: size, background: 'rgba(247,242,232,0.06)', borderRadius: 12, overflow: 'hidden'}}>
              <div
                style={{
                  width: bw,
                  height: '100%',
                  borderRadius: 12,
                  background: r.hi
                    ? `linear-gradient(90deg, ${C.deepOrange}, ${C.orange}, ${C.yellow})`
                    : `linear-gradient(90deg, rgba(247,242,232,0.35), rgba(247,242,232,0.12))`,
                  boxShadow: r.hi ? '0 0 60px rgba(255,140,30,0.4)' : undefined,
                }}
              />
            </div>
            {r.note ? <div style={{marginTop: 12, fontFamily: F.body, fontSize: 28, color: 'rgba(247,242,232,0.42)'}}>{r.note}</div> : null}
          </div>
        );
      })}
    </div>
  );
};

/** Decorative equalizer bars, for survey/collection scenes. */
export const Bars: React.FC<{count?: number; y?: number; h?: number; x?: number; w?: number; speed?: number; color?: string}> = ({
  count = 46,
  y = 1500,
  h = 380,
  x = 150,
  w = 1140,
  speed = 0.11,
  color = C.amber,
}) => {
  const frame = useCurrentFrame();
  const bw = w / count - 6;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      {new Array(count).fill(0).map((_, i) => {
        const n = 0.35 + 0.65 * Math.abs(Math.sin(i * 0.7 + frame * speed) * Math.cos(i * 0.21 - frame * speed * 0.6));
        const bh = Math.max(10, n * h);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + i * (bw + 6),
              top: y + h - bh,
              width: bw,
              height: bh,
              borderRadius: 3,
              background: `linear-gradient(180deg, ${color}, transparent)`,
              opacity: 0.24 + rand(i) * 0.4,
            }}
          />
        );
      })}
    </div>
  );
};

/** A price tag that slides; used for basket items. */
export const PriceTag: React.FC<{label: string; price: string; up: boolean; delay: number; x: number; y: number}> = ({label, price, up, delay, x, y}) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - delay) / 22);
  const e = easeOut(p);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity: e,
        transform: `translateY(${(1 - e) * 40}px)`,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <div style={{fontFamily: F.mono, fontSize: 26, letterSpacing: '0.14em', color: 'rgba(247,242,232,0.55)', textTransform: 'uppercase'}}>{label}</div>
      <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
        <span style={{fontFamily: F.display, fontWeight: 800, fontSize: 54, color: C.paper, letterSpacing: '-0.02em'}}>{price}</span>
        <span style={{color: up ? C.red : C.mint, fontSize: 34, fontFamily: F.mono}}>{up ? '▲' : '▼'}</span>
      </div>
    </div>
  );
};

/** Thin sparkline used as a background motif. */
export const Sparkline: React.FC<{points?: number[]; progress: number; color?: string; w?: number; h?: number; x?: number; y?: number; stroke?: number}> = ({
  points = [4, 6, 5, 9, 8, 12, 11, 16, 14, 19, 18, 26, 22, 31],
  progress,
  color = C.amber,
  w = 1100,
  h = 300,
  x = 170,
  y = 1700,
  stroke = 4,
}) => {
  const max = Math.max(...points);
  const d = points
    .map((v, i) => {
      const px = (i / (points.length - 1)) * w;
      const py = h - (v / max) * h * easeOut(clamp01((progress * 1.4 - i / points.length * 0.4) / 0.6));
      return `${i === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg style={{position: 'absolute', left: x, top: y, overflow: 'visible'}} width={w} height={h}>
      <path d={d} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
