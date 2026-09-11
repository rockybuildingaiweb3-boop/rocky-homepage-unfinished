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
  id: string;
  label: string;
  title: string;
  subtitle: string;
}

export const SKILL_ROWS: SkillRowDefinition[] = [
  {
    "row": 1,
    "id": "frontend",
    "label": "frontend",
    "title": "Core Frontend & Interaction",
    "subtitle": "Core Frontend & Kinetic Motion"
  },
  {
    "row": 2,
    "id": "space",
    "label": "space",
    "title": "3D & Graphics",
    "subtitle": "3D Spatial Computing & Graphics"
  },
  {
    "row": 3,
    "id": "systems",
    "label": "systems",
    "title": "Backend, Data & Infrastructure",
    "subtitle": "Backend, Data & Infrastructure"
  },
  {
    "row": 4,
    "id": "web3",
    "label": "web3",
    "title": "Web3 & Decentralized",
    "subtitle": "Web3 & Decentralized Architecture"
  },
  {
    "row": 5,
    "id": "models",
    "label": "models",
    "title": "AI Models & SDKs",
    "subtitle": "AI Models & Inference Engineering"
  },
  {
    "row": 6,
    "id": "agents",
    "label": "agents",
    "title": "AI Agent Frameworks",
    "subtitle": "AI Agents & Workflow Orchestration"
  },
  {
    "row": 7,
    "id": "retrieval",
    "label": "retrieval",
    "title": "RAG & Vector Databases",
    "subtitle": "RAG Knowledge Base & Retrieval"
  },
  {
    "row": 8,
    "id": "engineering",
    "label": "engineering",
    "title": "DevOps, Testing & Observability",
    "subtitle": "Engineering Deployment, Testing & Reliability"
  }
];

export interface SkillCategoryLegend {
  id: string;
  label: string;
  row: number;
}

export const SKILL_CATEGORIES: SkillCategoryLegend[] = [
  { id: 'all', label: 'all', row: 0 },
  ...SKILL_ROWS.map((r) => ({ id: r.id, label: r.label, row: r.row })),
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
    title: 'Grillzzy Online',
    number: '05',
    category: 'E-Commerce Platform',
    image: '/assets/imgs/work-back/grillzzy/cover.jpg',
  },
  aurora: {
    title: 'Aurora Engine',
    number: '06',
    category: 'Agentic AI Workflows',
    image: '/assets/imgs/work-back/aurora/cover.jpg',
  },
  chronos: {
    title: 'Chronos Terminal',
    number: '07',
    category: 'Web3 & Financial Systems',
    image: '/assets/imgs/work-back/chronos/cover.jpg',
  },
};

