import React, { useState, useRef, useEffect } from 'react';
import { getGPUTier } from 'detect-gpu';
import { isWebGLAvailable } from '../../../utils';
import { ImageRenderer } from '../../../effects/work-slider/renderer';
import { StudioProjectsProps } from '../types';
import { useStudioSliderPhysics } from '../hooks/useStudioSliderPhysics';
import { StudioProgressBar } from '../components/StudioProgressBar';
import { StudioCard } from '../components/StudioCard';
import { StudioProjectDetails } from '../components/StudioProjectDetails';

/**
 * StudioProjects
 * Modular Studio orchestration layer:
 * - Decouples slider physics (useStudioSliderPhysics) from presentation (StudioCard, StudioProjectDetails, StudioProgressBar)
 * - Retains WebGL Three.js image distortion effect via ImageRenderer
 * - Strict 8px drag threshold vs click activation
 * - Full keyboard navigation (Enter/Space to view, Escape to dismiss)
 */
export const StudioProjects: React.FC<StudioProjectsProps> = ({ workData, onActiveChange }) => {
  const [currentActive, setCurrentActive] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const rendererRef = useRef<ImageRenderer | null>(null);

  // Modular slider physics & touch/mouse interaction hook
  const {
    isDragging,
    sliderProgress,
    currentSlideIndex,
    getSpeed,
    handleMouseDown,
    handleTouchStart,
    handleWheel,
    handleMouseUp,
    toggleActiveItem,
    canClickItem,
  } = useStudioSliderPhysics({
    itemCount: workData.length,
    currentActive,
    setCurrentActive,
    listRef,
    itemRefs,
  });

  // Notify parent of active state changes (e.g. hides studio section header)
  useEffect(() => {
    if (onActiveChange) {
      onActiveChange(currentActive >= 0);
    }
  }, [currentActive, onActiveChange]);

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
              getSpeed
            );
          }
        }
      } catch {
        // Fallback: graceful 2D CSS rendering
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
  }, [workData, getSpeed]);

  const handleCardSelect = (index: number) => {
    if (canClickItem()) {
      toggleActiveItem(index);
    }
  };

  return (
    <div className="work-click-area relative w-full" ref={containerRef}>
      {/* Dynamic Progress & Navigation Bar */}
      <StudioProgressBar
        sliderProgress={sliderProgress}
        currentSlideIndex={currentSlideIndex}
        totalItems={workData.length}
        hidden={currentActive >= 0}
      />

      {/* Interactive slider content wrapper */}
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
          <ul ref={listRef} className={`work-list ${isDragging ? 'hold' : ''}`}>
            {workData.map((item, i) => {
              const isActive = currentActive === i;
              const isAmbient = currentActive >= 0 && !isActive;
              const isTextHidden = currentActive >= 0 || isDragging;

              return (
                <StudioCard
                  key={item.id}
                  item={item}
                  index={i}
                  isActive={isActive}
                  isAmbient={isAmbient}
                  isTextHidden={isTextHidden}
                  onSelect={handleCardSelect}
                  itemRef={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  imgRef={(el) => {
                    imgRefs.current[i] = el;
                  }}
                />
              );
            })}
          </ul>
        </div>

        {/* Active Project Details Expansion */}
        {currentActive !== -1 && workData[currentActive] && (
          <StudioProjectDetails
            item={workData[currentActive]}
            index={currentActive}
            onClose={() => toggleActiveItem(currentActive)}
          />
        )}
      </div>
    </div>
  );
};
