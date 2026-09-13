import { SKILLS_DATA, SKILL_CATEGORIES, SkillItem } from '../../data/skills';
import {
  getIconDefinition,
  resolveSkillIcon,
  VERIFIED_LOCAL_ASSETS,
} from '../../components/skills/iconResolver';

export const CANONICAL_SKILL_NAMES: readonly string[] = [
  // ROW 1 — CORE FRONTEND & INTERACTION
  'TypeScript',
  'JavaScript',
  'React',
  'Next.js',
  'Svelte',
  'Tailwind CSS',
  'Framer Motion',
  'GSAP',
  'HTML5',
  'Vite',
  'Rive',

  // ROW 2 — 3D & GRAPHICS
  'Three.js',
  'WebGL',
  'GLSL',
  'WebGPU',
  'React Three Fiber',
  'Blender',
  'Spline',
  'Draco',
  'Canvas API',
  'Babylon.js',
  'Unity',

  // ROW 3 — BACKEND & API FRAMEWORKS
  'Node.js',
  'Express',
  'FastAPI',
  'Flask',
  'Spring Boot',
  'Prisma',
  'Drizzle',
  'tRPC',
  'GraphQL',
  'Pydantic',
  'Nginx',

  // ROW 4 — DATA, STORAGE & QUEUES
  'PostgreSQL',
  'MySQL',
  'Supabase',
  'Redis',
  'RabbitMQ',
  'Celery',
  'Kafka',
  'Docker',
  'Kubernetes',
  'Linux',
  'Git',

  // ROW 5 — WEB3 & DECENTRALIZED
  'Solidity',
  'viem',
  'wagmi',
  'Ethers.js',
  'Foundry',
  'Privy',
  'ERC-4337',
  'The Graph',
  'IPFS',
  'SIWE',
  'Hardhat',

  // ROW 6 — AI MODELS & SDKS
  'OpenAI',
  'Anthropic',
  'Google Gemini',
  'DeepSeek',
  'Qwen',
  'Vercel AI SDK',
  'Ollama',
  'Hugging Face',
  'Groq',
  'Together AI',
  'Cohere',

  // ROW 7 — AI AGENT & ORCHESTRATION
  'LangChain',
  'LangGraph',
  'LlamaIndex',
  'CrewAI',
  'AutoGen',
  'Dify',
  'Coze',
  'Semantic Kernel',
  'MCP',
  'Haystack',
  'LangSmith',

  // ROW 8 — RAG, VECTOR & OBSERVABILITY
  'pgvector',
  'Chroma',
  'Milvus',
  'Weaviate',
  'Qdrant',
  'Pinecone',
  'LlamaParse',
  'Unstructured',
  'Prometheus',
  'Grafana',
  'Sentry',
] as const;

export interface ValidationReport {
  isValid: boolean;
  errors: string[];
  totalSkills: number;
  categoryCount: number;
  countsPerCategory: Record<string, number>;
  brandIconsCount: number;
  genericSymbolsCount: number;
  missingIconsCount: number;
}

/**
 * Validates the canonical 88-skill dataset and icon system.
 * Enforces strict dataset integrity, canonical names, single Kafka/GraphQL entries,
 * explicit brand/generic icon typing, and verifiable asset sources.
 */
