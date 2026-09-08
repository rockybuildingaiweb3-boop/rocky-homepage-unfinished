import React, { useEffect, useRef, useState } from 'react';
import { easeInOutQuad } from '../../utils';

interface CursorDotProps {
  isMobile?: boolean;
  disabled?: boolean;
}

export const CursorDot: React.FC<CursorDotProps> = ({ isMobile = false, disabled = false }) => {
  const [hover, setHover] = useState(false);
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

  useEffect(() => {
    const timer = setTimeout(() => setIntroDisabled(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      let cursor = 'default';
      if (target) {
        cursor = window.getComputedStyle(target).cursor;
      }
      const isPointer = cursor === 'pointer' || target?.closest('.clickable') !== null;
      setHover(isPointer);

      if (isPointer && target) {
        const interactiveEl = target.closest('.clickable') || target;
        const rect = interactiveEl.getBoundingClientRect();
        const midX = rect.left + rect.width / 2;
        const midY = rect.top + rect.height / 2;
        targetPos.current = {
          x: midX + (midX - e.clientX) * 0.15,
          y: midY + (midY - e.clientY) * 0.15,
        };
      } else {
        targetPos.current = {
          x: e.clientX,
          y: e.clientY,
        };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
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

      // Apply GPU translate3d transforms
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

      animFrameId.current = requestAnimationFrame(animate);
    };

    animFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isMobile]);

  if (isMobile) return null;

  const isDisabled = introDisabled || disabled;

  return (
    <>
      {/* Trail 2 - 最远拖尾 (Ethereal Violet Stardust) */}
      <div ref={trail2Ref} className="fixed top-0 left-0 pointer-events-none z-[9997] will-change-transform">
        <div
          className="rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
          style={{
            width: isDisabled ? 0 : hover ? '20px' : '15px',
            height: isDisabled ? 0 : hover ? '20px' : '15px',
            opacity: isDisabled ? 0 : hover ? 0.65 : 0.45,
            background: 'radial-gradient(circle, rgba(168,85,247,0.95) 0%, rgba(139,92,246,0.5) 50%, transparent 80%)',
            filter: 'blur(2.5px)',
          }}
        />
      </div>

      {/* Trail 1 - 近拖尾 (Luminous Purple Core) */}
      <div ref={trail1Ref} className="fixed top-0 left-0 pointer-events-none z-[9998] will-change-transform">
        <div
          className="rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
          style={{
            width: isDisabled ? 0 : hover ? '26px' : '19px',
            height: isDisabled ? 0 : hover ? '26px' : '19px',
            opacity: isDisabled ? 0 : hover ? 0.8 : 0.6,
            background: 'radial-gradient(circle, rgba(216,180,254,0.98) 0%, rgba(168,85,247,0.7) 45%, rgba(99,102,241,0.3) 75%, transparent 100%)',
            filter: 'blur(1.8px)',
          }}
        />
      </div>

      {/* Aura 光晕 (Chromatic Celestial Halo) */}
      <div ref={auraRef} className="fixed top-0 left-0 pointer-events-none z-[9998] will-change-transform">
        <div
          className="rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
          style={{
            width: isDisabled ? 0 : hover ? '88px' : '58px',
            height: isDisabled ? 0 : hover ? '88px' : '58px',
            opacity: isDisabled ? 0 : hover ? 1 : 0.85,
            background: hover
              ? 'radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(216,180,254,0.55) 30%, rgba(168,85,247,0.35) 60%, transparent 100%)'
              : 'radial-gradient(circle, rgba(192,132,252,0.45) 0%, rgba(139,92,246,0.3) 40%, rgba(56,189,248,0.15) 70%, transparent 100%)',
            boxShadow: hover
              ? '0 0 36px 10px rgba(192,132,252,0.85), 0 0 65px 18px rgba(147,51,234,0.45)'
              : '0 0 24px 6px rgba(168,85,247,0.55), 0 0 45px 12px rgba(99,102,241,0.3)',
            border: hover ? '1.5px solid rgba(230,210,255,0.7)' : '1px solid rgba(255,255,255,0.3)',
          }}
        />
      </div>

      {/* Core 核心 (Luminous Diamond Point) */}
      <div ref={coreRef} className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform">
        <div
          className="rounded-full transition-all duration-200 ease-out -translate-x-1/2 -translate-y-1/2"
          style={{
            width: isDisabled ? 0 : hover ? '18px' : '11px',
            height: isDisabled ? 0 : hover ? '18px' : '11px',
            opacity: isDisabled ? 0 : 1,
            backgroundColor: hover ? '#fdf4ff' : '#ffffff',
            boxShadow: hover
              ? `0 0 14px 4px #fff, 0 0 32px 10px rgba(216,180,254,0.95), 0 0 54px 16px rgba(168,85,247,0.6)`
              : `0 0 10px 2px #fff, 0 0 20px 6px rgba(192,132,252,0.75), 0 0 36px 10px rgba(139,92,246,0.4)`,
          }}
        />
      </div>
    </>
  );
};
