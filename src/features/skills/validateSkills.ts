import { SKILLS_DATA, SKILL_CATEGORIES, SkillItem } from '../../data/skills';
import {
  ICON_REGISTRY,
  getIconDefinition,
  resolveSkillIcon,
  IconSourceType,
  IconClassification,
  VerificationStatus,
  SkillRegistryEntry,
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
 * Technologies that are standards, protocols, or generic ecosystem representations
 * and must NEVER be misclassified as official corporate brand logos.
 */
export const NON_BRAND_SKILL_IDS: readonly string[] = [
  'canvasapi',
  'glsl',
  'r3f',
  'erc4337',
  'siwe',
  'pgvector',
  'webgl',
  'webgpu',
  'mcp',
  'html5',
  'graphql',
  'ipfs',
] as const;

// Vite eager glob indexes all SVG files present under /public/assets/icons at compile time.
const VITE_LOCAL_SVGS: Record<string, unknown> =
  typeof import.meta !== 'undefined' && typeof (import.meta as any).glob === 'function'
    ? (import.meta as any).glob('/public/assets/icons/**/*.svg', { eager: true })
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
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  const viteKey = `/public${cleanUrl}`;
  if (Object.keys(VITE_LOCAL_SVGS).length > 0) {
    return Object.prototype.hasOwnProperty.call(VITE_LOCAL_SVGS, viteKey);
  }

  // If running in development without globs populated, check pattern
  return url.startsWith('/assets/icons/') && url.endsWith('.svg');
}

export interface SkillValidationEntry {
  id: string;
  name: string;
  resolvedSource: IconSourceType;
  resolvedIconKey: string;
  fallbackLevel: 1 | 2 | 3 | 4 | 5;
  classification: IconClassification;
  verificationStatus: VerificationStatus;
  missingStatus: 'present' | 'missing';
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
  sourceCounts: Record<IconSourceType, number>;
  classificationCounts: Record<IconClassification, number>;
  brandIcons: number;
  genericIcons: number;
  missingIcons: number;
  invalidMappings: number;
  missingLocalAssets: number;
  unexpectedRegistryEntries: number;
  duplicateIds: number;
  duplicateNames: number;
  missingIconList: Array<{ id: string; name: string }>;
  skillsReport: SkillValidationEntry[];
  formattedReport: string;
}

/**
 * Formats validation output to strictly match the canonical report schema,
 * displaying both the high-level dataset metrics and the full 88-skill resolution registry.
 */
export function formatValidationReport(report: ValidationReport): string {
  const perCategoryStatus = report.allCategoriesHaveTargetCount
    ? `${report.perCategoryTarget} / ${report.perCategoryTarget}`
    : 'mismatched';

  const lines: string[] = [
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
    'Sources Breakdown:',
    `  - Source 1 (Tech Stack Icons): ${report.sourceCounts['tech-stack-icons']}`,
    `  - Source 2 (SVGL):             ${report.sourceCounts['svgl']}`,
    `  - Source 3 (Simple Icons):     ${report.sourceCounts['simple-icons']}`,
    `  - Source 4 (Verified Local):   ${report.sourceCounts['verified-local']}`,
    `  - Source 5 (Missing):          ${report.sourceCounts['missing']}`,
    '',
    'Classification Breakdown:',
    `  - Official Brand:         ${report.classificationCounts['official-brand']}`,
    `  - Technology / Framework: ${report.classificationCounts['technology-framework']}`,
    `  - Protocol / Standard:    ${report.classificationCounts['protocol-standard']}`,
    `  - Generic Ecosystem:      ${report.classificationCounts['generic-ecosystem']}`,
    `  - Missing:                ${report.classificationCounts['missing']}`,
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
    '',
    '------------------------------------------------------------------------------------------------------',
    '88 SKILLS RESOLUTION REPORT (Deterministic Multi-Source Registry)',
    '------------------------------------------------------------------------------------------------------',
    '#   | Skill Name             | Source           | Icon Key             | Level   | Status  | Classification',
    '----+------------------------+------------------+----------------------+---------+---------+----------------------',
  ];

  report.skillsReport.forEach((entry, idx) => {
    const num = String(idx + 1).padStart(2, ' ');
    const name = entry.name.padEnd(22, ' ');
    const source = entry.resolvedSource.padEnd(16, ' ');
    const key = entry.resolvedIconKey.padEnd(20, ' ');
    const level = `Level ${entry.fallbackLevel}`.padEnd(7, ' ');
    const status = entry.missingStatus.padEnd(7, ' ');
    const classification = `${entry.classification} (${entry.verificationStatus})`;
    lines.push(`${num} | ${name} | ${source} | ${key} | ${level} | ${status} | ${classification}`);
  });

  lines.push('------------------------------------------------------------------------------------------------------');

  if (report.missingIconList.length > 0) {
    lines.push(
      '\nMissing Icons List:\n' +
        report.missingIconList.map((m) => `  - ${m.name} (${m.id})`).join('\n')
    );
  }

  return lines.join('\n');
}

