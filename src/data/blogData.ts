export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  readTime: string;
  excerpt: string;
  content: string[];
  tags: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'physical-inertia-living-ui',
    slug: 'physical-inertia-living-ui',
    title: 'On Physical Inertia and Living Interfaces',
    date: 'Spring 2026',
    category: 'Design Engineering',
    readTime: '4 min read',
    excerpt: 'Why spring dynamics, momentum deceleration, and tactile gesture response transform flat web pages into tangible digital instruments.',
    content: [
      'Digital interfaces often fail not because their layout is poor, but because they violate our instinctual expectations of physics. When an element stops dead the moment a finger lifts from the glass, it shatters the illusion of mass.',
      'In designing the Studio slider, the choice to use velocity-informed interpolation rather than static CSS transitions was deliberate. When a drag gesture terminates, the system preserves instantaneous speed, feeding it directly into a momentum decay curve.',
      'By treating the DOM not as a collection of static rectangular boxes, but as physical surfaces possessing weight and air resistance, user interactions cease to feel like data retrieval and begin to feel like handling physical craft.',
    ],
    tags: ['Physics', 'Interaction Design', 'Kinetic UI', 'WebGL'],
  },
  {
    id: 'layering-contracts-webgl-apps',
    slug: 'layering-contracts-webgl-apps',
    title: '2.5D Layering Contracts in Hybrid WebGL Architectures',
    date: 'Winter 2026',
    category: 'Systems & Architecture',
    readTime: '6 min read',
    excerpt: 'Diagnosing invisible hit-testing collisions, stacking contexts, and Three.js canvas isolation in complex creative engineering portfolios.',
    content: [
      'One of the most insidious failure modes in modern creative web development occurs at the boundary between WebGL canvases and standard HTML semantics. An invisible canvas rendering a background starfield can silently intercept mouse clicks across the entire viewport if pointer-events contracts are breached.',
      'Establishing a strict spatial contract requires segregating the screen into distinct planes: background decorative layers (particles, cosmic starfields, cinematic film grain) must strictly declare pointer-events: none, while interactive containers retain deterministic hit-testing.',
      'By isolating WebGL rendering loops from React component trees and treating Three.js meshes as visual overlays rather than DOM replacements, we achieve high-framerate visual fidelity without compromising accessibility or basic clickability.',
    ],
    tags: ['WebGL', 'Architecture', 'CSS', 'Performance'],
  },
  {
    id: 'latent-space-design-engineering',
    slug: 'latent-space-design-engineering',
    title: 'Designing with LLMs as Latent Creative Instruments',
    date: '2026',
    category: 'AI Systems',
    readTime: '5 min read',
    excerpt: 'Moving beyond conversational chatbots into structured tool orchestration, multi-agent pipelines, and context-aware interfaces.',
    content: [
      'The current paradigm of treating artificial intelligence as a generic chat box is a temporary historical anomaly. The real leverage of large language models lies in their ability to act as semantic compilers—transforming messy intent into structured, executable schemas.',
      'When integrating OpenAI, Claude, and LangChain into production platforms, the challenge is not generating text, but constructing deterministic tool calling chains and multi-step retrieval loops.',
      'By coupling dense vector embeddings with real-time UI state machines, software can anticipate user needs and synthesize bespoke interfaces on the fly.',
    ],
    tags: ['Artificial Intelligence', 'LLMs', 'Agentic Systems', 'RAG'],
  },
];
