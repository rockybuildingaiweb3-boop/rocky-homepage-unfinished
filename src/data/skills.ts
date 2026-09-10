export interface SkillRowDefinition {
  row: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  id: string;
  title: string;
}

export interface SkillItem {
  id: string;
  name: string;
  slug: string;
  row: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
}

export const SKILL_ROWS: SkillRowDefinition[] = [
  { row: 1, id: 'frontend', title: 'Core Frontend & Interaction' },
  { row: 2, id: 'graphics', title: '3D & Graphics' },
  { row: 3, id: 'infrastructure', title: 'Backend, Data & Infrastructure' },
  { row: 4, id: 'web3', title: 'Web3 & Decentralized' },
  { row: 5, id: 'models', title: 'AI Models & SDKs' },
  { row: 6, id: 'agents', title: 'AI Agent Frameworks' },
  { row: 7, id: 'rag', title: 'RAG & Vector Databases' },
  { row: 8, id: 'engineering', title: 'DevOps, Testing & Observability' },
];

export const SKILLS_DATA: SkillItem[] = [
  // Row 1 — Core Frontend & Interaction
  { id: 'typescript', name: 'TypeScript', slug: 'typescript', row: 1 },
  { id: 'javascript', name: 'JavaScript', slug: 'javascript', row: 1 },
  { id: 'react', name: 'React', slug: 'react', row: 1 },
  { id: 'nextjs', name: 'Next.js', slug: 'nextjs', row: 1 },
  { id: 'svelte', name: 'Svelte', slug: 'svelte', row: 1 },
  { id: 'tailwindcss', name: 'Tailwind CSS', slug: 'tailwindcss', row: 1 },
  { id: 'framer-motion', name: 'Framer Motion', slug: 'framer-motion', row: 1 },
  { id: 'gsap', name: 'GSAP', slug: 'gsap', row: 1 },
  { id: 'html5', name: 'HTML5', slug: 'html5', row: 1 },
  { id: 'vite', name: 'Vite', slug: 'vite', row: 1 },

  // Row 2 — 3D & Graphics
  { id: 'threejs', name: 'Three.js', slug: 'threejs', row: 2 },
  { id: 'webgl', name: 'WebGL', slug: 'webgl', row: 2 },
  { id: 'glsl', name: 'GLSL', slug: 'glsl', row: 2 },
  { id: 'webgpu', name: 'WebGPU', slug: 'webgpu', row: 2 },
  { id: 'react-three-fiber', name: 'React Three Fiber', slug: 'react-three-fiber', row: 2 },
  { id: 'blender', name: 'Blender', slug: 'blender', row: 2 },
  { id: 'spline', name: 'Spline', slug: 'spline', row: 2 },
  { id: 'draco', name: 'Draco', slug: 'draco', row: 2 },
  { id: 'canvas-api', name: 'Canvas API', slug: 'canvas-api', row: 2 },
  { id: 'babylonjs', name: 'Babylon.js', slug: 'babylonjs', row: 2 },

  // Row 3 — Backend, Data & Infrastructure
  { id: 'nodejs', name: 'Node.js', slug: 'nodejs', row: 3 },
  { id: 'express', name: 'Express', slug: 'express', row: 3 },
  { id: 'fastapi', name: 'FastAPI', slug: 'fastapi', row: 3 },
  { id: 'postgresql', name: 'PostgreSQL', slug: 'postgresql', row: 3 },
  { id: 'supabase', name: 'Supabase', slug: 'supabase', row: 3 },
  { id: 'prisma', name: 'Prisma', slug: 'prisma', row: 3 },
  { id: 'drizzle', name: 'Drizzle', slug: 'drizzle', row: 3 },
  { id: 'redis', name: 'Redis', slug: 'redis', row: 3 },
  { id: 'trpc', name: 'tRPC', slug: 'trpc', row: 3 },
  { id: 'graphql', name: 'GraphQL', slug: 'graphql', row: 3 },

  // Row 4 — Web3 & Decentralized
  { id: 'solidity', name: 'Solidity', slug: 'solidity', row: 4 },
  { id: 'viem', name: 'viem', slug: 'viem', row: 4 },
  { id: 'wagmi', name: 'wagmi', slug: 'wagmi', row: 4 },
  { id: 'ethersjs', name: 'Ethers.js', slug: 'ethersjs', row: 4 },
  { id: 'foundry', name: 'Foundry', slug: 'foundry', row: 4 },
  { id: 'privy', name: 'Privy', slug: 'privy', row: 4 },
  { id: 'erc-4337', name: 'ERC-4337', slug: 'erc-4337', row: 4 },
  { id: 'the-graph', name: 'The Graph', slug: 'the-graph', row: 4 },
  { id: 'ipfs', name: 'IPFS', slug: 'ipfs', row: 4 },
  { id: 'siwe', name: 'SIWE', slug: 'siwe', row: 4 },

  // Row 5 — AI Models & SDKs
  { id: 'openai', name: 'OpenAI', slug: 'openai', row: 5 },
  { id: 'anthropic', name: 'Anthropic', slug: 'anthropic', row: 5 },
  { id: 'google-gemini', name: 'Google Gemini', slug: 'google-gemini', row: 5 },
  { id: 'deepseek', name: 'DeepSeek', slug: 'deepseek', row: 5 },
  { id: 'qwen', name: 'Qwen', slug: 'qwen', row: 5 },
  { id: 'vercel-ai-sdk', name: 'Vercel AI SDK', slug: 'vercel-ai-sdk', row: 5 },
  { id: 'ollama', name: 'Ollama', slug: 'ollama', row: 5 },
  { id: 'hugging-face', name: 'Hugging Face', slug: 'hugging-face', row: 5 },
  { id: 'groq', name: 'Groq', slug: 'groq', row: 5 },
  { id: 'together-ai', name: 'Together AI', slug: 'together-ai', row: 5 },

  // Row 6 — AI Agent Frameworks
  { id: 'langchain', name: 'LangChain', slug: 'langchain', row: 6 },
  { id: 'langgraph', name: 'LangGraph', slug: 'langgraph', row: 6 },
  { id: 'llamaindex', name: 'LlamaIndex', slug: 'llamaindex', row: 6 },
  { id: 'crewai', name: 'CrewAI', slug: 'crewai', row: 6 },
  { id: 'autogen', name: 'AutoGen', slug: 'autogen', row: 6 },
  { id: 'dify', name: 'Dify', slug: 'dify', row: 6 },
  { id: 'coze', name: 'Coze', slug: 'coze', row: 6 },
  { id: 'semantic-kernel', name: 'Semantic Kernel', slug: 'semantic-kernel', row: 6 },
  { id: 'mcp', name: 'MCP', slug: 'mcp', row: 6 },
  { id: 'haystack', name: 'Haystack', slug: 'haystack', row: 6 },

  // Row 7 — RAG & Vector Databases
  { id: 'pgvector', name: 'pgvector', slug: 'pgvector', row: 7 },
  { id: 'chroma', name: 'Chroma', slug: 'chroma', row: 7 },
  { id: 'milvus', name: 'Milvus', slug: 'milvus', row: 7 },
  { id: 'weaviate', name: 'Weaviate', slug: 'weaviate', row: 7 },
  { id: 'qdrant', name: 'Qdrant', slug: 'qdrant', row: 7 },
  { id: 'pinecone', name: 'Pinecone', slug: 'pinecone', row: 7 },
  { id: 'llamaparse', name: 'LlamaParse', slug: 'llamaparse', row: 7 },
  { id: 'unstructured', name: 'Unstructured', slug: 'unstructured', row: 7 },
  { id: 'cohere', name: 'Cohere', slug: 'cohere', row: 7 },
  { id: 'voyage-ai', name: 'Voyage AI', slug: 'voyage-ai', row: 7 },

  // Row 8 — DevOps, Testing & Observability
  { id: 'docker', name: 'Docker', slug: 'docker', row: 8 },
  { id: 'kubernetes', name: 'Kubernetes', slug: 'kubernetes', row: 8 },
  { id: 'github-actions', name: 'GitHub Actions', slug: 'github-actions', row: 8 },
  { id: 'prometheus', name: 'Prometheus', slug: 'prometheus', row: 8 },
  { id: 'grafana', name: 'Grafana', slug: 'grafana', row: 8 },
  { id: 'sentry', name: 'Sentry', slug: 'sentry', row: 8 },
  { id: 'playwright', name: 'Playwright', slug: 'playwright', row: 8 },
  { id: 'pytest', name: 'Pytest', slug: 'pytest', row: 8 },
  { id: 'celery', name: 'Celery', slug: 'celery', row: 8 },
  { id: 'opentelemetry', name: 'OpenTelemetry', slug: 'opentelemetry', row: 8 },
];

export const SKILLS_BY_ROW: Record<number, SkillItem[]> = Object.fromEntries(
  SKILL_ROWS.map((row) => [row.row, SKILLS_DATA.filter((skill) => skill.row === row.row)])
);
