import {
  siTypescript, siJavascript, siReact, siNextdotjs, siSvelte, siTailwindcss, siFramer, siGreensock, siHtml5, siVite, siRive,
  siThreedotjs, siWebgl, siWebgpu, siBlender, siBabylondotjs, siUnity,
  siNodedotjs, siExpress, siFastapi, siFlask, siSpringboot, siPrisma, siDrizzle, siTrpc, siGraphql, siPydantic, siNginx,
  siPostgresql, siMysql, siSupabase, siRedis, siRabbitmq, siCelery, siApachekafka, siDocker, siKubernetes, siLinux, siGit,
  siSolidity, siWagmi, siEthers, siIpfs,
  siAnthropic, siGooglegemini, siDeepseek, siQwen, siVercel, siOllama, siHuggingface,
  siLangchain, siLanggraph, siCrewai, siDify, siCoze, siHaystack,
  siMilvus, siQdrant, siPrometheus, siGrafana, siSentry
} from 'simple-icons';
import type { SimpleIcon } from 'simple-icons';

export type ResolvedIcon =
  | { kind: 'svg-path'; path: string; hex: string; title: string }
  | { kind: 'local-svg'; url: string; title: string };

/**
 * 1. Verified Official Local SVG Assets (public/assets/icons/)
 * Pure vector SVGs directly from official repositories & standards.
 */
const VERIFIED_LOCAL_SVGS: Record<string, { url: string; title: string }> = {
  // Row 2: 3D & Graphics
  glsl: { url: '/assets/icons/glsl.svg', title: 'GLSL' },
  r3f: { url: '/assets/icons/r3f.svg', title: 'React Three Fiber' },
  spline: { url: '/assets/icons/spline.svg', title: 'Spline' },
  draco: { url: '/assets/icons/draco.svg', title: 'Draco' },
  canvasapi: { url: '/assets/icons/canvasapi.svg', title: 'Canvas API' },

  // Row 5: Web3 & Decentralized
  viem: { url: '/assets/icons/viem.svg', title: 'viem' },
  foundry: { url: '/assets/icons/foundry.svg', title: 'Foundry' },
  privy: { url: '/assets/icons/privy.svg', title: 'Privy' },
  erc4337: { url: '/assets/icons/erc4337.svg', title: 'ERC-4337' },
  thegraph: { url: '/assets/icons/thegraph.svg', title: 'The Graph' },
  siwe: { url: '/assets/icons/siwe.svg', title: 'SIWE' },
  hardhat: { url: '/assets/icons/hardhat.svg', title: 'Hardhat' },

  // Row 6: AI Models & SDKs
  openai: { url: '/assets/icons/openai.svg', title: 'OpenAI' },
  groq: { url: '/assets/icons/groq.svg', title: 'Groq' },
  togetherai: { url: '/assets/icons/togetherai.svg', title: 'Together AI' },
  cohere: { url: '/assets/icons/cohere.svg', title: 'Cohere' },

  // Row 7: AI Agent & Orchestration
  llamaindex: { url: '/assets/icons/llamaindex.svg', title: 'LlamaIndex' },
  autogen: { url: '/assets/icons/autogen.svg', title: 'AutoGen' },
  semantickernel: { url: '/assets/icons/semantickernel.svg', title: 'Semantic Kernel' },
  mcp: { url: '/assets/icons/mcp.svg', title: 'MCP' },
  langsmith: { url: '/assets/icons/langsmith.svg', title: 'LangSmith' },

  // Row 8: RAG, Vector & Observability
  pgvector: { url: '/assets/icons/pgvector.svg', title: 'pgvector' },
  chroma: { url: '/assets/icons/chroma.svg', title: 'Chroma' },
  weaviate: { url: '/assets/icons/weaviate.svg', title: 'Weaviate' },
  pinecone: { url: '/assets/icons/pinecone.svg', title: 'Pinecone' },
  llamaparse: { url: '/assets/icons/llamaparse.svg', title: 'LlamaParse' },
  unstructured: { url: '/assets/icons/unstructured.svg', title: 'Unstructured' },
};

/**
 * 2. Tree-shakeable Simple Icons Map
 * Direct vector paths and authentic brand hex values.
 */
const SIMPLE_ICONS_MAP: Record<string, SimpleIcon> = {
  // Row 1: Core Frontend & Interaction
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
  rive: siRive,

  // Row 2: 3D & Graphics
  threedotjs: siThreedotjs,
  webgl: siWebgl,
  webgpu: siWebgpu,
  blender: siBlender,
  babylondotjs: siBabylondotjs,
  unity: siUnity,

  // Row 3: Backend & API Frameworks
  nodedotjs: siNodedotjs,
  express: siExpress,
  fastapi: siFastapi,
  flask: siFlask,
  springboot: siSpringboot,
  prisma: siPrisma,
  drizzle: siDrizzle,
  trpc: siTrpc,
  graphql: siGraphql,
  pydantic: siPydantic,
  nginx: siNginx,

  // Row 4: Data, Storage & Queues
  postgresql: siPostgresql,
  mysql: siMysql,
  supabase: siSupabase,
  redis: siRedis,
  rabbitmq: siRabbitmq,
  celery: siCelery,
  kafka: siApachekafka,
  docker: siDocker,
  kubernetes: siKubernetes,
  linux: siLinux,
  git: siGit,

  // Row 5: Web3 & Decentralized
  solidity: siSolidity,
  wagmi: siWagmi,
  ethers: siEthers,
  ipfs: siIpfs,

  // Row 6: AI Models & SDKs
  anthropic: siAnthropic,
  googlegemini: siGooglegemini,
  deepseek: siDeepseek,
  qwen: siQwen,
  vercel: siVercel,
  ollama: siOllama,
  huggingface: siHuggingface,

  // Row 7: AI Agent & Orchestration
  langchain: siLangchain,
  langgraph: siLanggraph,
  crewai: siCrewai,
  dify: siDify,
  coze: siCoze,
  haystack: siHaystack,

  // Row 8: RAG, Vector & Observability
  milvus: siMilvus,
  qdrant: siQdrant,
  prometheus: siPrometheus,
  grafana: siGrafana,
  sentry: siSentry,
};

/**
 * Resolves any skill icon deterministically.
 * Every one of the 88 skills resolves to a valid SVG path or verified local SVG URL.
 */
export function resolveSkillIcon(skillId: string, name?: string): ResolvedIcon {
  const normalizedId = skillId.toLowerCase().trim();
  const displayName = name || normalizedId;

  // 1. Check verified local official SVGs
  const localSvg = VERIFIED_LOCAL_SVGS[normalizedId];
  if (localSvg) {
    return {
      kind: 'local-svg',
      url: localSvg.url,
      title: localSvg.title || displayName,
    };
  }

  // 2. Check verified Simple Icons vectors
  const siIcon = SIMPLE_ICONS_MAP[normalizedId];
  if (siIcon) {
    return {
      kind: 'svg-path',
      path: siIcon.path,
      hex: siIcon.hex,
      title: siIcon.title || displayName,
    };
  }

  // Fallback (failsafe)
  return {
    kind: 'local-svg',
    url: `/assets/icons/${normalizedId}.svg`,
    title: displayName,
  };
}
