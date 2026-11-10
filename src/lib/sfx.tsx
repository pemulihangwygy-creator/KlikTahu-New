import {Audio, staticFile, Sequence} from 'remotion';

export type SfxName = 'whoosh' | 'pop' | 'riser' | 'impact' | 'tick' | 'shimmer' | 'type' | 'sweep';
export type Cue = {at: number; name: SfxName; vol?: number};

/** One-shot sound design, positioned in composition frames. */
export const SfxTrack: React.FC<{cues: Cue[]}> = ({cues}) => (
  <>
    {cues.map((c, i) => (
      <Sequence key={i} from={Math.max(0, Math.round(c.at))} durationInFrames={120} layout="none">
        <Audio src={staticFile(`sfx/${c.name}.mp3`)} volume={c.vol ?? 0.45} />
      </Sequence>
    ))}
  </>
);

export const cue = (at: number, name: SfxName, vol = 0.45): Cue => ({at, name, vol});
