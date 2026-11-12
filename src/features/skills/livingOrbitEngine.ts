/**
 * LIVING ORBIT 2.1 — Orbital Kinetic Sculpture Spatial & True 2.5D Trajectory Engine
 *
 * Art-directed 2.5D/3D spatial engine for the 88 validated technologies:
 *
 * 1. FEATURED TECHNOLOGY ANCHORS (8 Maintainable Flagship Marks):
 *    - Verified against the 88-skill registry:
 *      `react`, `typescript`, `threedotjs`, `openai`, `fastapi`, `postgresql`, `langgraph`, `solidity`
 *    - Independent presentation configuration (does not mutate canonical Core/Professional/Ecosystem tiers).
 *    - Suspended in an expansive, asymmetric 3D arrangement framing the rotating purple planet
 *      (leaving the central planetary core at ~50%, 43% unobstructed).
 *    - Art-directed display scales (58px–76px) with restrained, near-stationary multi-harmonic breathing.
 *
 * 2. THREE DISTINCT TRAJECTORY SYSTEMS:
 *    - ORBIT A — INNER CELESTIAL FLOW (`orbit-inner-celestial`):
 *      A broad, tilted, asymmetric elliptical trajectory (-19° inclination with harmonic radial
 *      modulation) cradling the planetary focal region. Carries primary Core and flagship
 *      Professional marks in the foreground/midground depth plane.
 *    - ORBIT B — KINETIC SWEEP (`orbit-kinetic-sweep`):
 *      An expansive diagonal, counter-flowing 3D Cubic Bézier sweeping trajectory across the
 *      planetary expanse. Carries supporting Professional technologies.
 *    - ORBIT C — DEEP HORIZON (`orbit-deep-horizon`):
 *      A wide peripheral catenary-spline trajectory in deep ambient space with slower velocity,
 *      recessed z-depth, and subtler illumination for Ecosystem & peripheral technologies.
 *
 * 3. TRUE 2.5D PERSPECTIVE DEPTH (`zPx`) WITHOUT DOUBLE SCALING:
 *    - Maps normalized `depth` ([0.56..1.08]) to physical `zPx` ([-165px..+85px]) inside a
 *      `perspective: 1100px` CSS 3D stage.
 *    - Because CSS perspective automatically scales elements by `1100 / (1100 - zPx)`,
 *      `evaluateSculptureTrajectory` outputs pure `designScale` (breathing / horizon taper)
 *      without multiplying by `depth` a second time.
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

export type OrbitSystemId =
  | 'orbit-inner-celestial'
  | 'orbit-kinetic-sweep'
  | 'orbit-deep-horizon';

/** Calibrated CSS 3D perspective distance in pixels for LivingOrbitStage */
export const STAGE_PERSPECTIVE_PX = 1100;

/**
 * Converts normalized spatial depth (`0.50..1.08`, where `0.85` is the neutral midground plane)
 * into physical Z translation in pixels (`-170px..+88px`) for `translate3d(x, y, zPx)`.
 */
export function depthToZPx(depth: number): number {
  const rawZ = (depth - 0.85) * 375;
  return Math.max(-170, Math.min(88, parseFloat(rawZ.toFixed(2))));
}

export interface OrbitTrajectoryConfig {
  id: OrbitSystemId;
  label: string;
  kind: 'tilted-ellipse' | 'cubic-bezier';
  /** Control points for Cubic Bézier trajectories (and SVG path preview) */
  p0: Point2D;
  p1: Point2D;
  p2: Point2D;
  p3: Point2D;
  /** Parametric tilted ellipse parameters for Orbit A (Inner Celestial Flow) */
  ellipse?: {
    cx: number;
    cy: number;
    rx: number;
    ry: number;
    tiltDeg: number;
    /** Start and end angle in radians for the visible front-facing orbital arc */
    startAngle: number;
    endAngle: number;
    /** Asymmetric radial harmonic distortion so it never looks like a rigid CSS circle */
    asymmetryAmp: number;
  };
  /** Direction of travel along parameter u: 1 = 0->1, -1 = 1->0 */
  direction: 1 | -1;
  /** Base speed in normalized cycle units per second */
  speed: number;
  /** Number of items simultaneously visible along the active trajectory aperture */
  visibleCapacity: number;
  /** Depth range [minZ, maxZ] where 1.07 = foreground, 0.56 = deep horizon */
  depthRange: [number, number];
  /** Peak depth parameter uPeak in [0, 1] where the trajectory passes closest to the viewer */
  uPeak: number;
  /** Parallax multiplier for pointer movement */
  parallaxFactor: number;
}