/**
 * Validates the canonical 88-skill dataset and multi-source icon system.
 * Enforces strict dataset integrity, exact ID coverage, canonical names,
 * deterministic source priority, physical disk asset verification, and explicit typing.
 */
export function validateSkillsDataset(customAssetChecker?: AssetExistsChecker): ValidationReport {
  const errors: string[] = [];
  const totalSkills = SKILLS_DATA.length;
  const expectedSkills = 88;
  const categoryCount = SKILL_CATEGORIES.length;
  const expectedCategories = 8;
  const perCategoryTarget = 11;
  const countsPerCategory: Record<string, number> = {};

  const sourceCounts: Record<IconSourceType, number> = {
    'tech-stack-icons': 0,
    svgl: 0,
    'simple-icons': 0,
    'verified-local': 0,
    missing: 0,
  };

  const classificationCounts: Record<IconClassification, number> = {
    'official-brand': 0,
    'technology-framework': 0,
    'protocol-standard': 0,
    'generic-ecosystem': 0,
    missing: 0,
  };

  let brandIcons = 0;
  let genericIcons = 0;
  let missingIcons = 0;
  let invalidMappings = 0;
  let missingLocalAssets = 0;
  let unexpectedRegistryEntries = 0;
  let duplicateIds = 0;
  let duplicateNames = 0;

  const missingIconList: Array<{ id: string; name: string }> = [];
  const skillsReport: SkillValidationEntry[] = [];

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
  SKILLS_DATA.forEach((skill: SkillItem) => {
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
    const regEntry: SkillRegistryEntry | undefined = getIconDefinition(skill.id);
    if (!regEntry) {
      errors.push(`Skill with ID "${skill.id}" ("${skill.name}") has no registry entry in ICON_REGISTRY.`);
      invalidMappings++;
      return;
    }

    mappedRegistryCount++;
    const { icon } = regEntry;

    // Track source counts
    if (sourceCounts[icon.source] !== undefined) {
      sourceCounts[icon.source]++;
    } else {
      errors.push(`Unknown icon source "${icon.source}" for skill "${skill.name}".`);
      invalidMappings++;
    }

    // Track classification counts
    if (classificationCounts[icon.classification] !== undefined) {
      classificationCounts[icon.classification]++;
    } else {
      errors.push(`Unknown icon classification "${icon.classification}" for skill "${skill.name}".`);
      invalidMappings++;
    }

    // Explicit icon classification counts for legacy report compatibility
    if (icon.classification === 'official-brand') {
      brandIcons++;
    } else if (
      icon.classification === 'technology-framework' ||
      icon.classification === 'protocol-standard' ||
      icon.classification === 'generic-ecosystem'
    ) {
      genericIcons++;
    } else if (icon.classification === 'missing') {
      missingIcons++;
      missingIconList.push({ id: skill.id, name: skill.name });
    }

    // Verify source priority and asset integrity
    if (icon.source === 'tech-stack-icons') {
      if (icon.fallbackLevel !== 1) {
        errors.push(`Skill "${skill.name}" source is tech-stack-icons but fallbackLevel is ${icon.fallbackLevel} (expected 1).`);
        invalidMappings++;
      }
      if (!icon.key || typeof icon.key !== 'string' || icon.key.length === 0) {
        errors.push(`Empty tech-stack-icons key for skill "${skill.name}".`);
        invalidMappings++;
      }
    } else if (icon.source === 'svgl') {
      if (icon.fallbackLevel !== 2) {
        errors.push(`Skill "${skill.name}" source is svgl but fallbackLevel is ${icon.fallbackLevel} (expected 2).`);
        invalidMappings++;
      }
      const url = icon.url || `/assets/icons/svgl/${icon.key}.svg`;
      if (!url.startsWith('/assets/icons/svgl/') || !url.endsWith('.svg')) {
        errors.push(`Invalid SVGL URL format for skill "${skill.name}": "${url}".`);
        invalidMappings++;
      } else {
        const fileExists = checkAssetExists(url, customAssetChecker);
        if (!fileExists) {
          errors.push(`SVGL asset physically missing on disk for skill "${skill.name}": "${url}".`);
          missingLocalAssets++;
        }
      }
    } else if (icon.source === 'simple-icons') {
      if (icon.fallbackLevel !== 3) {
        errors.push(`Skill "${skill.name}" source is simple-icons but fallbackLevel is ${icon.fallbackLevel} (expected 3).`);
        invalidMappings++;
      }
      const si = icon.simpleIcon;
      if (!si || typeof si.path !== 'string' || si.path.length < 10) {
        errors.push(`Invalid SimpleIcon vector path for skill "${skill.name}" (${skill.id}).`);
        invalidMappings++;
      }
      if (!si || typeof si.hex !== 'string' || si.hex.length < 3) {
        errors.push(`Invalid SimpleIcon hex code for skill "${skill.name}" (${skill.id}).`);
        invalidMappings++;
      }
    } else if (icon.source === 'verified-local') {
      if (icon.fallbackLevel !== 4) {
        errors.push(`Skill "${skill.name}" source is verified-local but fallbackLevel is ${icon.fallbackLevel} (expected 4).`);
        invalidMappings++;
      }
      const url = icon.url || `/assets/icons/${icon.key}.svg`;
      if (!url.startsWith('/assets/icons/') || !url.endsWith('.svg')) {
        errors.push(`Invalid local SVG URL format for skill "${skill.name}": "${url}".`);
        invalidMappings++;
      } else {
        const fileExists = checkAssetExists(url, customAssetChecker);
        if (!fileExists) {
          errors.push(`Local SVG asset physically missing on disk for skill "${skill.name}": "${url}".`);
          missingLocalAssets++;
        }
      }
    } else if (icon.source === 'missing') {
      if (icon.fallbackLevel !== 5) {
        errors.push(`Skill "${skill.name}" source is missing but fallbackLevel is ${icon.fallbackLevel} (expected 5).`);
        invalidMappings++;
      }
      if (icon.classification !== 'missing' || icon.status !== 'missing') {
        errors.push(`Skill "${skill.name}" has source "missing" but classification "${icon.classification}".`);
        invalidMappings++;
      }
    }

    // Resolved icon output verification (no silent fallback permitted)
    const resolved = resolveSkillIcon(skill.id, skill.name);
    if (icon.source === 'missing') {
      if (resolved.kind !== 'missing') {
        errors.push(`Skill "${skill.name}" is classified as missing, but resolved to non-missing state.`);
        invalidMappings++;
      }
    } else {
      if (resolved.kind === 'missing') {
        errors.push(`Skill "${skill.name}" (${skill.id}) unexpectedly resolved to missing state.`);
        invalidMappings++;
      }
      if (resolved.source !== icon.source) {
        errors.push(`Skill "${skill.name}" source mismatch: registry=${icon.source}, resolved=${resolved.source}.`);
        invalidMappings++;
      }
    }

    // Add entry to per-skill report
    skillsReport.push({
      id: skill.id,
      name: skill.name,
      resolvedSource: resolved.source,
      resolvedIconKey: resolved.key,
      fallbackLevel: resolved.fallbackLevel,
      classification: resolved.classification,
      verificationStatus: resolved.status,
      missingStatus: resolved.kind === 'missing' ? 'missing' : 'present',
    });
  });

  // Verify that standards and generic representations are not misclassified as official brand logos
  for (const nonBrandSkillId of NON_BRAND_SKILL_IDS) {
    const def = getIconDefinition(nonBrandSkillId);
    if (def && def.icon.classification === 'official-brand') {
      errors.push(`Technology "${nonBrandSkillId}" is a standard/generic symbol and must NOT be classified as "official-brand".`);
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
    sourceCounts,
    classificationCounts,
    brandIcons,
    genericIcons,
    missingIcons,
    invalidMappings,
    missingLocalAssets,
    unexpectedRegistryEntries,
    duplicateIds,
    duplicateNames,
    missingIconList,
    skillsReport,
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
