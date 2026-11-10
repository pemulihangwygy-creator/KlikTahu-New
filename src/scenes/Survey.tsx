import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {Scene} from '../components/Scene';
import {Headline} from '../components/Headline';
import {Kicker} from '../components/BigNumber';
import {Bars} from '../components/Chart';
import {Layer} from '../components/FX';
import {C, F} from '../theme';
import {clamp01, easeOut, rand, springIn} from '../lib/anim';
import type {SceneProps} from './types';
import {at} from './types';

/** SURVEY — the machinery behind the number. */
export const Survey: React.FC<SceneProps> = ({lines}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tCount = at(lines, 0, 0.36);
  const tBasket = at(lines, 1, 0.28);

  const countP = easeOut(clamp01((frame - tCount) / 60));
  const cities = Math.round(interpolate(countP, [0, 1], [0, 150]));
  const traders = Math.round(interpolate(countP, [0, 1], [0, 4680]));

  const items = ['Beras', 'Cabai', 'Bensin', 'Sewa', 'Pulsa', 'Telur', 'Minyak', 'Sabun'];

  return (
    <Scene hue="sky" intensity={0.7} enter={1}>
      <div style={{position: 'absolute', left: '7.5%', right: '7.5%', top: '12%'}}>
        <Kicker text="Cara angkanya lahir" start={0} />
      </div>

      <div style={{position: 'absolute', left: '7.5%', right: '7.5%', top: '18%'}}>
        <Headline text="Ribuan pedagang. _Ratusan kota._" start={at(lines, 0) - 10} size={104} maxWidth={1200} />
      </div>

      <div style={{position: 'absolute', left: '7.5%', right: '7.5%', top: '34%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24}}>
        {[
          {v: cities.toLocaleString('id-ID'), label: 'kota & kabupaten', suffix: '+', tint: C.sky},
          {v: traders.toLocaleString('id-ID'), label: 'sampel harga tiap bulan', suffix: '+', tint: C.amber},
        ].map((s, i) => {
          const sp = springIn(frame, fps, tCount + i * 8, 140, 18);
          return (
            <div key={s.label} style={{border: `1px solid ${C.line}`, borderRadius: 22, padding: '26px 28px 22px', background: 'rgba(247,242,232,0.025)', opacity: clamp01(sp * 1.4)}}>
              <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 92, letterSpacing: '-0.05em', color: s.tint, lineHeight: 0.9, fontVariantNumeric: 'tabular-nums'}}>
                {s.v}<span style={{opacity: 0.5, fontSize: 54}}>{s.suffix}</span>
              </div>
              <div style={{marginTop: 10, fontFamily: F.mono, fontSize: 22, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(247,242,232,0.45)'}}>{s.label}</div>
            </div>
          );
        })}
      </div>

      <Layer from={Math.max(0, tCount - 30)} to={tCount + 240}>
        <div style={{position: 'absolute', inset: 0, opacity: 0.9}}>
          <Bars y={1500} h={300} color={C.sky} count={52} />
        </div>
      </Layer>

      {/* survey cards drifting */}
      {items.map((label, i) => {
        const appear = easeOut(clamp01((frame - (tBasket + i * 7)) / 24));
        const col = i % 4;
        const rowi = Math.floor(i / 4);
        return (
          <div
            key={label}
            style={{
              position: 'absolute',
              left: `${8 + col * 22.5}%`,
              top: `${62 + rowi * 9.6}%`,
              width: '19%',
              padding: '18px 16px',
              borderRadius: 14,
              border: `1px solid rgba(247,242,232,0.14)`,
              background: 'rgba(10,8,14,0.55)',
              opacity: appear,
              transform: `translateY(${(1 - appear) * 36}px) rotate(${(rand(i) - 0.5) * 3}deg)`,
              backdropFilter: 'blur(6px)',
            }}
          >
            <div style={{fontFamily: F.mono, fontSize: 20, letterSpacing: '0.18em', color: 'rgba(247,242,232,0.4)'}}>HARGA</div>
            <div style={{fontFamily: F.display, fontWeight: 700, fontSize: 40, color: C.paper, letterSpacing: '-0.02em'}}>{label}</div>
          </div>
        );
      })}
    </Scene>
  );
};
