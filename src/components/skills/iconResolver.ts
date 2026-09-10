import {
  siTypescript,
  siJavascript,
  siReact,
  siNextdotjs,
  siSvelte,
  siTailwindcss,
  siFramer,
  siGreensock,
  siHtml5,
  siVite,
  siThreedotjs,
  siWebgl,
  siWebgpu,
  siBlender,
  siBabylondotjs,
  siNodedotjs,
  siExpress,
  siFastapi,
  siPostgresql,
  siSupabase,
  siPrisma,
  siDrizzle,
  siRedis,
  siTrpc,
  siGraphql,
  siSolidity,
  siWagmi,
  siEthers,
  siIpfs,
  siAnthropic,
  siGooglegemini,
  siDeepseek,
  siQwen,
  siVercel,
  siOllama,
  siHuggingface,
  siLangchain,
  siLanggraph,
  siCrewai,
  siDify,
  siCoze,
  siHaystack,
  siMilvus,
  siQdrant,
  siDocker,
  siKubernetes,
  siGithubactions,
  siPrometheus,
  siGrafana,
  siSentry,
  siPytest,
  siCelery,
  siOpentelemetry,
} from 'simple-icons';

export interface SimpleIconData {
  title: string;
  slug: string;
  path: string;
  hex: string;
}

export interface ResolvedIcon {
  kind: 'svg-path' | 'local-svg' | 'neutral';
  path?: string;
  hex?: string;
  title?: string;
  url?: string;
  fallbackText: string;
  neutralReason?: string;
}

/**
 * 1. Verified official local SVG assets in /public/assets/icons/
 * Pure vectors only &mdash; zero raster data, zero fake/hallucinated SVGs.
 */
export const LOCAL_SVG_ASSETS: Record<string, string> = {
  openai: '/assets/icons/openai.svg',
  playwright: '/assets/icons/playwright.svg',
  pinecone: '/assets/icons/pinecone.svg',
  weaviate: '/assets/icons/weaviate.svg',
  llamaindex: '/assets/icons/llamaindex.svg',
  groq: '/assets/icons/groq.svg',
  cohere: '/assets/icons/cohere.svg',
  togetherai: '/assets/icons/togetherai.svg',
  chroma: '/assets/icons/chroma.svg',
  mcp: '/assets/icons/mcp.svg',
  voyageai: '/assets/icons/voyageai.svg',
  unstructured: '/assets/icons/unstructured.svg',
  thegraph: '/assets/icons/thegraph.svg',
  viem: '/assets/icons/viem.svg',
  autogen: '/assets/icons/autogen.svg',
};

/**
 * 2. Verified package vectors directly from installed simple-icons package
 */
export const PACKAGE_ICONS: Record<string, SimpleIconData> = {
  typescript: siTypescript,
  javascript: siJavascript,
  react: siReact,
  nextdotjs: siNextdotjs,
  svelte: siSvelte,
  tailwindcss: siTailwindcss,
  framer: siFramer,
  greensock: siGreensock,
  html5: siHtml5,
  vite: siVite,
  threedotjs: siThreedotjs,
  webgl: siWebgl,
  webgpu: siWebgpu,
  blender: siBlender,
  babylondotjs: siBabylondotjs,
  nodedotjs: siNodedotjs,
  express: siExpress,
  fastapi: siFastapi,
  postgresql: siPostgresql,
  supabase: siSupabase,
  prisma: siPrisma,
  drizzle: siDrizzle,
  redis: siRedis,
  trpc: siTrpc,
  graphql: siGraphql,
  solidity: siSolidity,
  wagmi: siWagmi,
  ethers: siEthers,
  ipfs: siIpfs,
  anthropic: siAnthropic,
  googlegemini: siGooglegemini,
  deepseek: siDeepseek,
  qwen: siQwen,
  vercel: siVercel,
  ollama: siOllama,
  huggingface: siHuggingface,
  langchain: siLangchain,
  langgraph: siLanggraph,
  crewai: siCrewai,
  dify: siDify,
  coze: siCoze,
  haystack: siHaystack,
  milvus: siMilvus,
  qdrant: siQdrant,
  docker: siDocker,
  kubernetes: siKubernetes,
  githubactions: siGithubactions,
  prometheus: siPrometheus,
  grafana: siGrafana,
  sentry: siSentry,
  pytest: siPytest,
  celery: siCelery,
  opentelemetry: siOpentelemetry,
};

