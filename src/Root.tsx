import {Composition} from 'remotion';
import {Film} from './Film';

const W = 1440;
const H = 2560;
const FPS = 90;

const Long: React.FC = () => <Film kind="long" />;
const Short: React.FC = () => <Film kind="short" />;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="KlikTahuLong"
        component={Long}
        durationInFrames={1}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{}}
        calculateMetadata={async () => {
          const {buildTimeline} = await import('./lib/timeline');
          const {LONG_SCENES} = await import('./data/scenes');
          const durations = (await import('./data/vo-durations.json')).default.durations as Record<string, number>;
          const t = buildTimeline(LONG_SCENES, durations, FPS, {beat: 1, minScene: 2.2});
          return {durationInFrames: t.total, fps: FPS, width: W, height: H};
        }}
      />
      <Composition
        id="KlikTahuShort"
        component={Short}
        durationInFrames={1}
        fps={FPS}
        width={W}
        height={H}
        calculateMetadata={async () => {
          const {buildTimeline} = await import('./lib/timeline');
          const {SHORT_SCENES} = await import('./data/scenes');
          const durations = (await import('./data/vo-durations.json')).default.durations as Record<string, number>;
          const t = buildTimeline(SHORT_SCENES, durations, FPS, {beat: 0.6, minScene: 1.6});
          return {durationInFrames: t.total, fps: FPS, width: W, height: H};
        }}
      />
    </>
  );
};
