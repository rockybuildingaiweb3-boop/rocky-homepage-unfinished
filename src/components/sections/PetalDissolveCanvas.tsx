import React, { useRef, useEffect } from 'react';

interface FlowerCluster {
  id: string;
  imgX: number; // 0..1 normalized in home-back.jpg (1920x1306)
  imgY: number; // 0..1 normalized in home-back.jpg
  spreadX: number;
  spreadY: number;
  palette: [number, number, number][]; // Authentic watercolor pigments sampled from the artwork
}

// 15 distinct botanical flower heads directly catalogued from home-back.jpg
const FLOWER_CLUSTERS: FlowerCluster[] = [
  {
    id: 'top-left-gold',
    imgX: 0.08,
    imgY: 0.16,
    spreadX: 0.035,
    spreadY: 0.045,
    palette: [
      [225, 175, 75],
      [245, 210, 110],
      [205, 145, 50],
      [240, 195, 90],
    ],
  },
  {
    id: 'left-white',
    imgX: 0.11,
    imgY: 0.42,
    spreadX: 0.04,
    spreadY: 0.05,
    palette: [
      [245, 242, 248],
      [228, 225, 238],
      [250, 235, 240],
      [215, 220, 235],
    ],
  },
  {
    id: 'left-violet',
    imgX: 0.14,
    imgY: 0.55,
    spreadX: 0.035,
    spreadY: 0.045,
    palette: [
      [135, 75, 145],
      [155, 90, 168],
      [115, 55, 125],
      [170, 105, 180],
    ],
  },
  {
    id: 'left-coral-tulip',
    imgX: 0.18,
    imgY: 0.66,
    spreadX: 0.045,
    spreadY: 0.05,
    palette: [
      [205, 75, 65],
      [185, 50, 58],
      [225, 120, 75],
      [235, 150, 95],
    ],
  },
  {
    id: 'mid-left-yellow',
    imgX: 0.30,
    imgY: 0.57,
    spreadX: 0.04,
    spreadY: 0.055,
    palette: [
      [240, 195, 75],
      [250, 215, 105],
      [215, 160, 55],
      [245, 185, 80],
    ],
  },
  {
    id: 'mid-left-purple',
    imgX: 0.39,
    imgY: 0.52,
    spreadX: 0.035,
    spreadY: 0.045,
    palette: [
      [125, 60, 130],
      [105, 45, 110],
      [160, 95, 170],
      [145, 75, 150],
    ],
  },
  {
    id: 'lower-rose-white',
    imgX: 0.31,
    imgY: 0.85,
    spreadX: 0.045,
    spreadY: 0.045,
    palette: [
      [242, 225, 230],
      [230, 210, 218],
      [248, 195, 205],
      [225, 215, 225],
    ],
  },
  {
    id: 'lower-crimson',
    imgX: 0.38,
    imgY: 0.74,
    spreadX: 0.04,
    spreadY: 0.045,
    palette: [
      [198, 58, 65],
      [175, 42, 52],
      [218, 85, 75],
      [185, 50, 60],
    ],
  },
  {
    id: 'center-luminous-white',
    imgX: 0.53,
    imgY: 0.52,
    spreadX: 0.05,
    spreadY: 0.06,
    palette: [
      [252, 252, 255],
      [238, 242, 250],
      [248, 245, 238],
      [225, 235, 245],
    ],
  },
  {
    id: 'center-deep-purple',
    imgX: 0.59,
    imgY: 0.73,
    spreadX: 0.04,
    spreadY: 0.05,
    palette: [
      [100, 52, 120],
      [130, 70, 155],
      [85, 42, 105],
      [145, 85, 168],
    ],
  },
  {
    id: 'mid-right-coral',
    imgX: 0.67,
    imgY: 0.62,
    spreadX: 0.045,
    spreadY: 0.05,
    palette: [
      [220, 100, 85],
      [240, 135, 110],
      [205, 75, 68],
      [235, 155, 95],
    ],
  },
  {
    id: 'mid-right-gold',
    imgX: 0.72,
    imgY: 0.77,
    spreadX: 0.04,
    spreadY: 0.045,
    palette: [
      [232, 175, 68],
      [248, 200, 90],
      [210, 150, 50],
      [245, 185, 78],
    ],
  },
  {
    id: 'right-luminous-white',
    imgX: 0.80,
    imgY: 0.63,
    spreadX: 0.045,
    spreadY: 0.05,
    palette: [
      [245, 248, 255],
      [230, 240, 248],
      [248, 235, 242],
      [222, 232, 245],
    ],
  },
  {
    id: 'right-deep-violet',
    imgX: 0.93,
    imgY: 0.63,
    spreadX: 0.035,
    spreadY: 0.045,
    palette: [
      [115, 62, 135],
      [90, 45, 110],
      [145, 88, 165],
      [128, 70, 148],
    ],
  },
  {
    id: 'top-right-coral-rose',
    imgX: 0.91,
    imgY: 0.23,
    spreadX: 0.045,
    spreadY: 0.05,
    palette: [
      [230, 115, 95],
      [248, 150, 125],
      [215, 85, 78],
      [240, 130, 105],
    ],
  },
];

