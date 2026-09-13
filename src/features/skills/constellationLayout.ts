/**
 * Constellation Spatial Field Engine (Skills V2 — Spatial Field Architecture)
 *
 * Authored, deterministic 2D spatial field framing the central celestial planet.
 * Replaces all obsolete radial/orbital geometry (no angle attractors, no orbital rings,
 * no concentric zones).
 *
 * Core Architecture:
 * 1. 2D Spatial Field:
 *    - Authored Cartesian base anchors across 2D stage percentage space.
 *    - Cross-category ecosystem weaving where multiple disciplines share spatial regions
 *      and categories naturally span across neighboring areas.
 *    - High variance in distance from the central planet (min ~20%, max ~62%).
 *    - Asymmetric quadrant and angular distribution with intentional negative space corridors.
 *
 * 2. 100% Deterministic:
 *    - Zero Math.random().
 *    - Stable seeded FNV-1a PRNG for reproducible micro-variations.
 *    - Unchanged across re-renders, refreshes, and navigation.
 *
 * 3. Local Deterministic Collision & Planet Clearance:
 *    - Local (dx, dy) repulsion so relaxation does NOT push nodes into concentric circles.
 *    - Central planet exclusion boundary protection.
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

/**
 * Editorial Category Labels (Restrained annotations in 2D space)
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
 * Authored 2D Spatial Anchors for Desktop Viewports (x: 4..96, y: 5..95)
 * Interwoven cross-disciplinary placement with varied local density and deliberate negative space.
 */
