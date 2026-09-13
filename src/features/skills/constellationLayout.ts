/**
 * Constellation Spatial Field Engine (Skills V2 — Cross-Category Weaving)
 *
 * Authored, deterministic 2D spatial field framing the central celestial planet.
 * Fully decouples skill category from spatial placement:
 * 1. 88 Authored Spatial Anchors:
 *    - Independent Cartesian coordinates across the 2D stage percentage space.
 *    - High radial variance, non-uniform angular density, and natural asymmetry.
 *    - No spatial region, zone, or quadrant is assigned to any category.
 *
 * 2. Deterministic Cross-Category Interleaving:
 *    - Skills from different disciplines are deterministically interleaved onto the spatial field.
 *    - Zero Math.random(). 100% reproducible across renders and platforms.
 *    - Local neighborhoods naturally contain diverse combinations
 *      (e.g., React + OpenAI + Three.js + PostgreSQL + Solidity).
 *
 * 3. Physics-Based Deterministic Clearance:
 *    - Local (dx, dy) repulsion ensures 0 node collisions.
 *    - Celestial planet exclusion boundary protection.
 *    - Viewport boundary containment.
 */

import { SKILLS_DATA, SKILL_CATEGORIES } from '../../data/skills';

export interface ConstellationNodePosition {
  id: string;
  x: number;
  y: number;
  categoryId: string;
}

export interface CategoryLabelPosition {
  id: string;
  number: string;
  title: string;
  shortLabel: string;
  x: number;
  y: number;
}

export interface ConstellationLayout {
  nodePositions: Map<string, ConstellationNodePosition>;
  categoryLabels: CategoryLabelPosition[];
  nodeList: ConstellationNodePosition[];
}

export interface GeometryDiagnostics {
  radialDistance: {
    min: number;
    max: number;
    mean: number;
    stdDev: number;
  };
  angularBins: number[]; // 8 equal 45-degree bins around center (0°..360°)
  quadrants: {
    upperLeft: number;
    upperRight: number;
    lowerLeft: number;
    lowerRight: number;
  };
  nearestNeighborDistance: {
    min: number;
    mean: number;
    stdDev: number;
  };
}

export interface CategoryDiversityDiagnostics {
  kNeighbors: number;
  avgSameCategoryNeighbors: number;
  sameCategoryPercentage: number;
  avgDistinctCategoriesInNeighborhood: number;
  quadrantDistribution: Record<
    string,
    { upperLeft: number; upperRight: number; lowerLeft: number; lowerRight: number }
  >;
  maxQuadrantConcentration: number;
}

/**
 * Editorial Category Labels (Restrained contextual annotations)
 */
export const CATEGORY_SHORT_LABELS: Record<string, string> = {
  frontend: 'CORE FRONTEND',
  graphics: '3D & GRAPHICS',
  backend: 'BACKEND & APIS',
  data: 'DATA & STORAGE',
  web3: 'WEB3 PROTOCOLS',
  models: 'AI MODELS',
  agents: 'AI AGENTS',
  rag: 'RAG & RETRIEVAL',
};

/**
 * 88 Authored 2D Spatial Anchors for Desktop Viewports (x: 4..96, y: 5..95)
 * Pure Cartesian coordinates defining the organic constellation composition.
 * Completely independent of skill categories.
 */
