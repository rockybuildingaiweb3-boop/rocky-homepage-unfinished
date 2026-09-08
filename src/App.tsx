import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HomeSection } from './components/HomeSection';
import { WorkSection } from './components/WorkSection';
import { SkillsSection } from './components/SkillsSection';
import { Footer } from './components/Footer';
import { CursorDot } from './components/CursorDot';
import { Loader } from './components/Loader';
import { ParticleBackground } from './components/ParticleBackground';
import { SiteData, WorkItem } from './types';
import { fetchJsonData, loadImage, devMsg } from './utils';

export default function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingDone, setLoadingDone] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(10);
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [workData, setWorkData] = useState<WorkItem[]>([]);
  const [scrollY, setScrollY] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const scrollFrameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Preload and bootstrap
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

        // Preload key images
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
        // Wait 250ms -> setLoadingDone(true) triggers right: 0; width: 0 (800ms wipe) -> 700ms overlay fade
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

  const [activeSection, setActiveSection] = useState<string>('home');

  // Handle scroll events and track active section dynamically
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollPos = target.scrollTop;
    setScrollY(scrollPos);

    const windowH = window.innerHeight;
    const sections = [
      { id: 'footer', el: document.getElementById('footer') },
      { id: 'skills', el: document.getElementById('skills') },
      { id: 'work', el: document.getElementById('work') },
      { id: 'home', el: document.getElementById('home') },
    ];

    for (const sec of sections) {
      if (sec.el) {
        const top = sec.el.offsetTop - windowH * 0.25;
        if (scrollPos >= top) {
          setActiveSection(sec.id);
          break;
        }
      }
    }
  };

  const handleNavigate = (targetId: string) => {
    if (!scrollFrameRef.current) return;
    if (targetId === 'home') {
      scrollFrameRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      setActiveSection('home');
      return;
    }
    const resolvedId =
      targetId === 'studio' ? 'work' : targetId === 'contact' ? 'footer' : targetId;
    const targetEl = document.getElementById(resolvedId);
    if (targetEl) {
      // Smooth momentum scrolling with header offset of offsetTop - 10vh
      const headerOffset10vh = window.innerHeight * 0.1;
      const targetY = Math.max(0, targetEl.offsetTop - headerOffset10vh);
      scrollFrameRef.current.scrollTo({
        top: targetY,
        behavior: 'smooth',
      });
      setActiveSection(resolvedId);
    }
  };

  const handleDestination = (destination: string) => {
    const lower = destination.toLowerCase().trim();
    if (lower === 'about' || lower === 'skills') {
      handleNavigate('skills');
    } else if (lower === 'work' || lower === 'home') {
      handleNavigate(lower);
    } else if (lower === 'contact' || lower === 'footer') {
      handleNavigate('footer');
    }
  };

  return (
    <>
      {/* Interactive custom cursor */}
      <CursorDot isMobile={isMobile} />

      {/* Intro progress bar loader */}
      {loading && <Loader progress={progress} loadingDone={loadingDone} />}

      {/* Main scrolling viewport container */}
      <div
        id="scroll-frame"
        ref={scrollFrameRef}
        onScroll={handleScroll}
        className="w-full h-screen relative z-10 overflow-x-hidden overflow-y-auto"
        style={{ overflowY: loading ? 'hidden' : 'auto' }}
      >
        <Navbar onNavigate={handleNavigate} activeSection={activeSection} />

        {/* Atmospheric 3D Starfield & Spatial Depth Layer (Layer 2 depth across hero & sections) */}
        <ParticleBackground scrollY={scrollY} />

        <HomeSection scrollY={scrollY} onNavigate={handleNavigate} />

        <WorkSection
          workData={workData}
          onSelectDestination={handleDestination}
        />

        <SkillsSection onSelectProject={() => handleNavigate('work')} />

        <Footer siteData={siteData} />
      </div>
    </>
  );
}
