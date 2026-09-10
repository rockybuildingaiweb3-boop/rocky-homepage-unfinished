/**
 * Dedicated Punchy One-Liner Quotes for Technologies
 * Aligned with verified 50 skills across all 5 rows.
 */

export const TECH_QUOTES: Record<string, string> = {
  // Row 1
  typescript: 'Strict structural contracts saving lives before production runtime 🛡️',
  javascript: 'The asynchronous event-driven backbone of the modern web 🌐',
  react: 'UI = f(state), declared once, rendered everywhere ⚛️✨',
  nextjs: 'Full-stack React Server Components and Edge routing at light speed ⚡',
  svelte: 'Compile-time reactive bindings with zero virtual DOM overhead 🚀',
  tailwind: 'Utility classes hitting different fr fr 🌪️🔥',
  motion: 'Silky spring physics and fluid gesture choreography 🪄',
  gsap: 'High-performance timeline orchestration hitting solid 60fps 🎬',
  html5: 'Semantic structuring of digital information for the global web 📄',
  vite: 'Instantaneous hot module replacement and lightning bundle builds ⚡',

  // Row 2
  threejs: 'Bending WebGL pixels into dimensional cosmic reality 🌌',
  webgl: 'Low-level programmable GPU pipeline for infinite visual depth 🎮',
  webgpu: 'Next-generation compute shaders and high-throughput graphics ⚡',
  opengl: 'Mathematical fragment shaders sculptured with pure light 🔮',
  blender: 'High-fidelity 3D modeling, UV unwrapping & spatial assets 📐',
  unity: 'Real-time interactive 3D physics and immersive world simulation 🕹️',
  unrealengine: 'Photorealistic Lumen lighting and Nanite geometry for virtual cinema 🎥',
  vulkan: 'Explicit hardware GPU command queues and multi-threaded throughput 🌋',
  webassembly: 'Near-native bytecode execution in the browser sandbox ⚡',
  godotengine: 'Lightweight node-based scene hierarchy and fast 3D web deploy 🤖',

  // Row 3
  nodejs: 'Non-blocking asynchronous event loop runtime at scale 🟢',
  express: 'Minimalist, battle-tested HTTP routing engine 🚂',
  nestjs: 'Modular enterprise TypeScript architecture and dependency injection 🏛️',
  postgresql: 'Rock-solid relational transactions, ACID integrity & JSONB 🐘',
  supabase: 'Postgres-native backend with instant realtime & auth ⚡',
  prisma: 'Next-generation type-safe ORM with automated migrations 💎',
  drizzle: 'If you know SQL, you know Drizzle, zero overhead ⚡',
  redis: 'Sub-millisecond in-memory caching and distributed pub/sub 🔴',
  graphql: 'Ask for exactly what you need, nothing more nothing less 🕸️',
  docker: 'Consistent containerized runtimes from local to cloud 🐳',

  // Row 4
  solidity: 'Turing-complete immutable logic secured on distributed state ⛓️',
  ethereum: 'Global decentralized state machine and consensus settlement 💎',
  polygon: 'Sub-second transactions and zk-rollup scaling for mass adoption 💜',
  solana: 'Ultra-fast parallel transaction execution with Proof of History ⚡',
  chainlink: 'Tamper-proof real-world data oracles and cross-chain messaging 🔗',
  alchemy: 'Enterprise blockchain node supercharging web3 developers ⚡',
  ipfs: 'Peer-to-peer hypermedia protocol for content-addressed files 🌐',
  web3dotjs: 'The foundational JavaScript interface to the Ethereum blockchain 🦊',
  bitcoin: 'Decentralized cryptographic hard money and Nakamoto consensus ₿',
  optimism: 'Optimistic rollups scaling Ethereum with the open Superchain 🔴',

  // Row 5: AI Engineering, LLMs & Agentic Systems
  openai: 'Frontier reasoning, multimodal intelligence, and structured function calling ⚡',
  chatgpt: 'Conversational agent engineering, custom GPTs, and prompt synthesis 🤖',
  anthropic: 'Constitutional reasoning, long-context comprehension & Model Context Protocol 🧠',
  python: 'The lingua franca of artificial intelligence, tensor math & pipelines 🐍',
  langchain: 'Composing multi-step reasoning chains with contextual tools ⛓️',
  agentic: 'Autonomous multi-agent loops, stateful workflows, and external execution 🧭',
  rag: 'Retrieval-Augmented Generation with semantic embeddings and vector search 🔍',
  huggingface: 'The open-source heartbeat of machine learning models and datasets 🤗',
  pytorch: 'Dynamic neural network graphs and tensor mathematics on GPUs 🔥',
  ollama: 'High-performance local LLM execution with zero-cloud privacy 🦙',
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
