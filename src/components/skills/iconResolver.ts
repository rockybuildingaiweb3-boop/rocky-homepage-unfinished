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

export type IconType = 'brand' | 'generic' | 'missing';

export type IconSource =
  | { kind: 'simple-icon'; icon: SimpleIcon }
  | { kind: 'local-svg'; url: string; title: string }
  | { kind: 'missing' };

export interface IconDefinition {
  id: string;
  type: IconType;
  source: IconSource;
  title: string;
}

export type ResolvedIcon =
  | {
      id: string;
      name: string;
      iconType: 'brand' | 'generic';
      kind: 'svg-path';
      path: string;
      hex: string;
      title: string;
    }
  | {
      id: string;
      name: string;
      iconType: 'brand' | 'generic';
      kind: 'local-svg';
      url: string;
      title: string;
    }
  | {
      id: string;
      name: string;
      iconType: 'missing';
      kind: 'missing';
      title: string;
    };

/**
 * Canonical Icon Registry for all 88 technologies.
 * Explicitly maps skill ID to either a verified Brand icon or a Generic technical symbol.
 * No arbitrary string matching or guessed file paths.
 */
export const ICON_REGISTRY: Record<string, IconDefinition> = {
  // ==========================================
  // ROW 1 — CORE FRONTEND & INTERACTION (11)
  // ==========================================
  typescript: {
    id: 'typescript',
    type: 'brand',
    title: 'TypeScript',
    source: { kind: 'simple-icon', icon: siTypescript },
  },
  javascript: {
    id: 'javascript',
    type: 'brand',
    title: 'JavaScript',
    source: { kind: 'simple-icon', icon: siJavascript },
  },
  react: {
    id: 'react',
    type: 'brand',
    title: 'React',
    source: { kind: 'simple-icon', icon: siReact },
  },
  nextdotjs: {
    id: 'nextdotjs',
    type: 'brand',
    title: 'Next.js',
    source: { kind: 'simple-icon', icon: siNextdotjs },
  },
  svelte: {
    id: 'svelte',
    type: 'brand',
    title: 'Svelte',
    source: { kind: 'simple-icon', icon: siSvelte },
  },
  tailwindcss: {
    id: 'tailwindcss',
    type: 'brand',
    title: 'Tailwind CSS',
    source: { kind: 'simple-icon', icon: siTailwindcss },
  },
  framer: {
    id: 'framer',
    type: 'brand',
    title: 'Framer Motion',
    source: { kind: 'simple-icon', icon: siFramer },
  },
  greensock: {
    id: 'greensock',
    type: 'brand',
    title: 'GSAP',
    source: { kind: 'simple-icon', icon: siGreensock },
  },
  html5: {
    id: 'html5',
    type: 'brand',
    title: 'HTML5',
    source: { kind: 'simple-icon', icon: siHtml5 },
  },
  vite: {
    id: 'vite',
    type: 'brand',
    title: 'Vite',
    source: { kind: 'simple-icon', icon: siVite },
  },
  rive: {
    id: 'rive',
    type: 'brand',
    title: 'Rive',
    source: { kind: 'simple-icon', icon: siRive },
  },

  // ==========================================
  // ROW 2 — 3D & GRAPHICS (11)
  // ==========================================
  threedotjs: {
    id: 'threedotjs',
    type: 'brand',
    title: 'Three.js',
    source: { kind: 'simple-icon', icon: siThreedotjs },
  },
  webgl: {
    id: 'webgl',
    type: 'generic', // Khronos web 3D standard
    title: 'WebGL',
    source: { kind: 'simple-icon', icon: siWebgl },
  },
  glsl: {
    id: 'glsl',
    type: 'generic', // Shader pipeline language standard
    title: 'GLSL',
    source: { kind: 'local-svg', url: '/assets/icons/glsl.svg', title: 'GLSL' },
  },
  webgpu: {
    id: 'webgpu',
    type: 'generic', // W3C WebGPU hardware acceleration standard
    title: 'WebGPU',
    source: { kind: 'simple-icon', icon: siWebgpu },
  },
  r3f: {
    id: 'r3f',
    type: 'generic', // pmndrs declarative 3D canvas technical symbol
    title: 'React Three Fiber',
    source: { kind: 'local-svg', url: '/assets/icons/r3f.svg', title: 'React Three Fiber' },
  },
  blender: {
    id: 'blender',
    type: 'brand',
    title: 'Blender',
    source: { kind: 'simple-icon', icon: siBlender },
  },
  spline: {
    id: 'spline',
    type: 'generic', // 3D parametric spline loop mark
    title: 'Spline',
    source: { kind: 'local-svg', url: '/assets/icons/spline.svg', title: 'Spline' },
  },
  draco: {
    id: 'draco',
    type: 'brand', // Official Google/Khronos Draco 3D compression mark
    title: 'Draco',
    source: { kind: 'local-svg', url: '/assets/icons/draco.svg', title: 'Draco' },
  },
  canvasapi: {
    id: 'canvasapi',
    type: 'generic', // HTML5 Canvas 2D bitmap standard
    title: 'Canvas API',
    source: { kind: 'local-svg', url: '/assets/icons/canvasapi.svg', title: 'Canvas API' },
  },
  babylondotjs: {
    id: 'babylondotjs',
    type: 'brand',
    title: 'Babylon.js',
    source: { kind: 'simple-icon', icon: siBabylondotjs },
  },
  unity: {
    id: 'unity',
    type: 'brand',
    title: 'Unity',
    source: { kind: 'simple-icon', icon: siUnity },
  },

  // ==========================================
  // ROW 3 — BACKEND & API FRAMEWORKS (11)
  // ==========================================
  nodedotjs: {
    id: 'nodedotjs',
    type: 'brand',
    title: 'Node.js',
    source: { kind: 'simple-icon', icon: siNodedotjs },
  },
  express: {
    id: 'express',
    type: 'brand',
    title: 'Express',
    source: { kind: 'simple-icon', icon: siExpress },
  },
  fastapi: {
    id: 'fastapi',
    type: 'brand',
    title: 'FastAPI',
    source: { kind: 'simple-icon', icon: siFastapi },
  },
  flask: {
    id: 'flask',
    type: 'brand',
    title: 'Flask',
    source: { kind: 'simple-icon', icon: siFlask },
  },
  springboot: {
    id: 'springboot',
    type: 'brand',
    title: 'Spring Boot',
    source: { kind: 'simple-icon', icon: siSpringboot },
  },
  prisma: {
    id: 'prisma',
    type: 'brand',
    title: 'Prisma',
    source: { kind: 'simple-icon', icon: siPrisma },
  },
  drizzle: {
    id: 'drizzle',
    type: 'brand',
    title: 'Drizzle',
    source: { kind: 'simple-icon', icon: siDrizzle },
  },
  trpc: {
    id: 'trpc',
    type: 'brand',
    title: 'tRPC',
    source: { kind: 'simple-icon', icon: siTrpc },
  },
  graphql: {
    id: 'graphql',
    type: 'brand',
    title: 'GraphQL',
    source: { kind: 'simple-icon', icon: siGraphql },
  },
  pydantic: {
    id: 'pydantic',
    type: 'brand',
    title: 'Pydantic',
    source: { kind: 'simple-icon', icon: siPydantic },
  },
  nginx: {
    id: 'nginx',
    type: 'brand',
    title: 'Nginx',
    source: { kind: 'simple-icon', icon: siNginx },
  },

  // ==========================================
  // ROW 4 — DATA, STORAGE & QUEUES (11)
  // ==========================================
  postgresql: {
    id: 'postgresql',
    type: 'brand',
    title: 'PostgreSQL',
    source: { kind: 'simple-icon', icon: siPostgresql },
  },
  mysql: {
    id: 'mysql',
    type: 'brand',
    title: 'MySQL',
    source: { kind: 'simple-icon', icon: siMysql },
  },
  supabase: {
    id: 'supabase',
    type: 'brand',
    title: 'Supabase',
    source: { kind: 'simple-icon', icon: siSupabase },
  },
  redis: {
    id: 'redis',
    type: 'brand',
    title: 'Redis',
    source: { kind: 'simple-icon', icon: siRedis },
  },
  rabbitmq: {
    id: 'rabbitmq',
    type: 'brand',
    title: 'RabbitMQ',
    source: { kind: 'simple-icon', icon: siRabbitmq },
  },
  celery: {
    id: 'celery',
    type: 'brand',
    title: 'Celery',
    source: { kind: 'simple-icon', icon: siCelery },
  },
  kafka: {
    id: 'kafka',
    type: 'brand',
    title: 'Kafka',
    source: { kind: 'simple-icon', icon: siApachekafka },
  },
  docker: {
    id: 'docker',
    type: 'brand',
    title: 'Docker',
    source: { kind: 'simple-icon', icon: siDocker },
  },
  kubernetes: {
    id: 'kubernetes',
    type: 'brand',
    title: 'Kubernetes',
    source: { kind: 'simple-icon', icon: siKubernetes },
  },
  linux: {
    id: 'linux',
    type: 'brand',
    title: 'Linux',
    source: { kind: 'simple-icon', icon: siLinux },
  },
  git: {
    id: 'git',
    type: 'brand',
    title: 'Git',
    source: { kind: 'simple-icon', icon: siGit },
  },

  // ==========================================
  // ROW 5 — WEB3 & DECENTRALIZED (11)
  // ==========================================
  solidity: {
    id: 'solidity',
    type: 'brand',
    title: 'Solidity',
    source: { kind: 'simple-icon', icon: siSolidity },
  },
  viem: {
    id: 'viem',
    type: 'brand', // Official viem vector mark
    title: 'viem',
    source: { kind: 'local-svg', url: '/assets/icons/viem.svg', title: 'viem' },
  },
  wagmi: {
    id: 'wagmi',
    type: 'brand',
    title: 'wagmi',
    source: { kind: 'simple-icon', icon: siWagmi },
  },
  ethers: {
    id: 'ethers',
    type: 'brand',
    title: 'Ethers.js',
    source: { kind: 'simple-icon', icon: siEthers },
  },
  foundry: {
    id: 'foundry',
    type: 'generic', // Paradigm Foundry anvil technical symbol
    title: 'Foundry',
    source: { kind: 'local-svg', url: '/assets/icons/foundry.svg', title: 'Foundry' },
  },
  privy: {
    id: 'privy',
    type: 'generic', // Embedded auth cube symbol
    title: 'Privy',
    source: { kind: 'local-svg', url: '/assets/icons/privy.svg', title: 'Privy' },
  },
  erc4337: {
    id: 'erc4337',
    type: 'generic', // Ethereum standard for account abstraction
    title: 'ERC-4337',
    source: { kind: 'local-svg', url: '/assets/icons/erc4337.svg', title: 'ERC-4337' },
  },
  thegraph: {
    id: 'thegraph',
    type: 'brand', // Official The Graph network concentric mark
    title: 'The Graph',
    source: { kind: 'local-svg', url: '/assets/icons/thegraph.svg', title: 'The Graph' },
  },
  ipfs: {
    id: 'ipfs',
    type: 'brand',
    title: 'IPFS',
    source: { kind: 'simple-icon', icon: siIpfs },
  },
  siwe: {
    id: 'siwe',
    type: 'generic', // EIP-4361 Sign-In with Ethereum protocol standard
    title: 'SIWE',
    source: { kind: 'local-svg', url: '/assets/icons/siwe.svg', title: 'SIWE' },
  },
  hardhat: {
    id: 'hardhat',
    type: 'generic', // Hardhat construction helmet technical symbol
    title: 'Hardhat',
    source: { kind: 'local-svg', url: '/assets/icons/hardhat.svg', title: 'Hardhat' },
  },

  // ==========================================
  // ROW 6 — AI MODELS & SDKS (11)
  // ==========================================
  openai: {
    id: 'openai',
    type: 'brand', // Official OpenAI vector logo
    title: 'OpenAI',
    source: { kind: 'local-svg', url: '/assets/icons/openai.svg', title: 'OpenAI' },
  },
  anthropic: {
    id: 'anthropic',
    type: 'brand',
    title: 'Anthropic',
    source: { kind: 'simple-icon', icon: siAnthropic },
  },
  googlegemini: {
    id: 'googlegemini',
    type: 'brand',
    title: 'Google Gemini',
    source: { kind: 'simple-icon', icon: siGooglegemini },
  },
  deepseek: {
    id: 'deepseek',
    type: 'brand',
    title: 'DeepSeek',
    source: { kind: 'simple-icon', icon: siDeepseek },
  },
  qwen: {
    id: 'qwen',
    type: 'brand',
    title: 'Qwen',
    source: { kind: 'simple-icon', icon: siQwen },
  },
  vercel: {
    id: 'vercel',
    type: 'brand',
    title: 'Vercel AI SDK',
    source: { kind: 'simple-icon', icon: siVercel },
  },
  ollama: {
    id: 'ollama',
    type: 'brand',
    title: 'Ollama',
    source: { kind: 'simple-icon', icon: siOllama },
  },
  huggingface: {
    id: 'huggingface',
    type: 'brand',
    title: 'Hugging Face',
    source: { kind: 'simple-icon', icon: siHuggingface },
  },
  groq: {
    id: 'groq',
    type: 'brand', // Official Groq LPU vector mark
    title: 'Groq',
    source: { kind: 'local-svg', url: '/assets/icons/groq.svg', title: 'Groq' },
  },
  togetherai: {
    id: 'togetherai',
    type: 'brand', // Official Together AI vector mark
    title: 'Together AI',
    source: { kind: 'local-svg', url: '/assets/icons/togetherai.svg', title: 'Together AI' },
  },
  cohere: {
    id: 'cohere',
    type: 'brand', // Official Cohere coral squircle vector
    title: 'Cohere',
    source: { kind: 'local-svg', url: '/assets/icons/cohere.svg', title: 'Cohere' },
  },

  // ==========================================
  // ROW 7 — AI AGENT & ORCHESTRATION (11)
  // ==========================================
  langchain: {
    id: 'langchain',
    type: 'brand',
    title: 'LangChain',
    source: { kind: 'simple-icon', icon: siLangchain },
  },
  langgraph: {
    id: 'langgraph',
    type: 'brand',
    title: 'LangGraph',
    source: { kind: 'simple-icon', icon: siLanggraph },
  },
  llamaindex: {
    id: 'llamaindex',
    type: 'brand', // Official LlamaIndex square vector
    title: 'LlamaIndex',
    source: { kind: 'local-svg', url: '/assets/icons/llamaindex.svg', title: 'LlamaIndex' },
  },
  crewai: {
    id: 'crewai',
    type: 'brand',
    title: 'CrewAI',
    source: { kind: 'simple-icon', icon: siCrewai },
  },
  autogen: {
    id: 'autogen',
    type: 'brand', // Official Microsoft AutoGen vector
    title: 'AutoGen',
    source: { kind: 'local-svg', url: '/assets/icons/autogen.svg', title: 'AutoGen' },
  },
  dify: {
    id: 'dify',
    type: 'brand',
    title: 'Dify',
    source: { kind: 'simple-icon', icon: siDify },
  },
  coze: {
    id: 'coze',
    type: 'brand',
    title: 'Coze',
    source: { kind: 'simple-icon', icon: siCoze },
  },
  semantickernel: {
    id: 'semantickernel',
    type: 'generic', // Semantic Kernel neural loop technical symbol
    title: 'Semantic Kernel',
    source: { kind: 'local-svg', url: '/assets/icons/semantickernel.svg', title: 'Semantic Kernel' },
  },
  mcp: {
    id: 'mcp',
    type: 'generic', // Model Context Protocol open standard trident symbol
    title: 'MCP',
    source: { kind: 'local-svg', url: '/assets/icons/mcp.svg', title: 'MCP' },
  },
  haystack: {
    id: 'haystack',
    type: 'brand',
    title: 'Haystack',
    source: { kind: 'simple-icon', icon: siHaystack },
  },
  langsmith: {
    id: 'langsmith',
    type: 'generic', // LangSmith telemetry ray technical symbol
    title: 'LangSmith',
    source: { kind: 'local-svg', url: '/assets/icons/langsmith.svg', title: 'LangSmith' },
  },

  // ==========================================
  // ROW 8 — RAG, VECTOR & OBSERVABILITY (11)
  // ==========================================
  pgvector: {
    id: 'pgvector',
    type: 'generic', // PostgreSQL vector extension technical symbol
    title: 'pgvector',
    source: { kind: 'local-svg', url: '/assets/icons/pgvector.svg', title: 'pgvector' },
  },
  chroma: {
    id: 'chroma',
    type: 'brand', // Official Chroma DB vector mark
    title: 'Chroma',
    source: { kind: 'local-svg', url: '/assets/icons/chroma.svg', title: 'Chroma' },
  },
  milvus: {
    id: 'milvus',
    type: 'brand',
    title: 'Milvus',
    source: { kind: 'simple-icon', icon: siMilvus },
  },
  weaviate: {
    id: 'weaviate',
    type: 'brand', // Official Weaviate 3D geometric vector
    title: 'Weaviate',
    source: { kind: 'local-svg', url: '/assets/icons/weaviate.svg', title: 'Weaviate' },
  },
  qdrant: {
    id: 'qdrant',
    type: 'brand',
    title: 'Qdrant',
    source: { kind: 'simple-icon', icon: siQdrant },
  },
  pinecone: {
    id: 'pinecone',
    type: 'brand', // Official Pinecone geometric vector
    title: 'Pinecone',
    source: { kind: 'local-svg', url: '/assets/icons/pinecone.svg', title: 'Pinecone' },
  },
  llamaparse: {
    id: 'llamaparse',
    type: 'generic', // Document parsing extraction technical symbol
    title: 'LlamaParse',
    source: { kind: 'local-svg', url: '/assets/icons/llamaparse.svg', title: 'LlamaParse' },
  },
  unstructured: {
    id: 'unstructured',
    type: 'brand', // Official Unstructured.io vector mark
    title: 'Unstructured',
    source: { kind: 'local-svg', url: '/assets/icons/unstructured.svg', title: 'Unstructured' },
  },
  prometheus: {
    id: 'prometheus',
    type: 'brand',
    title: 'Prometheus',
    source: { kind: 'simple-icon', icon: siPrometheus },
  },
  grafana: {
    id: 'grafana',
    type: 'brand',
    title: 'Grafana',
    source: { kind: 'simple-icon', icon: siGrafana },
  },
  sentry: {
    id: 'sentry',
    type: 'brand',
    title: 'Sentry',
    source: { kind: 'simple-icon', icon: siSentry },
  },
};

