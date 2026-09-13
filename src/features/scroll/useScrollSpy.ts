import React, { useState, useEffect, RefObject } from 'react';

export interface UseScrollSpyOptions {
  sectionIds: string[];
  scrollContainerRef?: RefObject<HTMLElement | null>;
  offsetRatio?: number;
}

export interface UseScrollSpyResult {
  scrollY: number;
  setScrollY: React.Dispatch<React.SetStateAction<number>>;
  activeSection: string;
  setActiveSection: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * Hook to listen to scroll updates and dynamically spy the active section
 */
export function useScrollSpy({
  sectionIds,
  scrollContainerRef,
  offsetRatio = 0.25,
}: UseScrollSpyOptions): UseScrollSpyResult {
  const [scrollY, setScrollY] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] || 'home');

  useEffect(() => {
    let rafId: number | null = null;

    const handleScrollUpdate = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const rawPos =
          (typeof window !== 'undefined' ? window.scrollY : 0) ||
          (typeof document !== 'undefined' ? document.documentElement.scrollTop : 0) ||
          scrollContainerRef?.current?.scrollTop ||
          0;
        const scrollPos = typeof rawPos === 'number' && Number.isFinite(rawPos) ? Math.max(0, rawPos) : 0;
        setScrollY(scrollPos);

        const windowH = window.innerHeight;

        for (let i = sectionIds.length - 1; i >= 0; i--) {
          const id = sectionIds[i];
          const el = document.getElementById(id);
          if (el) {
            const top = el.offsetTop - windowH * offsetRatio;
            if (scrollPos >= top) {
              setActiveSection(id);
              break;
            }
          }
        }
      });
    };

    window.addEventListener('scroll', handleScrollUpdate, { passive: true });
    handleScrollUpdate();

    return () => {
      window.removeEventListener('scroll', handleScrollUpdate);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [sectionIds, scrollContainerRef, offsetRatio]);

  return { scrollY, setScrollY, activeSection, setActiveSection };
}
