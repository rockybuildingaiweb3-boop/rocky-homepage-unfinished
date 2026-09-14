import React, { memo } from 'react';
import { SkillItem } from '../../data/skills';
import {
  getSkillEditorialSummary,
  getRelatedSkillIds,
  getSkillTier,
} from '../../features/skills/skillRelationships';
import { TechLogo } from './TechLogo';

interface SkillHUDProps {
  hoveredSkill: SkillItem | null;
  allSkills: SkillItem[];
  onHoverSkill: (id: string) => void;
  onLeaveSkill: () => void;
}

/**
 * SkillHUD
 * 
 * Futuristic System Interface / Editorial Telemetry Panel.
 * Designed with tactical reticle brackets, monospace coordinates,
 * and high-contrast typography — NOT a generic card.
 */
export const SkillHUD: React.FC<SkillHUDProps> = memo(({
  hoveredSkill,
  allSkills,
  onHoverSkill,
  onLeaveSkill,
}) => {
  const editorialQuote = hoveredSkill
    ? getSkillEditorialSummary(hoveredSkill.id)
    : null;

  const relatedIds = hoveredSkill ? getRelatedSkillIds(hoveredSkill.id) : [];
  const relatedSkills = allSkills.filter((s) => relatedIds.includes(s.id));
  const skillTier = hoveredSkill ? getSkillTier(hoveredSkill.id) : null;

  return (
    <div
      className="relative w-full max-w-[1040px] mx-auto px-4 sm:px-6 my-4 select-none z-30"
      role="region"
      aria-label="Skill telemetry system interface"
    >
      <div
        className={`relative overflow-hidden rounded-lg transition-all duration-400 ease-out backdrop-blur-md border ${
          hoveredSkill
            ? 'bg-[#090616]/85 border-purple-500/35 shadow-[0_4px_30px_rgba(112,66,248,0.22),inset_0_1px_1px_rgba(255,255,255,0.15)]'
            : 'bg-[#080512]/50 border-white/[0.08]'
        }`}
      >
        {/* Futuristic Laser Top Beam */}
        <div
          className={`absolute top-0 left-0 right-0 h-[1.5px] transition-all duration-500 ${
            hoveredSkill
              ? 'bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-100'
              : 'bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-40'
          }`}
        />

        {/* Tactical Corner Calipers */}
        <span className="absolute top-1 left-1.5 font-mono text-[9px] text-purple-400/50 leading-none pointer-events-none">
          ┌
        </span>
        <span className="absolute top-1 right-1.5 font-mono text-[9px] text-purple-400/50 leading-none pointer-events-none">
          ┐
        </span>
        <span className="absolute bottom-1 left-1.5 font-mono text-[9px] text-purple-400/50 leading-none pointer-events-none">
          └
        </span>
        <span className="absolute bottom-1 right-1.5 font-mono text-[9px] text-purple-400/50 leading-none pointer-events-none">
          ┘
        </span>

        {hoveredSkill ? (
          /* ─── ACTIVE TELEMETRY READOUT ─── */
          <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 animate-fadeIn">
            {/* Left: Identity & Core Philosophy */}
            <div className="flex items-start gap-4 max-w-2xl">
              <div
                className="relative flex items-center justify-center shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-lg border border-white/20 bg-white/[0.04] p-2"
                style={{
                  boxShadow: `0 0 16px ${hoveredSkill.brandColor}30`,
                }}
              >
                <TechLogo
                  id={hoveredSkill.id}
                  name={hoveredSkill.name}
                  className="w-full h-full"
                />
              </div>

              <div className="flex flex-col min-w-0">
                {/* Tactical Meta Bar */}
                <div className="flex flex-wrap items-center gap-2 mb-1 font-mono text-[10px] tracking-wider uppercase text-purple-300/70">
                  <span>SYS.NODE_{hoveredSkill.categoryNumber}</span>
                  <span className="text-white/20">/</span>
                  <span className="text-white/80">{hoveredSkill.categoryId}</span>
                  <span className="text-white/20">/</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-wider uppercase border ${
                      skillTier === 'core'
                        ? 'text-amber-300 border-amber-400/30 bg-amber-400/10'
                        : skillTier === 'professional'
                        ? 'text-cyan-300 border-cyan-400/30 bg-cyan-400/10'
                        : 'text-purple-300/80 border-purple-400/20 bg-purple-400/5'
                    }`}
                  >
                    {skillTier === 'core'
                      ? 'TIER 1: CORE'
                      : skillTier === 'professional'
                      ? 'TIER 2: PROFESSIONAL'
                      : 'TIER 3: ECOSYSTEM'}
                  </span>
                </div>

                {/* Primary Skill Title */}
                <h3 className="font-mono text-base sm:text-lg font-bold tracking-wider text-white uppercase flex items-center gap-2.5">
                  <span>{hoveredSkill.name}</span>
                  <span
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: hoveredSkill.brandColor }}
                  />
                </h3>

                {/* Editorial Philosophy Quote */}
                <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-purple-100/80 font-normal">
                  &ldquo;{editorialQuote}&rdquo;
                </p>
              </div>
            </div>

            {/* Right: Resonating Sister Nodes */}
            <div className="flex flex-col items-start md:items-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/[0.08]">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                RESONATING NODES ({relatedSkills.length})
              </span>

              <div className="flex flex-wrap md:justify-end gap-1.5 max-w-sm">
                {relatedSkills.slice(0, 6).map((rel) => (
                  <button
                    key={rel.id}
                    type="button"
                    onMouseEnter={() => onHoverSkill(rel.id)}
                    onMouseLeave={onLeaveSkill}
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.12] border border-white/10 hover:border-purple-400/40 text-[11px] font-mono text-white/80 hover:text-white transition-colors duration-200"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: rel.brandColor }}
                    />
                    <span>{rel.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ─── IDLE TELEMETRY STANDBY ─── */
          <div className="px-4 py-3 flex items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
              </span>
              <span className="font-mono text-[11px] sm:text-xs tracking-wider uppercase text-white/60">
                [ CONSTELLATION TELEMETRY: ACTIVE ] · 88 NODES SYNCHRONIZED
              </span>
            </div>
            <span className="hidden sm:inline font-mono text-[10px] tracking-widest uppercase text-white/35">
              HOVER ANY NODE TO TRACE NEURAL RELATIONSHIPS
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

SkillHUD.displayName = 'SkillHUD';
