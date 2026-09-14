/**
 * AUTHORITATIVE MULTI-SOURCE TECHNOLOGY ICON REGISTRY
 * Deterministic multi-source icon resolution for all 88 skills.
 * 
 * Classifications:
 * - official-brand: Official company / product brand mark
 * - technology-framework: Open-source project / library / runtime mark
 * - protocol-standard: Official web / blockchain / network standard specification mark
 * - generic-ecosystem: Explicit ecosystem / parent standard representation
 * - missing: No trustworthy logo exists
 * 
 * Visual Modes:
 * - logo: Official corporate or product logo mark
 * - glyph: Intentional editorial technical symbol crafted with geometric precision
 * - symbol: Recognized ecosystem symbol or badge
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
  siNextdotjs,
  siGreensock,
  siVercel,
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

export type SkillType = 'brand' | 'framework' | 'protocol' | 'standard' | 'tool';
export type VisualMode = 'logo' | 'glyph' | 'symbol';

export interface SkillIconMetadata {
  type: SkillType;
  visualMode: VisualMode;
  scale: number;
  brightness: number;
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
      type: SkillType;
      visualMode: VisualMode;
      scale: number;
      brightness: number;
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
      type: SkillType;
      visualMode: VisualMode;
      scale: number;
      brightness: number;
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
      type: SkillType;
      visualMode: VisualMode;
      scale: number;
      brightness: number;
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
      type: SkillType;
      visualMode: VisualMode;
      scale: number;
      brightness: number;
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
      type: SkillType;
      visualMode: VisualMode;
      scale: number;
      brightness: number;
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
      type: 'tool',
      visualMode: 'symbol',
      scale: 0.95,
      brightness: 1.15,
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
      type: 'standard',
      visualMode: 'symbol',
      scale: 0.95,
      brightness: 1.15,
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
      type: 'framework',
      visualMode: 'symbol',
      scale: 1.05,
      brightness: 1.2,
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
      type: 'framework',
      visualMode: 'logo',
      scale: 1,
      brightness: 1.25,
      source: 'simple-icons',
      key: 'siNextdotjs',
      fallbackLevel: 3,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'simple-icons:siNextdotjs',
      brandColor: '#000000',
      simpleIcon: siNextdotjs,
    },
  },
  'svelte': {
    id: 'svelte',
    name: 'Svelte',
    icon: {
      type: 'framework',
      visualMode: 'logo',
      scale: 0.95,
      brightness: 1.15,
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
      type: 'framework',
      visualMode: 'symbol',
      scale: 1.05,
      brightness: 1.2,
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
      type: 'framework',
      visualMode: 'symbol',
      scale: 0.95,
      brightness: 1.15,
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
      type: 'framework',
      visualMode: 'logo',
      scale: 1,
      brightness: 1.2,
      source: 'simple-icons',
      key: 'siGreensock',
      fallbackLevel: 3,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'simple-icons:siGreensock',
      brandColor: '#88CE02',
      simpleIcon: siGreensock,
    },
  },
  'html5': {
    id: 'html5',
    name: 'HTML5',
    icon: {
      type: 'standard',
      visualMode: 'symbol',
      scale: 0.95,
      brightness: 1.15,
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
      type: 'tool',
      visualMode: 'logo',
      scale: 1,
      brightness: 1.2,
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
      type: 'tool',
      visualMode: 'logo',
      scale: 0.95,
      brightness: 1.25,
      source: 'simple-icons',
      key: 'siRive',
      fallbackLevel: 3,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'simple-icons:siRive',
      brandColor: '#FF5555',
      simpleIcon: siRive,
    },
  },
  'threedotjs': {
    id: 'threedotjs',
    name: 'Three.js',
    icon: {
      type: 'framework',
      visualMode: 'symbol',
      scale: 1,
      brightness: 1.25,
      source: 'tech-stack-icons',
      key: 'threejs',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:threejs',
      brandColor: '#F1F5F9',
    },
  },
  'webgl': {
    id: 'webgl',
    name: 'WebGL',
    icon: {
      type: 'standard',
      visualMode: 'glyph',
      scale: 1.05,
      brightness: 1.25,
      source: 'verified-local',
      key: 'webgl',
      fallbackLevel: 4,
      classification: 'protocol-standard',
      status: 'verified',
      sourceAssetId: 'verified-local:webgl',
      brandColor: '#E53935',
      url: '/assets/icons/webgl.svg',
    },
  },
  'glsl': {
    id: 'glsl',
    name: 'GLSL',
    icon: {
      type: 'standard',
      visualMode: 'glyph',
      scale: 1.05,
      brightness: 1.25,
      source: 'verified-local',
      key: 'glsl',
      fallbackLevel: 4,
      classification: 'protocol-standard',
      status: 'verified',
      sourceAssetId: 'verified-local:glsl',
      brandColor: '#5586A4',
      url: '/assets/icons/glsl.svg',
    },
  },
  'webgpu': {
    id: 'webgpu',
    name: 'WebGPU',
    icon: {
      type: 'standard',
      visualMode: 'symbol',
      scale: 1,
      brightness: 1.2,
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
      type: 'framework',
      visualMode: 'glyph',
      scale: 1.05,
      brightness: 1.25,
      source: 'verified-local',
      key: 'r3f',
      fallbackLevel: 4,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'verified-local:r3f',
      brandColor: '#53C1DE',
      url: '/assets/icons/r3f.svg',
    },
  },
  'blender': {
    id: 'blender',
    name: 'Blender',
    icon: {
      type: 'tool',
      visualMode: 'logo',
      scale: 1,
      brightness: 1.2,
      source: 'svgl',
      key: 'blender',
      fallbackLevel: 2,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'svgl:blender',
      brandColor: '#F5792A',
      url: '/assets/icons/svgl/blender.svg',
    },
  },
  'spline': {
    id: 'spline',
    name: 'Spline',
    icon: {
      type: 'tool',
      visualMode: 'symbol',
      scale: 1,
      brightness: 1.25,
      source: 'verified-local',
      key: 'spline',
      fallbackLevel: 4,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'verified-local:spline',
      brandColor: '#FF4081',
      url: '/assets/icons/spline.svg',
    },
  },
  'draco': {
    id: 'draco',
    name: 'Draco',
    icon: {
      type: 'tool',
      visualMode: 'symbol',
      scale: 0.95,
      brightness: 1.15,
      source: 'verified-local',
      key: 'draco',
      fallbackLevel: 4,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'verified-local:draco',
      brandColor: '#79529CF5',
      url: '/assets/icons/draco.svg',
    },
  },
  'canvasapi': {
    id: 'canvasapi',
    name: 'Canvas API',
    icon: {
      type: 'standard',
      visualMode: 'glyph',
      scale: 1,
      brightness: 1.25,
      source: 'verified-local',
      key: 'canvasapi',
      fallbackLevel: 4,
      classification: 'protocol-standard',
      status: 'verified',
      sourceAssetId: 'verified-local:canvasapi',
      brandColor: '#E34F26',
      url: '/assets/icons/canvasapi.svg',
    },
  },
  'babylondotjs': {
    id: 'babylondotjs',
    name: 'Babylon.js',
    icon: {
      type: 'framework',
      visualMode: 'logo',
      scale: 1,
      brightness: 1.25,
      source: 'simple-icons',
      key: 'siBabylondotjs',
      fallbackLevel: 3,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'simple-icons:siBabylondotjs',
      brandColor: '#BB464B',
      simpleIcon: siBabylondotjs,
    },
  },
  'unity': {
    id: 'unity',
    name: 'Unity',
    icon: {
      type: 'tool',
      visualMode: 'logo',
      scale: 0.95,
      brightness: 1.25,
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
      type: 'framework',
      visualMode: 'symbol',
      scale: 1,
      brightness: 1.2,
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
      type: 'framework',
      visualMode: 'symbol',
      scale: 0.95,
      brightness: 1.25,
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
      type: 'framework',
      visualMode: 'symbol',
      scale: 0.95,
      brightness: 1.2,
      source: 'svgl',
      key: 'fastapi',
      fallbackLevel: 2,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'svgl:fastapi',
      brandColor: '#009688',
      url: '/assets/icons/svgl/fastapi.svg',
    },
  },
  'flask': {
    id: 'flask',
    name: 'Flask',
    icon: {
      type: 'framework',
      visualMode: 'symbol',
      scale: 1,
      brightness: 1.25,
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
      type: 'framework',
      visualMode: 'logo',
      scale: 0.95,
      brightness: 1.2,
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
      type: 'tool',
      visualMode: 'symbol',
      scale: 1,
      brightness: 1.25,
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
      type: 'tool',
      visualMode: 'logo',
      scale: 0.95,
      brightness: 1.2,
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
      type: 'framework',
      visualMode: 'symbol',
      scale: 1,
      brightness: 1.25,
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
      type: 'protocol',
      visualMode: 'symbol',
      scale: 1,
      brightness: 1.25,
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
      type: 'framework',
      visualMode: 'logo',
      scale: 0.95,
      brightness: 1.2,
      source: 'simple-icons',
      key: 'siPydantic',
      fallbackLevel: 3,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'simple-icons:siPydantic',
      brandColor: '#E92063',
      simpleIcon: siPydantic,
    },
  },
  'nginx': {
    id: 'nginx',
    name: 'Nginx',
    icon: {
      type: 'tool',
      visualMode: 'symbol',
      scale: 0.95,
      brightness: 1.2,
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
      type: 'tool',
      visualMode: 'symbol',
      scale: 1,
      brightness: 1.2,
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
      type: 'tool',
      visualMode: 'symbol',
      scale: 1.05,
      brightness: 1.2,
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
      type: 'brand',
      visualMode: 'logo',
      scale: 0.95,
      brightness: 1.25,
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
      type: 'tool',
      visualMode: 'logo',
      scale: 1,
      brightness: 1.2,
      source: 'tech-stack-icons',
      key: 'redis',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:redis',
      brandColor: '#DC382D',
    },
  },
  'rabbitmq': {
    id: 'rabbitmq',
    name: 'RabbitMQ',
    icon: {
      type: 'tool',
      visualMode: 'symbol',
      scale: 1,
      brightness: 1.2,
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
      type: 'framework',
      visualMode: 'symbol',
      scale: 0.95,
      brightness: 1.25,
      source: 'simple-icons',
      key: 'siCelery',
      fallbackLevel: 3,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'simple-icons:siCelery',
      brandColor: '#37814A',
      simpleIcon: siCelery,
    },
  },
  'kafka': {
    id: 'kafka',
    name: 'Kafka',
    icon: {
      type: 'tool',
      visualMode: 'symbol',
      scale: 1,
      brightness: 1.25,
      source: 'svgl',
      key: 'kafka',
      fallbackLevel: 2,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'svgl:kafka',
      brandColor: '#231F20',
      url: '/assets/icons/svgl/kafka.svg',
    },
  },
  'docker': {
    id: 'docker',
    name: 'Docker',
    icon: {
      type: 'brand',
      visualMode: 'logo',
      scale: 1.05,
      brightness: 1.2,
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
      type: 'brand',
      visualMode: 'logo',
      scale: 1,
      brightness: 1.25,
      source: 'tech-stack-icons',
      key: 'kubernetes',
      fallbackLevel: 1,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:kubernetes',
      brandColor: '#326CE5',
    },
  },
  'linux': {
    id: 'linux',
    name: 'Linux',
    icon: {
      type: 'tool',
      visualMode: 'symbol',
      scale: 1,
      brightness: 1.2,
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
      type: 'tool',
      visualMode: 'symbol',
      scale: 0.95,
      brightness: 1.25,
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
      type: 'framework',
      visualMode: 'symbol',
      scale: 0.95,
      brightness: 1.25,
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
      type: 'framework',
      visualMode: 'symbol',
      scale: 1,
      brightness: 1.25,
      source: 'verified-local',
      key: 'viem',
      fallbackLevel: 4,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'verified-local:viem',
      brandColor: '#F1F5F9',
      url: '/assets/icons/viem.svg',
    },
  },
  'wagmi': {
    id: 'wagmi',
    name: 'wagmi',
    icon: {
      type: 'framework',
      visualMode: 'symbol',
      scale: 1,
      brightness: 1.25,
      source: 'simple-icons',
      key: 'siWagmi',
      fallbackLevel: 3,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'simple-icons:siWagmi',
      brandColor: '#000000',
      simpleIcon: siWagmi,
    },
  },
  'ethers': {
    id: 'ethers',
    name: 'Ethers.js',
    icon: {
      type: 'framework',
      visualMode: 'symbol',
      scale: 1,
      brightness: 1.25,
      source: 'simple-icons',
      key: 'siEthers',
      fallbackLevel: 3,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'simple-icons:siEthers',
      brandColor: '#2535A0',
      simpleIcon: siEthers,
    },
  },
  'foundry': {
    id: 'foundry',
    name: 'Foundry',
    icon: {
      type: 'tool',
      visualMode: 'symbol',
      scale: 0.95,
      brightness: 1.25,
      source: 'verified-local',
      key: 'foundry',
      fallbackLevel: 4,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'verified-local:foundry',
      brandColor: '#F5A623',
      url: '/assets/icons/foundry.svg',
    },
  },
  'privy': {
    id: 'privy',
    name: 'Privy',
    icon: {
      type: 'brand',
      visualMode: 'logo',
      scale: 0.95,
      brightness: 1.25,
      source: 'verified-local',
      key: 'privy',
      fallbackLevel: 4,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'verified-local:privy',
      brandColor: '#F1F5F9',
      url: '/assets/icons/privy.svg',
    },
  },
  'erc4337': {
    id: 'erc4337',
    name: 'ERC-4337',
    icon: {
      type: 'protocol',
      visualMode: 'glyph',
      scale: 1.05,
      brightness: 1.25,
      source: 'verified-local',
      key: 'erc4337',
      fallbackLevel: 4,
      classification: 'protocol-standard',
      status: 'verified',
      sourceAssetId: 'verified-local:erc4337',
      brandColor: '#627EEA',
      url: '/assets/icons/erc4337.svg',
    },
  },
  'thegraph': {
    id: 'thegraph',
    name: 'The Graph',
    icon: {
      type: 'protocol',
      visualMode: 'logo',
      scale: 0.95,
      brightness: 1.25,
      source: 'verified-local',
      key: 'thegraph',
      fallbackLevel: 4,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'verified-local:thegraph',
      brandColor: '#6F4CFF',
      url: '/assets/icons/thegraph.svg',
    },
  },
  'ipfs': {
    id: 'ipfs',
    name: 'IPFS',
    icon: {
      type: 'protocol',
      visualMode: 'symbol',
      scale: 1,
      brightness: 1.25,
      source: 'simple-icons',
      key: 'siIpfs',
      fallbackLevel: 3,
      classification: 'protocol-standard',
      status: 'verified',
      sourceAssetId: 'simple-icons:siIpfs',
      brandColor: '#65C2CB',
      simpleIcon: siIpfs,
    },
  },
  'siwe': {
    id: 'siwe',
    name: 'SIWE',
    icon: {
      type: 'standard',
      visualMode: 'glyph',
      scale: 1,
      brightness: 1.25,
      source: 'verified-local',
      key: 'siwe',
      fallbackLevel: 4,
      classification: 'protocol-standard',
      status: 'verified',
      sourceAssetId: 'verified-local:siwe',
      brandColor: '#6A49E4',
      url: '/assets/icons/siwe.svg',
    },
  },
  'hardhat': {
    id: 'hardhat',
    name: 'Hardhat',
    icon: {
      type: 'tool',
      visualMode: 'logo',
      scale: 0.95,
      brightness: 1.25,
      source: 'verified-local',
      key: 'hardhat',
      fallbackLevel: 4,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'verified-local:hardhat',
      brandColor: '#FFF133',
      url: '/assets/icons/hardhat.svg',
    },
  },
  'openai': {
    id: 'openai',
    name: 'OpenAI',
    icon: {
      type: 'brand',
      visualMode: 'logo',
      scale: 1,
      brightness: 1.25,
      source: 'tech-stack-icons',
      key: 'openai',
      fallbackLevel: 1,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:openai',
      brandColor: '#10A37F',
    },
  },
  'anthropic': {
    id: 'anthropic',
    name: 'Anthropic',
    icon: {
      type: 'brand',
      visualMode: 'logo',
      scale: 1,
      brightness: 1.25,
      source: 'tech-stack-icons',
      key: 'anthropic',
      fallbackLevel: 1,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:anthropic',
      brandColor: '#D97757',
    },
  },
  'googlegemini': {
    id: 'googlegemini',
    name: 'Google Gemini',
    icon: {
      type: 'brand',
      visualMode: 'logo',
      scale: 1.05,
      brightness: 1.25,
      source: 'tech-stack-icons',
      key: 'gemini',
      fallbackLevel: 1,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:gemini',
      brandColor: '#1BA1E3',
    },
  },
  'deepseek': {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: {
      type: 'brand',
      visualMode: 'logo',
      scale: 1,
      brightness: 1.25,
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
      type: 'brand',
      visualMode: 'logo',
      scale: 1,
      brightness: 1.25,
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
      type: 'brand',
      visualMode: 'logo',
      scale: 1,
      brightness: 1.25,
      source: 'simple-icons',
      key: 'siVercel',
      fallbackLevel: 3,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'simple-icons:siVercel',
      brandColor: '#000000',
      simpleIcon: siVercel,
    },
  },
  'ollama': {
    id: 'ollama',
    name: 'Ollama',
    icon: {
      type: 'brand',
      visualMode: 'logo',
      scale: 1,
      brightness: 1.25,
      source: 'tech-stack-icons',
      key: 'ollama',
      fallbackLevel: 1,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:ollama',
      brandColor: '#F1F5F9',
    },
  },
  'huggingface': {
    id: 'huggingface',
    name: 'Hugging Face',
    icon: {
      type: 'brand',
      visualMode: 'logo',
      scale: 1,
      brightness: 1.25,
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
      type: 'brand',
      visualMode: 'logo',
      scale: 0.95,
      brightness: 1.25,
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
      type: 'brand',
      visualMode: 'logo',
      scale: 1,
      brightness: 1.25,
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
      type: 'brand',
      visualMode: 'logo',
      scale: 1,
      brightness: 1.25,
      source: 'svgl',
      key: 'cohere',
      fallbackLevel: 2,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'svgl:cohere',
      brandColor: '#39594D',
      url: '/assets/icons/svgl/cohere.svg',
    },
  },
  'langchain': {
    id: 'langchain',
    name: 'LangChain',
    icon: {
      type: 'framework',
      visualMode: 'logo',
      scale: 1,
      brightness: 1.25,
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
      type: 'framework',
      visualMode: 'symbol',
      scale: 1,
      brightness: 1.25,
      source: 'tech-stack-icons',
      key: 'langgraph',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:langgraph',
      brandColor: '#1C3C3C',
    },
  },
  'llamaindex': {
    id: 'llamaindex',
    name: 'LlamaIndex',
    icon: {
      type: 'framework',
      visualMode: 'logo',
      scale: 1,
      brightness: 1.25,
      source: 'tech-stack-icons',
      key: 'llamaindex',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:llamaindex',
      brandColor: '#2B1A4A',
    },
  },
  'crewai': {
    id: 'crewai',
    name: 'CrewAI',
    icon: {
      type: 'framework',
      visualMode: 'logo',
      scale: 1,
      brightness: 1.25,
      source: 'tech-stack-icons',
      key: 'crewai',
      fallbackLevel: 1,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:crewai',
      brandColor: '#FF4B4B',
    },
  },
  'autogen': {
    id: 'autogen',
    name: 'AutoGen',
    icon: {
      type: 'framework',
      visualMode: 'symbol',
      scale: 0.95,
      brightness: 1.25,
      source: 'verified-local',
      key: 'autogen',
      fallbackLevel: 4,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'verified-local:autogen',
      brandColor: '#F7BD34',
      url: '/assets/icons/autogen.svg',
    },
  },
  'dify': {
    id: 'dify',
    name: 'Dify',
    icon: {
      type: 'framework',
      visualMode: 'logo',
      scale: 1,
      brightness: 1.25,
      source: 'simple-icons',
      key: 'siDify',
      fallbackLevel: 3,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'simple-icons:siDify',
      brandColor: '#155EEF',
      simpleIcon: siDify,
    },
  },
  'coze': {
    id: 'coze',
    name: 'Coze',
    icon: {
      type: 'brand',
      visualMode: 'logo',
      scale: 0.95,
      brightness: 1.25,
      source: 'simple-icons',
      key: 'siCoze',
      fallbackLevel: 3,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'simple-icons:siCoze',
      brandColor: '#4D53E8',
      simpleIcon: siCoze,
    },
  },
  'semantickernel': {
    id: 'semantickernel',
    name: 'Semantic Kernel',
    icon: {
      type: 'framework',
      visualMode: 'glyph',
      scale: 1.05,
      brightness: 1.25,
      source: 'verified-local',
      key: 'semantickernel',
      fallbackLevel: 4,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'verified-local:semantickernel',
      brandColor: '#0078D4',
      url: '/assets/icons/semantickernel.svg',
    },
  },
  'mcp': {
    id: 'mcp',
    name: 'MCP',
    icon: {
      type: 'protocol',
      visualMode: 'glyph',
      scale: 1.05,
      brightness: 1.25,
      source: 'verified-local',
      key: 'mcp',
      fallbackLevel: 4,
      classification: 'protocol-standard',
      status: 'verified',
      sourceAssetId: 'verified-local:mcp',
      brandColor: '#9B72CF',
      url: '/assets/icons/mcp.svg',
    },
  },
  'haystack': {
    id: 'haystack',
    name: 'Haystack',
    icon: {
      type: 'framework',
      visualMode: 'logo',
      scale: 0.95,
      brightness: 1.25,
      source: 'simple-icons',
      key: 'siHaystack',
      fallbackLevel: 3,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'simple-icons:siHaystack',
      brandColor: '#0B2C4A',
      simpleIcon: siHaystack,
    },
  },
  'langsmith': {
    id: 'langsmith',
    name: 'LangSmith',
    icon: {
      type: 'tool',
      visualMode: 'logo',
      scale: 0.95,
      brightness: 1.25,
      source: 'tech-stack-icons',
      key: 'langsmith',
      fallbackLevel: 1,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:langsmith',
      brandColor: '#1C3C3C',
    },
  },
  'pgvector': {
    id: 'pgvector',
    name: 'pgvector',
    icon: {
      type: 'tool',
      visualMode: 'glyph',
      scale: 1.05,
      brightness: 1.25,
      source: 'verified-local',
      key: 'pgvector',
      fallbackLevel: 4,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'verified-local:pgvector',
      brandColor: '#4169E1',
      url: '/assets/icons/pgvector.svg',
    },
  },
  'chroma': {
    id: 'chroma',
    name: 'Chroma',
    icon: {
      type: 'brand',
      visualMode: 'logo',
      scale: 1.05,
      brightness: 1.25,
      source: 'verified-local',
      key: 'chroma',
      fallbackLevel: 4,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'verified-local:chroma',
      brandColor: '#FF6446',
      url: '/assets/icons/chroma.svg',
    },
  },
  'milvus': {
    id: 'milvus',
    name: 'Milvus',
    icon: {
      type: 'brand',
      visualMode: 'logo',
      scale: 1,
      brightness: 1.25,
      source: 'simple-icons',
      key: 'siMilvus',
      fallbackLevel: 3,
      classification: 'technology-framework',
      status: 'verified',
      sourceAssetId: 'simple-icons:siMilvus',
      brandColor: '#00B4B6',
      simpleIcon: siMilvus,
    },
  },
  'weaviate': {
    id: 'weaviate',
    name: 'Weaviate',
    icon: {
      type: 'brand',
      visualMode: 'logo',
      scale: 1.05,
      brightness: 1.25,
      source: 'verified-local',
      key: 'weaviate',
      fallbackLevel: 4,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'verified-local:weaviate',
      brandColor: '#00D15B',
      url: '/assets/icons/weaviate.svg',
    },
  },
  'qdrant': {
    id: 'qdrant',
    name: 'Qdrant',
    icon: {
      type: 'brand',
      visualMode: 'logo',
      scale: 1,
      brightness: 1.25,
      source: 'svgl',
      key: 'qdrant',
      fallbackLevel: 2,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'svgl:qdrant',
      brandColor: '#DC382D',
      url: '/assets/icons/svgl/qdrant.svg',
    },
  },
  'pinecone': {
    id: 'pinecone',
    name: 'Pinecone',
    icon: {
      type: 'brand',
      visualMode: 'logo',
      scale: 0.95,
      brightness: 1.25,
      source: 'verified-local',
      key: 'pinecone',
      fallbackLevel: 4,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'verified-local:pinecone',
      brandColor: '#000000',
      url: '/assets/icons/pinecone.svg',
    },
  },
  'llamaparse': {
    id: 'llamaparse',
    name: 'LlamaParse',
    icon: {
      type: 'tool',
      visualMode: 'logo',
      scale: 1,
      brightness: 1.25,
      source: 'verified-local',
      key: 'llamaparse',
      fallbackLevel: 4,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'verified-local:llamaparse',
      brandColor: '#2B1A4A',
      url: '/assets/icons/llamaparse.svg',
    },
  },
  'unstructured': {
    id: 'unstructured',
    name: 'Unstructured',
    icon: {
      type: 'brand',
      visualMode: 'logo',
      scale: 0.95,
      brightness: 1.25,
      source: 'tech-stack-icons',
      key: 'unstructured',
      fallbackLevel: 1,
      classification: 'official-brand',
      status: 'verified',
      sourceAssetId: 'tech-stack-icons:unstructured',
      brandColor: '#171717',
    },
  },
  'prometheus': {
    id: 'prometheus',
    name: 'Prometheus',
    icon: {
      type: 'tool',
      visualMode: 'symbol',
      scale: 1,
      brightness: 1.25,
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
      type: 'tool',
      visualMode: 'logo',
      scale: 1,
      brightness: 1.25,
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
      type: 'tool',
      visualMode: 'symbol',
      scale: 1,
      brightness: 1.25,
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
 * Returns icon metadata definition directly from ICON_REGISTRY by skill ID.
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
      type: 'tool',
      visualMode: 'symbol',
      scale: 1.0,
      brightness: 1.0,
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
      type: icon.type,
      visualMode: icon.visualMode,
      scale: icon.scale,
      brightness: icon.brightness,
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
      type: icon.type,
      visualMode: icon.visualMode,
      scale: icon.scale,
      brightness: icon.brightness,
      source: 'svgl',
      fallbackLevel: 2,
      key: icon.key,
      url: icon.url || ('/assets/icons/svgl/' + icon.key + '.svg'),
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
      type: icon.type,
      visualMode: icon.visualMode,
      scale: icon.scale,
      brightness: icon.brightness,
      source: 'simple-icons',
      fallbackLevel: 3,
      key: icon.key,
      path: si?.path || '',
      hex: si?.hex || 'FFFFFF',
      classification: icon.classification,
      status: icon.status,
      kind: 'svg-path',
      title: si?.title || displayName,
      brandColor: icon.brandColor || (si?.hex ? ('#' + si.hex) : undefined),
    };
  }

  if (icon.source === 'verified-local') {
    return {
      id: def.id,
      name: displayName,
      type: icon.type,
      visualMode: icon.visualMode,
      scale: icon.scale,
      brightness: icon.brightness,
      source: 'verified-local',
      fallbackLevel: 4,
      key: icon.key,
      url: icon.url || ('/assets/icons/' + icon.key + '.svg'),
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
    type: 'tool',
    visualMode: 'symbol',
    scale: 1.0,
    brightness: 1.0,
    source: 'missing',
    fallbackLevel: 5,
    key: normalizedId,
    classification: 'missing',
    status: 'missing',
    kind: 'missing',
    title: displayName,
  };
}
