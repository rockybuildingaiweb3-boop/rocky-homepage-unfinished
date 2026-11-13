export type SignatureAnimPhase = 'idle' | 'arriving' | 'drawing' | 'bloom' | 'resting';

export interface SignatureStrokeSpec {
  id: string;
  durationMs: number;
  delayMs: number;
  easing: string;
}

/**
 * Pen arrival duration before the first stroke begins (Stage 1 — Pen Arrival).
 */
export const SIGNATURE_PEN_ARRIVAL_MS = 460;

/**
 * Natural handwriting stroke choreography for the Footer Author Seal (Stage 2 — Handwriting):
 * 1. Capital 'R' ascender & loop (deliberate calligraphic start)
 * 2. 'ocky' continuous cursive sequence (overlapping natural pen flow)
 * 3. 'y' lower loop & bridge into 'B' (brisk connecting stroke)
 * 4. 'Babcock' & flourishing terminal line (confident sweeping finish)
 */
export const FOOTER_SIGNATURE_STROKES: readonly SignatureStrokeSpec[] = [
  {
    id: 'stroke-R',
    durationMs: 780,
    delayMs: 0,
    easing: 'cubic-bezier(0.37, 0, 0.2, 1)',
  },
  {
    id: 'stroke-ocky',
    durationMs: 700,
    delayMs: 720,
    easing: 'cubic-bezier(0.32, 0.04, 0.22, 1)',
  },
  {
    id: 'stroke-y-bridge',
    durationMs: 440,
    delayMs: 1360,
    easing: 'cubic-bezier(0.4, 0, 0.25, 1)',
  },
  {
    id: 'stroke-Babcock',
    durationMs: 1180,
    delayMs: 1740,
    easing: 'cubic-bezier(0.28, 0.02, 0.18, 1)',
  },
] as const;

/**
 * Signature Bloom travel duration when all 4 strokes complete (Stage 3 — Signature Bloom).
 */
export const SIGNATURE_FINISHING_SHEEN_MS = 1050;

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

export interface FooterPlatformBrandSpec {
  id: string;
  name: string;
  link: string;
  accentTextClass: string;
  underlineGradient: string;
  iconGlowColor: string;
}

export const FOOTER_PLATFORM_BRANDS: Record<string, FooterPlatformBrandSpec> = {
  GitHub: {
    id: 'github',
    name: 'GitHub',
    link: 'https://github.com/RockyBabcock',
    accentTextClass: 'group-hover:text-slate-100',
    underlineGradient: 'linear-gradient(90deg, #94a3b8 0%, #f8fafc 100%)',
    iconGlowColor: '#e2e8f0',
  },
  'Twitter / X': {
    id: 'twitter',
    name: 'Twitter / X',
    link: 'https://x.com/RockyBabcock',
    accentTextClass: 'group-hover:text-sky-200',
    underlineGradient: 'linear-gradient(90deg, #38bdf8 0%, #bae6fd 100%)',
    iconGlowColor: '#7dd3fc',
  },
  Discord: {
    id: 'discord',
    name: 'Discord',
    link: 'https://discord.com',
    accentTextClass: 'group-hover:text-indigo-200',
    underlineGradient: 'linear-gradient(90deg, #6366f1 0%, #a5b4fc 100%)',
    iconGlowColor: '#818cf8',
  },
  YouTube: {
    id: 'youtube',
    name: 'YouTube',
    link: 'https://youtube.com',
    accentTextClass: 'group-hover:text-rose-200',
    underlineGradient: 'linear-gradient(90deg, #e11d48 0%, #fda4af 100%)',
    iconGlowColor: '#fb7185',
  },
  LinkedIn: {
    id: 'linkedin',
    name: 'LinkedIn',
    link: 'https://linkedin.com',
    accentTextClass: 'group-hover:text-cyan-200',
    underlineGradient: 'linear-gradient(90deg, #0284c7 0%, #67e8f9 100%)',
    iconGlowColor: '#38bdf8',
  },
  Instagram: {
    id: 'instagram',
    name: 'Instagram',
    link: 'https://instagram.com',
    accentTextClass: 'group-hover:text-pink-200',
    underlineGradient: 'linear-gradient(90deg, #f472b6 0%, #fb923c 100%)',
    iconGlowColor: '#f472b6',
  },
  'Spotify Sound': {
    id: 'spotify',
    name: 'Spotify Sound',
    link: 'https://open.spotify.com',
    accentTextClass: 'group-hover:text-emerald-200',
    underlineGradient: 'linear-gradient(90deg, #10b981 0%, #6ee7b7 100%)',
    iconGlowColor: '#34d399',
  },
  Telegram: {
    id: 'telegram',
    name: 'Telegram',
    link: 'https://t.me',
    accentTextClass: 'group-hover:text-blue-200',
    underlineGradient: 'linear-gradient(90deg, #3b82f6 0%, #93c5fd 100%)',
    iconGlowColor: '#60a5fa',
  },
};

export function resolveFooterPlatformBrand(name: string): FooterPlatformBrandSpec {
  return (
    FOOTER_PLATFORM_BRANDS[name] || {
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name,
      link: '#',
      accentTextClass: 'group-hover:text-purple-200',
      underlineGradient: 'linear-gradient(90deg, #a855f7 0%, #e9d5ff 100%)',
      iconGlowColor: '#d8b4fe',
    }
  );
}

export const BACK_TO_TOP_RING_RADIUS = 24;

export interface BackToTopRingInput {
  progress: number;
  isReturning: boolean;
  radius?: number;
}

export interface BackToTopRingMetrics {
  progress: number;
  circumference: number;
  dashOffset: number;
  ringScale: number;
  ringOpacity: number;
}

/**
 * Pure geometry and reverse-collapse kinetics for the Footer circular Back to Top ring.
 * As the page returns toward Hero (progress: 1 -> 0 while isReturning is true), the stroke
 * unwinds cleanly in reverse and gently contracts inward (ringScale: 1 -> 0.91).
 */
export function computeBackToTopRingMetrics({
  progress,
  isReturning,
  radius = BACK_TO_TOP_RING_RADIUS,
}: BackToTopRingInput): BackToTopRingMetrics {
  const safeProgress = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - safeProgress);
  const ringScale = isReturning ? Number((0.91 + safeProgress * 0.09).toFixed(4)) : 1;
  const ringOpacity = safeProgress <= 0.005 ? 0.22 : Number((0.45 + safeProgress * 0.55).toFixed(3));

  return {
    progress: safeProgress,
    circumference: Number(circumference.toFixed(3)),
    dashOffset: Number(dashOffset.toFixed(3)),
    ringScale,
    ringOpacity,
  };
}

/**
 * Smooth quartic ease-in-out curve for cinematic scroll return to Hero.
 */
export function easeInOutQuart(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}

