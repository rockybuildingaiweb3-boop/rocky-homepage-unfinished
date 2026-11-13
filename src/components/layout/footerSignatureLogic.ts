export type SignatureAnimPhase = 'idle' | 'drawing' | 'finishing' | 'resting';

export interface SignatureStrokeSpec {
  id: string;
  durationMs: number;
  delayMs: number;
  easing: string;
}

/**
 * Natural handwriting stroke choreography for the Footer Author Seal:
 * 1. Capital 'R' ascender & loop (deliberate calligraphic start)
 * 2. 'ocky' continuous cursive sequence (overlapping natural pen flow)
 * 3. 'y' lower loop & bridge into 'B' (brisk connecting stroke)
 * 4. 'Babcock' & flourishing terminal line (confident sweeping finish)
 */
export const FOOTER_SIGNATURE_STROKES: readonly SignatureStrokeSpec[] = [
  {
    id: 'stroke-R',
    durationMs: 820,
    delayMs: 0,
    easing: 'cubic-bezier(0.37, 0, 0.2, 1)',
  },
  {
    id: 'stroke-ocky',
    durationMs: 740,
    delayMs: 760,
    easing: 'cubic-bezier(0.32, 0.04, 0.22, 1)',
  },
  {
    id: 'stroke-y-bridge',
    durationMs: 460,
    delayMs: 1440,
    easing: 'cubic-bezier(0.4, 0, 0.25, 1)',
  },
  {
    id: 'stroke-Babcock',
    durationMs: 1220,
    delayMs: 1840,
    easing: 'cubic-bezier(0.28, 0.02, 0.18, 1)',
  },
] as const;

export const SIGNATURE_FINISHING_SHEEN_MS = 950;

export function getTotalSignatureDrawDurationMs(
  strokes: readonly SignatureStrokeSpec[] = FOOTER_SIGNATURE_STROKES
): number {
  let maxEnd = 0;
  for (const s of strokes) {
    const end = s.delayMs + s.durationMs;
    if (end > maxEnd) maxEnd = end;
  }
  return maxEnd;
}
