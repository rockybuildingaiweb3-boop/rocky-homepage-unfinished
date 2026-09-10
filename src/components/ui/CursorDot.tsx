import React, { useEffect, useRef, useState } from 'react';
import { easeInOutQuad } from '../../utils';

interface CursorDotProps {
  isMobile?: boolean;
  disabled?: boolean;
}

type CursorMode = 'default' | 'pointer' | 'drag' | 'view' | 'link';

export const CursorDot: React.FC<CursorDotProps> = ({ isMobile = false, disabled = false }) => {
  const [mode, setMode] = useState<CursorMode>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [introDisabled, setIntroDisabled] = useState(true);

  const coreRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const targetPos = useRef({ x: -100, y: -100 });
  const corePos = useRef({ x: -100, y: -100 });
  const auraPos = useRef({ x: -100, y: -100 });
  const animFrameId = useRef<number | null>(null);
  const isRunningRef = useRef<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setIntroDisabled(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    // Check reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const startLoopIfNeeded = () => {
      if (!isRunningRef.current) {
        isRunningRef.current = true;
        animFrameId.current = requestAnimationFrame(animate);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      let detectedMode: CursorMode = 'default';

      if (target) {
        const explicitCursor = target.closest('[data-cursor]')?.getAttribute('data-cursor');
        if (explicitCursor === 'view') {
          detectedMode = 'view';
        } else if (explicitCursor === 'drag') {
          detectedMode = 'drag';
        } else if (target.closest('a')) {
          detectedMode = 'link';
        } else {
          const computedCursor = window.getComputedStyle(target).cursor;
          if (computedCursor === 'pointer' || target.closest('.clickable') !== null || target.closest('button')) {
            detectedMode = 'pointer';
          }
        }
      }

      setMode(detectedMode);

      // Mild magnetic pull on clickable items
      if ((detectedMode === 'pointer' || detectedMode === 'link') && target) {
        const interactiveEl = target.closest('.clickable') || target.closest('button') || target.closest('a') || target;
        const rect = interactiveEl.getBoundingClientRect();
        const midX = rect.left + rect.width / 2;
        const midY = rect.top + rect.height / 2;
        targetPos.current = {
          x: midX + (e.clientX - midX) * 0.45,
          y: midY + (e.clientY - midY) * 0.45,
        };
      } else {
        targetPos.current = {
          x: e.clientX,
          y: e.clientY,
        };
      }

      startLoopIfNeeded();
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    const animate = () => {
      const dxCore = targetPos.current.x - corePos.current.x;
      const dyCore = targetPos.current.y - corePos.current.y;
      const dxAura = targetPos.current.x - auraPos.current.x;
      const dyAura = targetPos.current.y - auraPos.current.y;

      // 1. Core snappy follower
      const tCore = 0.45;
      corePos.current.x += easeInOutQuad(tCore) * dxCore;
      corePos.current.y += easeInOutQuad(tCore) * dyCore;

      // 2. Aura follower
      const tAura = 0.22;
      auraPos.current.x += easeInOutQuad(tAura) * dxAura;
      auraPos.current.y += easeInOutQuad(tAura) * dyAura;

      if (coreRef.current) {
        coreRef.current.style.transform = `translate3d(${corePos.current.x}px, ${corePos.current.y}px, 0px)`;
      }
      if (auraRef.current) {
        auraRef.current.style.transform = `translate3d(${auraPos.current.x}px, ${auraPos.current.y}px, 0px)`;
      }

      // Check if settled (idle) to conserve CPU/GPU
      const isSettled =
        Math.abs(dxCore) < 0.1 &&
        Math.abs(dyCore) < 0.1 &&
        Math.abs(dxAura) < 0.1 &&
        Math.abs(dyAura) < 0.1;

      if (isSettled) {
        isRunningRef.current = false;
        animFrameId.current = null;
      } else {
        animFrameId.current = requestAnimationFrame(animate);
      }
    };

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isMobile, isVisible]);

  if (isMobile) return null;

  const isDisabled = introDisabled || disabled || !isVisible;

  const isInteractive = mode === 'pointer' || mode === 'link';
  const isSpecial = mode === 'drag' || mode === 'view';

  return (
    <>
      {/* Precision Aura Ring */}
      <div
        ref={auraRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] will-change-transform"
        style={{ opacity: isDisabled ? 0 : 1, transition: 'opacity 0.25s ease' }}
      >
        <div
          className="rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out flex items-center justify-center"
          style={{
            width: isSpecial ? '64px' : isInteractive ? '42px' : '26px',
            height: isSpecial ? '64px' : isInteractive ? '42px' : '26px',
            background: isSpecial
              ? 'rgba(19, 13, 33, 0.7)'
              : isInteractive
              ? 'rgba(216, 180, 254, 0.08)'
              : 'transparent',
            border: isSpecial
              ? '1px solid rgba(216, 180, 254, 0.6)'
              : isInteractive
              ? '1px solid rgba(255, 255, 255, 0.5)'
              : '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: isSpecial
              ? '0 0 20px rgba(168, 85, 247, 0.4), inset 0 0 12px rgba(168, 85, 247, 0.2)'
              : isInteractive
              ? '0 0 12px rgba(216, 180, 254, 0.35)'
              : 'none',
            backdropFilter: isSpecial ? 'blur(4px)' : 'none',
          }}
        >
          {/* Contextual Tag Label inside aura for special states */}
          {isSpecial && (
            <span
              ref={labelRef}
              className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/90 select-none pointer-events-none"
            >
              {mode === 'drag' ? '↔ drag' : 'view'}
            </span>
          )}
        </div>
      </div>

      {/* Center Core Micro-Dot */}
      <div
        ref={coreRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform"
        style={{ opacity: isDisabled ? 0 : isSpecial ? 0 : 1, transition: 'opacity 0.2s ease' }}
      >
        <div
          className="rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out"
          style={{
            width: isInteractive ? '7px' : '5px',
            height: isInteractive ? '7px' : '5px',
            backgroundColor: '#ffffff',
            boxShadow: isInteractive
              ? '0 0 8px 2px rgba(255, 255, 255, 0.9), 0 0 14px 3px rgba(216, 180, 254, 0.6)'
              : '0 0 4px 1px rgba(255, 255, 255, 0.7)',
          }}
        />
      </div>
    </>
  );
};

