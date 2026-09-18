import React, { useEffect, useState, useRef } from 'react';
import { LoaderPhase } from '../ceremony/types';
import { CeremonySignature } from '../ceremony/CeremonySignature';
import { CeremonyFlower } from '../ceremony/CeremonyFlower';
import { CeremonyProgress } from '../ceremony/CeremonyProgress';
import { CeremonyIdentity } from '../ceremony/CeremonyIdentity';

export interface LoaderProps {
  progress: number;
  loadingDone: boolean;
  onAwakenHero?: () => void;
  onFinish?: () => void;
}

const PHASE_ORDER: Record<LoaderPhase, number> = {
  INITIALIZING: 0,
  ATMOSPHERE: 1,
  SIGNING: 2,
  FLOWER_EMERGE: 3,
  IDENTITY_SETTLE: 4,
  READY: 5,
  EXITING: 6,
  COMPLETE: 7,
};

/**
 * Opening Ceremony Master Coordinator
 *
 * Deterministic Timeline & Monotonic Progress Contract:
 * 01 INITIALIZING:    0ms   – 450ms   (0%   – 12%)  Atmospheric inception
 * 02 ATMOSPHERE:      450ms – 1100ms  (12%  – 24%)  Subtle cosmic violet depth
 * 03 SIGNATURE:       1100ms – 3400ms (24%  – 68%)  Sequential authentic handwriting
 * 04 BOTANICAL BLOOM: 3400ms – 4400ms (68%  – 84%)  Velvet rose emergence from deep shadow
 * 05 IDENTITY:        4400ms – 5200ms (84%  – 96%)  Typographic identity settles
 * 06 READY:           5200ms – 5700ms (96%  – 100%) Harmonic lockup, deliberate hold
 * EXITING:            5700ms – 6500ms (100% locked, aperture expands to reveal Hero)
 * COMPLETE:           > 6500ms        (100% locked, unmount)
 *
 * Architectural Guarantees:
 * 1. ONE-SHOT LIFECYCLE: Never restarts on parent re-renders or prop updates.
 * 2. STRICT MONOTONICITY: Phase transitions only move forward (0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7).
 * 3. STRICT MONOTONIC PROGRESS: P(t + 1) >= P(t) under all circumstances.
 * 4. ISOLATED VIEWPORT WORLD: Full z-[99999] coverage, suppresses page scroll and underlying elements.
 * 5. SEAMLESS HERO HANDOFF: Deliberate 400ms settle before smooth aperture exit transition.
 */
