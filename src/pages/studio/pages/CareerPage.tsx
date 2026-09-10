import React from 'react';
import { useRouter } from '../../../router/RouterContext';

/**
 * CareerPage
 * 
 * Independent Career Layout (/studio/career)
 * Decoupled from homepage atmosphere and slider systems.
 */
export const CareerPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono text-xs uppercase tracking-widest">
        Career Dossier
      </div>
      <h1
        className="text-3xl sm:text-5xl font-light text-white tracking-tight lowercase"
        style={{ fontFamily: 'var(--title-font)' }}
      >
        career dossier
      </h1>
      <p className="text-white/60 text-sm sm:text-base leading-relaxed font-light">
        Independent career timeline architecture established. Ready for future dossier implementations.
      </p>
      <div className="pt-4">
        <button
          type="button"
          onClick={() => navigate('/studio')}
          data-cursor="pointer"
          className="px-6 py-2.5 rounded-full bg-white text-black font-mono text-xs tracking-wider uppercase hover:bg-purple-200 transition-colors duration-200 font-medium cursor-pointer"
        >
          Back to Studio Hub
        </button>
      </div>
    </div>
  );
};

export default CareerPage;
