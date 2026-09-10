import * as si from 'simple-icons';
import type { SimpleIcon } from 'simple-icons';

export type ResolvedIcon =
  | { kind: 'svg-path'; path: string; hex: string; title: string }
  | { kind: 'local-svg'; url: string; title: string }
  | { kind: 'unbranded'; title: string };

const VERIFIED_LOCAL_SVGS: Record<string, { url: string; title: string }> = {};

const SIMPLE_ICONS_MAP: Record<string, SimpleIcon> = {
  typescript: si.siTypescript,
  javascript: si.siJavascript,
  react: si.siReact,
  nextjs: si.siNextdotjs,
  svelte: si.siSvelte,
  tailwindcss: si.siTailwindcss,
  'framer-motion': si.siFramer,
  gsap: si.siGreensock,
  html5: si.siHtml5,
  vite: si.siVite,
  threejs: si.siThreedotjs,
  webgl: si.siWebgl,
  webgpu: si.siWebgpu,
  blender: si.siBlender,
  babylonjs: si.siBabylondotjs,
  nodejs: si.siNodedotjs,
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
  ethersjs: si.siEthers,
  ipfs: si.siIpfs,
  anthropic: si.siAnthropic,
  'google-gemini': si.siGooglegemini,
  deepseek: si.siDeepseek,
  qwen: si.siQwen,
  'vercel-ai-sdk': si.siVercel,
  ollama: si.siOllama,
  'hugging-face': si.siHuggingface,
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
  'github-actions': si.siGithubactions,
  prometheus: si.siPrometheus,
  grafana: si.siGrafana,
  sentry: si.siSentry,
  pytest: si.siPytest,
  celery: si.siCelery,
  opentelemetry: si.siOpentelemetry,
};

const UNBRANDED: Record<string, string> = {
  glsl: 'GLSL',
  'react-three-fiber': 'React Three Fiber',
  spline: 'Spline',
  draco: 'Draco',
  'canvas-api': 'Canvas API',
  foundry: 'Foundry',
  privy: 'Privy',
  'erc-4337': 'ERC-4337',
  'the-graph': 'The Graph',
  siwe: 'SIWE',
  'semantic-kernel': 'Semantic Kernel',
  pgvector: 'pgvector',
  llamaparse: 'LlamaParse',
};

export function resolveSkillIcon(skillId: string, slug?: string, name?: string): ResolvedIcon {
  const normalized = (slug || skillId || '').toLowerCase().trim();
  const title = name || UNBRANDED[normalized] || normalized;

  const local = VERIFIED_LOCAL_SVGS[normalized];
  if (local) return { kind: 'local-svg', url: local.url, title: local.title };

  const icon = SIMPLE_ICONS_MAP[normalized];
  if (icon) return { kind: 'svg-path', path: icon.path, hex: icon.hex, title: icon.title };

  return { kind: 'unbranded', title };
}
