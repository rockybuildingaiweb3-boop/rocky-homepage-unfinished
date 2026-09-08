/**
 * Dedicated Punchy One-Liner Quotes for Technologies
 * Matches User Design Reference:
 * Tailwind -> "Utility classes hitting different fr fr 🌪️🔥"
 */

export const TECH_QUOTES: Record<string, string> = {
  tailwind: 'Utility classes hitting different fr fr 🌪️🔥',
  react: 'UI = f(state), declared once, rendered everywhere ⚛️✨',
  nextjs: 'Full-stack React Server Components and Edge routing at light speed ⚡',
  typescript: 'Strict structural contracts saving lives before production runtime 🛡️',
  javascript: 'The asynchronous event-driven backbone of the modern web 🌐',
  html5: 'Semantic structuring of digital information for the global web 📄',
  css3: 'Cascading geometry, flexbox rhythms and fluid responsive layouts 🎨',
  motion: 'Silky spring physics and fluid gesture choreography 🪄',
  gsap: 'High-performance timeline orchestration hitting solid 60fps 🎬',
  svelte: 'Compile-time reactive bindings with zero virtual DOM overhead 🚀',
  astro: 'Zero JavaScript by default with ultra-fast content islands 🏝️',
  vite: 'Instantaneous hot module replacement and lightning bundle builds ⚡',

  threejs: 'Bending WebGL pixels into dimensional cosmic reality 🌌',
  webgl: 'Low-level programmable GPU pipeline for infinite visual depth 🎮',
  glsl: 'Mathematical fragment shaders sculptured with pure light 🔮',
  webgpu: 'Next-generation compute shaders and high-throughput graphics ⚡',
  r3f: 'Declarative Three.js scene graphs powered by React Fiber 🪐',
  spline: 'Intuitive interactive 3D spatial experiences on the web 🎨',
  blender: 'High-fidelity 3D modeling, UV unwrapping & spatial assets 📐',
  figma: 'Design token systems translated into engineered precision 🎯',
  d3: 'Data-driven document visualizers and dynamic math projections 📊',
  draco: 'High-efficiency geometry compression for 3D meshes 📦',
  uvbaking: 'Precomputed global illumination baked into spatial textures 💡',
  canvas: 'Hardware-accelerated 2D bitmap drawing and particle rasterization 🖌️',

  nodejs: 'Non-blocking asynchronous event loop runtime at scale 🟢',
  express: 'Minimalist, battle-tested HTTP routing engine 🚂',
  graphql: 'Ask for exactly what you need, nothing more nothing less 🕸️',
  trpc: 'End-to-end type safety across client and server without schemas 🔗',
  socketio: 'Bidirectional real-time event streaming across clients ⚡',
  framer: 'Production-grade spatial design and kinetic prototypes 📐',
  postgresql: 'Rock-solid relational transactions, ACID integrity & JSONB 🐘',
  supabase: 'Postgres-native backend with instant realtime & auth ⚡',
  firebase: 'Serverless real-time document store & cloud functions 🔥',
  mongodb: 'Flexible BSON document schemas and distributed clusters 🍃',
  redis: 'Sub-millisecond in-memory caching and distributed pub/sub 🔴',
  prisma: 'Next-generation type-safe ORM with automated migrations 💎',
  drizzle: 'If you know SQL, you know Drizzle, zero overhead ⚡',
  docker: 'Consistent containerized runtimes from local to cloud 🐳',
  awslambda: 'Event-driven serverless compute scaling to zero ☁️',
  cloudflare: 'Global edge network caching, workers & DDoS protection 🌐',

  vercelai: 'Streaming AI agent workflows and unified model interfaces 🤖',
  openai: 'State-of-the-art language synthesis and embedding models 🧠',
  langchain: 'Composing multi-step reasoning chains with contextual tools ⛓️',
  llamaindex: 'Data ingestion and retrieval augmented generation pipelines 📚',
  solidity: 'Turing-complete immutable logic secured on distributed state ⛓️',
  viem: 'Lightweight, type-safe Ethereum primitives with zero bloat 💎',
  wagmi: 'React hooks for modern Web3 applications and wallet auth 🦊',
  privy: 'Seamless embedded wallets and cryptographic auth onboarding 🔑',
  git: 'Distributed version control tracking every atomic commit 🌿',
  mcp: 'Model Context Protocol connecting AI models to real tools 🔌',
  pgvector: 'High-dimensional vector embeddings stored natively in Postgres 🧭',
  designsystems: 'Modular atomic design tokens ensuring enterprise consistency 💎',
  rive: 'Interactive vector runtimes with real-time state machines 💫',
  ethers: 'Classic Ethereum wallet interactions and contract calls ⛓️',
  foundry: 'Blazing fast Solidity testing and compilation framework 🔨',
  erc4337: 'Smart contract accounts and native gasless transactions 💳',
  thegraph: 'Decentralized indexing protocol for querying blockchain data 📊',
  ipfs: 'Peer-to-peer hypermedia protocol for content-addressed files 🌐',
  siwe: 'Sign-In with Ethereum: cryptographic decentralized authentication 🔐',
};

export function getTechQuote(skillId: string, fallback?: string): string {
  const normId = skillId.toLowerCase().replace(/[^a-z0-9]/g, '');
  return (
    TECH_QUOTES[normId] ||
    TECH_QUOTES[skillId] ||
    fallback ||
    'High-performance production technical capability ⚡'
  );
}
