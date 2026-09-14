/**
 * AUTHORITATIVE MULTI-SOURCE TECHNOLOGY ICON REGISTRY
 * Deterministic multi-source icon resolution for all 88 skills.
 * 
 * Source Priority:
 * 1. Tech Stack Icons (tech-stack-icons package)
 * 2. SVGL (locally cached verified vector assets)
 * 3. Simple Icons (simple-icons package)
 * 4. Verified Existing Local SVG (curated brand and standards assets)
 * 5. Missing State
 * 
 * Classifications:
 * - official-brand: Official company / product brand mark
 * - technology-framework: Open-source project / library / runtime mark
 * - protocol-standard: Official web / blockchain / network standard specification mark
 * - generic-ecosystem: Explicit ecosystem / parent standard representation
 * - missing: No trustworthy logo exists
 */

import {
  siRive,
  siBabylondotjs,
  siPydantic,
  siCelery,
  siWagmi,
  siEthers,
  siIpfs,
  siDify,
  siCoze,
  siHaystack,
  siMilvus,
} from 'simple-icons';
import type { SimpleIcon } from 'simple-icons';

export type IconSourceType =
  | 'tech-stack-icons'
  | 'svgl'
  | 'simple-icons'
  | 'verified-local'
  | 'missing';

export type IconClassification =
  | 'official-brand'
  | 'technology-framework'
  | 'protocol-standard'
  | 'generic-ecosystem'
  | 'missing';

export type VerificationStatus =
  | 'verified'
  | 'generic-representation'
  | 'missing';

export interface SkillIconMetadata {
  source: IconSourceType;
  key: string;
  fallbackLevel: 1 | 2 | 3 | 4 | 5;
  classification: IconClassification;
  status: VerificationStatus;
  sourceAssetId: string;
  brandColor?: string;
  notes?: string;
  url?: string;
  simpleIcon?: SimpleIcon;
}

export interface SkillRegistryEntry {
  id: string;
  name: string;
  icon: SkillIconMetadata;
}

// Backward compatibility types
export type IconDefinition = SkillRegistryEntry;
export type IconType = 'brand' | 'generic' | 'missing';

export type ResolvedSkillIcon =
  | {
      id: string;
      name: string;
      source: 'tech-stack-icons';
      fallbackLevel: 1;
      key: string;
      classification: IconClassification;
      status: VerificationStatus;
      kind: 'tech-stack-icon';
      title: string;
      brandColor?: string;
    }
  | {
      id: string;
      name: string;
      source: 'svgl';
      fallbackLevel: 2;
      key: string;
      url: string;
      classification: IconClassification;
      status: VerificationStatus;
      kind: 'svgl-svg';
      title: string;
      brandColor?: string;
    }
  | {
      id: string;
      name: string;
      source: 'simple-icons';
      fallbackLevel: 3;
      key: string;
      path: string;
      hex: string;
      classification: IconClassification;
      status: VerificationStatus;
      kind: 'svg-path';
      title: string;
      brandColor?: string;
    }
  | {
      id: string;
      name: string;
      source: 'verified-local';
      fallbackLevel: 4;
      key: string;
      url: string;
      classification: IconClassification;
      status: VerificationStatus;
      kind: 'local-svg';
      title: string;
      brandColor?: string;
    }
  | {
      id: string;
      name: string;
      source: 'missing';
      fallbackLevel: 5;
      key: string;
      classification: 'missing';
      status: 'missing';
      kind: 'missing';
      title: string;
    };

