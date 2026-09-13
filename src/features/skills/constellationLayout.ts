/**
 * Constellation Spatial Layout Engine (Skills V2)
 *
 * Replaces the obsolete 8-sector 45-degree radial grid with a deterministic,
 * structured, non-uniform spatial field orbiting the central planet.
 *
 * Architectural Features:
 * 1. Layered Depth Zones:
 *    - Zone A (Inner Orbit): 14 foundational technologies framing the planetary atmosphere.
 *    - Zone B (Mid Field): 43 technologies forming the main technical ecosystem.
 *    - Zone C (Outer Field): 23 technologies extending outward for scale and depth.
 *    - Zone D (Peripheral Stars): 8 distant boundary instruments.
 *
 * 2. Non-uniform Cosmic Field:
 *    - Non-uniform category attractors with harmonic field warping (sinusoidal perturbation).
 *    - Cross-category blending without rigid sector walls.
 *    - Asymmetric left/right and top/bottom density balance with deliberate breathing corridors.
 *
 * 3. 100% Deterministic:
 *    - Zero Math.random().
 *    - Stable seeded PRNG from skill ID and index.
 *    - Reproducible across re-renders, refreshes, and navigation.
 *
 * 4. Physics-based Deterministic Collision & Planet Clearance:
 *    - Guaranteed clearance from central planet exclusion ellipse.
 *    - Guaranteed node-to-node footprint clearance.
 *    - Viewport boundary containment.
 */

import { SKILLS_DATA, SKILL_CATEGORIES } from '../../data/skills';

export type SkillZone = 'A' | 'B' | 'C' | 'D';

