import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random';
import type { Points as PointsType } from 'three';
import { isWebGLAvailable } from '../utils';

export interface ParticleBackgroundProps {
  scrollY?: number;
  className?: string;
}

/**
 * StarBackground - Multi-depth layered celestial particle field
 * Uses 3 distinct particle scales/opacities for subtle, physical depth:
 * - Many tiny low-alpha ambient stars (background depth, 3900 points)
 * - Medium particles with soft luminance (mid-depth, 950 points)
 * - Sparkling micro-stars creating gentle spatial sparkle (150 points)
 * Total: 5000 particles with tuned ethereal transparencies to avoid harsh brightness.
 */
export const StarBackground: React.FC = (props) => {
  const refTiny = useRef<PointsType | null>(null);
  const refMed = useRef<PointsType | null>(null);
  const refBright = useRef<PointsType | null>(null);

  // 1. Layer 1: Many tiny low-alpha stars (3900 points)
  const [sphereTiny] = useState(() =>
    random.inSphere(new Float32Array(3900 * 3), { radius: 1.25 }) as Float32Array
  );

  // 2. Layer 2: Medium particles with soft pastel lilac/white presence (950 points)
  const [sphereMed] = useState(() =>
    random.inSphere(new Float32Array(950 * 3), { radius: 1.15 }) as Float32Array
  );

  // 3. Layer 3: Sparkling micro-stars creating depth (150 points)
  const [sphereBright] = useState(() =>
    random.inSphere(new Float32Array(150 * 3), { radius: 1.05 }) as Float32Array
  );

  useFrame((_state, delta) => {
    // Gentle continuous movement with subtle rotational parallax between layers
    if (refTiny.current) {
      refTiny.current.rotation.x -= delta / 34;
      refTiny.current.rotation.y -= delta / 44;
    }
    if (refMed.current) {
      refMed.current.rotation.x -= delta / 24;
      refMed.current.rotation.y -= delta / 32;
    }
    if (refBright.current) {
      refBright.current.rotation.x -= delta / 18;
      refBright.current.rotation.y -= delta / 24;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      {/* 1. Many tiny low-alpha background stars */}
      <Points ref={refTiny} stride={3} positions={sphereTiny} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#e2e8f0"
          size={0.0014}
          opacity={0.28}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>

      {/* 2. Medium particles with soft gentle glow */}
      <Points ref={refMed} stride={3} positions={sphereMed} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#f8fafc"
          size={0.0026}
          opacity={0.48}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>

      {/* 3. Micro-stars creating delicate depth sparkle without harsh glare */}
      <Points ref={refBright} stride={3} positions={sphereBright} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.0042}
          opacity={0.72}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

/**
 * Fallback 2D Canvas Starfield
 * Replicates the multi-scale depth particle field when WebGL is unavailable.
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

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Multi-scale point clouds matching 5000 points
    const countTiny = 3900;
    const countMed = 950;
    const countBright = 150;

    const posTiny = random.inSphere(new Float32Array(countTiny * 3), { radius: 1.25 }) as Float32Array;
    const posMed = random.inSphere(new Float32Array(countMed * 3), { radius: 1.15 }) as Float32Array;
    const posBright = random.inSphere(new Float32Array(countBright * 3), { radius: 1.05 }) as Float32Array;

    let rotX1 = 0, rotY1 = 0;
    let rotX2 = 0, rotY2 = 0;
    let rotX3 = 0, rotY3 = 0;
    let lastTime = performance.now();
    const SQRT2_2 = Math.SQRT1_2;

    const renderPoints = (
      positions: Float32Array,
      rotX: number,
      rotY: number,
      baseAlpha: number,
      size: number
    ) => {
      const cx = width / 2;
      const cy = height / 2;
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const fovScale = Math.min(width, height) * 0.75;

      for (let i = 0; i < positions.length; i += 3) {
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
        if (dist <= 0.1) continue;

        const factor = fovScale / dist;
        const px = cx + x3 * factor;
        const py = cy - y3 * factor;

        if (px < 0 || px >= width || py < 0 || py >= height) continue;

        const alpha = Math.max(0.06, Math.min(0.85, (baseAlpha * 0.95) / dist));
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(2)})`;
        ctx.fillRect(px, py, size, size);
      }
    };

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      rotX1 -= delta / 34;
      rotY1 -= delta / 44;
      rotX2 -= delta / 24;
      rotY2 -= delta / 32;
      rotX3 -= delta / 18;
      rotY3 -= delta / 24;

      ctx.clearRect(0, 0, width, height);

      // Render 3 depth layers with balanced, soft transparencies
      renderPoints(posTiny, rotX1, rotY1, 0.26, 0.9);
      renderPoints(posMed, rotX2, rotY2, 0.46, 1.4);
      renderPoints(posBright, rotX3, rotY3, 0.70, 2.0);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
};

/**
 * WebGLErrorBoundary
 * Catches any WebGL context creation error or GPU failure and gracefully falls back to 2D
 */
class WebGLErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn('WebGL not available or disabled, using 2D canvas fallback:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  className = 'w-full h-auto fixed inset-0 z-[2] pointer-events-none',
}) => {
  const [canUseWebGL, setCanUseWebGL] = useState<boolean>(() => isWebGLAvailable());

  useEffect(() => {
    setCanUseWebGL(isWebGLAvailable());
  }, []);

  return (
    <div className={className}>
      {canUseWebGL ? (
        <WebGLErrorBoundary fallback={<StarBackground2D />}>
          <Canvas
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

export const StarsCanvas = ParticleBackground;

export default ParticleBackground;
