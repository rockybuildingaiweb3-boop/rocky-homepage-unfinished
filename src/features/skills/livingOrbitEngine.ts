/**
 * ORBITAL KINETIC SCULPTURE — Spatial Composition & Trajectory Engine
 *
 * Art-directed 2.5D/3D spatial engine for the 88 validated technologies:
 *
 * 1. FEATURED TECHNOLOGY ANCHORS (7 Flagship Core Marks):
 *    - Suspended in an asymmetric, non-linear, three-dimensional composition framing
 *      the rotating purple planet (leaving the central planetary core unobstructed).
 *    - Deliberately varied display scales (62px–80px) for optical hierarchy.
 *    - Near-stationary zero-G Lissajous breathing + magnetic cursor attraction.
 *
 * 2. THREE GENUINELY DISTINCT 3D CUBIC BÉZIER SPATIAL TRAJECTORIES:
 *    - Replaces horizontal rows with three tilted, sweeping 3D Cubic Bézier splines:
 *      a) Trajectory A (SW -> NE Ascending S-Spline): Sweeps from lower-left flank,
 *         crests over the upper-left & upper-right planetary shoulders, exits mid-right.
 *      b) Trajectory B (NW -> SE Descending Catenary): Enters high upper-left, plunges
 *         around the western limb and beneath the southern nadir, rises lower-right.
 *      c) Trajectory C (NNE -> SSW High-Inclination Polar Arc): Steep meridian path
 *         curving around the eastern hemisphere in deep space.
 *    - Non-uniform Golden-Ratio phase staggering + perpendicular normal offsets ensure
 *      logos never align into mechanical horizontal rows or uniform chains.
 *    - Controlled simultaneous visibility (~20 moving logos + 7 anchors = ~27 visible
 *      on desktop at any moment), cycling seamlessly through all 88 skills.
 *
 * 3. ASYMMETRIC SCULPTURAL CATEGORY FORMATIONS:
 *    - Selecting any of the 8 categories reorganizes its 11 technologies into an
 *      asymmetric spatial composition around the planet (never horizontal rows).
 */

import {
  SKILLS_DATA,
  SKILL_CATEGORIES,
  SkillItem,
  SkillCategory,
  SkillTier,
} from '../../data/skills';
import { getRelatedSkillIds, getSkillTier } from './skillRelationships';

export interface Point2D {
  x: number;
  y: number;
}

export interface CubicBezierSplineConfig {
  id: 'spline-ascending' | 'spline-catenary' | 'spline-meridian';
  /** 4 control points in stage percentage space (0..100) */
  p0: Point2D;
  p1: Point2D;
  p2: Point2D;
  p3: Point2D;
  /** Direction of travel along parameter u: 1 = 0->1, -1 = 1->0 */
  direction: 1 | -1;
  /** Base speed in normalized cycle units per second */
  speed: number;
  /** Number of items simultaneously visible along the active spline segment */
  visibleCapacity: number;
  /** Depth range [minZ, maxZ] where 1.0 = foreground, 0.5 = deep background */
  depthRange: [number, number];
  /** Peak depth parameter uPeak in [0, 1] where the spline passes closest to the viewer */
  uPeak: number;
  /** Parallax multiplier for pointer movement */
  parallaxFactor: number;
}

/**
 * 7 Featured Core Technology Anchors
 * Arranged asymmetrically around the purple planet (center ~ 50%, 48%).
 * No two anchors share a horizontal row, vertical column, or identical pixel size.
 */
export interface FeaturedAnchorSpec {
  id: string;
  x: number;
  y: number;
  /** Deliberately varied desktop pixel size (62px–80px) */
  desktopSize: number;
  mobileSize: number;
  /** Spatial depth plane (0.88..1.05) */
  depth: number;
  /** Zero-G breathing amplitude in stage % */
  breathAmpX: number;
  breathAmpY: number;
  breathFreq: number;
}

