import { useState, useEffect } from 'react';
import { loadImage } from '../utils';

export interface PreloadAssetsResult {
  loadingDone: boolean;
  progress: number;
}

export function usePreloadAssets(): PreloadAssetsResult {
  const [loadingDone, setLoadingDone] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let mounted = true;

    const assets = [
      '/assets/imgs/home-back.jpg',
      '/assets/imgs/logo-rb-cyber.svg',
      '/assets/imgs/signature.svg',
    ];

    Promise.all(
      assets.map(async (src) => {
        await loadImage(src);
        if (mounted) {
          setProgress((current) => Math.min(100, current + 100 / assets.length));
        }
      })
    ).finally(() => {
      if (!mounted) return;
      setProgress(100);
      setLoadingDone(true);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return { loadingDone, progress };
}