interface PetalParticle {
  // Spatial origin tied to artwork
  clusterIdx: number;
  normX: number;
  normY: number;
  originX: number;
  originY: number;

  // Current simulation coordinates
  x: number;
  y: number;

  // Multi-tier spatial depth (0.35 = far background, 1.35 = close foreground)
  depth: number;
  size: number;
  aspect: number;
  curvature: number;

  // Source colors
  baseR: number;
  baseG: number;
  baseB: number;
  highlightShift: number;

  // Aerodynamic & turbulence parameters
  liftVelocity: number;
  driftSeed: number;
  rotAngle: number;
  rotSpeed: number;
  flutterPhase: number;
  flutterSpeed: number;
  starlightPhase: number;
  starlightFreq: number;
}

interface PetalDissolveCanvasProps {
  progress: number; // 0 (daytime garden in rest) -> 1 (full midnight cosmos in studio)
}

/**
 * Calculates responsive screen coordinates for artwork points matching object-cover object-center
 */
function mapArtworkCoords(
  normX: number,
  normY: number,
  canvasW: number,
  canvasH: number
): { x: number; y: number } {
  const imgAspect = 1920 / 1306; // 1.470
  const screenAspect = canvasW / canvasH;

  let renderedW: number;
  let renderedH: number;
  let offsetX: number;
  let offsetY: number;

  if (screenAspect > imgAspect) {
    renderedW = canvasW;
    renderedH = canvasW / imgAspect;
    offsetX = 0;
    offsetY = (canvasH - renderedH) / 2;
  } else {
    renderedH = canvasH;
    renderedW = canvasH * imgAspect;
    offsetX = (canvasW - renderedW) / 2;
    offsetY = 0;
  }

  return {
    x: offsetX + normX * renderedW,
    y: offsetY + normY * renderedH,
  };
}

/**
 * Multi-harmonic turbulence curl field for organic rising air currents
 */
function getCurlFlow(x: number, y: number, timeMs: number, screenW: number) {
  const t = timeMs * 0.0005;
  const s = 0.002;

  const n1 = Math.sin(x * s + t * 0.7);
  const n2 = Math.cos(y * s * 1.3 - t * 0.5);
  const n3 = Math.sin((x + y) * s * 0.8 + t * 0.9);
  const angle = n1 * 1.5 + n2 * 1.2 + n3 * 0.6;

  // Thermal wind drifts upward and spreads gently outward away from center
  const centerSpread = ((x - screenW * 0.5) / (screenW * 0.5)) * 0.6;
  const vx = Math.cos(angle) * 1.05 + centerSpread;
  const vy = Math.sin(angle) * 0.55 - 1.2;

  return { vx, vy };
}

/**
 * PetalDissolveCanvas (花瓣粒子化):
 * Visual dissolution of the botanical artwork (home-back.jpg) into the cosmic environment.
 * Sequence:
 * BOTANICAL WORLD (0.00-0.15)
 * -> SUBTLE PETAL MOVEMENT (0.15-0.35)
 * -> ORGANIC PETAL FRAGMENTS LIFTING (0.35-0.55)
 * -> LUMINOUS PARTICLES & SHARDS (0.55-0.75)
 * -> FINE COSMIC DUST MERGING WITH NEBULA (0.75-1.00)
 */
