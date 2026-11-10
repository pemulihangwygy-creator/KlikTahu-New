# KlikTahu · Video Engine

Motion-graphics explainer built entirely from code with **Remotion + React + TypeScript**.
Vertical 2K (1440×2560), 90 fps, Indonesian narration, burned-in broadcast captions,
scene-synced sound design and a persistent KlikTahu watermark.

Every number on screen is sourced (BPS — Consumer Price Index releases) and listed in
`src/data/facts.ts`. Narrative lives in `src/data/script.ts`, scene order and pacing in
`src/data/scenes.ts` — the timeline is generated from measured audio durations, so visuals
stay locked to the voice-over automatically.

## Commands

```bash
npm ci
npm run prep           # fonts, grain, music, sfx, timeline metadata
npm run dev            # Remotion Studio (preview / scrub)
npm run render:long    # 1440x2560 @ 90fps, writes out/long.mp4
npm run render:short   # same voice, tighter cut, writes out/short.mp4
npm run typecheck
```

Audio assets are synthesized procedurally (`scripts/make-audio.mjs`) and the film grain is
generated (`scripts/make-noise.mjs`), so the repo stays small and every render is reproducible.

## Layout

```
src/
  Film.tsx            timeline assembly, ducking, captions, chrome
  Root.tsx            compositions: KlikTahuLong / KlikTahuShort
  components/         Backdrop, Watermark, Chart, FX, Captions, BigNumber…
  scenes/             one file per beat of the story
  data/               facts, script, scene order, measured durations
scripts/              asset generation, timeline, Drive upload
.github/workflows/    manual, read-only render pipeline
```

Rendered video and metadata are published to **Google Drive**, not to Git.

## Data

| Period | Headline inflation (y-on-y) |
| --- | --- |
| 1998 | 77,63% |
| 2024 | 1,57% (lowest since 1958) |
| 2025 | 2,92% |

Sources: BPS, *Berita Resmi Statistik — Indeks Harga Konsumen* (Des 2024, Des 2025).
Illustrative figures are labelled **ilustrasi** on screen.
