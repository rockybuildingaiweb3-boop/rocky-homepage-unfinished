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
  anchorSide?: 'left' | 'right' | 'center';
  isMobileLayout?: boolean;
}

const TIER_EDITORIAL_META: Record<
  SkillItem['tier'],
  { label: string; toneClass: string }
> = {
  core: {
    label: 'Core Architecture',
    toneClass: 'text-amber-200/85',
  },
  professional: {
    label: 'Production Stack',
    toneClass: 'text-purple-200/85',
  },
  ecosystem: {
    label: 'Ecosystem Tooling',
    toneClass: 'text-sky-200/80',
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
  panelWidth?: number;
  panelHeight?: number;
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

export const DOSSIER_DESKTOP_WIDTH = 440;
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
 * Computes collision-aware negative-space placement for the Orbital Editorial 3.0
 * floating typographic composition across left/right upper, mid, and lower flanks,
 * strictly avoiding:
 * 1. The central planetary focal sphere & nebula core
 * 2. The focused hero technology mark
 * 3. Local spatial constellation satellites & their unboxed labels
 * 4. Stage boundaries
 */
export function computeOrbitalDossierPlacement({
  stageWidth,
  stageHeight,
  selectedPos,
  relatedPositions,
  panelWidth: customWidth,
  panelHeight: customHeight,
}: DossierPlacementInput): DossierPlacementResult {
  const safeW = Math.max(480, stageWidth);
  const safeH = Math.max(420, stageHeight);

  const edgeMarginX = safeW >= 1200 ? 32 : 20;
  const topMargin = 20;
  const bottomMargin = 20;

  const panelWidth =
    customWidth ??
    (safeW >= 1120
      ? DOSSIER_DESKTOP_WIDTH
      : Math.max(360, Math.min(440, safeW - edgeMarginX * 2)));
  const panelHeight = Math.max(210, Math.min(410, customHeight ?? DOSSIER_ESTIMATED_HEIGHT));

  const minX = edgeMarginX;
  const maxX = Math.max(minX, Math.round(safeW - panelWidth - edgeMarginX));
  const minY = topMargin;
  const maxY = Math.max(minY, Math.round(safeH - panelHeight - bottomMargin));

  // Central planetary sphere + bright core halo
  const planetBox: DossierStageRect = {
    left: safeW * 0.365,
    top: safeH * 0.21,
    right: safeW * 0.635,
    bottom: safeH * 0.59,
  };

  const selPxX = (selectedPos.x / 100) * safeW;
  const selPxY = (selectedPos.y / 100) * safeH;
  const selectedBox: DossierStageRect = {
    left: selPxX - 84,
    top: selPxY - 72,
    right: selPxX + 84,
    bottom: selPxY + 74,
  };

  const relatedBoxes: DossierStageRect[] = relatedPositions.map((rp) => {
    const rx = (rp.x / 100) * safeW;
    const ry = (rp.y / 100) * safeH;
    return {
      left: rx - 62,
      top: ry - 50,
      right: rx + 62,
      bottom: ry + 62,
    };
  });

  const leftInset = Math.min(maxX, Math.round(minX + safeW * 0.03));
  const rightInset = Math.max(minX, Math.round(maxX - safeW * 0.03));

  const rawCandidates: { x: number; y: number; side: 'left' | 'right' | 'center' }[] = [
    // Asymmetric editorial mid & upper-mid opposite bands (first-class open-space zones)
    { x: leftInset, y: Math.round(safeH * 0.25), side: 'left' },
    { x: rightInset, y: Math.round(safeH * 0.25), side: 'right' },
    { x: leftInset, y: Math.round((safeH - panelHeight) * 0.46), side: 'left' },
    { x: rightInset, y: Math.round((safeH - panelHeight) * 0.46), side: 'right' },
    { x: leftInset, y: Math.round(safeH * 0.54), side: 'left' },
    { x: rightInset, y: Math.round(safeH * 0.54), side: 'right' },
    // Edge-aligned flank candidates when tight on clearance
    { x: minX, y: Math.round(safeH * 0.24), side: 'left' },
    { x: maxX, y: Math.round(safeH * 0.24), side: 'right' },
    { x: minX, y: Math.round((safeH - panelHeight) * 0.48), side: 'left' },
    { x: maxX, y: Math.round((safeH - panelHeight) * 0.48), side: 'right' },
    { x: minX, y: maxY - 8, side: 'left' },
    { x: maxX, y: maxY - 8, side: 'right' },
    // Upper flanks
    { x: minX, y: minY + 12, side: 'left' },
    { x: maxX, y: minY + 12, side: 'right' },
    // Lower-center fallback only when both flanks overlap
    { x: Math.round((safeW - panelWidth) * 0.5), y: maxY, side: 'center' },
  ];

  // Deduplicate clamped candidates
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
    top: Math.round((safeH - panelHeight) * 0.46),
    width: panelWidth,
    height: panelHeight,
    anchorSide: 'right',
    planetOverlap: 0,
    selectedOverlap: 0,
    relatedOverlap: 0,
  };
  let bestScore = Infinity;

  const isWideDesktop = safeW >= 1024;
  const preferredSide: 'left' | 'right' = selectedPos.x < 50 ? 'right' : 'left';

  // Target a graceful diagonal editorial counterbalance to the selected cluster's vertical position
  const idealTopY =
    selectedPos.y > 56
      ? safeH * 0.28
      : selectedPos.y < 38
      ? safeH * 0.48
      : (safeH - panelHeight) * 0.46;

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

    // Clearance envelope around hero and related satellites
    const selDist = rectToPointDistance(rect, selPxX, selPxY);
    const selClearancePenalty = selDist < 108 ? (108 - selDist) * 320 : 0;

    let relClearancePenalty = 0;
    for (const rp of relatedPositions) {
      const rx = (rp.x / 100) * safeW;
      const ry = (rp.y / 100) * safeH;
      const d = rectToPointDistance(rect, rx, ry);
      if (d < 78) relClearancePenalty += (78 - d) * 180;
    }

    // Asymmetric opposite-hemisphere composition bias
    let compositionBias = 0;
    if (isWideDesktop && cand.side !== 'center') {
      compositionBias -= 3200;
      if (cand.side === preferredSide) {
        compositionBias -= 2200;
      }
    }

    // Prefer balanced diagonal poise in negative space over sticking arbitrarily at floor/ceiling
    const verticalBalancePenalty = Math.abs(cand.top - idealTopY) * 2.2;

    const score =
      planetOverlap * 24 +
      selectedOverlap * 18 +
      relatedOverlap * 14 +
      selClearancePenalty +
      relClearancePenalty +
      compositionBias +
      verticalBalancePenalty;

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
 * SkillFocusCard — ORBITAL EDITORIAL 3.0
 *
 * Floating borderless editorial annotation integrated directly into the cosmic stage.
 * - Desktop: Zero glassmorphism rectangle, zero outer border, zero duplicated icon strip,
 *   44–52px serif display title, concise verified technical insight, quiet minimal close.
 * - Mobile: Cohesive borderless dark atmospheric bottom-sheet composition with tap-safe
 *   related-technology navigation links.
 */
export const SkillFocusCard: React.FC<SkillFocusCardProps> = memo(
  ({
    skill,
    onSelectSkill,
    onClose,
    widthPx,
    anchorSide = 'right',
    isMobileLayout = false,
  }) => {
    const prefersReducedMotion = useReducedMotion();
    const category = SKILL_CATEGORIES.find((c) => c.id === skill.categoryId);
    const tierMeta = TIER_EDITORIAL_META[skill.tier];

    const relatedSkills = React.useMemo(() => {
      const ids = getRelatedSkillIds(skill.id).slice(0, 5);
      return ids
        .map((id) => SKILLS_DATA.find((s) => s.id === id))
        .filter((s): s is SkillItem => Boolean(s));
    }, [skill.id]);

    // Scale display headline subtly only on unusually long multi-word names while staying 44–50px on standard names
    const desktopTitleSizeClass =
      skill.name.length > 20
        ? 'text-[38px] lg:text-[44px]'
        : skill.name.length > 13
        ? 'text-[44px] lg:text-[46px]'
        : 'text-[44px] lg:text-[50px]';

    if (isMobileLayout) {
      return (
        <motion.div
          key={skill.id}
          role="dialog"
          aria-modal="false"
          aria-label={skill.name + ' technical overview'}
          onClick={(e) => e.stopPropagation()}
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
          transition={{
            duration: prefersReducedMotion ? 0.1 : 0.24,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            background:
              'linear-gradient(180deg, rgba(5, 2, 16, 0) 0%, rgba(7, 4, 22, 0.80) 14%, rgba(5, 2, 16, 0.94) 100%)',
          }}
          className="relative isolate w-full pt-5 pb-4 px-4"
        >
          {/* Delicate top starlight fade line, not a boxed border */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-4 top-2 h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent, ' +
                skill.brandColor +
                '80 28%, rgba(233,213,255,0.28) 65%, transparent)',
            }}
          />

          {/* 1. Category index & quiet minimal dismiss */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
              <span className="shrink-0 text-purple-200/85 tabular-nums">
                {category?.number ?? skill.categoryNumber}
              </span>
              <span className="text-white/25">/</span>
              <span className="truncate text-white/75">{category?.title ?? 'Technology'}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close technology insight"
              className="flex h-11 w-11 -mr-2 shrink-0 items-center justify-center text-white/60 transition-colors hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-purple-300/70"
            >
              <span className="text-[20px] leading-none">×</span>
            </button>
          </div>

          {/* 2. Dominant Serif Title */}
          <h3
            className="mt-1 text-[38px] sm:text-[42px] font-normal leading-[0.98] tracking-[-0.025em] text-white/95"
            style={{
              fontFamily: 'var(--title-font)',
              textShadow: '0 2px 20px rgba(4, 2, 14, 0.9)',
            }}
          >
            {skill.name}
          </h3>

          {/* 3. Tier Designation */}
          <div className="mt-2 flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="h-[1.5px] w-5"
              style={{
                backgroundColor: skill.brandColor,
                boxShadow: '0 0 10px ' + skill.brandColor + '90',
              }}
            />
            <span className={'font-mono text-[10px] uppercase tracking-[0.18em] ' + tierMeta.toneClass}>
              {tierMeta.label}
            </span>
          </div>

          {/* 4. Concise Editorial Insight */}
          <p className="mt-3.5 text-[15px] font-normal leading-[1.62] text-purple-50/90">
            {skill.insight}
          </p>

          {/* 5. Mobile Connected Systems Navigation (tap-safe, borderless) */}
          {relatedSkills.length > 0 && (
            <section className="mt-4 pt-3 border-t border-white/[0.08]" aria-label="Connected technologies">
              <div className="mb-1.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/45">
                Connected systems · {String(relatedSkills.length).padStart(2, '0')}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {relatedSkills.map((rel) => (
                  <button
                    key={rel.id}
                    type="button"
                    onClick={() => onSelectSkill(rel.id)}
                    aria-label={'Inspect related technology ' + rel.name}
                    className="inline-flex min-h-[44px] items-center gap-2 py-1 text-[12.5px] text-white/75 transition-colors hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-purple-300/70"
                  >
                    <TechLogo id={rel.id} name={rel.name} size={16} />
                    <span>{rel.name}</span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </motion.div>
      );
    }

    const veilGradientCenter = anchorSide === 'left' ? '38% 50%' : '58% 50%';

    return (
      <motion.div
        key={skill.id}
        role="dialog"
        aria-modal="false"
        aria-label={skill.name + ' editorial annotation'}
        onClick={(e) => e.stopPropagation()}
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 5 }}
        transition={{
          duration: prefersReducedMotion ? 0.1 : 0.24,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          width: widthPx ? String(widthPx) + 'px' : undefined,
        }}
        className="relative isolate w-full py-2 px-1"
      >
        {/* Localized soft feathered atmospheric veil purely for contrast — closest-side fades to 0 before bounds so zero rectangle edge exists */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-32 -inset-y-24 -z-10"
          style={{
            background:
              'radial-gradient(closest-side at ' +
              veilGradientCenter +
              ', rgba(5, 2, 16, 0.60) 0%, rgba(5, 2, 16, 0.34) 48%, rgba(5, 2, 16, 0.08) 76%, transparent 94%)',
          }}
        />

        <motion.div
          key={skill.id}
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.08 : 0.2, ease: 'easeOut' }}
          className="relative"
        >
          {/* 1. Small Category Index & Technical Domain + Quiet Minimal Dismiss */}
          <header className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.19em] text-white/55">
              <span className="shrink-0 text-purple-200/85 tabular-nums">
                {category?.number ?? skill.categoryNumber}
              </span>
              <span className="text-white/25">/</span>
              <span className="truncate text-white/75">{category?.title ?? 'Technology'}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close technology insight"
              title="Close (Esc)"
              className="group -mr-1.5 flex h-8 w-8 shrink-0 items-center justify-center text-white/45 transition-colors duration-200 hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-purple-300/70"
            >
              <span className="text-[18px] leading-none transition-transform duration-200 group-hover:rotate-90">
                ×
              </span>
            </button>
          </header>

          {/* 2. Dominant Technology Title in Editorial Serif Display Font (44–50px) */}
          <h3
            className={
              'mt-2.5 font-normal leading-[0.98] tracking-[-0.025em] text-white/95 ' +
              desktopTitleSizeClass
            }
            style={{
              fontFamily: 'var(--title-font)',
              textShadow: '0 2px 24px rgba(4, 2, 14, 0.92)',
            }}
          >
            {skill.name}
          </h3>

          {/* 3. Tier Designation with Restrained Brand Accent */}
          <div className="mt-3 flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="h-[1.5px] w-6"
              style={{
                backgroundColor: skill.brandColor,
                boxShadow: '0 0 10px ' + skill.brandColor + '90',
              }}
            />
            <span className={'font-mono text-[10px] uppercase tracking-[0.18em] ' + tierMeta.toneClass}>
              {tierMeta.label}
            </span>
          </div>

          {/* 4. Concise Technical Insight (existing verified prose only) */}
          <p
            className="mt-4 max-w-[38ch] text-[15.5px] font-normal leading-[1.64] text-purple-50/90"
            style={{ textShadow: '0 1px 14px rgba(4, 2, 14, 0.85)' }}
          >
            {skill.insight}
          </p>

          {/* 5. Restrained Connected-Technologies Index (spatial constellation owns interaction) */}
          {relatedSkills.length > 0 && (
            <div className="mt-4 flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/45">
              <span>Connected systems</span>
              <span className="text-white/22">·</span>
              <span className="tabular-nums text-white/60">
                {String(relatedSkills.length).padStart(2, '0')}
              </span>
            </div>
          )}
        </motion.div>
      </motion.div>
    );
  }
);

SkillFocusCard.displayName = 'SkillFocusCard';
export default SkillFocusCard;