export const ICON_REGISTRY: Record<string, SkillRegistryEntry> = {
  'typescript': {
    id: 'typescript',
    name: 'TypeScript',
    icon: {
      source: 'tech-stack-icons',
      key: 'typescript',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:typescript',
      brandColor: '#3178C6',
    },
  },
  'javascript': {
    id: 'javascript',
    name: 'JavaScript',
    icon: {
      source: 'tech-stack-icons',
      key: 'js',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:js',
      brandColor: '#F7DF1E',
    },
  },
  'react': {
    id: 'react',
    name: 'React',
    icon: {
      source: 'tech-stack-icons',
      key: 'react',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:react',
      brandColor: '#61DAFB',
    },
  },
  'nextdotjs': {
    id: 'nextdotjs',
    name: 'Next.js',
    icon: {
      source: 'tech-stack-icons',
      key: 'nextjs',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:nextjs',
      brandColor: '#FFFFFF',
    },
  },
  'svelte': {
    id: 'svelte',
    name: 'Svelte',
    icon: {
      source: 'tech-stack-icons',
      key: 'sveltejs',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:sveltejs',
      brandColor: '#FF3E00',
    },
  },
  'tailwindcss': {
    id: 'tailwindcss',
    name: 'Tailwind CSS',
    icon: {
      source: 'tech-stack-icons',
      key: 'tailwindcss',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:tailwindcss',
      brandColor: '#06B6D4',
    },
  },
  'framer': {
    id: 'framer',
    name: 'Framer Motion',
    icon: {
      source: 'tech-stack-icons',
      key: 'framer',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:framer',
      brandColor: '#0055FF',
    },
  },
  'greensock': {
    id: 'greensock',
    name: 'GSAP',
    icon: {
      source: 'tech-stack-icons',
      key: 'gsap',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:gsap',
      brandColor: '#0AE448',
    },
  },
  'html5': {
    id: 'html5',
    name: 'HTML5',
    icon: {
      source: 'tech-stack-icons',
      key: 'html5',
      fallbackLevel: 1,
      classification: 'protocol-standard',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:html5',
      brandColor: '#E34F26',
    },
  },
  'vite': {
    id: 'vite',
    name: 'Vite',
    icon: {
      source: 'tech-stack-icons',
      key: 'vitejs',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:vitejs',
      brandColor: '#646CFF',
    },
  },
  'rive': {
    id: 'rive',
    name: 'Rive',
    icon: {
      source: 'simple-icons',
      key: 'siRive',
      fallbackLevel: 3,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'simple-icons:siRive',
      simpleIcon: siRive,
      brandColor: '#1D1D1D',
    },
  },
  'threedotjs': {
    id: 'threedotjs',
    name: 'Three.js',
    icon: {
      source: 'tech-stack-icons',
      key: 'threejs',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:threejs',
      brandColor: '#FFFFFF',
    },
  },
  'webgl': {
    id: 'webgl',
    name: 'WebGL',
    icon: {
      source: 'svgl',
      key: 'webgl',
      fallbackLevel: 2,
      classification: 'protocol-standard',
      status: 'verified',
      sourceAssetId: 'svgl:webgl',
      url: '/assets/icons/svgl/webgl.svg',
      brandColor: '#990000',
    },
  },
  'glsl': {
    id: 'glsl',
    name: 'GLSL',
    icon: {
      source: 'verified-local',
      key: 'glsl',
      fallbackLevel: 4,
      classification: 'generic-ecosystem',
      status: 'generic-representation',
      sourceAssetId: '/assets/icons/glsl.svg',
      url: '/assets/icons/glsl.svg',
      brandColor: '#5586A4',
      notes: 'Khronos OpenGL Shading Language standard representation',
    },
  },
  'webgpu': {
    id: 'webgpu',
    name: 'WebGPU',
    icon: {
      source: 'tech-stack-icons',
      key: 'webgpu',
      fallbackLevel: 1,
      classification: 'protocol-standard',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:webgpu',
      brandColor: '#005A9C',
    },
  },
  'r3f': {
    id: 'r3f',
    name: 'React Three Fiber',
    icon: {
      source: 'verified-local',
      key: 'r3f',
      fallbackLevel: 4,
      classification: 'technology-framework',
      status: 'generic-representation',
      sourceAssetId: '/assets/icons/r3f.svg',
      url: '/assets/icons/r3f.svg',
      brandColor: '#53C1DE',
      notes: 'Poimandres React Three Fiber community mark',
    },
  },
  'blender': {
    id: 'blender',
    name: 'Blender',
    icon: {
      source: 'svgl',
      key: 'blender',
      fallbackLevel: 2,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'svgl:blender',
      url: '/assets/icons/svgl/blender.svg',
      brandColor: '#EA7600',
    },
  },
  'spline': {
    id: 'spline',
    name: 'Spline',
    icon: {
      source: 'verified-local',
      key: 'spline',
      fallbackLevel: 4,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: '/assets/icons/spline.svg',
      url: '/assets/icons/spline.svg',
      brandColor: '#FF5C97',
      notes: 'Spline 3D design platform official mark',
    },
  },
  'draco': {
    id: 'draco',
    name: 'Draco',
    icon: {
      source: 'verified-local',
      key: 'draco',
      fallbackLevel: 4,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: '/assets/icons/draco.svg',
      url: '/assets/icons/draco.svg',
      brandColor: '#FF6D00',
      notes: 'Google Draco 3D mesh compression library mark',
    },
  },
  'canvasapi': {
    id: 'canvasapi',
    name: 'Canvas API',
    icon: {
      source: 'verified-local',
      key: 'canvasapi',
      fallbackLevel: 4,
      classification: 'protocol-standard',
      status: 'generic-representation',
      sourceAssetId: '/assets/icons/canvasapi.svg',
      url: '/assets/icons/canvasapi.svg',
      brandColor: '#E34F26',
      notes: 'W3C/WHATWG HTML5 2D Canvas specification mark',
    },
  },
  'babylondotjs': {
    id: 'babylondotjs',
    name: 'Babylon.js',
    icon: {
      source: 'simple-icons',
      key: 'siBabylondotjs',
      fallbackLevel: 3,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'simple-icons:siBabylondotjs',
      simpleIcon: siBabylondotjs,
      brandColor: '#BB464B',
    },
  },
  'unity': {
    id: 'unity',
    name: 'Unity',
    icon: {
      source: 'tech-stack-icons',
      key: 'unity',
      fallbackLevel: 1,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:unity',
      brandColor: '#FFFFFF',
    },
  },
  'nodedotjs': {
    id: 'nodedotjs',
    name: 'Node.js',
    icon: {
      source: 'tech-stack-icons',
      key: 'nodejs',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:nodejs',
      brandColor: '#5FA04E',
    },
  },
  'express': {
    id: 'express',
    name: 'Express',
    icon: {
      source: 'tech-stack-icons',
      key: 'expressjs',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:expressjs',
      brandColor: '#FFFFFF',
    },
  },
  'fastapi': {
    id: 'fastapi',
    name: 'FastAPI',
    icon: {
      source: 'svgl',
      key: 'fastapi',
      fallbackLevel: 2,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'svgl:fastapi',
      url: '/assets/icons/svgl/fastapi.svg',
      brandColor: '#009688',
    },
  },
  'flask': {
    id: 'flask',
    name: 'Flask',
    icon: {
      source: 'tech-stack-icons',
      key: 'flask',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:flask',
      brandColor: '#FFFFFF',
    },
  },
  'springboot': {
    id: 'springboot',
    name: 'Spring Boot',
    icon: {
      source: 'tech-stack-icons',
      key: 'spring',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:spring',
      brandColor: '#6DB33F',
    },
  },
  'prisma': {
    id: 'prisma',
    name: 'Prisma',
    icon: {
      source: 'tech-stack-icons',
      key: 'prisma',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:prisma',
      brandColor: '#2D3748',
    },
  },
  'drizzle': {
    id: 'drizzle',
    name: 'Drizzle',
    icon: {
      source: 'tech-stack-icons',
      key: 'drizzle',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:drizzle',
      brandColor: '#C5F74F',
    },
  },
  'trpc': {
    id: 'trpc',
    name: 'tRPC',
    icon: {
      source: 'tech-stack-icons',
      key: 'tRPC',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:tRPC',
      brandColor: '#2596BE',
    },
  },
  'graphql': {
    id: 'graphql',
    name: 'GraphQL',
    icon: {
      source: 'tech-stack-icons',
      key: 'graphql',
      fallbackLevel: 1,
      classification: 'protocol-standard',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:graphql',
      brandColor: '#E10098',
    },
  },
  'pydantic': {
    id: 'pydantic',
    name: 'Pydantic',
    icon: {
      source: 'simple-icons',
      key: 'siPydantic',
      fallbackLevel: 3,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'simple-icons:siPydantic',
      simpleIcon: siPydantic,
      brandColor: '#E92063',
    },
  },
  'nginx': {
    id: 'nginx',
    name: 'Nginx',
    icon: {
      source: 'tech-stack-icons',
      key: 'nginx',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:nginx',
      brandColor: '#009639',
    },
  },
  'postgresql': {
    id: 'postgresql',
    name: 'PostgreSQL',
    icon: {
      source: 'tech-stack-icons',
      key: 'postgresql',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:postgresql',
      brandColor: '#4169E1',
    },
  },
  'mysql': {
    id: 'mysql',
    name: 'MySQL',
    icon: {
      source: 'tech-stack-icons',
      key: 'mysql',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:mysql',
      brandColor: '#4479A1',
    },
  },
  'supabase': {
    id: 'supabase',
    name: 'Supabase',
    icon: {
      source: 'tech-stack-icons',
      key: 'supabase',
      fallbackLevel: 1,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:supabase',
      brandColor: '#3ECF8E',
    },
  },
  'redis': {
    id: 'redis',
    name: 'Redis',
    icon: {
      source: 'tech-stack-icons',
      key: 'redis',
      fallbackLevel: 1,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:redis',
      brandColor: '#DC382D',
    },
  },
  'rabbitmq': {
    id: 'rabbitmq',
    name: 'RabbitMQ',
    icon: {
      source: 'tech-stack-icons',
      key: 'rabbitmq',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:rabbitmq',
      brandColor: '#FF6600',
    },
  },
  'celery': {
    id: 'celery',
    name: 'Celery',
    icon: {
      source: 'simple-icons',
      key: 'siCelery',
      fallbackLevel: 3,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'simple-icons:siCelery',
      simpleIcon: siCelery,
      brandColor: '#37814A',
    },
  },
  'kafka': {
    id: 'kafka',
    name: 'Kafka',
    icon: {
      source: 'svgl',
      key: 'kafka',
      fallbackLevel: 2,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'svgl:kafka',
      url: '/assets/icons/svgl/kafka_dark.svg',
      brandColor: '#231F20',
    },
  },
  'docker': {
    id: 'docker',
    name: 'Docker',
    icon: {
      source: 'tech-stack-icons',
      key: 'docker',
      fallbackLevel: 1,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:docker',
      brandColor: '#2496ED',
    },
  },
  'kubernetes': {
    id: 'kubernetes',
    name: 'Kubernetes',
    icon: {
      source: 'tech-stack-icons',
      key: 'kubernetes',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:kubernetes',
      brandColor: '#326CE5',
    },
  },
  'linux': {
    id: 'linux',
    name: 'Linux',
    icon: {
      source: 'tech-stack-icons',
      key: 'linux',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:linux',
      brandColor: '#FCC624',
    },
  },
  'git': {
    id: 'git',
    name: 'Git',
    icon: {
      source: 'tech-stack-icons',
      key: 'git',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:git',
      brandColor: '#F05032',
    },
  },
  'solidity': {
    id: 'solidity',
    name: 'Solidity',
    icon: {
      source: 'tech-stack-icons',
      key: 'solidity',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:solidity',
      brandColor: '#363636',
    },
  },
  'viem': {
    id: 'viem',
    name: 'viem',
    icon: {
      source: 'verified-local',
      key: 'viem',
      fallbackLevel: 4,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: '/assets/icons/viem.svg',
      url: '/assets/icons/viem.svg',
      brandColor: '#6B7280',
      notes: 'viem TypeScript interface for Ethereum official mark',
    },
  },
  'wagmi': {
    id: 'wagmi',
    name: 'wagmi',
    icon: {
      source: 'simple-icons',
      key: 'siWagmi',
      fallbackLevel: 3,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'simple-icons:siWagmi',
      simpleIcon: siWagmi,
      brandColor: '#000000',
    },
  },
  'ethers': {
    id: 'ethers',
    name: 'Ethers.js',
    icon: {
      source: 'simple-icons',
      key: 'siEthers',
      fallbackLevel: 3,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'simple-icons:siEthers',
      simpleIcon: siEthers,
      brandColor: '#2535A0',
    },
  },
  'foundry': {
    id: 'foundry',
    name: 'Foundry',
    icon: {
      source: 'verified-local',
      key: 'foundry',
      fallbackLevel: 4,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: '/assets/icons/foundry.svg',
      url: '/assets/icons/foundry.svg',
      brandColor: '#F5A623',
      notes: 'Paradigm Foundry smart contract development toolchain mark',
    },
  },
  'privy': {
    id: 'privy',
    name: 'Privy',
    icon: {
      source: 'verified-local',
      key: 'privy',
      fallbackLevel: 4,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: '/assets/icons/privy.svg',
      url: '/assets/icons/privy.svg',
      brandColor: '#F1F5F9',
      notes: 'Privy embedded web3 auth official mark',
    },
  },
  'erc4337': {
    id: 'erc4337',
    name: 'ERC-4337',
    icon: {
      source: 'verified-local',
      key: 'erc4337',
      fallbackLevel: 4,
      classification: 'protocol-standard',
      status: 'generic-representation',
      sourceAssetId: '/assets/icons/erc4337.svg',
      url: '/assets/icons/erc4337.svg',
      brandColor: '#627EEA',
      notes: 'Ethereum standard EIP-4337 Account Abstraction ecosystem representation',
    },
  },
  'thegraph': {
    id: 'thegraph',
    name: 'The Graph',
    icon: {
      source: 'verified-local',
      key: 'thegraph',
      fallbackLevel: 4,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: '/assets/icons/thegraph.svg',
      url: '/assets/icons/thegraph.svg',
      brandColor: '#6F4CFF',
      notes: 'The Graph protocol official mark',
    },
  },
  'ipfs': {
    id: 'ipfs',
    name: 'IPFS',
    icon: {
      source: 'simple-icons',
      key: 'siIpfs',
      fallbackLevel: 3,
      classification: 'protocol-standard',
      status: 'verified',
      sourceAssetId: 'simple-icons:siIpfs',
      simpleIcon: siIpfs,
      brandColor: '#65C2CB',
    },
  },
  'siwe': {
    id: 'siwe',
    name: 'SIWE',
    icon: {
      source: 'verified-local',
      key: 'siwe',
      fallbackLevel: 4,
      classification: 'protocol-standard',
      status: 'generic-representation',
      sourceAssetId: '/assets/icons/siwe.svg',
      url: '/assets/icons/siwe.svg',
      brandColor: '#4A5568',
      notes: 'Sign-In with Ethereum EIP-4361 standard mark',
    },
  },
  'hardhat': {
    id: 'hardhat',
    name: 'Hardhat',
    icon: {
      source: 'verified-local',
      key: 'hardhat',
      fallbackLevel: 4,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: '/assets/icons/hardhat.svg',
      url: '/assets/icons/hardhat.svg',
      brandColor: '#FFF133',
      notes: 'Nomic Foundation Hardhat Ethereum dev environment mark',
    },
  },
  'openai': {
    id: 'openai',
    name: 'OpenAI',
    icon: {
      source: 'tech-stack-icons',
      key: 'openai',
      fallbackLevel: 1,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:openai',
      brandColor: '#FFFFFF',
    },
  },
  'anthropic': {
    id: 'anthropic',
    name: 'Anthropic',
    icon: {
      source: 'tech-stack-icons',
      key: 'anthropic',
      fallbackLevel: 1,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:anthropic',
      brandColor: '#D97706',
    },
  },
  'googlegemini': {
    id: 'googlegemini',
    name: 'Google Gemini',
    icon: {
      source: 'tech-stack-icons',
      key: 'gemini',
      fallbackLevel: 1,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:gemini',
      brandColor: '#8E75FF',
    },
  },
  'deepseek': {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: {
      source: 'tech-stack-icons',
      key: 'deepseek',
      fallbackLevel: 1,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:deepseek',
      brandColor: '#4D6BFE',
    },
  },
  'qwen': {
    id: 'qwen',
    name: 'Qwen',
    icon: {
      source: 'tech-stack-icons',
      key: 'qwen',
      fallbackLevel: 1,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:qwen',
      brandColor: '#615CED',
    },
  },
  'vercel': {
    id: 'vercel',
    name: 'Vercel AI SDK',
    icon: {
      source: 'tech-stack-icons',
      key: 'vercel',
      fallbackLevel: 1,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:vercel',
      brandColor: '#FFFFFF',
    },
  },
  'ollama': {
    id: 'ollama',
    name: 'Ollama',
    icon: {
      source: 'tech-stack-icons',
      key: 'ollama',
      fallbackLevel: 1,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:ollama',
      brandColor: '#FFFFFF',
    },
  },
  'huggingface': {
    id: 'huggingface',
    name: 'Hugging Face',
    icon: {
      source: 'tech-stack-icons',
      key: 'huggingface',
      fallbackLevel: 1,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:huggingface',
      brandColor: '#FFD21E',
    },
  },
  'groq': {
    id: 'groq',
    name: 'Groq',
    icon: {
      source: 'tech-stack-icons',
      key: 'groq',
      fallbackLevel: 1,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:groq',
      brandColor: '#F55036',
    },
  },
  'togetherai': {
    id: 'togetherai',
    name: 'Together AI',
    icon: {
      source: 'tech-stack-icons',
      key: 'together',
      fallbackLevel: 1,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:together',
      brandColor: '#0F6FFF',
    },
  },
  'cohere': {
    id: 'cohere',
    name: 'Cohere',
    icon: {
      source: 'svgl',
      key: 'cohere',
      fallbackLevel: 2,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'svgl:cohere',
      url: '/assets/icons/svgl/cohere.svg',
      brandColor: '#39594D',
    },
  },
  'langchain': {
    id: 'langchain',
    name: 'LangChain',
    icon: {
      source: 'tech-stack-icons',
      key: 'langchain',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:langchain',
      brandColor: '#1C3C3C',
    },
  },
  'langgraph': {
    id: 'langgraph',
    name: 'LangGraph',
    icon: {
      source: 'tech-stack-icons',
      key: 'langgraph',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:langgraph',
      brandColor: '#2C3437',
    },
  },
  'llamaindex': {
    id: 'llamaindex',
    name: 'LlamaIndex',
    icon: {
      source: 'tech-stack-icons',
      key: 'llamaindex',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:llamaindex',
      brandColor: '#6B46C1',
    },
  },
  'crewai': {
    id: 'crewai',
    name: 'CrewAI',
    icon: {
      source: 'tech-stack-icons',
      key: 'crewai',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:crewai',
      brandColor: '#FF4F00',
    },
  },
  'autogen': {
    id: 'autogen',
    name: 'AutoGen',
    icon: {
      source: 'verified-local',
      key: 'autogen',
      fallbackLevel: 4,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: '/assets/icons/autogen.svg',
      url: '/assets/icons/autogen.svg',
      brandColor: '#0078D4',
      notes: 'Microsoft AutoGen multi-agent framework mark',
    },
  },
  'dify': {
    id: 'dify',
    name: 'Dify',
    icon: {
      source: 'simple-icons',
      key: 'siDify',
      fallbackLevel: 3,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'simple-icons:siDify',
      simpleIcon: siDify,
      brandColor: '#0033FF',
    },
  },
  'coze': {
    id: 'coze',
    name: 'Coze',
    icon: {
      source: 'simple-icons',
      key: 'siCoze',
      fallbackLevel: 3,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'simple-icons:siCoze',
      simpleIcon: siCoze,
      brandColor: '#4D53E8',
    },
  },
  'semantickernel': {
    id: 'semantickernel',
    name: 'Semantic Kernel',
    icon: {
      source: 'verified-local',
      key: 'semantickernel',
      fallbackLevel: 4,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: '/assets/icons/semantickernel.svg',
      url: '/assets/icons/semantickernel.svg',
      brandColor: '#107C41',
      notes: 'Microsoft Semantic Kernel framework mark',
    },
  },
  'mcp': {
    id: 'mcp',
    name: 'MCP',
    icon: {
      source: 'verified-local',
      key: 'mcp',
      fallbackLevel: 4,
      classification: 'protocol-standard',
      status: 'verified',
      sourceAssetId: '/assets/icons/mcp.svg',
      url: '/assets/icons/mcp.svg',
      brandColor: '#D97706',
      notes: 'Model Context Protocol standard mark',
    },
  },
  'haystack': {
    id: 'haystack',
    name: 'Haystack',
    icon: {
      source: 'simple-icons',
      key: 'siHaystack',
      fallbackLevel: 3,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'simple-icons:siHaystack',
      simpleIcon: siHaystack,
      brandColor: '#0EAF9C',
    },
  },
  'langsmith': {
    id: 'langsmith',
    name: 'LangSmith',
    icon: {
      source: 'tech-stack-icons',
      key: 'langsmith',
      fallbackLevel: 1,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:langsmith',
      brandColor: '#00A67E',
    },
  },
  'pgvector': {
    id: 'pgvector',
    name: 'pgvector',
    icon: {
      source: 'verified-local',
      key: 'pgvector',
      fallbackLevel: 4,
      classification: 'technology-framework',
      status: 'generic-representation',
      sourceAssetId: '/assets/icons/pgvector.svg',
      url: '/assets/icons/pgvector.svg',
      brandColor: '#336791',
      notes: 'PostgreSQL pgvector extension representation',
    },
  },
  'chroma': {
    id: 'chroma',
    name: 'Chroma',
    icon: {
      source: 'verified-local',
      key: 'chroma',
      fallbackLevel: 4,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: '/assets/icons/chroma.svg',
      url: '/assets/icons/chroma.svg',
      brandColor: '#FF6B6B',
      notes: 'Chroma vector database official mark',
    },
  },
  'milvus': {
    id: 'milvus',
    name: 'Milvus',
    icon: {
      source: 'simple-icons',
      key: 'siMilvus',
      fallbackLevel: 3,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'simple-icons:siMilvus',
      simpleIcon: siMilvus,
      brandColor: '#00A1EA',
    },
  },
  'weaviate': {
    id: 'weaviate',
    name: 'Weaviate',
    icon: {
      source: 'verified-local',
      key: 'weaviate',
      fallbackLevel: 4,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: '/assets/icons/weaviate.svg',
      url: '/assets/icons/weaviate.svg',
      brandColor: '#00E676',
      notes: 'Weaviate vector database official mark',
    },
  },
  'qdrant': {
    id: 'qdrant',
    name: 'Qdrant',
    icon: {
      source: 'svgl',
      key: 'qdrant',
      fallbackLevel: 2,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'svgl:qdrant',
      url: '/assets/icons/svgl/qdrant_dark.svg',
      brandColor: '#DC2626',
    },
  },
  'pinecone': {
    id: 'pinecone',
    name: 'Pinecone',
    icon: {
      source: 'verified-local',
      key: 'pinecone',
      fallbackLevel: 4,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: '/assets/icons/pinecone.svg',
      url: '/assets/icons/pinecone.svg',
      brandColor: '#000000',
      notes: 'Pinecone vector database official mark',
    },
  },
  'llamaparse': {
    id: 'llamaparse',
    name: 'LlamaParse',
    icon: {
      source: 'verified-local',
      key: 'llamaparse',
      fallbackLevel: 4,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: '/assets/icons/llamaparse.svg',
      url: '/assets/icons/llamaparse.svg',
      brandColor: '#805AD5',
      notes: 'LlamaIndex LlamaParse official mark',
    },
  },
  'unstructured': {
    id: 'unstructured',
    name: 'Unstructured',
    icon: {
      source: 'tech-stack-icons',
      key: 'unstructured',
      fallbackLevel: 1,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:unstructured',
      brandColor: '#0ADDF8',
    },
  },
  'prometheus': {
    id: 'prometheus',
    name: 'Prometheus',
    icon: {
      source: 'tech-stack-icons',
      key: 'prometheus',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:prometheus',
      brandColor: '#E6522C',
    },
  },
  'grafana': {
    id: 'grafana',
    name: 'Grafana',
    icon: {
      source: 'tech-stack-icons',
      key: 'grafana',
      fallbackLevel: 1,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:grafana',
      brandColor: '#F46800',
    },
  },
  'sentry': {
    id: 'sentry',
    name: 'Sentry',
    icon: {
      source: 'tech-stack-icons',
      key: 'sentry',
      fallbackLevel: 1,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:sentry',
      brandColor: '#362D59',
    },
  },
};

