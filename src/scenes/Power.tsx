import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {Scene} from '../components/Scene';
import {Headline} from '../components/Headline';
import {Kicker} from '../components/BigNumber';
import {C, F} from '../theme';
import {clamp01, easeOut, rand, springIn} from '../lib/anim';
import {idr} from '../lib/format';
import type {SceneProps} from './types';
import {at} from './types';

/** POWER — what 77,63% actually does to one family's kitchen money. */
export const Power: React.FC<SceneProps> = ({lines}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tWallet = at(lines, 0, 0.12);
  const tShrink = at(lines, 0, 0.52);

  const walletIn = springIn(frame, fps, tWallet, 130, 16);
  const shrink = easeOut(clamp01((frame - tShrink) / 80));
  const coins = 10;
  const kept = interpolate(shrink, [0, 1], [coins, 5.6]);

  const noteIn = springIn(frame, fps, tShrink + 30, 150, 18);

  return (
    <Scene hue="amber" intensity={1} enter={1}>
      <div style={{position: 'absolute', left: '7.5%', right: '7.5%', top: '12%'}}>
        <Kicker text="Dampak nyata" start={0} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: '17%', textAlign: 'center'}}>
        <Headline text="Uang dapur **Rp500.000**" start={tWallet} size={92} align="center" maxWidth={1150} />
      </div>

      {/* wallet */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '36.5%',
          transform: `translate(-50%,0) rotate(${-1.6 + (1 - walletIn) * 6}deg) scale(${0.92 + walletIn * 0.08})`,
          opacity: clamp01(walletIn * 1.4),
          width: 900,
        }}
      >
        <div style={{background: `linear-gradient(160deg, #2A2118, #16110C)`, border: `1px solid rgba(255,197,49,0.3)`, borderRadius: 30, padding: '34px 38px', boxShadow: '0 50px 120px rgba(0,0,0,0.6)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{fontFamily: F.mono, fontSize: 24, letterSpacing: '0.24em', color: 'rgba(247,242,232,0.4)'}}>DOMPET KELUARGA</div>
            <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 30, color: C.yellow, letterSpacing: '-0.02em'}}>KlikTahu · ilustrasi</div>
          </div>
          <div style={{marginTop: 16, fontFamily: F.display, fontWeight: 800, fontSize: 126, letterSpacing: '-0.05em', color: C.paper, lineHeight: 0.9}}>
            {idr(500000).replace('Rp', 'Rp ')}
          </div>
          <div style={{marginTop: 26, display: 'flex', gap: 10, flexWrap: 'wrap'}}>
            {new Array(coins).fill(0).map((_, i) => {
              const alive = i < Math.round(kept);
              const fade = i >= Math.round(kept) - 1 ? kept - Math.floor(kept) : 1;
              return (
                <div
                  key={i}
                  style={{
                    width: 66,
                    height: 66,
                    borderRadius: 14,
                    background: alive
                      ? `linear-gradient(150deg, ${C.yellow}, ${C.amber})`
                      : 'rgba(247,242,232,0.08)',
                    border: alive ? 'none' : '1px dashed rgba(247,242,232,0.2)',
                    opacity: alive ? 0.35 + 0.65 * fade : 0.7,
                    transform: `scale(${alive ? 1 : 0.9}) rotate(${(rand(i) - 0.5) * 8}deg)`,
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: F.mono,
                    fontSize: 20,
                    color: '#1A1208',
                    fontWeight: 700,
                  }}
                >
                  {alive ? 'Rp' : ''}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{position: 'absolute', left: '7.5%', right: '7.5%', top: '60.5%', display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 20, alignItems: 'center', opacity: clamp01((frame - tShrink) / 16)}}>
        <div style={{border: `1px solid ${C.line}`, borderRadius: 18, padding: '20px 22px', background: 'rgba(247,242,232,0.025)'}}>
          <div style={{fontFamily: F.mono, fontSize: 20, letterSpacing: '0.18em', color: 'rgba(247,242,232,0.42)'}}>DAYA BELI AWAL</div>
          <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 64, color: C.paper, letterSpacing: '-0.04em'}}>100</div>
        </div>
        <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 80, color: C.red}}>→</div>
        <div style={{border: `1px solid rgba(255,68,56,0.3)`, borderRadius: 18, padding: '20px 22px', background: 'rgba(255,68,56,0.05)'}}>
          <div style={{fontFamily: F.mono, fontSize: 20, letterSpacing: '0.18em', color: 'rgba(255,150,140,0.7)'}}>SETAHUN KEMUDIAN</div>
          <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 64, color: C.red, letterSpacing: '-0.04em'}}>≈ 56</div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: '7.5%',
          right: '7.5%',
          bottom: '14.5%',
          opacity: clamp01((frame - tShrink - 30) / 20),
          transform: `translateY(${(1 - noteIn) * 50}px)`,
        }}
      >
        <div style={{fontFamily: F.body, fontSize: 40, lineHeight: 1.32, color: 'rgba(247,242,232,0.82)', borderLeft: `6px solid ${C.yellow}`, paddingLeft: 26}}>
          Harga naik <span style={{color: C.yellow, fontWeight: 800}}>77,63%</span> berarti barang yang tadinya bisa kamu beli dengan Rp500.000, setahun kemudian hanya tersisa sekitar <span style={{color: C.yellow, fontWeight: 800}}>Rp281.000</span> nilainya.
        </div>
      </div>
    </Scene>
  );
};