/**
 * Maintainable Featured Technology Anchor Configuration (8 Verified IDs)
 * Independent of Core / Professional / Ecosystem data tiers.
 * Arranged asymmetrically around the purple planet (center ~ 50%, 43%) with
 * expansive horizontal reach and restrained near-stationary breathing.
 */
export interface FeaturedAnchorSpec {
  id: string;
  x: number;
  y: number;
  /** Art-directed desktop pixel size (58px–76px) */
  desktopSize: number;
  mobileSize: number;
  /** Spatial depth plane (0.92..1.07) */
  depth: number;
  /** Restrained zero-G organic breathing amplitudes in stage % */
  breathAmpX: number;
  breathAmpY: number;
  breathFreq: number;
}

export const FEATURED_ANCHOR_SPECS: readonly FeaturedAnchorSpec[] = [
  {
    id: 'typescript',
    x: 20.5,
    y: 31.0,
    desktopSize: 74,
    mobileSize: 48,
    depth: 1.05,
    breathAmpX: 0.34,
    breathAmpY: 0.52,
    breathFreq: 0.68,
  },
  {
    id: 'react',
    x: 35.0,
    y: 15.0,
    desktopSize: 68,
    mobileSize: 46,
    depth: 0.99,
    breathAmpX: 0.38,
    breathAmpY: 0.48,
    breathFreq: 0.62,
  },
  {
    id: 'threedotjs',
    x: 25.5,
    y: 65.5,
    desktopSize: 72,
    mobileSize: 48,
    depth: 1.02,
    breathAmpX: 0.36,
    breathAmpY: 0.56,
    breathFreq: 0.65,
  },
  {
    id: 'openai',
    x: 75.5,
    y: 21.5,
    desktopSize: 76,
    mobileSize: 50,
    depth: 1.07,
    breathAmpX: 0.32,
    breathAmpY: 0.5,
    breathFreq: 0.72,
  },
  {
    id: 'langgraph',
    x: 83.5,
    y: 49.0,
    desktopSize: 64,
    mobileSize: 44,
    depth: 0.95,
    breathAmpX: 0.4,
    breathAmpY: 0.46,
    breathFreq: 0.58,
  },
  {
    id: 'fastapi',
    x: 12.5,
    y: 51.5,
    desktopSize: 60,
    mobileSize: 42,
    depth: 0.93,
    breathAmpX: 0.38,
    breathAmpY: 0.5,
    breathFreq: 0.61,
  },
  {
    id: 'solidity',
    x: 70.5,
    y: 73.0,
    desktopSize: 58,
    mobileSize: 42,
    depth: 0.94,
    breathAmpX: 0.38,
    breathAmpY: 0.48,
    breathFreq: 0.64,
  },
  {
    id: 'postgresql',
    x: 45.5,
    y: 81.5,
    desktopSize: 62,
    mobileSize: 44,
    depth: 0.92,
    breathAmpX: 0.34,
    breathAmpY: 0.44,
    breathFreq: 0.55,
  },
] as const;

/**
 * Three Distinct Spatial Trajectory Systems:
 * - Orbit A: Inner Celestial Flow (Broad, tilted asymmetric elliptical arc close to the planet)
 * - Orbit B: Kinetic Sweep (Large diagonal counter-flowing cubic Bézier sweep)
 * - Orbit C: Deep Horizon (Wider peripheral deep-space cubic Bézier trajectory)
 */
