import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {useMemo} from 'react';
import {FONT_CSS, useFonts} from './fonts';
import {C, GRADE} from './theme';
import type {SceneProps} from './scenes/types';
import {Hook} from './scenes/Hook';
import {Reveal} from './scenes/Reveal';
import {Survey} from './scenes/Survey';
import {Basket} from './scenes/Basket';
import {IndexScene} from './scenes/IndexScene';
import {Chart} from './scenes/Chart';
import {Crisis} from './scenes/Crisis';
import {Power} from './scenes/Power';
import {Contrast} from './scenes/Contrast';
import {Nuance} from './scenes/Nuance';
import {Outro} from './scenes/Outro';
import {FrameUI} from './components/FrameUI';
import {Captions} from './components/Captions';
import {SfxTrack, type Cue} from './lib/sfx';
import {SceneSweep} from './components/FX';
import {buildTimeline} from './lib/timeline';
import {LONG_SCENES, SHORT_SCENES} from './data/scenes';
import durations from './data/vo-durations.json';
import {clamp01} from './lib/anim';

const COMPONENTS: Record<string, React.FC<SceneProps>> = {
  hook: Hook,
  reveal: Reveal,
  survey: Survey,
  basket: Basket,
  index: IndexScene,
  chart: Chart,
  crisis: Crisis,
  power: Power,
  contrast: Contrast,
  nuance: Nuance,
  crisisShort: Crisis,
  contrastShort: Contrast,
  nuanceShort: Nuance,
};

const TITLES: Record<string, string> = {
  hook: 'Harga & gaji',
  reveal: 'Inflasi',
  survey: 'Cara mengukur',
  basket: 'Keranjang',
  index: 'IHK',
  chart: 'Tahun ke tahun',
  crisis: '1998',
  power: 'Daya beli',
  contrast: '1958 → 2025',
  nuance: 'Bukan semua',
  outro: 'KlikTahu',
  crisisShort: '1998',
  contrastShort: 'Rekor',
  nuanceShort: 'Catatan',
};

const D = durations.durations as Record<string, number>;

const SCENE_ACCENT: Record<string, string> = {
  hook: C.amber,
  reveal: C.yellow,
  survey: C.sky,
  basket: C.orange,
  index: C.amber,
  chart: C.orange,
  crisis: C.red,
  crisisShort: C.red,
  power: C.mint,
  contrast: C.sky,
  contrastShort: C.sky,
  nuance: C.mint,
  nuanceShort: C.mint,
  outro: C.yellow,
};

export const useFilmTimeline = (kind: 'long' | 'short') =>
  useMemo(() => {
    const defs = kind === 'long' ? LONG_SCENES : SHORT_SCENES;
    return buildTimeline(defs, D, 90, kind === 'long' ? {beat: 1, minScene: 2.2} : {beat: 0.6, minScene: 1.6});
  }, [kind]);

