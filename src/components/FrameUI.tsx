import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, F} from '../theme';
import {Watermark} from './Watermark';

/** Persistent overlay furniture: top rule, progress bar, watermark, safe padding. */
export const FrameUI: React.FC<{
  index: string;
  total: string;
  sceneTitle: string;
  progress: number;
  wmScale?: number;
  showWatermark?: boolean;
  revealAt?: number;
  hideAfter?: number;
}> = ({index, total, sceneTitle, progress, wmScale = 1, showWatermark = true, revealAt, hideAfter}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: '6.2%',
          right: '6.2%',
          top: '4.4%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: F.mono,
          fontSize: 26 * wmScale,
          letterSpacing: '0.16em',
          color: 'rgba(247,242,232,0.48)',
          textTransform: 'uppercase',
        }}
      >
        <span style={{color: C.yellow, opacity: 0.9}}>{index}</span>
        <span style={{flex: 1, margin: '0 28px', height: 2, background: 'rgba(247,242,232,0.1)'}}>
          <span
            style={{
              display: 'block',
              height: '100%',
              width: `${Math.min(1, Math.max(0, progress)) * 100}%`,
              background: `linear-gradient(90deg, ${C.amber}, ${C.orange})`,
              borderRadius: 99,
              position: 'relative',
              boxShadow: '0 0 14px rgba(255,174,31,0.5)',
            }}
          >
            <span
              style={{
                position: 'absolute',
                right: -4,
                top: '50%',
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: C.yellow,
                transform: 'translateY(-50%)',
                boxShadow: '0 0 12px rgba(255,197,49,0.9)',
              }}
            />
          </span>
        </span>
        <span style={{maxWidth: '46%', textAlign: 'right'}}>{sceneTitle}</span>
      </div>
      {showWatermark ? (
        <div
          style={{
            position: 'absolute',
            right: '6.2%',
            bottom: '5.6%',
            transformOrigin: 'right bottom',
            transform: `scale(${wmScale})`,
            opacity: 0.94,
          }}
        >
          <Watermark size={64} opacity={0.95} enterAt={revealAt ?? 0} hideAfter={hideAfter} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