export const SPATIAL_SPLINES: readonly OrbitTrajectoryConfig[] = [
  {
    // ORBIT A — INNER CELESTIAL FLOW
    // Broad, tilted (-19°), asymmetric elliptical trajectory cradling the planet's focal region
    id: 'orbit-inner-celestial',
    label: 'Orbit A · Inner Celestial Flow',
    kind: 'tilted-ellipse',
    p0: { x: 16, y: 59 },
    p1: { x: 28, y: 11 },
    p2: { x: 72, y: 13 },
    p3: { x: 86, y: 41 },
    ellipse: {
      cx: 50.5,
      cy: 44.5,
      rx: 35.5,
      ry: 25.5,
      tiltDeg: -19,
      startAngle: -2.8,
      endAngle: 1.7,
      asymmetryAmp: 3.4,
    },
    direction: 1,
    speed: 0.0072,
    visibleCapacity: 7,
    depthRange: [0.85, 1.06],
    uPeak: 0.46,
    parallaxFactor: 0.95,
  },
  {
    // ORBIT B — KINETIC SWEEP
    // Expansive diagonal counter-flowing cubic Bézier sweep from upper-right horizon across to lower-left
    id: 'orbit-kinetic-sweep',
    label: 'Orbit B · Kinetic Sweep',
    kind: 'cubic-bezier',
    p0: { x: 6, y: 80 },
    p1: { x: 33, y: 90 },
    p2: { x: 66, y: 9 },
    p3: { x: 94, y: 17 },
    direction: -1,
    speed: 0.006,
    visibleCapacity: 9,
    depthRange: [0.74, 0.98],
    uPeak: 0.54,
    parallaxFactor: 0.68,
  },
  {
    // ORBIT C — DEEP HORIZON
    // Wide peripheral trajectory in deep space with slower movement and subtler illumination
    id: 'orbit-deep-horizon',
    label: 'Orbit C · Deep Horizon',
    kind: 'cubic-bezier',
    p0: { x: 5, y: 14 },
    p1: { x: 10, y: 93 },
    p2: { x: 89, y: 95 },
    p3: { x: 95, y: 32 },
    direction: 1,
    speed: 0.0042,
    visibleCapacity: 6,
    depthRange: [0.56, 0.8],
    uPeak: 0.5,
    parallaxFactor: 0.36,
  },
] as const;

