import React, { useEffect, useRef, useState } from 'react';
import { easeInOutQuad } from '../../utils';
import { getReducedMotionPreference } from '../../hooks/useDeviceCapabilities';

export interface CursorDotProps {
  isMobile?: boolean;
  disabled?: boolean;
}

export type CursorMode = 'default' | 'pointer' | 'drag' | 'dragging' | 'view';

const CURSOR_CONVERGE_EPSILON_PX = 0.12;

/**
 * Global Interactive Cursor Feature
 * 
 * Physics-based celestial cursor:
 * - Completely pointer-transparent (`pointer-events: none !important`)
 * - Autonomous interaction classification (default, pointer, view, drag, dragging)
 * - Trailing stardust comet particles with eased spring physics
 * - Subtle magnetic attraction on compact interactive targets
 * - On-demand RAF loop that sleeps automatically once particles converge or when hidden/blurred
 */
export const CursorDot: React.FC<CursorDotProps> = ({ isMobile = false, disabled = false }) => {
  const [mode, setMode] = useState<CursorMode>('default');
  const [introDisabled, setIntroDisabled] = useState(true);

  // Core bead ref & trailing aura ref
  const coreRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const trail1Ref = useRef<HTMLDivElement>(null);
  const trail2Ref = useRef<HTMLDivElement>(null);

  const targetPos = useRef({ x: -100, y: -100 });
  const corePos = useRef({ x: -100, y: -100 });
  const auraPos = useRef({ x: -100, y: -100 });
  const trail1Pos = useRef({ x: -100, y: -100 });
  const trail2Pos = useRef({ x: -100, y: -100 });
  const animFrameId = useRef<number | null>(null);
  const isMouseDownRef = useRef(false);
  const modeRef = useRef<CursorMode>('default');
  const hasPointerMovedRef = useRef(false);
  const isPageVisibleRef = useRef(
    typeof document !== 'undefined' ? document.visibilityState !== 'hidden' : true
  );
  const isWindowFocusedRef = useRef(
    typeof document !== 'undefined' && typeof document.hasFocus === 'function'
      ? document.hasFocus()
      : true
  );
  const prefersReducedMotionRef = useRef(getReducedMotionPreference());

  useEffect(() => {
    const timer = setTimeout(() => setIntroDisabled(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isMobile || disabled) return;

    const commitMode = (nextMode: CursorMode) => {
      if (modeRef.current !== nextMode) {
        modeRef.current = nextMode;
        setMode(nextMode);
      }
    };

    const getTargetMode = (target: HTMLElement | null, isDown: boolean): { mode: CursorMode; isMagnetic: boolean } => {
      if (!target) return { mode: 'default', isMagnetic: false };

      // 1. Close button and direct action buttons always take priority
      if (
        target.closest('.close-button, .close-button-wrapper') ||
        target.closest('[data-cursor="pointer"]')
      ) {
        return { mode: 'pointer', isMagnetic: true };
      }

      // 2. Project card hovering triggers 'view' (follows pointer directly with VIEW badge)
      const cursorAttr = target.closest('[data-cursor]')?.getAttribute('data-cursor');
      if (cursorAttr === 'view' || target.closest('.list-item')) {
        if (isDown) {
          return { mode: 'dragging', isMagnetic: false };
        }
        return { mode: 'view', isMagnetic: false };
      }

      // 3. Draggable Studio area triggers 'drag' or 'dragging'
      if (cursorAttr === 'drag' || target.closest('.content-wrapper')) {
        return { mode: isDown ? 'dragging' : 'drag', isMagnetic: false };
      }

      // 4. Standard interactive elements (buttons, links, navigation items)
      if (
        target.closest(
          'button, a, [role="button"], .clickable, .cursor-pointer, .interactive, input, select, textarea'
        ) !== null
      ) {
        return { mode: 'pointer', isMagnetic: true };
      }

      // 5. Computed cursor check fallback
      try {
        const computed = window.getComputedStyle(target).cursor;
        if (computed === 'pointer') {
          return { mode: 'pointer', isMagnetic: true };
        }
        if (computed === 'grab' || computed === 'grabbing') {
          return { mode: isDown ? 'dragging' : 'drag', isMagnetic: false };
        }
      } catch {
        // Ignore style access error
      }

      return { mode: 'default', isMagnetic: false };
    };

    const applyTransforms = () => {
      if (coreRef.current) {
        coreRef.current.style.transform = `translate3d(${corePos.current.x}px, ${corePos.current.y}px, 0px)`;
      }
      if (auraRef.current) {
        auraRef.current.style.transform = `translate3d(${auraPos.current.x}px, ${auraPos.current.y}px, 0px)`;
      }
      if (trail1Ref.current) {
        trail1Ref.current.style.transform = `translate3d(${trail1Pos.current.x}px, ${trail1Pos.current.y}px, 0px)`;
      }
      if (trail2Ref.current) {
        trail2Ref.current.style.transform = `translate3d(${trail2Pos.current.x}px, ${trail2Pos.current.y}px, 0px)`;
      }
    };

    const snapAllToTarget = () => {
      const { x, y } = targetPos.current;
      corePos.current = { x, y };
      auraPos.current = { x, y };
      trail1Pos.current = { x, y };
      trail2Pos.current = { x, y };
      applyTransforms();
    };

    const stopLoop = () => {
      if (animFrameId.current !== null) {
        cancelAnimationFrame(animFrameId.current);
        animFrameId.current = null;
      }
    };

    const animate = () => {
      animFrameId.current = null;

      if (!hasPointerMovedRef.current || !isPageVisibleRef.current || !isWindowFocusedRef.current) {
        return;
      }

      if (prefersReducedMotionRef.current) {
        snapAllToTarget();
        return;
      }

      // 1. Core snappy follower (fast response)
      const tCore = 0.52;
      corePos.current.x += easeInOutQuad(tCore) * (targetPos.current.x - corePos.current.x);
      corePos.current.y += easeInOutQuad(tCore) * (targetPos.current.y - corePos.current.y);

      // 2. Trailing chromatic halo follower (organic celestial lag)
      const tAura = 0.18;
      auraPos.current.x += easeInOutQuad(tAura) * (targetPos.current.x - auraPos.current.x);
      auraPos.current.y += easeInOutQuad(tAura) * (targetPos.current.y - auraPos.current.y);

      // 3. Stardust trail particle 1 (lagging further behind)
      const tTrail1 = 0.11;
      trail1Pos.current.x += easeInOutQuad(tTrail1) * (targetPos.current.x - trail1Pos.current.x);
      trail1Pos.current.y += easeInOutQuad(tTrail1) * (targetPos.current.y - trail1Pos.current.y);

      // 4. Stardust trail particle 2 (ethereal comet tail)
      const tTrail2 = 0.07;
      trail2Pos.current.x += easeInOutQuad(tTrail2) * (targetPos.current.x - trail2Pos.current.x);
      trail2Pos.current.y += easeInOutQuad(tTrail2) * (targetPos.current.y - trail2Pos.current.y);

      const isSettled =
        Math.abs(targetPos.current.x - corePos.current.x) < CURSOR_CONVERGE_EPSILON_PX &&
        Math.abs(targetPos.current.y - corePos.current.y) < CURSOR_CONVERGE_EPSILON_PX &&
        Math.abs(targetPos.current.x - auraPos.current.x) < CURSOR_CONVERGE_EPSILON_PX &&
        Math.abs(targetPos.current.y - auraPos.current.y) < CURSOR_CONVERGE_EPSILON_PX &&
        Math.abs(targetPos.current.x - trail1Pos.current.x) < CURSOR_CONVERGE_EPSILON_PX &&
        Math.abs(targetPos.current.y - trail1Pos.current.y) < CURSOR_CONVERGE_EPSILON_PX &&
        Math.abs(targetPos.current.x - trail2Pos.current.x) < CURSOR_CONVERGE_EPSILON_PX &&
        Math.abs(targetPos.current.y - trail2Pos.current.y) < CURSOR_CONVERGE_EPSILON_PX;

      if (isSettled) {
        snapAllToTarget();
        return;
      }

      applyTransforms();
      animFrameId.current = requestAnimationFrame(animate);
    };

    const wakeLoop = () => {
      if (!hasPointerMovedRef.current || !isPageVisibleRef.current || !isWindowFocusedRef.current) {
        return;
      }
      if (prefersReducedMotionRef.current) {
        stopLoop();
        snapAllToTarget();
        return;
      }
      if (animFrameId.current === null) {
        animFrameId.current = requestAnimationFrame(animate);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      isWindowFocusedRef.current = true;
      const target = e.target as HTMLElement | null;
      const { mode: detectedMode, isMagnetic } = getTargetMode(target, isMouseDownRef.current || e.buttons === 1);
      commitMode(detectedMode);

      if (isMagnetic && target) {
        const interactiveEl =
          target.closest('.close-button-wrapper, button, a, .item-link') ||
          target;
        const rect = interactiveEl.getBoundingClientRect();
        if (rect.width <= 180 && rect.height <= 180) {
          const midX = rect.left + rect.width / 2;
          const midY = rect.top + rect.height / 2;
          targetPos.current = {
            x: midX + (midX - e.clientX) * 0.15,
            y: midY + (midY - e.clientY) * 0.15,
          };
        } else {
          targetPos.current = { x: e.clientX, y: e.clientY };
        }
      } else {
        targetPos.current = {
          x: e.clientX,
          y: e.clientY,
        };
      }

      if (!hasPointerMovedRef.current) {
        hasPointerMovedRef.current = true;
        snapAllToTarget();
        return;
      }

      wakeLoop();
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        isMouseDownRef.current = true;
        const target = e.target as HTMLElement | null;
        const { mode: detectedMode } = getTargetMode(target, true);
        commitMode(detectedMode);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      isMouseDownRef.current = false;
      const target = e.target as HTMLElement | null;
      const { mode: detectedMode } = getTargetMode(target, false);
      commitMode(detectedMode);
    };

    const handleVisibilityChange = () => {
      isPageVisibleRef.current = document.visibilityState !== 'hidden';
      if (!isPageVisibleRef.current) {
        isMouseDownRef.current = false;
        stopLoop();
      } else {
        wakeLoop();
      }
    };

    const handleWindowBlur = () => {
      isWindowFocusedRef.current = false;
      isMouseDownRef.current = false;
      stopLoop();
    };

    const handleWindowFocus = () => {
      isWindowFocusedRef.current = true;
      wakeLoop();
    };

    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = motionMq.matches;
    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotionRef.current = e.matches;
      if (e.matches) {
        stopLoop();
        if (hasPointerMovedRef.current) {
          snapAllToTarget();
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    motionMq.addEventListener?.('change', handleMotionChange);

    return () => {
      stopLoop();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      motionMq.removeEventListener?.('change', handleMotionChange);
    };
  }, [isMobile, disabled]);

  if (isMobile) return null;

  const isDisabled = introDisabled || disabled;

  const isPointer = mode === 'pointer';
  const isView = mode === 'view';
  const isDrag = mode === 'drag';
  const isDragging = mode === 'dragging';
  const hasLabel = isView || isDrag || isDragging;

  return (
    <>
      {/* Trail 2 - 最远拖尾 (Ethereal Violet Stardust Comet Tail) */}
      <div ref={trail2Ref} className="fixed top-0 left-0 pointer-events-none z-[9997] will-change-transform">
        <div
          className="rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
          style={{
            width: isDisabled ? 0 : isPointer || isView ? '20px' : isDragging ? '22px' : '15px',
            height: isDisabled ? 0 : isPointer || isView ? '20px' : isDragging ? '22px' : '15px',
            opacity: isDisabled ? 0 : isPointer || isView ? 0.65 : isDragging ? 0.75 : 0.45,
            background: 'radial-gradient(circle, rgba(168,85,247,0.95) 0%, rgba(139,92,246,0.5) 50%, transparent 80%)',
            filter: 'blur(2.5px)',
          }}
        />
      </div>

      {/* Trail 1 - 近拖尾 (Luminous Purple Core Stardust Particle) */}
      <div ref={trail1Ref} className="fixed top-0 left-0 pointer-events-none z-[9998] will-change-transform">
        <div
          className="rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
          style={{
            width: isDisabled ? 0 : isPointer || isView ? '26px' : isDragging ? '28px' : '19px',
            height: isDisabled ? 0 : isPointer || isView ? '26px' : isDragging ? '28px' : '19px',
            opacity: isDisabled ? 0 : isPointer || isView ? 0.8 : isDragging ? 0.9 : 0.6,
            background: 'radial-gradient(circle, rgba(216,180,254,0.98) 0%, rgba(168,85,247,0.7) 45%, rgba(99,102,241,0.3) 75%, transparent 100%)',
            filter: 'blur(1.8px)',
          }}
        />
      </div>

      {/* Aura 光晕 (Chromatic Celestial Halo with Studio Contextual States) */}
      <div ref={auraRef} className="fixed top-0 left-0 pointer-events-none z-[9998] will-change-transform">
        <div
          className="rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out flex items-center justify-center"
          style={{
            width: isDisabled
              ? 0
              : isView
              ? '96px'
              : isDragging
              ? '56px'
              : isDrag
              ? '84px'
              : isPointer
              ? '88px'
              : '58px',
            height: isDisabled
              ? 0
              : isView
              ? '96px'
              : isDragging
              ? '56px'
              : isDrag
              ? '84px'
              : isPointer
              ? '88px'
              : '58px',
            opacity: isDisabled ? 0 : 1,
            background: isDragging
              ? 'radial-gradient(circle, rgba(168,85,247,0.65) 0%, rgba(139,92,246,0.45) 45%, rgba(99,102,241,0.2) 100%)'
              : isView
              ? 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(216,180,254,0.5) 35%, rgba(168,85,247,0.3) 70%, transparent 100%)'
              : isDrag
              ? 'radial-gradient(circle, rgba(147,51,234,0.35) 0%, rgba(99,102,241,0.22) 50%, transparent 100%)'
              : isPointer
              ? 'radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(216,180,254,0.55) 30%, rgba(168,85,247,0.35) 60%, transparent 100%)'
              : 'radial-gradient(circle, rgba(192,132,252,0.45) 0%, rgba(139,92,246,0.3) 40%, rgba(56,189,248,0.15) 70%, transparent 100%)',
            boxShadow: isDragging
              ? '0 0 45px 16px rgba(168,85,247,0.95), 0 0 80px 24px rgba(216,180,254,0.7)'
              : isView
              ? '0 0 42px 14px rgba(216,180,254,0.85), 0 0 70px 20px rgba(168,85,247,0.5)'
              : isDrag
              ? '0 0 28px 8px rgba(168,85,247,0.6), 0 0 50px 14px rgba(99,102,241,0.35)'
              : isPointer
              ? '0 0 36px 10px rgba(192,132,252,0.85), 0 0 65px 18px rgba(147,51,234,0.45)'
              : '0 0 24px 6px rgba(168,85,247,0.55), 0 0 45px 12px rgba(99,102,241,0.3)',
            border: isDragging
              ? '2px solid rgba(255,255,255,0.95)'
              : isView
              ? '1.5px solid rgba(245,235,255,0.85)'
              : isDrag
              ? '1px solid rgba(216,180,254,0.6)'
              : isPointer
              ? '1.5px solid rgba(230,210,255,0.7)'
              : '1px solid rgba(255,255,255,0.3)',
            backdropFilter: isView || isDrag || isDragging ? 'blur(3px)' : 'none',
          }}
        >
          {/* Contextual Typography inside aura */}
          {isView && (
            <span className="font-mono text-[10px] tracking-[0.24em] text-white uppercase select-none pointer-events-none drop-shadow-[0_0_8px_rgba(255,255,255,0.95)] font-semibold">
              VIEW
            </span>
          )}
          {isDrag && (
            <span className="font-mono text-[9px] tracking-[0.2em] text-white/95 uppercase select-none pointer-events-none drop-shadow-[0_0_6px_rgba(216,180,254,0.9)] font-medium">
              ↔ DRAG
            </span>
          )}
          {isDragging && (
            <span className="font-mono text-[9px] tracking-[0.2em] text-white uppercase select-none pointer-events-none drop-shadow-[0_0_8px_rgba(255,255,255,1)] font-bold">
              GRIP
            </span>
          )}
        </div>
      </div>

      {/* Core 核心 (Luminous Diamond Point) */}
      <div ref={coreRef} className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform">
        <div
          className="rounded-full transition-all duration-200 ease-out -translate-x-1/2 -translate-y-1/2"
          style={{
            width: isDisabled ? 0 : hasLabel ? 0 : isPointer ? '18px' : '11px',
            height: isDisabled ? 0 : hasLabel ? 0 : isPointer ? '18px' : '11px',
            opacity: isDisabled ? 0 : hasLabel ? 0 : 1,
            backgroundColor: isPointer ? '#fdf4ff' : '#ffffff',
            boxShadow: isPointer
              ? `0 0 14px 4px #fff, 0 0 32px 10px rgba(216,180,254,0.95), 0 0 54px 16px rgba(168,85,247,0.6)`
              : `0 0 10px 2px #fff, 0 0 20px 6px rgba(192,132,252,0.75), 0 0 36px 10px rgba(139,92,246,0.4)`,
          }}
        />
      </div>
    </>
  );
};