/**
 * 3. Authoritative list of genuinely unbranded specifications, standards,
 *    and tools lacking standalone brand vectors.
 *    For these technologies, a neutral fallback representation is permitted.
 */
export const GENUINELY_UNBRANDED_SKILLS: Record<string, { fallbackText: string; reason: string }> = {
  glsl: {
    fallbackText: 'GL',
    reason: 'GLSL is an open language specification by Khronos Group; not OpenGL.',
  },
  r3f: {
    fallbackText: 'RF',
    reason: 'React Three Fiber is a community renderer specification; not React.',
  },
  spline: {
    fallbackText: 'SP',
    reason: 'Spline 3D has no official standalone vector SVG published.',
  },
  draco: {
    fallbackText: 'DR',
    reason: 'Google Draco is an open 3D compression library; not Three.js.',
  },
  canvasapi: {
    fallbackText: 'CA',
    reason: 'HTML5 2D Canvas is a W3C/WHATWG standard API; not HTML5.',
  },
  foundry: {
    fallbackText: 'FO',
    reason: 'Foundry is an Ethereum toolchain; no official standalone vector SVG.',
  },
  privy: {
    fallbackText: 'PV',
    reason: 'Privy has no official standalone vector SVG published.',
  },
  erc4337: {
    fallbackText: 'ER',
    reason: 'ERC-4337 is an Ethereum Account Abstraction standard (EIP-4337).',
  },
  siwe: {
    fallbackText: 'SI',
    reason: 'SIWE is a Sign-In with Ethereum cryptographic standard (EIP-4361).',
  },
  semantickernel: {
    fallbackText: 'SK',
    reason: 'Semantic Kernel is a Microsoft SDK; no standalone vector SVG published.',
  },
  pgvector: {
    fallbackText: 'PG',
    reason: 'pgvector is an open-source vector search extension for PostgreSQL.',
  },
  llamaparse: {
    fallbackText: 'LP',
    reason: 'LlamaParse has no standalone vector SVG published.',
  },
};

/**
 * Canonical Icon Resolver
 * ONE single source of truth for all 80 skills.
 */
export function resolveSkillIcon(
  id: string,
  slug?: string,
  name?: string
): ResolvedIcon {
  const cleanId = (id || '').toLowerCase().trim();
  const cleanSlug = (slug || cleanId).toLowerCase().trim();

  // Priority 1: Verified local SVG asset in /public/assets/icons/
  const localUrl = LOCAL_SVG_ASSETS[cleanId] || LOCAL_SVG_ASSETS[cleanSlug];
  if (localUrl) {
    const rawFallback = (name || id || 'SK').replace(/[^a-zA-Z0-9]/g, '');
    const fallbackText = (rawFallback.length >= 2 ? rawFallback.slice(0, 2) : rawFallback.padEnd(2, 'X')).toUpperCase();
    return {
      kind: 'local-svg',
      url: localUrl,
      title: name || id,
      fallbackText,
    };
  }

  // Priority 2: Verified official Simple Icons vector
  const simpleIcon = PACKAGE_ICONS[cleanId] || PACKAGE_ICONS[cleanSlug];
  if (simpleIcon) {
    const rawFallback = (name || id || 'SK').replace(/[^a-zA-Z0-9]/g, '');
    const fallbackText = (rawFallback.length >= 2 ? rawFallback.slice(0, 2) : rawFallback.padEnd(2, 'X')).toUpperCase();
    return {
      kind: 'svg-path',
      path: simpleIcon.path,
      hex: simpleIcon.hex,
      title: simpleIcon.title,
      fallbackText,
    };
  }

  // Priority 3: Approved neutral fallback for genuinely unbranded technologies
  const unbranded = GENUINELY_UNBRANDED_SKILLS[cleanId] || GENUINELY_UNBRANDED_SKILLS[cleanSlug];
  if (unbranded) {
    return {
      kind: 'neutral',
      title: name || id,
      fallbackText: unbranded.fallbackText,
      neutralReason: unbranded.reason,
    };
  }

  // Defensive fallback for any unexpected skill
  const raw = (name || id || 'SK').replace(/[^a-zA-Z0-9]/g, '');
  const fallbackText = (raw.length >= 2 ? raw.slice(0, 2) : raw.padEnd(2, 'X')).toUpperCase();
  return {
    kind: 'neutral',
    title: name || id,
    fallbackText,
    neutralReason: 'Unregistered technology',
  };
}
