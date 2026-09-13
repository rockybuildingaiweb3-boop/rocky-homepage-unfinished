import type { StudioProject } from '../types';

export const STUDIO_PROJECTS: StudioProject[] = [
  {
    id: 'chronos-ai',
    title: 'Chronos Engine',
    category: 'Creative AI & WebGL',
    year: '2025',
    details: {
      summary: 'Autonomous Visual Engine',
      description:
        'A real-time generative visual simulation platform combining custom GLSL compute shaders with low-latency LLM agent interactions for immersive architectural storytelling.',
    },
    roles: ['Lead Creative Technologist', 'WebGL / GLSL Architecture', 'Full-Stack Developer'],
    image: '/assets/imgs/studio/project-1.jpg',
    links: [
      {
        type: 'web',
        text: 'Live Experience',
        link: 'https://github.com/rockybuildingaiweb3-boop',
      },
      {
        type: 'case-study',
        text: 'System Blueprint',
        link: 'https://github.com/rockybuildingaiweb3-boop',
      },
    ],
    metadata: {
      client: 'Studio R&D',
      stack: 'Three.js, GLSL, WebGPU, TypeScript',
    },
  },
  {
    id: 'aether-protocol',
    title: 'Aether Protocol',
    category: 'Decentralized Architecture',
    year: '2025',
    details: {
      summary: 'On-Chain Interface System',
      description:
        'High-frequency institutional decentralized liquidity routing terminal. Designed with zero-latency state synchronization, custom cryptographic signing workflows, and cinematic data visualization.',
    },
    roles: ['Protocol Designer', 'Frontend Architecture', 'Smart Contract Integrations'],
    image: '/assets/imgs/studio/project-2.jpg',
    links: [
      {
        type: 'web',
        text: 'Visit Platform',
        link: 'https://github.com/rockybuildingaiweb3-boop',
      },
    ],
    metadata: {
      client: 'Aether Labs',
      stack: 'Viem, Wagmi, React, Tailwind, Solidity',
    },
  },
  {
    id: 'neural-canvas',
    title: 'Neural Synthesizer',
    category: 'Generative Audio-Visual',
    year: '2024',
    details: {
      summary: 'Spatial Sound & Optics',
      description:
        'Interactive spatial audio-reactive synthesizer reacting in real-time to multi-channel microphone input and procedural particle mechanics rendered via GPU instancing.',
    },
    roles: ['Audio Programmer', 'Shader Developer', 'Interaction Designer'],
    image: '/assets/imgs/studio/project-3.jpg',
    links: [
      {
        type: 'web',
        text: 'Interactive Demo',
        link: 'https://github.com/rockybuildingaiweb3-boop',
      },
    ],
    metadata: {
      client: 'Sonic Arts Initiative',
      stack: 'Web Audio API, Three.js, React, Node.js',
    },
  },
  {
    id: 'quantum-vault',
    title: 'Sovereign Nexus',
    category: 'Distributed Systems',
    year: '2024',
    details: {
      summary: 'Autonomous Agent Cluster',
      description:
        'A resilient distributed multi-agent coordinator connecting heterogeneous model ensembles across decentralized edge nodes with real-time vector telemetry and graph analytics.',
    },
    roles: ['Systems Architect', 'Full-Stack Developer', 'UI/UX Designer'],
    image: '/assets/imgs/studio/project-4.jpg',
    links: [
      {
        type: 'web',
        text: 'View Architecture',
        link: 'https://github.com/rockybuildingaiweb3-boop',
      },
    ],
    metadata: {
      client: 'Autonomous Edge Network',
      stack: 'Python, TypeScript, Vector DB, GraphQL',
    },
  },
  {
    id: 'veritas-identity',
    title: 'Veritas Zero',
    category: 'Zero-Knowledge Identity',
    year: '2024',
    details: {
      summary: 'ZK-Proof Credential Suite',
      description:
        'Cryptographic credential issuance and self-sovereign verification protocol engineered for privacy-preserving verifiable computations with millisecond proof verification.',
    },
    roles: ['ZK Research Engineer', 'Front-End Designer', 'Product Architect'],
    image: '/assets/imgs/studio/project-5.jpg',
    links: [
      {
        type: 'web',
        text: 'Documentation',
        link: 'https://github.com/rockybuildingaiweb3-boop',
      },
      {
        type: 'github',
        text: 'Source Code',
        link: 'https://github.com/rockybuildingaiweb3-boop',
      },
    ],
    metadata: {
      client: 'Veritas Foundation',
      stack: 'Circom, SnarkJS, React 19, TypeScript',
    },
  },
];