export interface LivingSkillParticle {
  skill: SkillItem;
  tier: SkillTier;
  category: SkillCategory;
  /** True if this skill is one of the 8 Featured Technology Anchors */
  isFeaturedAnchor: boolean;
  anchorSpec?: FeaturedAnchorSpec;
  splineId: OrbitSystemId;
  splineIndex: number;
  slotIndex: number;
  splineTotal: number;
  /** Non-uniform initial phase in [0, 1) along the trajectory cycle */
  initialPhase: number;
  /** Signed perpendicular offset (in stage %) from the trajectory centerline */
  normalOffset: number;
  /** Deterministic multi-harmonic oscillation phases (radians) */
  oscillationPhase: number;
  secondaryPhase: number;
  /** Individual organic floating frequency multiplier */
  floatFreq: number;
  /** Individual drift amplitude */
  driftAmp: number;
  /** Base desktop pixel size (Featured: 58–76px, Core: 48–57px, Prof: 38–47px, Eco: 31–39px) */
  desktopSize: number;
  /** Base mobile pixel size */
  mobileSize: number;
  /** Asymmetric sculptural target position when its category is selected */
  categoryFormationPos: {
    x: number;
    y: number;
    scale: number;
    depth: number;
    zPx: number;
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
 * Evaluates a tilted, asymmetric celestial elliptical arc for Orbit A (Inner Celestial Flow)
 * with harmonic curvature modulation so it never resembles a uniform circular border.
 */
export function evaluateTiltedCelestialEllipse(
  ellipse: NonNullable<OrbitTrajectoryConfig['ellipse']>,
  u: number
): { x: number; y: number; nx: number; ny: number } {
  const theta = ellipse.startAngle + u * (ellipse.endAngle - ellipse.startAngle);
  const tiltRad = (ellipse.tiltDeg * Math.PI) / 180;
  const cosTilt = Math.cos(tiltRad);
  const sinTilt = Math.sin(tiltRad);

  // Asymmetric harmonic modulation along the arc
  const radialMod =
    Math.sin(theta * 2.0 + 0.7) * ellipse.asymmetryAmp +
    Math.cos(theta * 3.0 - 0.4) * (ellipse.asymmetryAmp * 0.45);

  const localX = (ellipse.rx + radialMod) * Math.cos(theta);
  const localY = (ellipse.ry + radialMod * 0.65) * Math.sin(theta);

  const x = ellipse.cx + localX * cosTilt - localY * sinTilt;
  const y = ellipse.cy + localX * sinTilt + localY * cosTilt;

  // Approximate tangent vector with respect to theta
  const dLocalX = -ellipse.rx * Math.sin(theta);
  const dLocalY = ellipse.ry * Math.cos(theta);
  const tx = dLocalX * cosTilt - dLocalY * sinTilt;
  const ty = dLocalX * sinTilt + dLocalY * cosTilt;
  const len = Math.hypot(tx, ty) || 1;

  return {
    x,
    y,
    nx: -ty / len,
    ny: tx / len,
  };
}

/**
 * Generates an SVG path string (`M ... L ...` or `M ... C ...`) for rendering
 * whisper-faint trajectory filaments in `LivingOrbitStage`.
 */
export function buildTrajectorySvgPath(
  orbit: OrbitTrajectoryConfig,
  scaleX = 10,
  scaleY = 6.2
): string {
  if (orbit.kind === 'cubic-bezier' || !orbit.ellipse) {
    return `M ${(orbit.p0.x * scaleX).toFixed(1)} ${(orbit.p0.y * scaleY).toFixed(1)} C ${(
      orbit.p1.x * scaleX
    ).toFixed(1)} ${(orbit.p1.y * scaleY).toFixed(1)}, ${(orbit.p2.x * scaleX).toFixed(1)} ${(
      orbit.p2.y * scaleY
    ).toFixed(1)}, ${(orbit.p3.x * scaleX).toFixed(1)} ${(orbit.p3.y * scaleY).toFixed(1)}`;
  }

  const samples = 40;
  const pts: string[] = [];
  for (let i = 0; i <= samples; i++) {
    const u = i / samples;
    const pt = evaluateTiltedCelestialEllipse(orbit.ellipse, u);
    pts.push(`${i === 0 ? 'M' : 'L'} ${(pt.x * scaleX).toFixed(1)} ${(pt.y * scaleY).toFixed(1)}`);
  }
  return pts.join(' ');
}

/**
 * Interleaves skills by category and brand color contrast so visually similar logos
 * or same-category items never cluster together on a trajectory.
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
 * Leaves the central planet core (x: 38..62, y: 33..58) open and avoids any horizontal rows.
 */
const ASYMMETRIC_CATEGORY_SLOTS: readonly {
  x: number;
  y: number;
  scale: number;
  depth: number;
}[] = [
  // Core slots (1..3): Inner asymmetric triad framing the planet in foreground depth
  { x: 23.5, y: 29.5, scale: 1.08, depth: 1.05 },
  { x: 75.5, y: 26.0, scale: 1.06, depth: 1.03 },
  { x: 29.0, y: 66.0, scale: 1.05, depth: 1.01 },
  // Professional slots (4..8): Sweeping mid-field asymmetric anchors
  { x: 48.0, y: 11.5, scale: 0.98, depth: 0.94 },
  { x: 13.5, y: 49.0, scale: 0.96, depth: 0.92 },
  { x: 84.0, y: 47.5, scale: 0.98, depth: 0.95 },
  { x: 69.5, y: 69.0, scale: 0.95, depth: 0.91 },
  { x: 51.5, y: 82.0, scale: 0.94, depth: 0.89 },
  // Ecosystem slots (9..11): Outer peripheral horizon accents
  { x: 13.0, y: 20.0, scale: 0.9, depth: 0.78 },
  { x: 86.5, y: 18.0, scale: 0.89, depth: 0.76 },
  { x: 16.5, y: 78.5, scale: 0.9, depth: 0.78 },
] as const;

function computeCategoryFormationMap(): Map<
  string,
  { x: number; y: number; scale: number; depth: number; zPx: number }
> {
  const map = new Map<
    string,
    { x: number; y: number; scale: number; depth: number; zPx: number }
  >();

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
        zPx: depthToZPx(slot.depth),
      });
    });
  });

  return map;
}

/**
 * Builds the 88 LivingSkillParticle definitions combining the 8 Featured Technology Anchors
 * and the 80 Trajectory-Traveling Technologies across Orbit A, Orbit B, and Orbit C.
 */
