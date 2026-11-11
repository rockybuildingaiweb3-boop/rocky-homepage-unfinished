/**
 * LIVING ORBIT ENGINE — A Living Field of Technologies
 *
 * Replaces static 8-sphere category clusters with a deterministic, continuous,
 * multi-layered orbital stream & spatial formation engine for all 88 validated skills.
 *
 * Visual Hierarchy & Sizing (Desktop):
 * - CORE (21 skills):         64px logos, primary equatorial arc (Foreground layer, z=30)
 * - PROFESSIONAL (45 skills): 46px logos, upper & lower counter-flowing arcs (Mid layer, z=20)
 * - ECOSYSTEM (22 skills):    36px logos, deep horizon arc (Peripheral layer, z=10)
 *
 * Modes:
 * 1. Living Orbit ("All Categories"):
 *    4 curved orbital ribbons flowing continuously across the purple planet.
 *    Each ribbon has a curated visible aperture (so ~42 well-spaced logos are visible at any
 *    moment while all 88 cycle smoothly without jumps).
 * 2. Category Formation (when 1 of the 8 categories is selected):
 *    The selected category's 11 technologies transition into a spacious 3-tier curved
 *    formation across the center of the planet, while other categories recede into deep space.
 * 3. Focused Skill State (when a logo is clicked):
 *    Locks the focused technology and summons its 3–7 genuinely related technologies
 *    into clear view with curved relationship filaments.
 */

import {
  SKILLS_DATA,
  SKILL_CATEGORIES,
  SkillItem,
  SkillCategory,
  SkillTier,
} from '../../data/skills';
import { getRelatedSkillIds, getSkillTier } from './skillRelationships';

export interface OrbitalRibbonConfig {
  id: 'core-primary' | 'prof-upper' | 'prof-lower' | 'eco-horizon';
  tier: SkillTier;
  /** Direction of orbital flow: 1 = left-to-right, -1 = right-to-left */
  direction: 1 | -1;
  /** Base speed in normalized phase units [0..1) per second */
  speed: number;
  /** Center Y position (percentage of stage height, 0..100) at x = 50% */
  centerY: number;
  /** Vertical arch curvature delta at the left/right horizons (percentage of stage height) */
  archDeltaY: number;
  /** Horizontal span [minX, maxX] in stage percentage */
  minX: number;
  maxX: number;
  /** Number of items simultaneously visible within the active stage aperture */
  visibleCapacity: number;
  /** Desktop icon pixel size */
  desktopSize: number;
  /** Mobile icon pixel size */
  mobileSize: number;
  /** Parallax multiplier for pointer responsiveness */
  parallaxFactor: number;
  /** Z-index layer */
  zIndex: number;
}

export const ORBITAL_RIBBONS: readonly OrbitalRibbonConfig[] = [
  {
    id: 'prof-upper',
    tier: 'professional',
    direction: -1,
    speed: 0.0085,
    centerY: 20.5,
    archDeltaY: 8.5, // Curves gently downward toward the wings (20.5% -> 29%)
    minX: 4,
    maxX: 96,
    visibleCapacity: 11,
    desktopSize: 46,
    mobileSize: 36,
    parallaxFactor: 0.65,
    zIndex: 20,
  },
  {
    id: 'core-primary',
    tier: 'core',
    direction: 1,
    speed: 0.0105,
    centerY: 41.0,
    archDeltaY: -4.5, // Gentle upward-arching equatorial ribbon across the planet heart
    minX: 4,
    maxX: 96,
    visibleCapacity: 10,
    desktopSize: 64,
    mobileSize: 48,
    parallaxFactor: 1.0,
    zIndex: 30,
  },
  {
    id: 'prof-lower',
    tier: 'professional',
    direction: 1,
    speed: 0.0078,
    centerY: 61.5,
    archDeltaY: -6.5, // Cradles the lower hemisphere of the planet (61.5% -> 55%)
    minX: 4,
    maxX: 96,
    visibleCapacity: 11,
    desktopSize: 46,
    mobileSize: 36,
    parallaxFactor: 0.7,
    zIndex: 20,
  },
  {
    id: 'eco-horizon',
    tier: 'ecosystem',
    direction: -1,
    speed: 0.0065,
    centerY: 79.0,
    archDeltaY: -7.5, // Outer horizon arc (79% -> 71.5%)
    minX: 6,
    maxX: 94,
    visibleCapacity: 11,
    desktopSize: 36,
    mobileSize: 30,
    parallaxFactor: 0.4,
    zIndex: 10,
  },
] as const;

