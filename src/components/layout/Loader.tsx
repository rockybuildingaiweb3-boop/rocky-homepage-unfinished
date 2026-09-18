import React, { useState, useEffect, useRef } from 'react';
import { LoaderPhase } from '../ceremony/types';
import { CeremonyFlower } from '../ceremony/CeremonyFlower';
import { CeremonySignature } from '../ceremony/CeremonySignature';
import { CeremonyProgress } from '../ceremony/CeremonyProgress';
import { CeremonyIdentity } from '../ceremony/CeremonyIdentity';

interface LoaderProps {
  progress?: number;
  loadingDone?: boolean;
  onAwakenHero?: () => void;
  onFinish?: () => void;
}

const PHASE_ORDER: Record<LoaderPhase, number> = {
  VOID: 0,
  AWAKENING: 1,
  EMERGENCE: 2,
  SIGNING: 3,
  CONVERGENCE: 4,
  CLIMAX: 5,
  SILENCE: 6,
  ARRIVAL: 7,
  EXITING: 8,
  COMPLETE: 9,
};

// Subtle, low-count cosmic dust motes for authentic spatial depth
const COSMIC_DUST_MOTES = [
  { id: 'm1', left: '16%', top: '20%', size: 1.5, opacity: 0.22, dirX: -1, dirY: -1 },
  { id: 'm2', left: '84%', top: '18%', size: 2.0, opacity: 0.26, dirX: 1, dirY: -1 },
  { id: 'm3', left: '14%', top: '76%', size: 1.8, opacity: 0.20, dirX: -1, dirY: 1 },
  { id: 'm4', left: '86%', top: '80%', size: 2.2, opacity: 0.30, dirX: 1, dirY: 1 },
  { id: 'm5', left: '30%', top: '12%', size: 1.2, opacity: 0.16, dirX: -0.5, dirY: -1 },
  { id: 'm6', left: '70%', top: '86%', size: 1.6, opacity: 0.24, dirX: 0.8, dirY: 1 },
  { id: 'm7', left: '22%', top: '60%', size: 1.4, opacity: 0.18, dirX: -1, dirY: 0.5 },
  { id: 'm8', left: '78%', top: '36%', size: 1.8, opacity: 0.22, dirX: 1, dirY: -0.5 },
  { id: 'm9', left: '46%', top: '8%', size: 2.0, opacity: 0.28, dirX: 0, dirY: -1 },
  { id: 'm10', left: '54%', top: '92%', size: 1.5, opacity: 0.20, dirX: 0, dirY: 1 },
  { id: 'm11', left: '8%', top: '44%', size: 1.3, opacity: 0.14, dirX: -1, dirY: 0 },
  { id: 'm12', left: '92%', top: '54%', size: 1.7, opacity: 0.24, dirX: 1, dirY: 0 },
];

/**
 * Loader — Cinematic Opening Ceremony
 *
 * Authored according to strict creative direction:
 * VOID → AWAKENING → ROSE EMERGENCE → SIGNATURE → CONVERGENCE → CLIMAX → SILENCE → ARRIVAL
 *
 * 1. SPACE (vast, deep obsidian void)
 * 2. ROSE (precious botanical visual anchor at authentic native scale)
 * 3. SIGNATURE (handwritten performance, causally ignited by light flowing from the rose)
 * 4. IDENTITY TEXT (subordinate, reveals cleanly during climax)
 * 5. SYSTEM TELEMETRY (precision instrumentation at the bottom)
 *
 * Monotonic progress guaranteed. Climax creates true spatial causality:
 * SIGNATURE FINISHES → ENERGY CONVERGES → INNER ILLUMINATION IN ROSE → SPACE BREATHES → SILENCE → ARRIVAL.
 */
