import React, { memo } from 'react';
import { SkillItem } from '../../data/skills';
import { TechLogo } from './TechLogo';
import { getSkillTier, SkillTier } from '../../features/skills/skillRelationships';
import { CATEGORY_SHORT_LABELS } from '../../features/skills/constellationLayout';

interface SkillNodeProps {
  skill: SkillItem;
  isFocused?: boolean;
  isHovered: boolean;
  isRelated: boolean;
  isDimmed: boolean;
  isCrossCategoryRelated?: boolean;
  driftPhase?: number;
  onSelect?: (id: string) => void;
  onHover: (id: string) => void;
  onLeave: () => void;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * SkillNode
 *
 * Interactive celestial instrument node with persistent selection (Level 3)
 * and distinct 3-tier spatial hierarchy (Level 2):
 * - CORE (Tier 1): Largest spherical node, prominent gravitational corona, persistent title & tier mark.
 * - PROFESSIONAL (Tier 2): Medium orbital sphere, balanced luminance, clear label.
 * - ECOSYSTEM (Tier 3): Compact satellite sphere, subtler illumination.
 */
export const SkillNode: React.FC<SkillNodeProps> = memo(({
  skill,
  isFocused = false,
  isHovered,
  isRelated,
  isDimmed,
  isCrossCategoryRelated = false,
  driftPhase = 0,
  onSelect,
  onHover,
  onLeave,
  style,
  className = '',
}) => {
  const tier: SkillTier = getSkillTier(skill.id);
  const isActive = isFocused || isHovered;

  // Distinct dimension scaling across the 3 visual tiers
  const sizeClasses =
    tier === 'core'
      ? 'w-14 h-14 sm:w-16 sm:h-16'
      : tier === 'professional'
      ? 'w-11 h-11 sm:w-12 sm:h-12'
      : 'w-9 h-9 sm:w-9.5 sm:h-9.5';

  const logoClasses =
    tier === 'core'
      ? 'w-7 h-7 sm:w-8 sm:h-8'
      : tier === 'professional'
      ? 'w-5 h-5 sm:w-6 sm:h-6'
      : 'w-4 h-4 sm:w-4.5 sm:h-4.5';

  return (
    <button
      type="button"
      aria-label={`${skill.name} (${tier} tier, ${skill.categoryId})`}
      aria-pressed={isFocused}
      onClick={(e) => {
        e.stopPropagation();
        if (onSelect) onSelect(skill.id);
      }}
      onMouseEnter={() => onHover(skill.id)}
      onMouseLeave={onLeave}
      onFocus={() => onHover(skill.id)}
      onBlur={onLeave}
      style={style}
      className={`group relative flex flex-col items-center justify-center select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-full transition-all duration-300 ease-out ${
        isFocused
          ? 'scale-125 z-50 opacity-100'
          : isHovered
          ? 'scale-115 z-45 opacity-100'
          : isRelated
          ? 'scale-110 z-35 opacity-100'
          : isDimmed
          ? 'scale-90 z-10 opacity-25 hover:opacity-85 hover:scale-100'
          : tier === 'core'
          ? 'scale-100 z-30 opacity-100 hover:scale-110'
          : tier === 'professional'
          ? 'scale-100 z-20 opacity-92 hover:opacity-100 hover:scale-108'
          : 'scale-95 z-15 opacity-78 hover:opacity-100 hover:scale-105'
      } ${className}`}
    >
      <div
        style={{ animationDelay: `${driftPhase}s` }}
        className="relative flex flex-col items-center justify-center animate-cosmic-float"
      >
      {/* ─── LAYER 1: GRAVITATIONAL CORONA & ATMOSPHERIC GLOW ─── */}
      <div
        className={`absolute -inset-4 rounded-full pointer-events-none -z-20 transition-all duration-500 ${
          isFocused
            ? 'opacity-100 scale-135'
            : isHovered
            ? 'opacity-95 scale-120'
            : isRelated
            ? 'opacity-80 scale-115'
            : tier === 'core'
            ? 'opacity-65 scale-110 group-hover:opacity-90'
            : tier === 'professional'
            ? 'opacity-30 scale-100 group-hover:opacity-65'
            : 'opacity-15 scale-90 group-hover:opacity-45'
        }`}
        style={{
          background: isActive
            ? `radial-gradient(circle, ${skill.brandColor}75 0%, rgba(168, 85, 247, 0.45) 45%, transparent 72%)`
            : isRelated
            ? `radial-gradient(circle, rgba(192, 132, 252, 0.65) 0%, ${skill.brandColor}35 48%, transparent 72%)`
            : tier === 'core'
            ? `radial-gradient(circle, ${skill.brandColor}55 0%, rgba(168, 85, 247, 0.25) 50%, transparent 72%)`
            : `radial-gradient(circle, ${skill.brandColor}35 0%, transparent 68%)`,
          filter: 'blur(8px)',
        }}
        aria-hidden="true"
      />

      {/* ─── LAYER 2: ORBITAL SELECTION / TIER RING ─── */}
      <div
        className={`absolute -inset-1.5 rounded-full pointer-events-none -z-10 transition-all duration-300 border ${
          isFocused
            ? 'border-white opacity-100 scale-110 shadow-[0_0_20px_rgba(168,85,247,0.8)]'
            : isHovered
            ? 'border-purple-200/80 opacity-100 scale-105'
            : isRelated
            ? 'border-purple-300/70 opacity-90 scale-105 border-dashed'
            : tier === 'core'
            ? 'border-purple-300/40 opacity-75 group-hover:border-white/60'
            : tier === 'professional'
            ? 'border-white/15 opacity-45 group-hover:border-white/40'
            : 'border-transparent opacity-0 group-hover:border-white/25 group-hover:opacity-50'
        }`}
        aria-hidden="true"
      />

      {/* ─── LAYER 3: 3D SPHERICAL LUMINOUS NODE BODY ─── */}
      <div
        className={`relative flex items-center justify-center rounded-full ${sizeClasses} transition-all duration-300 border ${
          isFocused
            ? 'border-white shadow-[0_0_30px_rgba(168,85,247,0.75),inset_0_2px_8px_rgba(255,255,255,0.45)]'
            : isHovered
            ? 'border-white/80 shadow-[0_0_22px_rgba(168,85,247,0.55),inset_0_2px_6px_rgba(255,255,255,0.35)]'
            : isRelated
            ? 'border-purple-300/75 shadow-[0_0_18px_rgba(192,132,252,0.45),inset_0_1px_5px_rgba(255,255,255,0.28)]'
            : tier === 'core'
            ? 'border-white/45 shadow-[0_0_18px_rgba(168,85,247,0.35),inset_0_2px_5px_rgba(255,255,255,0.25)] group-hover:border-white/75'
            : tier === 'professional'
            ? 'border-white/22 shadow-[0_0_10px_rgba(15,10,35,0.7),inset_0_1px_3px_rgba(255,255,255,0.18)] group-hover:border-white/50'
            : 'border-white/12 shadow-[inset_0_1px_2px_rgba(255,255,255,0.12)] group-hover:border-white/35'
        }`}
        style={{
          background: isActive
            ? `radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.32) 0%, ${skill.brandColor}48 38%, rgba(20, 12, 46, 0.95) 80%, rgba(8, 4, 20, 0.98) 100%)`
            : isRelated
            ? `radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.24) 0%, rgba(168, 85, 247, 0.36) 42%, rgba(16, 10, 38, 0.92) 85%, rgba(7, 4, 18, 0.98) 100%)`
            : tier === 'core'
            ? `radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.24) 0%, ${skill.brandColor}36 38%, rgba(18, 11, 42, 0.90) 80%, rgba(7, 4, 18, 0.96) 100%)`
            : tier === 'professional'
            ? `radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.16) 0%, rgba(139, 92, 246, 0.18) 42%, rgba(14, 9, 32, 0.86) 85%, rgba(6, 3, 16, 0.94) 100%)`
            : `radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.10) 0%, rgba(16, 10, 34, 0.78) 65%, rgba(6, 3, 15, 0.90) 100%)`,
        }}
      >
        <TechLogo
          id={skill.id}
          name={skill.name}
          className={`${logoClasses} transition-all duration-300 pointer-events-none ${
            isActive
              ? 'brightness-125 contrast-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.55)]'
              : isRelated
              ? 'brightness-115 drop-shadow-[0_0_6px_rgba(192,132,252,0.45)]'
              : 'group-hover:brightness-115'
          }`}
        />
      </div>

      {/* ─── LAYER 4: HIERARCHICAL SPATIAL LABEL ─── */}
      <div
        className={`pointer-events-none absolute top-full mt-1.5 left-1/2 -translate-x-1/2 flex flex-col items-center whitespace-nowrap transition-all duration-200 z-50 ${
          isFocused
            ? 'opacity-100 translate-y-0'
            : isHovered || isRelated
            ? 'opacity-100 translate-y-0'
            : isDimmed
            ? 'opacity-30 group-hover:opacity-95'
            : tier === 'core'
            ? 'opacity-100'
            : tier === 'professional'
            ? 'opacity-85 group-hover:opacity-100'
            : 'opacity-70 group-hover:opacity-100'
        }`}
      >
        <span
          className={`rounded px-1.5 py-0.5 font-mono uppercase tracking-[0.12em] transition-colors ${
            isFocused
              ? 'text-[10px] font-bold bg-[#120A2A]/95 text-white border border-white/60 shadow-[0_4px_14px_rgba(0,0,0,0.9)]'
              : isHovered
              ? 'text-[10px] font-semibold bg-[#0D0720]/95 text-white border border-purple-400/50 shadow-[0_2px_10px_rgba(0,0,0,0.85)]'
              : isRelated
              ? 'text-[9.5px] font-semibold bg-[#110926]/90 text-purple-200 border border-purple-400/40'
              : tier === 'core'
              ? 'text-[10px] font-semibold bg-[#0A0518]/85 text-white border border-white/20'
              : tier === 'professional'
              ? 'text-[9px] bg-[#080414]/75 text-white/85'
              : 'text-[8.5px] bg-[#060310]/65 text-white/65'
          }`}
        >
          {skill.name}
        </span>

        {/* Tier or Cross-Category Indicator */}
        {(tier === 'core' || isFocused || isCrossCategoryRelated) && (
          <span className="mt-0.5 font-mono text-[8px] tracking-[0.18em] uppercase text-purple-300/80">
            {isCrossCategoryRelated
              ? `↗ ${CATEGORY_SHORT_LABELS[skill.categoryId] || skill.categoryId}`
              : tier === 'core'
              ? 'CORE'
              : tier.toUpperCase()}
          </span>
        )}
      </div>
      </div>
    </button>
  );
});

SkillNode.displayName = 'SkillNode';

export default SkillNode;