const AUTHORED_DESKTOP_SPATIAL_ANCHORS: { x: number; y: number }[] = [
  // Upper Crest & High Flanks
  { x: 44, y: 15 }, { x: 52, y: 13 }, { x: 60, y: 17 }, { x: 48, y: 22 }, { x: 38, y: 19 }, { x: 34, y: 12 },
  // North-West Field & Upper Outer Halo
  { x: 32, y: 26 }, { x: 26, y: 23 }, { x: 22, y: 16 }, { x: 17, y: 22 }, { x: 27, y: 32 }, { x: 35, y: 33 },
  { x: 13, y: 28 }, { x: 8,  y: 19 }, { x: 16, y: 35 },
  // North-East Reach & Outer Corridor
  { x: 65, y: 21 }, { x: 72, y: 18 }, { x: 70, y: 12 }, { x: 80, y: 16 }, { x: 78, y: 24 }, { x: 84, y: 26 },
  { x: 89, y: 19 }, { x: 93, y: 27 }, { x: 82, y: 33 },
  // Mid-West Flank
  { x: 24, y: 43 }, { x: 18, y: 44 }, { x: 26, y: 51 }, { x: 12, y: 42 }, { x: 9,  y: 49 }, { x: 16, y: 37 },
  { x: 6,  y: 40 }, { x: 5,  y: 56 }, { x: 14, y: 55 },
  // South-West Reef & Arch
  { x: 29, y: 61 }, { x: 24, y: 64 }, { x: 19, y: 62 }, { x: 32, y: 69 }, { x: 26, y: 72 }, { x: 16, y: 69 },
  { x: 21, y: 78 }, { x: 12, y: 65 }, { x: 14, y: 76 }, { x: 27, y: 83 }, { x: 8,  y: 73 }, { x: 20, y: 55 },
  // South Floor, Floor Nadir & Deep Foundation
  { x: 37, y: 68 }, { x: 44, y: 72 }, { x: 49, y: 68 }, { x: 54, y: 73 }, { x: 39, y: 76 }, { x: 33, y: 77 },
  { x: 59, y: 74 }, { x: 47, y: 81 }, { x: 41, y: 83 }, { x: 45, y: 89 }, { x: 36, y: 86 }, { x: 53, y: 89 },
  { x: 31, y: 90 }, { x: 23, y: 86 }, { x: 16, y: 84 }, { x: 10, y: 86 }, { x: 6,  y: 83 }, { x: 5,  y: 93 },
  // Mid-East Flank & Outer Cluster
  { x: 74, y: 38 }, { x: 83, y: 38 }, { x: 89, y: 39 }, { x: 86, y: 33 }, { x: 76, y: 46 }, { x: 83, y: 45 },
  { x: 91, y: 46 }, { x: 72, y: 54 }, { x: 89, y: 52 }, { x: 94, y: 58 },
  // South-East Flank & Canyon Reach
  { x: 72, y: 45 }, { x: 79, y: 51 }, { x: 68, y: 58 }, { x: 77, y: 61 }, { x: 64, y: 66 }, { x: 86, y: 59 },
  { x: 74, y: 67 }, { x: 82, y: 67 }, { x: 71, y: 75 }, { x: 79, y: 74 }, { x: 90, y: 68 }, { x: 66, y: 82 },
  { x: 61, y: 85 }, { x: 77, y: 82 }, { x: 86, y: 82 },
];

/**
 * 88 Authored 2D Spatial Anchors for Mobile Viewports (Vertical stage, y: 5..97)
 * Pure Cartesian coordinates tailored to vertical mobile screens.
 */
const AUTHORED_MOBILE_SPATIAL_ANCHORS: { x: number; y: number }[] = [
  // Top Sector (y: 5..33)
  { x: 50, y: 7 }, { x: 38, y: 8 }, { x: 62, y: 8 }, { x: 25, y: 8 }, { x: 75, y: 8 },
  { x: 50, y: 14 }, { x: 36, y: 14 }, { x: 64, y: 14 }, { x: 22, y: 14 }, { x: 78, y: 14 },
  { x: 10, y: 11 }, { x: 90, y: 11 }, { x: 18, y: 20 }, { x: 82, y: 20 }, { x: 30, y: 20 },
  { x: 70, y: 20 }, { x: 42, y: 20 }, { x: 58, y: 20 }, { x: 8,  y: 19 }, { x: 92, y: 19 },
  { x: 12, y: 27 }, { x: 88, y: 27 }, { x: 24, y: 28 }, { x: 76, y: 28 },

  // Flanking Left & Right of Planet (y: 33..67)
  { x: 20, y: 35 }, { x: 9,  y: 36 }, { x: 14, y: 43 }, { x: 24, y: 43 }, { x: 9,  y: 50 },
  { x: 21, y: 51 }, { x: 8,  y: 58 }, { x: 20, y: 58 }, { x: 7,  y: 65 }, { x: 19, y: 65 },
  { x: 80, y: 35 }, { x: 91, y: 36 }, { x: 76, y: 43 }, { x: 88, y: 43 }, { x: 79, y: 50 },
  { x: 91, y: 50 }, { x: 78, y: 58 }, { x: 90, y: 58 }, { x: 78, y: 65 }, { x: 90, y: 65 },

  // Bottom Sector (y: 68..97)
  { x: 36, y: 70 }, { x: 50, y: 69 }, { x: 64, y: 70 }, { x: 24, y: 72 }, { x: 76, y: 72 },
  { x: 88, y: 72 }, { x: 12, y: 72 }, { x: 32, y: 76 }, { x: 44, y: 75 }, { x: 56, y: 75 },
  { x: 68, y: 76 }, { x: 20, y: 78 }, { x: 80, y: 78 }, { x: 90, y: 78 }, { x: 9,  y: 78 },
  { x: 28, y: 82 }, { x: 40, y: 81 }, { x: 60, y: 81 }, { x: 72, y: 82 }, { x: 16, y: 84 },
  { x: 84, y: 84 }, { x: 26, y: 88 }, { x: 36, y: 87 }, { x: 50, y: 86 }, { x: 64, y: 87 },
  { x: 74, y: 88 }, { x: 9,  y: 87 }, { x: 91, y: 87 }, { x: 32, y: 92 }, { x: 44, y: 91 },
  { x: 56, y: 91 }, { x: 68, y: 92 }, { x: 20, y: 93 }, { x: 80, y: 93 }, { x: 10, y: 93 },
  { x: 90, y: 93 }, { x: 36, y: 96 }, { x: 46, y: 96 }, { x: 54, y: 96 }, { x: 64, y: 96 },
  { x: 16, y: 96 }, { x: 84, y: 96 }, { x: 6,  y: 96 }, { x: 94, y: 96 },
];

