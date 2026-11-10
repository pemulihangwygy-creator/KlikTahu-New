import {useCurrentFrame} from 'remotion';
import {C, F} from '../theme';
import {clamp01, springIn} from '../lib/anim';

/**
 * KlikTahu wordmark — yellow with an orange edge, always legible on dark footage.
 * Place inside a scaled "canvas" so it scales with the composition.
 */
export const Watermark: React.FC<{
  size?: number;
  opacity?: number;
  variant?: 'wordmark' | 'chip';
  /** frame at which it slides in (absolute, composition-relative) */
  enterAt?: number;
  /** after this many frames the mark fades out (never fully occluded) */
  hideAfter?: number;
  /** frames the fade takes */
  hideDur?: number;
}> = ({size = 56, opacity = 0.92, variant = 'wordmark', enterAt = 0, hideAfter, hideDur = 45}) => {
  const frame = useCurrentFrame();
  const s = enterAt > 0 ? springIn(frame, 90, enterAt, 140, 20) : 1;
  const exposure =
    hideAfter === undefined ? 1 : 1 - clamp01((frame - hideAfter) / Math.max(1, hideDur)) * 0.86;
  const y = (1 - s) * 26;

  if (variant === 'chip') {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: size * 0.22,
          padding: `${size * 0.18}px ${size * 0.42}px ${size * 0.2}px ${size * 0.3}px`,
          borderRadius: 999,
          background: 'rgba(10,8,14,0.62)',
          border: '1px solid rgba(255,197,49,0.28)',
          backdropFilter: 'blur(12px)',
          opacity: opacity * s * exposure,
          transform: `translateY(${y}px)`,
        }}
      >
        <span
          style={{
            width: size * 0.42,
            height: size * 0.42,
            borderRadius: size * 0.1,
            background: `linear-gradient(145deg, ${C.yellow}, ${C.orange})`,
            display: 'block',
          }}
        />
        <span
          style={{
            fontFamily: F.display,
            fontWeight: 800,
            fontSize: size * 0.62,
            letterSpacing: '-0.02em',
            background: `linear-gradient(100deg, ${C.yellow} 20%, ${C.amber} 62%, ${C.orange} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
          }}
        >
          KlikTahu
        </span>
      </div>
    );
  }

  return (
    <div style={{position: 'relative', opacity: opacity * s * exposure, transform: `translateY(${y}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: size * 0.24}}>
        <div
          style={{
            width: size * 0.78,
            height: size * 0.78,
            borderRadius: size * 0.22,
            background: `linear-gradient(150deg, ${C.yellow} 10%, ${C.amber} 55%, ${C.orange} 100%)`,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <div
            style={{
              width: size * 0.3,
              height: size * 0.3,
              borderRadius: size * 0.08,
              background: C.ink,
              opacity: 0.82,
            }}
          />
        </div>
        <span
          style={{
            fontFamily: F.display,
            fontWeight: 800,
            fontSize: size,
            letterSpacing: '-0.035em',
            lineHeight: 0.9,
            background: `linear-gradient(96deg, ${C.yellow} 0%, ${C.amber} 58%, ${C.orange} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: `0 0 ${size * 0.35}px rgba(255,140,40,0.18)`,
          }}
        >
          KlikTahu
        </span>
      </div>
    </div>
  );
};