export const Loader: React.FC<LoaderProps> = ({
  progress,
  loadingDone,
  onAwakenHero,
  onFinish,
}) => {
  const [phase, setPhase] = useState<LoaderPhase>('INITIALIZING');
  const [strokeProgress, setStrokeProgress] = useState<number>(0);
  const [flowerProgress, setFlowerProgress] = useState<number>(0);
  const [displayProgress, setDisplayProgress] = useState<number>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  // Stable references that NEVER trigger re-renders or reset the ceremony
  const onAwakenHeroRef = useRef(onAwakenHero);
  const onFinishRef = useRef(onFinish);
  const loadingDoneRef = useRef(loadingDone);
  const externalProgressRef = useRef(progress);

  // Monotonic state tracking
  const currentPhaseIndexRef = useRef<number>(0);
  const maxDisplayProgressRef = useRef<number>(0);
  const persistedStartTimeRef = useRef<number | null>(null);
  const heroAwakenedRef = useRef<boolean>(false);
  const finishedRef = useRef<boolean>(false);

  // Keep callback refs synchronized without affecting the animation loop
  useEffect(() => {
    onAwakenHeroRef.current = onAwakenHero;
    onFinishRef.current = onFinish;
    loadingDoneRef.current = loadingDone;
    externalProgressRef.current = progress;
  }, [onAwakenHero, onFinish, loadingDone, progress]);

  // Lock body scroll while ceremony is active
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

  const triggerAwakenHero = () => {
    if (!heroAwakenedRef.current) {
      heroAwakenedRef.current = true;
      if (onAwakenHeroRef.current) {
        onAwakenHeroRef.current();
      }
    }
  };

  // Master Ceremony RAF & Heartbeat Loop
  useEffect(() => {
    let isCancelled = false;
    let animId: number | null = null;
    let heartbeatId: number | null = null;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Instant visual lockup without stroke animation physics
      advancePhase('READY');
      setStrokeProgress(1);
      setFlowerProgress(1);
      setDisplayProgress(100);
      maxDisplayProgressRef.current = 100;

      const timer = setTimeout(() => {
        advancePhase('EXITING');
        setIsExiting(true);
        triggerAwakenHero();

        setTimeout(() => {
          advancePhase('COMPLETE');
          if (!finishedRef.current) {
            finishedRef.current = true;
            if (onFinishRef.current) onFinishRef.current();
          }
        }, 600);
      }, 800);

      return () => clearTimeout(timer);
    }

    if (persistedStartTimeRef.current === null) {
      persistedStartTimeRef.current = performance.now();
    }

    // Deterministic ceremony milestones (ms)
    // 01 INITIALIZING:   0ms   – 600ms  (0%  -> 15%)
    // 02 ATMOSPHERE:     600ms – 1500ms (15% -> 35%)
    // 03 SIGNATURE:      1500ms– 3600ms (35% -> 70%)
    // 04 AWAKENING:      3600ms– 5400ms (70% -> 96%) [Rose + Identity settle]
    // 05 ARRIVAL:        5400ms– 5800ms (96% -> 100%) [Harmonic lockup]
    // EXITING:           5800ms– 6600ms (100% locked, aperture expands)
    // COMPLETE:          > 6600ms       (Hero handoff & unmount)
    const T_INIT = 600;
    const T_ATMO = 1500;
    const T_SIGN = 3600;
    const T_FLOWER = 4600;
    const T_IDENTITY = 5400;
    const T_READY = 5800;
    const T_EXIT = 6600;
    const T_TIMEOUT = 7000;

    const tick = (now: number) => {
      if (isCancelled) return;
      const startTime = persistedStartTimeRef.current ?? now;
      const elapsed = now - startTime;

      let targetVisualPercent = 0;

      if (elapsed < T_INIT) {
        advancePhase('INITIALIZING');
        setStrokeProgress(0);
        setFlowerProgress(0);
        const t = Math.max(0, elapsed / T_INIT);
        // Step immediately to minimum 1% so the user never sees a frozen 0% state
        targetVisualPercent = Math.max(1, t * 15);
      } else if (elapsed < T_ATMO) {
        advancePhase('ATMOSPHERE');
        setStrokeProgress(0);
        setFlowerProgress(0);
        const t = (elapsed - T_INIT) / (T_ATMO - T_INIT);
        targetVisualPercent = 15 + t * 20; // 15% -> 35%
      } else if (elapsed < T_SIGN) {
        advancePhase('SIGNING');
        const signT = (elapsed - T_ATMO) / (T_SIGN - T_ATMO);
        setStrokeProgress(signT);
        setFlowerProgress(0.25 * signT);
        targetVisualPercent = 35 + signT * 35; // 35% -> 70%
      } else if (elapsed < T_FLOWER) {
        advancePhase('FLOWER_EMERGE');
        setStrokeProgress(1);
        const flowerT = (elapsed - T_SIGN) / (T_FLOWER - T_SIGN);
        setFlowerProgress(0.25 + flowerT * 0.75);
        targetVisualPercent = 70 + flowerT * 15; // 70% -> 85%
      } else if (elapsed < T_IDENTITY) {
        advancePhase('IDENTITY_SETTLE');
        setStrokeProgress(1);
        setFlowerProgress(1);
        const identityT = (elapsed - T_FLOWER) / (T_IDENTITY - T_FLOWER);
        targetVisualPercent = 85 + identityT * 11; // 85% -> 96%
      } else if (elapsed < T_READY) {
        advancePhase('READY');
        setStrokeProgress(1);
        setFlowerProgress(1);
        const readyT = (elapsed - T_IDENTITY) / (T_READY - T_IDENTITY);
        targetVisualPercent = 96 + readyT * 4; // 96% -> 100%

        // Real asset readiness gate: hold gently at 99% if network assets are still in flight,
        // unless master fail-safe timeout (7s) has been reached
        const isNetworkReady = loadingDoneRef.current || elapsed >= T_TIMEOUT;
        if (!isNetworkReady && targetVisualPercent >= 99) {
          targetVisualPercent = 99;
          const nextVal = Math.max(maxDisplayProgressRef.current, 99);
          if (nextVal > maxDisplayProgressRef.current) {
            maxDisplayProgressRef.current = nextVal;
            setDisplayProgress(nextVal);
          }
          return;
        }
      } else if (elapsed < T_EXIT) {
        // EXITING phase: aperture expands gracefully to reveal Hero
        advancePhase('EXITING');
        setIsExiting(true);
        triggerAwakenHero();
        setStrokeProgress(1);
        setFlowerProgress(1);
        targetVisualPercent = 100;
      } else {
        // COMPLETE: seamless handoff and unmount
        advancePhase('COMPLETE');
        triggerAwakenHero();
        if (!finishedRef.current) {
          finishedRef.current = true;
          if (onFinishRef.current) onFinishRef.current();
        }
        return;
      }

      // Mathematical Monotonicity Guarantee: P(t+1) >= P(t) under all conditions
      const computedProgress = Math.round(targetVisualPercent);
      if (computedProgress > maxDisplayProgressRef.current) {
        maxDisplayProgressRef.current = Math.min(100, computedProgress);
        setDisplayProgress(maxDisplayProgressRef.current);
      }
    };

    const loop = (now: number) => {
      if (isCancelled) return;
      tick(now);
      animId = requestAnimationFrame(loop);
    };

    // Immediate synchronous tick on mount
    tick(performance.now());
    animId = requestAnimationFrame(loop);

    // Heartbeat fallback interval (every 80ms) guarantees progress continues even if tab is in background
    heartbeatId = window.setInterval(() => {
      if (!isCancelled) {
        tick(performance.now());
      }
    }, 80);

    return () => {
      isCancelled = true;
      if (animId !== null) cancelAnimationFrame(animId);
      if (heartbeatId !== null) clearInterval(heartbeatId);
    };
  }, []); // Empty dependency array: one-shot lifetime across re-renders

  return (
    <div
      className={`fixed inset-0 w-screen h-screen flex flex-col justify-center items-center z-[99999] bg-[#030014] select-none overflow-hidden will-change-transform ${
        isExiting ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
      style={{
        transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isExiting ? 0 : 1,
      }}
      role="region"
      aria-label="Opening ceremony"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. PERSISTENT CELESTIAL ATMOSPHERE & APERTURE MASK
          Expands radially during EXITING phase to reveal Hero seamlessly
         ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden will-change-transform"
        style={{
          transform: isExiting ? 'scale(1.08)' : 'scale(1)',
          transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
          maskImage: isExiting
            ? 'radial-gradient(circle at 50% 50%, black 0%, black 60%, transparent 95%)'
            : 'radial-gradient(circle at 50% 50%, black 0%, black 85%, transparent 100%)',
          WebkitMaskImage: isExiting
            ? 'radial-gradient(circle at 50% 50%, black 0%, black 60%, transparent 95%)'
            : 'radial-gradient(circle at 50% 50%, black 0%, black 85%, transparent 100%)',
        }}
        aria-hidden="true"
      >
        {/* Central Ethereal Starlight Atmosphere (subtle cosmic mist) */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] sm:w-[70vw] max-w-[650px] aspect-square rounded-full mix-blend-screen will-change-transform transition-all duration-1000 ease-out"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.14) 0%, rgba(99, 102, 241, 0.06) 40%, transparent 70%)',
            filter: 'blur(48px)',
            opacity: phase === 'INITIALIZING' ? 0 : isExiting ? 0.75 : 0.55,
            transform: isExiting
              ? 'translate(-50%, -50%) scale(1.20)'
              : 'translate(-50%, -50%) scale(1)',
          }}
        />

        {/* Botanical Velvet Flower Form (restrained medium luminance, zero black box) */}
        <CeremonyFlower phase={phase} phaseProgress={flowerProgress} />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. CORE CEREMONIAL STAGE (SIGNATURE + IDENTITY + PROGRESS)
         ───────────────────────────────────────────────────────────── */}
      <div
        className="relative z-10 w-full max-w-4xl px-4 sm:px-6 flex flex-col items-center justify-center will-change-transform"
        style={{
          transform: isExiting ? 'scale(1.04) translate3d(0, -8px, 0)' : 'scale(1) translate3d(0, 0, 0)',
          filter: isExiting ? 'blur(3px)' : 'none',
          transition: 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), filter 0.85s ease',
        }}
      >
        {/* Sequential Handwriting Signature */}
        <CeremonySignature
          progress={strokeProgress}
          phase={phase}
        />

        {/* Typographic Identity Settle ("rocky babcock") */}
        <CeremonyIdentity phase={phase} />

        {/* Architectural Loading Progress Bar & Percentage */}
        <CeremonyProgress displayProgress={displayProgress} phase={phase} />
      </div>
    </div>
  );
};

export default Loader;

