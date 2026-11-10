import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {Scene} from '../components/Scene';
import {Headline} from '../components/Headline';
import {Kicker, BigNumber} from '../components/BigNumber';
import {Layer, LightSweep, Tunnel} from '../components/FX';
import {C, F} from '../theme';
import {clamp01, easeOut, springIn} from '../lib/anim';
import type {SceneProps} from './types';
import {at} from './types';

/** NUANCE — low inflation is not the same as a comfortable life. */
export const Nuance: React.FC<SceneProps> = ({lines}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tQ = at(lines, 0, 0.42);
  const tBut = at(lines, 0, 0.78);

  const qIn = springIn(frame, fps, tQ, 160, 18);
  const butIn = easeOut(clamp01((frame - tBut) / 26));

  const cards = [
    {t: 'Upah tidak selalu ikut naik', d: 'inflasi rata-rata ≠ kenaikan gajimu'},
    {t: 'Bobot tiap keluarga beda', d: 'keranjang BPS ≠ keranjangmu'},
    {t: 'Kualitas ikut berubah', d: 'harga sama, isi lebih sedikit'},
  ];

  return (
    <Scene hue="sky" intensity={0.7} enter={1}>
      <Layer from={0} to={tQ + 30}>
        <div style={{position: 'absolute', inset: 0, opacity: 0.4}}>
          <Tunnel rings={10} speed={0.03} color={C.sky} hue2={C.amber} />
        </div>
      </Layer>
      <LightSweep opacity={0.08} />

      <div style={{position: 'absolute', left: '7.5%', right: '7.5%', top: '12%'}}>
        <Kicker text="Jangan salah baca" start={0} color={C.sky} />
      </div>

      <div style={{position: 'absolute', left: '7.5%', right: '7.5%', top: '17.5%'}}>
        <Headline text="Inflasi kecil. **Hidup belum tentu** ringan." start={at(lines, 0) - 8} size={96} maxWidth={1240} />
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: '36%', textAlign: 'center', opacity: clamp01(qIn * 1.3), transform: `scale(${0.92 + qIn * 0.08})`}}>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 26, padding: '22px 40px', borderRadius: 24, background: 'rgba(255,197,49,0.07)', border: '1px solid rgba(255,197,49,0.3)'}}>
          <span style={{fontFamily: F.display, fontWeight: 800, fontSize: 96, color: C.yellow, letterSpacing: '-0.04em'}}>?</span>
          <span style={{fontFamily: F.display, fontWeight: 700, fontSize: 52, color: C.paper, letterSpacing: '-0.02em'}}>Rata-rata ≠ pengalamanmu</span>
        </div>
      </div>

      <div style={{position: 'absolute', left: '7.5%', right: '7.5%', top: '52%', display: 'flex', flexDirection: 'column', gap: 18}}>
        {cards.map((c, i) => {
          const p = easeOut(clamp01((frame - tBut - i * 9) / 26));
          return (
            <div
              key={c.t}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 26,
                padding: '22px 26px',
                borderRadius: 18,
                border: `1px solid ${C.line}`,
                background: 'rgba(247,242,232,0.025)',
                opacity: p,
                transform: `translateX(${(1 - p) * -50}px)`,
              }}
            >
              <div style={{width: 52, height: 52, borderRadius: 12, background: `linear-gradient(150deg,${C.yellow},${C.orange})`, display: 'grid', placeItems: 'center', fontFamily: F.display, fontWeight: 800, fontSize: 28, color: C.ink}}>
                {i + 1}
              </div>
              <div>
                <div style={{fontFamily: F.display, fontWeight: 700, fontSize: 46, color: C.paper, letterSpacing: '-0.02em'}}>{c.t}</div>
                <div style={{fontFamily: F.mono, fontSize: 22, letterSpacing: '0.12em', color: 'rgba(247,242,232,0.42)', marginTop: 4}}>{c.d}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, bottom: '24%', textAlign: 'center', opacity: butIn}}>
        <div style={{fontFamily: F.body, fontWeight: 700, fontSize: 44, color: 'rgba(247,242,232,0.75)'}}>
          Yang penting bukan angkanya. <span style={{color: C.yellow}}>Tapi isi keranjangmu.</span>
        </div>
      </div>
    </Scene>
  );
};
