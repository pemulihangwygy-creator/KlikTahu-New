import {AbsoluteFill} from 'remotion';

/** Content area with the film's consistent side margins. */
export const Stage: React.FC<{children: React.ReactNode; top?: number; style?: React.CSSProperties}> = ({
  children,
  top = 0.115,
  style,
}) => (
  <AbsoluteFill style={{paddingLeft: '7.5%', paddingRight: '7.5%', paddingTop: `${top * 100}%`, ...style}}>
    {children}
  </AbsoluteFill>
);
