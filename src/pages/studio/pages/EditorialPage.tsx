import React from 'react';
import { useRouter } from '../../../router/RouterContext';

export interface EditorialPageProps {
  slug?: string;
}

/**
 * EditorialPage
 * 
 * Independent Editorial Layout (/studio/blog & /studio/blog/:slug)
 * Decoupled from homepage 3D WebGL and slider physics.
 */
export const EditorialPage: React.FC<EditorialPageProps> = ({ slug }) => {
  const { navigate } = useRouter();

  return (
    <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono text-xs uppercase tracking-widest">
        Editorial Architecture
      </div>
      <h1
        className="text-3xl sm:text-5xl font-light text-white tracking-tight lowercase"
        style={{ fontFamily: 'var(--title-font)' }}
      >
        editorial chamber
      </h1>
      <p className="text-white/60 text-sm sm:text-base leading-relaxed font-light">
        {slug
          ? `Article destination: ${slug}. Independent reading layout architecture established.`
          : 'Independent editorial collection layout architecture established. Ready for future article implementations.'}
      </p>
      <div className="pt-4">
        <button
          type="button"
          onClick={() => navigate('/studio')}
          data-cursor="pointer"
          className="px-6 py-2.5 rounded-full bg-white text-black font-mono text-xs tracking-wider uppercase hover:bg-cyan-200 transition-colors duration-200 font-medium cursor-pointer"
        >
          Back to Studio Hub
        </button>
      </div>
    </div>
  );
};

export default EditorialPage;
