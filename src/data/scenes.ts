export type SceneDef = {
  id: string;
  lines: string[];
  /** frames of silence before the first line */
  lead: number;
  /** frames after the last line */
  hold: number;
  /** extra beat between lines inside this scene */
  beat?: number;
};

/** Long-form: documentary pacing, allows breath between chapters. */
export const LONG_SCENES: SceneDef[] = [
  { id: 'hook', lines: ['v01', 'v02'], lead: 44, hold: 46, beat: 14 },
  { id: 'reveal', lines: ['v03', 'v04'], lead: 16, hold: 40, beat: 12 },
  { id: 'survey', lines: ['v05', 'v06'], lead: 16, hold: 30, beat: 10 },
  { id: 'basket', lines: ['v07', 'v08'], lead: 12, hold: 34, beat: 8 },
  { id: 'index', lines: ['v09', 'v10'], lead: 12, hold: 36, beat: 10 },
  { id: 'chart', lines: ['v11', 'v12'], lead: 12, hold: 34, beat: 10 },
  { id: 'crisis', lines: ['v13', 'v14', 'v15', 'v16'], lead: 14, hold: 50, beat: 6 },
  { id: 'power', lines: ['v17'], lead: 12, hold: 40 },
  { id: 'contrast', lines: ['v18', 'v19'], lead: 12, hold: 44, beat: 14 },
  { id: 'nuance', lines: ['v20'], lead: 12, hold: 66 },
  { id: 'outro', lines: [], lead: 0, hold: 210 },
];

/** Short: same voice, same clips — tighter cutting, no chapter intros. */
export const SHORT_SCENES: SceneDef[] = [
  { id: 'hook', lines: ['v01', 'v02'], lead: 20, hold: 18, beat: 6 },
  { id: 'crisisShort', lines: ['v15', 'v16'], lead: 10, hold: 22, beat: 6 },
  { id: 'contrastShort', lines: ['v18'], lead: 8, hold: 24 },
  { id: 'nuanceShort', lines: ['v20'], lead: 8, hold: 40 },
  { id: 'outro', lines: [], lead: 0, hold: 190 },
];