export const FEATURED_ANCHOR_SPECS: readonly FeaturedAnchorSpec[] = [
  {
    id: 'typescript',
    x: 23.5,
    y: 34.0,
    desktopSize: 76,
    mobileSize: 50,
    depth: 1.04,
    breathAmpX: 0.45,
    breathAmpY: 0.75,
    breathFreq: 0.85,
  },
  {
    id: 'react',
    x: 35.5,
    y: 17.5,
    desktopSize: 68,
    mobileSize: 46,
    depth: 0.96,
    breathAmpX: 0.55,
    breathAmpY: 0.65,
    breathFreq: 0.72,
  },
  {
    id: 'threedotjs',
    x: 28.0,
    y: 64.5,
    desktopSize: 74,
    mobileSize: 48,
    depth: 1.0,
    breathAmpX: 0.5,
    breathAmpY: 0.8,
    breathFreq: 0.78,
  },
  {
    id: 'openai',
    x: 73.5,
    y: 25.5,
    desktopSize: 78,
    mobileSize: 50,
    depth: 1.05,
    breathAmpX: 0.48,
    breathAmpY: 0.72,
    breathFreq: 0.82,
  },
  {
    id: 'langgraph',
    x: 80.5,
    y: 51.0,
    desktopSize: 64,
    mobileSize: 44,
    depth: 0.93,
    breathAmpX: 0.6,
    breathAmpY: 0.65,
    breathFreq: 0.68,
  },
  {
    id: 'solidity',
    x: 66.0,
    y: 71.5,
    desktopSize: 66,
    mobileSize: 45,
    depth: 0.95,
    breathAmpX: 0.52,
    breathAmpY: 0.7,
    breathFreq: 0.75,
  },
  {
    id: 'postgresql',
    x: 45.5,
    y: 78.5,
    desktopSize: 62,
    mobileSize: 44,
    depth: 0.91,
    breathAmpX: 0.45,
    breathAmpY: 0.6,
    breathFreq: 0.64,
  },
] as const;

/**
 * 3 Genuinely Distinct 3D Cubic Bézier Spatial Trajectories
 * Frame and interact with the planet asymmetrically without forming horizontal strips.
 */
export const SPATIAL_SPLINES: readonly CubicBezierSplineConfig[] = [
  {
    // Trajectory 1: Tilted SW -> NE Ascending S-Curve cresting the upper planetary shoulders
    id: 'spline-ascending',
    p0: { x: 6, y: 82 },
    p1: { x: 18, y: 10 },
    p2: { x: 66, y: 12 },
    p3: { x: 94, y: 44 },
    direction: 1,
    speed: 0.0082,
    visibleCapacity: 8,
    depthRange: [0.78, 1.06],
    uPeak: 0.42,
    parallaxFactor: 0.9,
  },
  {
    // Trajectory 2: Counter-Orbital NW -> SE Descending Catenary sweeping below the planet
    id: 'spline-catenary',
    p0: { x: 7, y: 16 },
    p1: { x: 14, y: 78 },
    p2: { x: 58, y: 92 },
    p3: { x: 93, y: 62 },
    direction: -1,
    speed: 0.0066,
    visibleCapacity: 8,
    depthRange: [0.72, 0.98],
    uPeak: 0.58,
    parallaxFactor: 0.65,
  },
  {
    // Trajectory 3: High-Inclination Polar Meridian Ribbon in deep ambient space
    id: 'spline-meridian',
    p0: { x: 58, y: 7 },
    p1: { x: 95, y: 24 },
    p2: { x: 92, y: 82 },
    p3: { x: 30, y: 92 },
    direction: 1,
    speed: 0.0052,
    visibleCapacity: 6,
    depthRange: [0.62, 0.86],
    uPeak: 0.48,
    parallaxFactor: 0.42,
  },
] as const;

