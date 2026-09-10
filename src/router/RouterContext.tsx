import React, { createContext, useContext, useEffect, useState } from 'react';

export type PageFamily = 'exhibition' | 'studio' | 'not-found';

export interface RouteMatch {
  routeId: 'home' | 'studio' | 'not-found';
  family: PageFamily;
  path: string;
  isExact: boolean;
}

export function normalizePath(rawPath: string): string {
  const clean = rawPath.split('?')[0].split('#')[0].trim();
  if (!clean) return '/';
  if (clean.length > 1 && clean.endsWith('/')) return clean.slice(0, -1);
  return clean;
}

export function matchRoute(rawPath: string): RouteMatch {
  const path = normalizePath(rawPath);

  if (path === '/') {
    return { routeId: 'home', family: 'exhibition', path, isExact: true };
  }

  if (path === '/studio') {
    return { routeId: 'studio', family: 'studio', path, isExact: true };
  }

  return { routeId: 'not-found', family: 'not-found', path, isExact: false };
}

interface RouterContextType {
  currentPath: string;
  currentRoute: RouteMatch;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextType>({
  currentPath: '/',
  currentRoute: matchRoute('/'),
  navigate: () => {},
});

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(() =>
    typeof window === 'undefined' ? '/' : normalizePath(window.location.pathname)
  );

  useEffect(() => {
    const onPopState = () => setCurrentPath(normalizePath(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (to: string) => {
    const target = normalizePath(to);
    if (target === currentPath) return;
    window.history.pushState({}, '', target);
    setCurrentPath(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <RouterContext.Provider value={{ currentPath, currentRoute: matchRoute(currentPath), navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => useContext(RouterContext);
