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
  siOpengl,
  siWebgpu,
  siBlender,
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
  siEthereum,
  siIpfs,
  siAnthropic,
  siGooglegemini,
  siDeepseek,
  siQwen,
  siVercel,
  siLangchain,
  siCrewai,
  siDify,
  siCoze,
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
  siPython,
  siRust,
  siGo,
  siGit,
  siLinux,
  siNginx,
  siMongodb,
  siElasticsearch,
  siApachekafka,
  siRabbitmq,
  siNeo4j,
  siSqlite,
  siWeb3dotjs,
} from 'simple-icons';

export interface SimpleIconData {
  title: string;
  slug: string;
  path: string;
  hex: string;
}

export interface ResolvedIcon {
  kind: 'svg-path' | 'local-svg' | 'fallback';
  path?: string;
  hex?: string;
  title?: string;
  url?: string;
  fallbackText: string;
}

/**
 * Local registry of verified vector brand icons from official simple-icons npm package.
 * Decouples icon resolution from UI presentation and eliminates flaky external CDN dependencies.
 */
const VERIFIED_SIMPLE_ICONS: Record<string, SimpleIconData> = {
  typescript: siTypescript,
  javascript: siJavascript,
  react: siReact,
  nextdotjs: siNextdotjs,
  nextjs: siNextdotjs,
  svelte: siSvelte,
  tailwindcss: siTailwindcss,
  framer: siFramer,
  greensock: siGreensock,
  gsap: siGreensock,
  html5: siHtml5,
  vite: siVite,
  threedotjs: siThreedotjs,
  threejs: siThreedotjs,
  webgl: siWebgl,
  opengl: siOpengl,
  webgpu: siWebgpu,
  blender: siBlender,
  nodedotjs: siNodedotjs,
  nodejs: siNodedotjs,
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
  ethereum: siEthereum,
  ipfs: siIpfs,
  anthropic: siAnthropic,
  claude: siAnthropic,
  googlegemini: siGooglegemini,
  gemini: siGooglegemini,
  deepseek: siDeepseek,
  qwen: siQwen,
  vercel: siVercel,
  langchain: siLangchain,
  crewai: siCrewai,
  dify: siDify,
  coze: siCoze,
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
  python: siPython,
  rust: siRust,
  go: siGo,
  golang: siGo,
  git: siGit,
  linux: siLinux,
  nginx: siNginx,
  mongodb: siMongodb,
  elasticsearch: siElasticsearch,
  apachekafka: siApachekafka,
  kafka: siApachekafka,
  rabbitmq: siRabbitmq,
  neo4j: siNeo4j,
  sqlite: siSqlite,
  web3dotjs: siWeb3dotjs,
  web3: siWeb3dotjs,
};

/**
 * Local verified SVG assets located in /public/assets/icons/
 */
const LOCAL_SVG_ASSETS: Record<string, string> = {
  openai: '/assets/icons/openai.svg',
  chatgpt: '/assets/icons/openai.svg',
  rag: '/assets/icons/rag.svg',
  embeddingmodels: '/assets/icons/rag.svg',
  agentic: '/assets/icons/agentic.svg',
  mcp: '/assets/icons/agentic.svg',
};

/**
 * Cleanly resolves an icon source:
 * 1. Local verified SVG asset (if available in /public/assets/icons/)
 * 2. Official vector definition from simple-icons package
 * 3. Controlled fallback (standardized 2-letter uppercase monogram) for conceptual skills without brand logos
 */
export function resolveSkillIcon(
  id: string,
  slug?: string,
  name?: string
): ResolvedIcon {
  const cleanId = (id || '').toLowerCase().trim();
  const cleanSlug = (slug || cleanId).toLowerCase().trim();
  const rawFallback = (name || id || slug || 'SK').replace(/[^a-zA-Z0-9]/g, '');
  const fallbackText = (rawFallback.length >= 2 ? rawFallback.slice(0, 2) : rawFallback.padEnd(2, 'X')).toUpperCase();

  // 1. Check local verified SVG assets
  const localUrl = LOCAL_SVG_ASSETS[cleanId] || LOCAL_SVG_ASSETS[cleanSlug];
  if (localUrl) {
    return {
      kind: 'local-svg',
      url: localUrl,
      title: name || id,
      fallbackText,
    };
  }

  // 2. Check official simple-icons package definitions
  const simpleIcon = VERIFIED_SIMPLE_ICONS[cleanSlug] || VERIFIED_SIMPLE_ICONS[cleanId];
  if (simpleIcon) {
    return {
      kind: 'svg-path',
      path: simpleIcon.path,
      hex: simpleIcon.hex,
      title: simpleIcon.title,
      fallbackText,
    };
  }

  // 3. Controlled fallback for conceptual/unbranded skills
  return {
    kind: 'fallback',
    title: name || id,
    fallbackText,
  };
}

export interface IconValidationResult {
  valid: boolean;
  kind: 'svg-path' | 'local-svg' | 'fallback';
  error?: string;
}

/**
 * Diagnostic validator to verify that an icon identifier resolves properly
 * and does not produce broken paths or missing assets.
 */
export function validateSkillIcon(
  id: string,
  slug?: string,
  name?: string
): IconValidationResult {
  if (!id) {
    return { valid: false, kind: 'fallback', error: 'Skill id is required' };
  }
  const resolved = resolveSkillIcon(id, slug, name);
  if (resolved.kind === 'svg-path') {
    if (!resolved.path || resolved.path.length < 10) {
      return { valid: false, kind: resolved.kind, error: 'Empty or invalid SVG path' };
    }
    return { valid: true, kind: resolved.kind };
  }
  if (resolved.kind === 'local-svg') {
    if (!resolved.url) {
      return { valid: false, kind: resolved.kind, error: 'Missing local SVG url' };
    }
    return { valid: true, kind: resolved.kind };
  }
  if (resolved.kind === 'fallback') {
    if (!resolved.fallbackText || resolved.fallbackText.length < 2) {
      return { valid: false, kind: resolved.kind, error: 'Invalid fallback text monogram' };
    }
    return { valid: true, kind: resolved.kind };
  }
  return { valid: false, kind: 'fallback', error: 'Unrecognized resolution kind' };
}