export const SKILLS_DATA: SkillItem[] = [
  {
    "id": "typescript",
    "name": "TypeScript",
    "slug": "typescript",
    "row": 1,
    "rowTitle": "Core Frontend & Interaction",
    "category": "Language & Static Typing",
    "brandColor": "#3178C6",
    "shortDescription": "Strict compile-time contracts and structural typing",
    "positioning": "Strict Type System & Advanced Generics Architecture",
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
    "rowTitle": "Core Frontend & Interaction",
    "category": "Language Core",
    "brandColor": "#F7DF1E",
    "shortDescription": "Dynamic ECMAScript runtime, asynchronous event loops & modern web APIs",
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
    "rowTitle": "Core Frontend & Interaction",
    "category": "Component Architecture",
    "brandColor": "#61DAFB",
    "shortDescription": "Concurrent rendering, fiber tree reconciliation & reactive state primitives",
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
    "rowTitle": "Core Frontend & Interaction",
    "category": "Full-Stack Framework",
    "brandColor": "#000000",
    "shortDescription": "Server Components, streaming SSR, and edge optimized routing",
    "positioning": "Full-Stack Hybrid Rendering & Edge Infrastructure",
    "relatedProjects": [
      "marymount",
      "aurora"
    ]
  },
  {
    "id": "svelte",
    "name": "Svelte",
    "slug": "svelte",
    "row": 1,
    "rowTitle": "Core Frontend & Interaction",
    "category": "Reactive Framework",
    "brandColor": "#FF3E00",
    "shortDescription": "Compile-time reactive primitives with zero virtual DOM overhead",
    "positioning": "Svelte 5 Runes & Reactive Component Compilation",
    "relatedProjects": [
      "v1"
    ]
  },
  {
    "id": "tailwindcss",
    "name": "Tailwind CSS",
    "slug": "tailwindcss",
    "row": 1,
    "rowTitle": "Core Frontend & Interaction",
    "category": "Utility-First Styling",
    "brandColor": "#06B6D4",
    "shortDescription": "Design token styling with responsive breakpoint fluidity",
    "positioning": "Tailwind v4 Engine & Modern Atomic Styling Systems",
    "relatedProjects": [
      "chronos",
      "aurora",
      "grillzzy"
    ]
  },
  {
    "id": "framer",
    "name": "Framer Motion",
    "slug": "framer",
    "row": 1,
    "rowTitle": "Core Frontend & Interaction",
    "category": "Kinetic Physics",
    "brandColor": "#0055FF",
    "shortDescription": "Spring physics choreography and gesture driven UI interactions",
    "positioning": "Physical Animation Dynamics & Layout Projections",
    "relatedProjects": [
      "v1",
      "chronos"
    ]
  },
  {
    "id": "greensock",
    "name": "GSAP",
    "slug": "greensock",
    "row": 1,
    "rowTitle": "Core Frontend & Interaction",
    "category": "Timeline Animation",
    "brandColor": "#88CE02",
    "shortDescription": "High-performance timeline sequencing and scroll-driven transformations",
    "positioning": "High-Performance Timeline Sequencing & ScrollTrigger",
    "relatedProjects": [
      "marymount",
      "lcml"
    ]
  },
  {
    "id": "html5",
    "name": "HTML5",
    "slug": "html5",
    "row": 1,
    "rowTitle": "Core Frontend & Interaction",
    "category": "Semantic Document Structure",
    "brandColor": "#E34F26",
    "shortDescription": "Accessible semantic document structuring and WAI-ARIA standards",
    "positioning": "Accessible Document Object Model & Microdata Architecture",
    "relatedProjects": [
      "kic",
      "lcml"
    ]
  },
  {
    "id": "vite",
    "name": "Vite",
    "slug": "vite",
    "row": 1,
    "rowTitle": "Core Frontend & Interaction",
    "category": "Build Tooling",
    "brandColor": "#646CFF",
    "shortDescription": "Native ESM dev server and optimized Rollup production bundles",
    "positioning": "Next-Generation Frontend Tooling & Bundle Optimization",
    "relatedProjects": [
      "chronos",
      "aurora",
      "grillzzy"
    ]
  },
  {
    "id": "threedotjs",
    "name": "Three.js",
    "slug": "threedotjs",
    "row": 2,
    "rowTitle": "3D & Graphics",
    "category": "WebGL Scene Graph",
    "brandColor": "#049EF4",
    "shortDescription": "Scene graph hierarchies, lighting models, and procedural geometry",
    "positioning": "WebGL 3D Scene Graphs & Procedural Mesh Synthesis",
    "relatedProjects": [
      "v1",
      "chronos"
    ]
  },
  {
    "id": "webgl",
    "name": "WebGL",
    "slug": "webgl",
    "row": 2,
    "rowTitle": "3D & Graphics",
    "category": "Hardware Graphics API",
    "brandColor": "#990000",
    "shortDescription": "Hardware-accelerated rasterization and framebuffer post-processing",
    "positioning": "Low-Level Graphics Pipeline & Framebuffer Architecture",
    "relatedProjects": [
      "v1",
      "chronos"
    ]
  },
  {
    "id": "glsl",
    "name": "GLSL",
    "slug": "glsl",
    "row": 2,
    "rowTitle": "3D & Graphics",
    "category": "Shader Programming",
    "brandColor": "#5586A4",
    "shortDescription": "Vertex displacement, fragment raymarching, and procedural noise shaders",
    "positioning": "Custom Vertex Displacement & Fragment Raymarching Shaders",
    "relatedProjects": [
      "v1",
      "chronos"
    ]
  },
  {
    "id": "webgpu",
    "name": "WebGPU",
    "slug": "webgpu",
    "row": 2,
    "rowTitle": "3D & Graphics",
    "category": "Next-Gen Compute & Graphics",
    "brandColor": "#005A9C",
    "shortDescription": "Direct hardware command queues and high-throughput WGSL compute shaders",
    "positioning": "Hardware Compute Shaders & Next-Generation Web Rendering",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "r3f",
    "name": "React Three Fiber",
    "slug": "r3f",
    "row": 2,
    "rowTitle": "3D & Graphics",
    "category": "Declarative 3D Canvas",
    "brandColor": "#E0234E",
    "shortDescription": "Declarative React reconciler for Three.js stateful canvas scenes",
    "positioning": "Declarative 3D Scene Reconciler & Drei Ecosystem",
    "relatedProjects": [
      "v1",
      "chronos"
    ]
  },
  {
    "id": "blender",
    "name": "Blender",
    "slug": "blender",
    "row": 2,
    "rowTitle": "3D & Graphics",
    "category": "3D Modeling & DCC",
    "brandColor": "#E87D0D",
    "shortDescription": "Subdivision modeling, UV unwrapping, and real-time glTF asset optimization",
    "positioning": "Poly Modeling, Rigging & Real-Time glTF Pipeline",
    "relatedProjects": [
      "v1",
      "aurora"
    ]
  },
  {
    "id": "spline",
    "name": "Spline",
    "slug": "spline",
    "row": 2,
    "rowTitle": "3D & Graphics",
    "category": "Interactive 3D Design",
    "brandColor": "#5266EB",
    "shortDescription": "Web-native 3D scenes, physics simulations, and state transition interactions",
    "positioning": "Web-Native 3D Design & Interactive Event Triggers",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "draco",
    "name": "Draco",
    "slug": "draco",
    "row": 2,
    "rowTitle": "3D & Graphics",
    "category": "Geometry Compression",
    "brandColor": "#F58220",
    "shortDescription": "High-ratio geometry compression reducing 3D web asset transmission sizes",
    "positioning": "3D Mesh Quantization & Buffer Optimization Pipeline",
    "relatedProjects": [
      "v1"
    ]
  },
  {
    "id": "canvasapi",
    "name": "Canvas API",
    "slug": "canvasapi",
    "row": 2,
    "rowTitle": "3D & Graphics",
    "category": "2D Pixel Manipulation",
    "brandColor": "#F05032",
    "shortDescription": "Immediate mode 2D pixel rendering, particle physics, and image filters",
    "positioning": "Immediate Mode 2D Graphics & Particle Systems",
    "relatedProjects": [
      "v1",
      "lcml"
    ]
  },
  {
    "id": "babylondotjs",
    "name": "Babylon.js",
    "slug": "babylondotjs",
    "row": 2,
    "rowTitle": "3D & Graphics",
    "category": "Real-Time 3D Engine",
    "brandColor": "#BB464B",
    "shortDescription": "Comprehensive real-time 3D engine with PBR shaders and spatial physics",
    "positioning": "Browser Game Engine & Physical Materials Architecture",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "nodedotjs",
    "name": "Node.js",
    "slug": "nodedotjs",
    "row": 3,
    "rowTitle": "Backend, Data & Infrastructure",
    "category": "JavaScript Runtime",
    "brandColor": "#5FA04E",
    "shortDescription": "Asynchronous event loop runtime powering scalable backend microservices",
    "positioning": "Event-Driven Server Architecture & Microservices",
    "relatedProjects": [
      "marymount",
      "kic",
      "grillzzy"
    ]
  },
  {
    "id": "express",
    "name": "Express",
    "slug": "express",
    "row": 3,
    "rowTitle": "Backend, Data & Infrastructure",
    "category": "HTTP Routing Engine",
    "brandColor": "#000000",
    "shortDescription": "Minimalist HTTP routing engine and robust middleware pipeline",
    "positioning": "RESTful Middleware & API Routing Pipelines",
    "relatedProjects": [
      "marymount",
      "kic"
    ]
  },
  {
    "id": "fastapi",
    "name": "FastAPI",
    "slug": "fastapi",
    "row": 3,
    "rowTitle": "Backend, Data & Infrastructure",
    "category": "Async Python Framework",
    "brandColor": "#009688",
    "shortDescription": "High-throughput async Python APIs serving real-time model inference",
    "positioning": "Asynchronous High-Throughput Model Serving",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "postgresql",
    "name": "PostgreSQL",
    "slug": "postgresql",
    "row": 3,
    "rowTitle": "Backend, Data & Infrastructure",
    "category": "Relational Database",
    "brandColor": "#4169E1",
    "shortDescription": "ACID transactions, relational integrity, and robust indexing capabilities",
    "positioning": "Relational Schema Design & ACID Transactional Systems",
    "relatedProjects": [
      "marymount",
      "kic"
    ]
  },
  {
    "id": "supabase",
    "name": "Supabase",
    "slug": "supabase",
    "row": 3,
    "rowTitle": "Backend, Data & Infrastructure",
    "category": "Open Source Backend",
    "brandColor": "#3ECF8E",
    "shortDescription": "Postgres-native backend with instant realtime and Row Level Security",
    "positioning": "PostgreSQL-as-a-Service, Auth & Edge Realtime",
    "relatedProjects": [
      "aurora",
      "chronos"
    ]
  },
  {
    "id": "prisma",
    "name": "Prisma",
    "slug": "prisma",
    "row": 3,
    "rowTitle": "Backend, Data & Infrastructure",
    "category": "Type-Safe ORM",
    "brandColor": "#2D3748",
    "shortDescription": "Declarative schema modeling and type-safe database query generation",
    "positioning": "Type-Safe Data Modeling & Automated Migration Engine",
    "relatedProjects": [
      "marymount"
    ]
  },
  {
    "id": "drizzle",
    "name": "Drizzle",
    "slug": "drizzle",
    "row": 3,
    "rowTitle": "Backend, Data & Infrastructure",
    "category": "Zero-Overhead SQL ORM",
    "brandColor": "#C5F74F",
    "shortDescription": "SQL-like syntax, edge serverless compatibility, and zero runtime overhead",
    "positioning": "Serverless Edge SQL ORM & Microsecond Query Planning",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "redis",
    "name": "Redis",
    "slug": "redis",
    "row": 3,
    "rowTitle": "Backend, Data & Infrastructure",
    "category": "In-Memory Store",
    "brandColor": "#FF4438",
    "shortDescription": "Sub-millisecond in-memory caching, distributed locks, and pub/sub queues",
    "positioning": "Distributed In-Memory Caching & Real-Time Event Brokers",
    "relatedProjects": [
      "kic",
      "grillzzy"
    ]
  },
  {
    "id": "trpc",
    "name": "tRPC",
    "slug": "trpc",
    "row": 3,
    "rowTitle": "Backend, Data & Infrastructure",
    "category": "End-to-End Type Safety",
    "brandColor": "#2596BE",
    "shortDescription": "End-to-end type safety between client and server without code generation",
    "positioning": "Full-Stack Type Inference Across Network Boundaries",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "graphql",
    "name": "GraphQL",
    "slug": "graphql",
    "row": 3,
    "rowTitle": "Backend, Data & Infrastructure",
    "category": "API Query Language",
    "brandColor": "#E10098",
    "shortDescription": "Declarative data fetching across federated schemas with precise queries",
    "positioning": "Declarative Client Data Fetching & Federated Schemas",
    "relatedProjects": [
      "marymount"
    ]
  },
  {
    "id": "solidity",
    "name": "Solidity",
    "slug": "solidity",
    "row": 4,
    "rowTitle": "Web3 & Decentralized",
    "category": "Smart Contract Language",
    "brandColor": "#363636",
    "shortDescription": "Turing-complete immutable logic secured on distributed EVM state",
    "positioning": "EVM Smart Contract Engineering & Gas Optimization",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "viem",
    "name": "viem",
    "slug": "viem",
    "row": 4,
    "rowTitle": "Web3 & Decentralized",
    "category": "TypeScript Ethereum Interface",
    "brandColor": "#1E1E1E",
    "shortDescription": "Lightweight, composable, and type-safe low-level interface for Ethereum",
    "positioning": "High-Performance EVM Interface & Pure Function Primitives",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "wagmi",
    "name": "wagmi",
    "slug": "wagmi",
    "row": 4,
    "rowTitle": "Web3 & Decentralized",
    "category": "React Web3 Hooks",
    "brandColor": "#F5841F",
    "shortDescription": "React hooks for wallet connection, contract interaction, and ENS lookup",
    "positioning": "Declarative Ethereum React Hooks & Connector Lifecycle",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "ethers",
    "name": "Ethers.js",
    "slug": "ethers",
    "row": 4,
    "rowTitle": "Web3 & Decentralized",
    "category": "Ethereum Client SDK",
    "brandColor": "#2535A0",
    "shortDescription": "Complete and compact library for interacting with Ethereum and wallets",
    "positioning": "Cryptographic Signing & Smart Contract Abstraction Layer",
    "relatedProjects": [
      "chronos",
      "v1"
    ]
  },
  {
    "id": "foundry",
    "name": "Foundry",
    "slug": "foundry",
    "row": 4,
    "rowTitle": "Web3 & Decentralized",
    "category": "Smart Contract Toolchain",
    "brandColor": "#D35400",
    "shortDescription": "Blazing-fast Solidity testing, fuzzing, and EVM gas profiling in Rust",
    "positioning": "Rust-Powered Solidity Testing, Fuzzing & Gas Profiling",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "privy",
    "name": "Privy",
    "slug": "privy",
    "row": 4,
    "rowTitle": "Web3 & Decentralized",
    "category": "Embedded Auth & Wallets",
    "brandColor": "#6366F1",
    "shortDescription": "Frictionless web3 onboarding with embedded passkey and social wallets",
    "positioning": "Progressive Web3 Onboarding & Embedded Self-Custody Wallets",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "erc4337",
    "name": "ERC-4337",
    "slug": "erc4337",
    "row": 4,
    "rowTitle": "Web3 & Decentralized",
    "category": "Account Abstraction",
    "brandColor": "#8C4FFF",
    "shortDescription": "Smart contract accounts with user operations, paymasters, and session keys",
    "positioning": "Smart Contract Accounts, UserOps & Gas Paymasters",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "thegraph",
    "name": "The Graph",
    "slug": "thegraph",
    "row": 4,
    "rowTitle": "Web3 & Decentralized",
    "category": "Blockchain Indexing Protocol",
    "brandColor": "#0C0A1D",
    "shortDescription": "Decentralized indexing and GraphQL querying of blockchain state and events",
    "positioning": "Decentralized Subgraph Indexing & Real-Time Event Extraction",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "ipfs",
    "name": "IPFS",
    "slug": "ipfs",
    "row": 4,
    "rowTitle": "Web3 & Decentralized",
    "category": "Distributed Storage",
    "brandColor": "#65C2CB",
    "shortDescription": "Peer-to-peer hypermedia protocol for content-addressed immutable files",
    "positioning": "Content-Addressed Peer-to-Peer File Distribution",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "siwe",
    "name": "SIWE",
    "slug": "siwe",
    "row": 4,
    "rowTitle": "Web3 & Decentralized",
    "category": "Cryptographic Authentication",
    "brandColor": "#627EEA",
    "shortDescription": "Sign-In with Ethereum enabling decentralized cryptographic authentication",
    "positioning": "EIP-4361 Cryptographic Session Authentication Standard",
    "relatedProjects": [
      "chronos"
    ]
  },
  {
    "id": "openai",
    "name": "OpenAI",
    "slug": "openai",
    "row": 5,
    "rowTitle": "AI Models & SDKs",
    "category": "Frontier AI Research",
    "brandColor": "#10A37F",
    "shortDescription": "Frontier reasoning models, multimodal vision, and structured tool calling",
    "positioning": "GPT-4o & o-Series Advanced Reasoning Orchestration",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "anthropic",
    "name": "Anthropic",
    "slug": "anthropic",
    "row": 5,
    "rowTitle": "AI Models & SDKs",
    "category": "Constitutional AI & Claude",
    "brandColor": "#D97706",
    "shortDescription": "Constitutional reasoning, long-context comprehension, and MCP integration",
    "positioning": "Claude 3.5 Sonnet & Extended Context Engineering",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "googlegemini",
    "name": "Google Gemini",
    "slug": "googlegemini",
    "row": 5,
    "rowTitle": "AI Models & SDKs",
    "category": "Native Multimodal Intelligence",
    "brandColor": "#4285F4",
    "shortDescription": "Native multimodal reasoning across video, audio, code, and long contexts",
    "positioning": "Gemini 1.5 Pro & 2M Token Multimodal Context Processing",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "deepseek",
    "name": "DeepSeek",
    "slug": "deepseek",
    "row": 5,
    "rowTitle": "AI Models & SDKs",
    "category": "MoE Frontier Architecture",
    "brandColor": "#4D6BFE",
    "shortDescription": "High-efficiency mixture-of-experts architecture and math reasoning models",
    "positioning": "DeepSeek-R1 & V3 Open Reasoning Infrastructure",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "qwen",
    "name": "Qwen",
    "slug": "qwen",
    "row": 5,
    "rowTitle": "AI Models & SDKs",
    "category": "Multilingual Foundation Models",
    "brandColor": "#615CED",
    "shortDescription": "Enterprise-grade multilingual reasoning, coding, and vision foundation models",
    "positioning": "Qwen 2.5 Multi-Task Foundation Model Ecosystem",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "vercel",
    "name": "Vercel AI SDK",
    "slug": "vercel",
    "row": 5,
    "rowTitle": "AI Models & SDKs",
    "category": "Unified AI UI Framework",
    "brandColor": "#000000",
    "shortDescription": "Unified TypeScript library for streaming LLM text, objects, and generative UI",
    "positioning": "Unified Streaming Text, Object Generation & Generative UI",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "ollama",
    "name": "Ollama",
    "slug": "ollama",
    "row": 5,
    "rowTitle": "AI Models & SDKs",
    "category": "Local Model Execution",
    "brandColor": "#FFFFFF",
    "shortDescription": "Local LLM execution with optimized quantization and unified REST inference APIs",
    "positioning": "Local Quantized Model Serving & Offline Inference",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "huggingface",
    "name": "Hugging Face",
    "slug": "huggingface",
    "row": 5,
    "rowTitle": "AI Models & SDKs",
    "category": "Open Source AI Hub",
    "brandColor": "#FFD21E",
    "shortDescription": "The collaborative hub for open weights, transformers, and model hosting",
    "positioning": "Open Model Registry, Transformers & Inference Endpoints",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "groq",
    "name": "Groq",
    "slug": "groq",
    "row": 5,
    "rowTitle": "AI Models & SDKs",
    "category": "LPU Inference Acceleration",
    "brandColor": "#F55036",
    "shortDescription": "Deterministic LPUs delivering ultra-low-latency real-time token generation",
    "positioning": "Linear Processor Unit (LPU) Ultra-Fast Token Inference",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "togetherai",
    "name": "Together AI",
    "slug": "togetherai",
    "row": 5,
    "rowTitle": "AI Models & SDKs",
    "category": "Cloud Model Inference",
    "brandColor": "#0F6FFF",
    "shortDescription": "High-throughput cloud inference engine serving leading open-source models",
    "positioning": "Decentralized High-Throughput Open Model Cloud Serving",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "langchain",
    "name": "LangChain",
    "slug": "langchain",
    "row": 6,
    "rowTitle": "AI Agent Frameworks",
    "category": "Composable Agent Chaining",
    "brandColor": "#1C3C3C",
    "shortDescription": "Composing multi-step reasoning chains with contextual tools and memory",
    "positioning": "Composable Prompt Pipelines & Tool Execution Engine",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "langgraph",
    "name": "LangGraph",
    "slug": "langgraph",
    "row": 6,
    "rowTitle": "AI Agent Frameworks",
    "category": "Cyclic State Orchestration",
    "brandColor": "#FF6B4A",
    "shortDescription": "Cyclic state machines and human-in-the-loop multi-agent coordination",
    "positioning": "Cyclic Graph State Machines & Multi-Agent Checkpointing",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "llamaindex",
    "name": "LlamaIndex",
    "slug": "llamaindex",
    "row": 6,
    "rowTitle": "AI Agent Frameworks",
    "category": "Context Augmentation Data",
    "brandColor": "#8C52FF",
    "shortDescription": "Context augmentation, structured indexing, and data connectors for LLMs",
    "positioning": "Data Connectors, Ingestion Workflows & Context Indexing",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "crewai",
    "name": "CrewAI",
    "slug": "crewai",
    "row": 6,
    "rowTitle": "AI Agent Frameworks",
    "category": "Role-Playing Multi-Agents",
    "brandColor": "#FF4500",
    "shortDescription": "Collaborative role-playing autonomous agents executing sequential workflows",
    "positioning": "Role-Playing Autonomous Crews & Hierarchical Task Execution",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "autogen",
    "name": "AutoGen",
    "slug": "autogen",
    "row": 6,
    "rowTitle": "AI Agent Frameworks",
    "category": "Multi-Agent Conversation",
    "brandColor": "#0078D4",
    "shortDescription": "Event-driven conversational agent framework enabling complex task solving",
    "positioning": "Conversational Agent Architecture & Multi-Party Orchestration",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "dify",
    "name": "Dify",
    "slug": "dify",
    "row": 6,
    "rowTitle": "AI Agent Frameworks",
    "category": "LLM App Workflow Engine",
    "brandColor": "#155EEF",
    "shortDescription": "Visual orchestration pipeline combining prompt engineering, RAG, and agent ops",
    "positioning": "Visual Agentic Workflow Design & Production LLMOps",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "coze",
    "name": "Coze",
    "slug": "coze",
    "row": 6,
    "rowTitle": "AI Agent Frameworks",
    "category": "Next-Gen Bot Architecture",
    "brandColor": "#304FFE",
    "shortDescription": "All-in-one AI chatbot development platform with rich plugin integrations",
    "positioning": "All-in-One Bot Logic & Multi-Modal Plugin Ecosystem",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "semantickernel",
    "name": "Semantic Kernel",
    "slug": "semantickernel",
    "row": 6,
    "rowTitle": "AI Agent Frameworks",
    "category": "Enterprise Agent SDK",
    "brandColor": "#008AD7",
    "shortDescription": "Lightweight enterprise SDK integrating AI large language models with native code",
    "positioning": "Enterprise Semantic Function Orchestration & Native Code Plugins",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "mcp",
    "name": "MCP",
    "slug": "mcp",
    "row": 6,
    "rowTitle": "AI Agent Frameworks",
    "category": "Model Context Protocol",
    "brandColor": "#10B981",
    "shortDescription": "Open standard protocol connecting LLMs seamlessly with external context & tools",
    "positioning": "Anthropic Model Context Protocol Server & Client Implementation",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "haystack",
    "name": "Haystack",
    "slug": "haystack",
    "row": 6,
    "rowTitle": "AI Agent Frameworks",
    "category": "End-to-End LLM Pipelines",
    "brandColor": "#0EAF9C",
    "shortDescription": "Modular Python framework for building custom semantic search and agent pipelines",
    "positioning": "Modular Component Pipelines & Semantic Document Processing",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "pgvector",
    "name": "pgvector",
    "slug": "pgvector",
    "row": 7,
    "rowTitle": "RAG & Vector Databases",
    "category": "Postgres Vector Extension",
    "brandColor": "#336791",
    "shortDescription": "Exact & approximate nearest neighbor search directly inside PostgreSQL",
    "positioning": "PostgreSQL HNSW & IVFFlat High-Dimensional Indexing",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "chroma",
    "name": "Chroma",
    "slug": "chroma",
    "row": 7,
    "rowTitle": "RAG & Vector Databases",
    "category": "AI Native Embeddings Database",
    "brandColor": "#FF6B6B",
    "shortDescription": "Open-source embeddings database built for developer simplicity and rapid RAG",
    "positioning": "Embedded & Distributed Vector Storage for Rapid Prototyping",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "milvus",
    "name": "Milvus",
    "slug": "milvus",
    "row": 7,
    "rowTitle": "RAG & Vector Databases",
    "category": "Massive Scale Vector Storage",
    "brandColor": "#00A1EA",
    "shortDescription": "Cloud-native vector database architected for billion-scale similarity search",
    "positioning": "Billion-Scale Distributed Vector Architecture & Sharding",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "weaviate",
    "name": "Weaviate",
    "slug": "weaviate",
    "row": 7,
    "rowTitle": "RAG & Vector Databases",
    "category": "Hybrid Vector & BM25 Search",
    "brandColor": "#00D084",
    "shortDescription": "Open-source vector database supporting hybrid vector and keyword BM25 search",
    "positioning": "Hybrid Dense Vector & BM25 Sparse Search Engine",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "qdrant",
    "name": "Qdrant",
    "slug": "qdrant",
    "row": 7,
    "rowTitle": "RAG & Vector Databases",
    "category": "Rust Vector Engine",
    "brandColor": "#DC2626",
    "shortDescription": "Vector similarity search engine with extended payload filtering written in Rust",
    "positioning": "Rust Memory-Safe Vector Indexing & Complex Payload Filtering",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "pinecone",
    "name": "Pinecone",
    "slug": "pinecone",
    "row": 7,
    "rowTitle": "RAG & Vector Databases",
    "category": "Managed Serverless Vector DB",
    "brandColor": "#27272A",
    "shortDescription": "Fully managed serverless vector database engineered for fast index freshness",
    "positioning": "Managed Serverless Vector DB with Instant Index Freshness",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "llamaparse",
    "name": "LlamaParse",
    "slug": "llamaparse",
    "row": 7,
    "rowTitle": "RAG & Vector Databases",
    "category": "Document Extraction for RAG",
    "brandColor": "#6366F1",
    "shortDescription": "GenAI-native document parser transforming complex PDFs into clean structured markdown",
    "positioning": "GenAI Multimodal PDF Parsing & Tabular Extraction",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "unstructured",
    "name": "Unstructured",
    "slug": "unstructured",
    "row": 7,
    "rowTitle": "RAG & Vector Databases",
    "category": "ETL Pipeline for LLMs",
    "brandColor": "#4F46E5",
    "shortDescription": "Modular data preparation platform ingesting unstructured documents into vector pipelines",
    "positioning": "Document Chunking, Cleaning & Embedding ETL Ingestion",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "cohere",
    "name": "Cohere",
    "slug": "cohere",
    "row": 7,
    "rowTitle": "RAG & Vector Databases",
    "category": "Enterprise Rerank & Embeddings",
    "brandColor": "#39594D",
    "shortDescription": "Leading multilingual embeddings and state-of-the-art semantic reranking models",
    "positioning": "Enterprise Multilingual Embeddings & Semantic Rerank-v3",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "voyageai",
    "name": "Voyage AI",
    "slug": "voyageai",
    "row": 7,
    "rowTitle": "RAG & Vector Databases",
    "category": "Domain-Specialized Embeddings",
    "brandColor": "#3B82F6",
    "shortDescription": "State-of-the-art embedding and reranker models optimized for finance and code",
    "positioning": "Domain-Customized Dense Embeddings & Context Retrieval",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "docker",
    "name": "Docker",
    "slug": "docker",
    "row": 8,
    "rowTitle": "DevOps, Testing & Observability",
    "category": "Container Isolation",
    "brandColor": "#2496ED",
    "shortDescription": "Lightweight OS-level virtualization guaranteeing consistent runtime environments",
    "positioning": "Multi-Stage Container Builds & Ephemeral Environments",
    "relatedProjects": [
      "marymount",
      "kic"
    ]
  },
  {
    "id": "kubernetes",
    "name": "Kubernetes",
    "slug": "kubernetes",
    "row": 8,
    "rowTitle": "DevOps, Testing & Observability",
    "category": "Container Orchestration",
    "brandColor": "#326CE5",
    "shortDescription": "Automated container deployment, horizontal scaling, and declarative management",
    "positioning": "Declarative Cluster Orchestration & Ingress Controllers",
    "relatedProjects": [
      "kic"
    ]
  },
  {
    "id": "githubactions",
    "name": "GitHub Actions",
    "slug": "githubactions",
    "row": 8,
    "rowTitle": "DevOps, Testing & Observability",
    "category": "CI/CD Automation",
    "brandColor": "#2088FF",
    "shortDescription": "Continuous integration and continuous deployment pipelines triggered by git events",
    "positioning": "Declarative CI/CD Workflows, Security Audits & Matrix Builds",
    "relatedProjects": [
      "marymount",
      "chronos"
    ]
  },
  {
    "id": "prometheus",
    "name": "Prometheus",
    "slug": "prometheus",
    "row": 8,
    "rowTitle": "DevOps, Testing & Observability",
    "category": "Time-Series Monitoring",
    "brandColor": "#E6522C",
    "shortDescription": "Dimensional data model with PromQL for real-time systems monitoring and alerting",
    "positioning": "Pull-Based Time-Series Telemetry & Alertmanager Rules",
    "relatedProjects": [
      "kic"
    ]
  },
  {
    "id": "grafana",
    "name": "Grafana",
    "slug": "grafana",
    "row": 8,
    "rowTitle": "DevOps, Testing & Observability",
    "category": "Observability Dashboards",
    "brandColor": "#F46800",
    "shortDescription": "Interactive real-time visualization dashboards for telemetry metrics and logs",
    "positioning": "Unified Observability Dashboards & Real-Time Telemetry Panels",
    "relatedProjects": [
      "kic"
    ]
  },
  {
    "id": "sentry",
    "name": "Sentry",
    "slug": "sentry",
    "row": 8,
    "rowTitle": "DevOps, Testing & Observability",
    "category": "Error Tracking & APM",
    "brandColor": "#362D59",
    "shortDescription": "Real-time error monitoring, stack trace diagnostics, and performance profiling",
    "positioning": "Real-Time Error Tracking, Distributed Tracing & Breadcrumbs",
    "relatedProjects": [
      "marymount",
      "chronos"
    ]
  },
  {
    "id": "playwright",
    "name": "Playwright",
    "slug": "playwright",
    "row": 8,
    "rowTitle": "DevOps, Testing & Observability",
    "category": "End-to-End Testing",
    "brandColor": "#2EAD33",
    "shortDescription": "Reliable cross-browser end-to-end automation with auto-waiting and trace recording",
    "positioning": "Cross-Browser Headless E2E Automation & Snapshot Regression",
    "relatedProjects": [
      "marymount"
    ]
  },
  {
    "id": "pytest",
    "name": "Pytest",
    "slug": "pytest",
    "row": 8,
    "rowTitle": "DevOps, Testing & Observability",
    "category": "Python Test Framework",
    "brandColor": "#0A9EDC",
    "shortDescription": "Scalable Python testing framework with fixture dependency injection and parametrization",
    "positioning": "Python Fixture Architecture & Parameterized Testing",
    "relatedProjects": [
      "aurora"
    ]
  },
  {
    "id": "celery",
    "name": "Celery",
    "slug": "celery",
    "row": 8,
    "rowTitle": "DevOps, Testing & Observability",
    "category": "Distributed Task Queue",
    "brandColor": "#37814A",
    "shortDescription": "Asynchronous distributed task execution and scheduling with broker backends",
    "positioning": "Asynchronous Distributed Job Queues & Worker Scheduling",
    "relatedProjects": [
      "kic"
    ]
  },
  {
    "id": "opentelemetry",
    "name": "OpenTelemetry",
    "slug": "opentelemetry",
    "row": 8,
    "rowTitle": "DevOps, Testing & Observability",
    "category": "Unified Telemetry Standard",
    "brandColor": "#000000",
    "shortDescription": "Vendor-neutral telemetry standard for collecting distributed traces, metrics, and logs",
    "positioning": "Distributed Context Propagation & Vendor-Agnostic OTLP Collectors",
    "relatedProjects": [
      "aurora"
    ]
  }
];

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
