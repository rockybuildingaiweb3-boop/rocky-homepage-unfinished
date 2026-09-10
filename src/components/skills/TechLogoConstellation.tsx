import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SkillItem, SKILLS_DATA, SKILLS_BY_ROW, SKILL_ROWS, SKILL_CATEGORIES, PROJECT_NAMES } from '../../data/skills';
import { TechLogo } from './TechLogo';
import { getTechQuote } from '../../data/techQuotes';
import { playMechanicalClick } from './audio';

interface TechLogoConstellationProps {
  activeSkillId?: string;
  onSelectSkill?: (skill: SkillItem) => void;
}

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

    // Filter synchronization requirement:
    // If selected skill belongs to category, preserve it; otherwise select the first skill in that category
    if (row !== 0) {
      const activeSkill = SKILLS_DATA.find((s) => s.id === activeSkillId);
      if (!activeSkill || activeSkill.row !== row) {
        const firstSkillInRow = SKILLS_BY_ROW[row]?.[0];
        if (firstSkillInRow) {
          onSelectSkill?.(firstSkillInRow);
        }
      }
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-2 select-none">
      {/* ─── CONSTELLATION LEGEND (Category Navigation) ─── */}
      <nav aria-label="Constellation Legend" className="flex items-center justify-center flex-wrap gap-x-6 sm:gap-x-8 gap-y-2 mb-6 sm:mb-8 px-4 z-20">
        {SKILL_CATEGORIES.map((cat, idx) => {
          const isActive = selectedCategoryRow === cat.row;
          return (
            <React.Fragment key={cat.id}>
              <button
                type="button"
                onClick={() => handleFilterClick(cat.row)}
                className={`relative py-1 text-xs sm:text-[13px] tracking-[0.2em] lowercase font-mono transition-all duration-300 clickable cursor-pointer border-none bg-transparent p-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-300 rounded ${
                  isActive
                    ? 'text-white/95 font-medium'
                    : 'text-white/40 hover:text-white/80'
                }`}
              >
                <span>{cat.label}</span>
                {/* Understated lilac active underline */}
                <span
                  className={`absolute -bottom-1 left-0 right-0 h-[1.5px] rounded-full transition-all duration-300 pointer-events-none ${
                    isActive
                      ? 'bg-purple-300 opacity-100 scale-x-100 shadow-[0_0_10px_rgba(216,180,254,0.85)]'
                      : 'bg-purple-300/40 opacity-0 scale-x-0'
                  }`}
                />
              </button>
              {idx < SKILL_CATEGORIES.length - 1 && (
                <span className="text-white/15 select-none text-[10px] hidden sm:inline" aria-hidden="true">
                  ·
                </span>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* ─── WHISPER TELEMETRY (Silent when idle, floating poetic detail upon hover) ─── */}
      <div className="min-h-8 flex items-center justify-center mb-6 px-4">
        <AnimatePresence mode="wait">
          {hoveredSkill && (
            <motion.div
              key={hoveredSkill.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] backdrop-blur-md z-30 max-w-[95vw] shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: hoveredSkill.brandColor }}
                />
                <span className="text-xs font-semibold text-white tracking-wide">
                  {hoveredSkill.name}
                </span>
              </div>

              <span className="text-[11px] text-white/40 font-mono">
                [{hoveredSkill.category}]
              </span>

              {hoveredSkill.relatedProjects && hoveredSkill.relatedProjects.length > 0 && (
                <span className="text-[11px] text-purple-300/80 font-mono">
                  · studio: {hoveredSkill.relatedProjects
                    .map((pid) => PROJECT_NAMES[pid]?.title || pid)
                    .slice(0, 1)
                    .join(', ')}
                </span>
              )}

              <span className="text-xs text-white/60 font-light max-w-[320px] truncate hidden md:inline">
                &ldquo;{getTechQuote(hoveredSkill.id, hoveredSkill.shortDescription || hoveredSkill.positioning)}&rdquo;
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── 8-ROW CONSTELLATION: EXACTLY 80 CURATED SKILLS (10 PER ROW) ─── */}
      <div className="w-full max-w-[1240px] flex flex-col items-center justify-center gap-y-5 sm:gap-y-6 md:gap-y-7 px-2 sm:px-4">
        {SKILL_ROWS.map((rowDef, rowIndex) => {
          const rowSkills = SKILLS_BY_ROW[rowDef.row] || [];
          const isRowFiltered =
            selectedCategoryRow !== 0 && selectedCategoryRow !== rowDef.row;

          return (
            <motion.div
              key={`row-${rowDef.row}`}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: rowIndex * 0.04 }}
              className={`w-full flex flex-wrap items-center justify-center gap-x-3.5 sm:gap-x-5 md:gap-x-6 lg:gap-x-8 gap-y-2.5 sm:gap-y-3 transition-all duration-400 ${
                isRowFiltered
                  ? 'opacity-15 scale-[0.97] pointer-events-none filter grayscale'
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
                    className="group relative flex items-center justify-center p-1.5 sm:p-2 md:p-2.5 rounded-xl cursor-pointer focus:outline-none transition-transform duration-200 clickable"
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
                          transform: 'scale(1.35)',
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
                        size={40}
                        className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11"
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