export interface LivingSkillParticle {
  skill: SkillItem;
  tier: SkillTier;
  category: SkillCategory;
  /** True if this skill is one of the 7 Featured Core Anchors */
  isFeaturedAnchor: boolean;
  anchorSpec?: FeaturedAnchorSpec;
  splineId: CubicBezierSplineConfig['id'];
  splineIndex: number;
  slotIndex: number;
  splineTotal: number;
  /** Non-uniform initial phase in [0, 1) along the spline cycle */
  initialPhase: number;
  /** Signed perpendicular offset (in stage %) from the spline centerline so items form a spatial volume, not a single-file line */
  normalOffset: number;
  /** Deterministic oscillation phase (radians) */
  oscillationPhase: number;
  /** Individual drift amplitude */
  driftAmp: number;
  /** Base desktop pixel size (before optical normalization and depth scaling) */
  desktopSize: number;
  /** Base mobile pixel size */
  mobileSize: number;
  /** Asymmetric sculptural target position when its category is selected */
  categoryFormationPos: {
    x: number;
    y: number;
    scale: number;
    depth: number;
  };
  /** Deep-space peripheral coordinates when another category is selected */
  recessedPos: {
    x: number;
    y: number;
  };
}

/**
 * Evaluates a 2D Cubic Bézier point B(u) and its unit normal vector N(u) for u in [0, 1].
 */
export function evaluateCubicBezier(
  p0: Point2D,
  p1: Point2D,
  p2: Point2D,
  p3: Point2D,
  u: number
): { x: number; y: number; nx: number; ny: number } {
  const mt = 1 - u;
  const mt2 = mt * mt;
  const u2 = u * u;

  const x =
    mt2 * mt * p0.x +
    3 * mt2 * u * p1.x +
    3 * mt * u2 * p2.x +
    u2 * u * p3.x;
  const y =
    mt2 * mt * p0.y +
    3 * mt2 * u * p1.y +
    3 * mt * u2 * p2.y +
    u2 * u * p3.y;

  // First derivative B'(u) for tangent / normal calculation
  const tx =
    3 * mt2 * (p1.x - p0.x) +
    6 * mt * u * (p2.x - p1.x) +
    3 * u2 * (p3.x - p2.x);
  const ty =
    3 * mt2 * (p1.y - p0.y) +
    6 * mt * u * (p2.y - p1.y) +
    3 * u2 * (p3.y - p2.y);

  const len = Math.hypot(tx, ty) || 1;
  return {
    x,
    y,
    nx: -ty / len,
    ny: tx / len,
  };
}

/**
 * Interleaves skills by category so same-category items are distributed around the sculpture.
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
        result.push(bucket.shift()!);
        added = true;
      }
    }
    round++;
  }
  return result;
}

/**
 * Asymmetric 11-point sculptural templates around the planet for Category Selection Mode.
 * Leaves the central planet core (x: 40..60, y: 34..60) open and avoids any horizontal rows.
 */
const ASYMMETRIC_CATEGORY_SLOTS: readonly {
  x: number;
  y: number;
  scale: number;
  depth: number;
}[] = [
  // Core slots (1..3): Inner asymmetric triangle framing the planet outside its sphere
  { x: 25.5, y: 31.0, scale: 1.16, depth: 1.04 },
  { x: 73.5, y: 27.5, scale: 1.14, depth: 1.02 },
  { x: 31.0, y: 66.5, scale: 1.12, depth: 1.0 },
  // Professional slots (4..8): Sweeping mid-field asymmetric anchors
  { x: 48.5, y: 11.0, scale: 1.02, depth: 0.94 },
  { x: 15.5, y: 49.5, scale: 1.0, depth: 0.92 },
  { x: 82.0, y: 48.0, scale: 1.02, depth: 0.95 },
  { x: 68.5, y: 68.5, scale: 0.98, depth: 0.91 },
  { x: 51.5, y: 81.5, scale: 0.96, depth: 0.9 },
  // Ecosystem slots (9..11): Outer peripheral horizon accents
  { x: 14.5, y: 21.5, scale: 0.9, depth: 0.82 },
  { x: 85.0, y: 19.5, scale: 0.88, depth: 0.8 },
  { x: 18.0, y: 77.5, scale: 0.9, depth: 0.82 },
] as const;

