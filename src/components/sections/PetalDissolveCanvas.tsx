import React, { useRef, useEffect } from 'react';

interface PetalParticle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  size: number;
  color: string;
  glowColor: string;
  angle: number;
  angleSpeed: number;
  speedY: number;
  driftX: number;
  opacity: number;
  aspect: number;
  sparklePhase: number;
}

interface PetalDissolveCanvasProps {
  progress: number; // 0 (daytime garden in rest) -> 1 (full midnight cosmos in studio)
}

const PETAL_PALETTE = [
  { color: 'rgba(225, 29, 72, 0.85)', glow: 'rgba(244, 63, 94, 0.6)' },   // Crimson Rose
  { color: 'rgba(217, 70, 239, 0.82)', glow: 'rgba(232, 121, 249, 0.6)' }, // Magenta Bloom
  { color: 'rgba(168, 85, 247, 0.80)', glow: 'rgba(192, 132, 252, 0.5)' }, // Royal Violet
  { color: 'rgba(244, 63, 94, 0.88)', glow: 'rgba(251, 113, 133, 0.6)' },  // Tulip Pink
  { color: 'rgba(251, 191, 36, 0.85)', glow: 'rgba(254, 240, 138, 0.7)' }, // Golden Pollen
  { color: 'rgba(248, 113, 113, 0.85)', glow: 'rgba(254, 202, 202, 0.6)' },// Coral Red
];

/**
 * PetalDissolveCanvas (花瓣粒子化):
 * As user scrolls from Hero (Day) into Studio (Night):
 * - Watercolor tulip petals lift off from the flower garden
 * - Petals swirl, curl, and disintegrate into luminous starlight sparks
 * - Pure high-performance 2D Canvas with physics & optical dissolution
 */
export const PetalDissolveCanvas: React.FC<PetalDissolveCanvasProps> = ({ progress }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<PetalParticle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const progressRef = useRef<number>(progress);

  progressRef.current = progress;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };
    window.addEventListener('resize', handleResize);

    const initParticles = () => {
      const count = Math.min(50, Math.floor(width / 24));
      const list: PetalParticle[] = [];

      for (let i = 0; i < count; i++) {
        const pChoice = PETAL_PALETTE[i % PETAL_PALETTE.length];
        const originX = Math.random() * width;
        // Start primarily near lower half where the tulips bloom
        const originY = height * (0.6 + Math.random() * 0.4);

        list.push({
          x: originX,
          y: originY,
          originX,
          originY,
          size: 7 + Math.random() * 11,
          color: pChoice.color,
          glowColor: pChoice.glow,
          angle: Math.random() * Math.PI * 2,
          angleSpeed: (Math.random() - 0.5) * 0.04,
          speedY: 1.2 + Math.random() * 2.2,
          driftX: (Math.random() - 0.5) * 1.5,
          opacity: 0.6 + Math.random() * 0.4,
          aspect: 0.45 + Math.random() * 0.35,
          sparklePhase: Math.random() * Math.PI * 2,
        });
      }
      particlesRef.current = list;
    };

    initParticles();

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min(32, now - lastTime) / 16.66;
      lastTime = now;

      const p = progressRef.current;

      ctx.clearRect(0, 0, width, height);

      // Only render when scroll progress has initiated
      if (p > 0.02) {
        const particles = particlesRef.current;
        const liftFactor = Math.pow(p, 1.4); // accelerates upwards as scroll deepens

        for (let i = 0; i < particles.length; i++) {
          const pt = particles[i];
          pt.angle += pt.angleSpeed * dt * (1 + p * 2);
          pt.sparklePhase += 0.08 * dt;

          // Lift distance driven by scroll progress + gentle continuous flutter
          const targetY = pt.originY - liftFactor * (height * 0.95 + pt.speedY * 120);
          pt.y += (targetY - pt.y) * 0.12 * dt;
          pt.x += (Math.sin(now * 0.0015 + i) * 1.8 + pt.driftX * p * 2) * dt;

          // As scroll reaches high darkness, petals dissolve into starry embers
          const isDisintegrating = p > 0.45;
          const dissolveFactor = Math.max(0, (p - 0.45) / 0.55); // 0 -> 1

          ctx.save();
          ctx.translate(pt.x, pt.y);
          ctx.rotate(pt.angle);

          if (!isDisintegrating || dissolveFactor < 0.6) {
            // Draw organic tulip petal curve
            const currentOpacity = pt.opacity * Math.min(1, p * 4) * (1 - dissolveFactor * 0.85);
            ctx.globalAlpha = Math.max(0, currentOpacity);

            ctx.shadowColor = pt.glowColor;
            ctx.shadowBlur = 8;
            ctx.fillStyle = pt.color;

            ctx.beginPath();
            // Elegant bezier teardrop / petal shape
            const rw = pt.size * (1 - dissolveFactor * 0.5);
            const rh = rw * pt.aspect;
            ctx.ellipse(0, 0, rw, rh, 0, 0, Math.PI * 2);
            ctx.fill();

            // Petal central luminous spine
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(-rw * 0.8, 0);
            ctx.lineTo(rw * 0.8, 0);
            ctx.stroke();
          }

          // Luminous stardust spark emerging from dissolving petal
          if (p > 0.3) {
            const sparkAlpha = Math.min(1, (p - 0.3) * 2.5) * (0.4 + 0.6 * Math.sin(pt.sparklePhase));
            ctx.globalAlpha = Math.max(0, sparkAlpha);
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 12;
            ctx.fillStyle = '#ffffff';

            const sparkSize = 1.2 + Math.sin(pt.sparklePhase) * 0.8;
            ctx.beginPath();
            ctx.arc(0, 0, sparkSize, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

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
