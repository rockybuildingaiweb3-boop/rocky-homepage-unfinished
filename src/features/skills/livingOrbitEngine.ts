/**
 * LIVING ORBIT 2.2 — Advanced Kinetic Sculpture Spatial & Arc-Length Trajectory Engine
 *
 * Art-directed 2.5D/3D spatial engine for the 88 validated technologies:
 *
 * 1. TWO-LEVEL FEATURED TECHNOLOGY ANCHOR HIERARCHY (8 Verified Marks):
 *    - Primary Featured Anchors (4 Flagship Marks, 76–90px):
 *      `openai` (88px), `typescript` (84px), `react` (82px), `threedotjs` (80px)
 *    - Secondary Featured Anchors (4 Supporting Marks, 56–68px):
 *      `langgraph` (66px), `postgresql` (64px), `fastapi` (60px), `solidity` (58px)
 *    - Independent presentation configuration (does not mutate canonical Core/Professional/Ecosystem tiers).
 *
 * 2. THREE DISTINCT TRAJECTORY SYSTEMS WITH ARC-LENGTH PARAMETERIZATION:
 *    - ORBIT A — INNER CELESTIAL FLOW (`orbit-inner-celestial`):
 *      Tilted asymmetric elliptical trajectory (-19° inclination + harmonic modulation)
 *      cradling the planetary focal region. Capacity: 8 visible (28s pass duration).
 *    - ORBIT B — KINETIC SWEEP (`orbit-kinetic-sweep`):
 *      Expansive diagonal counter-flowing Cubic Bézier trajectory across the stage.
 *      Capacity: 10 visible (33s pass duration).
 *    - ORBIT C — DEEP HORIZON (`orbit-deep-horizon`):
 *      Wide peripheral catenary-spline trajectory in deep ambient space.
 *      Capacity: 8 visible (42s pass duration).
 *    - Total visible in desktop ALL mode: 8 Featured Anchors + 26 Moving = 34 objects.
 *
 * 3. PRECOMPUTED ARC-LENGTH LOOKUP TABLES (`ArcLengthLut`):
 *    - Samples each trajectory at 140 intervals (`141` points), computes cumulative
 *      Euclidean distances, and maps normalized traveled distance `s ∈ [0, 1]` to curve
 *      parameter `u ∈ [0, 1]` via binary search + linear interpolation for constant
 *      screen-space velocity.
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

export type FeaturedAnchorTier = 'primary' | 'secondary';

/** Calibrated CSS 3D perspective distance in pixels for LivingOrbitStage */
export const STAGE_PERSPECTIVE_PX = 1120;

/**
 * Converts normalized spatial depth (`0.50..1.10`, where `0.85` is the neutral midground plane)
 * into physical Z translation in pixels (`-180px..+95px`) for `translate3d(x, y, zPx)`.
 */
export function depthToZPx(depth: number): number {
  const rawZ = (depth - 0.85) * 380;
  return Math.max(-180, Math.min(95, parseFloat(rawZ.toFixed(2))));
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
  /** Direction of travel along normalized arc length s: 1 = 0->1, -1 = 1->0 */
  direction: 1 | -1;
  /** Target visible pass duration in seconds (Orbit A: 26-32s, Orbit B: 30-36s, Orbit C: 38-46s) */
  targetPassDurationSec: number;
  /** Base cycle speed in normalized cycle units per second (`apertureFraction / targetPassDurationSec`) */
  speed: number;
  /** Number of items simultaneously visible along the active trajectory aperture */
  visibleCapacity: number;
  /** Depth range [minZ, maxZ] where 1.08 = foreground, 0.56 = deep horizon */
  depthRange: [number, number];
  /** Peak depth parameter sPeak in [0, 1] where the trajectory passes closest to the viewer */
  uPeak: number;
  /** Parallax multiplier for pointer movement */
  parallaxFactor: number;
}

