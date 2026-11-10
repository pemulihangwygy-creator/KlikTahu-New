import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {Scene} from '../components/Scene';
import {Headline} from '../components/Headline';
import {Kicker} from '../components/BigNumber';
import {HBars} from '../components/Chart';
import {Layer} from '../components/FX';
import {C, F} from '../theme';
import {clamp01, easeOut, springIn} from '../lib/anim';
import type {SceneProps} from './types';
import {at} from './types';

/** BASKET — hundreds of items, weighted by how often we actually buy them. */
export const Basket: React.FC<SceneProps> = ({lines}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tWeights = at(lines, 1, 0.1);

  const rows = [
    {label: 'Makanan & minuman', value: 34.2, hi: true},
    {label: 'Perumahan & listrik', value: 20.1},
    {label: 'Transportasi', value: 12.4},
    {label: 'Lainnya', value: 33.3},
  ];

  const basketIn = springIn(frame, fps, 0, 110, 18);
  const p = easeOut(clamp01((frame - tWeights) / 70));

  return (
    <Scene hue="amber" intensity={0.85} enter={1}>
      <div style={{position: 'absolute', left: '7.5%', right: '7.5%', top: '12%'}}>
        <Kicker text="Keranjang rumah tangga" start={0} />
      </div>
      <div style={{position: 'absolute', left: '7.5%', right: '7.5%', top: '17.5%'}}>
        <Headline text="Bukan sembarang keranjang. **Ratusan** barang." start={at(lines, 0) - 8} size={86} maxWidth={1240} />
      </div>

      {/* basket illustration */}
      <Layer from={0} to={Math.max(60, at(lines, 1) - 6)}>
        <div style={{position: 'absolute', inset: 0}}>
          <div style={{position: 'absolute', left: '50%', top: '62%', transform: `translate(-50%,-50%) scale(${0.88 + basketIn * 0.12})`, opacity: clamp01(basketIn), width: 1080}}>
            <svg viewBox="0 0 900 520" width="100%">
              <defs>
                <linearGradient id="bgr" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={C.yellow} />
                  <stop offset="100%" stopColor={C.orange} />
                </linearGradient>
              </defs>
              <path d="M170 190 L730 190 L660 470 L240 470 Z" fill="none" stroke="url(#bgr)" strokeWidth="10" strokeLinejoin="round" />
              <path d="M170 260 L730 260" stroke="url(#bgr)" strokeWidth="6" opacity="0.5" />
              {new Array(11).fill(0).map((_, i) => {
                const x = 232 + i * 44;
                const h = 70 + ((i * 53) % 120);
                return <rect key={i} x={x} y={190 - h} width={30} height={h} rx={9} fill={i % 3 === 0 ? C.amber : 'rgba(247,242,232,0.32)'} opacity={0.92} />;
              })}
              {[0, 1, 2].map((i) => (
                <circle key={`c${i}`} cx={300 + i * 120} cy={168} r={26} fill={i === 1 ? C.orange : 'rgba(247,242,232,0.22)'} />
              ))}
              <path d="M330 190 C330 90 570 90 570 190" fill="none" stroke="url(#bgr)" strokeWidth="12" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </Layer>

      <Layer from={Math.max(0, at(lines, 1) - 8)} to={99999}>
        <div style={{position: 'absolute', inset: 0}}>
          <div style={{position: 'absolute', left: '7.5%', right: '7.5%', top: '29.5%'}}>
            <Headline text="Tiap barang punya **bobot**." start={tWeights} size={92} />
          </div>
          <HBars rows={rows} progress={p} y={1240} rowH={168} size={48} max={40} w={1140} />

        </div>
      </Layer>
    </Scene>
  );
};
