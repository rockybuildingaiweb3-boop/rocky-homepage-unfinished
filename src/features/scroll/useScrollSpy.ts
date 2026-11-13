import React, { useState, useEffect, useRef, RefObject } from 'react';
import {
  resolveActiveSection,
  type SectionObservationSnapshot,
} from './heroParallax';

export interface UseScrollSpyOptions {
  sectionIds: string[];
  scrollContainerRef?: RefObject<HTMLElement | null>;
  offsetRatio?: number;
}

export interface UseScrollSpyResult {
  activeSection: string;
  setActiveSection: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * Hook to spy the active navigation section using IntersectionObserver.
 * Avoids storing per-frame scrollY in React state so scrolling never re-renders the whole page.
 */
export function useScrollSpy({
  sectionIds,
  scrollContainerRef,
  offsetRatio = 0.25,
}: UseScrollSpyOptions): UseScrollSpyResult {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] || 'home');
  const activeSectionRef = useRef<string>(activeSection);
  activeSectionRef.current = activeSection;

  const sectionIdsKey = sectionIds.join('|');

  useEffect(() => {
    if (typeof window === 'undefined' || sectionIds.length === 0) return;

    const snapshots = new Map<string, SectionObservationSnapshot>();
    const elements: Array<{ id: string; el: HTMLElement }> = [];

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        snapshots.set(id, {
          id,
          isIntersecting: false,
          intersectionRatio: 0,
          top: rect.top,
          bottom: rect.bottom,
        });
        elements.push({ id, el });
      }
    }

    if (elements.length === 0) return;

    const commitActiveSection = () => {
      const container = scrollContainerRef?.current;
      const scrollY =
        (container ? container.scrollTop : undefined) ??
        window.scrollY ??
        document.documentElement.scrollTop ??
        0;
      const viewportHeight = container ? container.clientHeight : window.innerHeight || 900;
      const documentHeight = container
        ? container.scrollHeight
        : document.documentElement.scrollHeight;

      const orderedSnapshots: SectionObservationSnapshot[] = [];
      for (const id of sectionIds) {
        const snap = snapshots.get(id);
        if (snap) orderedSnapshots.push(snap);
      }

      const next = resolveActiveSection({
        sectionIds,
        snapshots: orderedSnapshots,
        scrollY,
        viewportHeight,
        documentHeight,
        offsetRatio,
      });

      if (next !== activeSectionRef.current) {
        activeSectionRef.current = next;
        setActiveSection(next);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (!id) continue;
          snapshots.set(id, {
            id,
            isIntersecting: entry.isIntersecting,
            intersectionRatio: entry.intersectionRatio,
            top: entry.boundingClientRect.top,
            bottom: entry.boundingClientRect.bottom,
          });
        }
        commitActiveSection();
      },
      {
        root: scrollContainerRef?.current ?? null,
        rootMargin: '-12% 0px -22% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    for (const { el } of elements) {
      observer.observe(el);
    }

    // Lightweight boundary check (top/bottom of page) without per-frame React state updates
    let boundaryRafId: number | null = null;
    const handleBoundaryScroll = () => {
      if (boundaryRafId !== null) return;
      boundaryRafId = requestAnimationFrame(() => {
        boundaryRafId = null;
        commitActiveSection();
      });
    };

    const scrollTarget: EventTarget = scrollContainerRef?.current ?? window;
    scrollTarget.addEventListener('scroll', handleBoundaryScroll, { passive: true });
    window.addEventListener('resize', handleBoundaryScroll, { passive: true });
    commitActiveSection();

    return () => {
      observer.disconnect();
      scrollTarget.removeEventListener('scroll', handleBoundaryScroll);
      window.removeEventListener('resize', handleBoundaryScroll);
      if (boundaryRafId !== null) cancelAnimationFrame(boundaryRafId);
    };
  }, [sectionIdsKey, scrollContainerRef, offsetRatio]);

  return { activeSection, setActiveSection };
}
