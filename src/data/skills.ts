export interface SkillItem {
  id: string;
  name: string;
  slug: string;
  row: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  rowTitle: string;
  category: string;
  brandColor: string;
  shortDescription: string;
  positioning?: string;
  relatedProjects?: string[];
  icon?: string;
}

export interface SkillRowDefinition {
  row: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  title: string;
  subtitle: string;
}

export const SKILL_ROWS: SkillRowDefinition[] = [
  {
    "row": 1,
    "title": "核心前端与交互动效",
    "subtitle": "Core Frontend & Kinetic Motion"
  },
  {
    "row": 2,
    "title": "3D 空间计算与图形资产",
    "subtitle": "3D Spatial Computing & Graphics"
  },
  {
    "row": 3,
    "title": "服务端、数据与基础设施",
    "subtitle": "Backend, Data & Infrastructure"
  },
  {
    "row": 4,
    "title": "Web3 与去中心化架构",
    "subtitle": "Web3 & Decentralized Architecture"
  },
  {
    "row": 5,
    "title": "AI 模型与调用工程",
    "subtitle": "AI Models & Inference Engineering"
  },
  {
    "row": 6,
    "title": "AI Agent 与工作流编排",
    "subtitle": "AI Agents & Workflow Orchestration"
  },
  {
    "row": 7,
    "title": "RAG 知识库与检索工程",
    "subtitle": "RAG Knowledge Base & Retrieval"
  },
  {
    "row": 8,
    "title": "工程化部署、测试与稳定性",
    "subtitle": "Engineering Deployment, Testing & Reliability"
  }
];

export const PROJECT_NAMES: Record<
  string,
  { title: string; number: string; category: string; image: string }
> = {
  marymount: {
    title: 'Marymount Paris',
    number: '01',
    category: 'Enterprise Full-Stack CMS',
    image: '/assets/imgs/work-back/marymount/cover.jpg',
  },
  lcml: {
    title: 'Life-Cycle Management Laboratory',
    number: '02',
    category: 'Full-Stack Digital Platform',
    image: '/assets/imgs/work-back/lcml/cover.jpg',
  },
  v1: {
    title: 'Portfolio v1',
    number: '03',
    category: 'Personal Portfolio',
    image: '/assets/imgs/work-back/v1/cover.jpg',
  },
  kic: {
    title: 'Kelowna Islamic Center',
    number: '04',
    category: 'Multi-platform Solutions',
    image: '/assets/imgs/work-back/kic/cover.jpg',
  },
  grillzzy: {
    title: 'Grillzzy Foods',
    number: '05',
    category: 'Brand Website',
    image: '/assets/imgs/work-back/grillzzy/cover.jpg',
  },
  aurora: {
    title: 'Aurora Spatial',
    number: '06',
    category: 'Creative Experiment',
    image: '/assets/imgs/work-back/aurora/cover.jpg',
  },
  chronos: {
    title: 'Chronos Studio',
    number: '07',
    category: 'Algorithmic Design Tool',
    image: '/assets/imgs/work-back/chronos/cover.jpg',
  },
};

