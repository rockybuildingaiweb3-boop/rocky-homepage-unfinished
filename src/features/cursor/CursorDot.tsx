import React, { useEffect, useRef } from 'react';

export interface CursorDotProps {
  isMobile?: boolean;
}

export const CursorDot: React.FC<CursorDotProps> = ({ isMobile = false }) => {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const position = useRef({ x: -100, y: -100 });
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (isMobile) return;

    const onMove = (event: MouseEvent) => {
      target.current = { x: event.clientX, y: event.clientY };
    };

    const animate = () => {
      position.current.x += (target.current.x - position.current.x) * 0.28;
      position.current.y += (target.current.y - position.current.y) * 0.28;

      if (ref.current) {
        ref.current.style.transform = `translate3d(${position.current.x}px, ${position.current.y}px, 0)`;
      }

      frame.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    frame.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 mix-blend-difference"
    />
  );
};

export default CursorDot;
