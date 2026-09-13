import React, { forwardRef } from 'react';
import type { StudioProject } from '../../types';

interface StudioItemProps {
  project: StudioProject;
  index: number;
  isActive: boolean;
  isAmbient: boolean;
  isDragging: boolean;
  isDetailsOpen: boolean;
  onToggleActive: (index: number) => void;
  imageRef: (el: HTMLImageElement | null) => void;
}

export const StudioItem = forwardRef<HTMLLIElement, StudioItemProps>(
  (
    {
      project,
      index,
      isActive,
      isAmbient,
      isDragging,
      isDetailsOpen,
      onToggleActive,
      imageRef,
    },
    ref
  ) => {
    const formattedIndex = index < 9 ? `0${index + 1}` : `${index + 1}`;

    return (
      <li
        ref={ref}
        className="list-none flex-shrink-0 h-full flex items-center justify-center relative select-none"
      >
        <div
          onClick={() => {
            if (!isDragging) {
              onToggleActive(index);
            }
          }}
          className={`relative inline-flex flex-col justify-end overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group ${
            isActive
              ? 'h-[60vh] w-[82vw] sm:w-[65vw] md:w-[50vw] mr-[8vw] sm:mr-[16vw] ml-[5vw] sm:ml-[10vw] z-10'
              : isAmbient
              ? 'h-[42vh] sm:h-[45vh] w-[70vw] sm:w-[35vw] md:w-[23vw] mr-[4vw] sm:mr-[6vw] opacity-25'
              : 'h-[52vh] sm:h-[55vh] w-[75vw] sm:w-[40vw] md:w-[25vw] lg:w-[23vw] mr-[5vw] sm:mr-[6vw] hover:brightness-110'
          }`}
        >
          {/* Image wrapper - Synchronized with WebGL ImageMesh */}
          <div
            className={`relative overflow-hidden h-full z-[1] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-[0_12px_36px_rgba(0,0,0,0.6)] ${
              isActive ? 'w-full mr-0' : 'w-[85%] mr-[15%]'
            }`}
          >
            <img
              ref={imageRef}
              src={project.image}
              alt={`${project.title} cover`}
              draggable="false"
              className="absolute top-1/2 left-1/2 w-[110%] h-[110%] -translate-x-1/2 -translate-y-1/2 object-cover transition-opacity duration-500 opacity-60"
            />
            {/* Subtle dark vignette overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
          </div>

          {/* Top Right: Item Index */}
          <div
            className={`absolute top-[4vh] right-0 z-[2] text-right pointer-events-none transition-opacity duration-300 ${
              isDetailsOpen || isDragging ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <span className="font-mono text-xs sm:text-sm tracking-[0.2em] text-white/70 block">
              {formattedIndex}
            </span>
          </div>

          {/* Bottom Right: Title & View Button */}
          <div
            className={`absolute bottom-[6vh] sm:bottom-[8vh] right-0 z-[2] text-right flex flex-col justify-end items-end pointer-events-none transition-opacity duration-300 ${
              isDetailsOpen || isDragging ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <h2
              className="text-[6.5vw] sm:text-[4vw] md:text-[2.6vw] font-normal leading-[1.05] text-white lowercase tracking-wide max-w-[280px] sm:max-w-[320px] transition-transform duration-500 group-hover:-translate-x-1"
              style={{ fontFamily: 'var(--title-font)' }}
            >
              {project.title}
            </h2>

            <div className="mt-3 pointer-events-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleActive(index);
                }}
                className="relative group/btn inline-flex items-center text-[11px] sm:text-xs tracking-[0.22em] uppercase text-white/90 font-medium py-1 px-1 transition-colors hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
                style={{ fontFamily: 'var(--body-font)' }}
              >
                <span>View</span>
                <span className="absolute bottom-0 left-1 right-1 h-[1px] bg-white/40 group-hover/btn:bg-cyan-400 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </li>
    );
  }
);

StudioItem.displayName = 'StudioItem';
