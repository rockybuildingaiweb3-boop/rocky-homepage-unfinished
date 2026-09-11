import { useState, useEffect } from 'react';
import { SiteData, WorkItem } from '../types';
import { loadSiteData } from '../data/site/loader';
import { loadImage, devMsg } from '../utils';

export interface PreloadAssetsResult {
  loading: boolean;
  loadingDone: boolean;
  progress: number;
  siteData: SiteData | null;
  workData: WorkItem[];
}

/**
 * Preload only assets required by the current homepage shell.
 * Work-specific data and cover assets are intentionally no longer loaded here.
 */
export function usePreloadAssets(): PreloadAssetsResult {
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingDone, setLoadingDone] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(10);
  const [siteData, setSiteData] = useState<SiteData | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPortfolio() {
      try {
        const sData = await loadSiteData();
        if (!isMounted) return;

        setSiteData(sData);
        setProgress(30);

        const criticalImages = [
          '/assets/imgs/loader-flower.jpg',
          '/assets/imgs/home-back.jpg',
          '/assets/imgs/logo-rb-cyber.svg',
          '/assets/imgs/signature.svg',
        ];

        let loadedCount = 0;
        const total = criticalImages.length;

        await Promise.all(
          criticalImages.map(async (src) => {
            try {
              await loadImage(src);
            } catch {
              // A single decorative asset should not block the page ceremony.
            }

            if (isMounted) {
              loadedCount += 1;
              setProgress(30 + Math.round((loadedCount / total) * 70));
            }
          })
        );

        if (!isMounted) return;
        setProgress(100);

        setTimeout(() => {
          if (!isMounted) return;
          setLoadingDone(true);
          setTimeout(() => {
            if (!isMounted) return;
            setLoading(false);
            devMsg();
          }, 1550);
        }, 250);
      } catch (err) {
        console.error('Failed to load portfolio:', err);
        if (isMounted) {
          setProgress(100);
          setLoadingDone(true);
          setLoading(false);
        }
      }
    }

    loadPortfolio();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    loading,
    loadingDone,
    progress,
    siteData,
    workData: [],
  };
}
