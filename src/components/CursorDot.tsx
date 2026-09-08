import React, { useEffect, useRef, useState } from 'react';
import { easeInOutQuad } from '../utils';

interface CursorDotProps {
  isMobile?: boolean;
  disabled?: boolean;
}

export const CursorDot: React.FC<CursorDotProps> = ({ isMobile = false, disabled = false }) => {
  const [hover, setHover] = useState(false);
  const [introDisabled, setIntroDisabled] = useState(true);
  const dotRef = useRef<HTMLDivElement>(null);

  const currentPos = useRef({ x: -100, y: -100 });
  const targetPos = useRef({ x: -100, y: -100 });
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
      const t = 0.4;
      currentPos.current.x += easeInOutQuad(t) * (targetPos.current.x - currentPos.current.x);
      currentPos.current.y += easeInOutQuad(t) * (targetPos.current.y - currentPos.current.y);

      const x = Math.ceil(currentPos.current.x * 100) / 100;
      const y = Math.ceil(currentPos.current.y * 100) / 100;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0px)`;
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
    <div
      ref={dotRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform"
      style={{
        mixBlendMode: 'exclusion',
      }}
    >
      <div
        className="rounded-full bg-white transition-all duration-500 ease-out -translate-x-1/2 -translate-y-1/2"
        style={{
          width: isDisabled ? 0 : hover ? '7.5vh' : '4vh',
          height: isDisabled ? 0 : hover ? '7.5vh' : '4vh',
          opacity: isDisabled ? 0 : 1,
        }}
      />
    </div>
  );
};