/**
 * Retrieves the canonical icon definition for a skill.
 */
export function getIconDefinition(skillId: string): SkillRegistryEntry | undefined {
  return ICON_REGISTRY[skillId.toLowerCase().trim()];
}

/**
 * Authoritative Skill Icon Resolver.
 * Follows exact deterministic hierarchy:
 * 1. Tech Stack Icons
 * 2. SVGL (locally cached)
 * 3. Simple Icons
 * 4. Verified Existing Local SVG
 * 5. Missing State
 */
export function resolveSkillIcon(skillId: string, name?: string): ResolvedSkillIcon {
  const normalizedId = skillId.toLowerCase().trim();
  const def = ICON_REGISTRY[normalizedId];
  const displayName = name || (def ? def.name : skillId);

  if (!def || def.icon.source === 'missing') {
    return {
      id: normalizedId,
      name: displayName,
      source: 'missing',
      fallbackLevel: 5,
      key: normalizedId,
      classification: 'missing',
      status: 'missing',
      kind: 'missing',
      title: displayName,
    };
  }

  const { icon } = def;

  if (icon.source === 'tech-stack-icons') {
    return {
      id: def.id,
      name: displayName,
      source: 'tech-stack-icons',
      fallbackLevel: 1,
      key: icon.key,
      classification: icon.classification,
      status: icon.status,
      kind: 'tech-stack-icon',
      title: displayName,
      brandColor: icon.brandColor,
    };
  }

  if (icon.source === 'svgl') {
    return {
      id: def.id,
      name: displayName,
      source: 'svgl',
      fallbackLevel: 2,
      key: icon.key,
      url: icon.url || `/assets/icons/svgl/${icon.key}.svg`,
      classification: icon.classification,
      status: icon.status,
      kind: 'svgl-svg',
      title: displayName,
      brandColor: icon.brandColor,
    };
  }

  if (icon.source === 'simple-icons') {
    const si = icon.simpleIcon;
    return {
      id: def.id,
      name: displayName,
      source: 'simple-icons',
      fallbackLevel: 3,
      key: icon.key,
      path: si?.path || '',
      hex: si?.hex || 'FFFFFF',
      classification: icon.classification,
      status: icon.status,
      kind: 'svg-path',
      title: si?.title || displayName,
      brandColor: icon.brandColor || (si?.hex ? `#${si.hex}` : undefined),
    };
  }

  if (icon.source === 'verified-local') {
    return {
      id: def.id,
      name: displayName,
      source: 'verified-local',
      fallbackLevel: 4,
      key: icon.key,
      url: icon.url || `/assets/icons/${icon.key}.svg`,
      classification: icon.classification,
      status: icon.status,
      kind: 'local-svg',
      title: displayName,
      brandColor: icon.brandColor,
    };
  }

  return {
    id: normalizedId,
    name: displayName,
    source: 'missing',
    fallbackLevel: 5,
    key: normalizedId,
    classification: 'missing',
    status: 'missing',
    kind: 'missing',
    title: displayName,
  };
}
