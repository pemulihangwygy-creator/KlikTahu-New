import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Scene} from '../components/Scene';
import {Headline} from '../components/Headline';
import {Kicker} from '../components/BigNumber';
import {Tunnel, Burst, Layer} from '../components/FX';
import {C, F} from '../theme';
import {clamp01, easeOut, springIn} from '../lib/anim';
import type {SceneProps} from './types';
import {at} from './types';

/** REVEAL — the villain gets a name. */
export const Reveal: React.FC<SceneProps> = ({lines}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tName = at(lines, 0, 0.44);
  const tSell = at(lines, 1, 0.18);
  const tWallet = at(lines, 1, 0.56);

  const nameIn = springIn(frame, fps, tName, 190, 13);
  const glow = 0.35 + 0.18 * Math.sin(frame / 14);

  return (
    <Scene hue="amber" intensity={1.1} enter={1}>
      <Layer from={0} to={tName + 30}>
        <div style={{position: 'absolute', inset: 0, opacity: 0.55}}>
          <Tunnel rings={14} speed={0.05} />
        </div>
      </Layer>

      <div style={{position: 'absolute', left: '7.5%', right: '7.5%', top: '15%'}}>
        <Kicker text="Biang keladi" start={at(lines, 0) - 24} />
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: '33%', textAlign: 'center'}}>
        <div
          style={{
            fontFamily: F.display,
            fontWeight: 800,
            fontSize: 320,
            lineHeight: 0.82,
            letterSpacing: '-0.055em',
            background: `linear-gradient(178deg, ${C.paper} 8%, ${C.yellow} 48%, ${C.orange} 92%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            transform: `scale(${0.86 + nameIn * 0.14}) rotate(${(1 - nameIn) * -4}deg)`,
            opacity: clamp01(nameIn * 1.3),
            filter: `drop-shadow(0 0 ${60 * glow}px rgba(255,150,30,${0.22 * nameIn}))`,
          }}
        >
          INFLASI
        </div>
        <div
          style={{
            marginTop: 26,
            fontFamily: F.mono,
            fontSize: 30,
            letterSpacing: '0.5em',
            color: 'rgba(247,242,232,0.44)',
            opacity: clamp01((frame - tName - 16) / 18),
            textTransform: 'uppercase',
          }}
        >
          inflation · % · y-on-y
        </div>
      </div>

      <Layer from={tName + 8} to={tName + 62}>
        <Burst count={34} color={C.amber} />
      </Layer>

      {/* wallet vs shelf */}
      <div style={{position: 'absolute', left: '7.5%', right: '7.5%', top: '55.5%', opacity: clamp01((frame - tSell) / 20)}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26}}>
          <div style={{border: `1px solid ${C.line}`, background: 'rgba(247,242,232,0.03)', borderRadius: 26, padding: '30px 30px 34px', transform: `translateY(${(1 - easeOut(clamp01((frame - tSell) / 26))) * 40}px)`}}>
            <div style={{fontFamily: F.mono, fontSize: 24, letterSpacing: '0.22em', color: 'rgba(247,242,232,0.5)'}}>DOMPET</div>
            <svg width="100%" viewBox="0 0 300 190" style={{marginTop: 18}}>
              <g>
                <rect x="52" y="52" width="196" height="112" rx="16" fill="rgba(247,242,232,0.10)" />
                <rect x="42" y="38" width="196" height="112" rx="16" fill="rgba(247,242,232,0.22)" />
                <rect x="32" y="24" width="196" height="112" rx="16" fill={C.paper} />
                <circle cx="130" cy="80" r="26" fill="none" stroke="#141019" strokeWidth="5" opacity="0.55" />
                <text x="130" y="90" textAnchor="middle" fontFamily="JetBrains Mono Variable" fontSize="26" fill="#141019">Rp</text>
              </g>
            </svg>
          </div>
          <div style={{border: `1px solid rgba(255,174,31,0.3)`, background: 'rgba(255,174,31,0.05)', borderRadius: 26, padding: '30px 30px 34px', transform: `translateY(${(1 - easeOut(clamp01((frame - tWallet) / 26))) * 40}px)`}}>
            <div style={{fontFamily: F.mono, fontSize: 24, letterSpacing: '0.22em', color: 'rgba(255,197,49,0.7)'}}>HARGA DI RAK</div>
            <div style={{marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12}}>
              {[{k: 'Beras 5 kg', a: 'Rp 68.000', b: 'Rp 82.000'}, {k: 'Cabai 1 kg', a: 'Rp 42.000', b: 'Rp 61.000'}].map((r, i) => (
                <div key={r.k} style={{display: 'grid', gridTemplateColumns: '1fr auto auto 22px', gap: 10, alignItems: 'center', background: 'rgba(10,8,14,0.5)', borderRadius: 12, padding: '12px 14px', opacity: 0.4 + i * 0.2}}>
                  <span style={{fontFamily: F.body, fontSize: 23, color: 'rgba(247,242,232,0.72)', whiteSpace: 'nowrap'}}>{r.k}</span>
                  <span style={{fontFamily: F.mono, fontSize: 22, color: 'rgba(247,242,232,0.5)', textDecoration: 'line-through'}}>{r.a}</span>
                  <span style={{fontFamily: F.mono, fontSize: 24, color: C.yellow}}>{r.b}</span>
                  <span style={{color: C.red, fontSize: 20}}>▲</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </Scene>
  );
};