export interface LivingSkillParticle {
  skill: SkillItem;
  tier: SkillTier;
  category: SkillCategory;
  ribbonId: OrbitalRibbonConfig['id'];
  ribbonIndex: number;
  /** Index within its assigned ribbon */
  slotIndex: number;
  /** Total items in its assigned ribbon */
  ribbonTotal: number;
  /** Initial normalized phase [0, 1) along the full ribbon cycle */
  initialPhase: number;
  /** Deterministic sine oscillation phase (radians) */
  oscillationPhase: number;
  /** Vertical oscillation amplitude in percentage units */
  oscillationAmpY: number;
  /** Desktop logo size in px */
  desktopSize: number;
  /** Mobile logo size in px */
  mobileSize: number;
  /** Target position when its category is selected (Category Formation Mode) */
  categoryFormationPos: {
    x: number;
    y: number;
    scale: number;
  };
  /** Deep-space recessed position when another category is selected */
  recessedPos: {
    x: number;
    y: number;
  };
}

export interface EvaluatedParticleFrame {
  id: string;
  skill: SkillItem;
  tier: SkillTier;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  zIndex: number;
  isVisibleInAperture: boolean;
  isFocused: boolean;
  isRelated: boolean;
  isCategoryActive: boolean;
}

/**
 * Interleaves a list of skills by category so same-category technologies
 * are evenly distributed along each orbital ribbon rather than clumped.
 */
function interleaveByCategory(items: SkillItem[]): SkillItem[] {
  const byCat = new Map<string, SkillItem[]>();
  for (const cat of SKILL_CATEGORIES) {
    byCat.set(
      cat.id,
      items.filter((s) => s.categoryId === cat.id)
    );
  }

  const result: SkillItem[] = [];
  let added = true;
  let round = 0;
  while (added) {
    added = false;
    for (let i = 0; i < SKILL_CATEGORIES.length; i++) {
      const catId = SKILL_CATEGORIES[(i + round * 3) % SKILL_CATEGORIES.length].id;
      const bucket = byCat.get(catId);
      if (bucket && bucket.length > 0) {
        const next = bucket.shift()!;
        result.push(next);
        added = true;
      }
    }
    round++;
  }
  return result;
}

/**
 * Computes the curated 11-node Category Formation coordinates for a single category.
 * Organizes the category's 11 technologies into 3 clear curved tiers across the planet:
 * - Core tier: Upper-central focal arc (y ~ 31%..36%)
 * - Professional tier: Mid-equatorial arc (y ~ 53%..59%)
 * - Ecosystem tier: Lower horizon arc (y ~ 74%..78%)
 */
function computeCategoryFormationMap(): Map<string, { x: number; y: number; scale: number }> {
  const map = new Map<string, { x: number; y: number; scale: number }>();

  for (const cat of SKILL_CATEGORIES) {
    const catSkills = SKILLS_DATA.filter((s) => s.categoryId === cat.id);
    const core = catSkills.filter((s) => s.tier === 'core');
    const prof = catSkills.filter((s) => s.tier === 'professional');
    const eco = catSkills.filter((s) => s.tier === 'ecosystem');

    const placeArc = (
      list: SkillItem[],
      centerY: number,
      archDropY: number,
      spreadX: number,
      scale: number
    ) => {
      const n = list.length;
      if (n === 0) return;
      for (let i = 0; i < n; i++) {
        // Normalized position u in [-1, 1]
        const u = n === 1 ? 0 : (i / (n - 1)) * 2 - 1;
        const x = 50 + u * spreadX;
        const y = centerY + u * u * archDropY + (i % 2 === 0 ? -1.2 : 1.2);
        map.set(list[i].id, {
          x: parseFloat(x.toFixed(2)),
          y: parseFloat(y.toFixed(2)),
          scale,
        });
      }
    };

    placeArc(core, 32.5, 4.5, core.length <= 2 ? 15 : core.length === 3 ? 23 : 29, 1.12);
    placeArc(prof, 55.0, -5.0, prof.length <= 4 ? 28 : 35, 1.0);
    placeArc(eco, 76.0, -4.5, eco.length <= 2 ? 18 : eco.length === 3 ? 26 : 33, 0.94);
  }

  return map;
}

/**
 * Builds the canonical 88 LivingSkillParticle definitions.
 */
