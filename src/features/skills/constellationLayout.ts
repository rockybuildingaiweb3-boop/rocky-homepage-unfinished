/**
 * Constellation Spatial Field Engine
 *
 * Provides:
 * 1. Canonical V2 88-node layout exports (preserved for validation & diagnostic scripts).
 * 2. Three-Level Hierarchical Constellation Architecture:
 *    - Level 1: 8 Organized Category Constellations orbiting the central purple planet.
 *    - Level 2: Expanded Category Constellation with 3 distinct gravitational orbital tiers
 *               (Core -> inner gravity well, Professional -> mid orbit, Ecosystem -> outer halo).
 *    - Level 3: Focused Skill Constellation with deterministic cross-category satellite anchors
 *               for related technologies and selective relationship conduit geometry.
 */

import {
  SKILLS_DATA,
  SKILL_CATEGORIES,
  SkillItem,
  SkillCategory,
  SkillTier,
} from '../../data/skills';
import { getRelatedSkillIds, getSkillTier } from './skillRelationships';

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

// ─────────────────────────────────────────────────────────────────────────────
// NEW HIERARCHICAL CONSTELLATION TYPES & DETERMINISTIC ENGINE (LEVELS 1, 2, 3)
// ─────────────────────────────────────────────────────────────────────────────

export interface CategoryConstellationCluster {
  id: string;
  number: string;
  title: string;
  shortLabel: string;
  subtitle: string;
  /** Desktop orbital coordinates (percentage 0..100 around central planet 50,50) */
  x: number;
  y: number;
  /** Peripheral docked coordinates when another category is expanded */
  recessedX: number;
  recessedY: number;
  /** Angle in degrees around the planetary core */
  angleDeg: number;
  /** Representative flagship core skill acting as the visual nucleus */
  nucleusSkill: SkillItem;
  /** Core & top supporting skills shown as orbiting micro-satellites in Level 1 */
  satelliteSkills: SkillItem[];
  /** Complete list of skills in this category (11 items) */
  skills: SkillItem[];
  /** Brand color accent derived from category core identity */
  accentColor: string;
  /** Tier counts for immediate structural hierarchy awareness */
  tierCounts: {
    core: number;
    professional: number;
    ecosystem: number;
  };
  /** Deterministic float animation phase offset (seconds) */
  floatPhase: number;
}

export interface ExpandedSkillNodePosition {
  skill: SkillItem;
  tier: SkillTier;
  x: number;
  y: number;
  /** Radial distance from center (50, 50) in percentage space */
  radius: number;
  /** Angle in degrees around center (50, 50) */
  angleDeg: number;
  /** True if this node belongs to another category and was summoned as a related node */
  isCrossCategoryRelated: boolean;
  /** Deterministic orbital drift phase */
  driftPhase: number;
}

export interface ExpandedCategoryConstellation {
  category: CategoryConstellationCluster;
  /** Primary category nodes + any cross-category related nodes when a skill is focused */
  nodes: ExpandedSkillNodePosition[];
  nodeMap: Map<string, ExpandedSkillNodePosition>;
  /** Orbital ring radii (rx, ry in stage percentage) for visual tier guides */
  tierRings: {
    core: { rx: number; ry: number };
    professional: { rx: number; ry: number };
    ecosystem: { rx: number; ry: number };
  };
}

/**
 * Authoritative Category Constellation Orbital Anchors (Level 1 Overview)
 * Arranged as an balanced 8-region elliptical celestial ring framing the central
 * purple planet at (50, 50). Leaves the central planet core (r < 24%) completely unobstructed.
 */
const CATEGORY_ORBITAL_CONFIG: Record<
  string,
  {
    x: number;
    y: number;
    recessedX: number;
    recessedY: number;
    nucleusId: string;
    accentColor: string;
  }
> = {
  frontend: {
    x: 35,
    y: 17,
    recessedX: 8,
    recessedY: 14,
    nucleusId: 'react',
    accentColor: '#61DAFB',
  },
  models: {
    x: 65,
    y: 17,
    recessedX: 28,
    recessedY: 8,
    nucleusId: 'openai',
    accentColor: '#8E75FF',
  },
  graphics: {
    x: 18,
    y: 37,
    recessedX: 92,
    recessedY: 14,
    nucleusId: 'threedotjs',
    accentColor: '#049EF4',
  },
  agents: {
    x: 82,
    y: 37,
    recessedX: 6,
    recessedY: 38,
    nucleusId: 'langgraph',
    accentColor: '#34D399',
  },
  web3: {
    x: 14,
    y: 60,
    recessedX: 72,
    recessedY: 8,
    nucleusId: 'solidity',
    accentColor: '#A855F7',
  },
  backend: {
    x: 86,
    y: 60,
    recessedX: 94,
    recessedY: 38,
    nucleusId: 'fastapi',
    accentColor: '#10B981',
  },
  rag: {
    x: 24,
    y: 82,
    recessedX: 7,
    recessedY: 64,
    nucleusId: 'pgvector',
    accentColor: '#38BDF8',
  },
  data: {
    x: 76,
    y: 82,
    recessedX: 93,
    recessedY: 64,
    nucleusId: 'postgresql',
    accentColor: '#4169E1',
  },
};

