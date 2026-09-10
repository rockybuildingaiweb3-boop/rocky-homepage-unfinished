export interface CareerRole {
  period: string;
  role: string;
  company: string;
  location: string;
  summary: string;
  highlights: string[];
  techStack: string[];
}

export interface CareerProfile {
  title: string;
  subtitle: string;
  bio: string[];
  roles: CareerRole[];
  capabilities: Array<{
    category: string;
    items: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    period: string;
    detail: string;
  }>;
}

export const CAREER_DATA: CareerProfile = {
  title: 'Creative Technologist & Frontend Architect',
  subtitle: 'Crafting spatial interfaces, high-performance web systems, and intelligent digital instruments.',
  bio: [
    'Over 5+ years of multidisciplinary engineering across frontend architecture, 3D graphics (WebGL, Three.js), and modern AI/LLM tool orchestration.',
    'Specialized in bridging high-level artistic direction with low-level systems engineering—delivering tactile, living web applications that emphasize momentum, type-safety, and structural elegance.',
  ],
  roles: [
    {
      period: '2023 — Present',
      role: 'Lead Creative Technologist & Full-Stack Architect',
      company: 'Independent Studio & Consultancies',
      location: 'Remote / Global',
      summary: 'Architecting dynamic enterprise applications, custom WebGL visual experiences, and full-stack platforms for educational institutions, design studios, and technology startups.',
      highlights: [
        'Engineered full-stack CMS and responsive web applications for Marymount International School Paris.',
        'Designed and deployed digital management platforms and research databases for Life-Cycle Management Laboratory.',
        'Developed WebGL image distortion shaders and 1:1 physics momentum sliders with 60fps rendering.',
        'Implemented autonomous AI agent workflows and structured tool calling via OpenAI and Claude APIs.',
      ],
      techStack: ['TypeScript', 'React', 'Next.js', 'Three.js', 'WebGL', 'Node.js', 'PostgreSQL', 'LangChain', 'OpenAI'],
    },
    {
      period: '2021 — 2023',
      role: 'Senior Frontend Developer & UI Engineer',
      company: 'Digital Product & Engineering Labs',
      location: 'Vancouver, BC',
      summary: 'Focused on complex interactive user interfaces, design token architectures, and high-velocity web experiences.',
      highlights: [
        'Built component design systems in Storybook with automated visual regression tests.',
        'Engineered stateful web3 dApps, wallet connection layers, and smart contract frontends on Ethereum & Polygon.',
        'Optimized client-side rendering bottlenecks, slashing LCP by 45% across mobile viewports.',
      ],
      techStack: ['TypeScript', 'React', 'Tailwind CSS', 'Solidity', 'Web3.js', 'Docker', 'GraphQL'],
    },
  ],
  capabilities: [
    {
      category: 'Frontend & Kinetic Motion',
      items: ['TypeScript', 'React 19', 'Next.js SSR/SSG', 'Svelte', 'Tailwind CSS', 'Motion / GSAP', 'Web Accessibility (a11y)'],
    },
    {
      category: '3D Spatial & Creative Coding',
      items: ['Three.js', 'WebGL / GLSL Shaders', 'WebGPU', 'Blender Asset Pipelines', 'Raycasting & Hit-Testing'],
    },
    {
      category: 'AI & Systems Engineering',
      items: ['OpenAI & Claude APIs', 'LangChain & Agentic Loops', 'Vector Embeddings & RAG', 'Python / PyTorch', 'Ollama Local Models'],
    },
    {
      category: 'Backend & Infrastructure',
      items: ['Node.js & Express', 'PostgreSQL & Supabase', 'Prisma & Drizzle', 'Docker Containers', 'Edge Deployments'],
    },
  ],
  education: [
    {
      degree: 'Bachelor of Science (B.Sc.) in Computer Science & Interactive Media',
      institution: 'University of British Columbia (UBC)',
      period: 'Graduated with Distinction',
      detail: 'Focused on Computer Graphics, Human-Computer Interaction, and Distributed Systems.',
    },
  ],
};