function computeCategoryFormationMap(): Map<
  string,
  { x: number; y: number; scale: number; depth: number }
> {
  const map = new Map<string, { x: number; y: number; scale: number; depth: number }>();

  SKILL_CATEGORIES.forEach((cat, catIdx) => {
    const catSkills = SKILLS_DATA.filter((s) => s.categoryId === cat.id);
    const ordered = [
      ...catSkills.filter((s) => s.tier === 'core'),
      ...catSkills.filter((s) => s.tier === 'professional'),
      ...catSkills.filter((s) => s.tier === 'ecosystem'),
    ];

    const shiftX = ((catIdx % 3) - 1) * 1.2;
    const shiftY = (((catIdx + 1) % 3) - 1) * 1.0;

    ordered.forEach((skill, idx) => {
      const slot = ASYMMETRIC_CATEGORY_SLOTS[idx % ASYMMETRIC_CATEGORY_SLOTS.length];
      map.set(skill.id, {
        x: parseFloat((slot.x + shiftX).toFixed(2)),
        y: parseFloat((slot.y + shiftY).toFixed(2)),
        scale: slot.scale,
        depth: slot.depth,
      });
    });
  });

  return map;
}

/**
 * Builds the 88 LivingSkillParticle definitions combining the 7 Featured Anchors
 * and the 81 Spline-Traveling Technologies.
 */
