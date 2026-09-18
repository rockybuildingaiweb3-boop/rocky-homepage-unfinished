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
  SUSPENSE: 4,
  CLIMAX: 5,
  ARRIVAL: 6,
  EXITING: 7,
  COMPLETE: 8,
};

// Subtle, low-count cosmic dust motes (depth perception only, no glitter spam)
const COSMIC_DUST_MOTES = [
  { id: 'm1', left: '18%', top: '22%', size: 1.5, opacity: 0.25, driftX: 6, driftY: -10, dur: 18 },
  { id: 'm2', left: '82%', top: '18%', size: 2.0, opacity: 0.30, driftX: -8, driftY: 12, dur: 22 },
  { id: 'm3', left: '12%', top: '75%', size: 1.8, opacity: 0.22, driftX: 10, driftY: -8, dur: 16 },
  { id: 'm4', left: '88%', top: '78%', size: 2.2, opacity: 0.35, driftX: -7, driftY: -12, dur: 20 },
  { id: 'm5', left: '32%', top: '14%', size: 1.2, opacity: 0.18, driftX: -5, driftY: 8, dur: 24 },
  { id: 'm6', left: '68%', top: '85%', size: 1.6, opacity: 0.28, driftX: 8, driftY: -6, dur: 19 },
  { id: 'm7', left: '24%', top: '62%', size: 1.4, opacity: 0.20, driftX: -6, driftY: 9, dur: 21 },
  { id: 'm8', left: '76%', top: '38%', size: 1.8, opacity: 0.26, driftX: 7, driftY: -11, dur: 17 },
  { id: 'm9', left: '45%', top: '8%', size: 2.0, opacity: 0.32, driftX: 4, driftY: 10, dur: 25 },
  { id: 'm10', left: '55%', top: '92%', size: 1.5, opacity: 0.24, driftX: -9, driftY: -7, dur: 18 },
  { id: 'm11', left: '8%', top: '42%', size: 1.3, opacity: 0.16, driftX: 8, driftY: 8, dur: 23 },
  { id: 'm12', left: '92%', top: '56%', size: 1.7, opacity: 0.28, driftX: -6, driftY: -9, dur: 20 },
];

