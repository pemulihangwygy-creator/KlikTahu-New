import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {Backdrop} from '../components/Backdrop';
import {Watermark} from '../components/Watermark';
import {Burst, LightSweep} from '../components/FX';
import {C, F} from '../theme';
import {clamp01, easeOut, springIn} from '../lib/anim';
import {DISCLAIMER, SOURCES} from '../data/facts';

/** OUTRO — brand, sources, and the next-episode hook. */
export const Outro: React.FC<{dur: number; short?: boolean}> = ({dur, short = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = springIn(frame, fps, 4, 120, 18);
  const b = easeOut(clamp01((frame - 18) / 30));
  const c = easeOut(clamp01((frame - 40) / 30));
  const out = interpolate(frame, [dur - 18, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Backdrop hue="amber" intensity={1.2} />
      <AbsoluteFill style={{opacity: 0.28}}>
        <Burst count={30} color={C.amber} />
      </AbsoluteFill>
      <LightSweep opacity={0.14} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 8%'}}>
        <div style={{opacity: clamp01(a * 1.4), transform: `translateY(${(1 - a) * 40}px) scale(${0.94 + a * 0.06})`}}>
          <Watermark size={short ? 96 : 120} opacity={1} />
        </div>
        <div
          style={{
            marginTop: short ? 26 : 40,
            fontFamily: F.display,
            fontWeight: 800,
            fontSize: short ? 84 : 104,
            lineHeight: 1.04,
            letterSpacing: '-0.035em',
            color: C.paper,
            opacity: b,
            transform: `translateY(${(1 - b) * 30}px)`,
          }}
        >
          Angka bisa naik.
          <br />
          <span style={{color: C.yellow}}>Kamu harus tahu caranya.</span>
        </div>
        <div
          style={{
            marginTop: 34,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 18,
            padding: '14px 28px',
            borderRadius: 999,
            border: '1px solid rgba(255,197,49,0.35)',
            background: 'rgba(255,197,49,0.08)',
            opacity: c,
          }}
        >
          <span style={{fontFamily: F.mono, fontSize: short ? 24 : 26, letterSpacing: '0.2em', color: C.yellow}}>FOLLOW · KlikTahu</span>
        </div>
        {!short ? (
          <div style={{marginTop: 52, fontFamily: F.mono, fontSize: 20, lineHeight: 1.7, letterSpacing: '0.1em', color: 'rgba(247,242,232,0.32)', opacity: c}}>
            Sumber: {SOURCES.bps2024} · {SOURCES.bps2025} <br />
            {DISCLAIMER}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
