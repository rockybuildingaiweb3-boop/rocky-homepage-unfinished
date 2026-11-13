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

export const DOSSIER_DESKTOP_WIDTH = 472;
export const DOSSIER_ESTIMATED_HEIGHT = 258;

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
 * SkillFocusCard — ORBITAL SPECIMEN / editorial annotation
 *
 * The selected technology remains the visual hero in the orbital field.
 * This compact dossier provides context without repeating the large logo or
 * duplicating the relationship network already visible in the scene.
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

    const skillIndex = React.useMemo(
      () => String(SKILLS_DATA.findIndex((item) => item.id === skill.id) + 1).padStart(2, '0'),
      [skill.id]
    );

    const nodeOffsets = [0, 5, 1, 6, 2];

    return (
      <motion.div
        key={skill.id}
        role="dialog"
        aria-modal="false"
        aria-label={skill.name + ' technical dossier'}
        onClick={(e) => e.stopPropagation()}
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 9, scale: 0.992 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.994 }}
        transition={{
          duration: prefersReducedMotion ? 0.1 : 0.24,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          width: widthPx ? String(widthPx) + 'px' : undefined,
          borderRadius: isMobileLayout ? '12px' : '13px 4px 13px 4px',
          background:
            'linear-gradient(138deg, rgba(25, 14, 47, 0.76) 0%, rgba(10, 6, 26, 0.84) 58%, rgba(5, 3, 17, 0.88) 100%)',
          border: '1px solid rgba(221, 204, 255, 0.13)',
          boxShadow:
            '0 22px 58px rgba(1, 0, 12, 0.48), inset 0 1px 0 rgba(255,255,255,0.055)',
          backdropFilter: 'blur(26px) saturate(128%)',
          WebkitBackdropFilter: 'blur(26px) saturate(128%)',
        }}
        className={isMobileLayout ? 'relative isolate w-full overflow-hidden px-4 py-3.5' : 'relative isolate w-full overflow-hidden px-5 py-4'}
      >
        {/* A quiet brand-colored edge, not a glowing card frame. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-5 bottom-5 w-[2px] rounded-full opacity-80"
          style={{
            background: 'linear-gradient(180deg, transparent, ' + skill.brandColor + 'cc 28%, ' + skill.brandColor + '70 72%, transparent)',
            boxShadow: '0 0 14px ' + skill.brandColor + '45',
          }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-48 w-48 rounded-full blur-3xl opacity-[0.10]"
          style={{ background: skill.brandColor }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-8 top-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, ' + skill.brandColor + '88 34%, rgba(245,238,255,0.36) 58%, transparent)',
          }}
        />

        <div className="relative">
          {/* Editorial index + close */}
          <header className="flex items-center justify-between gap-3 pb-2.5 border-b border-white/[0.075]">
            <div className="flex min-w-0 items-center gap-2 font-mono text-[9px] sm:text-[9.5px] uppercase tracking-[0.16em] text-white/48">
              <span className="shrink-0 text-purple-200/80 tabular-nums">
                {category?.number ?? skill.categoryNumber}
              </span>
              <span className="text-white/20">/</span>
              <span className="truncate text-white/65">{category?.title ?? 'Technology'}</span>
              <span className="text-white/20">·</span>
              <span className="shrink-0 text-white/38">Specimen {skillIndex}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close technology dossier"
              className="group flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.10] text-white/48 transition-all duration-200 hover:border-white/25 hover:bg-white/[0.06] hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-purple-300/70"
            >
              <span className="text-[15px] leading-none transition-transform duration-200 group-hover:rotate-90">×</span>
            </button>
          </header>

          <motion.div
            key={skill.id}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.08 : 0.18, ease: 'easeOut' }}
          >
            {/* The scene owns the large logo; the dossier owns the typographic identity. */}
            <div className="mt-3 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <div className="mb-1 flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-[2px] w-5 rounded-full"
                    style={{ backgroundColor: skill.brandColor, boxShadow: '0 0 9px ' + skill.brandColor + '88' }}
                  />
                  <span className={'font-mono text-[9px] uppercase tracking-[0.17em] ' + tierMeta.toneClass}>
                    {tierMeta.label}
                  </span>
                </div>
                <h3
                  className="truncate text-[29px] sm:text-[32px] font-normal leading-[1.02] tracking-[-0.025em] text-white/95"
                  style={{ fontFamily: 'var(--title-font)' }}
                >
                  {skill.name}
                </h3>
              </div>
              <div className="mb-0.5 hidden shrink-0 text-right sm:block">
                <div className="font-mono text-[8px] uppercase tracking-[0.17em] text-white/30">Orbital object</div>
                <div className="mt-1 font-mono text-[10px] tracking-[0.12em] text-white/55">
                  {category?.number ?? skill.categoryNumber}.{skillIndex}
                </div>
              </div>
            </div>

            {/* Short editorial insight: one quiet lead-in, then the existing verified copy. */}
            <div className="mt-3 grid grid-cols-[66px_minmax(0,1fr)] gap-3 border-t border-white/[0.07] pt-3">
              <div className="pt-0.5">
                <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/34">Field note</span>
                <span className="mt-1 block font-mono text-[9px] tabular-nums text-white/24">01 / 01</span>
              </div>
              <p className="min-w-0 text-[12.5px] sm:text-[13px] font-normal leading-[1.62] text-purple-50/82">
                {skill.insight}
              </p>
            </div>

            {/* A miniature curved relationship field; the full related nodes remain interactive in the scene. */}
            {relatedSkills.length > 0 && (
              <section className="mt-3 border-t border-white/[0.07] pt-2.5" aria-label="Related technologies">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="font-mono text-[8.5px] uppercase tracking-[0.17em] text-white/42">
                    Connected systems
                  </span>
                  <span className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-white/30 tabular-nums">
                    {String(relatedSkills.length).padStart(2, '0')} linked objects
                  </span>
                </div>

                <div className="relative">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 440 18"
                    preserveAspectRatio="none"
                    className="pointer-events-none absolute left-0 right-0 top-[13px] h-[18px] w-full overflow-visible"
                  >
                    <defs>
                      <linearGradient id="dossierRelationArc" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={skill.brandColor} stopOpacity="0.12" />
                        <stop offset="48%" stopColor="#D8B4FE" stopOpacity="0.42" />
                        <stop offset="100%" stopColor={skill.brandColor} stopOpacity="0.12" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 8 13 C 78 2, 126 2, 165 10 S 264 22, 305 10 S 380 2, 432 13"
                      fill="none"
                      stroke="url(#dossierRelationArc)"
                      strokeWidth="0.9"
                    />
                  </svg>

                  <div className="relative grid grid-cols-5 gap-1">
                    {relatedSkills.map((rel, index) => (
                      <button
                        key={rel.id}
                        type="button"
                        onClick={() => onSelectSkill(rel.id)}
                        aria-label={'Inspect related technology ' + rel.name}
                        title={'Explore ' + rel.name}
                        className="group flex min-w-0 flex-col items-center text-center focus:outline-none focus-visible:ring-1 focus-visible:ring-purple-300/70 rounded-md"
                        style={{ transform: 'translateY(' + nodeOffsets[index % nodeOffsets.length] + 'px)' }}
                      >
                        <span
                          className="relative z-[1] flex h-[27px] w-[27px] items-center justify-center rounded-full border border-white/[0.10] bg-[#10091f]/90 shadow-[0_4px_14px_rgba(0,0,0,0.24)] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-white/25 group-hover:bg-[#211336]"
                          style={{
                            boxShadow: '0 0 0 1px ' + rel.brandColor + '12, 0 4px 14px rgba(0,0,0,0.24)',
                          }}
                        >
                          <TechLogo id={rel.id} name={rel.name} size={17} />
                        </span>
                        <span className="mt-1.5 max-w-full truncate text-[9px] leading-none tracking-[0.01em] text-white/55 transition-colors group-hover:text-white/95">
                          {rel.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </motion.div>
        </div>
      </motion.div>
    );
  }
);

SkillFocusCard.displayName = 'SkillFocusCard';
export default SkillFocusCard;