export const SKILLS_DATA: SkillItem[] = [
  {
    "id": "typescript",
    "name": "TypeScript",
    "slug": "typescript",
    "row": 1,
    "rowTitle": "核心前端与交互动效",
    "category": "Static Typing",
    "brandColor": "#3178C6",
    "shortDescription": "Strict structural typing and compile-time contract enforcement 🛡️",
    "positioning": "Advanced Generics & TypeScript Architecture",
    "relatedProjects": [
      "chronos",
      "aurora",
      "marymount"
    ]
  },
  {
    "id": "javascript",
    "name": "JavaScript",
    "slug": "javascript",
    "row": 1,
    "rowTitle": "核心前端与交互动效",
    "category": "Language Core",
    "brandColor": "#F7DF1E",
    "shortDescription": "Modern ECMAScript runtime, asynchronous event loops & DOM pipelines 🌐",
    "positioning": "Modern ECMAScript & Asynchronous Event Systems",
    "relatedProjects": [
      "lcml",
      "grillzzy",
      "v1"
    ]
  },
  {
    "id": "react",
    "name": "React",
    "slug": "react",
    "row": 1,
    "rowTitle": "核心前端与交互动效",
    "category": "UI Library",
    "brandColor": "#61DAFB",
    "shortDescription": "Concurrent rendering, fiber tree reconciliation & custom hooks ⚛️",
    "positioning": "Concurrent React Architecture & Custom Hooks Ecosystem",
    "relatedProjects": [
      "chronos",
      "aurora",
      "marymount",
      "lcml"
    ]
  },
  {
    "id": "nextdotjs",
    "name": "Next.js",
    "slug": "nextdotjs",
    "row": 1,
    "rowTitle": "核心前端与交互动效",
    "category": "Full-Stack Framework",
    "brandColor": "#FFFFFF",
    "shortDescription": "Server Actions, React Server Components & edge routing ⚡",
    "positioning": "Server Actions, Streaming SSR & Edge Optimization",
    "relatedProjects": [
      "marymount",
      "chronos"
    ]
  },
  {
    "id": "svelte",
    "name": "Svelte",
    "slug": "svelte",
    "row": 1,
    "rowTitle": "核心前端与交互动效",
    "category": "Reactive Compiler",
    "brandColor": "#FF3E00",
    "shortDescription": "Compile-time reactive primitives with zero virtual DOM overhead 🚀",
    "positioning": "Svelte Runes & Fine-Grained Reactive Primitives",
    "relatedProjects": [
      "v1",
      "aurora"
    ]
  },
  {
    "id": "tailwindcss",
    "name": "Tailwind CSS",
    "slug": "tailwindcss",
    "row": 1,
    "rowTitle": "核心前端与交互动效",
    "category": "Styling Engine",
    "brandColor": "#06B6D4",
    "shortDescription": "Token-driven utility styling with responsive breakpoint fluidity 🌪️",
    "positioning": "Design Token Systems & Kinetic Responsive Layouts",
    "relatedProjects": [
      "marymount",
      "lcml",
      "grillzzy"
    ]
  },
  {
    "id": "framer",
    "name": "Framer Motion",
    "slug": "framer",
    "row": 1,
    "rowTitle": "核心前端与交互动效",
    "category": "Motion Physics",
    "brandColor": "#0055FF",
    "shortDescription": "Spring physics choreography and layout projection animations 🪄",
    "positioning": "Spring Physics Choreography & Micro-Interactions",
    "relatedProjects": [
      "chronos",
      "v1",
      "aurora"
    ]
  },
  {
    "id": "greensock",
    "name": "GSAP",
    "slug": "greensock",
    "row": 1,
    "rowTitle": "核心前端与交互动效",
    "category": "Timeline Animation",
    "brandColor": "#88CE02",
    "shortDescription": "High-performance scroll-triggered timeline orchestration 🎬",
    "positioning": "ScrollTrigger Timelines & Kinetic Canvas Animations",
    "relatedProjects": [
      "aurora",
      "chronos"
    ]
  },
  {
    "id": "html5",
    "name": "HTML5/Semantics",
    "slug": "html5",
    "row": 1,
    "rowTitle": "核心前端与交互动效",
    "category": "Semantic Web",
    "brandColor": "#E34F26",
    "shortDescription": "Accessible semantic document structuring and WAI-ARIA standards 📄",
    "positioning": "Semantic Web Standards, WAI-ARIA & DOM Integration",
    "relatedProjects": [
      "marymount",
      "lcml",
      "grillzzy"
    ]
  },
  {
    "id": "vite",
    "name": "Vite",
    "slug": "vite",
    "row": 1,
    "rowTitle": "核心前端与交互动效",
    "category": "Build Tooling",
    "brandColor": "#646CFF",
    "shortDescription": "Native ESM dev server and optimized Rollup production builds ⚡",
    "positioning": "ESM Dev Server & Rollup Production Optimization",
    "relatedProjects": [
      "chronos",
      "aurora",
      "v1"
    ]
  },
  {
    "id": "threedotjs",
    "name": "Three.js",
    "slug": "threedotjs",
    "row": 2,
    "rowTitle": "3D 空间计算与图形资产",
    "category": "3D WebGL Library",
    "brandColor": "#FFFFFF",
    "shortDescription": "Scene graph hierarchies, procedural geometry, and custom shader materials 🌌",
    "positioning": "Custom Shader Materials & Scene Graph Choreography",
    "relatedProjects": [
      "aurora",
      "chronos"
    ]
  },
  {
    "id": "webgl",
    "name": "WebGL",
    "slug": "webgl",
    "row": 2,
    "rowTitle": "3D 空间计算与图形资产",
    "category": "Graphics API",
    "brandColor": "#990000",
    "shortDescription": "Hardware-accelerated rasterization and framebuffer post-processing 🎮",
    "positioning": "Raw GLSL Shader Pipelines & GPU Framebuffers",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "glsl",
    "name": "GLSL",
    "slug": "opengl",
    "row": 2,
    "rowTitle": "3D 空间计算与图形资产",
    "category": "Shader Language",
    "brandColor": "#5586A4",
    "shortDescription": "Vertex displacement, fragment raymarching, and procedural noise math 🔮",
    "positioning": "Fragment Shaders, Raymarching & Procedural Noise",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "webgpu",
    "name": "WebGPU",
    "slug": "webgpu",
    "row": 2,
    "rowTitle": "3D 空间计算与图形资产",
    "category": "Next-Gen GPU",
    "brandColor": "#0088CC",
    "shortDescription": "Direct hardware command queues and high-throughput WGSL compute shaders ⚡",
    "positioning": "WGSL Compute Shaders & Direct Hardware GPU Buffers",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "r3f",
    "name": "React Three Fiber",
    "slug": "react",
    "row": 2,
    "rowTitle": "3D 空间计算与图形资产",
    "category": "Declarative 3D",
    "brandColor": "#61DAFB",
    "shortDescription": "Declarative React reconciler for Three.js stateful canvas scenes 🪐",
    "positioning": "Declarative Three.js Ecosystem & Drei Components",
    "relatedProjects": [
      "aurora",
      "chronos"
    ]
  },
  {
    "id": "blender",
    "name": "Blender",
    "slug": "blender",
    "row": 2,
    "rowTitle": "3D 空间计算与图形资产",
    "category": "3D Modeling DCC",
    "brandColor": "#F5792A",
    "shortDescription": "Subdivision surface modeling, UV unwrapping, and glTF optimization 📐",
    "positioning": "glTF 2.0 PBR Asset Optimization & Geometry Nodes",
    "relatedProjects": [
      "aurora",
      "chronos"
    ]
  },
  {
    "id": "spline",
    "name": "Spline",
    "slug": "spline",
    "row": 2,
    "rowTitle": "3D 空间计算与图形资产",
    "category": "Interactive 3D Tool",
    "brandColor": "#4D40FF",
    "shortDescription": "Web-native interactive 3D assets, event triggers, and physics simulations 💫",
    "positioning": "Interactive Web3D Asset Integration & Micro-3D Experiences",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "draco",
    "name": "Draco/Meshopt",
    "slug": "draco",
    "row": 2,
    "rowTitle": "3D 空间计算与图形资产",
    "category": "Mesh Compression",
    "brandColor": "#8B5CF6",
    "shortDescription": "High-ratio geometry compression reducing 3D web asset payloads 📦",
    "positioning": "glTF Compression, Quantization & Web3D Performance",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "uvbaking",
    "name": "UV/Baking",
    "slug": "uvbaking",
    "row": 2,
    "rowTitle": "3D 空间计算与图形资产",
    "category": "Texture Pipeline",
    "brandColor": "#EC4899",
    "shortDescription": "Ambient occlusion, normal map baking, and texture atlas optimization 🎨",
    "positioning": "PBR Texture Atlas Baking & Mobile GPU Optimization",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "canvasapi",
    "name": "Canvas API",
    "slug": "html5",
    "row": 2,
    "rowTitle": "3D 空间计算与图形资产",
    "category": "2D Graphics Engine",
    "brandColor": "#E34F26",
    "shortDescription": "Immediate mode 2D pixel rendering, particle physics, and image filters 🖌️",
    "positioning": "2D Canvas Particle Simulations & Raster Manipulation",
    "relatedProjects": [
      "aurora",
      "chronos"
    ]
  },
  {
    "id": "nodedotjs",
    "name": "Node.js",
    "slug": "nodedotjs",
    "row": 3,
    "rowTitle": "服务端、数据与基础设施",
    "category": "Backend Runtime",
    "brandColor": "#5FA04E",
    "shortDescription": "Asynchronous event loop runtime powering scalable backend services 🟢",
    "positioning": "Event-Driven Microservices & V8 Engine Optimization",
    "relatedProjects": [
      "marymount",
      "lcml",
      "chronos"
    ]
  },
  {
    "id": "express",
    "name": "Express",
    "slug": "express",
    "row": 3,
    "rowTitle": "服务端、数据与基础设施",
    "category": "HTTP Framework",
    "brandColor": "#FFFFFF",
    "shortDescription": "Minimalist HTTP routing engine and middleware pipeline 🚂",
    "positioning": "RESTful API Engineering & Middleware Security",
    "relatedProjects": [
      "marymount",
      "lcml"
    ]
  },
  {
    "id": "fastapi",
    "name": "FastAPI",
    "slug": "fastapi",
    "row": 3,
    "rowTitle": "服务端、数据与基础设施",
    "category": "Inference API",
    "brandColor": "#009688",
    "shortDescription": "High-throughput async Python APIs serving real-time model inference ⚡",
    "positioning": "ASGI Endpoints, Pydantic v2 & Async Model Streaming",
    "relatedProjects": [
      "chronos",
      "lcml"
    ]
  },
  {
    "id": "postgresql",
    "name": "PostgreSQL",
    "slug": "postgresql",
    "row": 3,
    "rowTitle": "服务端、数据与基础设施",
    "category": "Relational DB",
    "brandColor": "#4169E1",
    "shortDescription": "ACID transactions, relational integrity, and pgvector embeddings 🐘",
    "positioning": "Relational Schema Design & pgvector Embedding Stores",
    "relatedProjects": [
      "marymount",
      "lcml",
      "chronos"
    ]
  },
  {
    "id": "supabase",
    "name": "Supabase",
    "slug": "supabase",
    "row": 3,
    "rowTitle": "服务端、数据与基础设施",
    "category": "BaaS & Realtime",
    "brandColor": "#3ECF8E",
    "shortDescription": "Postgres-native backend with instant realtime and Row Level Security ⚡",
    "positioning": "Row-Level Security & Realtime WebSocket Replication",
    "relatedProjects": [
      "chronos",
      "v1"
    ]
  },
  {
    "id": "prisma",
    "name": "Prisma",
    "slug": "prisma",
    "row": 3,
    "rowTitle": "服务端、数据与基础设施",
    "category": "Type-Safe ORM",
    "brandColor": "#2D3748",
    "shortDescription": "Declarative schema modeling and type-safe database query generation 💎",
    "positioning": "Type-Safe Data Modeling & Automated Migrations",
    "relatedProjects": [
      "marymount",
      "chronos"
    ]
  },
  {
    "id": "drizzle",
    "name": "Drizzle ORM",
    "slug": "drizzle",
    "row": 3,
    "rowTitle": "服务端、数据与基础设施",
    "category": "Zero-Overhead ORM",
    "brandColor": "#C5F74F",
    "shortDescription": "SQL-like syntax, edge serverless compatibility, and zero runtime overhead ⚡",
    "positioning": "Serverless Edge Queries & Lightweight SQL Execution",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "redis",
    "name": "Redis",
    "slug": "redis",
    "row": 3,
    "rowTitle": "服务端、数据与基础设施",
    "category": "In-Memory Store",
    "brandColor": "#DC382D",
    "shortDescription": "Sub-millisecond in-memory caching, distributed locks, and pub/sub queues 🔴",
    "positioning": "Distributed Caching, Session Stores & Rate Limiting",
    "relatedProjects": [
      "marymount",
      "lcml"
    ]
  },
  {
    "id": "trpc",
    "name": "tRPC",
    "slug": "trpc",
    "row": 3,
    "rowTitle": "服务端、数据与基础设施",
    "category": "End-to-End Types",
    "brandColor": "#2596BE",
    "shortDescription": "End-to-end type safety between client and server without code generation 🔗",
    "positioning": "Full-Stack Type Inference & API Route Contracts",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "graphql",
    "name": "GraphQL",
    "slug": "graphql",
    "row": 3,
    "rowTitle": "服务端、数据与基础设施",
    "category": "Query Language",
    "brandColor": "#E10098",
    "shortDescription": "Declarative data fetching across federated schemas with precise queries 🕸️",
    "positioning": "Federated Schemas, DataLoader Caching & Strongly Typed Queries",
    "relatedProjects": [
      "marymount",
      "lcml"
    ]
  },
  {
    "id": "solidity",
    "name": "Solidity",
    "slug": "solidity",
    "row": 4,
    "rowTitle": "Web3 与去中心化架构",
    "category": "Smart Contracts",
    "brandColor": "#AA6746",
    "shortDescription": "Turing-complete immutable logic secured on distributed EVM state ⛓️",
    "positioning": "Gas Optimization, Reentrancy Protection & EVM Assembly",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "viem",
    "name": "viem",
    "slug": "viem",
    "row": 4,
    "rowTitle": "Web3 & 去中心化架构",
    "category": "TypeScript Web3 SDK",
    "brandColor": "#7042F8",
    "shortDescription": "Lightweight, composable, and type-safe interface for Ethereum ⚡",
    "positioning": "ABI Type Inference & High-Performance EVM Clients",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "wagmi",
    "name": "wagmi",
    "slug": "wagmi",
    "row": 4,
    "rowTitle": "Web3 与去中心化架构",
    "category": "React Web3 Hooks",
    "brandColor": "#E11D48",
    "shortDescription": "React hooks for wallet connection, contract interaction, and ENS lookup 🪝",
    "positioning": "Reactive Wallet Connection & Contract Execution Hooks",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "ethers",
    "name": "Ethers.js",
    "slug": "ethers",
    "row": 4,
    "rowTitle": "Web3 与去中心化架构",
    "category": "Blockchain Client",
    "brandColor": "#2563EB",
    "shortDescription": "Complete and compact library for interacting with Ethereum and wallets 📜",
    "positioning": "Cryptographic Signing, RPC Providers & Contract Encoders",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "foundry",
    "name": "Foundry",
    "slug": "foundry",
    "row": 4,
    "rowTitle": "Web3 与去中心化架构",
    "category": "Smart Contract Toolchain",
    "brandColor": "#F59E0B",
    "shortDescription": "Blazing-fast Solidity testing, fuzzing, and EVM gas profiling in Rust 🛠️",
    "positioning": "Invariant Testing, Fuzzing & Gas Optimization Workflows",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "privy",
    "name": "Privy",
    "slug": "privy",
    "row": 4,
    "rowTitle": "Web3 与去中心化架构",
    "category": "Embedded Wallets",
    "brandColor": "#6366F1",
    "shortDescription": "Frictionless web3 onboarding with embedded passkey and social wallets 🔐",
    "positioning": "Embedded MPC Wallets & Progressive Onboarding UX",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "erc4337",
    "name": "ERC-4337",
    "slug": "ethereum",
    "row": 4,
    "rowTitle": "Web3 与去中心化架构",
    "category": "Account Abstraction",
    "brandColor": "#627EEA",
    "shortDescription": "Smart contract accounts with user operations, paymasters, and session keys 🔑",
    "positioning": "Account Abstraction, Gas Sponsorship & Multi-Call Bundlers",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "thegraph",
    "name": "The Graph",
    "slug": "thegraph",
    "row": 4,
    "rowTitle": "Web3 与去中心化架构",
    "category": "Indexing Protocol",
    "brandColor": "#6742F1",
    "shortDescription": "Decentralized indexing and GraphQL querying of blockchain state and events 📊",
    "positioning": "Subgraphs, Event Indexing & Decoupled Web3 Queries",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "ipfs",
    "name": "IPFS",
    "slug": "ipfs",
    "row": 4,
    "rowTitle": "Web3 与去中心化架构",
    "category": "Decentralized Storage",
    "brandColor": "#65C2CB",
    "shortDescription": "Peer-to-peer hypermedia protocol for content-addressed immutable files 🌐",
    "positioning": "Content-Addressed Storage & Merkle DAG Verification",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "siwe",
    "name": "SIWE",
    "slug": "ethereum",
    "row": 4,
    "rowTitle": "Web3 与去中心化架构",
    "category": "Identity & Auth",
    "brandColor": "#627EEA",
    "shortDescription": "Sign-In with Ethereum enabling decentralized cryptographic authentication 🪪",
    "positioning": "EIP-4361 Authentication, Replay Protection & JWT Sessions",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "openai",
    "name": "OpenAI API",
    "slug": "openai",
    "row": 5,
    "rowTitle": "AI 模型与调用工程",
    "category": "Frontier AI API",
    "brandColor": "#10A37F",
    "shortDescription": "Frontier reasoning models, multimodal vision, and structured tool calling ⚡",
    "positioning": "GPT-4o Reasoning API, Structured Outputs & ChatGPT Integrations",
    "relatedProjects": [
      "chronos",
      "aurora",
      "lcml"
    ],
    "icon": "/assets/icons/openai.svg"
  },
  {
    "id": "anthropic",
    "name": "Anthropic Claude",
    "slug": "anthropic",
    "row": 5,
    "rowTitle": "AI 模型与调用工程",
    "category": "Frontier Reasoning",
    "brandColor": "#D97706",
    "shortDescription": "Constitutional reasoning, long-context comprehension & Model Context Protocol 🧠",
    "positioning": "Claude 3.5 Sonnet Tool Calling & Prompt Engineering",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "gemini",
    "name": "Google Gemini",
    "slug": "googlegemini",
    "row": 5,
    "rowTitle": "AI 模型与调用工程",
    "category": "Multimodal AI",
    "brandColor": "#4E75F8",
    "shortDescription": "Native multimodal reasoning across video, audio, code, and long-context windows 🪐",
    "positioning": "Gemini 1.5 Pro Long-Context Analysis & Function Calling",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "deepseek",
    "name": "DeepSeek",
    "slug": "deepseek",
    "row": 5,
    "rowTitle": "AI 模型与调用工程",
    "category": "Open Weights Reasoning",
    "brandColor": "#1E40AF",
    "shortDescription": "High-efficiency mixture-of-experts architecture and math reasoning models 🐋",
    "positioning": "DeepSeek R1 / V3 Reasoning Architecture & Low-Cost Serving",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "qwen",
    "name": "通义千问",
    "slug": "qwen",
    "row": 5,
    "rowTitle": "AI 模型与调用工程",
    "category": "Multilingual LLM",
    "brandColor": "#6366F1",
    "shortDescription": "Enterprise-grade multilingual reasoning, coding, and vision foundation models 🌏",
    "positioning": "Qwen 2.5 Coding & Vision Model Fine-Tuning Pipelines",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "vercelai",
    "name": "Vercel AI SDK",
    "slug": "vercel",
    "row": 5,
    "rowTitle": "AI 模型与调用工程",
    "category": "AI Frontend SDK",
    "brandColor": "#FFFFFF",
    "shortDescription": "Unified TypeScript library for streaming LLM text, objects, and generative UI ⚡",
    "positioning": "AI Streaming Protocols, Generative UI & Edge Runtime Adapters",
    "relatedProjects": [
      "chronos",
      "aurora"
    ]
  },
  {
    "id": "functioncalling",
    "name": "Function Calling",
    "slug": "functioncalling",
    "row": 5,
    "rowTitle": "AI 模型与调用工程",
    "category": "Tool Integration",
    "brandColor": "#10B981",
    "shortDescription": "Deterministic JSON parameter extraction invoking external tools and APIs ⚙️",
    "positioning": "Tool Definition Schemas, Multi-Turn Loop Handling & Execution",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "structuredoutput",
    "name": "Structured Output",
    "slug": "structuredoutput",
    "row": 5,
    "rowTitle": "AI 模型与调用工程",
    "category": "Schema Enforcement",
    "brandColor": "#8B5CF6",
    "shortDescription": "100% JSON Schema adherence guaranteed by constrained decoding engines 📋",
    "positioning": "Zod / Pydantic Schema Enforcement & Type-Safe Extraction",
    "relatedProjects": [
      "chronos",
      "lcml"
    ]
  },
  {
    "id": "promptengineering",
    "name": "Prompt Engineering",
    "slug": "promptengineering",
    "row": 5,
    "rowTitle": "AI 模型与调用工程",
    "category": "Context Optimization",
    "brandColor": "#F59E0B",
    "shortDescription": "Chain-of-thought, few-shot prompting, and metaprompt architecture 📝",
    "positioning": "System Prompts, Few-Shot In-Context Learning & Guardrails",
    "relatedProjects": [
      "chronos",
      "marymount"
    ]
  },
  {
    "id": "langsmith",
    "name": "LangSmith",
    "slug": "langchain",
    "row": 5,
    "rowTitle": "AI 模型与调用工程",
    "category": "LLM Observability",
    "brandColor": "#1C3C3C",
    "shortDescription": "Trace latency, monitor tokens, debug chains, and evaluate prompt runs 🔍",
    "positioning": "LLM Trace Debugging, Evaluation Datasets & Latency Profiling",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "langchain",
    "name": "LangChain",
    "slug": "langchain",
    "row": 6,
    "rowTitle": "AI Agent 与工作流编排",
    "category": "Agent Orchestration",
    "brandColor": "#1C3C3C",
    "shortDescription": "Composing multi-step reasoning chains with contextual tools and memory ⛓️",
    "positioning": "Context Memory Stores & Retrieval-Augmented Tool Routing",
    "relatedProjects": [
      "chronos",
      "marymount"
    ]
  },
  {
    "id": "langgraph",
    "name": "LangGraph",
    "slug": "langchain",
    "row": 6,
    "rowTitle": "AI Agent 与工作流编排",
    "category": "Stateful Multi-Agent",
    "brandColor": "#1C3C3C",
    "shortDescription": "Cyclic state machines and human-in-the-loop multi-agent coordination 🔄",
    "positioning": "Stateful Graph Workflows, Checkpointing & Multi-Agent Loops",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "llamaindex",
    "name": "LlamaIndex",
    "slug": "llamaindex",
    "row": 6,
    "rowTitle": "AI Agent 与工作流编排",
    "category": "Data Framework",
    "brandColor": "#14B8A6",
    "shortDescription": "Context augmentation, structured indexing, and data connectors for LLMs 🦙",
    "positioning": "Document Chunking, Vector Store Connectors & Query Pipelines",
    "relatedProjects": [
      "chronos",
      "lcml"
    ]
  },
  {
    "id": "crewai",
    "name": "CrewAI",
    "slug": "crewai",
    "row": 6,
    "rowTitle": "AI Agent 与工作流编排",
    "category": "Role-Playing Agents",
    "brandColor": "#FF5722",
    "shortDescription": "Collaborative role-playing autonomous agents executing sequential and parallel tasks 👥",
    "positioning": "Role Assignment, Task Delegation & Multi-Agent Crews",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "autogen",
    "name": "AutoGen",
    "slug": "autogen",
    "row": 6,
    "rowTitle": "AI Agent 与工作流编排",
    "category": "Conversational Agents",
    "brandColor": "#0078D4",
    "shortDescription": "Multi-agent conversation framework orchestrating complex problem solving 🤖",
    "positioning": "Conversable Agents, Code Execution Sandbox & Group Chats",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "dify",
    "name": "Dify",
    "slug": "dify",
    "row": 6,
    "rowTitle": "AI Agent 与工作流编排",
    "category": "LLMOps Platform",
    "brandColor": "#2563EB",
    "shortDescription": "Visual orchestration of AI applications, RAG pipelines, and agent workflows 🎛️",
    "positioning": "Visual Prompt Workflows, Knowledge Bases & Agent Publishing",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "coze",
    "name": "Coze",
    "slug": "coze",
    "row": 6,
    "rowTitle": "AI Agent 与工作流编排",
    "category": "Agent Builder",
    "brandColor": "#8B5CF6",
    "shortDescription": "All-in-one AI chatbot and bot development platform with plugin ecosystems 🧩",
    "positioning": "Plugin Integrations, Workflow Canvas & Multi-Channel Deployment",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "semantickernel",
    "name": "Semantic Kernel",
    "slug": "microsoft",
    "row": 6,
    "rowTitle": "AI Agent 与工作流编排",
    "category": "Enterprise AI SDK",
    "brandColor": "#00A4EF",
    "shortDescription": "Enterprise orchestration integrating AI plugins, memories, and native code 🏢",
    "positioning": "Native Code Plugins, Planners & Enterprise AI Integration",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "mcp",
    "name": "MCP",
    "slug": "mcp",
    "row": 6,
    "rowTitle": "AI Agent 与工作流编排",
    "category": "Protocol Standard",
    "brandColor": "#D97706",
    "shortDescription": "Model Context Protocol: open standard connecting LLMs to external data and tools 🌐",
    "positioning": "MCP Client & Server Architecture, Tool Resources & Prompts",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "mem0",
    "name": "Agent Memory (Mem0)",
    "slug": "mem0",
    "row": 6,
    "rowTitle": "AI Agent 与工作流编排",
    "category": "Long-Term Memory",
    "brandColor": "#A855F7",
    "shortDescription": "Persistent user preferences, adaptive graph memory, and cross-session recall 🧠",
    "positioning": "Graph Memory, Episodic Storage & Adaptive User Profiles",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "pgvector",
    "name": "pgvector",
    "slug": "postgresql",
    "row": 7,
    "rowTitle": "RAG 知识库与检索工程",
    "category": "Vector Database",
    "brandColor": "#4169E1",
    "shortDescription": "Open-source vector similarity search for PostgreSQL with HNSW indexing 🐘",
    "positioning": "HNSW Indexes, Cosine Similarity & Relational Vector Hybrid Queries",
    "relatedProjects": [
      "chronos",
      "lcml"
    ]
  },
  {
    "id": "chroma",
    "name": "Chroma",
    "slug": "chroma",
    "row": 7,
    "rowTitle": "RAG 知识库与检索工程",
    "category": "Embedding DB",
    "brandColor": "#FF6B6B",
    "shortDescription": "AI-native open-source embedding database for rapid local vector prototyping 🌈",
    "positioning": "Local Embeddings Storage, Metadata Filtering & Collection Queries",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "milvus",
    "name": "Milvus",
    "slug": "milvus",
    "row": 7,
    "rowTitle": "RAG 知识库与检索工程",
    "category": "Cloud Vector DB",
    "brandColor": "#00A3E0",
    "shortDescription": "Billion-scale distributed vector database engineered for enterprise retrieval 🏢",
    "positioning": "Distributed Vector Shards, IVF-PQ Indexing & High-QPS Search",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "weaviate",
    "name": "Weaviate",
    "slug": "weaviate",
    "row": 7,
    "rowTitle": "RAG 知识库与检索工程",
    "category": "Hybrid Vector Engine",
    "brandColor": "#00D2B4",
    "shortDescription": "Hybrid sparse-dense search combining BM25 keyword matching with embeddings 🔀",
    "positioning": "Hybrid Keyword/Vector Search & Modular Vectorizer Modules",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "qdrant",
    "name": "Qdrant",
    "slug": "qdrant",
    "row": 7,
    "rowTitle": "RAG 知识库与检索工程",
    "category": "Rust Vector Search",
    "brandColor": "#DC2626",
    "shortDescription": "High-performance vector search engine written in Rust with payload filtering 🦀",
    "positioning": "Payload-Based Filtering, Rust Speed & Quantized Embeddings",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "llamaparse",
    "name": "LlamaParse",
    "slug": "llamaparse",
    "row": 7,
    "rowTitle": "RAG 知识库与检索工程",
    "category": "Document Parsing",
    "brandColor": "#14B8A6",
    "shortDescription": "GenAI-first parsing service for complex tables, charts, and unstructured PDFs 📑",
    "positioning": "Table Extraction, Markdown Conversion & Layout-Aware Parsing",
    "relatedProjects": [
      "lcml"
    ]
  },
  {
    "id": "unstructured",
    "name": "Unstructured",
    "slug": "unstructured",
    "row": 7,
    "rowTitle": "RAG 知识库与检索工程",
    "category": "ETL Pipeline",
    "brandColor": "#F97316",
    "shortDescription": "Preprocessing unstructured text documents into clean downstream RAG chunks 🧹",
    "positioning": "Document Ingestion Pipelines, Partitioning & Metadata Extraction",
    "relatedProjects": [
      "lcml"
    ]
  },
  {
    "id": "reranker",
    "name": "Reranker",
    "slug": "reranker",
    "row": 7,
    "rowTitle": "RAG 知识库与检索工程",
    "category": "Relevance Scoring",
    "brandColor": "#8B5CF6",
    "shortDescription": "Cross-encoder scoring models re-ordering top-k candidate chunks for precision 🎯",
    "positioning": "Cross-Encoder Scoring, Cohere Rerank & Precision Tuning",
    "relatedProjects": [
      "chronos",
      "lcml"
    ]
  },
  {
    "id": "embeddingmodels",
    "name": "Embedding Models",
    "slug": "embeddingmodels",
    "row": 7,
    "rowTitle": "RAG 知识库与检索工程",
    "category": "Dense Vectors",
    "brandColor": "#EC4899",
    "shortDescription": "Dense semantic representations mapping text into high-dimensional geometric space 🌌",
    "positioning": "Dense Embeddings, MTEB Benchmarks & Dimensionality Tuning",
    "relatedProjects": [
      "chronos",
      "lcml"
    ],
    "icon": "/assets/icons/rag.svg"
  },
  {
    "id": "citations",
    "name": "引用溯源",
    "slug": "citations",
    "row": 7,
    "rowTitle": "RAG 知识库与检索工程",
    "category": "Provenance & Hallucination",
    "brandColor": "#06B6D4",
    "shortDescription": "Source attribution and exact chunk verification preventing model hallucinations 📌",
    "positioning": "Source Attribution, Span Highlighting & Hallucination Mitigation",
    "relatedProjects": [
      "lcml",
      "chronos"
    ]
  },
  {
    "id": "docker",
    "name": "Docker",
    "slug": "docker",
    "row": 8,
    "rowTitle": "工程化部署、测试与稳定性",
    "category": "Containerization",
    "brandColor": "#2496ED",
    "shortDescription": "Deterministic container runtimes ensuring reproducibility from local to cloud 🐳",
    "positioning": "Multi-Stage Builds, Container Security & Minimal Images",
    "relatedProjects": [
      "marymount",
      "lcml"
    ]
  },
  {
    "id": "kubernetes",
    "name": "Kubernetes",
    "slug": "kubernetes",
    "row": 8,
    "rowTitle": "工程化部署、测试与稳定性",
    "category": "Orchestration",
    "brandColor": "#326CE5",
    "shortDescription": "Declarative cluster orchestration, self-healing pods, and service discovery ☸️",
    "positioning": "K8s Deployments, Horizontal Pod Autoscaling & Ingress",
    "relatedProjects": [
      "marymount"
    ]
  },
  {
    "id": "githubactions",
    "name": "GitHub Actions",
    "slug": "githubactions",
    "row": 8,
    "rowTitle": "工程化部署、测试与稳定性",
    "category": "CI/CD Automation",
    "brandColor": "#2088FF",
    "shortDescription": "Automated test matrices, build pipelines, and production deployments 🤖",
    "positioning": "CI/CD Workflows, Matrix Testing & Security Scanning",
    "relatedProjects": [
      "chronos",
      "aurora",
      "marymount"
    ]
  },
  {
    "id": "prometheus",
    "name": "Prometheus",
    "slug": "prometheus",
    "row": 8,
    "rowTitle": "工程化部署、测试与稳定性",
    "category": "Metrics Monitoring",
    "brandColor": "#E6522C",
    "shortDescription": "Time-series metrics collection, PromQL querying, and real-time alerts 📈",
    "positioning": "PromQL Queries, Scrape Targets & Service Level Objectives",
    "relatedProjects": [
      "marymount"
    ]
  },
  {
    "id": "grafana",
    "name": "Grafana",
    "slug": "grafana",
    "row": 8,
    "rowTitle": "工程化部署、测试与稳定性",
    "category": "Telemetry Dashboards",
    "brandColor": "#F46800",
    "shortDescription": "Visual observability dashboards tracking system performance and telemetry 📊",
    "positioning": "Observability Dashboards & Telemetry Visualization",
    "relatedProjects": [
      "marymount"
    ]
  },
  {
    "id": "sentry",
    "name": "Sentry",
    "slug": "sentry",
    "row": 8,
    "rowTitle": "工程化部署、测试与稳定性",
    "category": "Error Tracking",
    "brandColor": "#362D59",
    "shortDescription": "Real-time stack trace capture, performance tracing, and release health 🚨",
    "positioning": "Error Boundary Reporting, Performance Spans & Release Monitoring",
    "relatedProjects": [
      "marymount",
      "chronos"
    ]
  },
  {
    "id": "pytest",
    "name": "Pytest",
    "slug": "pytest",
    "row": 8,
    "rowTitle": "工程化部署、测试与稳定性",
    "category": "Python Testing",
    "brandColor": "#0A9EDC",
    "shortDescription": "Fixtures, parameterized test runs, and mock assertions for Python codebases 🧪",
    "positioning": "Automated Unit Tests, Mocking & Regression Suites",
    "relatedProjects": [
      "lcml"
    ]
  },
  {
    "id": "playwright",
    "name": "Playwright",
    "slug": "playwright",
    "row": 8,
    "rowTitle": "工程化部署、测试与稳定性",
    "category": "End-to-End Testing",
    "brandColor": "#2EAD33",
    "shortDescription": "Fast, reliable cross-browser automation and visual regression testing 🎭",
    "positioning": "E2E User Journeys, Snapshot Assertions & Headless CI Runs",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "celery",
    "name": "Celery / BullMQ",
    "slug": "celery",
    "row": 8,
    "rowTitle": "工程化部署、测试与稳定性",
    "category": "Task Queue",
    "brandColor": "#37814A",
    "shortDescription": "Distributed asynchronous job execution, scheduled cron, and retry backoff 📬",
    "positioning": "Asynchronous Job Workers, Dead-Letter Queues & Scheduled Tasks",
    "relatedProjects": [
      "marymount",
      "lcml"
    ]
  },
  {
    "id": "opentelemetry",
    "name": "OpenTelemetry",
    "slug": "opentelemetry",
    "row": 8,
    "rowTitle": "工程化部署、测试与稳定性",
    "category": "Distributed Tracing",
    "brandColor": "#425CC7",
    "shortDescription": "Vendor-neutral telemetry standard for distributed traces, metrics, and logs 📡",
    "positioning": "OTel Instrumentation, Context Propagation & Distributed Tracing",
    "relatedProjects": [
      "marymount"
    ]
  }
];

// Group skills by their designated row (1-8)
export const SKILLS_BY_ROW: Record<number, SkillItem[]> = {
  1: SKILLS_DATA.filter((s) => s.row === 1),
  2: SKILLS_DATA.filter((s) => s.row === 2),
  3: SKILLS_DATA.filter((s) => s.row === 3),
  4: SKILLS_DATA.filter((s) => s.row === 4),
  5: SKILLS_DATA.filter((s) => s.row === 5),
  6: SKILLS_DATA.filter((s) => s.row === 6),
  7: SKILLS_DATA.filter((s) => s.row === 7),
  8: SKILLS_DATA.filter((s) => s.row === 8),
};

// Skill Icons mapping directly derived from SKILLS_DATA for TechLogo consumption
export const SKILL_ICONS: Record<
  string,
  { id: string; slug: string; name: string; brandColor: string; cdnUrl: string; iconUrl?: string }
> = Object.fromEntries(
  SKILLS_DATA.map((s) => [
    s.id,
    {
      id: s.id,
      slug: s.slug,
      name: s.name,
      brandColor: s.brandColor,
      cdnUrl: s.icon || `https://cdn.simpleicons.org/${s.slug}`,
      iconUrl: s.icon,
    },
  ])
);
