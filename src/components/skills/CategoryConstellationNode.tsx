import React, { memo } from 'react';
import { CategoryConstellationCluster } from '../../features/skills/constellationLayout';
import { TechLogo } from './TechLogo';

interface CategoryConstellationNodeProps {
  cluster: CategoryConstellationCluster;
  isHovered: boolean;
  isRecessed: boolean;
  onSelectCategory: (categoryId: string) => void;
  onHoverCategory: (categoryId: string) => void;
  onLeaveCategory: () => void;
}

/**
 * CategoryConstellationNode
 *
 * Level 1 Constellation Nucleus representing one of the 8 technological disciplines.
 * Features:
 * - Spherical luminous nucleus with 3D radial shading and authentic flagship technology logo
 * - 3 orbiting micro-moon satellites carrying core/supporting authentic logos
 * - Delicate SVG constellation geometry connecting the nucleus to its satellites
 * - Clear category number, discipline title, and total technology count (11)
 * - In Level 2/3 (when another category is expanded), transitions into a compact
 *   peripheral satellite on the outer horizon so users can switch constellations effortlessly.
 */
export const CategoryConstellationNode: React.FC<CategoryConstellationNodeProps> = memo(({
  cluster,
  isHovered,
  isRecessed,
  onSelectCategory,
  onHoverCategory,
  onLeaveCategory,
}) => {
  // Deterministic satellite offsets around the nucleus (in px)
  const satelliteOffsets = [
    { x: -36, y: -22 },
    { x: 38, y: -16 },
    { x: 26, y: 30 },
  ];

  if (isRecessed) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelectCategory(cluster.id);
        }}
        onMouseEnter={() => onHoverCategory(cluster.id)}
        onMouseLeave={onLeaveCategory}
        onFocus={() => onHoverCategory(cluster.id)}
        onBlur={onLeaveCategory}
        aria-label={`Switch to ${cluster.title} constellation (${cluster.skills.length} technologies)`}
        className="group relative flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-white/10 bg-[#0B061D]/75 hover:bg-[#160D33]/90 hover:border-purple-400/45 opacity-55 hover:opacity-100 scale-90 hover:scale-100 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
      >
        <span
          className="relative flex items-center justify-center w-6 h-6 rounded-full border border-white/20"
          style={{
            background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.22) 0%, ${cluster.accentColor}35 45%, rgba(9,5,22,0.92) 100%)`,
            boxShadow: `0 0 12px ${cluster.accentColor}35`,
          }}
        >
          <TechLogo
            id={cluster.nucleusSkill.id}
            name={cluster.nucleusSkill.name}
            className="w-3.5 h-3.5"
          />
        </span>
        <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/75 group-hover:text-white whitespace-nowrap">
          {cluster.number} · {cluster.shortLabel}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSelectCategory(cluster.id);
      }}
      onMouseEnter={() => onHoverCategory(cluster.id)}
      onMouseLeave={onLeaveCategory}
      onFocus={() => onHoverCategory(cluster.id)}
      onBlur={onLeaveCategory}
      aria-label={`Explore ${cluster.title} (${cluster.skills.length} technologies)`}
      className={`group relative flex flex-col items-center justify-center select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-2xl p-1.5 transition-transform duration-300 ease-out ${
        isHovered ? 'scale-108 z-40' : 'scale-100 z-20 hover:scale-105'
      }`}
    >
      <div
        style={{ animationDelay: `${cluster.floatPhase}s` }}
        className="relative flex flex-col items-center justify-center animate-cosmic-float"
      >
        {/* ─── 1. AMBIENT GRAVITATIONAL NEBULA HALO ─── */}
        <div
          className={`absolute w-32 h-32 rounded-full pointer-events-none -z-20 transition-all duration-500 ${
            isHovered ? 'opacity-100 scale-125' : 'opacity-65 scale-100 group-hover:opacity-95'
          }`}
          style={{
            background: `radial-gradient(circle, ${cluster.accentColor}42 0%, rgba(168, 85, 247, 0.18) 45%, transparent 72%)`,
            filter: 'blur(16px)',
          }}
          aria-hidden="true"
        />

        {/* ─── 2. LOCAL CONSTELLATION GEOMETRY & ORBITING SATELLITES ─── */}
        <div className="relative w-26 h-20 flex items-center justify-center">
        {/* Elliptical Orbital Track */}
        <div
          className={`absolute w-24 h-16 rounded-[50%] border pointer-events-none transition-all duration-500 ${
            isHovered
              ? 'border-purple-300/45 scale-110'
              : 'border-white/12 group-hover:border-purple-300/35'
          }`}
          style={{
            transform: 'rotate(-14deg)',
            boxShadow: isHovered ? `0 0 20px ${cluster.accentColor}25` : undefined,
          }}
          aria-hidden="true"
        />

        {/* Delicate SVG Filaments connecting Nucleus (56, 48) to Satellites */}
        <svg
          viewBox="-56 -48 112 96"
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          aria-hidden="true"
        >
          {cluster.satelliteSkills.map((sat, idx) => {
            const offset = satelliteOffsets[idx] || { x: 30, y: 20 };
            return (
              <line
                key={sat.id}
                x1={0}
                y1={0}
                x2={offset.x}
                y2={offset.y}
                stroke={isHovered ? cluster.accentColor : 'rgba(216, 180, 254, 0.35)'}
                strokeWidth={isHovered ? '1.1' : '0.75'}
                strokeDasharray={idx === 2 ? '2 2' : undefined}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>

        {/* Orbiting Satellite Micro-Nodes (Core & Pro Preview Logos) */}
        {cluster.satelliteSkills.map((sat, idx) => {
          const offset = satelliteOffsets[idx] || { x: 30, y: 20 };
          return (
            <div
              key={sat.id}
              style={{
                transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
              }}
              className={`absolute w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-300 pointer-events-none ${
                isHovered
                  ? 'border-white/55 bg-[#191034]/95 scale-110 shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                  : 'border-white/20 bg-[#0D0820]/85 opacity-85 group-hover:opacity-100'
              }`}
              aria-hidden="true"
            >
              <TechLogo id={sat.id} name={sat.name} className="w-3.5 h-3.5" />
            </div>
          );
        })}

        {/* ─── 3. SPHERICAL CELESTIAL NUCLEUS (PRIMARY LOGO) ─── */}
        <div
          className={`relative w-14 h-14 sm:w-15 sm:h-15 rounded-full flex items-center justify-center transition-all duration-400 ${
            isHovered
              ? 'border-white/80 scale-108'
              : 'border-white/30 group-hover:border-white/65'
          } border`}
          style={{
            background: `radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.28) 0%, ${cluster.accentColor}45 35%, rgba(16, 10, 38, 0.92) 78%, rgba(6, 3, 16, 0.98) 100%)`,
            boxShadow: isHovered
              ? `0 0 28px ${cluster.accentColor}80, 0 0 12px rgba(255, 255, 255, 0.55), inset 0 2px 6px rgba(255, 255, 255, 0.35)`
              : `0 0 18px ${cluster.accentColor}40, inset 0 1px 4px rgba(255, 255, 255, 0.22)`,
          }}
        >
          <TechLogo
            id={cluster.nucleusSkill.id}
            name={cluster.nucleusSkill.name}
            className={`w-7 h-7 sm:w-7.5 sm:h-7.5 transition-transform duration-300 ${
              isHovered ? 'scale-110 brightness-125' : 'group-hover:scale-105'
            }`}
          />
        </div>
      </div>

        {/* ─── 4. SPATIAL TELEMETRY LABEL & COUNT ─── */}
        <div
          className={`mt-1 flex flex-col items-center text-center px-3 py-1 rounded-lg border transition-all duration-300 ${
            isHovered
              ? 'bg-[#0B061E]/95 border-purple-400/50 shadow-[0_6px_24px_rgba(0,0,0,0.85)]'
              : 'bg-[#070414]/85 border-white/12 group-hover:border-purple-400/35 group-hover:bg-[#0B061E]/90'
          }`}
        >
          <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] uppercase text-purple-300/85">
            <span>{cluster.number}</span>
            <span aria-hidden="true">·</span>
            <span className="text-white font-semibold whitespace-nowrap">{cluster.title}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-white/55 tabular-nums">
            <span>{cluster.skills.length} technologies</span>
            <span aria-hidden="true">·</span>
            <span className="text-purple-200/75">{cluster.tierCounts.core} core</span>
          </div>
        </div>
      </div>
    </button>
  );
});

CategoryConstellationNode.displayName = 'CategoryConstellationNode';
export default CategoryConstellationNode;