export function buildLivingOrbitParticles(): LivingSkillParticle[] {
  const categoryMap = new Map<string, SkillCategory>(
    SKILL_CATEGORIES.map((c) => [c.id, c])
  );
  const formationMap = computeCategoryFormationMap();
  const anchorMap = new Map<string, FeaturedAnchorSpec>(
    FEATURED_ANCHOR_SPECS.map((a) => [a.id, a])
  );

  // Remaining 80 skills distributed across Orbit A, Orbit B, and Orbit C
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

  // Orbit A (Inner Celestial Flow): Remaining Core (13) + 11 prominent Professional = 24 items
  const orbitASkills = [...remainingCore, ...remainingProf.slice(0, 11)];
  // Orbit B (Kinetic Sweep): 30 supporting Professional items
  const orbitBSkills = remainingProf.slice(11, 41);
  // Orbit C (Deep Horizon): Remaining Professional (4) + Ecosystem (22) = 26 items
  const orbitCSkills = [...remainingProf.slice(41), ...remainingEco];

  const orbitBuckets: Record<OrbitSystemId, SkillItem[]> = {
    'orbit-inner-celestial': orbitASkills,
    'orbit-kinetic-sweep': orbitBSkills,
    'orbit-deep-horizon': orbitCSkills,
  };

  const particles: LivingSkillParticle[] = [];
  let globalIdx = 0;

  // 1. Add the 8 Featured Technology Anchors first
  FEATURED_ANCHOR_SPECS.forEach((spec, idx) => {
    const skill = SKILLS_DATA.find((s) => s.id === spec.id)!;
    const cat = categoryMap.get(skill.categoryId) || SKILL_CATEGORIES[0];
    const formation = formationMap.get(skill.id) || {
      x: spec.x,
      y: spec.y,
      scale: 1.06,
      depth: spec.depth,
      zPx: depthToZPx(spec.depth),
    };
    const perimAngle = ((globalIdx * 137.508) % 360) * (Math.PI / 180);

    particles.push({
      skill,
      tier: skill.tier,
      category: cat,
      isFeaturedAnchor: true,
      anchorSpec: spec,
      splineId: 'orbit-inner-celestial',
      splineIndex: 0,
      slotIndex: idx,
      splineTotal: FEATURED_ANCHOR_SPECS.length,
      initialPhase: idx / FEATURED_ANCHOR_SPECS.length,
      normalOffset: 0,
      oscillationPhase: idx * 1.18,
      secondaryPhase: (idx * 2.39996) % (Math.PI * 2),
      floatFreq: spec.breathFreq,
      driftAmp: 0.45,
      desktopSize: spec.desktopSize,
      mobileSize: spec.mobileSize,
      categoryFormationPos: formation,
      recessedPos: {
        x: parseFloat((50 + Math.cos(perimAngle) * 46.5).toFixed(2)),
        y: parseFloat((50 + Math.sin(perimAngle) * 43.5).toFixed(2)),
      },
    });
    globalIdx++;
  });

  // 2. Add the 80 Trajectory-Traveling Technologies across Orbits A, B, and C
  SPATIAL_SPLINES.forEach((orbit, splineIndex) => {
    const bucket = orbitBuckets[orbit.id];
    const total = bucket.length;

    // Perpendicular normal offsets so logos inhabit a spatial volume rather than a single-file track
    const lateralPattern =
      orbit.id === 'orbit-inner-celestial'
        ? [-4.2, 3.8, -2.4, 4.6, -3.5, 2.8, -4.4, 3.9]
        : orbit.id === 'orbit-kinetic-sweep'
        ? [-6.0, 5.2, -3.2, 6.4, -4.5, 3.6, -5.4, 4.8]
        : [-4.6, 4.0, -2.6, 5.0, -3.8, 3.0, -4.4, 4.1];

    bucket.forEach((skill, slotIndex) => {
      const cat = categoryMap.get(skill.categoryId) || SKILL_CATEGORIES[0];
      const formation = formationMap.get(skill.id) || {
        x: 50,
        y: 50,
        scale: 1.0,
        depth: 0.9,
        zPx: depthToZPx(0.9),
      };

      const perimAngle = ((globalIdx * 137.508) % 360) * (Math.PI / 180);

      // Non-uniform Golden-Ratio phase staggering so adjacent slots never form mechanical chains
      const mod = (slotIndex % 2 === 0 ? 0.085 : -0.085) / total;
      const initialPhase = (((slotIndex / total) + mod) % 1 + 1) % 1;

      // Art-directed tier scale ranges:
      // - Other Core technologies: 48–57px (within 44–60px)
      // - Professional: 38–47px (within 36–50px)
      // - Ecosystem: 31–39px (within 30–42px)
      const baseDesktopSize =
        skill.tier === 'core'
          ? 48 + (slotIndex % 4) * 3 // 48–57px
          : skill.tier === 'professional'
          ? 38 + (slotIndex % 4) * 3 // 38–47px
          : 31 + (slotIndex % 4) * 2.5; // 31–38.5px

      const baseMobileSize =
        skill.tier === 'core' ? 42 : skill.tier === 'professional' ? 35 : 30;

      particles.push({
        skill,
        tier: skill.tier,
        category: cat,
        isFeaturedAnchor: false,
        splineId: orbit.id,
        splineIndex,
        slotIndex,
        splineTotal: total,
        initialPhase,
        normalOffset: lateralPattern[slotIndex % lateralPattern.length],
        oscillationPhase: (globalIdx * 1.6180339) % (Math.PI * 2),
        secondaryPhase: (globalIdx * 2.3999632) % (Math.PI * 2),
        floatFreq: 0.58 + ((globalIdx * 7) % 11) * 0.04,
        driftAmp:
          skill.tier === 'core'
            ? 1.05
            : skill.tier === 'professional'
            ? 0.88
            : 0.72,
        desktopSize: Math.round(baseDesktopSize),
        mobileSize: baseMobileSize,
        categoryFormationPos: formation,
        recessedPos: {
          x: parseFloat((50 + Math.cos(perimAngle) * 45).toFixed(2)),
          y: parseFloat((50 + Math.sin(perimAngle) * 41).toFixed(2)),
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
 * Evaluates the instantaneous 2.5D spatial position (`x`, `y`, `zPx`), pure `designScale`
 * (without double-applying perspective depth), normalized `depth`, and `opacity` for a particle
 * at elapsed time `timeSec`.
 */
export function evaluateSculptureTrajectory(
  particle: LivingSkillParticle,
  timeSec: number,
  pointerOffset: { x: number; y: number } = { x: 0, y: 0 }
): {
  x: number;
  y: number;
  zPx: number;
  scale: number;
  depth: number;
  opacity: number;
  isVisibleInAperture: boolean;
} {
  // ─── CASE 1: FEATURED TECHNOLOGY ANCHOR (Asymmetric composition with near-stationary breathing) ───
  if (particle.isFeaturedAnchor && particle.anchorSpec) {
    const spec = particle.anchorSpec;
    const dx =
      Math.sin(timeSec * spec.breathFreq + particle.oscillationPhase) * spec.breathAmpX +
      Math.cos(timeSec * (spec.breathFreq * 0.58) + particle.secondaryPhase) *
        (spec.breathAmpX * 0.38);
    const dy =
      Math.cos(timeSec * spec.breathFreq + particle.oscillationPhase * 1.27) * spec.breathAmpY +
      Math.sin(timeSec * (spec.breathFreq * 0.52) + particle.secondaryPhase) *
        (spec.breathAmpY * 0.42);

    const x = spec.x + dx + pointerOffset.x * spec.depth * 0.92;
    const y = spec.y + dy + pointerOffset.y * spec.depth * 0.92;

    // Subtle depth breathing in Z (+-6px) while CSS perspective provides hardware depth magnification
    const dynamicDepth =
      spec.depth + Math.sin(timeSec * 0.65 + particle.oscillationPhase) * 0.016;
    const zPx = depthToZPx(dynamicDepth);

    // Pure designScale (does NOT multiply by `depth` again, preventing double depth scaling)
    const designScale = 1 + Math.sin(timeSec * 0.75 + particle.oscillationPhase) * 0.018;

    return {
      x,
      y,
      zPx,
      scale: designScale,
      depth: dynamicDepth,
      opacity: 1.0,
      isVisibleInAperture: true,
    };
  }

  // ─── CASE 2: ORBIT A / B / C TRAJECTORY TRAVELER ───
  const orbit = SPATIAL_SPLINES[particle.splineIndex];
  const speedVariation = 1 + ((particle.slotIndex % 5) - 2) * 0.015;
  const rawPhase =
    particle.initialPhase +
    timeSec * orbit.speed * speedVariation * (orbit.direction === 1 ? 1 : -1);
  const phase = ((rawPhase % 1) + 1) % 1;

  const apertureFraction = Math.min(1.0, orbit.visibleCapacity / particle.splineTotal);

  if (phase > apertureFraction) {
    // Traveling along the far side of the orbit in deep space (smoothly hidden)
    const endPt = orbit.direction === 1 ? orbit.p3 : orbit.p0;
    const minDepth = orbit.depthRange[0];
    return {
      x: endPt.x,
      y: endPt.y,
      zPx: depthToZPx(minDepth),
      scale: 0.86,
      depth: minDepth,
      opacity: 0,
      isVisibleInAperture: false,
    };
  }

  // Parameter u in [0, 1] along the active trajectory aperture
  const u = phase / apertureFraction;
  const curvePt =
    orbit.kind === 'tilted-ellipse' && orbit.ellipse
      ? evaluateTiltedCelestialEllipse(orbit.ellipse, u)
      : evaluateCubicBezier(orbit.p0, orbit.p1, orbit.p2, orbit.p3, u);

  // Depth profile peaks near orbit.uPeak and tapers toward the entry/exit horizons
  const distFromPeak = Math.abs(u - orbit.uPeak);
  const depthNorm = Math.max(0, 1 - distFromPeak * 1.45);
  const [minZ, maxZ] = orbit.depthRange;
  const depth = minZ + (maxZ - minZ) * depthNorm;
  const zPx = depthToZPx(depth);

  // Multi-frequency organic floating around the trajectory volume
  const waveAlongNormal =
    particle.normalOffset +
    Math.sin(timeSec * particle.floatFreq + particle.oscillationPhase) * particle.driftAmp +
    Math.cos(timeSec * (particle.floatFreq * 0.63) + particle.secondaryPhase) *
      (particle.driftAmp * 0.35);
  const waveTangent =
    Math.cos(timeSec * (particle.floatFreq * 0.78) + particle.oscillationPhase) *
    (particle.driftAmp * 0.52);

  let rawX = curvePt.x + curvePt.nx * waveAlongNormal + curvePt.ny * waveTangent;
  let rawY = curvePt.y + curvePt.ny * waveAlongNormal - curvePt.nx * waveTangent;

  // 1. Planetary Core Exclusion Zone (keeps the central purple sphere at (50, 43.5) unobstructed)
  const cdx = rawX - 50;
  const cdy = rawY - 43.5;
  const coreRadiusSq = (cdx / 21.5) ** 2 + (cdy / 24.5) ** 2;
  if (coreRadiusSq < 1.0 && coreRadiusSq > 0.001) {
    const push = 1.06 / Math.sqrt(coreRadiusSq);
    rawX = 50 + cdx * push;
    rawY = 43.5 + cdy * push;
  }

  // 2. Featured Anchor Repulsion Field (protects both the Featured Anchor mark and its bottom caption)
  for (let a = 0; a < FEATURED_ANCHOR_SPECS.length; a++) {
    const anchor = FEATURED_ANCHOR_SPECS[a];
    const adx = rawX - anchor.x;
    const ady = rawY - (anchor.y + 1.8);
    const anchorDistSq = (adx / 11.4) ** 2 + (ady / 14.8) ** 2;
    if (anchorDistSq < 1.0 && anchorDistSq > 0.0001) {
      const push = 1.08 / Math.sqrt(anchorDistSq);
      rawX = anchor.x + adx * push;
      rawY = anchor.y + 1.8 + ady * push;
    }
  }

  const x = Math.max(4.5, Math.min(95.5, rawX + pointerOffset.x * orbit.parallaxFactor * depth));
  const y = Math.max(6.5, Math.min(92.5, rawY + pointerOffset.y * orbit.parallaxFactor * depth));

  // Smooth horizon entry/exit fade envelope (no visible wrapping jumps)
  const edgeDist = Math.min(u, 1 - u);
  const horizonFade = edgeDist < 0.16 ? Math.sin((edgeDist / 0.16) * (Math.PI / 2)) : 1.0;

  // Depth & Orbit-based atmospheric opacity (Orbit A brightest, Orbit B balanced, Orbit C subtler deep horizon)
  const orbitBrightness =
    orbit.id === 'orbit-inner-celestial'
      ? 0.96
      : orbit.id === 'orbit-kinetic-sweep'
      ? 0.87
      : 0.68;

  // Pure designScale (horizon entry/exit taper only — 3D depth magnification comes from `zPx` perspective)
  const designScale = 0.88 + 0.12 * horizonFade;

  return {
    x,
    y,
    zPx,
    scale: designScale,
    depth,
    opacity: horizonFade * orbitBrightness,
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
 * genuinely related technologies (above y = 57% so they never touch the bottom inspector).
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
      ? Math.max(22, Math.min(55, focusedCurrent.y))
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
      existing.y <= 56 &&
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
      if (cx >= 11 && cx <= 89 && cy >= 14 && cy <= 56) {
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
