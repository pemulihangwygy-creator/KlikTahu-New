import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {Scene} from '../components/Scene';
import {Headline} from '../components/Headline';
import {BigNumber, Kicker} from '../components/BigNumber';
import {SpikeChart} from '../components/Chart';
import {Burst, CircleMask, Flash, Layer} from '../components/FX';
import {C, F} from '../theme';
import {clamp01, easeOut, rand, springIn} from '../lib/anim';
import {FACTS, SOURCES} from '../data/facts';
import type {SceneProps} from './types';
import {at} from './types';

/** CRISIS — 1998. The number that still hurts. */
export const Crisis: React.FC<SceneProps> = ({lines}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t98 = at(lines, 1);
  const tNum = at(lines, 2, 0.12);
  const tDouble = at(lines, 3, 0.1);

  const slam = springIn(frame, fps, tNum, 230, 12);
  const shake = frame > tNum ? Math.sin((frame - tNum) * 1.9) * Math.max(0, 14 - (frame - tNum) * 0.35) : 0;
  const val = interpolate(frame, [tNum, tNum + 46], [0, FACTS.crisis1998], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOut,
  });
  const chartP = easeOut(clamp01((frame - t98) / 120));
  const doubleP = easeOut(clamp01((frame - tDouble) / 50));

  return (
    <Scene hue="red" intensity={1.15} enter={1}>
      <Layer from={Math.max(0, tNum - 2)} to={tNum + 16}>
        <Flash color={C.red} peak={0.32} dur={18} />
      </Layer>
      <Layer from={Math.max(0, tNum - 8)} to={tNum + 40}>
        <Burst count={44} color={C.red} z={1} />
      </Layer>

      <div style={{position: 'absolute', left: '7.5%', right: '7.5%', top: '12%'}}>
        <Kicker text="Krisis moneter" start={t98} color={C.red} />
      </div>

      <div style={{position: 'absolute', left: '7.5%', right: '7.5%', top: '17%', transform: `translateX(${shake}px)`}}>
        <Headline text="**1998.** Rupiah jatuh. Harga meledak." start={t98 + 4} size={104} maxWidth={1240} />
      </div>

      <div style={{position: 'absolute', inset: 0, opacity: clamp01((frame - t98) / 20) * 0.78, zIndex: 0}}>
        <SpikeChart progress={chartP} peak={FACTS.crisis1998} />
      </div>

      <CircleMask size={740} top={'40%'} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '40%',
          textAlign: 'center',
          transform: `scale(${0.72 + slam * 0.28}) translateX(${shake * 0.7}px)`,
          opacity: clamp01(slam * 1.5),
          zIndex: 4,
        }}
      >
        <div style={{fontFamily: F.mono, fontSize: 28, letterSpacing: '0.44em', color: 'rgba(255,120,100,0.85)'}}>INFLASI TAHUNAN 1998</div>
        <div style={{marginTop: 18, filter: `drop-shadow(0 0 ${70 * slam}px rgba(255,68,56,0.45))`}}>
          <BigNumber to={FACTS.crisis1998} decimals={2} start={tNum} dur={46} size={300} color={C.paper} />
        </div>
        <div style={{marginTop: 4, fontFamily: F.mono, fontSize: 24, letterSpacing: '0.3em', color: 'rgba(247,242,232,0.4)'}}>BUKAN SALAH KETIK · {SOURCES.bps1998.split('—')[1]?.trim()}</div>
      </div>

      <div style={{position: 'absolute', left: '7.5%', right: '7.5%', bottom: '19%', opacity: clamp01((frame - tDouble) / 18)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
          {[
            {k: 'Harga awal', v: '100', o: 1},
            {k: 'Setahun kemudian', v: '178', o: doubleP},
          ].map((c) => (
            <div key={c.k} style={{flex: 1, border: `1px solid rgba(255,68,56,0.25)`, background: 'rgba(255,68,56,0.05)', borderRadius: 18, padding: '22px 24px', opacity: c.o}}>
              <div style={{fontFamily: F.mono, fontSize: 20, letterSpacing: '0.18em', color: 'rgba(247,242,232,0.42)', textTransform: 'uppercase'}}>{c.k}</div>
              <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 72, letterSpacing: '-0.05em', color: C.paper, lineHeight: 1}}>{c.v}</div>
            </div>
          ))}
          <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 76, color: C.red, opacity: doubleP, transform: `scale(${0.8 + doubleP * 0.2})`}}>≈ ×2</div>
        </div>
      </div>
    </Scene>
  );
};
