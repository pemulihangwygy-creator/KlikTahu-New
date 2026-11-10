import {AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {C} from '../theme';
import {rand, clamp01} from '../lib/anim';

const HUE_COLOR: Record<string, string> = {
  amber: C.orange,
  red: C.red,
  mint: C.mint,
  sky: C.sky,
};

/**
 * V2 deep field: blurred aurora blobs + rotating conic sheen + faint dot grid
 * + fine grain + vignette. One coherent light source per scene hue.
 */
export const Backdrop: React.FC<{
  hue?: 'amber' | 'red' | 'mint' | 'sky';
  intensity?: number;
  grain?: number;
}> = ({hue = 'amber', intensity = 1, grain = 0.055}) => {
  const frame = useCurrentFrame();
  const tint = HUE_COLOR[hue] ?? C.orange;
  const t = frame / 90;

  const blobs = [
    {x: 24 + Math.sin(t * 0.21) * 8, y: 24 + Math.cos(t * 0.16) * 6, r: 78, c: tint, a: 0.34, blur: 130},
    {x: 80 + Math.cos(t * 0.18) * 7, y: 58 + Math.sin(t * 0.22) * 8, r: 66, c: C.deepOrange, a: 0.26, blur: 150},
    {x: 50 + Math.sin(t * 0.12 + 2) * 11, y: 86 + Math.cos(t * 0.1) * 5, r: 56, c: C.yellow, a: 0.16, blur: 140},
    {x: 8 + Math.cos(t * 0.14 + 1) * 6, y: 78 + Math.sin(t * 0.19) * 7, r: 44, c: tint, a: 0.14, blur: 120},
  ];

  const sheenRot = frame * 0.05;

  return (
    <AbsoluteFill style={{background: C.ink}}>
      {/* base vertical gradient */}
      <AbsoluteFill
        style={{background: `linear-gradient(180deg, ${C.ink2} 0%, ${C.ink} 42%, #050408 100%)`}}
      />

      {/* aurora blobs */}
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: `${b.r}%`,
            aspectRatio: '1',
            transform: 'translate(-50%,-50%)',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${b.c} 0%, transparent 62%)`,
            filter: `blur(${b.blur}px)`,
            opacity: b.a * intensity,
          }}
        />
      ))}

      {/* slow rotating conic sheen */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '38%',
          width: '190%',
          aspectRatio: '1',
          transform: `translate(-50%,-50%) rotate(${sheenRot}deg)`,
          background: `conic-gradient(from 0deg, transparent 0deg, ${tint}14 40deg, transparent 90deg, ${C.yellow}0D 200deg, transparent 250deg, ${tint}10 320deg, transparent 360deg)`,
          filter: 'blur(70px)',
          opacity: 0.5 * intensity,
        }}
      />

      {/* diagonal light streak */}
      <div
        style={{
          position: 'absolute',
          inset: -20,
          background: `linear-gradient(115deg, transparent 38%, rgba(255,240,210,0.05) 47%, transparent 56%)`,
          transform: `translateX(${Math.sin(t * 0.3) * 40}px)`,
        }}
      />

      {/* faint dot grid for depth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(rgba(247,242,232,0.05) 1.2px, transparent 1.2px)`,
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(90% 70% at 50% 40%, #000 30%, transparent 78%)',
          opacity: 0.5,
        }}
      />

      {/* fine film grain */}
      <AbsoluteFill style={{opacity: grain, mixBlendMode: 'soft-light'}}>
        <Img
          src={staticFile('tex/grain.png')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `translate(${rand(frame) * 40}px, ${rand(frame + 7) * 40}px) scale(1.2)`,
          }}
        />
      </AbsoluteFill>

      {/* vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(120% 90% at 50% 30%, transparent 26%, rgba(4,3,7,0.66) 74%, rgba(3,2,6,0.94) 100%)',
          opacity: interpolate(intensity, [0, 1], [0.3, 0.95]),
        }}
      />

      {/* bottom stage shadow so foreground type sits on solid ground */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '34%',
          background: 'linear-gradient(180deg, transparent, rgba(4,3,7,0.55) 70%)',
          opacity: clamp01(intensity),
        }}
      />
    </AbsoluteFill>
  );
};
