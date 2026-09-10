import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface RouterContextType {
  currentPath: string;
  isStudio: boolean;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextType>({
  currentPath: '/',
  isStudio: false,
  navigate: () => {},
});

export const normalizePath = (rawPath: string): string => {
  const clean = rawPath.split('?')[0].split('#')[0].trim();
  if (!clean || clean === '') return '/';
  if (clean.length > 1 && clean.endsWith('/')) return clean.slice(0, -1);
  return clean;
};

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

    // Smoothly reposition window to top of incoming view
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [currentPath]);

  const isStudio = currentPath === '/studio' || currentPath.startsWith('/studio/');

  return (
    <RouterContext.Provider value={{ currentPath, isStudio, navigate }}>
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
