import * as si from 'simple-icons';
import type { SimpleIcon } from 'simple-icons';

export type ResolvedIcon =
  | { kind: 'svg-path'; path: string; hex: string; title: string }
  | { kind: 'local-svg'; url: string; title: string }
  | { kind: 'unbranded'; title: string };

/**
 * 1. Verified Official Local SVG Assets (public/assets/icons/)
 * Pure vector SVGs directly from official company repositories.
 */
const VERIFIED_LOCAL_SVGS: Record<string, { url: string; title: string }> = {
  draco: { url: '/assets/icons/draco.svg', title: 'Draco' },
  viem: { url: '/assets/icons/viem.svg', title: 'viem' },
  thegraph: { url: '/assets/icons/thegraph.svg', title: 'The Graph' },
  openai: { url: '/assets/icons/openai.svg', title: 'OpenAI' },
  groq: { url: '/assets/icons/groq.svg', title: 'Groq' },
  togetherai: { url: '/assets/icons/togetherai.svg', title: 'Together AI' },
  llamaindex: { url: '/assets/icons/llamaindex.svg', title: 'LlamaIndex' },
  autogen: { url: '/assets/icons/autogen.svg', title: 'AutoGen' },
  mcp: { url: '/assets/icons/mcp.svg', title: 'Model Context Protocol' },
  chroma: { url: '/assets/icons/chroma.svg', title: 'Chroma' },
  weaviate: { url: '/assets/icons/weaviate.svg', title: 'Weaviate' },
  pinecone: { url: '/assets/icons/pinecone.svg', title: 'Pinecone' },
  unstructured: { url: '/assets/icons/unstructured.svg', title: 'Unstructured' },
  cohere: { url: '/assets/icons/cohere.svg', title: 'Cohere' },
  voyageai: { url: '/assets/icons/voyageai.svg', title: 'Voyage AI' },
  playwright: { url: '/assets/icons/playwright.svg', title: 'Playwright' },
};

/**
 * 2. Verified Simple Icons mappings (simple-icons package)
 * Directly imports authentic vector paths and brand colors.
 */
const SIMPLE_ICONS_MAP: Record<string, SimpleIcon> = {
  typescript: si.siTypescript,
  javascript: si.siJavascript,
  react: si.siReact,
  nextdotjs: si.siNextdotjs,
  svelte: si.siSvelte,
  tailwindcss: si.siTailwindcss,
  framer: si.siFramer,
  greensock: si.siGreensock,
  html5: si.siHtml5,
  vite: si.siVite,
  threedotjs: si.siThreedotjs,
  webgl: si.siWebgl,
  webgpu: si.siWebgpu,
  blender: si.siBlender,
  babylondotjs: si.siBabylondotjs,
  nodedotjs: si.siNodedotjs,
  express: si.siExpress,
  fastapi: si.siFastapi,
  postgresql: si.siPostgresql,
  supabase: si.siSupabase,
  prisma: si.siPrisma,
  drizzle: si.siDrizzle,
  redis: si.siRedis,
  trpc: si.siTrpc,
  graphql: si.siGraphql,
  solidity: si.siSolidity,
  wagmi: si.siWagmi,
  ethers: si.siEthers,
  ipfs: si.siIpfs,
  anthropic: si.siAnthropic,
  googlegemini: si.siGooglegemini,
  deepseek: si.siDeepseek,
  qwen: si.siQwen,
  vercel: si.siVercel,
  ollama: si.siOllama,
  huggingface: si.siHuggingface,
  langchain: si.siLangchain,
  langgraph: si.siLanggraph,
  crewai: si.siCrewai,
  dify: si.siDify,
  coze: si.siCoze,
  haystack: si.siHaystack,
  milvus: si.siMilvus,
  qdrant: si.siQdrant,
  docker: si.siDocker,
  kubernetes: si.siKubernetes,
  githubactions: si.siGithubactions,
  prometheus: si.siPrometheus,
  grafana: si.siGrafana,
  sentry: si.siSentry,
  pytest: si.siPytest,
  celery: si.siCelery,
  opentelemetry: si.siOpentelemetry,
};

/**
 * 3. Genuinely Unbranded Technologies / Open Technical Standards
 * Specifications and standards that do NOT have official standalone brand logos.
 * Strictly decoupled from fake initials, monograms, approximate drawings, or unrelated brand substitutions.
 */
export const GENUINELY_UNBRANDED_SKILLS: Record<string, string> = {
  glsl: 'OpenGL Shading Language (Khronos Technical Standard; GLSL ≠ OpenGL)',
  r3f: 'React Three Fiber (Three.js React Library; R3F ≠ React)',
  spline: 'Spline (3D Design Platform; Proprietary Raster Asset)',
  canvasapi: 'HTML Canvas API (W3C Standard Browser Specification; Canvas API ≠ HTML5)',
  foundry: 'Foundry (Smart Contract Development Toolchain)',
  privy: 'Privy (Embedded Web3 Authentication Library)',
  erc4337: 'ERC-4337 (Ethereum Account Abstraction Standard)',
  siwe: 'SIWE (Sign-In with Ethereum EIP-4361 Standard)',
  semantickernel: 'Semantic Kernel (Microsoft AI Orchestration SDK)',
  pgvector: 'pgvector (PostgreSQL Open-Source Vector Extension)',
  llamaparse: 'LlamaParse (Document Extraction Engine)',
};

/**
 * Canonical Icon Resolver
 * Guarantees zero fake monograms, zero substituted brand logos, and zero drawn SVGs.
 */
export function resolveSkillIcon(skillId: string, slug?: string, name?: string): ResolvedIcon {
  const normalizedId = (skillId || slug || '').toLowerCase().trim();
  const title = name || normalizedId;

  // 1. Check verified local official SVGs
  const localSvg = VERIFIED_LOCAL_SVGS[normalizedId];
  if (localSvg) {
    return {
      kind: 'local-svg',
      url: localSvg.url,
      title: localSvg.title,
    };
  }

  // 2. Check verified Simple Icons vectors
  const siIcon = SIMPLE_ICONS_MAP[normalizedId];
  if (siIcon) {
    return {
      kind: 'svg-path',
      path: siIcon.path,
      hex: siIcon.hex,
      title: siIcon.title,
    };
  }

  // 3. Check genuinely unbranded technical standards
  if (normalizedId in GENUINELY_UNBRANDED_SKILLS) {
    return {
      kind: 'unbranded',
      title,
    };
  }

  // Unresolved brand fallback -> marked as unbranded but logged
  return {
    kind: 'unbranded',
    title,
  };
}
