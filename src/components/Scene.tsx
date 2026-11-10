import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {Backdrop} from './Backdrop';
import {easeOut} from '../lib/anim';

/** Scene shell: backdrop + in/out motion so cuts feel like a single camera language. */
export const Scene: React.FC<{
  hue?: 'amber' | 'red' | 'mint' | 'sky';
  intensity?: number;
  children: React.ReactNode;
  enter?: number;
  exit?: number;
  drift?: number;
}> = ({hue = 'amber', intensity = 1, children, enter = 10, exit = 12, drift = 0.02}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const pin = interpolate(frame, [0, enter], [0, 1], {extrapolateRight: 'clamp', easing: easeOut});
  const pout = interpolate(frame, [durationInFrames - exit, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = 1.045 - drift * pin + 0.012 * (1 - pout);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Backdrop hue={hue} intensity={intensity} />
      <AbsoluteFill style={{transform: `scale(${scale})`, opacity: Math.min(pin, pout)}}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
