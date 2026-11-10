import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, F} from '../theme';
import type {VoPlacement} from '../lib/timeline';
import {clamp01, springPop} from '../lib/anim';

const chunksOf = (text: string): string[] => {
  const parts = text.replace(/[—:]/g, ',').split(/(?<=[.,?!])\s+/);
  const out: string[] = [];
  for (const p of parts) {
    const words = p.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) continue;
    if (words.length <= 6) out.push(words.join(' '));
    else {
      for (let i = 0; i < words.length; i += 5) out.push(words.slice(i, i + 5).join(' '));
    }
  }
  return out;
};

/** V2 broadcast captions: frosted pill, word-by-word warm fill, pop on chunk change. */
export const Captions: React.FC<{lines: VoPlacement[]; scale?: number; bottom?: number; maxWidth?: number}> = ({
  lines,
  scale = 1,
  bottom = 0.115,
  maxWidth = 0.86,
}) => {
  const frame = useCurrentFrame();
  const active = lines.find((l) => frame >= l.start - 2 && frame <= l.start + l.dur + 2);
  if (!active) return null;
  const chunks = chunksOf(active.text);
  const weights = chunks.map((c) => c.length + 6);
  const total = weights.reduce((a, b) => a + b, 0);
  let acc = 0;
  let idx = 0;
  let localP = 0;
  for (let i = 0; i < chunks.length; i++) {
    const share = weights[i] / total;
    if (frame <= active.start + acc * active.dur + share * active.dur || i === chunks.length - 1) {
      idx = i;
      localP = clamp01((frame - (active.start + acc * active.dur)) / (share * active.dur));
      break;
    }
    acc += share;
  }
  const text = chunks[idx];
  const words = text.split(' ');
  const lit = Math.floor(localP * words.length + 0.0001);
  const pop = springPop(frame, 90, active.start + acc * active.dur, 'snappy');

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '46%',
          background: 'linear-gradient(180deg, transparent, rgba(5,4,8,0.55) 52%, rgba(5,4,8,0.85))',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: `${(1 - maxWidth) * 50}%`,
          right: `${(1 - maxWidth) * 50}%`,
          bottom: `${bottom * 100}%`,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            textAlign: 'center',
            fontFamily: F.body,
            fontWeight: 800,
            fontSize: 68 * scale,
            lineHeight: 1.22,
            letterSpacing: '-0.015em',
            color: C.paper,
            padding: `${22 * scale}px ${36 * scale}px`,
            borderRadius: 28 * scale,
            background: 'rgba(10,8,15,0.72)',
            border: '1px solid rgba(247,242,232,0.16)',
            boxShadow: '0 18px 60px rgba(0,0,0,0.5)',
            transform: `scale(${0.96 + pop * 0.04})`,
          }}
        >
          {words.map((w, i) => (
            <span key={`${idx}-${i}`} style={{color: i <= lit ? C.yellow : 'rgba(247,242,232,0.92)'}}>
              {w}{' '}
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
