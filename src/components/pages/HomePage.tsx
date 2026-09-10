import React, { useCallback } from 'react';
import { WorkItem, SiteData } from '../../types';
import { Navbar, Footer } from '../layout';
import { HomeSection, WorkSection, SkillsSection } from '../sections';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { useRouter } from '../../router/RouterContext';

interface HomePageProps {
  workData: WorkItem[];
  siteData: SiteData | null;
}

const SECTION_IDS = ['contact', 'skills', 'work', 'home'];

/**
 * HomePage
 * 
 * The cinematic entrance to Rocky Babcock's digital exhibition.
 * Orchestrates:
 * - Fixed brand navbar with active section scrollspy
 * - Hero botanical artwork & interactive cosmic transition
 * - Studio horizontal card slider & WebGL image distortion
 * - 8-row technical instruments constellation & planetary atmosphere
 * - Museum colophon footer with author seal signature
 */
export const HomePage: React.FC<HomePageProps> = ({ workData, siteData }) => {
  const { navigate } = useRouter();
  const { scrollY, activeSection, setActiveSection } = useScrollSpy({
    sectionIds: SECTION_IDS,
  });

  const handleNavigate = useCallback(
    (targetId: string) => {
      // Direct studio route gateway
      if (targetId === 'studio' || targetId === '/studio' || targetId === '/studio/projects') {
        navigate('/studio/projects');
        return;
      }
      if (targetId.startsWith('/')) {
        navigate(targetId);
        return;
      }

      // Smooth in-page section scrolling
      if (targetId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveSection('home');
        return;
      }

      const resolvedId = targetId === 'footer' ? 'contact' : targetId;
      const targetEl = document.getElementById(resolvedId);
      if (targetEl) {
        const headerOffset = window.innerHeight * 0.1;
        const targetY = Math.max(0, targetEl.offsetTop - headerOffset);
        window.scrollTo({ top: targetY, behavior: 'smooth' });
        setActiveSection(resolvedId);
      }
    },
    [navigate, setActiveSection]
  );

  return (
    <main className="w-full min-h-screen relative z-10 overflow-x-hidden">
      <Navbar onNavigate={handleNavigate} activeSection={activeSection} />

      <HomeSection scrollY={scrollY} onNavigate={handleNavigate} />

      <WorkSection workData={workData} />

      <SkillsSection />

      <Footer siteData={siteData} onNavigateRoute={navigate} />
    </main>
  );
};