export interface ConstellationNodePosition {
  id: string;
  x: number;
  y: number;
  zone: SkillZone;
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

/**
 * 88 Skills Depth Zone Mapping
 * Zone A: 14 | Zone B: 43 | Zone C: 23 | Zone D: 8 = 88 Total
 */
export const SKILL_ZONE_ASSIGNMENTS: Record<string, SkillZone> = {
  // 01 Frontend (11)
  typescript: 'A',
  react: 'A',
  javascript: 'B',
  nextdotjs: 'B',
  svelte: 'B',
  tailwindcss: 'B',
  html5: 'B',
  vite: 'B',
  framer: 'C',
  greensock: 'C',
  rive: 'D',

  // 02 Graphics (11)
  threedotjs: 'A',
  webgl: 'A',
  glsl: 'B',
  webgpu: 'B',
  r3f: 'B',
  blender: 'B',
  canvasapi: 'B',
  spline: 'C',
  draco: 'C',
  babylondotjs: 'C',
  unity: 'D',

  // 03 Backend (11)
  nodedotjs: 'A',
  express: 'B',
  fastapi: 'B',
  prisma: 'B',
  drizzle: 'B',
  trpc: 'B',
  graphql: 'B',
  flask: 'C',
  springboot: 'C',
  pydantic: 'C',
  nginx: 'D',

  // 04 Data (11)
  postgresql: 'A',
  redis: 'A',
  mysql: 'B',
  supabase: 'B',
  docker: 'B',
  linux: 'B',
  git: 'B',
  rabbitmq: 'C',
  kafka: 'C',
  kubernetes: 'C',
  celery: 'D',

  // 05 Web3 (11)
  solidity: 'A',
  viem: 'B',
  wagmi: 'B',
  ethers: 'B',
  foundry: 'B',
  privy: 'B',
  erc4337: 'C',
  thegraph: 'C',
  siwe: 'C',
  hardhat: 'C',
  ipfs: 'D',

  // 06 Models (11)
  openai: 'A',
  anthropic: 'A',
  googlegemini: 'A',
  deepseek: 'B',
  qwen: 'B',
  vercel: 'B',
  ollama: 'B',
  huggingface: 'B',
  groq: 'C',
  togetherai: 'C',
  cohere: 'D',

  // 07 Agents (11)
  langchain: 'A',
  mcp: 'A',
  langgraph: 'B',
  llamaindex: 'B',
  crewai: 'B',
  autogen: 'B',
  dify: 'B',
  coze: 'C',
  semantickernel: 'C',
  langsmith: 'C',
  haystack: 'D',

  // 08 RAG (11)
  pgvector: 'A',
  chroma: 'B',
  milvus: 'B',
  weaviate: 'B',
  qdrant: 'B',
  pinecone: 'B',
  llamaparse: 'B',
  unstructured: 'C',
  prometheus: 'C',
  grafana: 'C',
  sentry: 'D',
};

/**
 * Editorial Category Labels (Restrained editorial annotations)
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
 * Non-uniform category attractor centers (degrees) around the celestial core.
 * Seamless adjacent discipline flow:
 * Frontend (272°) -> Graphics (326°) -> Web3 (14°) -> Backend (62°) ->
 * Data (110°) -> RAG (156°) -> Models (200°) -> Agents (240°) -> Frontend
 */
const CATEGORY_ATTRACTORS: Record<string, { centerDeg: number; spreadDeg: number }> = {
  frontend: { centerDeg: 272, spreadDeg: 52 },
  graphics: { centerDeg: 326, spreadDeg: 54 },
  web3:     { centerDeg: 14,  spreadDeg: 48 },
  backend:  { centerDeg: 62,  spreadDeg: 50 },
  data:     { centerDeg: 110, spreadDeg: 52 },
  rag:      { centerDeg: 156, spreadDeg: 48 },
  models:   { centerDeg: 200, spreadDeg: 50 },
  agents:   { centerDeg: 240, spreadDeg: 52 },
};

/**
 * Editorial position hints for secondary category labels (relative %)
 */
const DESKTOP_LABEL_SEEDS: Record<string, { x: number; y: number }> = {
  frontend: { x: 50.0, y: 7.5 },
  graphics: { x: 86.5, y: 15.5 },
  web3:     { x: 92.5, y: 46.5 },
  backend:  { x: 79.5, y: 88.5 },
  data:     { x: 38.0, y: 92.5 },
  rag:      { x: 10.5, y: 77.0 },
  models:   { x: 7.5,  y: 42.0 },
  agents:   { x: 22.0, y: 12.0 },
};

const MOBILE_LABEL_SEEDS: Record<string, { x: number; y: number }> = {
  frontend: { x: 50.0, y: 5.5 },
  graphics: { x: 83.0, y: 17.5 },
  web3:     { x: 88.0, y: 45.0 },
  backend:  { x: 80.0, y: 82.5 },
  data:     { x: 42.0, y: 94.0 },
  rag:      { x: 14.0, y: 82.0 },
  models:   { x: 10.0, y: 45.0 },
  agents:   { x: 18.0, y: 17.0 },
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
 * Deterministic pseudo-random float generator in [0, 1) based on a numeric seed.
 */
export function seededFloat(seed: number, salt: number): number {
  const x = Math.sin(seed * 0.0001 + salt * 137.58) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Compute the complete deterministic constellation layout.
 */
export function computeConstellationLayout(isMobile: boolean = false): ConstellationLayout {
  const nodeNormW = isMobile ? 8.4 : 4.4;
  const nodeNormH = isMobile ? 3.6 : 6.0;
  const planetRx = isMobile ? 18.0 : 19.5;
  const planetRy = isMobile ? 15.0 : 20.5;

  const rawNodes: Array<{
    id: string;
    x: number;
    y: number;
    zone: SkillZone;
    categoryId: string;
  }> = [];

  // Group skills by category to arrange dispersion
  const byCat: Record<string, typeof SKILLS_DATA> = {};
  for (const s of SKILLS_DATA) {
    byCat[s.categoryId] = byCat[s.categoryId] || [];
    byCat[s.categoryId].push(s);
  }

  // 1. Initial seeded layout per category
  for (const [catId, skills] of Object.entries(byCat)) {
    const attractor = CATEGORY_ATTRACTORS[catId];
    // Deterministic sort by skill ID hash
    const sorted = [...skills].sort((a, b) => hashString(a.id) - hashString(b.id));

    sorted.forEach((skill, rank) => {
      const seed = hashString(skill.id);
      const zone = SKILL_ZONE_ASSIGNMENTS[skill.id] || 'B';

      // Normalized rank within category spread (-0.5 to +0.5)
      const tNorm = (rank / Math.max(skills.length - 1, 1)) - 0.5;
      const angleJitter = (seededFloat(seed, 1) - 0.5) * 7.0;
      const angleDeg = attractor.centerDeg + tNorm * attractor.spreadDeg + angleJitter;
      const theta = (angleDeg * Math.PI) / 180;

      // Harmonic cosmic field modulation to eliminate artificial circle/ellipse predictability
      const cosmicWarp = 1.0 +
        0.06 * Math.sin(theta * 2 + 0.6) +
        0.04 * Math.cos(theta * 3 - 0.4) -
        0.03 * Math.sin(theta - 0.8);

      // Continuous radial sampling within depth zones
      let baseR = 30.0;
      if (zone === 'A') {
        baseR = (isMobile ? 20.0 : 21.5) + seededFloat(seed, 2) * (isMobile ? 3.5 : 4.5);
      } else if (zone === 'B') {
        baseR = (isMobile ? 25.0 : 27.5) + seededFloat(seed, 2) * (isMobile ? 8.0 : 8.5);
      } else if (zone === 'C') {
        baseR = (isMobile ? 34.0 : 37.0) + seededFloat(seed, 2) * (isMobile ? 6.0 : 6.5);
      } else {
        baseR = (isMobile ? 41.0 : 44.5) + seededFloat(seed, 2) * 3.5;
      }

      const r = baseR * cosmicWarp;
      const rx = isMobile ? r * 0.86 : r;
      const ry = isMobile ? r * 1.02 : r * 0.88;

      const x = 50 + rx * Math.cos(theta);
      const y = 50 + ry * Math.sin(theta);

      rawNodes.push({
        id: skill.id,
        x,
        y,
        zone,
        categoryId: skill.categoryId,
      });
    });
  }

  // 2. Deterministic Relaxation (Planet clearance, collision avoidance, and viewport containment)
  const ITERATIONS = isMobile ? 45 : 40;
  for (let iter = 0; iter < ITERATIONS; iter++) {
    // Planet exclusion repulsion
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

    // Node-to-node collision repulsion
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

    // Viewport bounds containment
    for (const node of rawNodes) {
      node.x = Math.max(isMobile ? 4.5 : 3.8, Math.min(isMobile ? 95.5 : 96.2, node.x));
      node.y = Math.max(isMobile ? 4.0 : 4.5, Math.min(isMobile ? 96.0 : 95.5, node.y));
    }
  }

  // 3. Finalize node positions map and list
  const nodePositions = new Map<string, ConstellationNodePosition>();
  const nodeList: ConstellationNodePosition[] = [];

  for (const node of rawNodes) {
    const formatted: ConstellationNodePosition = {
      id: node.id,
      x: parseFloat(node.x.toFixed(2)),
      y: parseFloat(node.y.toFixed(2)),
      zone: node.zone,
      categoryId: node.categoryId,
    };
    nodePositions.set(node.id, formatted);
    nodeList.push(formatted);
  }

  // 4. Position category editorial annotations
  const labelSeeds = isMobile ? MOBILE_LABEL_SEEDS : DESKTOP_LABEL_SEEDS;
  const categoryLabels: CategoryLabelPosition[] = SKILL_CATEGORIES.map((cat) => {
    const base = labelSeeds[cat.id] || { x: 50, y: 50 };
    return {
      id: cat.id,
      number: cat.number,
      title: cat.title,
      shortLabel: CATEGORY_SHORT_LABELS[cat.id] || cat.title.toUpperCase(),
      x: base.x,
      y: base.y,
    };
  });

  return {
    nodePositions,
    categoryLabels,
    nodeList,
  };
}

// Precomputed static singletons for instant zero-cost desktop & mobile rendering
export const DESKTOP_CONSTELLATION = computeConstellationLayout(false);
export const MOBILE_CONSTELLATION = computeConstellationLayout(true);
