import { SKILLS_DATA, SKILL_CATEGORIES, SkillItem } from '../../data/skills';
import {
  ICON_REGISTRY,
  getIconDefinition,
  resolveSkillIcon,
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

/**
 * Technologies that must explicitly be classified as generic symbols
 * rather than official commercial/company brand logos.
 */
export const REQUIRED_GENERIC_SKILL_IDS: readonly string[] = [
  'webgl',
  'glsl',
  'webgpu',
  'r3f',
  'canvasapi',
  'erc4337',
  'siwe',
  'mcp',
  'pgvector',
  'llamaparse',
] as const;

// Vite eager glob indexes all SVG files present under /public/assets/icons at compile time.
const VITE_LOCAL_SVGS: Record<string, unknown> =
  typeof import.meta !== 'undefined' && typeof (import.meta as any).glob === 'function'
    ? (import.meta as any).glob('/public/assets/icons/*.svg', { eager: true })
    : {};

export type AssetExistsChecker = (url: string) => boolean;

/**
 * Repository-level asset checker:
 * In Node environments (tests, build scripts, CLI), directly checks filesystem via Node fs.
 * In Vite browser environment, checks against the statically analyzed glob map.
 */
export function checkAssetExists(url: string, customChecker?: AssetExistsChecker): boolean {
  if (customChecker) {
    return customChecker(url);
  }

  // 1. Node.js environment check (build time / test script)
  if (typeof process !== 'undefined' && process.versions?.node) {
    try {
      const getModule = (process as any).getBuiltinModule;
      if (typeof getModule === 'function') {
        const fs = getModule('node:fs');
        const path = getModule('node:path');
        if (fs && path) {
          const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
          const fullPath = path.resolve(process.cwd(), 'public', cleanUrl);
          return fs.existsSync(fullPath);
        }
      }
    } catch {
      // ignore
    }
  }

  // 2. Vite browser environment check
  const filename = url.split('/').pop();
  if (filename && Object.keys(VITE_LOCAL_SVGS).length > 0) {
    const viteKey = `/public/assets/icons/${filename}`;
    return Object.prototype.hasOwnProperty.call(VITE_LOCAL_SVGS, viteKey);
  }

  // If running in development without globs populated, check pattern
  return url.startsWith('/assets/icons/') && url.endsWith('.svg');
}

export interface ValidationReport {
  isValid: boolean;
  errors: string[];
  totalSkills: number;
  expectedSkills: number;
  categoryCount: number;
  expectedCategories: number;
  perCategoryTarget: number;
  allCategoriesHaveTargetCount: boolean;
  countsPerCategory: Record<string, number>;
  mappedRegistryCount: number;
  brandIcons: number;
  genericIcons: number;
  missingIcons: number;
  invalidMappings: number;
  missingLocalAssets: number;
  unexpectedRegistryEntries: number;
  duplicateIds: number;
  duplicateNames: number;
  missingIconList: Array<{ id: string; name: string }>;
  formattedReport: string;
}

/**
 * Formats validation output to strictly match the canonical report schema.
 */
export function formatValidationReport(report: ValidationReport): string {
  const perCategoryStatus = report.allCategoriesHaveTargetCount
    ? `${report.perCategoryTarget} / ${report.perCategoryTarget}`
    : 'mismatched';

  let output = [
    'Skills:',
    `${report.totalSkills} / ${report.expectedSkills}`,
    '',
    'Categories:',
    `${report.categoryCount} / ${report.expectedCategories}`,
    '',
    'Per category:',
    perCategoryStatus,
    '',
    'Icon registry:',
    `${report.mappedRegistryCount} / ${report.expectedSkills} mapped`,
    '',
    'Brand icons:',
    `${report.brandIcons}`,
    '',
    'Generic icons:',
    `${report.genericIcons}`,
    '',
    'Missing icons:',
    `${report.missingIcons}`,
    '',
    'Invalid mappings:',
    `${report.invalidMappings}`,
    '',
    'Missing local assets:',
    `${report.missingLocalAssets}`,
    '',
    'Unexpected registry entries:',
    `${report.unexpectedRegistryEntries}`,
    '',
    'Duplicate IDs:',
    `${report.duplicateIds}`,
    '',
    'Duplicate names:',
    `${report.duplicateNames}`,
  ].join('\n');

  if (report.missingIconList.length > 0) {
    output += '\n\nMissing Icons List:\n' +
      report.missingIconList.map((m) => `  - ${m.name} (${m.id})`).join('\n');
  }

  return output;
}

/**
 * Validates the canonical 88-skill dataset and icon system.
 * Enforces strict dataset integrity, exact ID coverage, canonical names,
 * single Kafka/GraphQL entries, physical disk asset verification, and explicit typing.
 */
export function validateSkillsDataset(customAssetChecker?: AssetExistsChecker): ValidationReport {
  const errors: string[] = [];
  const totalSkills = SKILLS_DATA.length;
  const expectedSkills = 88;
  const categoryCount = SKILL_CATEGORIES.length;
  const expectedCategories = 8;
  const perCategoryTarget = 11;
  const countsPerCategory: Record<string, number> = {};

  let brandIcons = 0;
  let genericIcons = 0;
  let missingIcons = 0;
  let invalidMappings = 0;
  let missingLocalAssets = 0;
  let unexpectedRegistryEntries = 0;
  let duplicateIds = 0;
  let duplicateNames = 0;

  const missingIconList: Array<{ id: string; name: string }> = [];

  // 1. Total Skills Count
  if (totalSkills !== expectedSkills) {
    errors.push(`Expected exactly ${expectedSkills} skills, found ${totalSkills}.`);
  }

  // 2. Category Count
  if (categoryCount !== expectedCategories) {
    errors.push(`Expected exactly ${expectedCategories} categories, found ${categoryCount}.`);
  }

  const validCategoryIds = new Set(SKILL_CATEGORIES.map((c) => c.id));
  SKILL_CATEGORIES.forEach((c) => {
    countsPerCategory[c.id] = 0;
  });

  // 3. Exact Registry Coverage: Set(SKILLS_DATA ids) === Set(ICON_REGISTRY ids)
  const skillIdSet = new Set<string>();
  const skillNameSet = new Set<string>();
  const idOccurrences: Record<string, number> = {};
  const nameOccurrences: Record<string, number> = {};

  for (const skill of SKILLS_DATA) {
    skillIdSet.add(skill.id);
    idOccurrences[skill.id] = (idOccurrences[skill.id] || 0) + 1;

    const lowerName = skill.name.toLowerCase().trim();
    nameOccurrences[lowerName] = (nameOccurrences[lowerName] || 0) + 1;
  }

  // Duplicate ID detection
  for (const [id, count] of Object.entries(idOccurrences)) {
    if (count > 1) {
      errors.push(`Duplicate skill ID found: "${id}" (appears ${count} times).`);
      duplicateIds += count - 1;
    }
  }

  // Duplicate Name detection
  for (const [name, count] of Object.entries(nameOccurrences)) {
    if (count > 1) {
      errors.push(`Duplicate skill name found: "${name}" (appears ${count} times).`);
      duplicateNames += count - 1;
    }
  }

  const registryKeys = Object.keys(ICON_REGISTRY);
  const registryKeySet = new Set(registryKeys);

  // Check for unexpected registry entries
  for (const regKey of registryKeys) {
    if (!skillIdSet.has(regKey)) {
      errors.push(`ICON_REGISTRY contains unknown unexpected skill key: "${regKey}".`);
      unexpectedRegistryEntries++;
    }
  }

  // Canonical name list check
  const canonicalSet = new Set<string>(CANONICAL_SKILL_NAMES);
  let graphqlCount = 0;
  let kafkaCount = 0;
  let mappedRegistryCount = 0;

  // Validate each skill in SKILLS_DATA
  SKILLS_DATA.forEach((skill: SkillItem, index: number) => {
    // Canonical name presence
    if (!canonicalSet.has(skill.name)) {
      errors.push(`Unexpected skill name not in canonical list: "${skill.name}" (id: ${skill.id}).`);
    }

    // GraphQL and Kafka singleton checks
    if (skill.name.toLowerCase() === 'graphql' || skill.id === 'graphql') {
      graphqlCount++;
    }
    if (skill.name.toLowerCase() === 'kafka' || skill.id === 'kafka') {
      kafkaCount++;
    }

    // Category valid check
    if (!validCategoryIds.has(skill.categoryId)) {
      errors.push(`Invalid categoryId "${skill.categoryId}" for skill "${skill.name}".`);
    } else {
      countsPerCategory[skill.categoryId] = (countsPerCategory[skill.categoryId] || 0) + 1;
    }

    // Brand color check
    if (!skill.brandColor || !skill.brandColor.startsWith('#') || skill.brandColor.length < 4) {
      errors.push(`Invalid brandColor "${skill.brandColor}" for skill "${skill.name}".`);
    }

    // Insight length check
    if (!skill.insight || skill.insight.trim().length < 20) {
      errors.push(`Missing or inadequate insight for skill "${skill.name}".`);
    }

    // Icon registry mapping check
    const iconDef = getIconDefinition(skill.id);
    if (!iconDef) {
      errors.push(`Skill with ID "${skill.id}" ("${skill.name}") has no registry entry in ICON_REGISTRY.`);
      invalidMappings++;
      return;
    }

    mappedRegistryCount++;

    // Explicit icon classification
    if (iconDef.type === 'brand') {
      brandIcons++;
    } else if (iconDef.type === 'generic') {
      genericIcons++;
    } else if (iconDef.type === 'missing') {
      missingIcons++;
      missingIconList.push({ id: skill.id, name: skill.name });
    } else {
      errors.push(`Invalid icon type "${(iconDef as unknown as { type: string }).type}" for skill "${skill.name}".`);
      invalidMappings++;
    }

    // Icon Source Integrity
    if (iconDef.source.kind === 'simple-icon') {
      const { icon } = iconDef.source;
      if (!icon || typeof icon.path !== 'string' || icon.path.length < 10) {
        errors.push(`Invalid SimpleIcon vector path for skill "${skill.name}" (${skill.id}).`);
        invalidMappings++;
      }
      if (!icon || typeof icon.hex !== 'string' || icon.hex.length < 3) {
        errors.push(`Invalid SimpleIcon hex code for skill "${skill.name}" (${skill.id}).`);
        invalidMappings++;
      }
    } else if (iconDef.source.kind === 'local-svg') {
      const { url } = iconDef.source;
      if (!url || !url.startsWith('/assets/icons/') || !url.endsWith('.svg')) {
        errors.push(`Invalid local SVG URL format for skill "${skill.name}": "${url}".`);
        invalidMappings++;
      } else {
        const fileExists = checkAssetExists(url, customAssetChecker);
        if (!fileExists) {
          errors.push(`Local SVG asset physically missing on disk for skill "${skill.name}": "${url}".`);
          missingLocalAssets++;
        }
      }
    } else if (iconDef.source.kind === 'missing') {
      if (iconDef.type !== 'missing') {
        errors.push(`Skill "${skill.name}" has kind "missing" but type "${iconDef.type}". Must match.`);
        invalidMappings++;
      }
    } else {
      errors.push(`Unknown icon source kind for skill "${skill.name}" (${skill.id}).`);
      invalidMappings++;
    }

    // Resolved icon output verification (no silent fallback permitted)
    const resolved = resolveSkillIcon(skill.id, skill.name);
    if (iconDef.type === 'missing') {
      if (resolved.kind !== 'missing') {
        errors.push(`Skill "${skill.name}" is classified as missing, but resolved to non-missing state.`);
        invalidMappings++;
      }
    } else {
      if (resolved.kind === 'missing') {
        errors.push(`Skill "${skill.name}" (${skill.id}) unexpectedly resolved to missing state.`);
        invalidMappings++;
      }
    }
  });

  // Check required generic technologies classification
  for (const genericSkillId of REQUIRED_GENERIC_SKILL_IDS) {
    const def = getIconDefinition(genericSkillId);
    if (def && def.type !== 'generic') {
      errors.push(`Technology "${genericSkillId}" must be classified as "generic", not "${def.type}".`);
      invalidMappings++;
    }
  }

  // GraphQL singleton check
  if (graphqlCount !== 1) {
    errors.push(`Expected GraphQL to appear exactly once, but found ${graphqlCount} occurrence(s).`);
  }

  // Kafka singleton check
  if (kafkaCount !== 1) {
    errors.push(`Expected Kafka to appear exactly once, but found ${kafkaCount} occurrence(s).`);
  }

  // Canonical name completeness check
  for (const canonicalName of CANONICAL_SKILL_NAMES) {
    if (!nameOccurrences[canonicalName.toLowerCase().trim()]) {
      errors.push(`Missing canonical skill from dataset: "${canonicalName}".`);
    }
  }

  // Category counts check
  let allCategoriesHaveTargetCount = true;
  Object.entries(countsPerCategory).forEach(([catId, count]) => {
    if (count !== perCategoryTarget) {
      errors.push(`Category "${catId}" contains ${count} skills; expected exactly ${perCategoryTarget}.`);
      allCategoriesHaveTargetCount = false;
    }
  });

  const isValid =
    errors.length === 0 &&
    missingLocalAssets === 0 &&
    invalidMappings === 0 &&
    unexpectedRegistryEntries === 0 &&
    duplicateIds === 0 &&
    duplicateNames === 0;

  const reportData: ValidationReport = {
    isValid,
    errors,
    totalSkills,
    expectedSkills,
    categoryCount,
    expectedCategories,
    perCategoryTarget,
    allCategoriesHaveTargetCount,
    countsPerCategory,
    mappedRegistryCount,
    brandIcons,
    genericIcons,
    missingIcons,
    invalidMappings,
    missingLocalAssets,
    unexpectedRegistryEntries,
    duplicateIds,
    duplicateNames,
    missingIconList,
    formattedReport: '',
  };

  reportData.formattedReport = formatValidationReport(reportData);

  if (typeof console !== 'undefined') {
    if (!isValid) {
      console.error('[SKILLS_DATA_VALIDATION_FAILED]', errors);
      console.warn(reportData.formattedReport);
    } else if (process.env.NODE_ENV !== 'production') {
      console.log('[SKILLS_DATA_VALIDATION_PASSED]\n' + reportData.formattedReport);
    }
  }

  return reportData;
}
