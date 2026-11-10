import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {Scene} from '../components/Scene';
import {Headline} from '../components/Headline';
import {BigNumber, Kicker} from '../components/BigNumber';
import {BarChart} from '../components/Chart';
import {GridFloor, Layer, LightSweep} from '../components/FX';
import {C, F} from '../theme';
import {clamp01, easeOut, springIn} from '../lib/anim';
import {FACTS} from '../data/facts';
import type {SceneProps} from './types';
import {at} from './types';

/** CONTRAST — 2024 record low, then 2025 edges back up. */
export const Contrast: React.FC<SceneProps> = ({lines}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tLow = at(lines, 0, 0.34);
  const tSince = at(lines, 0, 0.74);
  const t2025 = at(lines, 1, 0.3);

  const lowIn = springIn(frame, fps, tLow, 140, 15);
  const p = easeOut(clamp01((frame - per(lines, 0)) / 90));
  const rise = easeOut(clamp01((frame - t2025) / 40));

  return (
    <Scene hue="mint" intensity={0.8} enter={1}>
      <Layer from={0} to={t2025 + 40}>
        <div style={{position: 'absolute', inset: 0, opacity: 0.35 * (1 - rise)}}>
          <GridFloor color={C.mint} opacity={0.5} />
        </div>
        <LightSweep opacity={0.1} />
      </Layer>

      <div style={{position: 'absolute', left: '7.5%', right: '7.5%', top: '12%'}}>
        <Kicker text="Dua wajah inflasi" start={0} color={C.mint} />
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: '17%', textAlign: 'center'}}>
        <Headline text="Dari **terendah** sejak 1958." start={at(lines, 0) - 6} size={96} align="center" />
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: '31%', textAlign: 'center', transform: `scale(${0.86 + lowIn * 0.14})`, opacity: clamp01(lowIn * 1.4)}}>
        <div style={{fontFamily: F.mono, fontSize: 28, letterSpacing: '0.4em', color: 'rgba(59,227,167,0.85)'}}>INFLASI 2024</div>
        <div style={{filter: 'drop-shadow(0 0 60px rgba(59,227,167,0.3))'}}>
          <BigNumber to={1.57} decimals={2} start={tLow} dur={40} size={280} color={C.paper} />
        </div>
        <div style={{display: 'inline-block', marginTop: 12, padding: '10px 24px', borderRadius: 99, background: 'rgba(59,227,167,0.14)', border: '1px solid rgba(59,227,167,0.35)', fontFamily: F.mono, fontSize: 24, letterSpacing: '0.22em', color: C.mint}}>
          TERENDAH SEJAK {FACTS.lowestSince}
        </div>
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: '61%', textAlign: 'center', opacity: clamp01((frame - tSince) / 20)}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 30}}>
          <div style={{fontFamily: F.mono, fontSize: 24, letterSpacing: '0.3em', color: 'rgba(247,242,232,0.4)'}}>2024</div>
          <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 64, color: 'rgba(247,242,232,0.35)'}}>→</div>
          <div style={{fontFamily: F.mono, fontSize: 24, letterSpacing: '0.3em', color: 'rgba(247,242,232,0.4)'}}>2025</div>
        </div>
        <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 150, letterSpacing: '-0.05em', color: C.yellow, transform: `scale(${1 + rise * 0.02})`, opacity: clamp01(rise * 1.3)}}>
          {FACTS.latest.toFixed(2).replace('.', ',')}%
        </div>
        <div style={{fontFamily: F.mono, fontSize: 22, letterSpacing: '0.24em', color: 'rgba(247,242,232,0.35)', opacity: clamp01(rise)}}>DESEMBER 2025 · BPS</div>
      </div>

      <div style={{position: 'absolute', left: '7.5%', right: '7.5%', bottom: '20%', opacity: clamp01((frame - t2025) / 24)}}>
        <Layer from={0} to={400}>
          <div style={{position: 'relative', height: 260, marginTop: 10}}>
            <BarChart
              series={[
                {label: '2022', value: 5.51},
                {label: '2023', value: 2.61},
                {label: '2024', value: 1.57},
                {label: '2025', value: 2.92},
              ]}
              progress={p}
              x={10}
              y={20}
              w={1100}
              h={170}
              max={6}
              ticks={[0, 3, 6]}
              highlight={3}
              compare={2}
              gap={40}
            />
          </div>
        </Layer>
      </div>
    </Scene>
  );
};

const per = (lines: {start: number; dur: number}[], i: number) => lines[i]?.start ?? 0;