/**
 * Two-Level Featured Technology Anchor Configuration (8 Verified IDs):
 * - 4 Primary Featured Anchors (`primary`): 76–90px (`openai`, `typescript`, `react`, `threedotjs`)
 * - 4 Secondary Featured Anchors (`secondary`): 56–68px (`langgraph`, `postgresql`, `fastapi`, `solidity`)
 */
export interface FeaturedAnchorSpec {
  id: string;
  anchorTier: FeaturedAnchorTier;
  x: number;
  y: number;
  /** Art-directed desktop pixel size (Primary: 76–90px, Secondary: 56–68px) */
  desktopSize: number;
  mobileSize: number;
  /** Spatial depth plane (Primary: 1.04..1.08, Secondary: 0.93..0.96) */
  depth: number;
  /** Restrained zero-G organic breathing amplitudes in stage % */
  breathAmpX: number;
  breathAmpY: number;
  breathFreq: number;
}

export const FEATURED_ANCHOR_SPECS: readonly FeaturedAnchorSpec[] = [
  // ─── PRIMARY FEATURED ANCHORS (4 Flagship Marks: 80–88px) ───
  {
    id: 'openai',
    anchorTier: 'primary',
    x: 73.5,
    y: 20.5,
    desktopSize: 88,
    mobileSize: 54,
    depth: 1.08,
    breathAmpX: 0.3,
    breathAmpY: 0.46,
    breathFreq: 0.72,
  },
  {
    id: 'typescript',
    anchorTier: 'primary',
    x: 20.5,
    y: 27.5,
    desktopSize: 84,
    mobileSize: 52,
    depth: 1.06,
    breathAmpX: 0.32,
    breathAmpY: 0.48,
    breathFreq: 0.68,
  },
  {
    id: 'react',
    anchorTier: 'primary',
    x: 36.5,
    y: 14.0,
    desktopSize: 82,
    mobileSize: 50,
    depth: 1.05,
    breathAmpX: 0.35,
    breathAmpY: 0.45,
    breathFreq: 0.62,
  },
  {
    id: 'threedotjs',
    anchorTier: 'primary',
    x: 24.5,
    y: 66.0,
    desktopSize: 80,
    mobileSize: 50,
    depth: 1.04,
    breathAmpX: 0.34,
    breathAmpY: 0.52,
    breathFreq: 0.65,
  },
  // ─── SECONDARY FEATURED ANCHORS (4 Supporting Marks: 58–66px) ───
  {
    id: 'langgraph',
    anchorTier: 'secondary',
    x: 85.0,
    y: 48.0,
    desktopSize: 66,
    mobileSize: 42,
    depth: 0.96,
    breathAmpX: 0.38,
    breathAmpY: 0.44,
    breathFreq: 0.58,
  },
  {
    id: 'postgresql',
    anchorTier: 'secondary',
    x: 45.5,
    y: 82.0,
    desktopSize: 64,
    mobileSize: 42,
    depth: 0.94,
    breathAmpX: 0.32,
    breathAmpY: 0.42,
    breathFreq: 0.55,
  },
  {
    id: 'fastapi',
    anchorTier: 'secondary',
    x: 10.5,
    y: 51.0,
    desktopSize: 60,
    mobileSize: 40,
    depth: 0.93,
    breathAmpX: 0.36,
    breathAmpY: 0.46,
    breathFreq: 0.61,
  },
  {
    id: 'solidity',
    anchorTier: 'secondary',
    x: 71.5,
    y: 74.0,
    desktopSize: 58,
    mobileSize: 40,
    depth: 0.94,
    breathAmpX: 0.36,
    breathAmpY: 0.46,
    breathFreq: 0.64,
  },
] as const;

/**
 * Three Distinct Spatial Trajectory Systems (Living Orbit 2.2):
 * - Orbit A: Inner Celestial Flow (8 visible / 24 total -> apertureFraction = 0.3333, pass = 28s)
 * - Orbit B: Kinetic Sweep (10 visible / 30 total -> apertureFraction = 0.3333, pass = 33s)
 * - Orbit C: Deep Horizon (8 visible / 26 total -> apertureFraction = 0.3077, pass = 42s)
 * Total moving visible on desktop = 26 (+ 8 Featured Anchors = 34 visible objects).
 */
