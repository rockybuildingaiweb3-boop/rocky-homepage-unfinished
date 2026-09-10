import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getGPUTier } from 'detect-gpu';
import { lerp, isWebGLAvailable } from '../../../utils';
import { ImageRenderer } from '../../../effects/work-slider/renderer';
import { StudioProjectsProps } from '../types';

/**
 * StudioProjects
 * Modular Studio implementation based on Musab-Hassan/musabhassan.com:
 * - Clean spacious margin and responsive sizing
 * - Horizontal drag slider with physics interpolation
 * - Card hold compression (.hold .list-item) with smooth easing
 * - Active project expansion: centers active item, expands to 50vw × 60vh
 * - Details layout: top-align (index + line + summary), mid-align (title + close button), bottom-align (paragraph + roles + links)
 * - Separation between drag gesture and click activation (threshold 8px)
 * - Full keyboard accessibility (Enter/Space to activate, Escape to close)
 */
export const StudioProjects: React.FC<StudioProjectsProps> = ({ workData, onActiveChange }) => {
  const [currentActive, setCurrentActive] = useState<number>(-1);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [sliderProgress, setSliderProgress] = useState<number>(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const rendererRef = useRef<ImageRenderer | null>(null);
  const pointerStartRef = useRef({ x: 0, y: 0, time: 0 });
  const lastPointerRef = useRef({ x: 0, time: 0 });
  const velocityRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const isDragConfirmedRef = useRef(false);
  const hasJustDraggedRef = useRef(false);
  const sliderProgressRef = useRef(0);

  // Slider physics state strictly mirroring Musab's WorkSlider class
  const sliderState = useRef({
    currentMouseX: 0,
    initialMouseX: 0,
    currentPosition: 0,
    targetPosition: 0,
    initialPosition: 0,
    offsetSpeed: 1920,
    lerpSpeed: 0.1,
    speed: 0,
    active: false,
  });

  const animFrameRef = useRef<number | null>(null);

  // Notify parent of active state changes
  useEffect(() => {
    if (onActiveChange) {
      onActiveChange(currentActive >= 0);
    }
  }, [currentActive, onActiveChange]);

  // Mouse drag: onHold
  const handleMouseDown = (e: React.MouseEvent) => {
    if (currentActive >= 0 || sliderState.current.active) return;
    const target = e.target as HTMLElement;
    if (
      target.closest('.button') ||
      target.closest('.close-button') ||
      target.closest('.close-button-wrapper') ||
      target.closest('a')
    ) {
      return;
    }

    if (e.button !== 0) return;
    e.preventDefault();

    dragDistanceRef.current = 0;
    isDragConfirmedRef.current = false;
    pointerStartRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
    lastPointerRef.current = { x: e.clientX, time: performance.now() };
    velocityRef.current = 0;

    sliderState.current.initialMouseX = e.clientX;
    sliderState.current.currentMouseX = e.clientX;
    const clientWidth = document.body.clientWidth || window.innerWidth;
    sliderState.current.offsetSpeed = clientWidth;
    sliderState.current.active = true;

    sliderState.current.initialPosition = sliderState.current.currentPosition;
    sliderState.current.targetPosition = sliderState.current.currentPosition;
    setIsDragging(true);
  };

  // Mouse drag: onRelease
  const handleMouseUp = useCallback(() => {
    if (!sliderState.current.active) return;

    sliderState.current.active = false;
    setIsDragging(false);

    if (isDragConfirmedRef.current) {
      hasJustDraggedRef.current = true;
      const momentum = velocityRef.current * 160;
      sliderState.current.targetPosition += momentum;
      setTimeout(() => {
        hasJustDraggedRef.current = false;
      }, 100);
    }
  }, []);

  // Mouse drag: onMouseMove
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!sliderState.current.active) return;

    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;
    const dist = Math.hypot(dx, dy);
    dragDistanceRef.current = dist;

    if (dist >= 8) {
      isDragConfirmedRef.current = true;
    }

    const now = performance.now();
    const dt = Math.max(1, now - lastPointerRef.current.time);
    const stepDx = e.clientX - lastPointerRef.current.x;
    const instantVelocity = stepDx / dt;
    velocityRef.current = velocityRef.current * 0.4 + instantVelocity * 0.6;
    lastPointerRef.current = { x: e.clientX, time: now };

    sliderState.current.currentMouseX = e.clientX;
    const diff =
      (sliderState.current.currentMouseX - sliderState.current.initialMouseX) * -1;
    const clientWidth = document.body.clientWidth || window.innerWidth;
    sliderState.current.targetPosition =
      Math.round(
        (sliderState.current.initialPosition -
          sliderState.current.offsetSpeed * (diff / clientWidth)) *
          100
      ) / 100;
  }, []);

  // Touch drag: onTouchStart
  const handleTouchStart = (e: React.TouchEvent) => {
    if (currentActive >= 0 || sliderState.current.active) return;
    const target = e.target as HTMLElement;
    if (
      target.closest('.button') ||
      target.closest('.close-button') ||
      target.closest('.close-button-wrapper') ||
      target.closest('a')
    ) {
      return;
    }

    const touch = e.touches[0];
    dragDistanceRef.current = 0;
    isDragConfirmedRef.current = false;
    pointerStartRef.current = { x: touch.clientX, y: touch.clientY, time: performance.now() };
    lastPointerRef.current = { x: touch.clientX, time: performance.now() };
    velocityRef.current = 0;

    sliderState.current.initialMouseX = touch.clientX;
    sliderState.current.currentMouseX = touch.clientX;
    const clientWidth = document.body.clientWidth || window.innerWidth;
    sliderState.current.offsetSpeed = clientWidth;
    sliderState.current.active = true;

    sliderState.current.initialPosition = sliderState.current.currentPosition;
    sliderState.current.targetPosition = sliderState.current.currentPosition;
    setIsDragging(true);
  };

  // Touch drag: onTouchMove
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!sliderState.current.active) return;
    const touch = e.touches[0];
    const dx = touch.clientX - pointerStartRef.current.x;
    const dy = touch.clientY - pointerStartRef.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDy > absDx && absDy > 10 && !isDragConfirmedRef.current) {
      sliderState.current.active = false;
      setIsDragging(false);
      return;
    }

    if (absDx >= 8) {
      isDragConfirmedRef.current = true;
      if (e.cancelable) e.preventDefault();
    }

    dragDistanceRef.current = Math.hypot(dx, dy);

    const now = performance.now();
    const dt = Math.max(1, now - lastPointerRef.current.time);
    const stepDx = touch.clientX - lastPointerRef.current.x;
    const instantVelocity = stepDx / dt;
    velocityRef.current = velocityRef.current * 0.4 + instantVelocity * 0.6;
    lastPointerRef.current = { x: touch.clientX, time: now };

    sliderState.current.currentMouseX = touch.clientX;
    const diff =
      (sliderState.current.currentMouseX - sliderState.current.initialMouseX) * -1;
    const clientWidth = document.body.clientWidth || window.innerWidth;
    sliderState.current.targetPosition =
      Math.round(
        (sliderState.current.initialPosition -
          sliderState.current.offsetSpeed * (diff / clientWidth)) *
          100
      ) / 100;
  }, []);

  // Trackpad horizontal swipe / Shift+Scroll
  const handleWheel = (e: React.WheelEvent) => {
    if (currentActive >= 0) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
      const delta = Math.abs(e.deltaX) > 0 ? e.deltaX : e.deltaY;
      if (Math.abs(delta) > 2) {
        sliderState.current.targetPosition -= delta * 1.5;
      }
    }
  };

  // Keyboard accessibility: Escape to close details
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && currentActive >= 0) {
        setCurrentActive(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentActive]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleMouseUp);
    window.addEventListener('touchcancel', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('touchcancel', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove]);

  // Main animation loop with lerp and boundary checks
  useEffect(() => {
    const loop = () => {
      if (listRef.current) {
        if (currentActive < 0) {
          const totalWidth = Math.max(listRef.current.scrollWidth, listRef.current.offsetWidth);
          const endPoint = Math.max(0, totalWidth - window.innerWidth);
          if (sliderState.current.targetPosition > 0) {
            sliderState.current.targetPosition = 0;
          }
          if (sliderState.current.targetPosition <= -endPoint) {
            sliderState.current.targetPosition = -endPoint;
          }
        }

        sliderState.current.currentPosition = lerp(
          sliderState.current.currentPosition,
          sliderState.current.targetPosition,
          sliderState.current.lerpSpeed
        );
        sliderState.current.speed =
          Math.round(
            (sliderState.current.currentPosition - sliderState.current.targetPosition) *
              100
          ) / 100;

        listRef.current.style.transform = `translate3d(${
          Math.round(sliderState.current.currentPosition * 100) / 100
        }px, 0px, 0px)`;

        const scrollWidth = listRef.current.scrollWidth || 2400;
        const maxScroll = Math.max(1, scrollWidth - window.innerWidth * 0.75);
        const ratio = Math.min(1, Math.max(0, -sliderState.current.currentPosition / maxScroll));
        const roundedProgress = Math.round(ratio * 100) / 100;
        const slideIdx = Math.min(
          workData.length - 1,
          Math.max(0, Math.floor(ratio * workData.length))
        );

        if (Math.abs(sliderProgressRef.current - roundedProgress) > 0.008) {
          sliderProgressRef.current = roundedProgress;
          setSliderProgress(roundedProgress);
          setCurrentSlideIndex(slideIdx);
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [currentActive, workData.length]);

  // Toggle active project view
  const toggleActiveItem = (index: number) => {
    const newActive = currentActive === index ? -1 : index;
    setCurrentActive(newActive);

    if (newActive >= 0 && itemRefs.current[index]) {
      const targetItem = itemRefs.current[index]!;
      const offsetLeft = targetItem.offsetLeft;
      sliderState.current.targetPosition = -(
        offsetLeft -
        window.innerWidth / 4 +
        window.innerWidth / 10
      );
    }
  };

  // Three.js ImageRenderer setup and GPU capability check
  useEffect(() => {
    let isCancelled = false;

    async function initImageRenderer() {
      const mountContainer = contentWrapperRef.current || containerRef.current;
      if (!mountContainer || workData.length === 0) return;

      try {
        const gpuTier = await getGPUTier();
        if (isCancelled) return;

        const canRunThree =
          (gpuTier.tier >= 1 || isWebGLAvailable()) && !gpuTier.isMobile;

        if (canRunThree && mountContainer) {
          const validImages = imgRefs.current.filter(
            (img): img is HTMLImageElement => Boolean(img && img.src)
          );

          if (validImages.length > 0) {
            if (rendererRef.current) {
              rendererRef.current.destroy();
            }
            rendererRef.current = new ImageRenderer(
              mountContainer,
              validImages,
              () => sliderState.current.speed
            );
          }
        }
      } catch {
        // Fallback: 2D CSS rendering
      }
    }

    const timer = setTimeout(initImageRenderer, 200);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
      if (rendererRef.current) {
        rendererRef.current.destroy();
        rendererRef.current = null;
      }
    };
  }, [workData]);

  return (
    <div
      className="work-click-area relative w-full"
      ref={containerRef}
    >
      {/* Dynamic Progress & Navigation Bar */}
      <div
        className={`w-full max-w-7xl mx-auto px-6 sm:px-12 mb-6 sm:mb-8 flex items-center justify-between select-none transition-all duration-500 ${
          currentActive >= 0 ? 'opacity-0 pointer-events-none -translate-y-2' : 'opacity-100 translate-y-0'
        }`}
        aria-hidden={currentActive >= 0}
      >
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <span className="font-mono text-xs text-white/50 tracking-widest font-light">01</span>
          <span className="hidden sm:inline-block w-4 h-[1px] bg-white/20" />
          <span className="font-mono text-[11px] sm:text-xs tracking-[0.24em] uppercase text-white/40">
            [ ↔ drag to explore ]
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative w-28 sm:w-44 md:w-60 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-purple-500 via-fuchsia-400 to-white transition-all duration-75 ease-out"
              style={{
                width: `${Math.max(10, sliderProgress * 100)}%`,
                boxShadow: '0 0 10px rgba(168, 85, 247, 0.7), 0 0 3px #ffffff',
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <span className="font-mono text-[11px] sm:text-xs tracking-[0.2em] text-white/75 font-medium">
            {currentSlideIndex < 9 ? `0${currentSlideIndex + 1}` : currentSlideIndex + 1}
            <span className="text-white/30 mx-1.5 font-light">/</span>
            {workData.length < 10 ? `0${workData.length}` : workData.length}
          </span>
        </div>
      </div>

      <div
        ref={contentWrapperRef}
        data-cursor="drag"
        className={`content-wrapper ${isDragging ? 'is-dragging' : ''} ${
          currentActive >= 0 ? 'disabled' : ''
        }`}
        role="region"
        aria-label="Interactive project showcase"
        tabIndex={0}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onWheel={handleWheel}
        onMouseLeave={handleMouseUp}
      >
        <div className="w-full h-full overflow-x-hidden">
          <ul
            ref={listRef}
            className={`work-list ${isDragging ? 'hold' : ''}`}
          >
            {workData.map((item, i) => {
              const isActive = currentActive === i;
              const isAmbient = currentActive >= 0 && !isActive;
              const isTextHidden = currentActive >= 0 || isDragging;

              return (
                <li key={item.id}>
                  <div
                    ref={(el) => {
                      itemRefs.current[i] = el;
                    }}
                    data-cursor="view"
                    role="button"
                    tabIndex={0}
                    aria-expanded={isActive}
                    aria-label={`View project details for ${item.title}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleActiveItem(i);
                      }
                    }}
                    className={`list-item clickable passive ${
                      isActive ? 'active' : ''
                    } ${isAmbient ? 'ambient' : ''}`}
                    onClick={(e) => {
                      if (hasJustDraggedRef.current || dragDistanceRef.current >= 8) {
                        e.preventDefault();
                        return;
                      }
                      toggleActiveItem(i);
                    }}
                  >
                    <div className="img-wrapper">
                      <img
                        ref={(el) => {
                          imgRefs.current[i] = el;
                        }}
                        src={item.image || `/assets/imgs/work-back/${item.id}/cover.jpg`}
                        alt={`${item.title} Background`}
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                      />
                    </div>

                    <div
                      className={`text-top-wrapper ${
                        isTextHidden ? 'hidden' : ''
                      }`}
                    >
                      <p className="item-index font-mono">
                        {i < 9 ? `0${i + 1}` : `${i + 1}`}
                      </p>
                    </div>

                    <div
                      className={`text-wrapper ${
                        isTextHidden ? 'hidden' : ''
                      }`}
                    >
                      <h1 className="item-title">{item.title}</h1>
                      <div className="inline-wrapper">
                        <button
                          type="button"
                          className="button item-link interactive"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleActiveItem(i);
                          }}
                        >
                          view &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Active Project Details Expansion */}
        {currentActive !== -1 && workData[currentActive] && (
          <div className="details-container">
            <div className="wrapper">
              <div className="top-align">
                <div className="wrapper">
                  <div className="index font-mono">
                    {currentActive < 9
                      ? `0${currentActive + 1}`
                      : currentActive + 1}
                  </div>
                  <span className="line" />
                  <h6 className="caption font-mono">
                    {workData[currentActive].details.summary}
                  </h6>
                </div>
              </div>

              <div className="mid-align">
                <h1 className="title breakTitleWords">
                  {workData[currentActive].title}
                </h1>
                <button
                  type="button"
                  data-cursor="pointer"
                  className="close-button-wrapper interactive"
                  onClick={() => toggleActiveItem(currentActive)}
                  aria-label="Close project view"
                >
                  <div className="close-button">&times;</div>
                </button>
              </div>

              <div className="bottom-align">
                <div>
                  <p className="paragraph">
                    {workData[currentActive].details.description}
                  </p>
                </div>

                <div className="roles">
                  <span className="line" />
                  <div className="wrapper">
                    {workData[currentActive].roles.map((role, idx) => (
                      <span key={`role-${idx}`} className="role font-mono">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="links">
                  {workData[currentActive].links?.map((link, idx) => (
                    <a
                      key={`link-${idx}`}
                      href={link.link}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="pointer"
                      className="button link-wrapper interactive text-purple-300 hover:text-white transition-colors"
                    >
                      <span className="link-title font-mono uppercase tracking-wider text-xs">
                        {link.text} &rarr;
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
