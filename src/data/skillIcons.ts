/**
 * SKILL ICONS MAPPING - 100% SIMPLE ICONS OFFICIAL CDN
 * 
 * Strict Icon Constraint:
 * 1. No hand-drawn or generated SVG paths.
 * 2. All tech stack & brand logos strictly use Simple Icons CDN official SVGs:
 *    https://cdn.simpleicons.org/[tech_slug]
 * 3. Optional monochrome with hex: https://cdn.simpleicons.org/[tech_slug]/[hex]
 */

export interface SkillIconDefinition {
  id: string;
  slug: string;
  name: string;
  cdnUrl: string;
  brandColor: string;
}

export const SKILL_ICONS: Record<string, SkillIconDefinition> = {
  // ─── ROW 1: Core Frontend & Kinetic Motion ──────────────────────────────────
  typescript: {
    id: 'typescript',
    slug: 'typescript',
    name: 'TypeScript',
    cdnUrl: 'https://cdn.simpleicons.org/typescript',
    brandColor: '#3178C6',
  },
  javascript: {
    id: 'javascript',
    slug: 'javascript',
    name: 'JavaScript',
    cdnUrl: 'https://cdn.simpleicons.org/javascript',
    brandColor: '#F7DF1E',
  },
  react: {
    id: 'react',
    slug: 'react',
    name: 'React',
    cdnUrl: 'https://cdn.simpleicons.org/react',
    brandColor: '#61DAFB',
  },
  nextjs: {
    id: 'nextjs',
    slug: 'nextdotjs',
    name: 'Next.js',
    cdnUrl: 'https://cdn.simpleicons.org/nextdotjs/white',
    brandColor: '#FFFFFF',
  },
  svelte: {
    id: 'svelte',
    slug: 'svelte',
    name: 'Svelte',
    cdnUrl: 'https://cdn.simpleicons.org/svelte',
    brandColor: '#FF3E00',
  },
  tailwind: {
    id: 'tailwind',
    slug: 'tailwindcss',
    name: 'Tailwind CSS',
    cdnUrl: 'https://cdn.simpleicons.org/tailwindcss',
    brandColor: '#06B6D4',
  },
  motion: {
    id: 'motion',
    slug: 'framer',
    name: 'Framer Motion',
    cdnUrl: 'https://cdn.simpleicons.org/framer',
    brandColor: '#0055FF',
  },
  gsap: {
    id: 'gsap',
    slug: 'greensock',
    name: 'GSAP',
    cdnUrl: 'https://cdn.simpleicons.org/greensock',
    brandColor: '#88CE02',
  },
  html5: {
    id: 'html5',
    slug: 'html5',
    name: 'HTML5',
    cdnUrl: 'https://cdn.simpleicons.org/html5',
    brandColor: '#E34F26',
  },
  vite: {
    id: 'vite',
    slug: 'vite',
    name: 'Vite',
    cdnUrl: 'https://cdn.simpleicons.org/vite',
    brandColor: '#646CFF',
  },

  // ─── ROW 2: 3D Spatial Computing & Graphics ────────────────────────────────
  threejs: {
    id: 'threejs',
    slug: 'threedotjs',
    name: 'Three.js',
    cdnUrl: 'https://cdn.simpleicons.org/threedotjs/white',
    brandColor: '#FFFFFF',
  },
  webgl: {
    id: 'webgl',
    slug: 'webgl',
    name: 'WebGL',
    cdnUrl: 'https://cdn.simpleicons.org/webgl',
    brandColor: '#990000',
  },
  webgpu: {
    id: 'webgpu',
    slug: 'webgpu',
    name: 'WebGPU',
    cdnUrl: 'https://cdn.simpleicons.org/webgpu',
    brandColor: '#005A9C',
  },
  opengl: {
    id: 'opengl',
    slug: 'opengl',
    name: 'OpenGL / GLSL',
    cdnUrl: 'https://cdn.simpleicons.org/opengl',
    brandColor: '#5586A4',
  },
  blender: {
    id: 'blender',
    slug: 'blender',
    name: 'Blender 3D',
    cdnUrl: 'https://cdn.simpleicons.org/blender',
    brandColor: '#F5792A',
  },
  unity: {
    id: 'unity',
    slug: 'unity',
    name: 'Unity Engine',
    cdnUrl: 'https://cdn.simpleicons.org/unity/white',
    brandColor: '#FFFFFF',
  },
  unrealengine: {
    id: 'unrealengine',
    slug: 'unrealengine',
    name: 'Unreal Engine',
    cdnUrl: 'https://cdn.simpleicons.org/unrealengine/white',
    brandColor: '#0E1128',
  },
  vulkan: {
    id: 'vulkan',
    slug: 'vulkan',
    name: 'Vulkan API',
    cdnUrl: 'https://cdn.simpleicons.org/vulkan',
    brandColor: '#AC162C',
  },
  webassembly: {
    id: 'webassembly',
    slug: 'webassembly',
    name: 'WebAssembly',
    cdnUrl: 'https://cdn.simpleicons.org/webassembly',
    brandColor: '#654FF0',
  },
  godotengine: {
    id: 'godotengine',
    slug: 'godotengine',
    name: 'Godot Engine',
    cdnUrl: 'https://cdn.simpleicons.org/godotengine',
    brandColor: '#478CBF',
  },

  // ─── ROW 3: Backend, Systems & Cloud Infrastructure ─────────────────────────
  nodejs: {
    id: 'nodejs',
    slug: 'nodedotjs',
    name: 'Node.js',
    cdnUrl: 'https://cdn.simpleicons.org/nodedotjs',
    brandColor: '#5FA04E',
  },
  express: {
    id: 'express',
    slug: 'express',
    name: 'Express.js',
    cdnUrl: 'https://cdn.simpleicons.org/express/white',
    brandColor: '#FFFFFF',
  },
  nestjs: {
    id: 'nestjs',
    slug: 'nestjs',
    name: 'NestJS',
    cdnUrl: 'https://cdn.simpleicons.org/nestjs',
    brandColor: '#E0234E',
  },
  postgresql: {
    id: 'postgresql',
    slug: 'postgresql',
    name: 'PostgreSQL',
    cdnUrl: 'https://cdn.simpleicons.org/postgresql',
    brandColor: '#4169E1',
  },
  supabase: {
    id: 'supabase',
    slug: 'supabase',
    name: 'Supabase',
    cdnUrl: 'https://cdn.simpleicons.org/supabase',
    brandColor: '#3ECF8E',
  },
  prisma: {
    id: 'prisma',
    slug: 'prisma',
    name: 'Prisma ORM',
    cdnUrl: 'https://cdn.simpleicons.org/prisma/white',
    brandColor: '#2D3748',
  },
  drizzle: {
    id: 'drizzle',
    slug: 'drizzle',
    name: 'Drizzle ORM',
    cdnUrl: 'https://cdn.simpleicons.org/drizzle',
    brandColor: '#C5F74F',
  },
  redis: {
    id: 'redis',
    slug: 'redis',
    name: 'Redis',
    cdnUrl: 'https://cdn.simpleicons.org/redis',
    brandColor: '#FF4438',
  },
  graphql: {
    id: 'graphql',
    slug: 'graphql',
    name: 'GraphQL',
    cdnUrl: 'https://cdn.simpleicons.org/graphql',
    brandColor: '#E10098',
  },
  docker: {
    id: 'docker',
    slug: 'docker',
    name: 'Docker',
    cdnUrl: 'https://cdn.simpleicons.org/docker',
    brandColor: '#2496ED',
  },

  // ─── ROW 4: Web3 & Decentralized Protocols ──────────────────────────────────
  solidity: {
    id: 'solidity',
    slug: 'solidity',
    name: 'Solidity',
    cdnUrl: 'https://cdn.simpleicons.org/solidity/white',
    brandColor: '#AA6746',
  },
  ethereum: {
    id: 'ethereum',
    slug: 'ethereum',
    name: 'Ethereum',
    cdnUrl: 'https://cdn.simpleicons.org/ethereum',
    brandColor: '#627EEA',
  },
  polygon: {
    id: 'polygon',
    slug: 'polygon',
    name: 'Polygon',
    cdnUrl: 'https://cdn.simpleicons.org/polygon',
    brandColor: '#7B3FE4',
  },
  solana: {
    id: 'solana',
    slug: 'solana',
    name: 'Solana',
    cdnUrl: 'https://cdn.simpleicons.org/solana',
    brandColor: '#14F195',
  },
  chainlink: {
    id: 'chainlink',
    slug: 'chainlink',
    name: 'Chainlink',
    cdnUrl: 'https://cdn.simpleicons.org/chainlink',
    brandColor: '#375BD2',
  },
  alchemy: {
    id: 'alchemy',
    slug: 'alchemy',
    name: 'Alchemy',
    cdnUrl: 'https://cdn.simpleicons.org/alchemy',
    brandColor: '#0052FF',
  },
  ipfs: {
    id: 'ipfs',
    slug: 'ipfs',
    name: 'IPFS',
    cdnUrl: 'https://cdn.simpleicons.org/ipfs',
    brandColor: '#65C2CB',
  },
  web3dotjs: {
    id: 'web3dotjs',
    slug: 'web3dotjs',
    name: 'Web3.js',
    cdnUrl: 'https://cdn.simpleicons.org/web3dotjs',
    brandColor: '#F16822',
  },
  bitcoin: {
    id: 'bitcoin',
    slug: 'bitcoin',
    name: 'Bitcoin',
    cdnUrl: 'https://cdn.simpleicons.org/bitcoin',
    brandColor: '#F7931A',
  },
  optimism: {
    id: 'optimism',
    slug: 'optimism',
    name: 'Optimism',
    cdnUrl: 'https://cdn.simpleicons.org/optimism',
    brandColor: '#FF0420',
  },

  // ─── ROW 5: AI Agents, Modern Tooling & Design Engineering ──────────────────
  anthropic: {
    id: 'anthropic',
    slug: 'anthropic',
    name: 'Anthropic Claude',
    cdnUrl: 'https://cdn.simpleicons.org/anthropic',
    brandColor: '#D97706',
  },
  langchain: {
    id: 'langchain',
    slug: 'langchain',
    name: 'LangChain',
    cdnUrl: 'https://cdn.simpleicons.org/langchain',
    brandColor: '#1C3C3C',
  },
  ollama: {
    id: 'ollama',
    slug: 'ollama',
    name: 'Ollama',
    cdnUrl: 'https://cdn.simpleicons.org/ollama/white',
    brandColor: '#FFFFFF',
  },
  huggingface: {
    id: 'huggingface',
    slug: 'huggingface',
    name: 'Hugging Face',
    cdnUrl: 'https://cdn.simpleicons.org/huggingface',
    brandColor: '#FFD21E',
  },
  pytorch: {
    id: 'pytorch',
    slug: 'pytorch',
    name: 'PyTorch',
    cdnUrl: 'https://cdn.simpleicons.org/pytorch',
    brandColor: '#EE4C2C',
  },
  python: {
    id: 'python',
    slug: 'python',
    name: 'Python',
    cdnUrl: 'https://cdn.simpleicons.org/python',
    brandColor: '#3776AB',
  },
  figma: {
    id: 'figma',
    slug: 'figma',
    name: 'Figma',
    cdnUrl: 'https://cdn.simpleicons.org/figma',
    brandColor: '#F24E1E',
  },
  storybook: {
    id: 'storybook',
    slug: 'storybook',
    name: 'Storybook',
    cdnUrl: 'https://cdn.simpleicons.org/storybook',
    brandColor: '#FF4785',
  },
  git: {
    id: 'git',
    slug: 'git',
    name: 'Git',
    cdnUrl: 'https://cdn.simpleicons.org/git',
    brandColor: '#F05032',
  },
  rive: {
    id: 'rive',
    slug: 'rive',
    name: 'Rive',
    cdnUrl: 'https://cdn.simpleicons.org/rive/white',
    brandColor: '#00C8FF',
  },
};
