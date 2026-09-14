/**
 * AUTHORITATIVE SKILL RELATIONSHIPS, TIERS & TELEMETRY KNOWLEDGE GRAPH
 * 
 * Defines:
 * 1. Three-Tier Architectural Hierarchy:
 *    - Tier 1: Core engineering identity (large, prominent ambient aura, planet anchor)
 *    - Tier 2: Professional production tools (standard scale, balanced resonance)
 *    - Tier 3: Supporting ecosystem (compact, quiet precision)
 * 2. Cross-Disciplinary Semantic Knowledge Links:
 *    - Bidirectional and contextual relationships across the 88 instruments
 * 3. Editorial Telemetry Philosophy Quotes:
 *    - Futuristic system interface copy for the HUD telemetry layer
 */

import { SkillTier, SKILLS_DATA } from '../../data/skills';
export type { SkillTier };

export interface SkillKnowledgeMeta {
  tier: SkillTier;
  editorialSummary: string;
  relatedIds: string[];
}

export const SKILL_KNOWLEDGE_MAP: Record<string, SkillKnowledgeMeta> = {
  // ─── 01: CORE FRONTEND & INTERACTION ───
  'typescript': {
    tier: 'core',
    editorialSummary: 'Structural type soundness transforms refactoring from an anxiety-driven gamble into a deterministic mathematical operation.',
    relatedIds: ['javascript', 'react', 'nextdotjs', 'trpc', 'prisma', 'nodedotjs', 'viem'],
  },
  'javascript': {
    tier: 'professional',
    editorialSummary: "Beyond syntax, mastering V8's hidden classes and the event loop queue separates surface scripting from high-performance systems engineering.",
    relatedIds: ['typescript', 'html5', 'nodedotjs', 'react', 'vite'],
  },
  'react': {
    tier: 'core',
    editorialSummary: 'A deterministic state machine for controlling how interfaces evolve over time through immutable reactive reconciliation.',
    relatedIds: ['nextdotjs', 'typescript', 'tailwindcss', 'framer', 'r3f', 'wagmi'],
  },
  'nextdotjs': {
    tier: 'core',
    editorialSummary: 'Streaming server components and granular edge revalidation deliver native-feeling instantaneous loads at global scale.',
    relatedIds: ['react', 'typescript', 'tailwindcss', 'vercel', 'trpc', 'nodedotjs'],
  },
  'svelte': {
    tier: 'professional',
    editorialSummary: 'Compile-time reactivity shifts runtime DOM overhead into zero-cost surgical mutations.',
    relatedIds: ['typescript', 'javascript', 'html5', 'vite'],
  },
  'tailwindcss': {
    tier: 'professional',
    editorialSummary: 'Design-system consistency enforced through utility constraints without context-switching stylesheets.',
    relatedIds: ['react', 'nextdotjs', 'html5', 'framer'],
  },
  'framer': {
    tier: 'professional',
    editorialSummary: 'Physics-based spring dynamics that elevate micro-interactions into tactile digital artifacts.',
    relatedIds: ['react', 'tailwindcss', 'greensock', 'rive'],
  },
  'greensock': {
    tier: 'professional',
    editorialSummary: 'Sub-pixel timeline choreography with bulletproof cross-browser scroll acceleration.',
    relatedIds: ['framer', 'threedotjs', 'canvasapi', 'javascript'],
  },
  'html5': {
    tier: 'professional',
    editorialSummary: 'Semantic document topology and accessibility primitives underpinning modern web architecture.',
    relatedIds: ['javascript', 'typescript', 'tailwindcss', 'canvasapi'],
  },
  'vite': {
    tier: 'professional',
    editorialSummary: 'Native ESM dev servers with lightning-fast Hot Module Replacement and Rollup production pipelines.',
    relatedIds: ['typescript', 'react', 'svelte', 'nodedotjs'],
  },
  'rive': {
    tier: 'ecosystem',
    editorialSummary: 'Interactive vector runtime state machines delivering 120fps procedural game and UI animations.',
    relatedIds: ['framer', 'greensock', 'canvasapi', 'spline'],
  },

  // ─── 02: 3D & GRAPHICS ───
  'threedotjs': {
    tier: 'core',
    editorialSummary: 'The declarative bridge between scene graph hierarchies and hardware-accelerated WebGL pipelines.',
    relatedIds: ['webgl', 'glsl', 'r3f', 'webgpu', 'blender', 'spline'],
  },
  'webgl': {
    tier: 'core',
    editorialSummary: 'Direct GPU rasterization pipelines turning mathematical vector algebra into real-time screen pixels.',
    relatedIds: ['threedotjs', 'glsl', 'webgpu', 'r3f', 'canvasapi'],
  },
  'glsl': {
    tier: 'professional',
    editorialSummary: 'Embarrassingly parallel shader code executed concurrently across thousands of GPU cores.',
    relatedIds: ['webgl', 'threedotjs', 'webgpu', 'r3f'],
  },
  'webgpu': {
    tier: 'professional',
    editorialSummary: 'Modern low-overhead GPU compute and rendering API bypassing driver CPU bottlenecks.',
    relatedIds: ['webgl', 'threedotjs', 'glsl'],
  },
  'r3f': {
    tier: 'professional',
    editorialSummary: 'React ecosystem declarative state semantics applied seamlessly to complex Three.js render loops.',
    relatedIds: ['threedotjs', 'react', 'webgl', 'glsl', 'draco'],
  },
  'blender': {
    tier: 'professional',
    editorialSummary: 'Poly-modeling, topology retopology, UV unwrapping, and asset optimization for web engines.',
    relatedIds: ['threedotjs', 'draco', 'spline', 'unity'],
  },
  'spline': {
    tier: 'ecosystem',
    editorialSummary: 'Real-time collaborative 3D scene sculpting with lightweight web-embeddable physics simulations.',
    relatedIds: ['threedotjs', 'blender', 'rive', 'framer'],
  },
  'draco': {
    tier: 'ecosystem',
    editorialSummary: 'High-ratio geometric 3D mesh compression minimizing network payload latency for dense assets.',
    relatedIds: ['threedotjs', 'r3f', 'blender'],
  },
  'canvasapi': {
    tier: 'professional',
    editorialSummary: 'Immediate-mode 2D bitmap rendering surface for particle systems, charts, and image manipulation.',
    relatedIds: ['webgl', 'javascript', 'html5', 'greensock'],
  },
  'babylondotjs': {
    tier: 'ecosystem',
    editorialSummary: 'Comprehensive 3D web game engine with integrated Havok physics and PBR material pipelines.',
    relatedIds: ['threedotjs', 'webgl', 'webgpu', 'unity'],
  },
  'unity': {
    tier: 'professional',
    editorialSummary: 'Multiplatform real-time 3D engine powering spatial computing, VR, and cross-platform games.',
    relatedIds: ['threedotjs', 'blender', 'babylondotjs'],
  },

  // ─── 03: BACKEND & API FRAMEWORKS ───
  'nodedotjs': {
    tier: 'core',
    editorialSummary: 'Single-threaded non-blocking asynchronous event loop architecture powering modern API services.',
    relatedIds: ['express', 'typescript', 'fastapi', 'prisma', 'nginx'],
  },
  'express': {
    tier: 'professional',
    editorialSummary: 'Minimalist, unopinionated HTTP middleware routing pipeline with proven production reliability.',
    relatedIds: ['nodedotjs', 'typescript', 'trpc', 'nginx'],
  },
  'fastapi': {
    tier: 'core',
    editorialSummary: 'High-throughput asynchronous Python framework with automated OpenAPI validation via Pydantic.',
    relatedIds: ['pydantic', 'postgresql', 'celery', 'redis', 'docker', 'qdrant'],
  },
  'flask': {
    tier: 'ecosystem',
    editorialSummary: 'Micro-framework versatility for rapid ML inference prototyping and lightweight web services.',
    relatedIds: ['fastapi', 'pydantic', 'celery'],
  },
  'springboot': {
    tier: 'professional',
    editorialSummary: 'Enterprise-grade dependency injection, transactional guarantees, and battle-tested JVM stability.',
    relatedIds: ['postgresql', 'mysql', 'docker', 'kafka'],
  },
  'prisma': {
    tier: 'professional',
    editorialSummary: 'End-to-end type-safe ORM generating pristine TypeScript definitions from declarative schemas.',
    relatedIds: ['postgresql', 'mysql', 'typescript', 'drizzle', 'trpc'],
  },
  'drizzle': {
    tier: 'professional',
    editorialSummary: 'Zero-overhead TypeScript SQL dialect mapping directly to native relational query plans.',
    relatedIds: ['postgresql', 'mysql', 'prisma', 'typescript', 'supabase'],
  },
  'trpc': {
    tier: 'professional',
    editorialSummary: 'End-to-end typesafe client-server communication eliminating API code generation steps.',
    relatedIds: ['typescript', 'react', 'nextdotjs', 'prisma'],
  },
  'graphql': {
    tier: 'core',
    editorialSummary: 'Declarative data fetching query language preventing client over-fetching and under-fetching.',
    relatedIds: ['typescript', 'nodedotjs', 'thegraph', 'postgresql'],
  },
  'pydantic': {
    tier: 'professional',
    editorialSummary: 'Rust-accelerated Python data parsing, serialization, and strict runtime type enforcement.',
    relatedIds: ['fastapi', 'langchain', 'llamaindex', 'openai'],
  },
  'nginx': {
    tier: 'professional',
    editorialSummary: 'High-concurrency reverse proxy, SSL termination, and static asset delivery workhorse.',
    relatedIds: ['docker', 'linux', 'nodedotjs', 'express'],
  },

  // ─── 04: DATA, STORAGE & QUEUES ───
  'postgresql': {
    tier: 'core',
    editorialSummary: 'The ACID foundation of enterprise persistence, supporting relational schemas, JSONB, and vector indexes.',
    relatedIds: ['pgvector', 'prisma', 'drizzle', 'supabase', 'redis', 'nodedotjs', 'fastapi'],
  },
  'mysql': {
    tier: 'professional',
    editorialSummary: 'Proven transactional relational storage powering high-volume web application workloads.',
    relatedIds: ['postgresql', 'prisma', 'drizzle', 'redis'],
  },
  'supabase': {
    tier: 'professional',
    editorialSummary: 'Instant Postgres with Row Level Security, auto-generated REST/GraphQL APIs, and real-time streams.',
    relatedIds: ['postgresql', 'pgvector', 'typescript', 'redis'],
  },
  'redis': {
    tier: 'core',
    editorialSummary: 'Sub-millisecond in-memory key-value data structure store for caching, pub/sub, and distributed locks.',
    relatedIds: ['celery', 'rabbitmq', 'postgresql', 'nodedotjs', 'fastapi'],
  },
  'rabbitmq': {
    tier: 'professional',
    editorialSummary: 'Robust AMQP message broker ensuring reliable asynchronous message delivery and routing topology.',
    relatedIds: ['celery', 'redis', 'kafka', 'docker'],
  },
  'celery': {
    tier: 'ecosystem',
    editorialSummary: 'Distributed task queue orchestrating long-running Python background jobs and scheduled tasks.',
    relatedIds: ['redis', 'rabbitmq', 'fastapi', 'flask'],
  },
  'kafka': {
    tier: 'professional',
    editorialSummary: 'Distributed append-only commit log capable of processing millions of streaming events per second.',
    relatedIds: ['rabbitmq', 'kubernetes', 'docker', 'postgresql'],
  },
  'docker': {
    tier: 'core',
    editorialSummary: 'Containerization isolating application runtime dependencies into immutable, portable artifacts.',
    relatedIds: ['kubernetes', 'linux', 'nginx', 'redis', 'postgresql'],
  },
  'kubernetes': {
    tier: 'core',
    editorialSummary: 'Declarative container orchestration managing automated rollouts, scaling, and self-healing clusters.',
    relatedIds: ['docker', 'linux', 'prometheus', 'grafana'],
  },
  'linux': {
    tier: 'professional',
    editorialSummary: 'The operational bedrock of cloud computing, POSIX primitives, and kernel network namespaces.',
    relatedIds: ['docker', 'kubernetes', 'nginx', 'git'],
  },
  'git': {
    tier: 'professional',
    editorialSummary: 'Cryptographic directed acyclic graph tracking source control changes and collaborative history.',
    relatedIds: ['linux', 'docker'],
  },

  // ─── 05: WEB3 & DECENTRALIZED ───
  'solidity': {
    tier: 'core',
    editorialSummary: 'Deterministic EVM smart contract logic enforcing trustless, decentralized economic invariants.',
    relatedIds: ['viem', 'wagmi', 'ethers', 'foundry', 'hardhat', 'erc4337', 'thegraph'],
  },
  'viem': {
    tier: 'professional',
    editorialSummary: 'Ultra-lightweight, modular TypeScript interface for Ethereum with optimized ABI decoding.',
    relatedIds: ['solidity', 'wagmi', 'ethers', 'typescript', 'privy'],
  },
  'wagmi': {
    tier: 'professional',
    editorialSummary: 'Reactive React hooks library simplifying multi-wallet connections and on-chain contract state.',
    relatedIds: ['viem', 'react', 'solidity', 'privy', 'siwe'],
  },
  'ethers': {
    tier: 'professional',
    editorialSummary: 'Complete and compact library for interacting with the Ethereum blockchain ecosystem and crypto wallets.',
    relatedIds: ['solidity', 'viem', 'wagmi', 'hardhat'],
  },
  'foundry': {
    tier: 'professional',
    editorialSummary: 'Blazing fast, portable Solidity development toolkit with native fuzzing and bytecode-level testing.',
    relatedIds: ['solidity', 'hardhat', 'viem'],
  },
  'privy': {
    tier: 'ecosystem',
    editorialSummary: 'Seamless user onboarding infrastructure pairing embedded self-custodial wallets with social auth.',
    relatedIds: ['wagmi', 'viem', 'erc4337', 'siwe'],
  },
  'erc4337': {
    tier: 'professional',
    editorialSummary: 'Account abstraction standard enabling programmable smart accounts, gas sponsorship, and session keys.',
    relatedIds: ['solidity', 'privy', 'viem', 'wagmi'],
  },
  'thegraph': {
    tier: 'professional',
    editorialSummary: 'Decentralized indexing protocol organizing blockchain data for instant GraphQL querying.',
    relatedIds: ['graphql', 'solidity', 'viem', 'ipfs'],
  },
  'ipfs': {
    tier: 'professional',
    editorialSummary: 'Content-addressed, peer-to-peer hypermedia protocol for tamper-proof decentralized data storage.',
    relatedIds: ['thegraph', 'solidity'],
  },
  'siwe': {
    tier: 'ecosystem',
    editorialSummary: 'Sign-In with Ethereum protocol establishing cryptographic authentication via Ethereum accounts.',
    relatedIds: ['wagmi', 'privy', 'viem', 'solidity'],
  },
  'hardhat': {
    tier: 'ecosystem',
    editorialSummary: 'Flexible Ethereum development environment for compiling, debugging, and deploying smart contracts.',
    relatedIds: ['solidity', 'foundry', 'ethers'],
  },

  // ─── 06: AI MODELS & SDKS ───
  'openai': {
    tier: 'core',
    editorialSummary: 'Large language models are not APIs. They are reasoning engines that synthesize intelligence.',
    relatedIds: ['langchain', 'langgraph', 'llamaindex', 'anthropic', 'pinecone', 'pgvector', 'chroma', 'vercel'],
  },
  'anthropic': {
    tier: 'core',
    editorialSummary: 'Frontier constitutional reasoning models with industry-leading steerability and nuance.',
    relatedIds: ['openai', 'googlegemini', 'langchain', 'langgraph', 'llamaindex'],
  },
  'googlegemini': {
    tier: 'core',
    editorialSummary: 'Native multimodal foundation models capable of reasoning across text, code, audio, and video.',
    relatedIds: ['openai', 'anthropic', 'langchain', 'llamaindex'],
  },
  'deepseek': {
    tier: 'professional',
    editorialSummary: 'Architectural breakthroughs in Mixture of Experts (MoE) and Multi-Head Latent Attention (MLA).',
    relatedIds: ['openai', 'qwen', 'ollama', 'huggingface'],
  },
  'qwen': {
    tier: 'professional',
    editorialSummary: 'Open-weights frontier reasoning models excelling at multilingual synthesis, math, and code generation.',
    relatedIds: ['deepseek', 'ollama', 'huggingface', 'togetherai'],
  },
  'vercel': {
    tier: 'professional',
    editorialSummary: 'Unified TypeScript streaming SDK connecting UI components directly to language model outputs.',
    relatedIds: ['openai', 'anthropic', 'react', 'nextdotjs', 'langchain'],
  },
  'ollama': {
    tier: 'professional',
    editorialSummary: 'Lightweight, private local LLM runner orchestrating quantized open weights on personal hardware.',
    relatedIds: ['huggingface', 'deepseek', 'qwen', 'docker', 'langchain'],
  },
  'huggingface': {
    tier: 'core',
    editorialSummary: 'The open-source nexus for foundation model weights, datasets, tokenizers, and machine learning research.',
    relatedIds: ['ollama', 'deepseek', 'togetherai', 'qwen'],
  },
  'groq': {
    tier: 'professional',
    editorialSummary: 'LPU Inference Engine architecture delivering hundreds of tokens per second with near-instant TTFT.',
    relatedIds: ['openai', 'togetherai', 'langchain'],
  },
  'togetherai': {
    tier: 'ecosystem',
    editorialSummary: 'Cloud inference platform running open-source models with dedicated high-throughput endpoints.',
    relatedIds: ['huggingface', 'qwen', 'groq', 'cohere'],
  },
  'cohere': {
    tier: 'ecosystem',
    editorialSummary: 'Enterprise-tuned language models and rerankers specializing in dense semantic search retrieval.',
    relatedIds: ['pinecone', 'qdrant', 'llamaindex', 'langchain'],
  },

  // ─── 07: AI AGENT & ORCHESTRATION ───
  'langchain': {
    tier: 'core',
    editorialSummary: 'Composable modular abstraction layer for chaining model prompts, tools, memory, and vector stores.',
    relatedIds: ['langgraph', 'langsmith', 'openai', 'anthropic', 'llamaindex', 'chroma', 'pinecone', 'pgvector'],
  },
  'langgraph': {
    tier: 'core',
    editorialSummary: 'Cyclic stateful multi-agent graphs with built-in persistence, human-in-the-loop, and fault tolerance.',
    relatedIds: ['langchain', 'langsmith', 'crewai', 'autogen', 'openai', 'mcp'],
  },
  'llamaindex': {
    tier: 'core',
    editorialSummary: 'Context orchestration framework turning disparate data sources into LLM-queryable semantic knowledge.',
    relatedIds: ['llamaparse', 'langchain', 'openai', 'chroma', 'qdrant', 'weaviate', 'pinecone'],
  },
  'crewai': {
    tier: 'professional',
    editorialSummary: 'Role-playing multi-agent architecture orchestrating collaborative autonomous agent task hierarchies.',
    relatedIds: ['langgraph', 'autogen', 'langchain', 'openai'],
  },
  'autogen': {
    tier: 'professional',
    editorialSummary: 'Conversational agent framework coordinating multi-agent problem solving through dialog turns.',
    relatedIds: ['crewai', 'langgraph', 'semantickernel', 'openai'],
  },
  'dify': {
    tier: 'professional',
    editorialSummary: 'Visual LLM app orchestrator combining prompt IDE, RAG pipelines, and agent workflows.',
    relatedIds: ['coze', 'langchain', 'openai'],
  },
  'coze': {
    tier: 'ecosystem',
    editorialSummary: 'All-in-one AI bot development platform with plugin marketplaces and automated messaging integrations.',
    relatedIds: ['dify', 'openai'],
  },
  'semantickernel': {
    tier: 'professional',
    editorialSummary: 'Enterprise SDK integrating LLMs with native C#/Python/Java functions using memory connectors.',
    relatedIds: ['langchain', 'autogen', 'mcp'],
  },
  'mcp': {
    tier: 'core',
    editorialSummary: 'Open protocol standardizing how AI models safely discover and invoke contextual tools and data.',
    relatedIds: ['langchain', 'langgraph', 'openai', 'anthropic'],
  },
  'haystack': {
    tier: 'ecosystem',
    editorialSummary: 'End-to-end framework for building custom NLP search pipelines, question answering, and RAG.',
    relatedIds: ['langchain', 'llamaindex', 'weaviate'],
  },
  'langsmith': {
    tier: 'professional',
    editorialSummary: 'Full-lifecycle LLM observability platform for tracing agent execution, evaluating prompts, and debugging.',
    relatedIds: ['langchain', 'langgraph', 'sentry'],
  },

  // ─── 08: RAG, VECTOR & OBSERVABILITY ───
  'pgvector': {
    tier: 'core',
    editorialSummary: 'Open-source vector similarity search directly inside PostgreSQL using HNSW and IVFFlat indexing.',
    relatedIds: ['postgresql', 'langchain', 'llamaindex', 'prisma', 'openai', 'supabase'],
  },
  'chroma': {
    tier: 'professional',
    editorialSummary: 'AI-native open-source embedding database designed for developer velocity and local prototyping.',
    relatedIds: ['langchain', 'llamaindex', 'openai', 'pinecone'],
  },
  'milvus': {
    tier: 'professional',
    editorialSummary: 'Cloud-native vector database built for massive-scale nearest neighbor search across billions of vectors.',
    relatedIds: ['weaviate', 'qdrant', 'pinecone', 'kubernetes'],
  },
  'weaviate': {
    tier: 'professional',
    editorialSummary: 'Open-source vector search engine with built-in modules for multimodal vectors and hybrid search.',
    relatedIds: ['qdrant', 'milvus', 'pinecone', 'llamaindex'],
  },
  'qdrant': {
    tier: 'professional',
    editorialSummary: 'High-performance Rust vector database with advanced payload filtering and sparse vector support.',
    relatedIds: ['milvus', 'weaviate', 'pinecone', 'fastapi', 'llamaindex'],
  },
  'pinecone': {
    tier: 'core',
    editorialSummary: 'Serverless vector database delivering ultra-low latency similarity search at enterprise scale.',
    relatedIds: ['openai', 'langchain', 'llamaindex', 'qdrant', 'chroma'],
  },
  'llamaparse': {
    tier: 'ecosystem',
    editorialSummary: 'GenAI-native document parsing engine extracting structured markdown from complex PDFs and tables.',
    relatedIds: ['llamaindex', 'unstructured', 'langchain'],
  },
  'unstructured': {
    tier: 'professional',
    editorialSummary: 'ETL toolchain preprocessing enterprise unstructured text, docs, and emails for RAG pipelines.',
    relatedIds: ['llamaparse', 'langchain', 'llamaindex'],
  },
  'prometheus': {
    tier: 'professional',
    editorialSummary: 'Dimensional time-series metric collection engine with powerful PromQL aggregation and alerting.',
    relatedIds: ['grafana', 'kubernetes', 'docker', 'sentry'],
  },
  'grafana': {
    tier: 'professional',
    editorialSummary: 'Multi-source observability dashboards turning infrastructure telemetry into real-time insight.',
    relatedIds: ['prometheus', 'kubernetes', 'sentry'],
  },
  'sentry': {
    tier: 'professional',
    editorialSummary: 'Application performance monitoring and stack-trace exception tracking across full-stack runtimes.',
    relatedIds: ['prometheus', 'grafana', 'typescript', 'langsmith'],
  },
};

/**
 * Returns the knowledge tier (1 = Core engineering identity, 2 = Production tools, 3 = Ecosystem)
 */
export function getSkillTier(skillId: string): SkillTier {
  const skill = SKILLS_DATA.find((s) => s.id === skillId.toLowerCase());
  if (skill) return skill.tier;
  return SKILL_KNOWLEDGE_MAP[skillId.toLowerCase()]?.tier ?? 'professional';
}

/**
 * Returns related technology IDs for a given skill with deduplication.
 */
export function getRelatedSkillIds(skillId: string): string[] {
  const raw = SKILL_KNOWLEDGE_MAP[skillId.toLowerCase()]?.relatedIds ?? [];
  const normalizedSelf = skillId.toLowerCase();
  return Array.from(new Set(raw.map((id) => id.toLowerCase()))).filter(
    (id) => id !== normalizedSelf
  );
}

/**
 * Returns editorial telemetry summary philosophy quote for HUD.
 */
export function getSkillEditorialSummary(skillId: string): string {
  return (
    SKILL_KNOWLEDGE_MAP[skillId.toLowerCase()]?.editorialSummary ??
    'A specialized architectural instrument within the full-stack engineering constellation.'
  );
}