/**
 * Editorial Category Labels Positioning (Non-circular, non-cluster framing)
 */
const DESKTOP_EDITORIAL_LABELS: Record<string, { x: number; y: number }> = {
  frontend: { x: 34.0, y: 7.0 },
  graphics: { x: 76.0, y: 8.0 },
  backend:  { x: 82.0, y: 55.0 },
  data:     { x: 56.0, y: 94.0 },
  web3:     { x: 87.0, y: 30.0 },
  models:   { x: 11.0, y: 33.0 },
  agents:   { x: 18.0, y: 72.0 },
  rag:      { x: 24.0, y: 94.0 },
};

const MOBILE_EDITORIAL_LABELS: Record<string, { x: number; y: number }> = {
  frontend: { x: 30.0, y: 4.0 },
  graphics: { x: 72.0, y: 4.0 },
  backend:  { x: 84.0, y: 68.0 },
  data:     { x: 52.0, y: 98.5 },
  web3:     { x: 85.0, y: 32.0 },
  models:   { x: 14.0, y: 32.0 },
  agents:   { x: 16.0, y: 68.0 },
  rag:      { x: 22.0, y: 98.5 },
};

/**
 * Deterministically interleave skills from all 8 categories.
 * Produces an ordered array of 88 skills where adjacent entries
 * belong to different technological disciplines.
 * Zero Math.random().
 */
export function getInterleavedSkills(): typeof SKILLS_DATA {
  const byCategory = new Map<string, typeof SKILLS_DATA>();
  for (const cat of SKILL_CATEGORIES) {
    byCategory.set(cat.id, SKILLS_DATA.filter((s) => s.categoryId === cat.id));
  }

  // Cross-cutting sequence of disciplines
  const categoryCycle = [
    'frontend',
    'models',
    'graphics',
    'data',
    'web3',
    'agents',
    'backend',
    'rag',
  ];

  const interleaved: typeof SKILLS_DATA = [];

  // 11 items per category across 8 categories = 88 items
  for (let cycle = 0; cycle < 11; cycle++) {
    // Subtle offset per cycle prevents repetition of exact adjacent pairs
    const shift = (cycle * 3) % categoryCycle.length;
    for (let i = 0; i < categoryCycle.length; i++) {
      const catId = categoryCycle[(i + shift) % categoryCycle.length];
      const list = byCategory.get(catId);
      if (list && list[cycle]) {
        interleaved.push(list[cycle]);
      }
    }
  }

  return interleaved;
}

/**
 * Compute the complete deterministic 2D spatial constellation layout
 * with cross-category weaving.
 */