/**
 * Builds the 8 Category Constellation Clusters for Level 1 Overview.
 */
export function getCategoryConstellations(): CategoryConstellationCluster[] {
  return SKILL_CATEGORIES.map((cat: SkillCategory, index: number) => {
    const config = CATEGORY_ORBITAL_CONFIG[cat.id] || {
      x: 50,
      y: 50,
      recessedX: 10,
      recessedY: 10,
      nucleusId: '',
      accentColor: '#A855F7',
    };

    const skills = SKILLS_DATA.filter((s) => s.categoryId === cat.id);
    const coreSkills = skills.filter((s) => getSkillTier(s.id) === 'core');
    const professionalSkills = skills.filter((s) => getSkillTier(s.id) === 'professional');
    const ecosystemSkills = skills.filter((s) => getSkillTier(s.id) === 'ecosystem');

    const nucleusSkill =
      skills.find((s) => s.id === config.nucleusId) ||
      coreSkills[0] ||
      skills[0];

    // Pick 3 orbiting satellite preview skills (excluding the nucleus itself)
    const remainingCoreAndProf = [...coreSkills, ...professionalSkills].filter(
      (s) => s.id !== nucleusSkill.id
    );
    const satelliteSkills = remainingCoreAndProf.slice(0, 3);

    const dx = config.x - 50;
    const dy = config.y - 50;
    let angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angleDeg < 0) angleDeg += 360;

    return {
      id: cat.id,
      number: cat.number,
      title: cat.title,
      shortLabel: CATEGORY_SHORT_LABELS[cat.id] || cat.title.toUpperCase(),
      subtitle: cat.subtitle,
      x: config.x,
      y: config.y,
      recessedX: config.recessedX,
      recessedY: config.recessedY,
      angleDeg: parseFloat(angleDeg.toFixed(1)),
      nucleusSkill,
      satelliteSkills,
      skills,
      accentColor: config.accentColor,
      tierCounts: {
        core: coreSkills.length,
        professional: professionalSkills.length,
        ecosystem: ecosystemSkills.length,
      },
      floatPhase: index * 0.85,
    };
  });
}

export const CATEGORY_CONSTELLATIONS: CategoryConstellationCluster[] =
  getCategoryConstellations();

/**
 * Computes the deterministic Level 2 & Level 3 Expanded Category Constellation layout.
 */