const DESKTOP_AUTHORED_SEEDS: Record<string, { x: number; y: number }> = {
  // North Crest & Upper-Center (Frontend + 3D + AI Gateway)
  nextdotjs:    { x: 44, y: 15 },
  tailwindcss:  { x: 52, y: 13 },
  threedotjs:   { x: 60, y: 17 },
  r3f:          { x: 48, y: 22 },
  vercel:       { x: 38, y: 19 },
  vite:         { x: 34, y: 12 },

  // North-West Field (Interactive UI, Motion, Canvas)
  typescript:   { x: 32, y: 26 },
  react:        { x: 26, y: 23 },
  javascript:   { x: 22, y: 16 },
  svelte:       { x: 17, y: 22 },
  framer:       { x: 27, y: 32 },
  canvasapi:    { x: 35, y: 33 },
  greensock:    { x: 13, y: 28 },
  rive:         { x: 8,  y: 19 },
  html5:        { x: 16, y: 35 },

  // North-East Reach (3D Shaders, GPU, Spatial Tech)
  webgl:        { x: 65, y: 21 },
  glsl:         { x: 72, y: 18 },
  webgpu:       { x: 70, y: 12 },
  blender:      { x: 80, y: 16 },
  spline:       { x: 78, y: 24 },
  draco:        { x: 84, y: 26 },
  babylondotjs: { x: 89, y: 19 },
  unity:        { x: 93, y: 27 },
  ethers:       { x: 82, y: 33 },

  // West Flank (Frontier AI Models & Reasoning Engines)
  openai:       { x: 24, y: 43 },
  anthropic:    { x: 18, y: 44 },
  googlegemini: { x: 26, y: 51 },
  deepseek:     { x: 12, y: 42 },
  qwen:         { x: 9,  y: 49 },
  ollama:       { x: 16, y: 37 },
  togetherai:   { x: 6,  y: 40 },
  cohere:       { x: 5,  y: 56 },
  huggingface:  { x: 14, y: 55 },

  // South-West Reef (AI Agents, Orchestration & Synthesizers)
  langchain:    { x: 29, y: 61 },
  mcp:          { x: 24, y: 64 },
  langgraph:    { x: 19, y: 62 },
  llamaindex:   { x: 32, y: 69 },
  crewai:       { x: 26, y: 72 },
  autogen:      { x: 16, y: 69 },
  dify:         { x: 21, y: 78 },
  coze:         { x: 12, y: 65 },
  semantickernel:{ x: 14, y: 76 },
  langsmith:    { x: 27, y: 83 },
  haystack:     { x: 8,  y: 73 },
  groq:         { x: 20, y: 55 },

  // South Floor & Nadir (Vector Infrastructure & Distributed Data)
  pgvector:     { x: 37, y: 68 },
  postgresql:   { x: 44, y: 72 },
  weaviate:     { x: 49, y: 68 },
  qdrant:       { x: 54, y: 73 },
  chroma:       { x: 39, y: 76 },
  milvus:       { x: 33, y: 77 },
  redis:        { x: 59, y: 74 },
  mysql:        { x: 47, y: 81 },
  docker:       { x: 41, y: 83 },
  linux:        { x: 45, y: 89 },
  git:          { x: 36, y: 86 },
  kubernetes:   { x: 53, y: 89 },
  pinecone:     { x: 31, y: 90 },
  llamaparse:   { x: 23, y: 86 },
  unstructured: { x: 16, y: 84 },
  prometheus:   { x: 10, y: 86 },
  grafana:      { x: 6,  y: 83 },
  sentry:       { x: 5,  y: 93 },

  // Mid-East & South-East Reef (Web3 Protocols & Decentralized Systems)
  solidity:     { x: 74, y: 38 },
  viem:         { x: 83, y: 38 },
  wagmi:        { x: 89, y: 39 },
  foundry:      { x: 86, y: 33 },
  privy:        { x: 76, y: 46 },
  erc4337:      { x: 83, y: 45 },
  thegraph:     { x: 91, y: 46 },
  siwe:         { x: 72, y: 54 },
  hardhat:      { x: 89, y: 52 },
  ipfs:         { x: 94, y: 58 },

  // South-East Flank & Canyon (Backend APIs, Engines & Event Queues)
  nodedotjs:    { x: 72, y: 45 },
  express:      { x: 79, y: 51 },
  fastapi:      { x: 68, y: 58 },
  prisma:       { x: 77, y: 61 },
  drizzle:      { x: 64, y: 66 },
  trpc:         { x: 86, y: 59 },
  graphql:      { x: 74, y: 67 },
  flask:        { x: 82, y: 67 },
  springboot:   { x: 71, y: 75 },
  pydantic:     { x: 79, y: 74 },
  nginx:        { x: 90, y: 68 },
  supabase:     { x: 66, y: 82 },
  rabbitmq:     { x: 61, y: 85 },
  kafka:        { x: 77, y: 82 },
  celery:       { x: 86, y: 82 },
};

/**
 * Authored 2D Spatial Anchors for Mobile Viewports (Tall aspect ratio, y: 5..97)
 */
