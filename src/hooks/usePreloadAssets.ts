import { useEffect, useState } from 'react';
import { SiteData } from '../types';
import { loadSiteData } from '../data/site/loader';
import { loadImage, devMsg } from '../utils';

export interface PreloadAssetsResult {
  loading: boolean;
  loadingDone: boolean;
  progress: number;
  siteData: SiteData | null;
}

const CRITICAL_ASSETS = [
  '/assets/imgs/loader-flower.jpg',
  '/assets/imgs/home-back.jpg',
  '/assets/imgs/logo-rb-cyber.svg',
  '/assets/imgs/signature.svg',
];

export function usePreloadAssets(): PreloadAssetsResult {
  const [loading, setLoading] = useState(true);
  const [loadingDone, setLoadingDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [siteData, setSiteData] = useState<SiteData | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const data = await loadSiteData();
        if (!mounted) return;
        setSiteData(data);
        setProgress(20);

        let loaded = 0;
        await Promise.all(
          CRITICAL_ASSETS.map(async (src) => {
            try {
              await loadImage(src);
            } catch {
              // A single decorative asset must not block the page.
            }
            if (mounted) {
              loaded += 1;
              setProgress(20 + Math.round((loaded / CRITICAL_ASSETS.length) * 80));
            }
          })
        );

        if (!mounted) return;
        setProgress(100);
        setTimeout(() => {
          if (!mounted) return;
          setLoadingDone(true);
          setTimeout(() => {
            if (!mounted) return;
            setLoading(false);
            devMsg();
          }, 1550);
        }, 250);
      } catch (error) {
        console.error('Failed to load site data:', error);
        if (!mounted) return;
        setProgress(100);
        setLoadingDone(true);
        setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return { loading, loadingDone, progress, siteData };
}
