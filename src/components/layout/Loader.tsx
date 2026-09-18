import React, { useEffect, useState, useRef, useCallback } from 'react';
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

/**
 * Opening Ceremony Master Coordinator
 *
 * Deterministic Lifecycle:
 * INITIALIZING (0.0s - 0.45s) -> ATMOSPHERE (0.45s - 1.1s) -> SIGNING (1.1s - 2.9s) ->
 * FLOWER_EMERGE (2.9s - 3.7s) -> IDENTITY_SETTLE (3.7s - 4.4s) -> READY (4.4s - 4.8s) ->
 * EXITING (4.8s - 5.6s) -> COMPLETE (> 5.6s)
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

  const startTimeRef = useRef<number>(0);
  const reqAnimRef = useRef<number | null>(null);
  const heroAwakenedRef = useRef<boolean>(false);
  const networkProgressRef = useRef<number>(progress);
  const networkDoneRef = useRef<boolean>(loadingDone);
  const maxDisplayProgressRef = useRef<number>(0);

  useEffect(() => {
    networkProgressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    networkDoneRef.current = loadingDone;
  }, [loadingDone]);

  // Check reduced motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const triggerAwakenHero = useCallback(() => {
    if (!heroAwakenedRef.current) {
      heroAwakenedRef.current = true;
      if (onAwakenHero) onAwakenHero();
    }
  }, [onAwakenHero]);

  // Master Ceremony RAF loop
  useEffect(() => {
    startTimeRef.current = performance.now();

    const animateCeremony = (now: number) => {
      const elapsed = now - startTimeRef.current;

      // ── Timeline Milestones (in ms) ───────────────────────────
      // 0 - 450: INITIALIZING
      // 450 - 1100: ATMOSPHERE
      // 1100 - 2900: SIGNING (1800ms)
      // 2900 - 3700: FLOWER_EMERGE (800ms)
      // 3700 - 4400: IDENTITY_SETTLE (700ms)
      // 4400 - 4800: READY (400ms, gates on asset completion or 6.5s timeout)
      // 4800 - 5600: EXITING (800ms)
      // > 5600: COMPLETE

      let targetVisualProgress = 0;

      if (elapsed < 450) {
        setPhase('INITIALIZING');
        setStrokeProgress(0);
        setFlowerProgress(0);
        targetVisualProgress = (elapsed / 450) * 15;
      } else if (elapsed < 1100) {
        setPhase('ATMOSPHERE');
        setStrokeProgress(0);
        setFlowerProgress(0);
        const t = (elapsed - 450) / 650;
        targetVisualProgress = 15 + t * 10; // 15% -> 25%
      } else if (elapsed < 2900) {
        setPhase('SIGNING');
        const signT = (elapsed - 1100) / 1800; // 0 -> 1
        setStrokeProgress(signT);
        setFlowerProgress(0);
        targetVisualProgress = 25 + signT * 40; // 25% -> 65%
      } else if (elapsed < 3700) {
        setPhase('FLOWER_EMERGE');
        setStrokeProgress(1);
        const flowerT = (elapsed - 2900) / 800; // 0 -> 1
        setFlowerProgress(flowerT);
        targetVisualProgress = 65 + flowerT * 20; // 65% -> 85%
      } else if (elapsed < 4400) {
        setPhase('IDENTITY_SETTLE');
        setStrokeProgress(1);
        setFlowerProgress(1);
        const identityT = (elapsed - 3700) / 700; // 0 -> 1
        targetVisualProgress = 85 + identityT * 15; // 85% -> 100%
      } else if (elapsed < 4800) {
        setPhase('READY');
        setStrokeProgress(1);
        setFlowerProgress(1);
        targetVisualProgress = 100;

        // Gate: wait for real assets if not ready yet, but with a 6.5s safety fallback
        const isReady = networkDoneRef.current || elapsed >= 6500;
        if (!isReady) {
          // Hold gracefully in READY equilibrium
          reqAnimRef.current = requestAnimationFrame(animateCeremony);
          return;
        }
      } else if (elapsed < 5600) {
        // EXITING phase: aperture expands into Hero world
        setPhase('EXITING');
        setIsExiting(true);
        triggerAwakenHero();
        setStrokeProgress(1);
        setFlowerProgress(1);
        targetVisualProgress = 100;
      } else {
        // COMPLETE: handoff control and unmount
        setPhase('COMPLETE');
        triggerAwakenHero();
        if (onFinish) onFinish();
        return;
      }

      // Ensure progress is strictly monotonic
      const currentNetworkProgress = networkProgressRef.current;
      const combined = Math.max(targetVisualProgress, currentNetworkProgress * 0.92);
      if (combined > maxDisplayProgressRef.current) {
        maxDisplayProgressRef.current = Math.min(100, combined);
        setDisplayProgress(maxDisplayProgressRef.current);
      }

      reqAnimRef.current = requestAnimationFrame(animateCeremony);
    };

    reqAnimRef.current = requestAnimationFrame(animateCeremony);

    return () => {
      if (reqAnimRef.current) cancelAnimationFrame(reqAnimRef.current);
    };
  }, [triggerAwakenHero, onFinish]);

  return (
    <div
      className={`fixed inset-0 w-screen h-screen flex flex-col justify-center items-center z-[1000] bg-black select-none overflow-hidden will-change-transform ${
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
        {/* Central Ethereal Starlight Aura */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] sm:w-[70vw] max-w-[700px] aspect-square rounded-full mix-blend-screen will-change-transform transition-all duration-1000 ease-out"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.32) 0%, rgba(129, 140, 248, 0.18) 38%, rgba(243, 232, 255, 0.06) 65%, transparent 80%)',
            filter: 'blur(32px)',
            opacity: phase === 'INITIALIZING' ? 0 : isExiting ? 0.95 : 0.75,
            transform: isExiting
              ? 'translate(-50%, -50%) scale(1.25)'
              : 'translate(-50%, -50%) scale(1)',
          }}
        />

        {/* Botanical Studio Rose Form */}
        <CeremonyFlower phase={phase} phaseProgress={flowerProgress} />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. CORE CEREMONIAL STAGE (SIGNATURE + IDENTITY + PROGRESS)
         ───────────────────────────────────────────────────────────── */}
      <div
        className="relative z-10 w-full max-w-4xl px-4 sm:px-6 flex flex-col items-center justify-center will-change-transform"
        style={{
          transform: isExiting ? 'scale(1.04) translate3d(0, -8px, 0)' : 'scale(1) translate3d(0, 0, 0)',
          filter: isExiting ? 'blur(4px)' : 'none',
          transition: 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), filter 0.85s ease',
        }}
      >
        {/* Sequential Handwriting Signature */}
        <CeremonySignature
          progress={strokeProgress}
          phase={phase}
          isMobile={prefersReducedMotion}
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