export function computeConstellationLayout(isMobile: boolean = false): ConstellationLayout {
  const nodeNormW = isMobile ? 8.4 : 4.4;
  const nodeNormH = isMobile ? 3.6 : 6.0;
  const planetRx = isMobile ? 18.0 : 19.5;
  const planetRy = isMobile ? 15.0 : 20.5;

  const anchors = isMobile ? AUTHORED_MOBILE_SPATIAL_ANCHORS : AUTHORED_DESKTOP_SPATIAL_ANCHORS;

  // Clone anchors for deterministic relaxation
  const rawAnchors = anchors.map((a, idx) => ({ idx, x: a.x, y: a.y }));

  // Local physics-based relaxation loop
  const ITERATIONS = isMobile ? 55 : 45;
  for (let iter = 0; iter < ITERATIONS; iter++) {
    // 1. Planet exclusion boundary protection
    for (const a of rawAnchors) {
      const dx = a.x - 50;
      const dy = a.y - 50;
      const distPlanet = Math.sqrt((dx / planetRx) ** 2 + (dy / planetRy) ** 2);
      if (distPlanet < 1.02) {
        const scale = 1.04 / Math.max(distPlanet, 0.001);
        a.x = 50 + dx * scale;
        a.y = 50 + dy * scale;
      }
    }

    // 2. Node-to-node collision relaxation along local offset vectors
    for (let i = 0; i < rawAnchors.length; i++) {
      for (let j = i + 1; j < rawAnchors.length; j++) {
        const a1 = rawAnchors[i];
        const a2 = rawAnchors[j];
        const dx = a2.x - a1.x;
        const dy = a2.y - a1.y;
        const normDist = Math.sqrt((dx / nodeNormW) ** 2 + (dy / nodeNormH) ** 2);
        if (normDist < 1.05 && normDist > 0.0001) {
          const overlap = 1.05 - normDist;
          const pushX = (dx / normDist) * overlap * 0.45 * nodeNormW;
          const pushY = (dy / normDist) * overlap * 0.45 * nodeNormH;
          a1.x -= pushX * 0.5;
          a1.y -= pushY * 0.5;
          a2.x += pushX * 0.5;
          a2.y += pushY * 0.5;
        }
      }
    }

    // 3. Viewport bounds protection
    for (const a of rawAnchors) {
      a.x = Math.max(isMobile ? 4.5 : 3.8, Math.min(isMobile ? 95.5 : 96.2, a.x));
      a.y = Math.max(isMobile ? 4.0 : 4.5, Math.min(isMobile ? 97.0 : 95.5, a.y));
    }
  }

  // Sort relaxed anchors along continuous spatial sweep around center (50, 50)
  const sortedAnchors = [...rawAnchors].sort((a, b) => {
    let angleA = Math.atan2(a.y - 50, a.x - 50) * (180 / Math.PI);
    if (angleA < 0) angleA += 360;
    let angleB = Math.atan2(b.y - 50, b.x - 50) * (180 / Math.PI);
    if (angleB < 0) angleB += 360;
    return angleA - angleB;
  });

  // Interleave skills cross-categorically
  const interleavedSkills = getInterleavedSkills();

  // Assign interleaved skills 1:1 to spatially continuous anchors
  const nodePositions = new Map<string, ConstellationNodePosition>();
  const nodeList: ConstellationNodePosition[] = [];

  for (let i = 0; i < interleavedSkills.length; i++) {
    const skill = interleavedSkills[i];
    const anchor = sortedAnchors[i];

    const formatted: ConstellationNodePosition = {
      id: skill.id,
      x: parseFloat(anchor.x.toFixed(2)),
      y: parseFloat(anchor.y.toFixed(2)),
      categoryId: skill.categoryId,
    };
    nodePositions.set(skill.id, formatted);
    nodeList.push(formatted);
  }

  // Editorial Category Labels
  const labelCoords = isMobile ? MOBILE_EDITORIAL_LABELS : DESKTOP_EDITORIAL_LABELS;
  const categoryLabels: CategoryLabelPosition[] = SKILL_CATEGORIES.map((cat) => {
    const pos = labelCoords[cat.id] || { x: 50, y: 50 };
    return {
      id: cat.id,
      number: cat.number,
      title: cat.title,
      shortLabel: CATEGORY_SHORT_LABELS[cat.id] || cat.title.toUpperCase(),
      x: pos.x,
      y: pos.y,
    };
  });

  return {
    nodePositions,
    categoryLabels,
    nodeList,
  };
}

/**
 * Compute geometric diagnostics for layout validation:
 * - Radial distance: min, max, mean, stdDev
 * - Angular distribution: 8 equal 45° bins
 * - Quadrant distribution: upperLeft, upperRight, lowerLeft, lowerRight
 * - Nearest-neighbor distance: min, mean, stdDev
 */