export const SPATIAL_SPLINES: readonly OrbitTrajectoryConfig[] = [
  {
    // ORBIT A — INNER CELESTIAL FLOW
    // Broad, tilted (-19°), asymmetric elliptical trajectory cradling the planet's focal region
    id: 'orbit-inner-celestial',
    label: 'Orbit A · Inner Celestial Flow',
    kind: 'tilted-ellipse',
    p0: { x: 14, y: 60 },
    p1: { x: 26, y: 10 },
    p2: { x: 74, y: 12 },
    p3: { x: 88, y: 40 },
    ellipse: {
      cx: 50.5,
      cy: 44.5,
      rx: 37.0,
      ry: 26.5,
      tiltDeg: -19,
      startAngle: -2.85,
      endAngle: 1.75,
      asymmetryAmp: 3.6,
    },
    direction: 1,
    targetPassDurationSec: 28,
    speed: parseFloat(((8 / 24) / 28).toFixed(6)), // ~0.011905 cycle/s -> 28s visible pass
    visibleCapacity: 8,
    depthRange: [0.86, 1.06],
    uPeak: 0.46,
    parallaxFactor: 0.95,
  },
  {
    // ORBIT B — KINETIC SWEEP
    // Expansive diagonal counter-flowing cubic Bézier sweep across the stage
    id: 'orbit-kinetic-sweep',
    label: 'Orbit B · Kinetic Sweep',
    kind: 'cubic-bezier',
    p0: { x: 4.5, y: 81.5 },
    p1: { x: 31.5, y: 92.0 },
    p2: { x: 67.5, y: 8.0 },
    p3: { x: 95.5, y: 16.5 },
    direction: -1,
    targetPassDurationSec: 33,
    speed: parseFloat(((10 / 30) / 33).toFixed(6)), // ~0.010101 cycle/s -> 33s visible pass
    visibleCapacity: 10,
    depthRange: [0.74, 0.99],
    uPeak: 0.54,
    parallaxFactor: 0.7,
  },
  {
    // ORBIT C — DEEP HORIZON
    // Wide peripheral trajectory in deep space with slower movement and subtler illumination
    id: 'orbit-deep-horizon',
    label: 'Orbit C · Deep Horizon',
    kind: 'cubic-bezier',
    p0: { x: 4.0, y: 13.5 },
    p1: { x: 9.5, y: 94.0 },
    p2: { x: 90.0, y: 95.0 },
    p3: { x: 96.0, y: 31.5 },
    direction: 1,
    targetPassDurationSec: 42,
    speed: parseFloat(((8 / 26) / 42).toFixed(6)), // ~0.007326 cycle/s -> 42s visible pass
    visibleCapacity: 8,
    depthRange: [0.56, 0.8],
    uPeak: 0.5,
    parallaxFactor: 0.38,
  },
] as const;

