export const C = {
  ink: '#07060A',
  ink2: '#0D0B12',
  ink3: '#141019',
  paper: '#F7F2E8',
  yellow: '#FFC531',
  amber: '#FFAE1F',
  orange: '#FF7A18',
  deepOrange: '#E85D04',
  red: '#FF4438',
  mint: '#3BE3A7',
  sky: '#63C7FF',
  muted: '#9C93A8',
  line: 'rgba(247,242,232,0.12)',
} as const;

export const F = {
  display: '"Bricolage Grotesque Variable", "Plus Jakarta Sans Variable", system-ui, sans-serif',
  body: '"Plus Jakarta Sans Variable", system-ui, sans-serif',
  mono: '"JetBrains Mono Variable", ui-monospace, monospace',
} as const;

export const SAFE = {
  x: 0.075,
  top: 0.075,
  bottom: 0.13,
} as const;

export const EASE = {
  out: [0.16, 1, 0.3, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  snap: [0.2, 0.9, 0.2, 1] as const,
};

/** Spring presets (stiffness/damping) for a consistent motion language. */
export const SPRING = {
  snappy: {stiffness: 240, damping: 20, mass: 0.7},
  smooth: {stiffness: 120, damping: 18, mass: 0.8},
  bouncy: {stiffness: 170, damping: 11, mass: 0.9},
  gentle: {stiffness: 70, damping: 16, mass: 1},
} as const;

/** Global color-grade stops applied as a screen/soft-light overlay. */
export const GRADE = {
  key: 'rgba(255,196,90,0.10)', // warm key light
  shade: 'rgba(30,40,90,0.14)', // cool shadow
} as const;