export function buildLivingOrbitParticles(): LivingSkillParticle[] {
  const categoryMap = new Map<string, SkillCategory>(
    SKILL_CATEGORIES.map((c) => [c.id, c])
  );
  const formationMap = computeCategoryFormationMap();

  // Partition canonical 88 skills strictly by their SkillItem.tier
  const coreSkills = interleaveByCategory(SKILLS_DATA.filter((s) => s.tier === 'core'));
  const profSkills = interleaveByCategory(SKILLS_DATA.filter((s) => s.tier === 'professional'));
  const ecoSkills = interleaveByCategory(SKILLS_DATA.filter((s) => s.tier === 'ecosystem'));

  // Split professional skills evenly between upper and lower counter-flowing ribbons
  const halfProf = Math.ceil(profSkills.length / 2);
  const profUpperSkills = profSkills.slice(0, halfProf);
  const profLowerSkills = profSkills.slice(halfProf);

  const ribbonBuckets: Record<OrbitalRibbonConfig['id'], SkillItem[]> = {
    'prof-upper': profUpperSkills,
    'core-primary': coreSkills,
    'prof-lower': profLowerSkills,
    'eco-horizon': ecoSkills,
  };

  const particles: LivingSkillParticle[] = [];
  let globalIdx = 0;

  ORBITAL_RIBBONS.forEach((ribbon, ribbonIndex) => {
    const bucket = ribbonBuckets[ribbon.id];
    const total = bucket.length;

    bucket.forEach((skill, slotIndex) => {
      const cat = categoryMap.get(skill.categoryId) || SKILL_CATEGORIES[0];
      const formation = formationMap.get(skill.id) || { x: 50, y: 50, scale: 1 };

      // Recessed position around outer perimeter so unselected categories drift out of the way
      const perimAngle = ((globalIdx * 137.5) % 360) * (Math.PI / 180);
      const recessedX = 50 + Math.cos(perimAngle) * 44;
      const recessedY = 50 + Math.sin(perimAngle) * 41;

      particles.push({
        skill,
        tier: skill.tier,
        category: cat,
        ribbonId: ribbon.id,
        ribbonIndex,
        slotIndex,
        ribbonTotal: total,
        initialPhase: slotIndex / total,
        oscillationPhase: ((globalIdx * 1.6180339) % (Math.PI * 2)),
        oscillationAmpY: skill.tier === 'core' ? 1.35 : skill.tier === 'professional' ? 1.1 : 0.85,
        desktopSize: ribbon.desktopSize,
        mobileSize: ribbon.mobileSize,
        categoryFormationPos: formation,
        recessedPos: {
          x: parseFloat(recessedX.toFixed(2)),
          y: parseFloat(recessedY.toFixed(2)),
        },
      });

      globalIdx++;
    });
  });

  return particles;
}

export const LIVING_ORBIT_PARTICLES: readonly LivingSkillParticle[] =
  buildLivingOrbitParticles();

/**
 * Evaluates the instantaneous 2D stage position, scale, and opacity for a particle
 * along its curved orbital ribbon at elapsed time `timeSec`.
 *
 * Uses a continuous virtual track where `visibleRatio = visibleCapacity / ribbonTotal`
 * of the phase cycle `[0, visibleRatio]` maps across the visible stage `[minX, maxX]`.
 * Items outside the visible aperture wrap smoothly behind the planet in deep space (`opacity: 0`),
 * guaranteeing generous spacing between visible logos while cycling through all 88 skills!
 */
export function evaluateRibbonTrajectory(
  particle: LivingSkillParticle,
  ribbon: OrbitalRibbonConfig,
  timeSec: number,
  pointerOffset: { x: number; y: number } = { x: 0, y: 0 }
): {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  isVisibleInAperture: boolean;
} {
  // Continuous wrapped phase in [0, 1)
  const rawPhase =
    particle.initialPhase + timeSec * ribbon.speed * (ribbon.direction === 1 ? 1 : -1);
  const phase = ((rawPhase % 1) + 1) % 1;

  // Fraction of the cycle that is on the front visible hemisphere of the orbit
  const apertureFraction = Math.min(1.0, ribbon.visibleCapacity / particle.ribbonTotal);

  if (phase > apertureFraction) {
    // Behind the planet (back hemisphere of the orbit) — keep off-stage cleanly
    const backProgress = (phase - apertureFraction) / Math.max(0.0001, 1 - apertureFraction);
    const backX = ribbon.maxX - backProgress * (ribbon.maxX - ribbon.minX);
    return {
      x: backX,
      y: ribbon.centerY,
      scale: 0.6,
      opacity: 0,
      isVisibleInAperture: false,
    };
  }

  // Normalized progress `u` across the visible front arc: [0, 1]
  const u = phase / apertureFraction;
  // Centered coordinate `c` in [-1, 1]
  const c = u * 2 - 1;

  // Base X along the arc with slight cosine foreshortening near the planet horizons
  const foreshortenedC = Math.sin((c * Math.PI) / 2) * 0.35 + c * 0.65;
  const halfSpanX = (ribbon.maxX - ribbon.minX) / 2;
  const centerX = (ribbon.minX + ribbon.maxX) / 2;
  const baseX = centerX + foreshortenedC * halfSpanX;

  // Curved orbital Y trajectory + organic vertical sine oscillation
  const archY = ribbon.centerY + c * c * ribbon.archDeltaY;
  const waveY =
    Math.sin(timeSec * 1.35 + particle.oscillationPhase) * particle.oscillationAmpY +
    Math.cos(timeSec * 0.75 + particle.slotIndex * 0.9) * (particle.oscillationAmpY * 0.45);

  const x = baseX + pointerOffset.x * ribbon.parallaxFactor;
  const y = archY + waveY + pointerOffset.y * ribbon.parallaxFactor;

  // Smooth horizon entry/exit envelope (fades in over first 11% and out over last 11% of arc)
  const edgeDist = Math.min(u, 1 - u);
  const horizonFade = edgeDist < 0.12 ? Math.sin((edgeDist / 0.12) * (Math.PI / 2)) : 1.0;

  // 3D spherical depth scale: slightly larger near the center of the planet arc (c = 0)
  const depthScale = (1 - c * c * 0.16) * (0.85 + 0.15 * horizonFade);

  const baseTierOpacity =
    particle.tier === 'core' ? 1.0 : particle.tier === 'professional' ? 0.94 : 0.84;

  return {
    x,
    y,
    scale: depthScale,
    opacity: horizonFade * baseTierOpacity,
    isVisibleInAperture: horizonFade > 0.05,
  };
}