export const Film: React.FC<{kind: 'long' | 'short'}> = ({kind}) => {
  useFonts();
  const timeline = useFilmTimeline(kind);
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const planned = kind === 'long' ? LONG_SCENES : SHORT_SCENES;
  const sceneIndex = timeline.scenes.findIndex((s) => frame >= s.start && frame < s.start + s.dur);
  const current = timeline.scenes[sceneIndex];
  const idxLabel = `${String(Math.max(1, sceneIndex + 1)).padStart(2, '0')} / ${String(planned.length).padStart(2, '0')}`;

  const cues = useMemo<Cue[]>(() => {
    const out: Cue[] = [];
    timeline.scenes.forEach((s, i) => {
      if (i > 0) out.push({at: s.start - 1, name: 'whoosh', vol: 0.32});
      s.lines.forEach((l, k) => {
        if (k > 0) out.push({at: s.start + l.start - 3, name: 'sweep', vol: 0.18});
      });
      if (s.id === 'crisis' || s.id === 'crisisShort') out.push({at: s.start + (s.lines[1]?.start ?? 90), name: 'impact', vol: 0.5});
      if (s.id === 'reveal') out.push({at: s.start + (s.lines[0]?.start ?? 0), name: 'shimmer', vol: 0.35});
      if (s.id === 'index') out.push({at: s.start + (s.lines[0]?.start ?? 0) + 20, name: 'pop', vol: 0.4});
      if (s.lines[0]) out.push({at: s.start + s.lines[0].start - 4, name: 'pop', vol: 0.22});
    });
    return out;
  }, [timeline]);

  const voWindows = useMemo(
    () => timeline.scenes.flatMap((s) => s.lines.map((l) => [s.start + l.start, s.start + l.start + l.dur] as const)),
    [timeline],
  );

  const musicVolume = (f: number) => {
    const base = kind === 'long' ? 0.16 : 0.19;
    let duck = 0;
    for (const [a, b] of voWindows) {
      if (f > a - 14 && f < b + 10) {
        const inRamp = clamp01((f - (a - 14)) / 14);
        const outRamp = clamp01(((b + 10) - f) / 10);
        duck = Math.max(duck, Math.min(inRamp, outRamp));
      }
    }
    const endFade = clamp01((durationInFrames - f) / 30);
    return base * (1 - 0.55 * duck) * endFade;
  };

  const allLines = timeline.scenes.flatMap((s) =>
    s.lines.map((l) => ({...l, start: l.start + s.start})),
  );

  return (
    <AbsoluteFill style={{background: C.ink}}>
      <style>{FONT_CSS}</style>

      {timeline.scenes.map((s) => {
        const Comp = COMPONENTS[s.id];
        if (!Comp) return null;
        return (
          <Sequence key={s.id} from={s.start} durationInFrames={s.dur} name={s.id} layout="none">
            <Comp lines={s.lines} dur={s.dur} />
          </Sequence>
        );
      })}

      {timeline.scenes
        .filter((s) => s.lines.length === 0)
        .map((s) => (
          <Sequence key={`outro-${s.id}`} from={s.start} durationInFrames={s.dur} layout="none">
            <Outro dur={s.dur} short={kind === 'short'} />
          </Sequence>
        ))}

      {/* logo sting on the last beat */}
      <Sequence from={Math.max(0, timeline.total - 120)} durationInFrames={120} layout="none">
        <SfxTrack cues={[{at: 0, name: 'shimmer', vol: 0.4}, {at: 8, name: 'impact', vol: 0.35}]} />
      </Sequence>

      <SfxTrack cues={cues} />

      {/* narration */}
      {timeline.scenes.map((s) =>
        s.lines.map((l) => (
          <Sequence key={`${s.id}-${l.id}`} from={s.start + l.start} durationInFrames={l.dur + 2} layout="none">
            <Audio src={staticFile(`vo/${l.id}.mp3`)} volume={1} />
          </Sequence>
        )),
      )}

      <Audio src={staticFile(`music/${kind === 'long' ? 'bed' : 'short'}.mp3`)} volume={musicVolume} loop />

      {/* scene-cut sweeps at every boundary except the first scene */}
      {timeline.scenes.slice(1).map((s) => (
        <Sequence key={`sweep-${s.id}`} from={s.start} durationInFrames={16} layout="none">
          <SceneSweep color={SCENE_ACCENT[s.id] ?? C.amber} dur={14} />
        </Sequence>
      ))}

      {/* global color grade: warm key from top, cool shadow from bottom */}
      <AbsoluteFill style={{pointerEvents: 'none', zIndex: 30, mixBlendMode: 'soft-light'}}>
        <div style={{position: 'absolute', inset: 0, background: `radial-gradient(90% 60% at 30% 12%, ${GRADE.key}, transparent 70%)`}} />
        <div style={{position: 'absolute', inset: 0, background: `radial-gradient(100% 70% at 70% 96%, ${GRADE.shade}, transparent 70%)`}} />
      </AbsoluteFill>

      <Captions lines={allLines} scale={1} bottom={0.115} maxWidth={0.84} />
      <FrameUI
        index={idxLabel}
        total={TITLES[current?.id ?? ''] ?? 'KlikTahu'}
        sceneTitle={TITLES[current?.id ?? ''] ?? ''}
        progress={frame / Math.max(1, timeline.total)}
        wmScale={kind === 'short' ? 1.15 : 1}
        showWatermark={current?.id !== 'outro'}
        revealAt={kind === 'short' ? 70 : 40}
        hideAfter={(kind === 'short' ? 60 : 75) * 90}
      />
    </AbsoluteFill>
  );
};
