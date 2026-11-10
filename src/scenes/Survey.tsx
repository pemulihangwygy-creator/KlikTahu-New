import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {Scene} from '../components/Scene';
import {Headline} from '../components/Headline';
import {Kicker} from '../components/BigNumber';
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
          {v: cities.toLocaleString('id-ID'), label: 'kota & kabupaten', suffix: '+', tint: C.sky, icon: 'city'},
          {v: traders.toLocaleString('id-ID'), label: 'sampel harga tiap bulan', suffix: '+', tint: C.amber, icon: 'tag'},
        ].map((s, i) => {
          const sp = springIn(frame, fps, tCount + i * 8, 140, 18);
          return (
            <div key={s.label} style={{position: 'relative', border: `1px solid ${C.line}`, borderRadius: 22, padding: '26px 28px 22px', background: 'rgba(247,242,232,0.025)', opacity: clamp01(sp * 1.4), overflow: 'hidden'}}>
              <svg width="54" height="54" viewBox="0 0 48 48" fill="none" style={{position: 'absolute', right: 22, top: 22, opacity: 0.5}}>
                {s.icon === 'city' ? (
                  <>
                    <rect x="6" y="18" width="12" height="24" stroke={s.tint} strokeWidth="3" />
                    <rect x="20" y="10" width="12" height="32" stroke={s.tint} strokeWidth="3" />
                    <rect x="34" y="24" width="8" height="18" stroke={s.tint} strokeWidth="3" />
                  </>
                ) : (
                  <>
                    <path d="M26 6H40V20L22 38L8 24L26 6Z" stroke={s.tint} strokeWidth="3" strokeLinejoin="round" />
                    <circle cx="33" cy="13" r="3" stroke={s.tint} strokeWidth="3" />
                  </>
                )}
              </svg>
              <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 92, letterSpacing: '-0.05em', color: s.tint, lineHeight: 0.9, fontVariantNumeric: 'tabular-nums'}}>
                {s.v}<span style={{opacity: 0.5, fontSize: 54}}>{s.suffix}</span>
              </div>
              <div style={{marginTop: 10, fontFamily: F.mono, fontSize: 22, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(247,242,232,0.45)'}}>{s.label}</div>
            </div>
          );
        })}
      </div>

      <Layer from={Math.max(0, tCount - 40)} to={Math.max(400, tCount + 220)}>
        <div style={{position: 'absolute', left: 0, right: 0, top: '41.5%', height: 380, overflow: 'hidden', maskImage: 'linear-gradient(180deg, transparent, #000 22%, #000 70%, transparent)', WebkitMaskImage: 'linear-gradient(180deg, transparent, #000 22%, #000 70%, transparent)'}}>
          {[0, 1, 2].map((row) => (
            <div
              key={row}
              style={{
                position: 'absolute',
                left: `${-12 + ((frame * (0.22 + row * 0.07)) % 100)}%`,
                top: row * 104,
                display: 'flex',
                gap: 26,
                whiteSpace: 'nowrap',
                transform: `translateX(${row * -180}px)`,
                opacity: 0.62 - row * 0.14,
              }}
            >
              {new Array(16).fill(0).map((_, i) => {
                const items = ['BERAS', 'CABAI', 'BENSIN', 'SEWA', 'PULSA', 'TELUR', 'MINYAK', 'GULA'];
                return (
                  <span key={i} style={{fontFamily: F.mono, fontSize: 24, letterSpacing: '0.24em', color: row === 1 ? C.sky : 'rgba(247,242,232,0.6)'}}>
                    {items[(i + row * 3) % items.length]}{'  '}
                    <span style={{color: i % 3 === 0 ? C.red : C.mint}}>{i % 3 === 0 ? '▲' : '▼'}{((i * 7) % 9) + 1},{((i * 3) % 9) + 1}%</span>
                  </span>
                );
              })}
            </div>
          ))}
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
