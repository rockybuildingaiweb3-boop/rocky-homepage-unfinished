import React, { useState, useRef, useEffect } from 'react';
import { getGPUTier } from 'detect-gpu';
import { isWebGLAvailable } from '../../utils';
import { ImageRenderer } from '../../effects/work-slider/renderer';
import { WorkItem } from '../../types';
import { useWorkSliderPhysics } from './useWorkSliderPhysics';

export interface WorkSliderProps {
  workData: WorkItem[];
  onActiveChange?: (hasActiveProject: boolean) => void;
}

// ─── Subcomponent: WorkProgressBar ───
interface WorkProgressBarProps {
  sliderProgress: number;
  currentSlideIndex: number;
  totalItems: number;
  hidden: boolean;
}

const WorkProgressBar: React.FC<WorkProgressBarProps> = ({
  sliderProgress,
  currentSlideIndex,
  totalItems,
  hidden,
}) => (
  <div
    className={`w-full max-w-7xl mx-auto px-6 sm:px-12 mb-6 sm:mb-8 flex items-center justify-between select-none transition-all duration-500 ${
      hidden ? 'opacity-0 pointer-events-none -translate-y-2' : 'opacity-100 translate-y-0'
    }`}
    aria-hidden={hidden}
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
        {totalItems < 10 ? `0${totalItems}` : totalItems}
      </span>
    </div>
  </div>
);

// ─── Subcomponent: WorkCard ───
interface WorkCardProps {
  item: WorkItem;
  index: number;
  isActive: boolean;
  isAmbient: boolean;
  isTextHidden: boolean;
  onSelect: (index: number) => void;
  itemRef: (el: HTMLDivElement | null) => void;
  imgRef: (el: HTMLImageElement | null) => void;
}

const WorkCard: React.FC<WorkCardProps> = ({
  item,
  index,
  isActive,
  isAmbient,
  isTextHidden,
  onSelect,
  itemRef,
  imgRef,
}) => (
  <li>
    <div
      ref={itemRef}
      data-cursor="view"
      role="button"
      tabIndex={0}
      aria-expanded={isActive}
      aria-label={`View project details for ${item.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(index);
        }
      }}
      className={`list-item clickable passive ${isActive ? 'active' : ''} ${
        isAmbient ? 'ambient' : ''
      }`}
      onClick={() => onSelect(index)}
    >
      <div className="img-wrapper">
        <img
          ref={imgRef}
          src={item.image || `/assets/imgs/work-back/${item.id}/cover.jpg`}
          alt={`${item.title} Background`}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
        />
      </div>

      <div className={`text-top-wrapper ${isTextHidden ? 'hidden' : ''}`}>
        <p className="item-index font-mono">
          {index < 9 ? `0${index + 1}` : `${index + 1}`}
        </p>
      </div>

      <div className={`text-wrapper ${isTextHidden ? 'hidden' : ''}`}>
        <h1 className="item-title">{item.title}</h1>
        <div className="inline-wrapper">
          <button
            type="button"
            className="button item-link interactive"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(index);
            }}
          >
            view &rarr;
          </button>
        </div>
      </div>
    </div>
  </li>
);

// ─── Subcomponent: WorkProjectDetails ───
interface WorkProjectDetailsProps {
  item: WorkItem;
  index: number;
  onClose: () => void;
}

const WorkProjectDetails: React.FC<WorkProjectDetailsProps> = ({
  item,
  index,
  onClose,
}) => (
  <div className="details-container">
    <div className="wrapper">
      <div className="top-align">
        <div className="wrapper">
          <div className="index font-mono">
            {index < 9 ? `0${index + 1}` : index + 1}
          </div>
          <span className="line" />
          <h6 className="caption font-mono">{item.details.summary}</h6>
        </div>
      </div>

      <div className="mid-align">
        <h1 className="title breakTitleWords">{item.title}</h1>
        <button
          type="button"
          data-cursor="pointer"
          className="close-button-wrapper interactive"
          onClick={onClose}
          aria-label="Close project view"
        >
          <div className="close-button">&times;</div>
        </button>
      </div>

      <div className="bottom-align">
        <div>
          <p className="paragraph">{item.details.description}</p>
        </div>

        <div className="roles">
          <span className="line" />
          <div className="wrapper">
            {item.roles.map((role, idx) => (
              <span key={`role-${idx}`} className="role font-mono">
                {role}
              </span>
            ))}
          </div>
        </div>

        <div className="links flex items-center gap-3 flex-wrap">
          {item.links?.map((link, idx) => (
            <a
              key={`link-${idx}`}
              href={link.link}
              target="_blank"
              rel="noreferrer"
              data-cursor="pointer"
              className="button link-wrapper interactive text-purple-300 hover:text-white transition-colors py-1.5"
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
);

/**
 * WorkSlider
 * Homepage spatial horizontal project slider:
 * - Decoupled slider physics with WebGL Three.js image distortion effect
 * - Strict 8px drag threshold vs click activation
 * - Full keyboard navigation (Enter/Space to view, Escape to dismiss)
 */
export const WorkSlider: React.FC<WorkSliderProps> = ({ workData, onActiveChange }) => {
  const [currentActive, setCurrentActive] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const rendererRef = useRef<ImageRenderer | null>(null);

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
  } = useWorkSliderPhysics({
    itemCount: workData.length,
    currentActive,
    setCurrentActive,
    listRef,
    itemRefs,
  });

  useEffect(() => {
    if (onActiveChange) {
      onActiveChange(currentActive >= 0);
    }
  }, [currentActive, onActiveChange]);

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
      }
      rendererRef.current = null;
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
      <WorkProgressBar
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
                <WorkCard
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
          <WorkProjectDetails
            item={workData[currentActive]}
            index={currentActive}
            onClose={() => toggleActiveItem(currentActive)}
          />
        )}
      </div>
    </div>
  );
};

export default WorkSlider;