export function validateSkillsDataset(): ValidationReport {
  const errors: string[] = [];
  const totalSkills = SKILLS_DATA.length;
  const categoryCount = SKILL_CATEGORIES.length;
  const countsPerCategory: Record<string, number> = {};

  let brandIconsCount = 0;
  let genericSymbolsCount = 0;
  let missingIconsCount = 0;

  // 1. Total Skills Count
  if (totalSkills !== 88) {
    errors.push(`Expected exactly 88 skills, found ${totalSkills}.`);
  }

  // 2. Category Count
  if (categoryCount !== 8) {
    errors.push(`Expected exactly 8 categories, found ${categoryCount}.`);
  }

  const validCategoryIds = new Set(SKILL_CATEGORIES.map((c) => c.id));
  SKILL_CATEGORIES.forEach((c) => {
    countsPerCategory[c.id] = 0;
  });

  const seenIds = new Set<string>();
  const seenNames = new Set<string>();
  const canonicalSet = new Set<string>(CANONICAL_SKILL_NAMES);

  let graphqlCount = 0;
  let kafkaCount = 0;

  SKILLS_DATA.forEach((skill: SkillItem, index: number) => {
    // 3. Unique ID
    if (seenIds.has(skill.id)) {
      errors.push(`Duplicate skill ID found: "${skill.id}" at index ${index}.`);
    }
    seenIds.add(skill.id);

    // 4. Unique Name
    const lowerName = skill.name.toLowerCase().trim();
    if (seenNames.has(lowerName)) {
      errors.push(`Duplicate skill name found: "${skill.name}" at index ${index}.`);
    }
    seenNames.add(lowerName);

    // 5. Canonical Name Check
    if (!canonicalSet.has(skill.name)) {
      errors.push(`Unexpected skill name not in canonical list: "${skill.name}" (id: ${skill.id}).`);
    }

    // 6. GraphQL and Kafka occurrences check
    if (skill.name.toLowerCase() === 'graphql' || skill.id === 'graphql') {
      graphqlCount++;
    }
    if (skill.name.toLowerCase() === 'kafka' || skill.id === 'kafka') {
      kafkaCount++;
    }

    // 7. Valid Category
    if (!validCategoryIds.has(skill.categoryId)) {
      errors.push(`Invalid categoryId "${skill.categoryId}" for skill "${skill.name}".`);
    } else {
      countsPerCategory[skill.categoryId] = (countsPerCategory[skill.categoryId] || 0) + 1;
    }

    // 8. Valid Brand Color
    if (!skill.brandColor || !skill.brandColor.startsWith('#') || skill.brandColor.length < 4) {
      errors.push(`Invalid brandColor "${skill.brandColor}" for skill "${skill.name}".`);
    }

    // 9. Non-empty Insight
    if (!skill.insight || skill.insight.trim().length < 20) {
      errors.push(`Missing or inadequate insight for skill "${skill.name}".`);
    }

    // 10. Centralized Icon Registry Lookup
    const iconDef = getIconDefinition(skill.id);
    if (!iconDef) {
      errors.push(`Missing icon definition in ICON_REGISTRY for skill "${skill.name}" (${skill.id}).`);
      missingIconsCount++;
      return;
    }

    // 11. Explicit Icon Type Classification
    if (iconDef.type === 'brand') {
      brandIconsCount++;
    } else if (iconDef.type === 'generic') {
      genericSymbolsCount++;
    } else {
      errors.push(`Invalid icon type "${(iconDef as unknown as { type: string }).type}" for skill "${skill.name}".`);
      missingIconsCount++;
    }

    // 12. Icon Source Integrity
    if (iconDef.source.kind === 'simple-icon') {
      const { icon } = iconDef.source;
      if (!icon || typeof icon.path !== 'string' || icon.path.length < 10) {
        errors.push(`Invalid SimpleIcon vector path for skill "${skill.name}" (${skill.id}).`);
      }
      if (!icon || typeof icon.hex !== 'string' || icon.hex.length < 3) {
        errors.push(`Invalid SimpleIcon hex code for skill "${skill.name}" (${skill.id}).`);
      }
    } else if (iconDef.source.kind === 'local-svg') {
      const { url } = iconDef.source;
      if (!VERIFIED_LOCAL_ASSETS.includes(url)) {
        errors.push(`Local SVG URL "${url}" for skill "${skill.name}" is not registered in VERIFIED_LOCAL_ASSETS.`);
      }
    } else {
      errors.push(`Unknown icon source kind for skill "${skill.name}" (${skill.id}).`);
    }

    // 13. Resolved Icon Output Check
    const resolved = resolveSkillIcon(skill.id, skill.name);
    if (!resolved || resolved.kind === 'missing') {
      errors.push(`Skill "${skill.name}" (${skill.id}) resolved to a missing icon state.`);
    }
  });

  // 14. Specific verification: GraphQL appears exactly once
  if (graphqlCount !== 1) {
    errors.push(`Expected GraphQL to appear exactly once, but found ${graphqlCount} occurrence(s).`);
  }

  // 15. Specific verification: Kafka appears exactly once
  if (kafkaCount !== 1) {
    errors.push(`Expected Kafka to appear exactly once, but found ${kafkaCount} occurrence(s).`);
  }

  // 16. Verify all 88 canonical names are present in dataset
  for (const canonicalName of CANONICAL_SKILL_NAMES) {
    if (!seenNames.has(canonicalName.toLowerCase().trim())) {
      errors.push(`Missing canonical skill from dataset: "${canonicalName}".`);
    }
  }

  // 17. Exactly 11 skills per category
  Object.entries(countsPerCategory).forEach(([catId, count]) => {
    if (count !== 11) {
      errors.push(`Category "${catId}" contains ${count} skills; expected exactly 11.`);
    }
  });

  const isValid = errors.length === 0;

  if (!isValid && typeof console !== 'undefined' && console.error) {
    console.error('[SKILLS_DATA_VALIDATION_FAILED]', errors);
  }

  return {
    isValid,
    errors,
    totalSkills,
    categoryCount,
    countsPerCategory,
    brandIconsCount,
    genericSymbolsCount,
    missingIconsCount,
  };
}
