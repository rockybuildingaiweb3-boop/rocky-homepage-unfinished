import React, { Component, useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import type { Points as PointsType, PointsMaterial as PointsMaterialType } from 'three';
import { isWebGLAvailable } from '../../utils';

export interface ParticleBackgroundProps {
  className?: string;
}

export interface StarLayerSpec {
  id: 'tiny' | 'medium' | 'bright' | 'accent';
  count: number;
  minRadius: number;
  maxRadius: number;
  color: string;
  webglSize: number;
  webglOpacity: number;
  canvasSize: number;
  canvasAlpha: number;
  rotSpeedX: number;
  rotSpeedY: number;
  twinkleAmp: number;
  twinkleFreq: number;
  seed: number;
}

/**
 * Four synchronized celestial starfield layers (WebGL + 2D Fallback parity).
 * Calibrated ~13% increase over the 5,065 baseline -> 5,725 total particles:
 * - Layer 1 (tiny):   4,400 low-alpha violet background stars
 * - Layer 2 (medium): 1,080 soft lavender mid-depth stars
 * - Layer 3 (bright):   170 luminous diamond micro-stars
 * - Layer 4 (accent):    75 celestial amethyst-ice glint stars with counter-drift
 */
export const STARFIELD_LAYER_SPECS: readonly StarLayerSpec[] = [
  {
    id: 'tiny',
    count: 4400,
    minRadius: 0.34,
    maxRadius: 1.72,
    color: '#d8b4fe',
    webglSize: 0.0016,
    webglOpacity: 0.35,
    canvasSize: 1.0,
    canvasAlpha: 0.28,
    rotSpeedX: 1 / 34,
    rotSpeedY: 1 / 44,
    twinkleAmp: 0.035,
    twinkleFreq: 0.75,
    seed: 101,
  },
  {
    id: 'medium',
    count: 1080,
    minRadius: 0.32,
    maxRadius: 1.66,
    color: '#f3e8ff',
    webglSize: 0.0029,
    webglOpacity: 0.55,
    canvasSize: 1.45,
    canvasAlpha: 0.48,
    rotSpeedX: 1 / 24,
    rotSpeedY: 1 / 32,
    twinkleAmp: 0.065,
    twinkleFreq: 1.15,
    seed: 202,
  },
  {
    id: 'bright',
    count: 170,
    minRadius: 0.3,
    maxRadius: 1.58,
    color: '#ffffff',
    webglSize: 0.0045,
    webglOpacity: 0.82,
    canvasSize: 2.05,
    canvasAlpha: 0.74,
    rotSpeedX: 1 / 18,
    rotSpeedY: 1 / 24,
    twinkleAmp: 0.1,
    twinkleFreq: 1.65,
    seed: 303,
  },
  {
    id: 'accent',
    count: 75,
    minRadius: 0.3,
    maxRadius: 1.54,
    color: '#e9d5ff',
    webglSize: 0.0038,
    webglOpacity: 0.68,
    canvasSize: 1.75,
    canvasAlpha: 0.62,
    rotSpeedX: 1 / 28,
    rotSpeedY: -1 / 38,
    twinkleAmp: 0.13,
    twinkleFreq: 2.1,
    seed: 404,
  },
] as const;

/**
 * Deterministic Halton sequence generator for low-discrepancy quasi-random sampling.
 */
function halton(index: number, base: number): number {
  let result = 0;
  let f = 1 / base;
  let i = index;
  while (i > 0) {
    result += f * (i % base);
    i = Math.floor(i / base);
    f /= base;
  }
  return result;
}

/**
 * Subtle organic stellar cluster attractors (unit direction vectors)
 * creating slight natural Milky-Way-like density modulation without leaving voids.
 */
const STELLAR_CLUSTER_DIRS: readonly [number, number, number][] = [
  [0.72, 0.38, -0.58],
  [-0.68, -0.34, -0.65],
  [-0.52, 0.64, 0.56],
  [0.61, -0.55, 0.57],
  [0.12, 0.78, -0.61],
];

/**
 * Generates a deterministic, stratified, viewport-aware 3D starfield buffer.
 *
 * Replaces `random.inSphere()` with a stratified Golden-Ratio Fibonacci spherical shell
 * + Halton quasi-random jitter + aspect-ratio-aware frustum envelope + subtle organic
 * cluster modulation. Guarantees complete coverage across center, edges, and all four
 * viewport corners at 1440×900, 1920×1080, and 390×844 without grid artifacts.
 */
export function generateStratifiedStarLayer(
  spec: StarLayerSpec,
  viewportAspect = 16 / 9
): Float32Array {
  const positions = new Float32Array(spec.count * 3);
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  const goldenAngle = 2 * Math.PI * (1 - 1 / goldenRatio);

  // Gently widen horizontal/diagonal reach on wide viewports so corners stay rich during rotation
  const clampedAspect = Math.max(0.45, Math.min(2.4, viewportAspect));
  const xAspectBoost =
    clampedAspect >= 1.0
      ? 1.0 + Math.min(0.32, (clampedAspect - 1.0) * 0.3)
      : 1.04;
  const yAspectBoost =
    clampedAspect < 1.0
      ? 1.0 + Math.min(0.28, (1.0 / clampedAspect - 1.0) * 0.24)
      : 1.04;

  for (let i = 0; i < spec.count; i++) {
    const sampleIdx = i + 1 + spec.seed * 997;

    // 1. Stratified polar & azimuthal coordinates via Fibonacci lattice + Halton jitter
    const h2 = halton(sampleIdx, 2);
    const h3 = halton(sampleIdx, 3);
    const h5 = halton(sampleIdx, 5);

    const stratifiedU = (i + 0.5) / spec.count;
    // Blend 72% stratified lattice with 28% Halton discrepancy to eliminate grid lines while preventing voids
    const u = Math.max(0.0005, Math.min(0.9995, stratifiedU * 0.72 + h2 * 0.28));
    const cosPhi = 1 - 2 * u;
    const sinPhi = Math.sqrt(Math.max(0, 1 - cosPhi * cosPhi));
    const theta = i * goldenAngle + (h3 - 0.5) * 0.85;

    let dx = sinPhi * Math.cos(theta);
    let dy = sinPhi * Math.sin(theta);
    let dz = cosPhi;

    // 2. Subtle organic clustering (~20% of stars gently pulled toward a nearby stellar stream)
    if (i % 5 === 0) {
      const cluster = STELLAR_CLUSTER_DIRS[(i + spec.seed) % STELLAR_CLUSTER_DIRS.length];
      const pull = 0.12;
      dx = dx * (1 - pull) + cluster[0] * pull;
      dy = dy * (1 - pull) + cluster[1] * pull;
      dz = dz * (1 - pull) + cluster[2] * pull;
      const norm = Math.hypot(dx, dy, dz) || 1;
      dx /= norm;
      dy /= norm;
      dz /= norm;
    }

    // 3. Depth-aware radial distribution across [minRadius, maxRadius]
    // Balanced 0.52 power exponent populates both inner frustum and outer corner shell
    const radialT = Math.pow(h5, 0.52);
    const r = spec.minRadius + (spec.maxRadius - spec.minRadius) * radialT;

    positions[i * 3] = dx * r * xAspectBoost;
    positions[i * 3 + 1] = dy * r * yAspectBoost;
    positions[i * 3 + 2] = dz * r;
  }

  return positions;
}

/**
 * Computes screen-space quadrant & corner coverage diagnostics matching the
 * Three.js 75° FOV camera at `z = 1` looking toward `-z`.
 */
export function evaluateStarfieldCoverage(
  width = 1440,
  height = 900
): {
  layerCounts: Record<StarLayerSpec['id'], number>;
  totalStars: number;
  quadrants: { upperLeft: number; upperRight: number; lowerLeft: number; lowerRight: number };
  corners: { topLeft: number; topRight: number; bottomLeft: number; bottomRight: number };
  centerRegion: number;
} {
  const aspect = width / height;
  const cx = width / 2;
  const cy = height / 2;
  const tanHalfFov = Math.tan((75 * Math.PI) / 360);
  const focalPx = Math.min(width, height) / (2 * tanHalfFov);
  const SQRT2_2 = Math.SQRT1_2;

  const layerCounts: Record<StarLayerSpec['id'], number> = {
    tiny: 0,
    medium: 0,
    bright: 0,
    accent: 0,
  };
  const quadrants = { upperLeft: 0, upperRight: 0, lowerLeft: 0, lowerRight: 0 };
  const corners = { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 };
  let centerRegion = 0;

  for (const spec of STARFIELD_LAYER_SPECS) {
    const pos = generateStratifiedStarLayer(spec, aspect);
    layerCounts[spec.id] = pos.length / 3;

    for (let i = 0; i < pos.length; i += 3) {
      const x0 = pos[i];
      const y0 = pos[i + 1];
      const z0 = pos[i + 2];

      const x1 = (x0 - y0) * SQRT2_2;
      const y1 = (x0 + y0) * SQRT2_2;
      const dist = 1.0 - z0;
      if (dist <= 0.08) continue;

      const factor = focalPx / dist;
      const px = cx + x1 * factor;
      const py = cy - y1 * factor;

      if (px < 0 || px >= width || py < 0 || py >= height) continue;

      const nx = px / width;
      const ny = py / height;

      if (nx < 0.5 && ny < 0.5) quadrants.upperLeft++;
      else if (nx >= 0.5 && ny < 0.5) quadrants.upperRight++;
      else if (nx < 0.5 && ny >= 0.5) quadrants.lowerLeft++;
      else quadrants.lowerRight++;

      if (nx < 0.25 && ny < 0.25) corners.topLeft++;
      if (nx > 0.75 && ny < 0.25) corners.topRight++;
      if (nx < 0.25 && ny > 0.75) corners.bottomLeft++;
      if (nx > 0.75 && ny > 0.75) corners.bottomRight++;
      if (nx >= 0.3 && nx <= 0.7 && ny >= 0.3 && ny <= 0.7) centerRegion++;
    }
  }

  return {
    layerCounts,
    totalStars:
      layerCounts.tiny + layerCounts.medium + layerCounts.bright + layerCounts.accent,
    quadrants,
    corners,
    centerRegion,
  };
}

/**
 * StarBackground — Multi-depth 4-layer WebGL celestial particle field
 */
export const StarBackground: React.FC = (props) => {
  const { size } = useThree();
  const aspectBucket = Math.round(((size.width || 1440) / (size.height || 900)) * 4) / 4;

  const refTiny = useRef<PointsType | null>(null);
  const refMed = useRef<PointsType | null>(null);
  const refBright = useRef<PointsType | null>(null);
  const refAccent = useRef<PointsType | null>(null);

  const matTiny = useRef<PointsMaterialType | null>(null);
  const matMed = useRef<PointsMaterialType | null>(null);
  const matBright = useRef<PointsMaterialType | null>(null);
  const matAccent = useRef<PointsMaterialType | null>(null);

  const layers = React.useMemo(() => {
    return {
      tiny: generateStratifiedStarLayer(STARFIELD_LAYER_SPECS[0], aspectBucket),
      medium: generateStratifiedStarLayer(STARFIELD_LAYER_SPECS[1], aspectBucket),
      bright: generateStratifiedStarLayer(STARFIELD_LAYER_SPECS[2], aspectBucket),
      accent: generateStratifiedStarLayer(STARFIELD_LAYER_SPECS[3], aspectBucket),
    };
  }, [aspectBucket]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const t = state.clock.elapsedTime;

    if (refTiny.current) {
      refTiny.current.rotation.x -= dt * STARFIELD_LAYER_SPECS[0].rotSpeedX;
      refTiny.current.rotation.y -= dt * STARFIELD_LAYER_SPECS[0].rotSpeedY;
    }
    if (refMed.current) {
      refMed.current.rotation.x -= dt * STARFIELD_LAYER_SPECS[1].rotSpeedX;
      refMed.current.rotation.y -= dt * STARFIELD_LAYER_SPECS[1].rotSpeedY;
    }
    if (refBright.current) {
      refBright.current.rotation.x -= dt * STARFIELD_LAYER_SPECS[2].rotSpeedX;
      refBright.current.rotation.y -= dt * STARFIELD_LAYER_SPECS[2].rotSpeedY;
    }
    if (refAccent.current) {
      refAccent.current.rotation.x -= dt * STARFIELD_LAYER_SPECS[3].rotSpeedX;
      refAccent.current.rotation.y -= dt * STARFIELD_LAYER_SPECS[3].rotSpeedY;
    }

    // Restrained material-level harmonic twinkle (zero React state updates)
    if (matTiny.current) {
      matTiny.current.opacity =
        STARFIELD_LAYER_SPECS[0].webglOpacity +
        Math.sin(t * STARFIELD_LAYER_SPECS[0].twinkleFreq) *
          STARFIELD_LAYER_SPECS[0].twinkleAmp;
    }
    if (matMed.current) {
      matMed.current.opacity =
        STARFIELD_LAYER_SPECS[1].webglOpacity +
        Math.sin(t * STARFIELD_LAYER_SPECS[1].twinkleFreq + 1.1) *
          STARFIELD_LAYER_SPECS[1].twinkleAmp;
    }
    if (matBright.current) {
      matBright.current.opacity =
        STARFIELD_LAYER_SPECS[2].webglOpacity +
        Math.sin(t * STARFIELD_LAYER_SPECS[2].twinkleFreq + 2.3) *
          STARFIELD_LAYER_SPECS[2].twinkleAmp;
    }
    if (matAccent.current) {
      matAccent.current.opacity =
        STARFIELD_LAYER_SPECS[3].webglOpacity +
        Math.cos(t * STARFIELD_LAYER_SPECS[3].twinkleFreq + 0.7) *
          STARFIELD_LAYER_SPECS[3].twinkleAmp;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      {/* Layer 1: Tiny low-alpha background stars (4,400 points) */}
      <Points ref={refTiny} stride={3} positions={layers.tiny} frustumCulled={false} {...props}>
        <PointMaterial
          ref={matTiny}
          transparent
          color={STARFIELD_LAYER_SPECS[0].color}
          size={STARFIELD_LAYER_SPECS[0].webglSize}
          opacity={STARFIELD_LAYER_SPECS[0].webglOpacity}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>

      {/* Layer 2: Medium soft lavender stars (1,080 points) */}
      <Points ref={refMed} stride={3} positions={layers.medium} frustumCulled={false} {...props}>
        <PointMaterial
          ref={matMed}
          transparent
          color={STARFIELD_LAYER_SPECS[1].color}
          size={STARFIELD_LAYER_SPECS[1].webglSize}
          opacity={STARFIELD_LAYER_SPECS[1].webglOpacity}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>

      {/* Layer 3: Bright diamond depth stars (170 points) */}
      <Points ref={refBright} stride={3} positions={layers.bright} frustumCulled={false} {...props}>
        <PointMaterial
          ref={matBright}
          transparent
          color={STARFIELD_LAYER_SPECS[2].color}
          size={STARFIELD_LAYER_SPECS[2].webglSize}
          opacity={STARFIELD_LAYER_SPECS[2].webglOpacity}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>

      {/* Layer 4: Celestial amethyst-ice accent glint stars (75 points) */}
      <Points ref={refAccent} stride={3} positions={layers.accent} frustumCulled={false} {...props}>
        <PointMaterial
          ref={matAccent}
          transparent
          color={STARFIELD_LAYER_SPECS[3].color}
          size={STARFIELD_LAYER_SPECS[3].webglSize}
          opacity={STARFIELD_LAYER_SPECS[3].webglOpacity}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

/**
 * Fallback 2D Canvas Starfield (Full 4-Layer Parity with WebGL)
 * Uses the exact same `STARFIELD_LAYER_SPECS` and `generateStratifiedStarLayer` distribution,
 * fixes the particle color index bug (`starIdx = i / 3`), and includes subtle twinkling.
 */
const StarBackground2D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let layerBuffers = STARFIELD_LAYER_SPECS.map((spec) =>
      generateStratifiedStarLayer(spec, width / (height || 1))
    );

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      layerBuffers = STARFIELD_LAYER_SPECS.map((spec) =>
        generateStratifiedStarLayer(spec, width / (height || 1))
      );
    };
    window.addEventListener('resize', handleResize);

    const rotX = [0, 0, 0, 0];
    const rotY = [0, 0, 0, 0];
    let elapsedSec = 0;
    let lastTime = performance.now();
    const SQRT2_2 = Math.SQRT1_2;

    // Pre-defined RGB palettes per layer with true per-star variation (indexed by starIdx = i / 3)
    const layerPalettes: readonly [string, string, string][] = [
      ['216, 180, 254', '192, 132, 252', '233, 213, 255'],
      ['243, 232, 255', '233, 213, 255', '250, 245, 255'],
      ['255, 255, 255', '245, 243, 255', '224, 231, 255'],
      ['233, 213, 255', '196, 181, 253', '255, 255, 255'],
    ];

    const renderLayer = (
      positions: Float32Array,
      layerIdx: number,
      rx: number,
      ry: number,
      twinkleOffset: number
    ) => {
      const spec = STARFIELD_LAYER_SPECS[layerIdx];
      const palette = layerPalettes[layerIdx];
      const cx = width / 2;
      const cy = height / 2;
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const tanHalfFov = Math.tan((75 * Math.PI) / 360);
      const focalPx = Math.min(width, height) / (2 * tanHalfFov);

      for (let i = 0; i < positions.length; i += 3) {
        const starIdx = i / 3;
        const x0 = positions[i];
        const y0 = positions[i + 1];
        const z0 = positions[i + 2];

        // 1. Group rotation Z by PI/4
        const x1 = (x0 - y0) * SQRT2_2;
        const y1 = (x0 + y0) * SQRT2_2;
        const z1 = z0;

        // 2. Rotate around X
        const x2 = x1;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;

        // 3. Rotate around Y
        const x3 = x2 * cosY + z2 * sinY;
        const y3 = y2;
        const z3 = -x2 * sinY + z2 * cosY;

        // 4. Perspective projection
        const dist = 1.0 - z3;
        if (dist <= 0.08) continue;

        const factor = focalPx / dist;
        const px = cx + x3 * factor;
        const py = cy - y3 * factor;

        if (px < 0 || px >= width || py < 0 || py >= height) continue;

        const starTwinkle =
          starIdx % 7 === 0
            ? Math.sin(elapsedSec * spec.twinkleFreq + (starIdx % 13)) * spec.twinkleAmp
            : twinkleOffset;
        const alpha = Math.max(
          0.06,
          Math.min(0.9, ((spec.canvasAlpha + starTwinkle) * 0.96) / Math.pow(dist, 0.75))
        );
        const rgb = palette[starIdx % 3];
        ctx.fillStyle = `rgba(${rgb}, ${alpha.toFixed(2)})`;

        const drawSize =
          starIdx % 5 === 0 ? spec.canvasSize * 1.15 : spec.canvasSize;
        ctx.fillRect(px, py, drawSize, drawSize);
      }
    };

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;
      elapsedSec += delta;

      ctx.clearRect(0, 0, width, height);

      for (let l = 0; l < STARFIELD_LAYER_SPECS.length; l++) {
        const spec = STARFIELD_LAYER_SPECS[l];
        rotX[l] -= delta * spec.rotSpeedX;
        rotY[l] -= delta * spec.rotSpeedY;
        const twinkle = Math.sin(elapsedSec * spec.twinkleFreq + l * 1.1) * spec.twinkleAmp;
        renderLayer(layerBuffers[l], l, rotX[l], rotY[l], twinkle);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block pointer-events-none"
      style={{ pointerEvents: 'none' }}
    />
  );
};

interface WebGLErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

interface WebGLErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<WebGLErrorBoundaryProps, WebGLErrorBoundaryState> {
  override state: WebGLErrorBoundaryState = { hasError: false };

  constructor(props: WebGLErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(): WebGLErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: unknown) {
    console.warn('WebGL not available or disabled, using 2D canvas fallback:', error);
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = () => {
  const [canUseWebGL, setCanUseWebGL] = useState<boolean>(() => isWebGLAvailable());

  useEffect(() => {
    setCanUseWebGL(isWebGLAvailable());
  }, []);

  return (
    <div
      className="particle-background fixed inset-0 w-full h-full z-0 pointer-events-none select-none overflow-hidden"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      {canUseWebGL ? (
        <WebGLErrorBoundary fallback={<StarBackground2D />}>
          <Canvas
            style={{ pointerEvents: 'none' }}
            camera={{ position: [0, 0, 1] }}
            gl={{
              powerPreference: 'high-performance',
              failIfMajorPerformanceCaveat: false,
            }}
          >
            <Suspense fallback={null}>
              <StarBackground />
            </Suspense>
          </Canvas>
        </WebGLErrorBoundary>
      ) : (
        <StarBackground2D />
      )}
    </div>
  );
};

export default ParticleBackground;