export function buildLivingOrbitParticles(): LivingSkillParticle[] {
  const categoryMap = new Map<string, SkillCategory>(
    SKILL_CATEGORIES.map((c) => [c.id, c])
  );
  const formationMap = computeCategoryFormationMap();
  const anchorMap = new Map<string, FeaturedAnchorSpec>(
    FEATURED_ANCHOR_SPECS.map((a) => [a.id, a])
  );

  // Remaining 81 skills distributed across the 3 3D Cubic Bézier splines
  const nonAnchorSkills = SKILLS_DATA.filter((s) => !anchorMap.has(s.id));
  const remainingCore = interleaveByCategory(
    nonAnchorSkills.filter((s) => s.tier === 'core')
  );
  const remainingProf = interleaveByCategory(
    nonAnchorSkills.filter((s) => s.tier === 'professional')
  );
  const remainingEco = interleaveByCategory(
    nonAnchorSkills.filter((s) => s.tier === 'ecosystem')
  );

  // Spline 0 (Ascending S-Spline): Remaining Core (14) + 13 Professional = 27 items
  const spline0Skills = [...remainingCore, ...remainingProf.slice(0, 13)];
  // Spline 1 (Descending Catenary): 28 Professional items
  const spline1Skills = remainingProf.slice(13, 41);
  // Spline 2 (Polar Meridian): Remaining Professional (4) + Ecosystem (22) = 26 items
  const spline2Skills = [...remainingProf.slice(41), ...remainingEco];

  const splineBuckets: Record<CubicBezierSplineConfig['id'], SkillItem[]> = {
    'spline-ascending': spline0Skills,
    'spline-catenary': spline1Skills,
    'spline-meridian': spline2Skills,
  };

  const particles: LivingSkillParticle[] = [];
  let globalIdx = 0;

  // 1. Add the 7 Featured Anchors first
  FEATURED_ANCHOR_SPECS.forEach((spec, idx) => {
    const skill = SKILLS_DATA.find((s) => s.id === spec.id)!;
    const cat = categoryMap.get(skill.categoryId) || SKILL_CATEGORIES[0];
    const formation = formationMap.get(skill.id) || {
      x: spec.x,
      y: spec.y,
      scale: 1.15,
      depth: 1.0,
    };
    const perimAngle = ((globalIdx * 137.5) % 360) * (Math.PI / 180);

    particles.push({
      skill,
      tier: skill.tier,
      category: cat,
      isFeaturedAnchor: true,
      anchorSpec: spec,
      splineId: 'spline-ascending',
      splineIndex: 0,
      slotIndex: idx,
      splineTotal: FEATURED_ANCHOR_SPECS.length,
      initialPhase: idx / FEATURED_ANCHOR_SPECS.length,
      normalOffset: 0,
      oscillationPhase: idx * 1.15,
      driftAmp: 0.65,
      desktopSize: spec.desktopSize,
      mobileSize: spec.mobileSize,
      categoryFormationPos: formation,
      recessedPos: {
        x: parseFloat((50 + Math.cos(perimAngle) * 45).toFixed(2)),
        y: parseFloat((50 + Math.sin(perimAngle) * 42).toFixed(2)),
      },
    });
    globalIdx++;
  });

  // 2. Add the 81 Spline-Traveling Technologies
  SPATIAL_SPLINES.forEach((spline, splineIndex) => {
    const bucket = splineBuckets[spline.id];
    const total = bucket.length;

    // Offsets perpendicular to the spline so logos occupy a 3D volume rather than a single-file line
    const lateralPattern = [-5.8, 4.4, -2.6, 6.2, -4.1, 3.0, -5.0, 4.8];

    bucket.forEach((skill, slotIndex) => {
      const cat = categoryMap.get(skill.categoryId) || SKILL_CATEGORIES[0];
      const formation = formationMap.get(skill.id) || {
        x: 50,
        y: 50,
        scale: 1.0,
        depth: 0.9,
      };

      const perimAngle = ((globalIdx * 137.5) % 360) * (Math.PI / 180);

      // Strictly monotonic phase with slight golden-ratio modulation so adjacent slots never bunch up
      const mod = ((slotIndex % 2 === 0 ? 0.08 : -0.08) / total);
      const initialPhase = (((slotIndex / total) + mod) % 1 + 1) % 1;

      const baseDesktopSize =
        skill.tier === 'core'
          ? 56 + (slotIndex % 3) * 4 // 56–64px
          : skill.tier === 'professional'
          ? 42 + (slotIndex % 4) * 3 // 42–51px
          : 33 + (slotIndex % 3) * 3; // 33–39px

      const baseMobileSize =
        skill.tier === 'core' ? 44 : skill.tier === 'professional' ? 36 : 30;

      particles.push({
        skill,
        tier: skill.tier,
        category: cat,
        isFeaturedAnchor: false,
        splineId: spline.id,
        splineIndex,
        slotIndex,
        splineTotal: total,
        initialPhase,
        normalOffset: lateralPattern[slotIndex % lateralPattern.length],
        oscillationPhase: (globalIdx * 1.6180339) % (Math.PI * 2),
        driftAmp: skill.tier === 'core' ? 1.2 : skill.tier === 'professional' ? 1.0 : 0.8,
        desktopSize: baseDesktopSize,
        mobileSize: baseMobileSize,
        categoryFormationPos: formation,
        recessedPos: {
          x: parseFloat((50 + Math.cos(perimAngle) * 45).toFixed(2)),
          y: parseFloat((50 + Math.sin(perimAngle) * 42).toFixed(2)),
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
 * Evaluates the instantaneous 2.5D spatial position, depth scale, and opacity for a particle
 * at elapsed time `timeSec`.
 */
export function evaluateSculptureTrajectory(
  particle: LivingSkillParticle,
  timeSec: number,
  pointerOffset: { x: number; y: number } = { x: 0, y: 0 }
): {
  x: number;
  y: number;
  scale: number;
  depth: number;
  opacity: number;
  isVisibleInAperture: boolean;
} {
  // ─── CASE 1: FEATURED CORE ANCHOR (Quasi-stationary with zero-G Lissajous breathing) ───
  if (particle.isFeaturedAnchor && particle.anchorSpec) {
    const spec = particle.anchorSpec;
    const dx =
      Math.sin(timeSec * spec.breathFreq + particle.oscillationPhase) * spec.breathAmpX +
      Math.cos(timeSec * (spec.breathFreq * 0.6) + particle.slotIndex) * (spec.breathAmpX * 0.4);
    const dy =
      Math.cos(timeSec * spec.breathFreq + particle.oscillationPhase * 1.3) * spec.breathAmpY +
      Math.sin(timeSec * (spec.breathFreq * 0.5) + particle.slotIndex) * (spec.breathAmpY * 0.45);

    const x = spec.x + dx + pointerOffset.x * spec.depth * 0.95;
    const y = spec.y + dy + pointerOffset.y * spec.depth * 0.95;
    const breathScale =
      spec.depth * (1 + Math.sin(timeSec * 0.9 + particle.oscillationPhase) * 0.025);

    return {
      x,
      y,
      scale: breathScale,
      depth: spec.depth,
      opacity: 1.0,
      isVisibleInAperture: true,
    };
  }

  // ─── CASE 2: 3D CUBIC BÉZIER SPLINE TRAVELER ───
  const spline = SPATIAL_SPLINES[particle.splineIndex];
  const rawPhase =
    particle.initialPhase + timeSec * spline.speed * (spline.direction === 1 ? 1 : -1);
  const phase = ((rawPhase % 1) + 1) % 1;

  const apertureFraction = Math.min(1.0, spline.visibleCapacity / particle.splineTotal);

  if (phase > apertureFraction) {
    // Traveling along the far side of the orbit in deep space
    const endPt = spline.direction === 1 ? spline.p3 : spline.p0;
    return {
      x: endPt.x,
      y: endPt.y,
      scale: spline.depthRange[0] * 0.7,
      depth: spline.depthRange[0],
      opacity: 0,
      isVisibleInAperture: false,
    };
  }

  // Parameter u in [0, 1] along the Cubic Bézier curve
  const u = phase / apertureFraction;
  const bz = evaluateCubicBezier(spline.p0, spline.p1, spline.p2, spline.p3, u);

  // Depth profile peaks near spline.uPeak and tapers toward the entry/exit horizons
  const distFromPeak = Math.abs(u - spline.uPeak);
  const depthNorm = Math.max(0, 1 - distFromPeak * 1.45);
  const [minZ, maxZ] = spline.depthRange;
  const depth = minZ + (maxZ - minZ) * depthNorm;

  // Organic lateral & vertical drift around the spline volume
  const waveAlongNormal =
    particle.normalOffset +
    Math.sin(timeSec * 1.15 + particle.oscillationPhase) * particle.driftAmp;
  const waveTangent =
    Math.cos(timeSec * 0.8 + particle.oscillationPhase) * (particle.driftAmp * 0.6);

  let rawX = bz.x + bz.nx * waveAlongNormal + bz.ny * waveTangent;
  let rawY = bz.y + bz.ny * waveAlongNormal - bz.nx * waveTangent;

  // 1. Planetary Core Exclusion Zone (keeps the central purple sphere at (50, 42) unobstructed)
  const cdx = rawX - 50;
  const cdy = rawY - 42;
  const coreRadiusSq = (cdx / 18.5) ** 2 + (cdy / 21.5) ** 2;
  if (coreRadiusSq < 1.0 && coreRadiusSq > 0.001) {
    const push = 1.06 / Math.sqrt(coreRadiusSq);
    rawX = 50 + cdx * push;
    rawY = 42 + cdy * push;
  }

  // 2. Featured Core Anchor Repulsion Field (prevents moving spline logos from overlapping Featured Anchors)
  for (let a = 0; a < FEATURED_ANCHOR_SPECS.length; a++) {
    const anchor = FEATURED_ANCHOR_SPECS[a];
    const adx = rawX - anchor.x;
    const ady = rawY - anchor.y;
    const anchorDistSq = (adx / 9.5) ** 2 + (ady / 12.0) ** 2;
    if (anchorDistSq < 1.0 && anchorDistSq > 0.0001) {
      const push = 1.05 / Math.sqrt(anchorDistSq);
      rawX = anchor.x + adx * push;
      rawY = anchor.y + ady * push;
    }
  }

  const x = Math.max(5, Math.min(95, rawX + pointerOffset.x * spline.parallaxFactor * depth));
  const y = Math.max(7, Math.min(92, rawY + pointerOffset.y * spline.parallaxFactor * depth));

  // Smooth horizon entry/exit fade envelope
  const edgeDist = Math.min(u, 1 - u);
  const horizonFade = edgeDist < 0.15 ? Math.sin((edgeDist / 0.15) * (Math.PI / 2)) : 1.0;

  // Depth-based atmospheric opacity (Foreground = 1.0, Midground = 0.86, Background = 0.66)
  const baseOpacity =
    particle.tier === 'core'
      ? 0.96
      : particle.tier === 'professional'
      ? 0.86
      : 0.68;

  return {
    x,
    y,
    scale: depth * (0.86 + 0.14 * horizonFade),
    depth,
    opacity: horizonFade * baseOpacity,
    isVisibleInAperture: horizonFade > 0.05,
  };
}

// Keep alias for compatibility
export const evaluateRibbonTrajectory = (
  particle: LivingSkillParticle,
  _ribbon: unknown,
  timeSec: number,
  pointerOffset: { x: number; y: number } = { x: 0, y: 0 }
) => evaluateSculptureTrajectory(particle, timeSec, pointerOffset);

export const ORBITAL_RIBBONS = SPATIAL_SPLINES;

/**
 * Computes collision-free satellite positions around a focused skill for its
 * genuinely related technologies (above y = 58% so they never touch the bottom inspector).
 */
export function computeFocusedNetworkPositions(
  focusedSkillId: string,
  currentPositions: Map<string, { x: number; y: number; isVisible: boolean }>
): Map<string, { x: number; y: number }> {
  const result = new Map<string, { x: number; y: number }>();
  const focusedCurrent = currentPositions.get(focusedSkillId);

  const anchorX =
    focusedCurrent && focusedCurrent.isVisible
      ? Math.max(24, Math.min(76, focusedCurrent.x))
      : 50;
  const anchorY =
    focusedCurrent && focusedCurrent.isVisible
      ? Math.max(22, Math.min(56, focusedCurrent.y))
      : 36;

  const placedPoints: { x: number; y: number }[] = [{ x: anchorX, y: anchorY }];
  result.set(focusedSkillId, { x: anchorX, y: anchorY });

  const relatedIds = getRelatedSkillIds(focusedSkillId).slice(0, 5);
  if (relatedIds.length === 0) return result;

  const isWellSpaced = (pt: { x: number; y: number }, minDx = 12.0, minDy = 14.0) => {
    for (const existing of placedPoints) {
      const ndx = (pt.x - existing.x) / minDx;
      const ndy = (pt.y - existing.y) / minDy;
      if (ndx * ndx + ndy * ndy < 1.0) return false;
    }
    return true;
  };

  const needsSummoning: string[] = [];
  for (const relId of relatedIds) {
    const existing = currentPositions.get(relId);
    if (
      existing &&
      existing.isVisible &&
      existing.x >= 10 &&
      existing.x <= 90 &&
      existing.y >= 14 &&
      existing.y <= 57 &&
      isWellSpaced(existing)
    ) {
      const pt = { x: existing.x, y: existing.y };
      result.set(relId, pt);
      placedPoints.push(pt);
    } else {
      needsSummoning.push(relId);
    }
  }

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
      if (cx >= 11 && cx <= 89 && cy >= 14 && cy <= 57) {
        candidateSlots.push({ x: cx, y: cy });
      }
    }
  }

  needsSummoning.forEach((relId) => {
    let bestSlot = candidateSlots[0] || { x: 50, y: 40 };
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
