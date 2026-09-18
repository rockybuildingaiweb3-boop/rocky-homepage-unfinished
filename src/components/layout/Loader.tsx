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
 * Deterministic Timeline & Monotonic Progress Contract:
 * 01 INITIALIZING:   0ms   – 500ms   (0%   – 15%)
 * 02 ATMOSPHERE:     500ms – 1200ms  (15%  – 25%)
 * 03 SIGNATURE:      1200ms – 3300ms (25%  – 65%)
 * 04 BOTANICAL BLOOM:3300ms – 4200ms (65%  – 82%)
 * 05 IDENTITY:       4200ms – 4900ms (82%  – 95%)
 * 06 READY:          4900ms – 5400ms (95%  – 100%)
 * EXITING:           5400ms – 6250ms (100% locked)
 * COMPLETE:          > 6250ms        (100% locked, unmount)
 *
 * Guaranteed Monotonic: P(t + 1) >= P(t) under all conditions.
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
  const networkDoneRef = useRef<boolean>(loadingDone);
  const maxDisplayProgressRef = useRef<number>(0);

  useEffect(() => {
    networkDoneRef.current = loadingDone;
  }, [loadingDone]);

  // Lock body scroll while ceremony is running to prevent visual jumping
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const triggerAwakenHero = useCallback(() => {
    if (!heroAwakenedRef.current) {
      heroAwakenedRef.current = true;
      if (onAwakenHero) onAwakenHero();
    }
  }, [onAwakenHero]);

  // Master Ceremony RAF loop
  useEffect(() => {
    startTimeRef.current = performance.now();

    const T_INIT = 500;
    const T_ATMO = 1200;
    const T_SIGN = 3300;
    const T_FLOWER = 4200;
    const T_IDENTITY = 4900;
    const T_READY = 5400;
    const T_EXIT = 6250;

    const animateCeremony = (now: number) => {
      const elapsed = now - startTimeRef.current;
      let targetVisualPercent = 0;

      if (elapsed < T_INIT) {
        setPhase('INITIALIZING');
        setStrokeProgress(0);
        setFlowerProgress(0);
        const t = elapsed / T_INIT;
        targetVisualPercent = t * 15; // 0% -> 15%
      } else if (elapsed < T_ATMO) {
        setPhase('ATMOSPHERE');
        setStrokeProgress(0);
        setFlowerProgress(0);
        const t = (elapsed - T_INIT) / (T_ATMO - T_INIT);
        targetVisualPercent = 15 + t * 10; // 15% -> 25%
      } else if (elapsed < T_SIGN) {
        setPhase('SIGNING');
        const signT = (elapsed - T_ATMO) / (T_SIGN - T_ATMO); // 0 -> 1
        setStrokeProgress(signT);
        setFlowerProgress(0);
        targetVisualPercent = 25 + signT * 40; // 25% -> 65%
      } else if (elapsed < T_FLOWER) {
        setPhase('FLOWER_EMERGE');
        setStrokeProgress(1);
        const flowerT = (elapsed - T_SIGN) / (T_FLOWER - T_SIGN); // 0 -> 1
        setFlowerProgress(flowerT);
        targetVisualPercent = 65 + flowerT * 17; // 65% -> 82%
      } else if (elapsed < T_IDENTITY) {
        setPhase('IDENTITY_SETTLE');
        setStrokeProgress(1);
        setFlowerProgress(1);
        const identityT = (elapsed - T_FLOWER) / (T_IDENTITY - T_FLOWER); // 0 -> 1
        targetVisualPercent = 82 + identityT * 13; // 82% -> 95%
      } else if (elapsed < T_READY) {
        setPhase('READY');
        setStrokeProgress(1);
        setFlowerProgress(1);
        const readyT = (elapsed - T_IDENTITY) / (T_READY - T_IDENTITY);
        targetVisualPercent = 95 + readyT * 5; // 95% -> 100%

        // Real asset readiness gate with 6.5s graceful fallback
        const isRealAssetReady = networkDoneRef.current || elapsed >= 6500;
        if (!isRealAssetReady && targetVisualPercent >= 99) {
          // Hold gracefully at 99% until real assets report ready
          targetVisualPercent = 99;
          const nextVal = Math.max(maxDisplayProgressRef.current, 99);
          if (nextVal > maxDisplayProgressRef.current) {
            maxDisplayProgressRef.current = nextVal;
            setDisplayProgress(nextVal);
          }
          reqAnimRef.current = requestAnimationFrame(animateCeremony);
          return;
        }
      } else if (elapsed < T_EXIT) {
        // EXITING phase: aperture expands into Hero world
        setPhase('EXITING');
        setIsExiting(true);
        triggerAwakenHero();
        setStrokeProgress(1);
        setFlowerProgress(1);
        targetVisualPercent = 100;
      } else {
        // COMPLETE: handoff control and unmount
        setPhase('COMPLETE');
        triggerAwakenHero();
        if (onFinish) onFinish();
        return;
      }

      // Mathematical Monotonicity Invariant: P(t+1) >= P(t)
      const nextProgress = Math.max(maxDisplayProgressRef.current, Math.round(targetVisualPercent));
      if (nextProgress > maxDisplayProgressRef.current) {
        maxDisplayProgressRef.current = Math.min(100, nextProgress);
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
        {/* Central Ethereal Starlight Aura */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] sm:w-[70vw] max-w-[700px] aspect-square rounded-full mix-blend-screen will-change-transform transition-all duration-1000 ease-out"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.32) 0%, rgba(129, 140, 248, 0.18) 38%, rgba(243, 232, 255, 0.06) 65%, transparent 80%)',
            filter: 'blur(36px)',
            opacity: phase === 'INITIALIZING' ? 0 : isExiting ? 0.95 : 0.75,
            transform: isExiting
              ? 'translate(-50%, -50%) scale(1.25)'
              : 'translate(-50%, -50%) scale(1)',
          }}
        />

        {/* Botanical Studio Velvet Form (transparent PNG/WebP, zero black box) */}
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
