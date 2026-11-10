import {AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';
import {rand, easeOut, clamp01} from '../lib/anim';

/** Mount a layer for a window of the parent timeline; children see frame 0 at `from`. */
export const Layer: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const {durationInFrames} = useVideoConfig();
  const start = Math.max(0, Math.round(from));
  const end = Math.min(durationInFrames, Math.round(to));
  if (end <= start) return null;
  return (
    <Sequence from={start} durationInFrames={end - start} name="layer">
      {children}
    </Sequence>
  );
};

/** Rings rushing at the camera — the "falling into the data" shot. */
export const Tunnel: React.FC<{rings?: number; speed?: number; color?: string; hue2?: string; z?: number}> = ({
  rings = 16,
  speed = 0.055,
  color = C.amber,
  hue2 = C.orange,
  z = 0,
}) => {
  const frame = useCurrentFrame();
  const t = frame * speed;
  return (
    <AbsoluteFill style={{perspective: 1200, perspectiveOrigin: '50% 46%', zIndex: z}}>
      <AbsoluteFill style={{transformStyle: 'preserve-3d'}}>
        {new Array(rings).fill(0).map((_, i) => {
          const z = -((i * 260 - ((t * 900) % 260)) % (rings * 260));
          const scale = 1400 / (1400 + z);
          const opacity = clamp01(scale * 0.9 - 0.06) * (i % 2 ? 0.5 : 0.9);
          const rot = (i % 4) * 22 + frame * 0.35;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '46%',
                width: 900,
                height: 900,
                marginLeft: -450,
                marginTop: -450,
                border: `2px solid ${i % 3 === 0 ? hue2 : color}`,
                borderRadius: i % 2 ? 60 : '50%',
                transform: `translateZ(${z}px) scale(${scale}) rotate(${rot}deg)`,
                opacity: opacity * 0.5,
                boxShadow: i % 3 === 0 ? `0 0 60px ${color}33` : undefined,
              }}
            />
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Perspective grid floor that scrolls toward viewer. */
export const GridFloor: React.FC<{color?: string; opacity?: number; speed?: number}> = ({
  color = C.amber,
  opacity = 0.3,
  speed = 2.2,
}) => {
  const frame = useCurrentFrame();
  const off = (frame * speed) % 120;
  const lines = [];
  for (let i = 0; i <= 26; i++) {
    const y = 620 + i * 26 + off * (i / 26) * 3;
    const w = 2600 * (1 + i * 0.06);
    lines.push(
      <div
        key={`h${i}`}
        style={{
          position: 'absolute',
          left: '50%',
          top: y,
          width: w,
          height: 2,
          marginLeft: -w / 2,
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          opacity: Math.min(1, i / 10),
        }}
      />,
    );
  }
  for (let i = -14; i <= 14; i++) {
    lines.push(
      <div
        key={`v${i}`}
        style={{
          position: 'absolute',
          left: `calc(50% + ${i * 92}px)`,
          top: 620,
          width: 2,
          height: 1400,
          background: `linear-gradient(180deg, transparent, ${color} 30%, ${color} 60%, transparent)`,
          transformOrigin: 'top center',
          transform: `rotate(${i * 0.9}deg)`,
          opacity: 0.5 - Math.abs(i) * 0.026,
        }}
      />,
    );
  }
  return (
    <AbsoluteFill style={{opacity, maskImage: 'linear-gradient(180deg, transparent 42%, #000 62%, transparent 96%)'}}>
      {lines}
    </AbsoluteFill>
  );
};

/** Radial speed lines, good under reveals. */
export const Burst: React.FC<{count?: number; reach?: number; color?: string; pulse?: number; z?: number}> = ({
  count = 42,
  reach = 1500,
  color = C.yellow,
  pulse = 1,
  z = 0,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{zIndex: z}}>
      {new Array(count).fill(0).map((_, i) => {
        const a = (i / count) * Math.PI * 2 + rand(i) * 0.22;
        const len = 160 + rand(i + 3) * 420;
        const grow = 1 + Math.sin(frame * 0.08 + i) * 0.06 * pulse;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 3,
              height: len * grow,
              background: `linear-gradient(180deg, ${color}, transparent)`,
              transformOrigin: 'top center',
              transform: `rotate(${(a * 180) / Math.PI}deg) translateY(${reach * 0.18}px)`,
              opacity: 0.12 + rand(i + 9) * 0.24,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** A vertical block that sweeps across the frame — used between chapters. */
export const Wipe: React.FC<{label?: string; dur?: number; color?: string}> = ({label, dur = 22, color = C.amber}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, dur], [0, 1], {easing: easeOut, extrapolateRight: 'clamp'});
  const x = interpolate(p, [0, 0.5, 1], [-110, 0, 110]);
  const fill = p < 0.5 ? (p / 0.5) * 100 : 100 - ((p - 0.5) / 0.5) * 100;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', inset: 0, background: `linear-gradient(90deg, transparent ${x - 12}%, ${color} ${x}%, ${C.orange} ${x + 8}%, transparent ${x + 26}%)`, opacity: 0.95, transform: 'skewX(-8deg)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: '50%', height: fill * 4, background: C.ink, transform: 'translateY(-50%)', opacity: 0.35}} />
      {label ? (
        <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', opacity: Math.sin(p * Math.PI) * 1.2}}>
          <div style={{fontFamily: '"Bricolage Grotesque Variable"', fontWeight: 800, fontSize: 120, letterSpacing: '-0.04em', color: C.ink, background: C.yellow, padding: '10px 34px', borderRadius: 18, transform: `rotate(${interpolate(p, [0, 1], [-4, 4])}deg)`}}>{label}</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/** Cheap, high-impact flash. */
export const Flash: React.FC<{color?: string; peak?: number; dur?: number}> = ({color = '#FFF3D0', peak = 0.55, dur = 14}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, dur * 0.25, dur], [0, peak, 0], {extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{background: color, opacity: o, mixBlendMode: 'screen'}} />;
};

/** Soft moving light sweep over the whole frame. */
export const LightSweep: React.FC<{opacity?: number}> = ({opacity = 0.16}) => {
  const frame = useCurrentFrame();
  const x = ((frame * 0.6) % 320) - 110;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${105 + Math.sin(frame / 90) * 6}deg, transparent ${x}%, rgba(255,230,170,0.5) ${x + 22}%, transparent ${x + 46}%)`,
        opacity,
        mixBlendMode: 'screen',
      }}
    />
  );
};

/** Radial mask that punches a clean circle (for cut-out numbers over bars). */
export const CircleMask: React.FC<{size?: number; top?: string; blow?: number; children?: React.ReactNode}> = ({
  size = 760,
  top = '41%',
  blow = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const s = size * (1 + Math.sin(frame / 22) * 0.004 * blow);
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top,
        width: s,
        height: s,
        marginLeft: -s / 2,
        marginTop: -s / 2,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(7,6,10,0.93) 0%, rgba(7,6,10,0.86) 46%, rgba(7,6,10,0.3) 62%, rgba(7,6,10,0) 72%)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 3,
        pointerEvents: 'none',
      }}
    >
      {children}
    </div>
  );
};

/**
 * V2 scene cut: a full-frame panel in the incoming scene's accent color sweeps
 * up and away over ~14 frames, with a soft leading edge and a brief flash.
 * Mounted as an overlay at each scene boundary — keeps timeline math intact.
 */
export const SceneSweep: React.FC<{color?: string; dur?: number; delay?: number}> = ({
  color = C.amber,
  dur = 14,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const f = frame - delay;
  if (f < 0) return null;
  const p = interpolate(f, [0, dur], [0, 1], {easing: easeOut, extrapolateRight: 'clamp'});
  // panel covers screen at p=0..0.35, then lifts away by p=1
  const cover = p < 0.35 ? 1 : 1 - (p - 0.35) / 0.65;
  const y = -cover * 104; // percent, panel slides up out of frame
  const edgeGlow = p > 0.35 && p < 0.9 ? Math.sin(((p - 0.35) / 0.55) * Math.PI) : 0;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', zIndex: 40}}>
      <div
        style={{
          position: 'absolute',
          left: '-6%',
          right: '-6%',
          top: `${y}%`,
          height: '108%',
          background: `linear-gradient(180deg, ${color}, ${C.deepOrange})`,
          transform: 'skewY(-1.2deg)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '-6%',
          right: '-6%',
          top: `${y + 100}%`,
          height: '16%',
          background: `linear-gradient(180deg, rgba(255,240,200,${0.85 * edgeGlow}), transparent)`,
          filter: 'blur(24px)',
        }}
      />
      <AbsoluteFill style={{background: '#FFF3D0', opacity: p < 0.4 ? 0.35 * (1 - p / 0.4) : 0, mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};
