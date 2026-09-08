import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getGPUTier } from 'detect-gpu';
import { WorkItem } from '../types';
import { lerp } from '../utils';
import { ImageRenderer } from '../effects/work-slider/renderer';

interface WorkSectionProps {
  workData: WorkItem[];
  onSelectDestination?: (destination: string, item: WorkItem) => void;
}

/**
 * WorkSection
 * Strictly based on Musab-Hassan/musabhassan.com:
 * - Clean spacious margin: margin-top: 30vh;
 * - Horizontal drag slider with 5000 offsetSpeed and DOMMatrix interpolation
 * - Card hold compression: .hold .list-item collapses from 55vh to 45vh with smooth easing
 * - Active project expansion: centers active item, expands to 50vw × 60vh, non-active become ambient (45vh)
 * - Details layout: top-align (index + line + summary), mid-align (title + close button), bottom-align (paragraph + roles + links)
 * - Zero artificial clutter or cramped banners
 */
export const WorkSection: React.FC<WorkSectionProps> = ({
  workData,
  onSelectDestination,
}) => {
  const [currentActive, setCurrentActive] = useState<number>(-1);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const rendererRef = useRef<ImageRenderer | null>(null);
  const dragDistanceRef = useRef<number>(0);

  // Slider physics state strictly mirroring Musab's WorkSlider class
  const sliderState = useRef({
    currentMouseX: 0,
    initialMouseX: 0,
    currentPosition: 0,
    targetPosition: 0,
    initialPosition: 0,
    offsetSpeed: 5000,
    lerpSpeed: 0.1,
    speed: 0,
    active: false,
  });

  const animFrameRef = useRef<number | null>(null);

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

    dragDistanceRef.current = 0;
    sliderState.current.initialMouseX = e.clientX;
    sliderState.current.currentMouseX = e.clientX;
    sliderState.current.active = true;
    setIsDragging(true);

    if (listRef.current) {
      const style = window.getComputedStyle(listRef.current);
      const transform =
        style.transform === 'none' ? 'matrix(1, 0, 0, 1, 0, 0)' : style.transform;
      const matrix = new DOMMatrix(transform);
      sliderState.current.initialPosition = matrix.m41;
    }
  };

  // Mouse drag: onRelease
  const handleMouseUp = useCallback(() => {
    sliderState.current.active = false;
    setIsDragging(false);
  }, []);

  // Mouse drag: onMouseMove
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!sliderState.current.active) return;
    dragDistanceRef.current += Math.abs(e.movementX || 0);
    sliderState.current.currentMouseX = e.clientX;
    const diff =
      (sliderState.current.currentMouseX - sliderState.current.initialMouseX) * -1;
    sliderState.current.targetPosition =
      Math.round(
        (sliderState.current.initialPosition -
          sliderState.current.offsetSpeed * (diff / document.body.clientWidth)) *
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

    dragDistanceRef.current = 0;
    const clientX = e.touches[0].clientX;
    sliderState.current.initialMouseX = clientX;
    sliderState.current.currentMouseX = clientX;
    sliderState.current.active = true;
    setIsDragging(true);

    if (listRef.current) {
      const style = window.getComputedStyle(listRef.current);
      const transform =
        style.transform === 'none' ? 'matrix(1, 0, 0, 1, 0, 0)' : style.transform;
      const matrix = new DOMMatrix(transform);
      sliderState.current.initialPosition = matrix.m41;
    }
  };

  // Touch drag: onTouchMove
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!sliderState.current.active) return;
    const clientX = e.touches[0].clientX;
    dragDistanceRef.current += Math.abs(clientX - sliderState.current.currentMouseX);
    sliderState.current.currentMouseX = clientX;
    const diff =
      (sliderState.current.currentMouseX - sliderState.current.initialMouseX) * -1;
    sliderState.current.targetPosition =
      Math.round(
        (sliderState.current.initialPosition -
          sliderState.current.offsetSpeed * (diff / document.body.clientWidth)) *
          100
      ) / 100;
  }, []);

  // Wheel horizontal navigation
  const handleWheel = (e: React.WheelEvent) => {
    if (currentActive >= 0) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) > 2) {
      sliderState.current.targetPosition -= delta * 1.5;
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
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove]);

  // Main animation loop with lerp and boundary checks
  useEffect(() => {
    const loop = () => {
      if (listRef.current) {
        if (currentActive < 0) {
          let endPoint = listRef.current.offsetWidth - document.body.clientWidth;
          if (endPoint < 0) endPoint = listRef.current.offsetWidth;
          // Boundary checks
          if (sliderState.current.targetPosition > 0) {
            sliderState.current.targetPosition = 0;
          }
          if (sliderState.current.targetPosition <= -endPoint) {
            sliderState.current.targetPosition = -endPoint;
          }
        }

        // Lerp easing
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
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [currentActive]);

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

        // Exactly matching Musab-Hassan's condition: tier >= 2, not mobile, fps >= 30
        const canRunThree =
          gpuTier.tier >= 2 && !gpuTier.isMobile && (gpuTier.fps ?? 60) >= 30;

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
      } catch (err) {
        console.warn('Three.js work image renderer fallback:', err);
      }
    }

    const timer = setTimeout(initImageRenderer, 150);

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
      id="work"
      className="work-click-area"
      ref={containerRef}
    >
      <div
        ref={contentWrapperRef}
        className={`content-wrapper ${isDragging ? 'is-dragging' : ''} ${
          currentActive >= 0 ? 'disabled' : ''
        }`}
        role="listbox"
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
                    className={`list-item clickable passive ${
                      isActive ? 'active' : ''
                    } ${isAmbient ? 'ambient' : ''}`}
                    onClick={() => {
                      if (!isDragging && dragDistanceRef.current < 6) {
                        toggleActiveItem(i);
                      }
                    }}
                  >
                    {/* Image Wrapper */}
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

                    {/* Top Text: 01, 02... */}
                    <div
                      className={`text-top-wrapper ${
                        isTextHidden ? 'hidden' : ''
                      }`}
                    >
                      <p className="item-index">
                        {i < 9 ? `0${i + 1}` : `${i + 1}`}
                      </p>
                    </div>

                    {/* Bottom Text: Project Title + 'view' button */}
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
                          view
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Active Work Item Details (When a work item is clicked) */}
        {currentActive !== -1 && workData[currentActive] && (
          <div className="details-container">
            <div className="wrapper">
              {/* Top Align: Index + Line + Summary Caption */}
              <div className="top-align">
                <div className="wrapper">
                  <div className="index">
                    {currentActive < 9
                      ? `0${currentActive + 1}`
                      : currentActive + 1}
                  </div>
                  <span className="line" />
                  <h6 className="caption">
                    {workData[currentActive].details.summary}
                  </h6>
                </div>
              </div>

              {/* Mid Align: Big Title + Close Button */}
              <div className="mid-align">
                <h1 className="title breakTitleWords">
                  {workData[currentActive].title}
                </h1>
                <button
                  type="button"
                  className="close-button-wrapper interactive"
                  onClick={() => toggleActiveItem(currentActive)}
                  aria-label="Close project view"
                >
                  <div className="close-button">&times;</div>
                </button>
              </div>

              {/* Bottom Align: Description + Roles + Links */}
              <div className="bottom-align">
                <div>
                  <p className="paragraph">
                    {workData[currentActive].details.description}
                  </p>
                </div>

                <div className="roles">
                  <div className="wrapper">
                    <p className="descriptor">Role</p>
                    <ul>
                      {workData[currentActive].roles.map((role) => (
                        <li key={role}>{`+ ${role}`}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <div className="links">
                    {workData[currentActive].links?.map((link) => (
                      <a
                        key={link.link}
                        href={link.link}
                        target="_blank"
                        rel="noreferrer"
                        className="button"
                      >
                        {link.text}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
