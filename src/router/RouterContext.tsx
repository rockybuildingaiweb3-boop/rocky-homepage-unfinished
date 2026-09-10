import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export type PageFamily = 'exhibition' | 'studio' | 'not-found';

export interface RouteMatch {
  routeId: string;
  family: PageFamily;
  path: string;
  params: Record<string, string>;
  isExact: boolean;
}

interface RouteDefinition {
  id: string;
  family: PageFamily;
  pattern: RegExp;
  paramKeys: string[];
}

/**
 * Authoritative Route Table
 * HOME -> /
 * STUDIO -> /studio
 */
export const ROUTE_DEFINITIONS: RouteDefinition[] = [
  {
    id: 'home',
    family: 'exhibition',
    pattern: /^\/?$/,
    paramKeys: [],
  },
  {
    id: 'studio',
    family: 'studio',
    pattern: /^\/studio(?:\/.*)?$/,
    paramKeys: [],
  },
];

export const normalizePath = (rawPath: string): string => {
  const clean = rawPath.split('?')[0].split('#')[0].trim();
  if (!clean || clean === '') return '/';
  if (clean.length > 1 && clean.endsWith('/')) return clean.slice(0, -1);
  return clean;
};

export function matchRoute(rawPath: string): RouteMatch {
  const normalized = normalizePath(rawPath);
  for (const def of ROUTE_DEFINITIONS) {
    const match = normalized.match(def.pattern);
    if (match) {
      const params: Record<string, string> = {};
      def.paramKeys.forEach((key, index) => {
        params[key] = match[index + 1];
      });
      return {
        routeId: def.id,
        family: def.family,
        path: normalized,
        params,
        isExact: true,
      };
    }
  }
  return {
    routeId: 'not-found',
    family: 'not-found',
    path: normalized,
    params: {},
    isExact: false,
  };
}

interface RouterContextType {
  currentPath: string;
  currentRoute: RouteMatch;
  isStudio: boolean;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextType>({
  currentPath: '/',
  currentRoute: matchRoute('/'),
  isStudio: false,
  navigate: () => {},
});

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return normalizePath(window.location.pathname);
    }
    return '/';
  });

  // Keep state synchronized with browser back/forward buttons
  useEffect(() => {
    const handleLocationChange = () => {
      const normalized = normalizePath(window.location.pathname);
      setCurrentPath(normalized);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigate = useCallback((to: string) => {
    const target = normalizePath(to);
    if (target === currentPath) return;

    window.history.pushState({}, '', target);
    setCurrentPath(target);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [currentPath]);

  const currentRoute = useMemo(() => matchRoute(currentPath), [currentPath]);
  const isStudio = currentRoute.family === 'studio';

  return (
    <RouterContext.Provider value={{ currentPath, currentRoute, isStudio, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = (): RouterContextType => useContext(RouterContext);

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: React.ReactNode;
}

export const Link: React.FC<LinkProps> = ({ to, children, onClick, ...props }) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (
      !e.defaultPrevented &&
      e.button === 0 &&
      !e.metaKey &&
      !e.ctrlKey &&
      !e.shiftKey &&
      !e.altKey &&
      !props.target
    ) {
      e.preventDefault();
      navigate(to);
    }
  };

  return (
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  );
};
