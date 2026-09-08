import { useState, useEffect } from 'react';
import { SiteData, WorkItem } from '../types';
import { fetchJsonData, loadImage, devMsg } from '../utils';

export interface PreloadAssetsResult {
  loading: boolean;
  loadingDone: boolean;
  progress: number;
  siteData: SiteData | null;
  workData: WorkItem[];
}

/**
 * Hook to manage portfolio data fetching, asset preloading, and smooth loader dismiss transitions
 */
export function usePreloadAssets(): PreloadAssetsResult {
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingDone, setLoadingDone] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(10);
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [workData, setWorkData] = useState<WorkItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadPortfolio() {
      try {
        const [wData, sData] = await Promise.all([
          fetchJsonData<WorkItem[]>('/data/work-data.json').catch(() => []),
          fetchJsonData<SiteData>('/data/data.json').catch(() => ({ availablity_date: '' })),
        ]);

        if (!isMounted) return;
        setWorkData(wData);
        setSiteData(sData);
        setProgress(30);

        // Preload key images essential for initial presentation
        const criticalImages = [
          '/assets/imgs/home-back.jpg',
          '/assets/imgs/profile-photo.jpg',
          '/assets/imgs/logo.svg',
          ...wData.map((item) => `/assets/imgs/work-back/${item.id}/cover.jpg`),
        ];

        let loadedCount = 0;
        const total = criticalImages.length;

        await Promise.all(
          criticalImages.map(async (src) => {
            try {
              await loadImage(src);
            } catch {
              // Ignore single image failure to avoid blocking app
            }
            if (isMounted) {
              loadedCount++;
              const calculated = 30 + Math.round((loadedCount / total) * 70);
              setProgress(calculated);
            }
          })
        );

        if (!isMounted) return;
        setProgress(100);

        // Finish loader transition:
        // Wait 250ms -> setLoadingDone(true) triggers right: 0; width: 0 wipe -> overlay fade
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

  return { loading, loadingDone, progress, siteData, workData };
}
