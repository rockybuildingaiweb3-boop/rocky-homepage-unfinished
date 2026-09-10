/**
 * Canonical Technical Icon Registry
 * 
 * Central source of truth for all 80 skills in the portfolio.
 * 
 * Strict Resolution Hierarchy:
 * 1. Verified official local SVG stored in public/assets/icons/
 * 2. Verified official vector definition from installed simple-icons package
 * 3. Approved neutral representation for genuinely unbranded concepts, standards,
 *    specifications, or tools lacking standalone brand vectors.
 * 
 * ZERO fake SVGs, ZERO hand-drawn approximations, ZERO misattributed logos.
 */

export type IconSourceType = 'package' | 'local-svg' | 'neutral';

export interface IconRegistryEntry {
  skillId: string;
  sourceType: IconSourceType;
  /** Simple-icons key name (e.g. 'siTypescript') if sourceType === 'package' */
  packageKey?: string;
  /** Relative asset URL under /public if sourceType === 'local-svg' */
  localPath?: string;
  /** Documented rationale for neutral representation */
  neutralReason?: string;
  /** 2-letter uppercase monogram */
  fallbackText: string;
}

export const ICON_REGISTRY: Record<string, IconRegistryEntry> = {
  // =========================================================================
  // ROW 1: Core Frontend & Interaction (10/10 package-backed)
  // =========================================================================
  typescript: {
    skillId: 'typescript',
    sourceType: 'package',
    packageKey: 'siTypescript',
    fallbackText: 'TS',
  },
  javascript: {
    skillId: 'javascript',
    sourceType: 'package',
    packageKey: 'siJavascript',
    fallbackText: 'JS',
  },
  react: {
    skillId: 'react',
    sourceType: 'package',
    packageKey: 'siReact',
    fallbackText: 'RE',
  },
  nextdotjs: {
    skillId: 'nextdotjs',
    sourceType: 'package',
    packageKey: 'siNextdotjs',
    fallbackText: 'NE',
  },
  svelte: {
    skillId: 'svelte',
    sourceType: 'package',
    packageKey: 'siSvelte',
    fallbackText: 'SV',
  },
  tailwindcss: {
    skillId: 'tailwindcss',
    sourceType: 'package',
    packageKey: 'siTailwindcss',
    fallbackText: 'TA',
  },
  framer: {
    skillId: 'framer',
    sourceType: 'package',
    packageKey: 'siFramer',
    fallbackText: 'FR',
  },
  greensock: {
    skillId: 'greensock',
    sourceType: 'package',
    packageKey: 'siGreensock',
    fallbackText: 'GS',
  },
  html5: {
    skillId: 'html5',
    sourceType: 'package',
    packageKey: 'siHtml5',
    fallbackText: 'HT',
  },
  vite: {
    skillId: 'vite',
    sourceType: 'package',
    packageKey: 'siVite',
    fallbackText: 'VI',
  },

  // =========================================================================
  // ROW 2: 3D & Graphics (5 package-backed, 5 approved neutral)
  // =========================================================================
  threedotjs: {
    skillId: 'threedotjs',
    sourceType: 'package',
    packageKey: 'siThreedotjs',
    fallbackText: 'TH',
  },
  webgl: {
    skillId: 'webgl',
    sourceType: 'package',
    packageKey: 'siWebgl',
    fallbackText: 'WE',
  },
  glsl: {
    skillId: 'glsl',
    sourceType: 'neutral',
    neutralReason: 'Khronos Group language specification; no standalone brand logo',
    fallbackText: 'GL',
  },
  webgpu: {
    skillId: 'webgpu',
    sourceType: 'package',
    packageKey: 'siWebgpu',
    fallbackText: 'WG',
  },
  r3f: {
    skillId: 'r3f',
    sourceType: 'neutral',
    neutralReason: 'pmnd.rs React Three Fiber specification layer; no standalone vector logo',
    fallbackText: 'RF',
  },
  blender: {
    skillId: 'blender',
    sourceType: 'package',
    packageKey: 'siBlender',
    fallbackText: 'BL',
  },
  spline: {
    skillId: 'spline',
    sourceType: 'neutral',
    neutralReason: 'Interactive 3D design tool; no official vector SVG published',
    fallbackText: 'SP',
  },
  draco: {
    skillId: 'draco',
    sourceType: 'neutral',
    neutralReason: 'Google open-source 3D compression library; no standalone vector logo',
    fallbackText: 'DR',
  },
  canvasapi: {
    skillId: 'canvasapi',
    sourceType: 'neutral',
    neutralReason: 'W3C/WHATWG HTML5 2D Canvas standard specification; no standalone brand logo',
    fallbackText: 'CA',
  },
  babylondotjs: {
    skillId: 'babylondotjs',
    sourceType: 'package',
    packageKey: 'siBabylondotjs',
    fallbackText: 'BA',
  },

  // =========================================================================
  // ROW 3: Backend, Data & Infrastructure (10/10 package-backed)
  // =========================================================================
  nodedotjs: {
    skillId: 'nodedotjs',
    sourceType: 'package',
    packageKey: 'siNodedotjs',
    fallbackText: 'NO',
  },
  express: {
    skillId: 'express',
    sourceType: 'package',
    packageKey: 'siExpress',
    fallbackText: 'EX',
  },
  fastapi: {
    skillId: 'fastapi',
    sourceType: 'package',
    packageKey: 'siFastapi',
    fallbackText: 'FA',
  },
  postgresql: {
    skillId: 'postgresql',
    sourceType: 'package',
    packageKey: 'siPostgresql',
    fallbackText: 'PO',
  },
  supabase: {
    skillId: 'supabase',
    sourceType: 'package',
    packageKey: 'siSupabase',
    fallbackText: 'SU',
  },
  prisma: {
    skillId: 'prisma',
    sourceType: 'package',
    packageKey: 'siPrisma',
    fallbackText: 'PR',
  },
  drizzle: {
    skillId: 'drizzle',
    sourceType: 'package',
    packageKey: 'siDrizzle',
    fallbackText: 'DR',
  },
  redis: {
    skillId: 'redis',
    sourceType: 'package',
    packageKey: 'siRedis',
    fallbackText: 'RE',
  },
  trpc: {
    skillId: 'trpc',
    sourceType: 'package',
    packageKey: 'siTrpc',
    fallbackText: 'TR',
  },
  graphql: {
    skillId: 'graphql',
    sourceType: 'package',
    packageKey: 'siGraphql',
    fallbackText: 'GR',
  },

  // =========================================================================
  // ROW 4: Web3 & Decentralized (4 package, 2 local-svg, 4 approved neutral)
  // =========================================================================
  solidity: {
    skillId: 'solidity',
    sourceType: 'package',
    packageKey: 'siSolidity',
    fallbackText: 'SO',
  },
  viem: {
    skillId: 'viem',
    sourceType: 'local-svg',
    localPath: '/assets/icons/viem.svg',
    fallbackText: 'VI',
  },
  wagmi: {
    skillId: 'wagmi',
    sourceType: 'package',
    packageKey: 'siWagmi',
    fallbackText: 'WA',
  },
  ethers: {
    skillId: 'ethers',
    sourceType: 'package',
    packageKey: 'siEthers',
    fallbackText: 'ET',
  },
  foundry: {
    skillId: 'foundry',
    sourceType: 'neutral',
    neutralReason: 'Paradigm smart contract development toolchain; no official standalone vector',
    fallbackText: 'FO',
  },
  privy: {
    skillId: 'privy',
    sourceType: 'neutral',
    neutralReason: 'Embedded authentication protocol; no standalone vector logo',
    fallbackText: 'PV',
  },
  erc4337: {
    skillId: 'erc4337',
    sourceType: 'neutral',
    neutralReason: 'Ethereum Account Abstraction standard specification (EIP-4337)',
    fallbackText: 'ER',
  },
  thegraph: {
    skillId: 'thegraph',
    sourceType: 'local-svg',
    localPath: '/assets/icons/thegraph.svg',
    fallbackText: 'TG',
  },
  ipfs: {
    skillId: 'ipfs',
    sourceType: 'package',
    packageKey: 'siIpfs',
    fallbackText: 'IP',
  },
  siwe: {
    skillId: 'siwe',
    sourceType: 'neutral',
    neutralReason: 'Sign-In with Ethereum cryptographic standard specification (EIP-4361)',
    fallbackText: 'SI',
  },

  // =========================================================================
  // ROW 5: AI Models & Inference (7 package, 3 local-svg)
  // =========================================================================
  openai: {
    skillId: 'openai',
    sourceType: 'local-svg',
    localPath: '/assets/icons/openai.svg',
    fallbackText: 'OA',
  },
  anthropic: {
    skillId: 'anthropic',
    sourceType: 'package',
    packageKey: 'siAnthropic',
    fallbackText: 'AN',
  },
  googlegemini: {
    skillId: 'googlegemini',
    sourceType: 'package',
    packageKey: 'siGooglegemini',
    fallbackText: 'GE',
  },
  deepseek: {
    skillId: 'deepseek',
    sourceType: 'package',
    packageKey: 'siDeepseek',
    fallbackText: 'DS',
  },
  qwen: {
    skillId: 'qwen',
    sourceType: 'package',
    packageKey: 'siQwen',
    fallbackText: 'QW',
  },
  vercel: {
    skillId: 'vercel',
    sourceType: 'package',
    packageKey: 'siVercel',
    fallbackText: 'VE',
  },
  ollama: {
    skillId: 'ollama',
    sourceType: 'package',
    packageKey: 'siOllama',
    fallbackText: 'OL',
  },
  huggingface: {
    skillId: 'huggingface',
    sourceType: 'package',
    packageKey: 'siHuggingface',
    fallbackText: 'HF',
  },
  groq: {
    skillId: 'groq',
    sourceType: 'local-svg',
    localPath: '/assets/icons/groq.svg',
    fallbackText: 'GQ',
  },
  togetherai: {
    skillId: 'togetherai',
    sourceType: 'local-svg',
    localPath: '/assets/icons/togetherai.svg',
    fallbackText: 'TO',
  },

  // =========================================================================
  // ROW 6: AI Agent Frameworks (5 package, 4 local-svg, 1 approved neutral)
  // =========================================================================
  langchain: {
    skillId: 'langchain',
    sourceType: 'package',
    packageKey: 'siLangchain',
    fallbackText: 'LC',
  },
  langgraph: {
    skillId: 'langgraph',
    sourceType: 'package',
    packageKey: 'siLanggraph',
    fallbackText: 'LG',
  },
  llamaindex: {
    skillId: 'llamaindex',
    sourceType: 'local-svg',
    localPath: '/assets/icons/llamaindex.svg',
    fallbackText: 'LI',
  },
  crewai: {
    skillId: 'crewai',
    sourceType: 'package',
    packageKey: 'siCrewai',
    fallbackText: 'CR',
  },
  autogen: {
    skillId: 'autogen',
    sourceType: 'local-svg',
    localPath: '/assets/icons/autogen.svg',
    fallbackText: 'AG',
  },
  dify: {
    skillId: 'dify',
    sourceType: 'package',
    packageKey: 'siDify',
    fallbackText: 'DI',
  },
  coze: {
    skillId: 'coze',
    sourceType: 'package',
    packageKey: 'siCoze',
    fallbackText: 'CZ',
  },
  semantickernel: {
    skillId: 'semantickernel',
    sourceType: 'neutral',
    neutralReason: 'Microsoft enterprise AI orchestration SDK; no standalone vector logo',
    fallbackText: 'SK',
  },
  mcp: {
    skillId: 'mcp',
    sourceType: 'local-svg',
    localPath: '/assets/icons/mcp.svg',
    fallbackText: 'MC',
  },
  haystack: {
    skillId: 'haystack',
    sourceType: 'package',
    packageKey: 'siHaystack',
    fallbackText: 'HY',
  },

  // =========================================================================
  // ROW 7: RAG & Vector Databases (3 package, 5 local-svg, 2 approved neutral)
  // =========================================================================
  pgvector: {
    skillId: 'pgvector',
    sourceType: 'neutral',
    neutralReason: 'PostgreSQL vector similarity search extension; no standalone vector logo',
    fallbackText: 'PG',
  },
  chroma: {
    skillId: 'chroma',
    sourceType: 'local-svg',
    localPath: '/assets/icons/chroma.svg',
    fallbackText: 'CH',
  },
  milvus: {
    skillId: 'milvus',
    sourceType: 'package',
    packageKey: 'siMilvus',
    fallbackText: 'MI',
  },
  weaviate: {
    skillId: 'weaviate',
    sourceType: 'local-svg',
    localPath: '/assets/icons/weaviate.svg',
    fallbackText: 'WE',
  },
  qdrant: {
    skillId: 'qdrant',
    sourceType: 'package',
    packageKey: 'siQdrant',
    fallbackText: 'QD',
  },
  pinecone: {
    skillId: 'pinecone',
    sourceType: 'local-svg',
    localPath: '/assets/icons/pinecone.svg',
    fallbackText: 'PC',
  },
  llamaparse: {
    skillId: 'llamaparse',
    sourceType: 'neutral',
    neutralReason: 'LlamaIndex proprietary document parsing engine; no standalone vector logo',
    fallbackText: 'LP',
  },
  unstructured: {
    skillId: 'unstructured',
    sourceType: 'local-svg',
    localPath: '/assets/icons/unstructured.svg',
    fallbackText: 'UN',
  },
  cohere: {
    skillId: 'cohere',
    sourceType: 'local-svg',
    localPath: '/assets/icons/cohere.svg',
    fallbackText: 'CO',
  },
  voyageai: {
    skillId: 'voyageai',
    sourceType: 'local-svg',
    localPath: '/assets/icons/voyageai.svg',
    fallbackText: 'VO',
  },

  // =========================================================================
  // ROW 8: DevOps, Testing & Observability (9 package, 1 local-svg)
  // =========================================================================
  docker: {
    skillId: 'docker',
    sourceType: 'package',
    packageKey: 'siDocker',
    fallbackText: 'DO',
  },
  kubernetes: {
    skillId: 'kubernetes',
    sourceType: 'package',
    packageKey: 'siKubernetes',
    fallbackText: 'KU',
  },
  githubactions: {
    skillId: 'githubactions',
    sourceType: 'package',
    packageKey: 'siGithubactions',
    fallbackText: 'GA',
  },
  prometheus: {
    skillId: 'prometheus',
    sourceType: 'package',
    packageKey: 'siPrometheus',
    fallbackText: 'PR',
  },
  grafana: {
    skillId: 'grafana',
    sourceType: 'package',
    packageKey: 'siGrafana',
    fallbackText: 'GF',
  },
  sentry: {
    skillId: 'sentry',
    sourceType: 'package',
    packageKey: 'siSentry',
    fallbackText: 'SE',
  },
  playwright: {
    skillId: 'playwright',
    sourceType: 'local-svg',
    localPath: '/assets/icons/playwright.svg',
    fallbackText: 'PW',
  },
  pytest: {
    skillId: 'pytest',
    sourceType: 'package',
    packageKey: 'siPytest',
    fallbackText: 'PY',
  },
  celery: {
    skillId: 'celery',
    sourceType: 'package',
    packageKey: 'siCelery',
    fallbackText: 'CE',
  },
  opentelemetry: {
    skillId: 'opentelemetry',
    sourceType: 'package',
    packageKey: 'siOpentelemetry',
    fallbackText: 'OT',
  },
};