const MOBILE_AUTHORED_SEEDS: Record<string, { x: number; y: number }> = {
  // Top Sector (y: 5..33)
  nextdotjs:    { x: 50, y: 7 },
  tailwindcss:  { x: 38, y: 8 },
  threedotjs:   { x: 62, y: 8 },
  vite:         { x: 25, y: 8 },
  webgpu:       { x: 75, y: 8 },
  r3f:          { x: 50, y: 14 },
  vercel:       { x: 36, y: 14 },
  webgl:        { x: 64, y: 14 },
  typescript:   { x: 22, y: 14 },
  glsl:         { x: 78, y: 14 },
  react:        { x: 10, y: 11 },
  blender:      { x: 90, y: 11 },
  javascript:   { x: 18, y: 20 },
  spline:       { x: 82, y: 20 },
  svelte:       { x: 30, y: 20 },
  draco:        { x: 70, y: 20 },
  framer:       { x: 42, y: 20 },
  canvasapi:    { x: 58, y: 20 },
  greensock:    { x: 8,  y: 19 },
  babylondotjs: { x: 92, y: 19 },
  rive:         { x: 12, y: 27 },
  unity:        { x: 88, y: 27 },
  html5:        { x: 24, y: 28 },
  ethers:       { x: 76, y: 28 },

  // Flanking Left & Right of the Planet (y: 33..67)
  openai:       { x: 20, y: 35 },
  anthropic:    { x: 9,  y: 36 },
  ollama:       { x: 14, y: 43 },
  googlegemini: { x: 24, y: 43 },
  deepseek:     { x: 9,  y: 50 },
  qwen:         { x: 21, y: 51 },
  togetherai:   { x: 8,  y: 58 },
  huggingface:  { x: 20, y: 58 },
  cohere:       { x: 7,  y: 65 },
  groq:         { x: 19, y: 65 },

  solidity:     { x: 80, y: 35 },
  viem:         { x: 91, y: 36 },
  foundry:      { x: 76, y: 43 },
  wagmi:        { x: 88, y: 43 },
  privy:        { x: 79, y: 50 },
  erc4337:      { x: 91, y: 50 },
  thegraph:     { x: 78, y: 58 },
  siwe:         { x: 90, y: 58 },
  hardhat:      { x: 78, y: 65 },
  ipfs:         { x: 90, y: 65 },

  // Bottom Sector (y: 68..97)
  langchain:    { x: 36, y: 70 },
  mcp:          { x: 50, y: 69 },
  nodedotjs:    { x: 64, y: 70 },
  langgraph:    { x: 24, y: 72 },
  fastapi:      { x: 76, y: 72 },
  express:      { x: 88, y: 72 },
  llamaindex:   { x: 12, y: 72 },
  crewai:       { x: 32, y: 76 },
  pgvector:     { x: 44, y: 75 },
  weaviate:     { x: 56, y: 75 },
  prisma:       { x: 68, y: 76 },
  autogen:      { x: 20, y: 78 },
  drizzle:      { x: 80, y: 78 },
  trpc:         { x: 90, y: 78 },
  coze:         { x: 9,  y: 78 },
  dify:         { x: 28, y: 82 },
  postgresql:   { x: 40, y: 81 },
  qdrant:       { x: 60, y: 81 },
  graphql:      { x: 72, y: 82 },
  semantickernel:{ x: 16, y: 84 },
  flask:        { x: 84, y: 84 },
  langsmith:    { x: 26, y: 88 },
  chroma:       { x: 36, y: 87 },
  redis:        { x: 50, y: 86 },
  springboot:   { x: 64, y: 87 },
  pydantic:     { x: 74, y: 88 },
  haystack:     { x: 9,  y: 87 },
  nginx:        { x: 91, y: 87 },
  milvus:       { x: 32, y: 92 },
  mysql:        { x: 44, y: 91 },
  supabase:     { x: 56, y: 91 },
  docker:       { x: 68, y: 92 },
  pinecone:     { x: 20, y: 93 },
  rabbitmq:     { x: 80, y: 93 },
  llamaparse:   { x: 10, y: 93 },
  celery:       { x: 90, y: 93 },
  unstructured: { x: 36, y: 96 },
  linux:        { x: 46, y: 96 },
  git:          { x: 54, y: 96 },
  kubernetes:   { x: 64, y: 96 },
  prometheus:   { x: 16, y: 96 },
  kafka:        { x: 84, y: 96 },
  grafana:      { x: 6,  y: 96 },
  sentry:       { x: 94, y: 96 },
};

/**
 * Editorial Category Label Anchors (Non-circular, non-symmetrical 2D placement)
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
 * Deterministic string hash function (FNV-1a 32-bit).
 */
export function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Deterministic pseudo-random float in [0, 1) based on a numeric seed.
 */