export function computeGeometryDiagnostics(layout: ConstellationLayout): GeometryDiagnostics {
  const nodes = layout.nodeList;
  const radii: number[] = [];
  const angularBins = [0, 0, 0, 0, 0, 0, 0, 0];
  const quadrants = { upperLeft: 0, upperRight: 0, lowerLeft: 0, lowerRight: 0 };
  const nnDists: number[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    const dx = n.x - 50;
    const dy = n.y - 50;
    const r = Math.sqrt(dx * dx + dy * dy);
    radii.push(r);

    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    const bin = Math.min(Math.floor(angle / 45), 7);
    angularBins[bin]++;

    if (dx < 0 && dy < 0) quadrants.upperLeft++;
    else if (dx >= 0 && dy < 0) quadrants.upperRight++;
    else if (dx < 0 && dy >= 0) quadrants.lowerLeft++;
    else quadrants.lowerRight++;

    let minD = Infinity;
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue;
      const n2 = nodes[j];
      const d = Math.sqrt((n2.x - n.x) ** 2 + (n2.y - n.y) ** 2);
      if (d < minD) minD = d;
    }
    nnDists.push(minD);
  }

  const rMin = Math.min(...radii);
  const rMax = Math.max(...radii);
  const rMean = radii.reduce((a, b) => a + b, 0) / radii.length;
  const rStd = Math.sqrt(radii.reduce((a, b) => a + (b - rMean) ** 2, 0) / radii.length);

  const nnMin = Math.min(...nnDists);
  const nnMean = nnDists.reduce((a, b) => a + b, 0) / nnDists.length;
  const nnStd = Math.sqrt(nnDists.reduce((a, b) => a + (b - nnMean) ** 2, 0) / nnDists.length);

  return {
    radialDistance: {
      min: parseFloat(rMin.toFixed(2)),
      max: parseFloat(rMax.toFixed(2)),
      mean: parseFloat(rMean.toFixed(2)),
      stdDev: parseFloat(rStd.toFixed(2)),
    },
    angularBins,
    quadrants,
    nearestNeighborDistance: {
      min: parseFloat(nnMin.toFixed(2)),
      mean: parseFloat(nnMean.toFixed(2)),
      stdDev: parseFloat(nnStd.toFixed(2)),
    },
  };
}

/**
 * Compute Category Adjacency Diversity Diagnostics (Prompt 03-C)
 * Inspects nearest spatial neighbors and measures cross-category weaving.
 */
export function computeCategoryDiversityDiagnostics(
  layout: ConstellationLayout,
  k: number = 4
): CategoryDiversityDiagnostics {
  const nodes = layout.nodeList;
  let totalSameCatNeighbors = 0;
  let totalEvaluated = 0;
  const distinctCategoriesInNeighborhood: number[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const n1 = nodes[i];
    const dists = nodes
      .map((n2, j) => ({
        idx: j,
        node: n2,
        dist: i === j ? Infinity : Math.sqrt((n2.x - n1.x) ** 2 + (n2.y - n1.y) ** 2),
      }))
      .sort((a, b) => a.dist - b.dist);

    const neighbors = dists.slice(0, k).map((d) => d.node);
    const sameCat = neighbors.filter((n) => n.categoryId === n1.categoryId).length;
    totalSameCatNeighbors += sameCat;
    totalEvaluated += k;

    const uniqueCats = new Set([n1.categoryId, ...neighbors.map((n) => n.categoryId)]);
    distinctCategoriesInNeighborhood.push(uniqueCats.size);
  }

  // Quadrant distribution per category
  const quadrantDistribution: Record<
    string,
    { upperLeft: number; upperRight: number; lowerLeft: number; lowerRight: number }
  > = {};

  let maxQuadrantConcentration = 0;

  for (const cat of SKILL_CATEGORIES) {
    const catNodes = nodes.filter((n) => n.categoryId === cat.id);
    const q = { upperLeft: 0, upperRight: 0, lowerLeft: 0, lowerRight: 0 };
    catNodes.forEach((n) => {
      if (n.x < 50 && n.y < 50) q.upperLeft++;
      else if (n.x >= 50 && n.y < 50) q.upperRight++;
      else if (n.x < 50 && n.y >= 50) q.lowerLeft++;
      else q.lowerRight++;
    });
    quadrantDistribution[cat.id] = q;

    const highestInQuad = Math.max(q.upperLeft, q.upperRight, q.lowerLeft, q.lowerRight);
    if (highestInQuad > maxQuadrantConcentration) {
      maxQuadrantConcentration = highestInQuad;
    }
  }

  const avgSame = totalSameCatNeighbors / nodes.length;
  const samePct = (totalSameCatNeighbors / totalEvaluated) * 100;
  const avgDistinct =
    distinctCategoriesInNeighborhood.reduce((a, b) => a + b, 0) /
    distinctCategoriesInNeighborhood.length;

  return {
    kNeighbors: k,
    avgSameCategoryNeighbors: parseFloat(avgSame.toFixed(2)),
    sameCategoryPercentage: parseFloat(samePct.toFixed(1)),
    avgDistinctCategoriesInNeighborhood: parseFloat(avgDistinct.toFixed(2)),
    quadrantDistribution,
    maxQuadrantConcentration,
  };
}

// Precomputed static singletons for instantaneous rendering
export const DESKTOP_CONSTELLATION = computeConstellationLayout(false);
export const MOBILE_CONSTELLATION = computeConstellationLayout(true);
