import React, { useState } from 'react';
import { WorkItem } from '../../types';
import { WorkSlider } from './WorkSlider';

export interface WorkSectionProps {
  workData: WorkItem[];
}

/**
 * WorkSection
 * 
 * Cinematic Selected Work exhibition on the homepage.
 * Direct owner of the in-page showcase:
 * - Section header with active project dismissal animation
 * - Horizontal spatial project slider with Three.js WebGL distortion (WorkSlider)
 */
export const WorkSection: React.FC<WorkSectionProps> = ({ workData }) => {
  const [hasActiveProject, setHasActiveProject] = useState<boolean>(false);

  return (
    <section
      id="work"
      className="studio-section relative w-full overflow-hidden pt-24 sm:pt-32 pb-20 select-none"
      aria-label="Selected Work Showcase"
    >
      {/* Header */}
      <div
        className={`w-full max-w-7xl mx-auto px-6 sm:px-12 mb-8 sm:mb-12 transition-all duration-500 ${
          hasActiveProject ? 'opacity-0 pointer-events-none -translate-y-4' : 'opacity-100 translate-y-0'
        }`}
        aria-hidden={hasActiveProject}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="font-mono text-[11px] sm:text-xs tracking-[0.26em] uppercase text-purple-200/70">
                SELECTED WORK
              </span>
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-normal lowercase tracking-[-0.035em] text-white"
              style={{ fontFamily: 'var(--title-font)' }}
            >
              featured projects
            </h2>
          </div>
        </div>
      </div>

      {/* Spatial Horizontal Slider */}
      <WorkSlider
        workData={workData}
        onActiveChange={setHasActiveProject}
      />
    </section>
  );
};

export default WorkSection;