export interface LivingSkillParticle {
  skill: SkillItem;
  tier: SkillTier;
  category: SkillCategory;
  /** True if this skill is one of the 8 Featured Technology Anchors */
  isFeaturedAnchor: boolean;
  /** 'primary' (4 flagship anchors) | 'secondary' (4 supporting anchors) */
  anchorTier?: FeaturedAnchorTier;
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
  /** Base desktop pixel size (Primary Anchor: 80–88px, Secondary Anchor: 58–66px, Core: 48–57px, Prof: 38–47px, Eco: 31–39px) */
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
 * Evaluates an orbit trajectory directly at raw curve parameter `u ∈ [0, 1]`.
 */
export function evaluateOrbitRawParam(
  orbit: OrbitTrajectoryConfig,
  u: number
): { x: number; y: number; nx: number; ny: number } {
  const clampedU = Math.max(0, Math.min(1, u));
  if (orbit.kind === 'tilted-ellipse' && orbit.ellipse) {
    return evaluateTiltedCelestialEllipse(orbit.ellipse, clampedU);
  }
  return evaluateCubicBezier(orbit.p0, orbit.p1, orbit.p2, orbit.p3, clampedU);
}

/**
 * Precomputed Arc-Length Lookup Table (`ArcLengthLut`, Section 2.3)
 * Maps normalized arc length `s ∈ [0, 1]` to raw curve parameter `u ∈ [0, 1]`
 * so particles move at uniform screen-space speed regardless of Bézier derivative changes.
 */
export interface ArcLengthLut {
  orbitId: OrbitSystemId;
  samples: number;
  uValues: Float32Array;
  cumLengths: Float32Array;
  normLengths: Float32Array;
  totalLength: number;
}

const ARC_LENGTH_SAMPLES = 140;

function buildArcLengthLut(orbit: OrbitTrajectoryConfig): ArcLengthLut {
  const n = ARC_LENGTH_SAMPLES;
  const uValues = new Float32Array(n + 1);
  const cumLengths = new Float32Array(n + 1);
  const normLengths = new Float32Array(n + 1);

  let prev = evaluateOrbitRawParam(orbit, 0);
  uValues[0] = 0;
  cumLengths[0] = 0;

  let accum = 0;
  for (let i = 1; i <= n; i++) {
    const u = i / n;
    const cur = evaluateOrbitRawParam(orbit, u);
    // Weight X and Y by standard 16:10 stage aspect so screen-space velocity is uniform
    const segLen = Math.hypot((cur.x - prev.x) * 1.6, cur.y - prev.y);
    accum += segLen;
    uValues[i] = u;
    cumLengths[i] = accum;
    prev = cur;
  }

  const totalLength = accum || 1;
  for (let i = 0; i <= n; i++) {
    normLengths[i] = cumLengths[i] / totalLength;
  }

  return {
    orbitId: orbit.id,
    samples: n,
    uValues,
    cumLengths,
    normLengths,
    totalLength,
  };
}

export const ORBIT_ARC_LENGTH_TABLES: Readonly<Record<OrbitSystemId, ArcLengthLut>> = {
  'orbit-inner-celestial': buildArcLengthLut(SPATIAL_SPLINES[0]),
  'orbit-kinetic-sweep': buildArcLengthLut(SPATIAL_SPLINES[1]),
  'orbit-deep-horizon': buildArcLengthLut(SPATIAL_SPLINES[2]),
};

/**
 * Converts a normalized arc-length distance `s ∈ [0, 1]` into the corresponding
 * curve parameter `u ∈ [0, 1]` via binary search + linear interpolation.
 */
export function mapArcLengthToParam(
  orbit: OrbitTrajectoryConfig,
  normalizedDistance: number
): number {
  const s = Math.max(0, Math.min(1, normalizedDistance));
  if (s <= 0) return 0;
  if (s >= 1) return 1;

  const lut = ORBIT_ARC_LENGTH_TABLES[orbit.id];
  if (!lut) return s;

  const norms = lut.normLengths;
  let low = 0;
  let high = lut.samples;

  while (low < high) {
    const mid = (low + high) >>> 1;
    if (norms[mid] < s) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  const idx = Math.max(1, low);
  const s0 = norms[idx - 1];
  const s1 = norms[idx];
  const span = s1 - s0;
  const t = span > 1e-6 ? (s - s0) / span : 0;

  return lut.uValues[idx - 1] + t * (lut.uValues[idx] - lut.uValues[idx - 1]);
}

/**
 * Evaluates position `(x, y)` and unit normal `(nx, ny)` at normalized arc length `s ∈ [0, 1]`.
 */
export function evaluateOrbitAtArcLength(
  orbit: OrbitTrajectoryConfig,
  normalizedDistance: number
): { x: number; y: number; nx: number; ny: number; u: number } {
  const u = mapArcLengthToParam(orbit, normalizedDistance);
  const pt = evaluateOrbitRawParam(orbit, u);
  return { ...pt, u };
}

/**
 * Generates an SVG path string sampled uniformly by arc length for rendering
 * trajectory filaments and moving energy segments in `LivingOrbitStage`.
 */
export function buildTrajectorySvgPath(
  orbit: OrbitTrajectoryConfig,
  scaleX = 10,
  scaleY = 6.2
): string {
  const samples = 48;
  const pts: string[] = [];
  for (let i = 0; i <= samples; i++) {
    const s = i / samples;
    const pt = evaluateOrbitAtArcLength(orbit, s);
    pts.push(
      `${i === 0 ? 'M' : 'L'} ${(pt.x * scaleX).toFixed(1)} ${(pt.y * scaleY).toFixed(1)}`
    );
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
  { x: 24.5, y: 31.5, scale: 1.08, depth: 1.05 },
  { x: 76.0, y: 26.0, scale: 1.06, depth: 1.03 },
  { x: 29.5, y: 66.5, scale: 1.05, depth: 1.01 },
  // Professional slots (4..8): Sweeping mid-field asymmetric anchors
  { x: 48.5, y: 11.5, scale: 0.98, depth: 0.94 },
  { x: 12.5, y: 51.0, scale: 0.96, depth: 0.92 },
  { x: 84.5, y: 48.0, scale: 0.98, depth: 0.95 },
  { x: 70.5, y: 69.5, scale: 0.95, depth: 0.91 },
  { x: 51.5, y: 82.5, scale: 0.94, depth: 0.89 },
  // Ecosystem slots (9..11): Outer peripheral horizon accents
  { x: 11.5, y: 17.5, scale: 0.9, depth: 0.78 },
  { x: 87.5, y: 17.5, scale: 0.89, depth: 0.76 },
  { x: 15.5, y: 79.5, scale: 0.9, depth: 0.78 },
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
 * (4 Primary + 4 Secondary) and the 80 Trajectory-Traveling Technologies across Orbits A, B, and C.
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

  // Orbit A (Inner Celestial Flow): Remaining Core (13) + 11 prominent Professional = 24 items (8 visible)
  const orbitASkills = [...remainingCore, ...remainingProf.slice(0, 11)];
  // Orbit B (Kinetic Sweep): 30 supporting Professional items (10 visible)
  const orbitBSkills = remainingProf.slice(11, 41);
  // Orbit C (Deep Horizon): Remaining Professional (4) + Ecosystem (22) = 26 items (8 visible)
  const orbitCSkills = [...remainingProf.slice(41), ...remainingEco];

  const orbitBuckets: Record<OrbitSystemId, SkillItem[]> = {
    'orbit-inner-celestial': orbitASkills,
    'orbit-kinetic-sweep': orbitBSkills,
    'orbit-deep-horizon': orbitCSkills,
  };

  const particles: LivingSkillParticle[] = [];
  let globalIdx = 0;

  // 1. Add the 8 Featured Technology Anchors first (4 Primary + 4 Secondary)
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
      anchorTier: spec.anchorTier,
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
      driftAmp: 0.42,
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

    // Perpendicular normal offsets so logos inhabit a 3D spatial band rather than a single-file track
    const lateralPattern =
      orbit.id === 'orbit-inner-celestial'
        ? [-4.4, 4.0, -2.6, 4.8, -3.6, 3.0, -4.6, 4.1]
        : orbit.id === 'orbit-kinetic-sweep'
        ? [-6.4, 5.6, -3.4, 6.8, -4.8, 3.8, -5.8, 5.0]
        : [-4.8, 4.2, -2.8, 5.2, -4.0, 3.2, -4.6, 4.3];

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
      const mod = (slotIndex % 2 === 0 ? 0.065 : -0.065) / total;
      const initialPhase = (((slotIndex / total) + mod) % 1 + 1) % 1;

      // Art-directed tier scale ranges for moving technologies:
      // - Core technologies: 48–57px
      // - Professional: 39–48px
      // - Ecosystem: 32–39px
      const baseDesktopSize =
        skill.tier === 'core'
          ? 48 + (slotIndex % 4) * 3 // 48–57px
          : skill.tier === 'professional'
          ? 39 + (slotIndex % 4) * 3 // 39–48px
          : 32 + (slotIndex % 4) * 2.2; // 32–38.6px

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
            ? 1.02
            : skill.tier === 'professional'
            ? 0.86
            : 0.7,
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
 * at elapsed time `timeSec` using constant-speed arc-length parameterization.
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
  // ─── CASE 1: FEATURED TECHNOLOGY ANCHOR (Primary 76–90px / Secondary 56–68px) ───
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

    const dynamicDepth =
      spec.depth + Math.sin(timeSec * 0.65 + particle.oscillationPhase) * 0.015;
    const zPx = depthToZPx(dynamicDepth);

    // Primary anchors have slightly stronger presence than secondary anchors
    const tierBaseScale = spec.anchorTier === 'primary' ? 1.02 : 0.98;
    const designScale =
      tierBaseScale + Math.sin(timeSec * 0.75 + particle.oscillationPhase) * 0.018;

    return {
      x,
      y,
      zPx,
      scale: designScale,
      depth: dynamicDepth,
      opacity: spec.anchorTier === 'primary' ? 1.0 : 0.94,
      isVisibleInAperture: true,
    };
  }

  // ─── CASE 2: ORBIT A / B / C ARC-LENGTH TRAJECTORY TRAVELER ───
  const orbit = SPATIAL_SPLINES[particle.splineIndex];

  // Advance monotonically in [0, 1) and apply orbit.direction to arc-length s
  const rawPhase = particle.initialPhase + timeSec * orbit.speed;
  const phase = ((rawPhase % 1) + 1) % 1;

  const apertureFraction = Math.min(1.0, (orbit.visibleCapacity + 0.08) / particle.splineTotal);

  if (phase > apertureFraction) {
    // Traveling along the far side of the orbit in deep space (smoothly hidden)
    const endPt = orbit.direction === 1 ? orbit.p3 : orbit.p0;
    const minDepth = orbit.depthRange[0];
    return {
      x: endPt.x,
      y: endPt.y,
      zPx: depthToZPx(minDepth),
      scale: 0.84,
      depth: minDepth,
      opacity: 0,
      isVisibleInAperture: false,
    };
  }

  // Normalized traveled distance `s ∈ [0, 1]` along the visible trajectory aperture
  const progress = phase / apertureFraction;
  const s = orbit.direction === 1 ? progress : 1 - progress;

  // Evaluate position and normal using the precomputed Arc-Length LUT (constant screen-space speed)
  const curvePt = evaluateOrbitAtArcLength(orbit, s);

  // Depth profile peaks near orbit.uPeak and tapers toward the entry/exit horizons
  const distFromPeak = Math.abs(s - orbit.uPeak);
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
    (particle.driftAmp * 0.5);

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
    const rx = anchor.anchorTier === 'primary' ? 11.8 : 10.4;
    const ry = anchor.anchorTier === 'primary' ? 15.2 : 13.6;
    const adx = rawX - anchor.x;
    const ady = rawY - (anchor.y + 1.8);
    const anchorDistSq = (adx / rx) ** 2 + (ady / ry) ** 2;
    if (anchorDistSq < 1.0 && anchorDistSq > 0.0001) {
      const push = 1.08 / Math.sqrt(anchorDistSq);
      rawX = anchor.x + adx * push;
      rawY = anchor.y + 1.8 + ady * push;
    }
  }

  const x = Math.max(4.0, Math.min(96.0, rawX + pointerOffset.x * orbit.parallaxFactor * depth));
  const y = Math.max(6.0, Math.min(93.0, rawY + pointerOffset.y * orbit.parallaxFactor * depth));

  // Smooth horizon entry/exit fade envelope (no visible wrapping jumps)
  const edgeDist = Math.min(progress, 1 - progress);
  const horizonFade = edgeDist < 0.14 ? Math.sin((edgeDist / 0.14) * (Math.PI / 2)) : 1.0;

  // Depth & Orbit-based atmospheric opacity (Orbit A brightest, Orbit B balanced, Orbit C subtler deep horizon)
  const orbitBrightness =
    orbit.id === 'orbit-inner-celestial'
      ? 0.96
      : orbit.id === 'orbit-kinetic-sweep'
      ? 0.88
      : 0.72;

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
 * Computes collision-free LOCAL spatial constellation coordinates around a focused skill
 * for its 3–5 genuinely related technologies:
 * - Keeps the focused skill anchored smoothly near its current visual position (nudged only if
 *   too close to viewport edges or inside the central planetary sphere).
 * - Gathers related technologies as a cohesive local cluster around the focused technology rather
 *   than across the entire stage, preventing long filaments crossing the central planet and leaving
 *   the opposite hemisphere clean for borderless editorial typography.
 */
export function computeFocusedNetworkPositions(
  focusedSkillId: string,
  currentPositions: Map<string, { x: number; y: number; isVisible: boolean }>
): Map<string, { x: number; y: number }> {
  const result = new Map<string, { x: number; y: number }>();
  const focusedCurrent = currentPositions.get(focusedSkillId);

  let anchorX =
    focusedCurrent && focusedCurrent.isVisible
      ? Math.max(16, Math.min(84, focusedCurrent.x))
      : 32;
  let anchorY =
    focusedCurrent && focusedCurrent.isVisible
      ? Math.max(16, Math.min(80, focusedCurrent.y))
      : 54;

  // Gently keep the selected hero outside the central planetary sphere (50, 43.5)
  const pDx = anchorX - 50;
  const pDy = anchorY - 43.5;
  const planetDistSq = (pDx / 19.5) ** 2 + (pDy / 21.0) ** 2;
  if (planetDistSq < 1.0) {
    const angle = Math.abs(pDx) < 0.5 && Math.abs(pDy) < 0.5 ? Math.PI * 0.72 : Math.atan2(pDy, pDx);
    anchorX = Math.max(16, Math.min(84, 50 + Math.cos(angle) * 20.5));
    anchorY = Math.max(16, Math.min(80, 43.5 + Math.sin(angle) * 22.0));
  }

  const placedPoints: { x: number; y: number }[] = [{ x: anchorX, y: anchorY }];
  result.set(focusedSkillId, { x: anchorX, y: anchorY });

  const relatedIds = getRelatedSkillIds(focusedSkillId).slice(0, 5);
  if (relatedIds.length === 0) return result;

  // Deterministic angle seed from focusedSkillId so each technology gets an organic constellation
  let hash = 2166136261;
  for (let i = 0; i < focusedSkillId.length; i++) {
    hash ^= focusedSkillId.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const baseAngleOffset = ((hash >>> 0) % 360) * (Math.PI / 180);

  // Determine which hemisphere hosts the constellation so the opposite side remains open
  const clusterOnLeft = anchorX < 50;

  const isOutsidePlanetCore = (x: number, y: number) => {
    const dx = x - 50;
    const dy = y - 43.5;
    return (dx / 20.2) ** 2 + (dy / 22.0) ** 2 >= 1.0;
  };

  // Generate local asymmetric constellation candidate slots around (anchorX, anchorY)
  const localRings = [
    { rx: 16.0, ry: 19.5, samples: 16 },
    { rx: 22.5, ry: 26.0, samples: 20 },
    { rx: 29.0, ry: 32.0, samples: 24 },
    { rx: 35.5, ry: 38.0, samples: 28 },
  ];

  const candidateSlots: { x: number; y: number; localDist: number }[] = [];
  for (let rIdx = 0; rIdx < localRings.length; rIdx++) {
    const ring = localRings[rIdx];
    for (let s = 0; s < ring.samples; s++) {
      const angle = baseAngleOffset + rIdx * 0.42 + (s / ring.samples) * Math.PI * 2;
      const cx = anchorX + Math.cos(angle) * ring.rx;
      const cy = anchorY + Math.sin(angle) * ring.ry;
      if (
        cx >= 8.5 &&
        cx <= 91.5 &&
        cy >= 12.5 &&
        cy <= 86.5 &&
        isOutsidePlanetCore(cx, cy)
      ) {
        candidateSlots.push({
          x: cx,
          y: cy,
          localDist: Math.hypot((cx - anchorX) * 1.1, cy - anchorY),
        });
      }
    }
  }

  // Fallback wider arc only if geometry is unusually boxed in
  if (candidateSlots.length < relatedIds.length * 2) {
    for (let s = 0; s < 32; s++) {
      const angle = baseAngleOffset + (s / 32) * Math.PI * 2;
      const cx = anchorX + Math.cos(angle) * 42;
      const cy = anchorY + Math.sin(angle) * 42;
      if (cx >= 8.5 && cx <= 91.5 && cy >= 12.5 && cy <= 86.5 && isOutsidePlanetCore(cx, cy)) {
        candidateSlots.push({
          x: cx,
          y: cy,
          localDist: Math.hypot((cx - anchorX) * 1.1, cy - anchorY),
        });
      }
    }
  }

  relatedIds.forEach((relId) => {
    const cur = currentPositions.get(relId);
    let bestSlot = candidateSlots[0] || { x: anchorX, y: Math.max(14, anchorY - 18), localDist: 18 };
    let bestScore = Infinity;

    for (const slot of candidateSlots) {
      let minClearance = Infinity;
      for (let pIdx = 0; pIdx < placedPoints.length; pIdx++) {
        const existing = placedPoints[pIdx];
        // Hero and sibling satellites need generous vertical label clearance
        const minDx = pIdx === 0 ? 14.0 : 12.8;
        const minDy = pIdx === 0 ? 18.0 : 17.0;
        const dx = (slot.x - existing.x) / minDx;
        const dy = (slot.y - existing.y) / minDy;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < minClearance) minClearance = d;
      }

      // Steep hard penalty if overlapping hero or previously placed satellite (or its bottom label)
      const collisionPenalty = minClearance < 1.0 ? (1.0 - minClearance) * 12000 + 2000 : 0;

      // Keep satellites clustered locally around (anchorX, anchorY) (ideal radial distance ~17-25%)
      const distPenalty = Math.abs(slot.localDist - 20.5) * 18 + Math.max(0, slot.localDist - 29) * 32;

      // Strictly preserve the opposite hemisphere open for borderless editorial typography
      const oppositeLeak = clusterOnLeft
        ? Math.max(0, slot.x - 50)
        : Math.max(0, 50 - slot.x);
      const hemispherePenalty = oppositeLeak * 280;

      // Subtle directional continuity hint when candidate is otherwise similar
      const continuityHint =
        cur && cur.isVisible
          ? Math.hypot(slot.x - cur.x, slot.y - cur.y) * 0.9
          : 0;

      // Reward clean breathing room beyond minimum threshold modestly
      const spacingBonus = Math.min(0.45, Math.max(0, minClearance - 1.0)) * 26;

      const score =
        collisionPenalty + distPenalty + hemispherePenalty + continuityHint - spacingBonus;

      if (score < bestScore) {
        bestScore = score;
        bestSlot = slot;
      }
    }

    const chosen = { x: bestSlot.x, y: bestSlot.y };
    result.set(relId, chosen);
    placedPoints.push(chosen);
  });

  return result;
}

export { getRelatedSkillIds, getSkillTier };
