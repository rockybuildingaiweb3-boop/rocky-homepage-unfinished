import { useState, useEffect } from 'react';
import { SiteData } from '../types';
import { loadSiteData } from '../data/site/loader';
import { loadImage, devMsg } from '../utils';

export interface PreloadAssetsResult {
  loading: boolean;
  loadingDone: boolean;
  progress: number;
  siteData: SiteData | null;
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

    // Master fail-safe timer: guarantees loadingDone within 4000ms regardless of network stalls
    const masterSafetyTimer = setTimeout(() => {
      if (isMounted) {
        setProgress(100);
        setLoadingDone(true);
        setLoading(false);
      }
    }, 4000);

    async function loadPortfolio() {
      try {
        const sData = await loadSiteData();
        if (!isMounted) return;

        setSiteData(sData);
        setProgress(30);

        const criticalImages = [
          '/assets/imgs/loader-flower.png',
          '/assets/imgs/home-back.jpg',
          '/assets/imgs/logo-rb-cyber.svg',
          '/assets/imgs/signature.svg',
        ];

        let loadedCount = 0;
        const total = criticalImages.length;

        await Promise.all(
          criticalImages.map(async (src) => {
            try {
              await loadImage(src, 3000);
            } catch {
              // Decorative assets must never block initialization
            }

            if (isMounted) {
              loadedCount += 1;
              setProgress(30 + Math.round((loadedCount / total) * 70));
            }
          })
        );

        // Verify document fonts readiness
        if (typeof document !== 'undefined' && 'fonts' in document) {
          try {
            await (document as unknown as { fonts: { ready: Promise<unknown> } }).fonts.ready;
          } catch {
            // Non-blocking fallback
          }
        }

        if (!isMounted) return;
        clearTimeout(masterSafetyTimer);
        setProgress(100);

        setTimeout(() => {
          if (!isMounted) return;
          setLoadingDone(true);
          setTimeout(() => {
            if (!isMounted) return;
            setLoading(false);
            devMsg();
          }, 1000);
        }, 200);
      } catch (err) {
        console.error('Failed to load portfolio:', err);
        if (isMounted) {
          clearTimeout(masterSafetyTimer);
          setProgress(100);
          setLoadingDone(true);
          setLoading(false);
        }
      }
    }

    loadPortfolio();

    return () => {
      isMounted = false;
      clearTimeout(masterSafetyTimer);
    };
  }, []);

  return { loading, loadingDone, progress, siteData };
}