/**
 * Computes deterministic, non-overlapping satellite positions around a focused skill
 * for any related technologies that would otherwise be off-aperture or recessed.
 */
export function computeFocusedNetworkPositions(
  focusedSkillId: string,
  currentPositions: Map<string, { x: number; y: number; isVisible: boolean }>
): Map<string, { x: number; y: number }> {
  const result = new Map<string, { x: number; y: number }>();
  const focusedCurrent = currentPositions.get(focusedSkillId);

  // Anchor the focused skill near its current visible spot (clamped to a comfortable inner stage zone)
  const anchorX =
    focusedCurrent && focusedCurrent.isVisible
      ? Math.max(24, Math.min(76, focusedCurrent.x))
      : 50;
  const anchorY =
    focusedCurrent && focusedCurrent.isVisible
      ? Math.max(22, Math.min(62, focusedCurrent.y))
      : 38;

  const placedPoints: { x: number; y: number }[] = [{ x: anchorX, y: anchorY }];
  result.set(focusedSkillId, { x: anchorX, y: anchorY });

  const relatedIds = getRelatedSkillIds(focusedSkillId);
  if (relatedIds.length === 0) return result;

  const isWellSpaced = (pt: { x: number; y: number }, minDx = 11.5, minDy = 13.5) => {
    for (const existing of placedPoints) {
      const ndx = (pt.x - existing.x) / minDx;
      const ndy = (pt.y - existing.y) / minDy;
      if (ndx * ndx + ndy * ndy < 1.0) return false;
    }
    return true;
  };

  // Pass 1: Keep related skills that are already visible on stage and well-spaced above the focus card
  const needsSummoning: string[] = [];
  for (const relId of relatedIds) {
    const existing = currentPositions.get(relId);
    if (
      existing &&
      existing.isVisible &&
      existing.x >= 10 &&
      existing.x <= 90 &&
      existing.y >= 14 &&
      existing.y <= 58 &&
      isWellSpaced(existing)
    ) {
      const pt = { x: existing.x, y: existing.y };
      result.set(relId, pt);
      placedPoints.push(pt);
    } else {
      needsSummoning.push(relId);
    }
  }

  // Pass 2: Place summoned related skills onto non-overlapping orbital candidate slots above the focus card
  const candidateSlots: { x: number; y: number }[] = [];
  const rings = [
    { rx: 22, ry: 15, samples: 12 },
    { rx: 34, ry: 21, samples: 16 },
    { rx: 45, ry: 25, samples: 16 },
  ];
  for (const ring of rings) {
    for (let s = 0; s < ring.samples; s++) {
      const angle = -Math.PI / 2 + (s / ring.samples) * Math.PI * 2;
      const cx = anchorX + Math.cos(angle) * ring.rx;
      const cy = anchorY + Math.sin(angle) * ring.ry;
      if (cx >= 11 && cx <= 89 && cy >= 14 && cy <= 58) {
        candidateSlots.push({ x: cx, y: cy });
      }
    }
  }

  needsSummoning.forEach((relId) => {
    let bestSlot = candidateSlots[0] || { x: 50, y: 50 };
    let bestClearance = -1;

    for (const slot of candidateSlots) {
      let minClearance = Infinity;
      for (const p of placedPoints) {
        const dx = (slot.x - p.x) / 12.0;
        const dy = (slot.y - p.y) / 14.0;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < minClearance) minClearance = d;
      }
      if (minClearance > bestClearance) {
        bestClearance = minClearance;
        bestSlot = slot;
      }
    }

    result.set(relId, bestSlot);
    placedPoints.push(bestSlot);
  });

  return result;
}

export { getRelatedSkillIds, getSkillTier };