export function computeExpandedCategoryLayout(
  categoryId: string,
  focusedSkillId: string | null = null
): ExpandedCategoryConstellation {
  const category =
    CATEGORY_CONSTELLATIONS.find((c) => c.id === categoryId) ||
    CATEGORY_CONSTELLATIONS[0];

  const categorySkills = category.skills;

  const coreSkills = categorySkills.filter((s) => getSkillTier(s.id) === 'core');
  const profSkills = categorySkills.filter((s) => getSkillTier(s.id) === 'professional');
  const ecoSkills = categorySkills.filter((s) => getSkillTier(s.id) === 'ecosystem');

  const tierRings = {
    core: { rx: 20.5, ry: 19.5 },
    professional: { rx: 31.5, ry: 29.5 },
    ecosystem: { rx: 41.5, ry: 38.0 },
  };

  const nodes: ExpandedSkillNodePosition[] = [];
  const nodeMap = new Map<string, ExpandedSkillNodePosition>();

  const catIndex = SKILL_CATEGORIES.findIndex((c) => c.id === category.id);
  const baseRotationDeg = (catIndex * 25) % 360;

  const placeTierBand = (
    items: SkillItem[],
    tier: SkillTier,
    rx: number,
    ry: number,
    startAngleDeg: number
  ) => {
    const count = items.length;
    if (count === 0) return;

    for (let i = 0; i < count; i++) {
      const skill = items[i];
      const step = 360 / count;
      const angleDeg = (startAngleDeg + i * step) % 360;
      const rad = (angleDeg * Math.PI) / 180;

      const radialMod = (i % 2 === 0 ? 1 : -1) * 1.1;
      const effectiveRx = rx + radialMod;
      const effectiveRy = ry + radialMod * 0.85;

      const x = Math.max(9, Math.min(91, 50 + Math.cos(rad) * effectiveRx));
      const y = Math.max(11, Math.min(86, 50 + Math.sin(rad) * effectiveRy));
      const radius = Math.sqrt((x - 50) ** 2 + (y - 50) ** 2);

      const pos: ExpandedSkillNodePosition = {
        skill,
        tier,
        x: parseFloat(x.toFixed(2)),
        y: parseFloat(y.toFixed(2)),
        radius: parseFloat(radius.toFixed(2)),
        angleDeg: parseFloat(angleDeg.toFixed(1)),
        isCrossCategoryRelated: false,
        driftPhase: i * 0.7 + (tier === 'core' ? 0 : tier === 'professional' ? 1.3 : 2.5),
      };

      nodes.push(pos);
      nodeMap.set(skill.id, pos);
    }
  };

  placeTierBand(coreSkills, 'core', tierRings.core.rx, tierRings.core.ry, -90 + baseRotationDeg * 0.3);
  placeTierBand(
    profSkills,
    'professional',
    tierRings.professional.rx,
    tierRings.professional.ry,
    -52 + baseRotationDeg * 0.5
  );
  placeTierBand(
    ecoSkills,
    'ecosystem',
    tierRings.ecosystem.rx,
    tierRings.ecosystem.ry,
    -18 + baseRotationDeg * 0.7
  );

  // Place cross-category related skills in dedicated non-overlapping outer gateway slots
  if (focusedSkillId) {
    const relatedIds = getRelatedSkillIds(focusedSkillId).slice(0, 6);
    const crossCategoryRelatedSkills = relatedIds
      .map((rid) => SKILLS_DATA.find((s) => s.id === rid))
      .filter((s): s is SkillItem => Boolean(s && !nodeMap.has(s.id)));

    // Candidate outer gateway anchors around the perimeter
    const gatewayCandidates = [
      { x: 14, y: 18 },
      { x: 86, y: 18 },
      { x: 11, y: 42 },
      { x: 89, y: 42 },
      { x: 14, y: 68 },
      { x: 86, y: 68 },
      { x: 32, y: 14 },
      { x: 68, y: 14 },
      { x: 26, y: 82 },
      { x: 74, y: 82 },
    ];

    crossCategoryRelatedSkills.forEach((relSkill, idx) => {
      // Pick the gateway candidate with maximum clearance from all existing nodes
      let bestPoint = gatewayCandidates[idx % gatewayCandidates.length];
      let bestMinClearance = -1;

      for (const cand of gatewayCandidates) {
        let minClearance = Infinity;
        for (const existing of nodes) {
          const dx = (cand.x - existing.x) / 1.0;
          const dy = (cand.y - existing.y) / 1.35; // Extra vertical weight for labels
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < minClearance) minClearance = d;
        }
        if (minClearance > bestMinClearance) {
          bestMinClearance = minClearance;
          bestPoint = cand;
        }
      }

      const x = bestPoint.x;
      const y = bestPoint.y;
      const radius = Math.sqrt((x - 50) ** 2 + (y - 50) ** 2);
      let angleDeg = Math.atan2(y - 50, x - 50) * (180 / Math.PI);
      if (angleDeg < 0) angleDeg += 360;

      const pos: ExpandedSkillNodePosition = {
        skill: relSkill,
        tier: getSkillTier(relSkill.id),
        x: parseFloat(x.toFixed(2)),
        y: parseFloat(y.toFixed(2)),
        radius: parseFloat(radius.toFixed(2)),
        angleDeg: parseFloat(angleDeg.toFixed(1)),
        isCrossCategoryRelated: true,
        driftPhase: 3.1 + idx * 0.9,
      };

      nodes.push(pos);
      nodeMap.set(relSkill.id, pos);
    });
  }

  return {
    category,
    nodes,
    nodeMap,
    tierRings,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LEGACY V2 88-ANCHOR SPATIAL ENGINE (PRESERVED FOR BUILD VALIDATION SCRIPTS)
// ─────────────────────────────────────────────────────────────────────────────

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

export function getInterleavedSkills(): typeof SKILLS_DATA {
  const byCategory = new Map<string, typeof SKILLS_DATA>();
  for (const cat of SKILL_CATEGORIES) {
    byCategory.set(cat.id, SKILLS_DATA.filter((s) => s.categoryId === cat.id));
  }

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

  for (let cycle = 0; cycle < 11; cycle++) {
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

export function computeConstellationLayout(isMobile: boolean = false): ConstellationLayout {
  const nodeNormW = isMobile ? 8.4 : 4.4;
  const nodeNormH = isMobile ? 3.6 : 6.0;
  const planetRx = isMobile ? 18.0 : 19.5;
  const planetRy = isMobile ? 15.0 : 20.5;

  const anchors = isMobile ? AUTHORED_MOBILE_SPATIAL_ANCHORS : AUTHORED_DESKTOP_SPATIAL_ANCHORS;
  const rawAnchors = anchors.map((a, idx) => ({ idx, x: a.x, y: a.y }));

  const ITERATIONS = isMobile ? 55 : 45;
  for (let iter = 0; iter < ITERATIONS; iter++) {
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

    for (const a of rawAnchors) {
      a.x = Math.max(isMobile ? 4.5 : 3.8, Math.min(isMobile ? 95.5 : 96.2, a.x));
      a.y = Math.max(isMobile ? 4.0 : 4.5, Math.min(isMobile ? 97.0 : 95.5, a.y));
    }
  }

  const sortedAnchors = [...rawAnchors].sort((a, b) => {
    let angleA = Math.atan2(a.y - 50, a.x - 50) * (180 / Math.PI);
    if (angleA < 0) angleA += 360;
    let angleB = Math.atan2(b.y - 50, b.x - 50) * (180 / Math.PI);
    if (angleB < 0) angleB += 360;
    return angleA - angleB;
  });

  const interleavedSkills = getInterleavedSkills();
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

export const DESKTOP_CONSTELLATION = computeConstellationLayout(false);
export const MOBILE_CONSTELLATION = computeConstellationLayout(true);
