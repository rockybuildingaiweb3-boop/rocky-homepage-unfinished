import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { getReducedMotionPreference } from '../../hooks/useDeviceCapabilities';
import { computePageScrollProgress } from './navbarLogic';
import {
  BACK_TO_TOP_RING_RADIUS,
  computeBackToTopRingMetrics,
  easeInOutQuart,
} from './footerSignatureLogic';

export interface BackToTopButtonProps {
  className?: string;
}

const SVG_SIZE = 56;
const SVG_CENTER = SVG_SIZE / 2;
const RETURN_SCROLL_DURATION_MS = 820;

export const BackToTopButton: React.FC<BackToTopButtonProps> = memo(({ className = '' }) => {
  const [isReturning, setIsReturning] = useState(false);

  const ringGroupRef = useRef<SVGGElement>(null);
  const progressCircleRef = useRef<SVGCircleElement>(null);
  const trackCircleRef = useRef<SVGCircleElement>(null);
  const isReturningRef = useRef(false);
  const scrollAnimRafRef = useRef<number | null>(null);
  const scrollSyncRafRef = useRef<number | null>(null);

  const paintRing = useCallback((progress: number, returning: boolean) => {
    const metrics = computeBackToTopRingMetrics({
      progress,
      isReturning: returning,
      radius: BACK_TO_TOP_RING_RADIUS,
    });

    if (progressCircleRef.current) {
      progressCircleRef.current.style.strokeDasharray = `${metrics.circumference}`;
      progressCircleRef.current.style.strokeDashoffset = `${metrics.dashOffset}`;
      progressCircleRef.current.style.opacity = `${metrics.ringOpacity}`;
    }

    if (trackCircleRef.current) {
      trackCircleRef.current.style.opacity = returning ? '0.26' : '0.16';
    }

    if (ringGroupRef.current) {
      ringGroupRef.current.style.transform = `scale(${metrics.ringScale})`;
    }
  }, []);

  const readCurrentProgress = useCallback(() => {
    if (typeof window === 'undefined') return 0;
    return computePageScrollProgress({
      scrollY: window.scrollY || document.documentElement.scrollTop || 0,
      scrollHeight: document.documentElement.scrollHeight,
      viewportHeight: window.innerHeight || 900,
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncFromScroll = () => {
      scrollSyncRafRef.current = null;
      paintRing(readCurrentProgress(), isReturningRef.current);
    };

    const scheduleSync = () => {
      if (scrollSyncRafRef.current !== null) return;
      scrollSyncRafRef.current = requestAnimationFrame(syncFromScroll);
    };

    paintRing(readCurrentProgress(), false);
    window.addEventListener('scroll', scheduleSync, { passive: true });
    window.addEventListener('resize', scheduleSync, { passive: true });

    return () => {
      window.removeEventListener('scroll', scheduleSync);
      window.removeEventListener('resize', scheduleSync);
      if (scrollSyncRafRef.current !== null) cancelAnimationFrame(scrollSyncRafRef.current);
      if (scrollAnimRafRef.current !== null) cancelAnimationFrame(scrollAnimRafRef.current);
    };
  }, [paintRing, readCurrentProgress]);

  const cancelReturnAnimation = useCallback(() => {
    if (scrollAnimRafRef.current !== null) {
      cancelAnimationFrame(scrollAnimRafRef.current);
      scrollAnimRafRef.current = null;
    }
    if (isReturningRef.current) {
      isReturningRef.current = false;
      setIsReturning(false);
      paintRing(readCurrentProgress(), false);
    }
  }, [paintRing, readCurrentProgress]);

  const handleBackToTopClick = useCallback(() => {
    if (typeof window === 'undefined') return;

    const startY = window.scrollY || document.documentElement.scrollTop || 0;
    const prefersReducedMotion = getReducedMotionPreference();

    if (prefersReducedMotion || startY <= 2) {
      cancelReturnAnimation();
      window.scrollTo({ top: 0, behavior: 'auto' });
      paintRing(0, false);
      return;
    }

    if (scrollAnimRafRef.current !== null) {
      cancelAnimationFrame(scrollAnimRafRef.current);
      scrollAnimRafRef.current = null;
    }

    isReturningRef.current = true;
    setIsReturning(true);
    const startTime = performance.now();
    const initialProgress = Math.max(0.15, readCurrentProgress());

    const abortOnUserInput = () => {
      window.removeEventListener('wheel', abortOnUserInput);
      window.removeEventListener('touchstart', abortOnUserInput);
      cancelReturnAnimation();
    };
    window.addEventListener('wheel', abortOnUserInput, { passive: true });
    window.addEventListener('touchstart', abortOnUserInput, { passive: true });

    const animateReturn = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / RETURN_SCROLL_DURATION_MS);
      const eased = easeInOutQuart(t);

      // Scroll smoothly back to Hero
      const nextY = Math.round(startY * (1 - eased));
      window.scrollTo(0, nextY);

      // Reverse collapse of outer progress ring synced tightly with return progression
      const liveRatio = Math.max(0, initialProgress * (1 - eased));
      paintRing(liveRatio, t < 1);

      if (t < 1) {
        scrollAnimRafRef.current = requestAnimationFrame(animateReturn);
      } else {
        scrollAnimRafRef.current = null;
        window.removeEventListener('wheel', abortOnUserInput);
        window.removeEventListener('touchstart', abortOnUserInput);
        isReturningRef.current = false;
        setIsReturning(false);
        paintRing(0, false);
      }
    };

    scrollAnimRafRef.current = requestAnimationFrame(animateReturn);
  }, [cancelReturnAnimation, paintRing, readCurrentProgress]);

  const circumference = 2 * Math.PI * BACK_TO_TOP_RING_RADIUS;

  return (
    <button
      type="button"
      onClick={handleBackToTopClick}
      data-testid="footer-back-to-top"
      data-returning={isReturning ? 'true' : 'false'}
      aria-label="Back to top — return smoothly to Hero"
      title="Back to Top"
      className={`group relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-transparent border-none p-0 cursor-pointer clickable select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/80 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-95 ${className}`}
    >
      {/* Outer micro scroll-progress ring SVG */}
      <svg
        width={SVG_SIZE}
        height={SVG_SIZE}
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full -rotate-90 overflow-visible"
      >
        <defs>
          <linearGradient id="back-to-top-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="55%" stopColor="#e9d5ff" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>
        </defs>
        <g
          ref={ringGroupRef}
          style={{
            transformOrigin: `${SVG_CENTER}px ${SVG_CENTER}px`,
            transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Base hairline circular track */}
          <circle
            ref={trackCircleRef}
            cx={SVG_CENTER}
            cy={SVG_CENTER}
            r={BACK_TO_TOP_RING_RADIUS}
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth={1}
          />
          {/* Dynamic progress stroke that winds forward on scroll & collapses in reverse on return */}
          <circle
            ref={progressCircleRef}
            data-testid="back-to-top-ring-stroke"
            cx={SVG_CENTER}
            cy={SVG_CENTER}
            r={BACK_TO_TOP_RING_RADIUS}
            fill="none"
            stroke="url(#back-to-top-ring-grad)"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            className="transition-[stroke-width] duration-200 group-hover:[stroke-width:2]"
          />
        </g>
      </svg>

      {/* Inner circular framed dial */}
      <span
        aria-hidden="true"
        className={`relative flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isReturning
            ? 'border-purple-300/60 bg-purple-500/15 shadow-[0_0_20px_rgba(192,132,252,0.4)]'
            : 'border-white/20 bg-white/[0.03] group-hover:border-purple-300/55 group-hover:bg-purple-400/[0.09] group-hover:shadow-[0_0_16px_rgba(192,132,252,0.28)]'
        }`}
      >
        {/* Crisp internal upward arrow that rises gracefully on hover */}
        <svg
          width="14"
          height="16"
          viewBox="0 0 14 16"
          fill="none"
          aria-hidden="true"
          className={`transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isReturning
              ? '-translate-y-1 text-white drop-shadow-[0_0_8px_rgba(233,213,255,0.9)]'
              : 'text-white/75 group-hover:-translate-y-1 group-hover:text-white'
          }`}
        >
          <path
            d="M7 13.5V2.5M7 2.5L2.5 7M7 2.5L11.5 7"
            stroke="currentColor"
            strokeWidth="1.45"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
});

BackToTopButton.displayName = 'BackToTopButton';

export default BackToTopButton;
