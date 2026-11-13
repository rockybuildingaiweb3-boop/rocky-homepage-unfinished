import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { STUDIO_PROJECTS } from '../../data/studioProjects';
import {
  getReducedMotionPreference,
  probeGpuCapabilities,
} from '../../hooks/useDeviceCapabilities';
import { StudioRenderer } from './StudioRenderer';
import { StudioItem } from './StudioItem';
import { StudioDetails } from './StudioDetails';
import {
  computeNextStudioSnapTarget,
  resolveStudioKeyboardAction,
  resolveStudioTouchAxis,
  resolveStudioWheelIntent,
  shouldStudioLoopContinue,
  type TouchAxisLock,
} from './studioLoopLogic';
import type { StudioProject } from '../../types';

interface StudioSectionProps {
  projects?: StudioProject[];
}

export const StudioSection: React.FC<StudioSectionProps> = memo(({
  projects = STUDIO_PROJECTS,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  const [currentActive, setCurrentActive] = useState<number>(-1);
  const currentActiveRef = useRef<number>(-1);
  currentActiveRef.current = currentActive;

  const [isHolding, setIsHolding] = useState<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);

  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const isReducedMotionRef = useRef<boolean>(false);

  // Visibility & transition gating for on-demand RAF/WebGL rendering
  const isInViewportRef = useRef<boolean>(false);
  const isPageVisibleRef = useRef<boolean>(
    typeof document !== 'undefined' ? document.visibilityState !== 'hidden' : true
  );
  const transitionUntilRef = useRef<number>(0);
  const cachedBoundsRef = useRef<{ clientWidth: number; endPoint: number }>({
    clientWidth: 1200,
    endPoint: 0,
  });

  // Slider motion & animation state
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

  // Coordinated kinetic intro state (reference workListIntro)
  const introState = useRef({
    hasStarted: false,
    isIntroPlaying: false,
    startTime: 0,
    duration: 1600,
    initialOffset: 0,
    isComplete: false,
  });

  const rendererRef = useRef<StudioRenderer | null>(null);
  const wakeLoopRef = useRef<() => void>(() => {});
  const dragEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchGestureRef = useRef<{
    startX: number;
    startY: number;
    lockedAxis: TouchAxisLock;
  }>({
    startX: 0,
    startY: 0,
    lockedAxis: 'none',
  });

  // Helper for linear interpolation
  const lerp = (start: number, end: number, factor: number) =>
    start * (1 - factor) + end * factor;

  const updateTrackBoundsCache = useCallback(() => {
    const clientW =
      containerRef.current?.clientWidth ||
      document.body.clientWidth ||
      window.innerWidth ||
      1200;
    const listEl = listRef.current;
    let endPoint = 0;
    if (listEl) {
      endPoint = listEl.scrollWidth - clientW;
      if (endPoint < 0) endPoint = listEl.scrollWidth;
    }
    cachedBoundsRef.current = { clientWidth: clientW, endPoint };
  }, []);

  // Center active item smoothly
  const scrollToActiveItem = useCallback(
    (idx: number) => {
      const itemEl = itemRefs.current[idx];
      if (!itemEl) return;
      updateTrackBoundsCache();
      const clientW = cachedBoundsRef.current.clientWidth || 1200;
      const target = -(itemEl.offsetLeft - clientW / 4 + clientW / 10);
      sliderState.current.targetPosition = target;
    },
    [updateTrackBoundsCache]
  );

  const toggleActiveItem = useCallback(
    (index: number) => {
      transitionUntilRef.current = performance.now() + 820;
      setCurrentActive((prev) => {
        if (prev === index) {
          return -1;
        } else {
          scrollToActiveItem(index);
          return index;
        }
      });
      wakeLoopRef.current();
    },
    [scrollToActiveItem]
  );

  const handleCloseDetails = useCallback(() => {
    transitionUntilRef.current = performance.now() + 820;
    setCurrentActive(-1);
    wakeLoopRef.current();
  }, []);

  // Mouse and touch interaction handlers
  const handleDragStart = useCallback((clientX: number) => {
    if (currentActiveRef.current >= 0 || !listRef.current) return;

    // User interaction immediately claims authority over any in-flight intro
    if (introState.current.isIntroPlaying) {
      introState.current.isIntroPlaying = false;
      introState.current.isComplete = true;
    }

    sliderState.current.isInteracting = true;
    sliderState.current.initialMouseX = clientX;
    sliderState.current.currentMouseX = clientX;
    sliderState.current.initialPosition = sliderState.current.currentPosition;

    setIsHolding(true);
    isDraggingRef.current = false;
    wakeLoopRef.current();
  }, []);

  const handleDragMove = useCallback((clientX: number) => {
    if (!sliderState.current.isInteracting || currentActiveRef.current >= 0) return;
    sliderState.current.currentMouseX = clientX;

    const diff = (clientX - sliderState.current.initialMouseX) * -1;
    if (Math.abs(diff) > 5) {
      isDraggingRef.current = true;
    }

    const clientWidth = cachedBoundsRef.current.clientWidth || 1200;
    const target =
      sliderState.current.initialPosition -
      sliderState.current.offsetSpeed * (diff / clientWidth);
    sliderState.current.targetPosition = Math.round(target * 100) / 100;
    wakeLoopRef.current();
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!sliderState.current.isInteracting && !isDraggingRef.current) return;
    sliderState.current.isInteracting = false;
    setIsHolding(false);
    wakeLoopRef.current();
    if (dragEndTimerRef.current !== null) {
      clearTimeout(dragEndTimerRef.current);
    }
    dragEndTimerRef.current = setTimeout(() => {
      dragEndTimerRef.current = null;
      isDraggingRef.current = false;
    }, 50);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch || currentActiveRef.current >= 0) return;
    touchGestureRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      lockedAxis: 'none',
    };
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      if (!touch || currentActiveRef.current >= 0) return;

      const gesture = touchGestureRef.current;
      if (gesture.lockedAxis === 'y') return;

      if (gesture.lockedAxis === 'none') {
        const dx = touch.clientX - gesture.startX;
        const dy = touch.clientY - gesture.startY;
        const nextAxis = resolveStudioTouchAxis(dx, dy);
        if (nextAxis === 'none') return;
        gesture.lockedAxis = nextAxis;
        if (nextAxis === 'y') return;

        // Horizontal gesture confirmed: start drag from current finger position seamlessly
        handleDragStart(touch.clientX);
      }

      handleDragMove(touch.clientX);
    },
    [handleDragMove, handleDragStart]
  );

  const handleTouchEnd = useCallback(() => {
    const wasHorizontal = touchGestureRef.current.lockedAxis === 'x';
    touchGestureRef.current.lockedAxis = 'none';
    if (wasHorizontal) {
      handleDragEnd();
    }
  }, [handleDragEnd]);

  // Accessible keyboard navigation (ArrowLeft / ArrowRight / Home / End / Escape)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const action = resolveStudioKeyboardAction({
        key: e.key,
        currentActive: currentActiveRef.current,
        projectCount: projects.length,
      });

      if (action.type === 'none') return;

      e.preventDefault();
      updateTrackBoundsCache();

      if (introState.current.isIntroPlaying) {
        introState.current.isIntroPlaying = false;
        introState.current.isComplete = true;
      }

      if (action.type === 'close-details') {
        handleCloseDetails();
        return;
      }

      if (action.type === 'select-project') {
        transitionUntilRef.current = performance.now() + 820;
        setCurrentActive(action.nextIndex);
        scrollToActiveItem(action.nextIndex);
        wakeLoopRef.current();
        return;
      }

      const endPoint = cachedBoundsRef.current.endPoint;
      const snapOffsets = itemRefs.current.map((el) => {
        if (!el) return 0;
        const clientW = cachedBoundsRef.current.clientWidth || 1200;
        return Math.max(0, el.offsetLeft - clientW * 0.12);
      });

      if (action.type === 'step-track') {
        sliderState.current.targetPosition = computeNextStudioSnapTarget(
          snapOffsets,
          sliderState.current.targetPosition,
          action.direction,
          endPoint
        );
      } else if (action.type === 'jump-start') {
        sliderState.current.targetPosition = 0;
      } else if (action.type === 'jump-end') {
        sliderState.current.targetPosition = -Math.max(0, endPoint);
      }

      wakeLoopRef.current();
    },
    [handleCloseDetails, projects.length, scrollToActiveItem, updateTrackBoundsCache]
  );

  // Initialize WebGL, Intersection/Visibility Pause, ResizeObserver, and On-Demand Animation Loop
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl || typeof window === 'undefined') return;

    let isCancelled = false;

    const prefersReduced = getReducedMotionPreference();
    if (prefersReduced) {
      isReducedMotionRef.current = true;
      setIsReducedMotion(true);
      setIsRevealed(true);
      introState.current.hasStarted = true;
      introState.current.isComplete = true;
    }

    const stopLoop = () => {
      if (sliderState.current.rafId !== 0) {
        cancelAnimationFrame(sliderState.current.rafId);
        sliderState.current.rafId = 0;
      }
    };

    const step = (nowMs: number) => {
      const state = sliderState.current;
      state.rafId = 0;

      if (
        isCancelled ||
        !isInViewportRef.current ||
        !isPageVisibleRef.current ||
        isReducedMotionRef.current
      ) {
        return;
      }

      const listEl = listRef.current;
      const intro = introState.current;

      // Handle kinetic intro glide (outQuint with deceleration speed)
      if (intro.isIntroPlaying && !intro.isComplete) {
        const elapsed = nowMs - intro.startTime;
        const progress = Math.min(1, elapsed / intro.duration);
        // outQuint: 1 - (1 - progress)^5
        const quintOut = 1 - Math.pow(1 - progress, 5);
        const remaining = 1 - quintOut;

        state.currentPosition = intro.initialOffset * remaining;
        state.targetPosition = 0;
        state.speed = -remaining * 2500;

        if (progress >= 1) {
          intro.isIntroPlaying = false;
          intro.isComplete = true;
          state.currentPosition = 0;
          state.targetPosition = 0;
          state.speed = 0;
        }
      } else if (listEl) {
        if (currentActiveRef.current < 0) {
          const endPoint = cachedBoundsRef.current.endPoint;
          if (state.targetPosition > 0) state.targetPosition = 0;
          if (state.targetPosition <= -endPoint) state.targetPosition = -endPoint;
        }

        state.currentPosition = lerp(
          state.currentPosition,
          state.targetPosition,
          state.lerpSpeed
        );

        state.speed = Math.round((state.currentPosition - state.targetPosition) * 100) / 100;
      }

      const continueLoop = shouldStudioLoopContinue({
        isInViewport: isInViewportRef.current,
        isPageVisible: isPageVisibleRef.current,
        isReducedMotion: isReducedMotionRef.current,
        isIntroPlaying: intro.isIntroPlaying,
        isInteracting: state.isInteracting,
        currentPosition: state.currentPosition,
        targetPosition: state.targetPosition,
        speed: state.speed,
        transitionUntilMs: transitionUntilRef.current,
        nowMs,
      });

      if (!continueLoop && !intro.isIntroPlaying && !state.isInteracting) {
        state.currentPosition = state.targetPosition;
        state.speed = 0;
      }

      const roundedX = Math.round(state.currentPosition * 100) / 100;
      if (listEl) {
        listEl.style.transform = `translate3d(${roundedX}px, 0px, 0px)`;
      }

      if (rendererRef.current) {
        // Sync mesh DOM geometry only while CSS reveal/expand transitions are animating
        if (nowMs < transitionUntilRef.current) {
          updateTrackBoundsCache();
          rendererRef.current.syncLayout(roundedX);
        }
        rendererRef.current.render(state.speed, roundedX);
      }

      if (continueLoop) {
        state.rafId = requestAnimationFrame(step);
      }
    };

    const wakeLoop = () => {
      if (
        isCancelled ||
        !isInViewportRef.current ||
        !isPageVisibleRef.current ||
        isReducedMotionRef.current
      ) {
        return;
      }
      if (sliderState.current.rafId === 0) {
        sliderState.current.rafId = requestAnimationFrame(step);
      }
    };

    wakeLoopRef.current = wakeLoop;
    updateTrackBoundsCache();

    // Viewport visibility observer: trigger intro on first entry & pause/resume RAF/WebGL cleanly
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isInViewportRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          if (!introState.current.hasStarted && !isReducedMotionRef.current) {
            introState.current.hasStarted = true;
            introState.current.isIntroPlaying = true;
            introState.current.startTime = performance.now();

            const initialOffset = Math.min(window.innerWidth * 0.95, 1150);
            introState.current.initialOffset = initialOffset;
            sliderState.current.currentPosition = initialOffset;
            sliderState.current.targetPosition = 0;
            transitionUntilRef.current = performance.now() + 1850;
            setIsRevealed(true);
          }
          updateTrackBoundsCache();
          wakeLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(sectionEl);

    // Tab visibility observer: pause animation/GPU work while tab is hidden
    const handleVisibilityChange = () => {
      isPageVisibleRef.current = document.visibilityState !== 'hidden';
      if (!isPageVisibleRef.current) {
        stopLoop();
      } else if (isInViewportRef.current) {
        wakeLoop();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Track width ResizeObserver keeps endPoint cache fresh without per-frame DOM reads
    let listResizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && listRef.current) {
      listResizeObserver = new ResizeObserver(() => {
        updateTrackBoundsCache();
        wakeLoop();
      });
      listResizeObserver.observe(listRef.current);
    }

    const handleWindowResize = () => {
      updateTrackBoundsCache();
      wakeLoop();
    };
    window.addEventListener('resize', handleWindowResize, { passive: true });

    let hasInitializedWebGL = false;
    const initEffects = async () => {
      if (hasInitializedWebGL) return;
      hasInitializedWebGL = true;
      try {
        if (prefersReduced) return;

        const gpu = await probeGpuCapabilities();
        if (isCancelled || !containerRef.current) return;

        const validImages = imageRefs.current.filter(Boolean) as HTMLImageElement[];
        if (validImages.length > 0 && gpu.canUseStudioWebGL) {
          rendererRef.current = new StudioRenderer(containerRef.current, validImages, {
            getTrackX: () => sliderState.current.currentPosition,
            onNeedsRender: () => wakeLoopRef.current(),
          });
          wakeLoop();
        }
      } catch {
        // Fallback gracefully to high-performance styled HTML/CSS image layer
      }
    };

    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          preloadObserver.disconnect();
          initEffects();
        }
      },
      { rootMargin: '400px 0px', threshold: 0 }
    );
    preloadObserver.observe(sectionEl);

    // Native non-passive wheel listener so Shift+Wheel & horizontal trackpad swipes
    // move Studio horizontally while calling preventDefault(), whereas normal vertical
    // wheel events pass straight through to native vertical page scrolling.
    const containerEl = containerRef.current;
    const handleNativeWheel = (e: WheelEvent) => {
      if (currentActiveRef.current >= 0 || !listRef.current) return;

      const intent = resolveStudioWheelIntent({
        deltaX: e.deltaX,
        deltaY: e.deltaY,
        shiftKey: e.shiftKey,
      });

      if (intent.mode !== 'horizontal') {
        return;
      }

      if (intent.shouldPreventDefault && e.cancelable) {
        e.preventDefault();
      }

      if (introState.current.isIntroPlaying) {
        introState.current.isIntroPlaying = false;
        introState.current.isComplete = true;
      }

      updateTrackBoundsCache();
      const endPoint = Math.max(0, cachedBoundsRef.current.endPoint);
      const nextTarget = sliderState.current.targetPosition - intent.delta * 1.5;
      sliderState.current.targetPosition = Math.max(-endPoint, Math.min(0, nextTarget));
      wakeLoopRef.current();
    };

    if (containerEl) {
      containerEl.addEventListener('wheel', handleNativeWheel, { passive: false });
    }

    return () => {
      isCancelled = true;
      stopLoop();
      if (dragEndTimerRef.current !== null) {
        clearTimeout(dragEndTimerRef.current);
        dragEndTimerRef.current = null;
      }
      if (containerEl) {
        containerEl.removeEventListener('wheel', handleNativeWheel);
      }
      preloadObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleWindowResize);
      if (listResizeObserver) {
        listResizeObserver.disconnect();
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
    };
  }, [updateTrackBoundsCache]);

  return (
    <section
      id="studio"
      ref={sectionRef}
      className="relative w-full min-h-[78vh] sm:min-h-[84vh] mt-6 sm:mt-10 mb-6 sm:mb-10 flex flex-col justify-center overflow-hidden select-none"
      aria-label="Studio Showcase"
    >
      {/* Section Header: Minimalist Editorial Marker */}
      <div
        className="w-full px-6 sm:px-12 md:px-16 mb-4 sm:mb-8 flex flex-row items-center justify-between pointer-events-none transition-all duration-700"
        style={{
          opacity: isRevealed || isReducedMotion ? 1 : 0,
          transform:
            isRevealed || isReducedMotion
              ? 'translate3d(0, 0, 0)'
              : 'translate3d(0, -12px, 0)',
        }}
      >
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
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className={`relative w-full h-[75vh] flex flex-col justify-center select-none touch-pan-y overflow-hidden focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/50 ${
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
              isRevealed={isRevealed}
              isReducedMotion={isReducedMotion}
              onToggleActive={toggleActiveItem}
            />
          ))}
        </ul>

        {/* Expanded Project Details Overlay */}
        {currentActive !== -1 && projects[currentActive] && (
          <StudioDetails
            project={projects[currentActive]}
            index={currentActive}
            onClose={handleCloseDetails}
          />
        )}
      </div>

      {/* Subtle Drag Prompt Hint */}
      <div
        className={`w-full text-center mt-3 sm:mt-5 transition-opacity duration-500 pointer-events-none ${
          currentActive >= 0 ? 'opacity-0' : 'opacity-40'
        }`}
      >
        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-white/60">
          &larr; Drag, Shift+Scroll, or Use Arrow Keys to Explore &rarr;
        </span>
      </div>
    </section>
  );
});

StudioSection.displayName = 'StudioSection';

export default StudioSection;
