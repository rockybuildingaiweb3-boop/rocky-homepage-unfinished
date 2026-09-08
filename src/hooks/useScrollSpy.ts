import { useState, useEffect, RefObject } from 'react';

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
    const handleScrollUpdate = () => {
      const scrollPos =
        window.scrollY ||
        document.documentElement.scrollTop ||
        scrollContainerRef?.current?.scrollTop ||
        0;
      setScrollY(scrollPos);

      const windowH = window.innerHeight;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop - windowH * offsetRatio;
          if (scrollPos >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollUpdate, { passive: true });
    handleScrollUpdate();

    return () => window.removeEventListener('scroll', handleScrollUpdate);
  }, [sectionIds, scrollContainerRef, offsetRatio]);

  return { scrollY, setScrollY, activeSection, setActiveSection };
}
