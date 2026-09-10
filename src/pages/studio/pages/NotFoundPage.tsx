import React from 'react';
import { useRouter } from '../../../router/RouterContext';

export interface NotFoundPageProps {
  path?: string;
}

/**
 * NotFoundPage
 * 
 * 404 Chamber Destination
 */
export const NotFoundPage: React.FC<NotFoundPageProps> = ({ path }) => {
  const { navigate } = useRouter();

  return (
    <div className="max-w-md mx-auto py-16 text-center space-y-6">
      <h1
        className="text-4xl font-light text-white tracking-tight lowercase"
        style={{ fontFamily: 'var(--title-font)' }}
      >
        chamber not found
      </h1>
      <p className="text-white/50 text-sm font-light">
        The requested destination path ({path}) is not recognized in the studio catalog.
      </p>
      <div className="flex justify-center gap-4 pt-2">
        <button
          type="button"
          onClick={() => navigate('/')}
          data-cursor="pointer"
          className="px-5 py-2 rounded-full bg-white text-black font-mono text-xs uppercase tracking-wider hover:bg-purple-200 transition-colors cursor-pointer"
        >
          Exhibition Home
        </button>
        <button
          type="button"
          onClick={() => navigate('/studio')}
          data-cursor="pointer"
          className="px-5 py-2 rounded-full border border-white/20 font-mono text-xs uppercase tracking-wider hover:border-white transition-colors cursor-pointer"
        >
          Studio Hub
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
