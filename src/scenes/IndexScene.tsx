import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {Scene} from '../components/Scene';
import {Headline} from '../components/Headline';
import {BigNumber, Kicker} from '../components/BigNumber';
import {GridFloor, Layer, Wipe} from '../components/FX';
import {C, F} from '../theme';
import {clamp01, easeOut, springIn} from '../lib/anim';
import type {SceneProps} from './types';
import {at} from './types';

/** INDEX — the basket collapses into a single number. */
export const IndexScene: React.FC<SceneProps> = ({lines}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tIndex = at(lines, 0, 0.33);
  const tCpi = at(lines, 0, 0.72);
  const tMoM = at(lines, 1, 0.2);

  const collapse = easeOut(clamp01((frame - tIndex) / 34));
  const mom = easeOut(clamp01((frame - tMoM) / 30));
  const s = springIn(frame, fps, tCpi, 150, 16);

  return (
    <Scene hue="mint" intensity={0.65} enter={1}>
      <Layer from={0} to={Math.max(60, tIndex + 30)}>
        <div style={{position: 'absolute', inset: 0, opacity: 0.5}}>
          <GridFloor color={C.mint} />
        </div>
      </Layer>

      <div style={{position: 'absolute', left: '7.5%', right: '7.5%', top: '12%'}}>
        <Kicker text="Satu angka" start={0} color={C.mint} />
      </div>

      {/* collapsing bars */}
      {new Array(26).fill(0).map((_, i) => {
        const x = 8 + (i % 13) * 7;
        const rowi = Math.floor(i / 13);
        const y = 34 + rowi * 7;
        const h = 4.4 * (1 - collapse) * (0.5 + ((i * 13) % 10) / 12);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              width: '5.4%',
              height: `${h}%`,
              borderRadius: 8,
              background: `linear-gradient(180deg, ${C.mint}, rgba(59,227,167,0.2))`,
              opacity: (1 - collapse) * 0.75,
              transform: `translateY(${collapse * 220}px) scaleY(${1 - collapse * 0.4})`,
            }}
          />
        );
      })}

      <div style={{position: 'absolute', left: 0, right: 0, top: '30%', textAlign: 'center', opacity: clamp01((frame - tIndex) / 18)}}>
        <div style={{fontFamily: F.mono, fontSize: 30, letterSpacing: '0.42em', color: 'rgba(247,242,232,0.5)'}}>TOTAL KERANJANG</div>
        <div style={{marginTop: 18, transform: 'scale(0.78)', transformOrigin: 'center top'}}>
          <BigNumber to={106.8} from={100} decimals={2} suffix="" start={tIndex + 6} dur={34} size={300} color={C.paper} />
        </div>
        <div style={{marginTop: -24, fontFamily: F.mono, fontSize: 24, letterSpacing: '0.3em', color: 'rgba(247,242,232,0.35)'}}>INDEKS · TAHUN DASAR 2018 = 100</div>
      </div>

      <div style={{position: 'absolute', left: '7.5%', right: '7.5%', top: '56%', textAlign: 'center', transform: `scale(${0.9 + s * 0.1})`, opacity: clamp01((frame - tCpi) / 14)}}>
        <div style={{display: 'inline-block', border: `1px solid rgba(255,197,49,0.35)`, background: 'rgba(255,197,49,0.06)', borderRadius: 20, padding: '18px 34px'}}>
          <span style={{fontFamily: F.display, fontWeight: 800, fontSize: 74, letterSpacing: '-0.03em', color: C.yellow}}>Indeks Harga Konsumen</span>
        </div>
        <div style={{marginTop: 14, fontFamily: F.mono, fontSize: 24, letterSpacing: '0.34em', color: 'rgba(247,242,232,0.4)'}}>IHK · CONSUMER PRICE INDEX</div>
      </div>

      <div style={{position: 'absolute', left: '7.5%', right: '7.5%', bottom: '19%', opacity: clamp01((frame - tMoM) / 16)}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18}}>
          {[
            {k: 'Bulan lalu', v: '100,00', hi: false},
            {k: 'Bulan ini', v: '101,00', hi: true},
            {k: 'Inflasi bulanan', v: '+1,00%', hi: true},
          ].map((c, i) => (
            <div key={c.k} style={{border: `1px solid ${C.line}`, borderRadius: 18, padding: '22px 20px', background: c.hi ? 'rgba(255,197,49,0.06)' : 'rgba(247,242,232,0.02)', transform: `translateY(${(1 - easeOut(clamp01((frame - tMoM - i * 5) / 22))) * 34}px)`}}>
              <div style={{fontFamily: F.mono, fontSize: 20, letterSpacing: '0.18em', color: 'rgba(247,242,232,0.42)', textTransform: 'uppercase'}}>{c.k}</div>
              <div style={{marginTop: 10, fontFamily: F.display, fontWeight: 800, fontSize: 62, letterSpacing: '-0.04em', color: c.hi ? C.yellow : C.paper}}>{c.v}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop: 18, height: 20, borderRadius: 99, background: 'rgba(247,242,232,0.07)', overflow: 'hidden'}}>
          <div style={{width: `${mom * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.mint}, ${C.yellow})`}} />
        </div>
      </div>
      <Layer from={Math.max(0, tCpi - 4)} to={tCpi + 20}>
        <Wipe dur={18} color={C.mint} />
      </Layer>
    </Scene>
  );
};