export const Loader: React.FC<LoaderProps> = ({
  progress = 0,
  loadingDone = false,
  onAwakenHero,
  onFinish,
}) => {
  const [phase, setPhase] = useState<LoaderPhase>('VOID');
  const [phaseProgress, setPhaseProgress] = useState<number>(0);
  const [strokeProgress, setStrokeProgress] = useState<number>(0);
  const [convergenceProgress, setConvergenceProgress] = useState<number>(0);
  const [climaxProgress, setClimaxProgress] = useState<number>(0);
  const [displayProgress, setDisplayProgress] = useState<number>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  // Stable references for external callbacks and network flags
  const onAwakenHeroRef = useRef(onAwakenHero);
  const onFinishRef = useRef(onFinish);
  const loadingDoneRef = useRef(loadingDone);

  // Monotonic tracking references
  const currentPhaseIndexRef = useRef<number>(0);
  const maxDisplayProgressRef = useRef<number>(0);
  const persistedStartTimeRef = useRef<number | null>(null);
  const heroAwakenedRef = useRef<boolean>(false);
  const finishedRef = useRef<boolean>(false);

  useEffect(() => {
    onAwakenHeroRef.current = onAwakenHero;
    onFinishRef.current = onFinish;
    loadingDoneRef.current = loadingDone;
  }, [onAwakenHero, onFinish, loadingDone]);

  // Lock body scroll during ceremony
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Safe helper to advance phase strictly forward
  const advancePhase = (nextPhase: LoaderPhase) => {
    const nextIdx = PHASE_ORDER[nextPhase];
    if (nextIdx > currentPhaseIndexRef.current) {
      currentPhaseIndexRef.current = nextIdx;
      setPhase(nextPhase);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // MASTER CEREMONY TIMELINE & PROGRESS ENGINE
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Respect user's motion preferences
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      advancePhase('ARRIVAL');
      setDisplayProgress(100);
      const timer = setTimeout(() => {
        if (!heroAwakenedRef.current) {
          heroAwakenedRef.current = true;
          if (onAwakenHeroRef.current) onAwakenHeroRef.current();
        }
        if (onFinishRef.current) onFinishRef.current();
      }, 1200);
      return () => clearTimeout(timer);
    }

    // Timeline Configuration (ms)
    const T_VOID_END = 850;        // 0 to 850ms   (0% - 12%)
    const T_AWAKEN_END = 2050;     // 850 to 2050ms (12% - 28%)
    const T_EMERGE_END = 3400;     // 2050 to 3400ms (28% - 48%)
    const T_SIGN_END = 5250;       // 3400 to 5250ms (48% - 76%)
    const T_CONVERGE_END = 5700;   // 5250 to 5700ms (76% - 82%)
    const T_CLIMAX_END = 6450;     // 5700 to 6450ms (82% - 96%)
    const T_SILENCE_END = 6800;    // 6450 to 6800ms (96% - 99%)
    const T_ARRIVAL_END = 7200;    // 6800 to 7200ms (100% locked)
    const T_EXIT_END = 7950;       // 7200 to 7950ms (transition into Hero)

    let animationFrameId: number;
    let fallbackIntervalId: NodeJS.Timeout;

    const startTimestamp = performance.now();
    persistedStartTimeRef.current = startTimestamp;

    const updateCeremony = (now: number) => {
      if (finishedRef.current) return;

      const elapsed = Math.max(0, now - (persistedStartTimeRef.current || startTimestamp));

      // ── Act I: THE VOID (0 - 850ms) ───────────────────────────────────
      if (elapsed < T_VOID_END) {
        advancePhase('VOID');
        const p = elapsed / T_VOID_END;
        setPhaseProgress(p);
        const targetPct = Math.round(1 + p * 11); // 1% -> 12%
        const monotonicPct = Math.max(maxDisplayProgressRef.current, targetPct);
        maxDisplayProgressRef.current = monotonicPct;
        setDisplayProgress(monotonicPct);
      }
      // ── Act II: AWAKENING (850 - 2050ms) ──────────────────────────────
      else if (elapsed < T_AWAKEN_END) {
        advancePhase('AWAKENING');
        const p = (elapsed - T_VOID_END) / (T_AWAKEN_END - T_VOID_END);
        setPhaseProgress(p);
        const targetPct = Math.round(12 + p * 16); // 12% -> 28%
        const monotonicPct = Math.max(maxDisplayProgressRef.current, targetPct);
        maxDisplayProgressRef.current = monotonicPct;
        setDisplayProgress(monotonicPct);
      }
      // ── Act III: ROSE EMERGENCE (2050 - 3400ms) ───────────────────────
      else if (elapsed < T_EMERGE_END) {
        advancePhase('EMERGENCE');
        const p = (elapsed - T_AWAKEN_END) / (T_EMERGE_END - T_AWAKEN_END);
        setPhaseProgress(p);
        const targetPct = Math.round(28 + p * 20); // 28% -> 48%
        const monotonicPct = Math.max(maxDisplayProgressRef.current, targetPct);
        maxDisplayProgressRef.current = monotonicPct;
        setDisplayProgress(monotonicPct);
      }
      // ── Act IV: SIGNATURE PERFORMANCE (3400 - 5250ms) ─────────────────
      else if (elapsed < T_SIGN_END) {
        advancePhase('SIGNING');
        const p = (elapsed - T_EMERGE_END) / (T_SIGN_END - T_EMERGE_END);
        setPhaseProgress(p);
        setStrokeProgress(p);
        const targetPct = Math.round(48 + p * 28); // 48% -> 76%
        const monotonicPct = Math.max(maxDisplayProgressRef.current, targetPct);
        maxDisplayProgressRef.current = monotonicPct;
        setDisplayProgress(monotonicPct);
      }
      // ── Act V Part 1: CONVERGENCE (5250 - 5700ms) ─────────────────────
      else if (elapsed < T_CONVERGE_END) {
        advancePhase('CONVERGENCE');
        const p = (elapsed - T_SIGN_END) / (T_CONVERGE_END - T_SIGN_END);
        setPhaseProgress(p);
        setStrokeProgress(1.0);
        setConvergenceProgress(p);
        const targetPct = Math.round(76 + p * 6); // 76% -> 82%
        const monotonicPct = Math.max(maxDisplayProgressRef.current, targetPct);
        maxDisplayProgressRef.current = monotonicPct;
        setDisplayProgress(monotonicPct);
      }
      // ── Act V Part 2: CLIMAX (5700 - 6450ms) ──────────────────────────
      else if (elapsed < T_CLIMAX_END) {
        advancePhase('CLIMAX');
        const p = (elapsed - T_CONVERGE_END) / (T_CLIMAX_END - T_CONVERGE_END);
        setPhaseProgress(p);
        setStrokeProgress(1.0);
        setConvergenceProgress(1.0);
        setClimaxProgress(p);
        const targetPct = Math.round(82 + p * 14); // 82% -> 96%
        const monotonicPct = Math.max(maxDisplayProgressRef.current, targetPct);
        maxDisplayProgressRef.current = monotonicPct;
        setDisplayProgress(monotonicPct);
      }
      // ── Act V Part 3: SILENCE (6450 - 6800ms) ─────────────────────────
      else if (elapsed < T_SILENCE_END) {
        advancePhase('SILENCE');
        const p = (elapsed - T_CLIMAX_END) / (T_SILENCE_END - T_CLIMAX_END);
        setPhaseProgress(p);
        setStrokeProgress(1.0);
        setConvergenceProgress(1.0);
        setClimaxProgress(1.0);
        const targetPct = Math.round(96 + p * 3); // 96% -> 99%
        const monotonicPct = Math.max(maxDisplayProgressRef.current, targetPct);
        maxDisplayProgressRef.current = monotonicPct;
        setDisplayProgress(monotonicPct);
      }
      // ── Act VI: ARRIVAL (6800 - 7200ms) ───────────────────────────────
      else if (elapsed < T_ARRIVAL_END) {
        advancePhase('ARRIVAL');
        setStrokeProgress(1.0);
        setClimaxProgress(1.0);
        setConvergenceProgress(1.0);

        // Progress reaches 100% cleanly and locks
        maxDisplayProgressRef.current = 100;
        setDisplayProgress(100);
      }
      // ── Act VII: HERO TRANSITION (7200 - 7950ms) ──────────────────────
      else if (elapsed < T_EXIT_END) {
        advancePhase('EXITING');
        setIsExiting(true);
        maxDisplayProgressRef.current = 100;
        setDisplayProgress(100);

        // Trigger Hero awakening at start of spatial expansion
        if (!heroAwakenedRef.current) {
          heroAwakenedRef.current = true;
          if (onAwakenHeroRef.current) onAwakenHeroRef.current();
        }
      }
      // ── Act VIII: COMPLETE (> 7950ms) ──────────────────────────────────
      else {
        advancePhase('COMPLETE');
        maxDisplayProgressRef.current = 100;
        setDisplayProgress(100);

        if (!heroAwakenedRef.current) {
          heroAwakenedRef.current = true;
          if (onAwakenHeroRef.current) onAwakenHeroRef.current();
        }

        if (!finishedRef.current) {
          finishedRef.current = true;
          if (onFinishRef.current) onFinishRef.current();
        }
        return;
      }

      animationFrameId = requestAnimationFrame(updateCeremony);
    };

    animationFrameId = requestAnimationFrame(updateCeremony);

    // Watchdog fallback heartbeat (30Hz) in case RAF is tab-throttled
    fallbackIntervalId = setInterval(() => {
      if (finishedRef.current) {
        clearInterval(fallbackIntervalId);
        return;
      }
      const now = performance.now();
      const elapsed = Math.max(0, now - (persistedStartTimeRef.current || startTimestamp));

      // Force unblock if elapsed time exceeds 8.5s
      if (elapsed >= 8500 && !finishedRef.current) {
        finishedRef.current = true;
        if (!heroAwakenedRef.current) {
          heroAwakenedRef.current = true;
          if (onAwakenHeroRef.current) onAwakenHeroRef.current();
        }
        if (onFinishRef.current) onFinishRef.current();
        clearInterval(fallbackIntervalId);
      }
    }, 150);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(fallbackIntervalId);
    };
  }, []);

  // Spatial response variables during climax (Space reacts in unison with the rose)
  const climaxT = Math.max(0, Math.min(1, climaxProgress));
  const spaceExpansion = 1.0 + Math.sin(climaxT * Math.PI) * 0.04;
  const atmoBloomOpacity =
    phase === 'CLIMAX' || phase === 'SILENCE' || phase === 'ARRIVAL'
      ? 0.35 + Math.sin(climaxT * Math.PI) * 0.25
      : phase === 'VOID'
      ? 0.04
      : 0.18;

  // Dust mote displacement during climax (outward drift)
  const dustDisplacement = Math.sin(climaxT * Math.PI) * 14;

  return (
    <div
      id="cinematic-loader"
      className="fixed inset-0 w-screen h-screen flex flex-col justify-center items-center z-[99999] bg-[#02000c] select-none overflow-hidden will-change-transform"
      style={{
        transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isExiting ? 0 : 1,
      }}
      role="region"
      aria-label="Opening ceremony"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. DEEP OBSIDIAN COSMIC SPACE LAYER (Act I & Background)
         ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none select-none z-0 will-change-transform transition-transform duration-1000 ease-out"
        style={{
          background:
            'radial-gradient(ellipse 75% 75% at 50% 50%, rgba(18, 6, 38, 0.70) 0%, rgba(7, 2, 18, 0.94) 55%, #02000c 100%)',
          transform: `scale(${spaceExpansion})`,
        }}
        aria-hidden="true"
      />

      {/* ─────────────────────────────────────────────────────────────
          2. DELICATE COSMIC DUST MOTES (Spatial depth only, no spam)
         ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden" aria-hidden="true">
        {COSMIC_DUST_MOTES.map((m) => (
          <div
            key={m.id}
            className="absolute rounded-full bg-purple-200 pointer-events-none will-change-transform"
            style={{
              left: m.left,
              top: m.top,
              width: `${m.size}px`,
              height: `${m.size}px`,
              opacity: m.opacity * (phase === 'VOID' ? 0.35 : 1),
              filter: 'blur(0.4px)',
              transform: `translate3d(${m.dirX * dustDisplacement}px, ${m.dirY * dustDisplacement}px, 0)`,
              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease',
            }}
          />
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. RESPONSIVE ATMOSPHERIC CORE (Breathes at Climax)
         ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute w-[360px] sm:w-[480px] md:w-[560px] aspect-square rounded-full mix-blend-screen pointer-events-none select-none z-0 will-change-transform transition-all duration-700 ease-out"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.20) 0%, rgba(225, 29, 72, 0.08) 40%, transparent 68%)',
          filter: 'blur(48px)',
          opacity: atmoBloomOpacity,
          transform: `scale(${spaceExpansion * 1.06})`,
        }}
        aria-hidden="true"
      />

      {/* ─────────────────────────────────────────────────────────────
          4. UNIFIED CELESTIAL ALTAR (Visual Hierarchy: Section 18)
             SPACE → ROSE (Anchor) → SIGNATURE → IDENTITY → TELEMETRY
         ───────────────────────────────────────────────────────────── */}
      <div
        className="relative z-10 w-full max-w-xl px-4 flex flex-col items-center justify-center will-change-transform"
        style={{
          transform: isExiting
            ? 'scale(1.12) translate3d(0, -10px, 0)'
            : `scale(${spaceExpansion})`,
          transition: isExiting
            ? 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)'
            : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* ── Visual Anchor: Precious physical rose at authentic scale ── */}
        <CeremonyFlower
          phase={phase}
          phaseProgress={phaseProgress}
          climaxProgress={climaxProgress}
          convergenceProgress={convergenceProgress}
          isExiting={isExiting}
        />

        {/* ── Calligraphic Signature: Sits elegantly below the rose ── */}
        <div className="relative w-full flex flex-col items-center -mt-2 sm:-mt-3">
          <CeremonySignature
            progress={strokeProgress}
            phase={phase}
            climaxProgress={climaxProgress}
            convergenceProgress={convergenceProgress}
          />
        </div>

        {/* ── Typographic Identity: rocky babcock ── */}
        <CeremonyIdentity phase={phase} climaxProgress={climaxProgress} />

        {/* ── Precision System Telemetry ── */}
        <CeremonyProgress displayProgress={displayProgress} phase={phase} />
      </div>
    </div>
  );
};

export default Loader;
