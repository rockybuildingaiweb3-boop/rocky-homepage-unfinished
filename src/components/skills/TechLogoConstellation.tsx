import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SkillItem, SKILLS_BY_ROW, SKILL_ROWS, PROJECT_NAMES } from '../../data/skills';
import { TechLogo } from './TechLogo';
import { getTechQuote } from '../../data/techQuotes';
import { playMechanicalClick } from './audio';

interface TechLogoConstellationProps {
  activeSkillId?: string;
  onSelectSkill?: (skill: SkillItem) => void;
}

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All Domains', row: 0 },
  { id: 'frontend', label: 'Frontend & Motion', row: 1 },
  { id: 'spatial', label: '3D & Graphics', row: 2 },
  { id: 'backend', label: 'Backend & Cloud', row: 3 },
  { id: 'web3', label: 'Web3 & Systems', row: 4 },
  { id: 'ai', label: 'AI & Tooling', row: 5 },
] as const;

export const TechLogoConstellation: React.FC<TechLogoConstellationProps> = ({
  activeSkillId,
  onSelectSkill,
}) => {
  const [hoveredSkill, setHoveredSkill] = useState<SkillItem | null>(null);
  const [selectedCategoryRow, setSelectedCategoryRow] = useState<number>(0);

  const handleMouseEnter = (skill: SkillItem) => {
    setHoveredSkill(skill);
    onSelectSkill?.(skill);
  };

  const handleMouseLeave = () => {
    setHoveredSkill(null);
  };

  const handleClick = (skill: SkillItem) => {
    playMechanicalClick();
    onSelectSkill?.(skill);
  };

  const handleFilterClick = (row: number) => {
    playMechanicalClick();
    setSelectedCategoryRow(row);
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-4 select-none">
      {/* ─── DOMAIN CATEGORY FILTER PILLS ─── */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-6 px-4 z-20">
        {CATEGORY_FILTERS.map((cat) => {
          const isActive = selectedCategoryRow === cat.row;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleFilterClick(cat.row)}
              className={`font-mono text-[10px] sm:text-xs tracking-[0.14em] uppercase px-3 py-1.5 rounded-full transition-all duration-300 clickable cursor-pointer border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 ${
                isActive
                  ? 'bg-purple-500/25 border-purple-400/70 text-purple-200 shadow-[0_0_16px_rgba(168,85,247,0.45)] font-semibold'
                  : 'bg-white/[0.03] border-white/10 text-white/60 hover:text-white/90 hover:border-white/25 hover:bg-white/[0.06]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* ─── FLOATING TELEMETRY HUD / BADGE ─── */}
      <div className="min-h-12 flex items-center justify-center mb-5 px-4">
        <AnimatePresence mode="wait">
          {hoveredSkill ? (
            <motion.div
              key={hoveredSkill.id}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 py-1.5 rounded-full bg-[#030014]/90 border backdrop-blur-xl shadow-2xl z-30 max-w-[95vw]"
              style={{
                borderColor: `${hoveredSkill.brandColor}65`,
                boxShadow: `0 0 26px ${hoveredSkill.brandColor}40, 0 4px 20px rgba(0,0,0,0.85)`,
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse shadow-sm"
                  style={{ backgroundColor: hoveredSkill.brandColor }}
                />
                <span className="text-sm font-semibold text-white tracking-wide">
                  {hoveredSkill.name}
                </span>
                <span className="text-xs text-purple-300/80 font-mono">
                  [{hoveredSkill.category}]
                </span>
              </div>

              {hoveredSkill.relatedProjects && hoveredSkill.relatedProjects.length > 0 && (
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-900/40 border border-purple-400/40 text-[11px] text-purple-200 font-mono">
                  <span>✦ studio:</span>
                  <span className="font-semibold text-white">
                    {hoveredSkill.relatedProjects
                      .map((pid) => PROJECT_NAMES[pid]?.title || pid)
                      .slice(0, 2)
                      .join(', ')}
                  </span>
                </div>
              )}

              <span className="text-xs text-neutral-300 font-light max-w-[260px] sm:max-w-xs truncate border-l border-white/15 pl-2 sm:inline hidden">
                &ldquo;{getTechQuote(hoveredSkill.id, hoveredSkill.shortDescription || hoveredSkill.positioning)}&rdquo;
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs sm:text-sm text-purple-300/65 font-mono tracking-wider flex items-center gap-2"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
              <span>HOVER FOR TELEMETRY // LINKED WITH STUDIO SHOWCASE</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── 5-ROW CONSTELLATION: EXACT 50 SKILLS (10 PER ROW) ─── */}
      <div className="w-full max-w-6xl flex flex-col items-center justify-center gap-y-7 sm:gap-y-9 md:gap-y-11 px-2 sm:px-4">
        {SKILL_ROWS.map((rowDef, rowIndex) => {
          const rowSkills = SKILLS_BY_ROW[rowDef.row] || [];
          const isRowFiltered =
            selectedCategoryRow !== 0 && selectedCategoryRow !== rowDef.row;

          return (
            <motion.div
              key={`row-${rowDef.row}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: rowIndex * 0.07 }}
              className={`w-full flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-7 md:gap-x-9 lg:gap-x-10 gap-y-3 transition-all duration-400 ${
                isRowFiltered
                  ? 'opacity-20 scale-[0.98] pointer-events-none filter grayscale'
                  : 'opacity-100 scale-100'
              }`}
            >
              {rowSkills.map((skill) => {
                const isActive = activeSkillId === skill.id;
                const isHovered = hoveredSkill?.id === skill.id;
                const brandColor = skill.brandColor || '#FFFFFF';

                return (
                  <motion.button
                    key={skill.id}
                    type="button"
                    onClick={() => handleClick(skill)}
                    onMouseEnter={() => handleMouseEnter(skill)}
                    onMouseLeave={handleMouseLeave}
                    whileHover={{
                      scale: 1.26,
                      y: -6,
                      transition: { type: 'spring', stiffness: 450, damping: 18 },
                    }}
                    whileTap={{ scale: 0.92 }}
                    className="group relative flex items-center justify-center p-2 sm:p-2.5 rounded-xl cursor-pointer focus:outline-none transition-transform duration-200 clickable"
                    aria-label={skill.name}
                    title={`${skill.name} (${skill.category})`}
                  >
                    {/* Glowing Ambient Aura on Hover/Active */}
                    {(isHovered || isActive) && (
                      <motion.div
                        layoutId="logo-aura"
                        className="absolute inset-0 rounded-full blur-xl pointer-events-none opacity-75"
                        style={{
                          backgroundColor: brandColor,
                          transform: 'scale(1.4)',
                        }}
                        transition={{ duration: 0.2 }}
                      />
                    )}

                    {/* Pure Floating High-Definition Logo with Vibrant Colored Rim Glow */}
                    <div
                      className="relative z-10 flex items-center justify-center transition-all duration-300"
                      style={{
                        filter:
                          isHovered || isActive
                            ? `drop-shadow(0 -4px 12px ${brandColor}95) drop-shadow(0 0 20px ${brandColor}85) drop-shadow(0 0 4px #ffffff)`
                            : 'drop-shadow(0 4px 10px rgba(0,0,0,0.65))',
                      }}
                    >
                      <TechLogo
                        id={skill.id}
                        iconUrl={skill.icon}
                        name={skill.name}
                        color={brandColor}
                        size={44}
                        className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12"
                      />
                    </div>

                    {/* Active Indicator Micro-Halo */}
                    {isActive && (
                      <span
                        className="absolute -bottom-1 w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] animate-pulse"
                        style={{ backgroundColor: brandColor, color: brandColor }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

