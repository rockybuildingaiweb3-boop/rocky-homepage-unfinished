import React from 'react';
import { StudioModuleMeta } from '../types';

interface StudioModulePlaceholderProps {
  meta: StudioModuleMeta;
  onBackToProjects?: () => void;
}

const MODULE_TEASERS: Record<string, Array<{ title: string; subtitle: string; tag: string; date: string }>> = {
  experiments: [
    { title: 'GLSL Spatial Swarm', subtitle: 'GPU compute particle simulation in Three.js & GLSL', tag: 'WebGL / Compute', date: '2026' },
    { title: 'Reactive Audio Nebula', subtitle: 'Spectral FFT frequency displacement on procedural mesh', tag: 'Web Audio / Shaders', date: '2026' },
    { title: 'Fluid Tensor Distortion', subtitle: 'Navier-Stokes grid solver rendered with WebGL fragment shaders', tag: 'Physics Simulation', date: '2026' },
  ],
  blog: [
    { title: 'On Latency, Momentum, and Living UI', subtitle: 'Why physical inertia and spring dynamics make digital tools feel tangible', tag: 'Design Engineering', date: 'Spring 2026' },
    { title: 'Beyond the Flat DOM: 2.5D Layering Contracts', subtitle: 'Managing Three.js canvases, DOM hit-testing, and stacking contexts', tag: 'Architecture', date: 'Winter 2026' },
    { title: 'The Sound of Silence in Digital Spaces', subtitle: 'Subtle ambient acoustics and procedural audio feedback in modern portfolios', tag: 'Creative Tech', date: '2026' },
  ],
  life: [
    { title: 'Pacific Northwest Horizons', subtitle: 'Coastal expeditions and misty alpine atmospheric photography', tag: 'Photography', date: '2025-2026' },
    { title: 'Analogue Tape & Synthesis', subtitle: 'Modular synthesizer recordings and tape-loop field studies', tag: 'Audio Lab', date: '2026' },
    { title: 'Living System Notes', subtitle: 'Observations on botany, generative structures, and natural geometry', tag: 'Field Notes', date: '2026' },
  ],
  archive: [
    { title: 'Portfolio Genesis (v1)', subtitle: 'The original cybernetic canvas architecture and initial experiments', tag: 'Legacy Archive', date: '2023-2024' },
    { title: 'Early Shader Sandbox', subtitle: 'Fragment shader experiments written in raw WebGL 1.0', tag: 'Code Archeology', date: '2022' },
    { title: 'Botanical Vector Studies', subtitle: 'Parametric SVG floral curves and dynamic path interpolation', tag: 'Vector Geometry', date: '2024' },
  ],
};

export const StudioModulePlaceholder: React.FC<StudioModulePlaceholderProps> = ({ meta, onBackToProjects }) => {
  const teasers = MODULE_TEASERS[meta.id] || [];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-12">
      {/* Module Meta Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-8 mb-10 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-xs text-purple-300 tracking-[0.25em] uppercase">
              STUDIO &bull; {meta.code}
            </span>
            <span className="text-[10px] font-mono tracking-widest px-2.5 py-0.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-200">
              {meta.status === 'upcoming' ? 'CURATING & STAGING' : 'ACTIVE'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-normal lowercase tracking-[-0.03em] text-white" style={{ fontFamily: 'var(--title-font)' }}>
            {meta.label}
          </h2>
          <p className="mt-2 text-sm text-white/60 font-mono max-w-xl">
            {meta.description}
          </p>
        </div>

        {onBackToProjects && (
          <button
            onClick={onBackToProjects}
            data-cursor="pointer"
            className="self-start sm:self-auto inline-flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors border border-white/15 hover:border-white/40 bg-white/[0.03] px-4 py-2 rounded-full cursor-pointer"
          >
            <span>&larr; View Projects</span>
          </button>
        )}
      </div>

      {/* Teaser Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teasers.map((item, idx) => (
          <div
            key={idx}
            className="group relative rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/25 transition-all duration-300 p-6 flex flex-col justify-between min-h-[220px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono tracking-widest uppercase text-purple-300/80">
                  {item.tag}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-white/40">
                  {item.date}
                </span>
              </div>
              <h3 className="text-lg font-medium text-white group-hover:text-purple-200 transition-colors">
                {item.title}
              </h3>
              <p className="mt-2 text-xs text-white/50 leading-relaxed">
                {item.subtitle}
              </p>
            </div>

            <div className="pt-6 flex items-center justify-between border-t border-white/5 mt-4">
              <span className="text-[10px] font-mono tracking-widest uppercase text-white/30 group-hover:text-white/60 transition-colors">
                In staging pipeline
              </span>
              <span className="text-xs text-purple-300/60 group-hover:text-purple-300 group-hover:translate-x-1 transition-all">
                &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
