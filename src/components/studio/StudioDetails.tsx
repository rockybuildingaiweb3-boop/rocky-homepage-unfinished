import React, { useEffect, useState } from 'react';
import type { StudioProject } from '../../types';

interface StudioDetailsProps {
  project: StudioProject;
  index: number;
  onClose: () => void;
}

export const StudioDetails: React.FC<StudioDetailsProps> = ({
  project,
  index,
  onClose,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger entry animations smoothly
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const formattedIndex = index < 9 ? `0${index + 1}` : `${index + 1}`;

  return (
    <div
      className="absolute inset-0 z-20 w-full h-full flex flex-row justify-between box-border px-[6vw] sm:px-[10vw] md:px-[14vw] py-[6vh] pointer-events-none transition-opacity duration-700 select-none"
      style={{ opacity: mounted ? 1 : 0 }}
      aria-label={`${project.title} details`}
    >
      <div className="relative flex flex-col justify-between w-full h-full text-left pointer-events-auto">
        {/* Top align: Index, Line, and Caption */}
        <div className="w-full">
          <div className="inline-flex flex-row items-center justify-start gap-4 sm:gap-8 w-full max-w-xl">
            <div className="overflow-hidden">
              <span
                className="font-mono text-sm sm:text-base md:text-lg tracking-widest text-white/90 block transition-transform duration-700 ease-out"
                style={{
                  transform: mounted ? 'translate3d(0, 0, 0)' : 'translate3d(0, 100%, 0)',
                }}
              >
                {formattedIndex}
              </span>
            </div>

            <div className="flex-grow h-[1px] bg-white/40 max-w-[120px] sm:max-w-[200px]" />

            <div className="overflow-hidden">
              <span
                className="uppercase text-xs sm:text-sm md:text-base tracking-widest text-white/70 block transition-transform duration-700 ease-out delay-75"
                style={{
                  fontFamily: 'var(--body-font)',
                  transform: mounted ? 'translate3d(0, 0, 0)' : 'translate3d(0, 100%, 0)',
                }}
              >
                {project.details.summary || project.category}
              </span>
            </div>
          </div>
        </div>

        {/* Mid align: Massive Editorial Title and Close Button */}
        <div className="relative flex flex-row items-start sm:items-center justify-between my-auto py-4">
          <div className="overflow-hidden max-w-[80vw] sm:max-w-[70vw]">
            <h1
              className="text-[12vw] sm:text-[9vw] md:text-[7vw] font-normal leading-[1.0] text-white lowercase transition-transform duration-700 ease-out delay-100 break-words"
              style={{
                fontFamily: 'var(--title-font)',
                transform: mounted ? 'translate3d(0, 0, 0)' : 'translate3d(0, 100%, 0)',
              }}
            >
              {project.title}
            </h1>
          </div>

          <button
            onClick={onClose}
            className="group cursor-pointer p-2 -mr-2 sm:mr-0 text-white/80 hover:text-white transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-full"
            aria-label="Close project view"
          >
            <span
              className="text-4xl sm:text-5xl md:text-6xl font-extralight block leading-none transition-transform duration-300 group-hover:scale-110 group-hover:rotate-90"
              style={{
                transform: mounted ? 'translate3d(0, 0, 0)' : 'translate3d(0, 100%, 0)',
              }}
            >
              &times;
            </span>
          </button>
        </div>

        {/* Bottom align: 3-column metadata layout (Description, Roles, Links) */}
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6 sm:gap-8 md:gap-12">
          {/* Column 1: Paragraph */}
          <div className="md:flex-1 max-w-lg overflow-hidden">
            <p
              className="text-xs sm:text-sm md:text-base text-white/80 font-light leading-relaxed transition-transform duration-700 ease-out delay-150"
              style={{
                fontFamily: 'var(--body-font)',
                transform: mounted ? 'translate3d(0, 0, 0)' : 'translate3d(0, 100%, 0)',
              }}
            >
              {project.details.description}
            </p>
          </div>

          {/* Column 2: Roles */}
          <div className="overflow-hidden">
            <div
              className="transition-transform duration-700 ease-out delay-200"
              style={{
                transform: mounted ? 'translate3d(0, 0, 0)' : 'translate3d(0, 100%, 0)',
              }}
            >
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/50 mb-2 font-mono">
                Role
              </p>
              <ul className="list-none m-0 p-0 space-y-1">
                {project.roles.map((role, rIdx) => (
                  <li
                    key={rIdx}
                    className="text-xs sm:text-sm tracking-wider uppercase text-white/90 font-light"
                    style={{ fontFamily: 'var(--body-font)' }}
                  >
                    + {role}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Links */}
          <div className="overflow-hidden flex flex-row md:flex-col items-start md:items-end gap-3 sm:gap-4">
            {project.links && project.links.length > 0 ? (
              project.links.map((link, lIdx) => (
                <a
                  key={lIdx}
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center text-xs sm:text-sm uppercase tracking-[0.18em] text-white font-medium py-1 transition-transform duration-700 ease-out delay-300 hover:text-cyan-300"
                  style={{
                    fontFamily: 'var(--body-font)',
                    transform: mounted ? 'translate3d(0, 0, 0)' : 'translate3d(0, 100%, 0)',
                  }}
                >
                  <span>{link.text}</span>
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white transition-transform duration-300 origin-left scale-x-100 group-hover:scale-x-0" />
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-cyan-400 transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100" />
                </a>
              ))
            ) : (
              <span className="text-xs uppercase tracking-widest text-white/50">
                In Production
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