/**
 * Direct registry lookup helper.
 */
export function getIconDefinition(skillId: string): IconDefinition | undefined {
  const normalizedId = skillId.toLowerCase().trim();
  return ICON_REGISTRY[normalizedId];
}

/**
 * Resolves any skill icon deterministically with strict typing.
 * Never guesses random filenames. Returns 'missing' explicitly if unmapped.
 */
export function resolveSkillIcon(skillId: string, name?: string): ResolvedIcon {
  const normalizedId = skillId.toLowerCase().trim();
  const displayName = name || normalizedId;
  const def = ICON_REGISTRY[normalizedId];

  if (!def || def.type === 'missing' || def.source.kind === 'missing') {
    return {
      id: normalizedId,
      name: displayName,
      iconType: 'missing',
      kind: 'missing',
      title: displayName,
    };
  }

  if (def.source.kind === 'local-svg') {
    return {
      id: def.id,
      name: displayName,
      iconType: def.type,
      kind: 'local-svg',
      url: def.source.url,
      title: def.source.title || def.title || displayName,
    };
  }

  if (def.source.kind === 'simple-icon') {
    return {
      id: def.id,
      name: displayName,
      iconType: def.type,
      kind: 'svg-path',
      path: def.source.icon.path,
      hex: def.source.icon.hex,
      title: def.source.icon.title || def.title || displayName,
    };
  }

  return {
    id: normalizedId,
    name: displayName,
    iconType: 'missing',
    kind: 'missing',
    title: displayName,
  };
}
