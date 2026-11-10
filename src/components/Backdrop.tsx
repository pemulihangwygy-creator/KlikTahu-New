import {AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {C} from '../theme';
import {rand} from '../lib/anim';

/** Deep field: vignette + slow-drifting warm blooms + fine grain. */
export const Backdrop: React.FC<{
  hue?: 'amber' | 'red' | 'mint' | 'sky';
  intensity?: number;
  grain?: number;
}> = ({hue = 'amber', intensity = 1, grain = 0.05}) => {
  const frame = useCurrentFrame();
  const tint =
    hue === 'red' ? C.red : hue === 'mint' ? C.mint : hue === 'sky' ? C.sky : C.orange;
  const t = frame / 90;
  const blooms = [
    {x: 22 + Math.sin(t * 0.21) * 9, y: 26 + Math.cos(t * 0.17) * 7, r: 64, c: tint, a: 0.26},
    {x: 82 + Math.cos(t * 0.19) * 8, y: 62 + Math.sin(t * 0.23) * 9, r: 56, c: C.deepOrange, a: 0.2},
    {x: 52 + Math.sin(t * 0.13 + 2) * 12, y: 88 + Math.cos(t * 0.11) * 5, r: 48, c: C.yellow, a: 0.12},
  ];
  return (
    <AbsoluteFill style={{background: C.ink}}>
      {blooms.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: `${b.r}%`,
            aspectRatio: '1',
            transform: 'translate(-50%,-50%)',
            background: `radial-gradient(circle, ${b.c}0A 0%, ${b.c}22 26%, transparent 68%)`,
            opacity: b.a * intensity * 1.15,
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(120% 90% at 50% 30%, transparent 30%, rgba(4,3,7,0.72) 100%)`,
        }}
      />
      <AbsoluteFill style={{opacity: grain * 0.9, mixBlendMode: 'soft-light'}}>
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
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(130% 100% at 50% 42%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.55) 78%, rgba(0,0,0,0.88) 100%)',
          opacity: interpolate(intensity, [0, 1], [0.25, 0.9]),
        }}
      />
    </AbsoluteFill>
  );
};
