import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Scene} from '../components/Scene';
import {Kicker} from '../components/BigNumber';
import {C, F} from '../theme';
import {clamp01, easeOut, springIn, rand} from '../lib/anim';
import {idr} from '../lib/format';
import type {SceneProps} from './types';
import {at} from './types';

/**
 * HOOK — the price of one plate of chicken rice, then and now.
 * Beats are keyed to the narration, not to fixed seconds.
 */
export const Hook: React.FC<SceneProps> = ({lines}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const [l1, l2] = lines;

  const tTag = at(lines, 0) - Math.round(fps * 0.35);
  const tNow = at(lines, 0, 0.46);
  const tWage = at(lines, 1) - Math.round(fps * 0.1);
  const tShrink = at(lines, 1, 0.42);

  const tagIn = springIn(frame, fps, tTag, 90, 16);
  const yearFlip = easeOut(clamp01((frame - Math.min(tNow, tWage - 36)) / 18));
  const price = interpolate(frame, [tNow, tNow + 34, tWage - 34, tWage], [15000, 22000, 22000, 22000], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const slam = springIn(frame, fps, tNow + 26, 220, 12);
  const wage = easeOut(clamp01((frame - tWage) / 34));
  const shrink = easeOut(clamp01((frame - tShrink) / 30));
  const shake = (frame > tNow && frame < tNow + 26) ? Math.sin(frame * 2.4) * 5 * (1 - (frame - tNow) / 26) : 0;

  return (
    <Scene hue="amber" intensity={0.9} enter={1}>
      {/* ghost numeral backdrop */}
      <div
        style={{
          position: 'absolute',
          left: '-6%',
          top: '6%',
          fontFamily: F.display,
          fontWeight: 800,
          fontSize: 760,
          letterSpacing: '-0.06em',
          color: 'rgba(247,242,232,0.035)',
          transform: `translateY(${interpolate(frame, [0, 200], [0, -60])}px)`,
          whiteSpace: 'nowrap',
        }}
      >
        {yearFlip > 0.5 ? '2026' : '2019'}
      </div>

      <div style={{position: 'absolute', left: '7.5%', right: '7.5%', top: '14%'}}>
        <Kicker text={yearFlip > 0.5 ? 'Sekarang · ilustrasi' : 'Lima tahun lalu · ilustrasi'} start={Math.max(0, tTag)} />
      </div>

      {/* receipt */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '43.5%',
          width: 760,
          transform: `translate(-50%,-50%) translateY(${(1 - tagIn) * 160}px) rotate(${-2.4 + (1 - tagIn) * 7 + shake * 0.35}deg) scale(${0.94 + tagIn * 0.06})`,
          opacity: clamp01(tagIn * 1.5),
          filter: `drop-shadow(0 40px 80px rgba(0,0,0,0.55))`,
        }}
      >
        <div style={{position: 'relative', background: '#F6F1E6', borderRadius: 10, padding: '48px 44px 40px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: F.mono, fontSize: 24, letterSpacing: '0.2em', color: 'rgba(10,8,14,0.45)'}}>
            <span>WARUNG MAKAN</span>
            <span>#{String(2019 + Math.round(yearFlip))}</span>
          </div>
          <div style={{height: 2, margin: '26px 0', background: 'repeating-linear-gradient(90deg, rgba(10,8,14,0.25) 0 10px, transparent 10px 20px)'}} />
          <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 62, color: '#141019', letterSpacing: '-0.03em'}}>Nasi Ayam</div>
          <div style={{fontFamily: F.mono, fontSize: 26, color: 'rgba(10,8,14,0.5)', marginTop: 8}}>1 porsi · + es teh</div>
          <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 34}}>
            <div style={{fontFamily: F.mono, fontSize: 26, letterSpacing: '0.18em', color: 'rgba(10,8,14,0.45)'}}>TOTAL</div>
            <div style={{display: 'flex', alignItems: 'baseline', fontFamily: F.display, fontWeight: 800, fontSize: 118, letterSpacing: '-0.05em', color: yearFlip > 0.5 ? C.deepOrange : '#141019', fontVariantNumeric: 'tabular-nums', lineHeight: 0.85}}>
              {idr(price).replace('Rp', 'Rp\u00A0')}
            </div>
          </div>
          <div style={{position: 'absolute', right: -34, top: -30, transform: `scale(${slam}) rotate(${-8 + (1 - slam) * -14}deg)`}}>
            <div style={{background: yearFlip > 0.5 ? C.orange : C.yellow, color: '#141019', fontFamily: F.display, fontWeight: 800, fontSize: 54, padding: '12px 26px 8px', borderRadius: 12, letterSpacing: '-0.02em', boxShadow: '0 14px 40px rgba(0,0,0,0.4)'}}>
              {yearFlip > 0.5 ? '2026' : '2019'}
            </div>
          </div>
        </div>
        <div style={{height: 26, background: 'linear-gradient(180deg,#F6F1E6, transparent)', maskImage: 'repeating-linear-gradient(90deg,#000 0 26px, transparent 26px 40px)', opacity: 0.6}} />
      </div>

      {/* wage line */}
      <div style={{position: 'absolute', left: '7.5%', right: '7.5%', bottom: '22%', opacity: clamp01((frame - tWage) / 12)}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: F.mono, fontSize: 26, letterSpacing: '0.18em', color: 'rgba(247,242,232,0.55)', textTransform: 'uppercase'}}>
          <span>Gaji</span>
          <span style={{color: C.mint}}>+0%</span>
        </div>
        <div style={{marginTop: 12, height: 22, borderRadius: 99, background: 'rgba(247,242,232,0.08)', overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${18 + wage * 4}%`, background: `linear-gradient(90deg,${C.mint},rgba(59,227,167,0.25))`}} />
        </div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: F.mono, fontSize: 26, letterSpacing: '0.18em', color: 'rgba(247,242,232,0.55)', textTransform: 'uppercase', marginTop: 26}}>
          <span>Harga</span>
          <span style={{color: C.red}}>+46,67%</span>
        </div>
        <div style={{marginTop: 12, height: 22, borderRadius: 99, background: 'rgba(247,242,232,0.08)', overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${18 + wage * 62}%`, background: `linear-gradient(90deg,${C.orange},${C.red})`}} />
        </div>
      </div>

      {/* shrink verdict */}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: '9.5%', textAlign: 'center', opacity: clamp01((frame - tShrink) / 16), transform: `scale(${0.94 + shrink * 0.06})`}}>
        <div style={{display: 'inline-block', background: `linear-gradient(100deg, ${C.yellow}, ${C.orange})`, color: '#0B0810', fontFamily: F.display, fontWeight: 800, fontSize: 84, letterSpacing: '-0.04em', padding: '10px 34px 6px', borderRadius: 14, transform: `rotate(-1.5deg)`, boxShadow: `0 22px 60px rgba(255,122,24,${0.25 + shrink * 0.2})`}}>
          UANGMU MENYUSUT
        </div>
      </div>

    </Scene>
  );
};
