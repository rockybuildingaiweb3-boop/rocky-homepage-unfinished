import React, { useCallback } from 'react';
import { SiteData } from '../types';
import { Navbar, Footer } from '../components/layout';
import { HomeSection } from '../components/sections';
import { useScrollSpy } from '../features/scroll';
import { useRouter } from '../router/RouterContext';

interface HomePageProps {
  siteData: SiteData | null;
}

const SECTION_IDS = ['contact', 'home'];

export const HomePage: React.FC<HomePageProps> = ({ siteData }) => {
  const { navigate } = useRouter();
  const { scrollY, activeSection, setActiveSection } = useScrollSpy({
    sectionIds: SECTION_IDS,
  });

  const handleNavigate = useCallback(
    (targetId: string) => {
      if (targetId === 'studio' || targetId === '/studio') {
        navigate('/studio');
        return;
      }
      if (targetId.startsWith('/')) {
        navigate(targetId);
        return;
      }
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
      <Footer siteData={siteData} onNavigateRoute={navigate} />
    </main>
  );
};

export default HomePage;
