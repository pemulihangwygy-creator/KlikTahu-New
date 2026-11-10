import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {Scene} from '../components/Scene';
import {Headline} from '../components/Headline';
import {Kicker} from '../components/BigNumber';
import {BarChart} from '../components/Chart';
import {C, F} from '../theme';
import {clamp01, easeOut} from '../lib/anim';
import {Layer} from '../components/FX';
import {FACTS} from '../data/facts';
import type {SceneProps} from './types';
import {at} from './types';

/** CHART — from one month's number to the year-over-year view. */
export const Chart: React.FC<SceneProps> = ({lines}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tYoy = at(lines, 1, 0.06);
  const tBars = at(lines, 1, 0.42);

  const series = FACTS.yearly.map((y) => ({label: String(y.year), value: y.value}));
  const p = interpolate(frame, [tBars, tBars + 150], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOut,
  });

  return (
    <Scene hue="sky" intensity={0.75} enter={1}>
      <div style={{position: 'absolute', left: '7.5%', right: '7.5%', top: '12%'}}>
        <Kicker text="Setahun ke setahun" start={0} color={C.sky} />
      </div>
      <div style={{position: 'absolute', left: '7.5%', right: '7.5%', top: '17%'}}>
        <Headline text="Bandingkan **setahun** ke setahun." start={at(lines, 0) - 6} size={92} maxWidth={1220} />
      </div>

      <Layer from={tYoy - 10} to={tBars + 200}>
        <div style={{position: 'absolute', left: '7.5%', right: '7.5%', top: '33%', textAlign: 'center', opacity: clamp01((frame - tYoy) / 16)}}>
          <div style={{fontFamily: F.mono, fontSize: 28, letterSpacing: '0.4em', color: 'rgba(247,242,232,0.45)'}}>YEAR-ON-YEAR · Y-O-Y</div>
          <div style={{marginTop: 18, fontFamily: F.display, fontWeight: 800, fontSize: 150, letterSpacing: '-0.05em', color: C.paper}}>
            Des 2024 <span style={{color: C.amber}}>→</span> Des 2025
          </div>
          <div style={{marginTop: 6, fontFamily: F.mono, fontSize: 26, color: 'rgba(247,242,232,0.4)'}}>IHK 106,80 → 109,92 · sumber BPS</div>
        </div>
      </Layer>

      <div style={{position: 'absolute', inset: 0, opacity: clamp01((frame - tBars + 20) / 30)}}>
        <BarChart
          series={series}
          progress={p}
          x={150}
          y={1080}
          w={1140}
          h={620}
          max={6}
          ticks={[0, 2, 4, 6]}
          highlight={6}
          compare={5}
        />
        <div style={{position: 'absolute', left: 150, top: 1780, fontFamily: F.mono, fontSize: 22, letterSpacing: '0.16em', color: 'rgba(247,242,232,0.32)'}}>
          INFLASI TAHUNAN DESEMBER · BPS
        </div>
      </div>

      <Layer from={tBars + 40} to={tBars + 240}>
        <div style={{position: 'absolute', left: '7.5%', right: '7.5%', bottom: '20%', display: 'flex', gap: 24, justifyContent: 'center'}}>
          {[
            {k: 'Tertinggi', v: '5,51%', note: '2022', c: C.red},
            {k: 'Terendah', v: '1,57%', note: '2024', c: C.mint},
            {k: 'Terbaru', v: '2,92%', note: '2025', c: C.yellow},
          ].map((s, i) => (
            <div key={s.k} style={{flex: 1, border: `1px solid ${C.line}`, borderRadius: 18, padding: '20px 22px', background: 'rgba(247,242,232,0.025)', opacity: clamp01((frame - tBars - 40 - i * 8) / 18)}}>
              <div style={{fontFamily: F.mono, fontSize: 20, letterSpacing: '0.18em', color: 'rgba(247,242,232,0.4)', textTransform: 'uppercase'}}>{s.k}</div>
              <div style={{marginTop: 8, fontFamily: F.display, fontWeight: 800, fontSize: 64, letterSpacing: '-0.04em', color: s.c}}>{s.v}</div>
              <div style={{fontFamily: F.mono, fontSize: 22, color: 'rgba(247,242,232,0.35)'}}>{s.note}</div>
            </div>
          ))}
        </div>
      </Layer>
    </Scene>
  );
};