export function seededFloat(seed: number, salt: number): number {
  const x = Math.sin(seed * 0.0001 + salt * 137.58) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Compute the complete deterministic 2D spatial constellation layout.
 */
export function computeConstellationLayout(isMobile: boolean = false): ConstellationLayout {
  const nodeNormW = isMobile ? 8.4 : 4.4;
  const nodeNormH = isMobile ? 3.6 : 6.0;
  const planetRx = isMobile ? 18.0 : 19.5;
  const planetRy = isMobile ? 15.0 : 20.5;

  const seeds = isMobile ? MOBILE_AUTHORED_SEEDS : DESKTOP_AUTHORED_SEEDS;

  // Initialize nodes from authored 2D coordinates with subtle deterministic micro-jitter
  const rawNodes = SKILLS_DATA.map((skill) => {
    const seed = hashString(skill.id);
    const base = seeds[skill.id] || { x: 50, y: 50 };

    // Weak deterministic micro-displacement (±0.4% in x, ±0.3% in y)
    const jitterX = (seededFloat(seed, 1) - 0.5) * 0.8;
    const jitterY = (seededFloat(seed, 2) - 0.5) * 0.6;

    return {
      id: skill.id,
      categoryId: skill.categoryId,
      x: base.x + jitterX,
      y: base.y + jitterY,
    };
  });

  // Local physics-based relaxation loop (repelling along 2D dx, dy vectors)
  const ITERATIONS = isMobile ? 55 : 45;
  for (let iter = 0; iter < ITERATIONS; iter++) {
    // 1. Planet exclusion boundary protection
    for (const node of rawNodes) {
      const dx = node.x - 50;
      const dy = node.y - 50;
      const distPlanet = Math.sqrt((dx / planetRx) ** 2 + (dy / planetRy) ** 2);
      if (distPlanet < 1.02) {
        const scale = 1.04 / Math.max(distPlanet, 0.001);
        node.x = 50 + dx * scale;
        node.y = 50 + dy * scale;
      }
    }

    // 2. Node-to-node collision relaxation along local offset vectors
    for (let i = 0; i < rawNodes.length; i++) {
      for (let j = i + 1; j < rawNodes.length; j++) {
        const n1 = rawNodes[i];
        const n2 = rawNodes[j];
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const normDist = Math.sqrt((dx / nodeNormW) ** 2 + (dy / nodeNormH) ** 2);
        if (normDist < 1.05 && normDist > 0.0001) {
          const overlap = 1.05 - normDist;
          const pushX = (dx / normDist) * overlap * 0.45 * nodeNormW;
          const pushY = (dy / normDist) * overlap * 0.45 * nodeNormH;
          n1.x -= pushX * 0.5;
          n1.y -= pushY * 0.5;
          n2.x += pushX * 0.5;
          n2.y += pushY * 0.5;
        }
      }
    }

    // 3. Viewport bounds protection
    for (const node of rawNodes) {
      node.x = Math.max(isMobile ? 4.5 : 3.8, Math.min(isMobile ? 95.5 : 96.2, node.x));
      node.y = Math.max(isMobile ? 4.0 : 4.5, Math.min(isMobile ? 97.0 : 95.5, node.y));
    }
  }

  // Finalize node positions map and list
  const nodePositions = new Map<string, ConstellationNodePosition>();
  const nodeList: ConstellationNodePosition[] = [];

  for (const node of rawNodes) {
    const formatted: ConstellationNodePosition = {
      id: node.id,
      x: parseFloat(node.x.toFixed(2)),
      y: parseFloat(node.y.toFixed(2)),
      categoryId: node.categoryId,
    };
    nodePositions.set(node.id, formatted);
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

    // Angle in [0, 360)
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    const bin = Math.min(Math.floor(angle / 45), 7);
    angularBins[bin]++;

    // Quadrant relative to center (50, 50)
    if (dx < 0 && dy < 0) quadrants.upperLeft++;
    else if (dx >= 0 && dy < 0) quadrants.upperRight++;
    else if (dx < 0 && dy >= 0) quadrants.lowerLeft++;
    else quadrants.lowerRight++;

    // Nearest-neighbor euclidean distance
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

// Precomputed static singletons for instant zero-cost rendering
export const DESKTOP_CONSTELLATION = computeConstellationLayout(false);
export const MOBILE_CONSTELLATION = computeConstellationLayout(true);
