import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getGPUTier } from 'detect-gpu';
import { STUDIO_PROJECTS } from '../../data/studioProjects';
import { StudioRenderer } from './StudioRenderer';
import { StudioItem } from './StudioItem';
import { StudioDetails } from './StudioDetails';
import type { StudioProject } from '../../types';

interface StudioSectionProps {
  projects?: StudioProject[];
}

export const StudioSection: React.FC<StudioSectionProps> = ({
  projects = STUDIO_PROJECTS,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  const [currentActive, setCurrentActive] = useState<number>(-1);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);

  // Slider animation state
  const sliderState = useRef({
    initialMouseX: 0,
    currentMouseX: 0,
    initialPosition: 0,
    targetPosition: 0,
    currentPosition: 0,
    speed: 0,
    offsetSpeed: 3800,
    lerpSpeed: 0.1,
    isInteracting: false,
    rafId: 0,
  });

  const rendererRef = useRef<StudioRenderer | null>(null);
  const hasPlayedIntroRef = useRef<boolean>(false);

  // Helper for linear interpolation
  const lerp = (start: number, end: number, factor: number) =>
    start * (1 - factor) + end * factor;

  // IntersectionObserver to trigger smooth intro momentum glide on entering viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayedIntroRef.current) {
          hasPlayedIntroRef.current = true;
          // Smooth intro kinetic pulse matching reference workListIntro
          sliderState.current.currentPosition = 90;
          sliderState.current.targetPosition = 0;
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Center active item smoothly
  const scrollToActiveItem = useCallback((idx: number) => {
    const itemEl = itemRefs.current[idx];
    if (!itemEl) return;
    const target = -(itemEl.offsetLeft - window.innerWidth / 4 + window.innerWidth / 10);
    sliderState.current.targetPosition = target;
  }, []);

  const toggleActiveItem = useCallback(
    (index: number) => {
      setCurrentActive((prev) => {
        if (prev === index) {
          return -1;
        } else {
          scrollToActiveItem(index);
          return index;
        }
      });
    },
    [scrollToActiveItem]
  );

  // Mouse and touch interaction handlers
  const handleDragStart = useCallback(
    (clientX: number) => {
      if (currentActive >= 0 || !listRef.current) return;
      sliderState.current.isInteracting = true;
      sliderState.current.initialMouseX = clientX;
      sliderState.current.currentMouseX = clientX;

      const style = window.getComputedStyle(listRef.current);
      const transform = style.transform === 'none' ? 'matrix(1, 0, 0, 1, 0, 0)' : style.transform;
      try {
        const matrix = new DOMMatrix(transform);
        sliderState.current.initialPosition = matrix.m41;
      } catch {
        sliderState.current.initialPosition = sliderState.current.currentPosition;
      }

      setIsHolding(true);
      isDraggingRef.current = false;
    },
    [currentActive]
  );

  const handleDragMove = useCallback(
    (clientX: number) => {
      if (!sliderState.current.isInteracting || currentActive >= 0) return;
      sliderState.current.currentMouseX = clientX;

      const diff = (clientX - sliderState.current.initialMouseX) * -1;
      if (Math.abs(diff) > 5) {
        isDraggingRef.current = true;
      }

      const clientWidth = document.body.clientWidth || window.innerWidth || 1200;
      const target =
        sliderState.current.initialPosition -
        sliderState.current.offsetSpeed * (diff / clientWidth);
      sliderState.current.targetPosition = Math.round(target * 100) / 100;
    },
    [currentActive]
  );

  const handleDragEnd = useCallback(() => {
    sliderState.current.isInteracting = false;
    setIsHolding(false);
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 50);
  }, []);

  // Trackpad / wheel listener inside Studio section
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (currentActive >= 0 || !listRef.current) return;

      // When cursor is over the Studio slider, allow horizontal scrolling gestures
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) > 2) {
        sliderState.current.targetPosition -= delta * 1.5;
      }
    },
    [currentActive]
  );

  // Initialize WebGL and Animation Loop
  useEffect(() => {
    let isCancelled = false;

    const initEffects = async () => {
      try {
        const gpuTier = await getGPUTier();
        if (isCancelled || !containerRef.current) return;

        // Collect valid image elements
        const validImages = imageRefs.current.filter(Boolean) as HTMLImageElement[];
        if (validImages.length > 0 && gpuTier.tier >= 1 && !gpuTier.isMobile) {
          rendererRef.current = new StudioRenderer(containerRef.current, validImages);
        }
      } catch {
        // Fallback gracefully to high-performance CSS and image layer
      }
    };

    initEffects();

    // Main animation loop (runs at 60fps)
    const animate = () => {
      const state = sliderState.current;
      const listEl = listRef.current;

      if (listEl) {
        if (currentActive < 0) {
          const clientW = document.body.clientWidth || window.innerWidth;
          let endPoint = listEl.scrollWidth - clientW;
          if (endPoint < 0) endPoint = listEl.scrollWidth;

          // Clamping bounds
          if (state.targetPosition > 0) state.targetPosition = 0;
          if (state.targetPosition <= -endPoint) state.targetPosition = -endPoint;
        }

        // Lerp position
        state.currentPosition = lerp(
          state.currentPosition,
          state.targetPosition,
          state.lerpSpeed
        );

        // Calculate velocity speed for shaders
        state.speed = Math.round((state.currentPosition - state.targetPosition) * 100) / 100;

        const roundedX = Math.round(state.currentPosition * 100) / 100;
        listEl.style.transform = `translate3d(${roundedX}px, 0px, 0px)`;
      }

      // Render Three.js WebGL shader distortion
      if (rendererRef.current) {
        rendererRef.current.render(state.speed);
      }

      state.rafId = requestAnimationFrame(animate);
    };

    sliderState.current.rafId = requestAnimationFrame(animate);

    return () => {
      isCancelled = true;
      cancelAnimationFrame(sliderState.current.rafId);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
    };
  }, [currentActive]);

  return (
    <section
      id="studio"
      ref={sectionRef}
      className="relative w-full min-h-[80vh] sm:min-h-[86vh] mt-8 sm:mt-14 mb-4 sm:mb-8 flex flex-col justify-center overflow-hidden select-none"
      aria-label="Studio Showcase"
    >
      {/* Section Header: Minimalist Editorial Marker */}
      <div className="w-full px-6 sm:px-12 md:px-16 mb-4 sm:mb-8 flex flex-row items-center justify-between pointer-events-none">
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs sm:text-sm tracking-[0.25em] text-cyan-400 font-semibold uppercase">
            // STUDIO
          </span>
          <span className="hidden sm:inline-block w-12 h-[1px] bg-white/20" />
          <span className="text-xs tracking-widest text-white/50 uppercase font-light hidden sm:inline-block">
            Featured Works &amp; Explorations
          </span>
        </div>

        <div className="font-mono text-xs tracking-widest text-white/40">
          [ {projects.length.toString().padStart(2, '0')} RELEASES ]
        </div>
      </div>

      {/* Main Interactive Container */}
      <div
        ref={containerRef}
        role="region"
        aria-label="Studio carousel slider"
        tabIndex={0}
        onWheel={handleWheel}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => {
          if (e.touches[0]) handleDragStart(e.touches[0].clientX);
        }}
        onTouchMove={(e) => {
          if (e.touches[0]) handleDragMove(e.touches[0].clientX);
        }}
        onTouchEnd={handleDragEnd}
        className={`relative w-full h-[75vh] flex flex-col justify-center select-none overflow-hidden ${
          currentActive >= 0 ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
        }`}
      >
        {/* Horizontal Slider Track */}
        <ul
          ref={listRef}
          className={`flex flex-row items-center list-none m-0 p-0 pl-[6vw] sm:pl-[10vw] h-[75vh] w-max will-change-transform transition-[opacity,filter] duration-500 ${
            isHolding ? 'scale-[0.985] duration-300' : 'scale-100'
          }`}
          style={{ transform: 'translate3d(0px, 0px, 0px)' }}
        >
          {projects.map((item, index) => (
            <StudioItem
              key={item.id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              imageRef={(el) => {
                imageRefs.current[index] = el;
              }}
              project={item}
              index={index}
              isActive={currentActive === index}
              isAmbient={currentActive !== -1 && currentActive !== index}
              isDragging={isHolding}
              isDetailsOpen={currentActive !== -1}
              onToggleActive={toggleActiveItem}
            />
          ))}
        </ul>

        {/* Expanded Project Details Overlay */}
        {currentActive !== -1 && projects[currentActive] && (
          <StudioDetails
            project={projects[currentActive]}
            index={currentActive}
            onClose={() => setCurrentActive(-1)}
          />
        )}
      </div>

      {/* Subtle Drag Prompt Hint (Disappears during interaction) */}
      <div
        className={`w-full text-center mt-3 sm:mt-5 transition-opacity duration-500 pointer-events-none ${
          currentActive >= 0 ? 'opacity-0' : 'opacity-40'
        }`}
      >
        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-white/60">
          &larr; Drag or Scroll Horizontally to Explore &rarr;
        </span>
      </div>

      {/* Atmospheric Bridge: Gentle cosmic purple aura blending into Skills section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="w-full h-full"
          style={{
            background:
              'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(112, 66, 248, 0.14) 0%, rgba(79, 70, 229, 0.05) 45%, transparent 85%)',
          }}
        />
      </div>
    </section>
  );
};

export default StudioSection;