/**
 * Loader — Cinematic Opening Ceremony
 *
 * Implements a 6-Act dramatic narrative arc:
 * ACT I:   THE VOID (0% - 15%) — Subtle breathing cosmic depth.
 * ACT II:  SIGNAL & AWAKENING (15% - 30%) — Starlight disturbance waking the environment.
 * ACT III: BOTANICAL EMERGENCE (30% - 48%) — Rose discovered through authentic lighting story.
 * ACT IV:  CALLIGRAPHIC SIGNATURE (48% - 76%) — Musical handwriting as temporary hero.
 * ACT V:   SUSPENSE & CLIMAX (76% - 96%) — Silence before impact; resonant starlight chain reaction.
 * ACT VI:  ARRIVAL & TRANSITION (96% - 100%) — Harmonic lockup & radial aperture handoff into Hero.
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

  // Lock body scroll during the ceremony
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
      advancePhase('ARRIVAL');
      setStrokeProgress(1);
      setClimaxProgress(1);
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
        }, 500);
      }, 700);

      return () => clearTimeout(timer);
    }

    if (persistedStartTimeRef.current === null) {
      persistedStartTimeRef.current = performance.now();
    }

    // ── 6-ACT CINEMATIC TIMELINE MILESTONES (ms) ──
    // ACT I:   VOID:       0ms   – 900ms  (0%  -> 15%)
    // ACT II:  AWAKENING:  900ms – 1900ms (15% -> 30%)
    // ACT III: EMERGENCE:  1900ms– 3100ms (30% -> 48%)
    // ACT IV:  SIGNATURE:  3100ms– 4900ms (48% -> 76%)
    // ACT V-1: SUSPENSE:   4900ms– 5200ms (76% -> 80%) [Silence Before Impact]
    // ACT V-2: CLIMAX:     5200ms– 6000ms (80% -> 96%) [Resonant Causal Chain]
    // ACT VI:  ARRIVAL:    6000ms– 6500ms (96% -> 100%) [Harmonic Lockup]
    // EXITING: 6500ms– 7300ms (100% locked, radial aperture opens)
    // COMPLETE: > 7300ms      (Hero transition complete & unmount)
    const T_VOID = 900;
    const T_AWAKEN = 1900;
    const T_EMERGE = 3100;
    const T_SIGN = 4900;
    const T_SUSPENSE = 5200;
    const T_CLIMAX = 6000;
    const T_ARRIVAL = 6500;
    const T_EXIT = 7300;
    const T_TIMEOUT = 7600;

    const tick = (now: number) => {
      if (isCancelled) return;
      const startTime = persistedStartTimeRef.current ?? now;
      const elapsed = now - startTime;

      let targetVisualPercent = 0;

      if (elapsed < T_VOID) {
        advancePhase('VOID');
        setStrokeProgress(0);
        setClimaxProgress(0);
        const t = Math.max(0, elapsed / T_VOID);
        setPhaseProgress(t);
        // Start immediately at 1% so the user never sees a static 0%
        targetVisualPercent = Math.max(1, t * 15);
      } else if (elapsed < T_AWAKEN) {
        advancePhase('AWAKENING');
        setStrokeProgress(0);
        setClimaxProgress(0);
        const t = (elapsed - T_VOID) / (T_AWAKEN - T_VOID);
        setPhaseProgress(t);
        targetVisualPercent = 15 + t * 15; // 15% -> 30%
      } else if (elapsed < T_EMERGE) {
        advancePhase('EMERGENCE');
        setStrokeProgress(0);
        setClimaxProgress(0);
        const t = (elapsed - T_AWAKEN) / (T_EMERGE - T_AWAKEN);
        setPhaseProgress(t);
        targetVisualPercent = 30 + t * 18; // 30% -> 48%
      } else if (elapsed < T_SIGN) {
        advancePhase('SIGNING');
        const signT = (elapsed - T_EMERGE) / (T_SIGN - T_EMERGE);
        setStrokeProgress(signT);
        setClimaxProgress(0);
        setPhaseProgress(signT);
        targetVisualPercent = 48 + signT * 28; // 48% -> 76%
      } else if (elapsed < T_SUSPENSE) {
        // Act V Part 1: Silence before impact
        advancePhase('SUSPENSE');
        setStrokeProgress(1);
        setClimaxProgress(0);
        const suspT = (elapsed - T_SIGN) / (T_SUSPENSE - T_SIGN);
        setPhaseProgress(suspT);
        targetVisualPercent = 76 + suspT * 4; // 76% -> 80%
      } else if (elapsed < T_CLIMAX) {
        // Act V Part 2: Controlled Climax
        advancePhase('CLIMAX');
        setStrokeProgress(1);
        const climT = (elapsed - T_SUSPENSE) / (T_CLIMAX - T_SUSPENSE);
        setClimaxProgress(climT);
        setPhaseProgress(climT);
        targetVisualPercent = 80 + climT * 16; // 80% -> 96%
      } else if (elapsed < T_ARRIVAL) {
        // Act VI: Arrival & Harmonic lockup
        advancePhase('ARRIVAL');
        setStrokeProgress(1);
        setClimaxProgress(1);
        const arrT = (elapsed - T_CLIMAX) / (T_ARRIVAL - T_CLIMAX);
        setPhaseProgress(arrT);
        targetVisualPercent = 96 + arrT * 4; // 96% -> 100%

        // Real asset readiness gate: hold gently at 99% if network assets are still in flight
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
        // EXITING: aperture opens, Hero awakens
        advancePhase('EXITING');
        setIsExiting(true);
        triggerAwakenHero();
        setStrokeProgress(1);
        setClimaxProgress(1);
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

    tick(performance.now());
    animId = requestAnimationFrame(loop);

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
  }, []);

  // Camera participation & spatial depth metrics
  let cameraScale = 1.0;
  let cameraBlur = 0;
  let stageTranslateY = 0;

  switch (phase) {
    case 'VOID':
      cameraScale = 0.96;
      break;
    case 'AWAKENING':
      cameraScale = 0.975;
      break;
    case 'EMERGENCE':
      cameraScale = 0.975 + phaseProgress * 0.025; // 0.975 -> 1.00 (subtle camera approach)
      break;
    case 'SIGNING':
    case 'SUSPENSE':
      cameraScale = 1.0; // Stabilizes for handwriting precision
      break;
    case 'CLIMAX':
      cameraScale = 1.0 + Math.sin(climaxProgress * Math.PI) * 0.02; // Micro-expansion at climax
      break;
    case 'ARRIVAL':
      cameraScale = 1.0;
      break;
    case 'EXITING':
      cameraScale = 1.06;
      cameraBlur = 3;
      stageTranslateY = -8;
      break;
    case 'COMPLETE':
      cameraScale = 1.10;
      break;
  }

  // Atmospheric background intensity response
  const atmoOpacity =
    phase === 'VOID'
      ? 0.15
      : phase === 'AWAKENING'
      ? 0.35
      : phase === 'EMERGENCE'
      ? 0.50
      : phase === 'SIGNING'
      ? 0.28 // Subtly dims so signature dominates
      : phase === 'SUSPENSE'
      ? 0.32
      : phase === 'CLIMAX'
      ? 0.75 // Environmental starlight bloom
      : phase === 'ARRIVAL'
      ? 0.55
      : 0.85;

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
          1. DEEP COSMIC SPACE & LOW-FREQUENCY BREATHING GRADIENT
         ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none select-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(20, 8, 42, 0.75) 0%, rgba(10, 4, 24, 0.92) 55%, #030014 100%)',
        }}
        aria-hidden="true"
      />

      {/* ─────────────────────────────────────────────────────────────
          2. DELICATE COSMIC DUST MOTES (SPATIAL DEPTH ONLY)
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
              opacity: m.opacity * (phase === 'VOID' ? 0.6 : 1),
              filter: 'blur(0.5px)',
              transform: `translate3d(${m.driftX * (phaseProgress || 0.5)}px, ${m.driftY * (phaseProgress || 0.5)}px, 0)`,
              transition: 'transform 2.5s ease-out, opacity 1s ease',
            }}
          />
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. RESPONSIVE ATMOSPHERIC CORE & APERTURE MASK
         ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden will-change-transform"
        style={{
          transform: isExiting ? 'scale(1.10)' : `scale(${cameraScale})`,
          transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
          maskImage: isExiting
            ? 'radial-gradient(circle at 50% 50%, black 0%, black 55%, transparent 95%)'
            : 'radial-gradient(circle at 50% 50%, black 0%, black 82%, transparent 100%)',
          WebkitMaskImage: isExiting
            ? 'radial-gradient(circle at 50% 50%, black 0%, black 55%, transparent 95%)'
            : 'radial-gradient(circle at 50% 50%, black 0%, black 82%, transparent 100%)',
        }}
        aria-hidden="true"
      >
        {/* Responsive Volumetric Starlight Field */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] sm:w-[74vw] max-w-[680px] aspect-square rounded-full mix-blend-screen will-change-transform transition-all duration-800 ease-out"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.22) 0%, rgba(225, 29, 72, 0.10) 35%, rgba(99, 102, 241, 0.05) 55%, transparent 72%)',
            filter: 'blur(52px)',
            opacity: atmoOpacity,
            transform: `translate(-50%, -50%) scale(${cameraScale * 1.05})`,
          }}
        />

        {/* Botanical Velvet Rose with Authentic Lighting Story */}
        <CeremonyFlower
          phase={phase}
          phaseProgress={phaseProgress}
          climaxProgress={climaxProgress}
          isExiting={isExiting}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. FOREGROUND CEREMONIAL STAGE (SIGNATURE + IDENTITY + PROGRESS)
         ───────────────────────────────────────────────────────────── */}
      <div
        className="relative z-10 w-full max-w-4xl px-4 sm:px-6 flex flex-col items-center justify-center will-change-transform"
        style={{
          transform: `scale(${cameraScale}) translate3d(0, ${stageTranslateY}px, 0)`,
          filter: cameraBlur > 0 ? `blur(${cameraBlur}px)` : 'none',
          transition:
            phase === 'EMERGENCE' || phase === 'CLIMAX'
              ? 'none'
              : 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), filter 0.85s ease',
        }}
      >
        {/* Handwritten Signature — Temporary Hero & Climax Detonator */}
        <CeremonySignature
          progress={strokeProgress}
          phase={phase}
          climaxProgress={climaxProgress}
        />

        {/* Typographic Identity Settle ("rocky babcock") — Climax Awakening */}
        <CeremonyIdentity phase={phase} climaxProgress={climaxProgress} />

        {/* Architectural 6-Act Progress Instrumentation */}
        <CeremonyProgress displayProgress={displayProgress} phase={phase} />
      </div>
    </div>
  );
};

export default Loader;
