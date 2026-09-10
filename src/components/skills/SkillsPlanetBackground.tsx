import React, { useEffect, useRef, useState } from 'react';

interface SkillsPlanetBackgroundProps {
  activeBrandColor?: string;
}

export const SkillsPlanetBackground: React.FC<SkillsPlanetBackgroundProps> = ({ activeBrandColor = '#7042F8' }) => {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        setMouseOffset({
          x: (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 18,
          y: (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 12,
        });
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute left-1/2 top-1/2 h-[70vh] w-[85vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] transition-transform duration-500" style={{ transform: `translate(calc(-50% + ${mouseOffset.x * 0.2}px), calc(-50% + ${mouseOffset.y * 0.2}px))`, background: 'radial-gradient(circle, rgba(112,66,248,.34) 0%, rgba(147,51,234,.13) 42%, transparent 72%)' }} />
      <div className="absolute left-1/2 top-1/2 h-[50vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[70px] transition-transform duration-700" style={{ transform: `translate(calc(-50% + ${mouseOffset.x * 0.35}px), calc(-50% + ${mouseOffset.y * 0.35}px))`, background: `radial-gradient(circle, ${activeBrandColor}24 0%, ${activeBrandColor}08 48%, transparent 72%)` }} />
      <div className="absolute inset-x-0 bottom-0 h-[55%] transition-transform duration-300" style={{ transform: `translate(${mouseOffset.x * 0.45}px, ${mouseOffset.y * 0.45}px)`, background: 'radial-gradient(ellipse at 50% 100%, rgba(112,66,248,.4) 0%, rgba(56,30,130,.16) 35%, transparent 72%)', maskImage: 'radial-gradient(ellipse 80% 75% at 50% 70%, black 42%, rgba(0,0,0,.65) 72%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 75% at 50% 70%, black 42%, rgba(0,0,0,.65) 72%, transparent 100%)' }} />
    </div>
  );
};

export default SkillsPlanetBackground;
