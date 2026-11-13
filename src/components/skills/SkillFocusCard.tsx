import React, { memo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { SKILLS_DATA, SKILL_CATEGORIES, SkillItem } from '../../data/skills';
import { getRelatedSkillIds } from '../../features/skills/livingOrbitEngine';
import { TechLogo } from './TechLogo';

interface SkillFocusCardProps {
  skill: SkillItem;
  onSelectSkill: (skillId: string) => void;
  onClose: () => void;
  widthPx?: number;
  isMobileLayout?: boolean;
}

const TIER_EDITORIAL_META: Record<
  SkillItem['tier'],
  { label: string; toneClass: string }
> = {
  core: {
    label: 'Core Architecture',
    toneClass: 'text-amber-200/90',
  },
  professional: {
    label: 'Production Stack',
    toneClass: 'text-purple-200/90',
  },
  ecosystem: {
    label: 'Ecosystem Tooling',
    toneClass: 'text-sky-200/85',
  },
};

export interface DossierStageRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface DossierPlacementInput {
  stageWidth: number;
  stageHeight: number;
  selectedPos: { x: number; y: number };
  relatedPositions: readonly { x: number; y: number }[];
}

export interface DossierPlacementResult {
  left: number;
  top: number;
  width: number;
  height: number;
  anchorSide: 'left' | 'right' | 'center';
  planetOverlap: number;
  selectedOverlap: number;
  relatedOverlap: number;
}

export const DOSSIER_DESKTOP_WIDTH = 532;
export const DOSSIER_ESTIMATED_HEIGHT = 276;

function rectOverlapArea(a: DossierStageRect, b: DossierStageRect): number {
  const ox = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const oy = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  return ox * oy;
}

function rectToPointDistance(rect: DossierStageRect, px: number, py: number): number {
  const cx = Math.max(rect.left, Math.min(px, rect.right));
  const cy = Math.max(rect.top, Math.min(py, rect.bottom));
  return Math.hypot(px - cx, py - cy);
}

/**
 * Computes collision-aware floating placement for the Orbital Dossier inside the desktop
 * Living Orbit stage, evaluating side and corner candidate zones while avoiding:
 * 1. The central planetary focal region
 * 2. The selected technology node
 * 3. Highlighted related technology nodes
 * 4. Stage boundaries
 */
export function computeOrbitalDossierPlacement({
  stageWidth,
  stageHeight,
  selectedPos,
  relatedPositions,
}: DossierPlacementInput): DossierPlacementResult {
  const safeW = Math.max(480, stageWidth);
  const safeH = Math.max(420, stageHeight);

  const edgeMarginX = safeW >= 1200 ? 24 : 16;
  const topMargin = 16;
  const bottomMargin = 12;

  const panelWidth =
    safeW >= 1120
      ? DOSSIER_DESKTOP_WIDTH
      : Math.max(400, Math.min(520, safeW - edgeMarginX * 2));
  const panelHeight = DOSSIER_ESTIMATED_HEIGHT;

  const minX = edgeMarginX;
  const maxX = Math.max(minX, Math.round(safeW - panelWidth - edgeMarginX));
  const minY = topMargin;
  const maxY = Math.max(minY, Math.round(safeH - panelHeight - bottomMargin));

  // Central planetary sphere + luminous core
  const planetBox: DossierStageRect = {
    left: safeW * 0.38,
    top: safeH * 0.23,
    right: safeW * 0.62,
    bottom: safeH * 0.57,
  };

  const selPxX = (selectedPos.x / 100) * safeW;
  const selPxY = (selectedPos.y / 100) * safeH;
  const selectedBox: DossierStageRect = {
    left: selPxX - 78,
    top: selPxY - 64,
    right: selPxX + 78,
    bottom: selPxY + 66,
  };

  const relatedBoxes: DossierStageRect[] = relatedPositions.map((rp) => {
    const rx = (rp.x / 100) * safeW;
    const ry = (rp.y / 100) * safeH;
    return {
      left: rx - 60,
      top: ry - 52,
      right: rx + 60,
      bottom: ry + 54,
    };
  });

  const rawCandidates: { x: number; y: number; side: 'left' | 'right' | 'center' }[] = [
    // Floating lower-side editorial slots (preferred on wide desktop)
    { x: minX, y: maxY, side: 'left' },
    { x: maxX, y: maxY, side: 'right' },
    // Mid-lower side slots
    { x: minX, y: Math.round(safeH * 0.52), side: 'left' },
    { x: maxX, y: Math.round(safeH * 0.52), side: 'right' },
    // Mid-side slots
    { x: minX, y: Math.round((minY + maxY) * 0.44), side: 'left' },
    { x: maxX, y: Math.round((minY + maxY) * 0.44), side: 'right' },
    // Upper-side slots
    { x: minX, y: minY + 10, side: 'left' },
    { x: maxX, y: minY + 10, side: 'right' },
    // Gently inset lower corners for ultra-wide composition balance
    { x: Math.min(maxX, Math.round(minX + safeW * 0.04)), y: maxY, side: 'left' },
    { x: Math.max(minX, Math.round(maxX - safeW * 0.04)), y: maxY, side: 'right' },
    // Compact lower-center fallback only if both flanks have severe collisions
    { x: Math.round((safeW - panelWidth) * 0.5), y: maxY, side: 'center' },
  ];

  // Deduplicate clamped candidate rectangles
  const candidates: {
    left: number;
    top: number;
    side: 'left' | 'right' | 'center';
  }[] = [];
  for (const c of rawCandidates) {
    const clampedX = Math.max(minX, Math.min(maxX, Math.round(c.x)));
    const clampedY = Math.max(minY, Math.min(maxY, Math.round(c.y)));
    const isDuplicate = candidates.some(
      (existing) =>
        Math.abs(existing.left - clampedX) < 14 &&
        Math.abs(existing.top - clampedY) < 14
    );
    if (!isDuplicate) {
      candidates.push({ left: clampedX, top: clampedY, side: c.side });
    }
  }

  let bestResult: DossierPlacementResult = {
    left: maxX,
    top: maxY,
    width: panelWidth,
    height: panelHeight,
    anchorSide: 'right',
    planetOverlap: 0,
    selectedOverlap: 0,
    relatedOverlap: 0,
  };
  let bestScore = Infinity;

  const isWideDesktop = safeW >= 1024;
  const preferredSide: 'left' | 'right' = selectedPos.x < 48 ? 'right' : 'left';

  for (const cand of candidates) {
    const rect: DossierStageRect = {
      left: cand.left,
      top: cand.top,
      right: cand.left + panelWidth,
      bottom: cand.top + panelHeight,
    };

    const planetOverlap = rectOverlapArea(rect, planetBox);
    const selectedOverlap = rectOverlapArea(rect, selectedBox);
    let relatedOverlap = 0;
    for (const rb of relatedBoxes) {
      relatedOverlap += rectOverlapArea(rect, rb);
    }

    // Clearance check around selected node & related nodes
    const selDist = rectToPointDistance(rect, selPxX, selPxY);
    const selClearancePenalty = selDist < 96 ? (96 - selDist) * 280 : 0;

    let relClearancePenalty = 0;
    for (const rp of relatedPositions) {
      const rx = (rp.x / 100) * safeW;
      const ry = (rp.y / 100) * safeH;
      const d = rectToPointDistance(rect, rx, ry);
      if (d < 68) relClearancePenalty += (68 - d) * 140;
    }

    // Visual composition preferences
    let compositionBias = 0;
    if (isWideDesktop && cand.side !== 'center') {
      compositionBias -= 2600;
      if (cand.side === preferredSide) {
        compositionBias -= 1400;
      }
    }
    if (cand.top >= maxY - 24) {
      // Favor grounded lower-side layout
      compositionBias -= 900;
    }

    const panelCenterX = (rect.left + rect.right) * 0.5;
    const panelCenterY = (rect.top + rect.bottom) * 0.5;
    const distToSelected = Math.hypot(panelCenterX - selPxX, panelCenterY - selPxY);

    const score =
      planetOverlap * 16 +
      selectedOverlap * 14 +
      relatedOverlap * 10 +
      selClearancePenalty +
      relClearancePenalty +
      compositionBias +
      distToSelected * 0.45;

    if (score < bestScore) {
      bestScore = score;
      bestResult = {
        left: cand.left,
        top: cand.top,
        width: panelWidth,
        height: panelHeight,
        anchorSide: cand.side,
        planetOverlap,
        selectedOverlap,
        relatedOverlap,
      };
    }
  }

  return bestResult;
}

/**
 * SkillFocusCard — ORBITAL DOSSIER 2.0
 *
 * Art-directed editorial technology inspector crafted as a digital exhibition plate:
 * - Deep-violet translucent atmospheric material with calibrated blur & edge hairline
 * - Dominant serif technology typography (`var(--title-font)`) paired with authentic mark
 * - Asymmetric header/identity/prose composition with zero pill enclosures
 * - Horizontal architectural constellation strip of 3–5 interactive linked technologies
 */
export const SkillFocusCard: React.FC<SkillFocusCardProps> = memo(
  ({ skill, onSelectSkill, onClose, widthPx, isMobileLayout = false }) => {
    const prefersReducedMotion = useReducedMotion();
    const category = SKILL_CATEGORIES.find((c) => c.id === skill.categoryId);
    const tierMeta = TIER_EDITORIAL_META[skill.tier];

    const relatedSkills = React.useMemo(() => {
      const ids = getRelatedSkillIds(skill.id).slice(0, 5);
      return ids
        .map((id) => SKILLS_DATA.find((s) => s.id === id))
        .filter((s): s is SkillItem => Boolean(s));
    }, [skill.id]);

    return (
      <div
        role="dialog"
        aria-modal="false"
        aria-label={`${skill.name} technical dossier`}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: widthPx ? `${widthPx}px` : undefined,
          background:
            'linear-gradient(156deg, rgba(24, 13, 52, 0.78) 0%, rgba(12, 7, 30, 0.84) 56%, rgba(6, 3, 18, 0.9) 100%)',
          boxShadow:
            '0 22px 56px rgba(2, 0, 14, 0.72), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        }}
        className={`relative overflow-hidden backdrop-blur-xl border border-purple-200/[0.14] ${
          isMobileLayout
            ? 'w-full rounded-xl px-4 py-3.5'
            : 'w-full max-w-[544px] rounded-xl px-5 py-3.5'
        }`}
      >
        {/* Top Architectural Specular Edge Highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[1px]"
          style={{
            background: `linear-gradient(90deg, transparent 4%, ${skill.brandColor}90 28%, rgba(243,232,255,0.48) 54%, rgba(192,132,252,0.22) 78%, transparent 96%)`,
          }}
        />

        {/* Restrained Brand-Tinted Ambient Illumination */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -left-10 w-64 h-40 rounded-full blur-3xl opacity-[0.15] transition-colors duration-500"
          style={{ background: skill.brandColor }}
        />

        {/* Subtle Architectural Corner Index Hairlines */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-2 left-2 w-2 h-2 border-t border-l border-purple-200/25"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2 right-2 w-2 h-2 border-b border-r border-purple-200/20"
        />

        {/* ─── A. EDITORIAL HEADER ROW ─── */}
        <div className="relative flex items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 min-w-0 text-[10.5px] font-mono tracking-[0.11em] uppercase text-white/55 truncate">
            {category && (
              <>
                <span className="text-purple-200/80 tabular-nums">{category.number}</span>
                <span aria-hidden="true" className="text-white/25">
                  /
                </span>
                <span className="text-white/75 truncate">{category.title}</span>
                <span aria-hidden="true" className="text-white/25">
                  ·
                </span>
              </>
            )}
            <span className="text-white/45 shrink-0">Technical Dossier</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close technical dossier"
            className="shrink-0 group inline-flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 px-2 py-1 -mr-1.5 rounded-md text-white/55 hover:text-white hover:bg-white/[0.05] transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-purple-300/70"
          >
            <span className="hidden sm:inline font-mono text-[9.5px] tracking-[0.12em] uppercase text-white/40 group-hover:text-white/80 transition-colors">
              Esc
            </span>
            <span className="text-xs leading-none text-white/75 group-hover:text-white">
              ✕
            </span>
          </button>
        </div>

        {/* Immediate Cross-Fade Content Plate (Never renders an empty intermediate state) */}
        <motion.div
          key={skill.id}
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0.1 : 0.18,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative"
        >
            {/* ─── B. TECHNOLOGY IDENTITY LOCKUP ─── */}
            <div className="mt-2.5 flex items-start gap-3.5">
              <div
                className="relative flex items-center justify-center shrink-0 w-9 h-9 sm:w-10 sm:h-10 mt-0.5"
                style={{
                  filter: `drop-shadow(0 0 12px ${skill.brandColor}55) drop-shadow(0 3px 8px rgba(0,0,0,0.65))`,
                }}
              >
                <TechLogo
                  id={skill.id}
                  name={skill.name}
                  size={isMobileLayout ? 34 : 38}
                />
              </div>

              <div className="min-w-0 flex-1">
                <h3
                  className="text-[26px] sm:text-[30px] font-normal leading-[1.05] tracking-[0.01em] text-white/95 truncate"
                  style={{ fontFamily: 'var(--title-font)' }}
                >
                  {skill.name}
                </h3>

                {/* Quiet Unboxed Classification + Brand Hairline Accent */}
                <div className="mt-1 flex items-center gap-2 text-[11px] tracking-[0.04em] text-white/60">
                  <span
                    aria-hidden="true"
                    className="inline-block w-3.5 h-[1.5px] rounded-full shrink-0"
                    style={{ backgroundColor: skill.brandColor }}
                  />
                  <span className={tierMeta.toneClass}>{tierMeta.label}</span>
                  {category && (
                    <>
                      <span aria-hidden="true" className="text-white/25">
                        ·
                      </span>
                      <span className="text-white/50 truncate">{category.title}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ─── C. TECHNICAL INSIGHT PROSE ─── */}
            <p className="mt-2.5 text-[13.5px] sm:text-[14px] leading-[1.56] text-purple-50/85 font-normal max-w-[49ch]">
              {skill.insight}
            </p>

            {/* ─── D. HORIZONTAL ARCHITECTURAL CONSTELLATION STRIP ─── */}
            {relatedSkills.length > 0 && (
              <div className="mt-3 pt-2.5 border-t border-white/[0.08]">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-white/45">
                    Connected Constellation
                  </span>
                  <span className="font-mono text-[9.5px] tracking-[0.08em] text-purple-200/45 tabular-nums">
                    {relatedSkills.length} linked
                  </span>
                </div>

                <div className="relative">
                  {/* Fine Connecting Constellation Filament Behind Nodes (Desktop Horizontal Strip) */}
                  <div
                    aria-hidden="true"
                    className="hidden sm:block pointer-events-none absolute top-[10px] left-3 right-3 h-[1px]"
                    style={{
                      background: `linear-gradient(90deg, ${skill.brandColor}45 0%, rgba(216,180,254,0.22) 50%, rgba(216,180,254,0.08) 100%)`,
                    }}
                  />

                  <div
                    className={`grid gap-1.5 ${
                      relatedSkills.length <= 3
                        ? 'grid-cols-3'
                        : relatedSkills.length === 4
                        ? 'grid-cols-2 sm:grid-cols-4'
                        : 'grid-cols-2 sm:grid-cols-5'
                    }`}
                  >
                    {relatedSkills.map((rel) => (
                      <button
                        key={rel.id}
                        type="button"
                        onClick={() => onSelectSkill(rel.id)}
                        className="group relative flex sm:flex-col items-center sm:items-start gap-2.5 sm:gap-1 min-h-[44px] sm:min-h-0 px-2.5 py-2 sm:px-2 sm:py-1 rounded-lg border border-white/[0.05] sm:border-transparent bg-white/[0.02] sm:bg-transparent hover:bg-purple-300/[0.08] hover:border-purple-200/[0.16] transition-all duration-150 cursor-pointer text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-purple-300/70"
                      >
                        {/* Architectural Constellation Node Dot + Authentic Miniature Logo */}
                        <span className="relative flex items-center gap-2 shrink-0">
                          <span
                            aria-hidden="true"
                            className="hidden sm:inline-block w-1.5 h-1.5 rounded-full transition-transform duration-200 group-hover:scale-125"
                            style={{
                              backgroundColor: rel.brandColor,
                              boxShadow: `0 0 8px ${rel.brandColor}80`,
                            }}
                          />
                          <span className="flex items-center justify-center w-[18px] h-[18px] opacity-85 group-hover:opacity-100 transition-opacity">
                            <TechLogo id={rel.id} name={rel.name} size={17} />
                          </span>
                        </span>

                        {/* Name Label + Restrained Directional Indicator */}
                        <span className="flex items-center justify-between gap-1 w-full min-w-0">
                          <span className="text-[11px] font-medium tracking-[0.01em] text-white/75 group-hover:text-white transition-colors truncate">
                            {rel.name}
                          </span>
                          <span
                            aria-hidden="true"
                            className="font-mono text-[10px] text-purple-200/35 group-hover:text-purple-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
                          >
                            ↗
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
        </motion.div>
      </div>
    );
  }
);

SkillFocusCard.displayName = 'SkillFocusCard';
export default SkillFocusCard;
