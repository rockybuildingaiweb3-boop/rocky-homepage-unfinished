// Prospective candidates for 80 skills (16 per row)
const candidates = {
  row1: [
    // Existing (10):
    'typescript', 'javascript', 'react', 'nextdotjs', 'svelte', 'tailwindcss', 'framer', 'greensock', 'html5', 'vite',
    // New 6 additions:
    'vuedotjs', 'astro', 'nuxtdotjs', 'sass', 'css3', 'webpack'
  ],
  row2: [
    // Existing (10):
    'threedotjs', 'webgl', 'webgpu', 'opengl', 'blender', 'unity', 'unrealengine', 'vulkan', 'webassembly', 'godotengine',
    // New 6 additions:
    'shader', 'glsl', 'renderman', 'autodesk', 'directx', 'armature'
  ],
  row3: [
    // Existing (10):
    'nodedotjs', 'express', 'nestjs', 'postgresql', 'supabase', 'prisma', 'drizzle', 'redis', 'graphql', 'docker',
    // New 6 additions:
    'mongodb', 'kubernetes', 'nginx', 'linux', 'amazonwebservices', 'cloudflare'
  ],
  row4: [
    // Existing (10):
    'solidity', 'ethereum', 'polygon', 'solana', 'chainlink', 'alchemy', 'ipfs', 'web3dotjs', 'bitcoin', 'optimism',
    // New 6 additions:
    'arbitrum', 'base', 'avalanche', 'polkadot', 'metamask', 'gnosis'
  ],
  row5: [
    // AI Stack (16 candidates):
    'anthropic', 'python', 'langchain', 'huggingface', 'pytorch', 'ollama',
    'fastapi', 'tensorflow', 'scikitlearn', 'jupyter', 'pandas', 'numpy',
    'ray', 'anaconda', 'keras', 'weightsandbiases'
  ]
};

async function check() {
  const allSlugs = Object.values(candidates).flat();
  const results = await Promise.all(
    allSlugs.map(async (slug) => {
      try {
        const res = await fetch(`https://cdn.simpleicons.org/${slug}`);
        return { slug, ok: res.ok, status: res.status };
      } catch (err) {
        return { slug, ok: false, error: err.message };
      }
    })
  );

  const missing = results.filter(r => !r.ok);
  const found = results.filter(r => r.ok);
  console.log(`Found: ${found.length}/${allSlugs.length}`);
  if (missing.length > 0) {
    console.log('Missing slugs:', missing);
  }
}

check();