export const PetalDissolveCanvas: React.FC<PetalDissolveCanvasProps> = ({ progress }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<PetalParticle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const progressRef = useRef<number>(progress);
  const smoothedProgressRef = useRef<number>(progress);

  const animatingRef = useRef<boolean>(false);
  const lastTimeRef = useRef<number>(performance.now());
  const reducedMotionRef = useRef<boolean>(false);

  // Sync scroll progress and activate animation loop if needed
  useEffect(() => {
    progressRef.current = progress;

    if (reducedMotionRef.current) {
      renderStaticFrame(progress);
      return;
    }

    if (progress > 0.01 && !animatingRef.current) {
      animatingRef.current = true;
      lastTimeRef.current = performance.now();
      animFrameRef.current = requestAnimationFrame(renderLoop);
    }
  }, [progress]);

  // Reduced motion static render handler
  const renderStaticFrame = (p: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    ctx.clearRect(0, 0, width, height);

    if (p <= 0.15) return;

    const particles = particlesRef.current;
    const liftFactor = Math.pow(Math.max(0, p - 0.15) / 0.85, 1.35);

    for (let i = 0; i < particles.length; i += 2) {
      const pt = particles[i];
      const y = pt.originY - liftFactor * (height * 0.9 + pt.liftVelocity * 100);
      const x = pt.originX + Math.sin(i) * 20 * p;
      const alpha = Math.min(0.8, (p - 0.15) * 1.5) * (pt.depth > 1 ? 0.9 : 0.6);

      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgb(${pt.baseR}, ${pt.baseG}, ${pt.baseB})`;
      ctx.beginPath();
      ctx.arc(0, 0, pt.size * 0.3 * pt.depth, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  };

  const renderLoop = (now: number) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      animatingRef.current = false;
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      animatingRef.current = false;
      return;
    }

    const dt = Math.min(32, now - lastTimeRef.current) / 16.66;
    lastTimeRef.current = now;

    // Smooth progress interpolation to avoid jerky transitions on sudden scroll wheel ticks
    const targetProgress = progressRef.current;
    smoothedProgressRef.current += (targetProgress - smoothedProgressRef.current) * Math.min(1, 0.14 * dt);
    const p = smoothedProgressRef.current;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    ctx.clearRect(0, 0, width, height);

    // Sleep condition: when scroll is near zero and progress has settled
    if (p <= 0.01 && targetProgress <= 0.01) {
      animatingRef.current = false;
      animFrameRef.current = null;
      return;
    }

    // Continuous conceptual progression blending factors
    // 0.00 - 0.15: invisible
    // 0.15 - 0.35: subtle petal presence
    // 0.35 - 0.55: petal fragments lifting away
    // 0.55 - 0.75: fragments break into smaller luminous particles
    // 0.75 - 1.00: fine cosmic dust merging with nebula
    const activityAlpha = Math.min(1, Math.max(0, (p - 0.14) / 0.14));
    const petalFactor = Math.max(0, 1 - Math.max(0, (p - 0.42) / 0.25));
    const shardFactor =
      p < 0.38
        ? 0
        : p < 0.65
        ? (p - 0.38) / 0.27
        : Math.max(0, 1 - (p - 0.65) / 0.25);
    const cosmicDustFactor = Math.min(1, Math.max(0, (p - 0.58) / 0.32));
    const liftFactor = Math.pow(Math.max(0, p - 0.15) / 0.85, 1.38);

    const particles = particlesRef.current;

    for (let i = 0; i < particles.length; i++) {
      const pt = particles[i];

      // 1. Aerodynamic Position Integration
      const targetY = pt.originY - liftFactor * (height * 0.96 + pt.liftVelocity * 150);
      pt.y += (targetY - pt.y) * 0.12 * dt;

      const flow = getCurlFlow(pt.x, pt.y, now, width);
      const windSpread = (Math.sin(now * 0.0008 + pt.driftSeed) * 0.9 + pt.driftSeed * 0.2) * p;
      pt.x += (flow.vx * pt.depth * 1.35 + windSpread) * dt;

      // 2. 3D Tumbling, Flutter & Pitch Rocking
      pt.rotAngle += (pt.rotSpeed + flow.vx * 0.018) * dt * (1 + p * 1.4);
      pt.flutterPhase += pt.flutterSpeed * dt;
      const flutterScaleX = 0.32 + 0.68 * Math.abs(Math.cos(pt.flutterPhase));

      // 3. Color Shift: Botanical -> Soft Highlight -> Starlight & Cosmic Purple
      const r0 = pt.baseR;
      const g0 = pt.baseG;
      const b0 = pt.baseB;

      const cosmicR = Math.min(255, 230 + Math.round(25 * pt.highlightShift));
      const cosmicG = Math.min(255, 220 + Math.round(35 * pt.highlightShift));
      const cosmicB = 255;

      const colorShift = Math.min(1, Math.max(0, (p - 0.35) / 0.50));
      const curR = Math.round(r0 + (cosmicR - r0) * colorShift);
      const curG = Math.round(g0 + (cosmicG - g0) * colorShift);
      const curB = Math.round(b0 + (cosmicB - b0) * colorShift);

      // Depth-based alpha variation (foreground brighter, background dimmer)
      const depthAlpha = pt.depth >= 1.0 ? 0.92 : pt.depth <= 0.6 ? 0.58 : 0.78;
      // Gentle boundary dissipation at upper edge
      const boundaryDissipation = Math.min(1, Math.max(0, (pt.y + 60) / 120));
      const particleAlpha = activityAlpha * depthAlpha * boundaryDissipation;

      if (particleAlpha <= 0.01) continue;

      ctx.save();
      ctx.translate(pt.x, pt.y);
      ctx.rotate(pt.rotAngle);
      ctx.scale(flutterScaleX, 1);

      // ─────────────────────────────────────────────────────────────
      // STAGE 1: ORGANIC PETAL FRAGMENT (Bezier petal contour + spine)
      // ─────────────────────────────────────────────────────────────
      if (petalFactor > 0.02) {
        const pSize = pt.size * (1 - cosmicDustFactor * 0.42) * pt.depth;
        const pLen = pSize * pt.aspect;
        const pWid = pSize;
        const curve = pt.curvature * pWid * 0.55;

        ctx.globalAlpha = particleAlpha * petalFactor;
        ctx.fillStyle = `rgba(${curR}, ${curG}, ${curB}, 0.88)`;
        ctx.shadowColor = `rgba(${curR}, ${curG}, ${curB}, 0.4)`;
        ctx.shadowBlur = 5 * pt.depth;

        // Custom organic Bezier curve petal sliver
        ctx.beginPath();
        ctx.moveTo(0, -pLen * 0.5);
        ctx.bezierCurveTo(
          pWid * 0.75 + curve, -pLen * 0.2,
          pWid * 0.85 + curve, pLen * 0.3,
          0, pLen * 0.5
        );
        ctx.bezierCurveTo(
          -pWid * 0.7 + curve, pLen * 0.3,
          -pWid * 0.6 + curve, -pLen * 0.2,
          0, -pLen * 0.5
        );
        ctx.closePath();
        ctx.fill();

        // Delicate inner spine stroke
        ctx.shadowBlur = 0;
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.32 * petalFactor})`;
        ctx.lineWidth = Math.max(0.6, 0.8 * pt.depth);
        ctx.beginPath();
        ctx.moveTo(0, -pLen * 0.38);
        ctx.quadraticCurveTo(curve * 0.35, 0, 0, pLen * 0.32);
        ctx.stroke();
      }

      // ─────────────────────────────────────────────────────────────
      // STAGE 2: SHARD FRAGMENTATION (Micro-petals separating)
      // ─────────────────────────────────────────────────────────────
      if (shardFactor > 0.05) {
        const shardSize = pt.size * 0.38 * pt.depth;
        ctx.globalAlpha = particleAlpha * shardFactor * 0.82;
        ctx.fillStyle = `rgba(${curR}, ${curG}, ${curB}, 0.85)`;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.45)';
        ctx.shadowBlur = 4;

        // Satellite micro-shard floating alongside main fragment
        const satOffset = 7 + pt.size * 0.3;
        ctx.beginPath();
        ctx.arc(satOffset * Math.cos(pt.rotAngle), satOffset * Math.sin(pt.rotAngle), shardSize * 0.65, 0, Math.PI * 2);
        ctx.fill();
      }

      // ─────────────────────────────────────────────────────────────
      // STAGE 3: FINE LUMINOUS COSMIC DUST (Merging into space nebula)
      // ─────────────────────────────────────────────────────────────
      if (cosmicDustFactor > 0.05) {
        const dustRadius = (1.1 + pt.size * 0.16) * pt.depth;
        const pulse = 0.82 + 0.18 * Math.sin(now * 0.003 * pt.starlightFreq + pt.starlightPhase);
        const starlightAlpha = particleAlpha * cosmicDustFactor * pulse;

        ctx.globalAlpha = Math.min(1, starlightAlpha);

        // Radiant ethereal aura blending seamlessly with cosmic background
        const auraGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, dustRadius * 3.0);
        auraGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        auraGrad.addColorStop(0.35, `rgba(${curR}, ${curG}, ${curB}, 0.72)`);
        auraGrad.addColorStop(0.7, 'rgba(168, 85, 247, 0.32)');
        auraGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');

        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(0, 0, dustRadius * 3.0, 0, Math.PI * 2);
        ctx.fill();

        // Pinpoint diamond core starlight
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(0.6, dustRadius * 0.55), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    animFrameRef.current = requestAnimationFrame(renderLoop);
  };

  // Canvas initialization, DPI scaling, and deterministic particle spawning from flower artwork
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    reducedMotionRef.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const setupCanvas = () => {
      if (!canvas) return;
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Handle high-DPI screens without degrading performance (cap at 2x)
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      initParticles(width, height);

      if (reducedMotionRef.current) {
        renderStaticFrame(progressRef.current);
      }
    };

    const initParticles = (width: number, height: number) => {
      // Responsive particle count: ~55 on mobile, ~80 on tablet, ~105 on desktop
      const totalCount = Math.max(50, Math.min(110, Math.floor(width / 18)));
      const list: PetalParticle[] = [];

      // Generate particles deterministically distributed among the 15 flower heads
      for (let i = 0; i < totalCount; i++) {
        const cluster = FLOWER_CLUSTERS[i % FLOWER_CLUSTERS.length];
        const pChoice = cluster.palette[i % cluster.palette.length];

        // Organic scatter around the natural flower cluster
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.sqrt(Math.random());
        const normX = cluster.imgX + Math.cos(angle) * cluster.spreadX * dist;
        const normY = cluster.imgY + Math.sin(angle) * cluster.spreadY * dist;

        const coords = mapArtworkCoords(normX, normY, width, height);

        // 3-Tier spatial depth distribution:
        // 35% Deep Background (0.4-0.65), 45% Midground (0.75-1.05), 20% Foreground (1.15-1.4)
        const tierRoll = Math.random();
        let depth: number;
        if (tierRoll < 0.35) {
          depth = 0.42 + Math.random() * 0.25; // background
        } else if (tierRoll < 0.80) {
          depth = 0.78 + Math.random() * 0.28; // midground
        } else {
          depth = 1.15 + Math.random() * 0.25; // foreground
        }

        list.push({
          clusterIdx: i % FLOWER_CLUSTERS.length,
          normX,
          normY,
          originX: coords.x,
          originY: coords.y,
          x: coords.x,
          y: coords.y,
          depth,
          size: (7 + Math.random() * 8) * (depth > 1 ? 1.15 : depth < 0.6 ? 0.8 : 1.0),
          aspect: 1.8 + Math.random() * 1.4, // slender petal aspect ratio
          curvature: (Math.random() - 0.5) * 1.8,
          baseR: pChoice[0],
          baseG: pChoice[1],
          baseB: pChoice[2],
          highlightShift: Math.random(),
          liftVelocity: 0.85 + Math.random() * 1.3,
          driftSeed: (Math.random() - 0.5) * 2.2,
          rotAngle: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.035,
          flutterPhase: Math.random() * Math.PI * 2,
          flutterSpeed: 0.04 + Math.random() * 0.05,
          starlightPhase: Math.random() * Math.PI * 2,
          starlightFreq: 0.8 + Math.random() * 0.6,
        });
      }

      particlesRef.current = list;
    };

    setupCanvas();

    const handleResize = () => {
      setupCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[8]"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    />
  );
};
