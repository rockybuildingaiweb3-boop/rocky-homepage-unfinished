import React, { useState, useEffect } from 'react';

interface NavbarProps {
  onNavigate: (targetId: string) => void;
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeSection = 'home' }) => {
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 950);
      if (window.innerWidth > 950) {
        setMobileMenuActive(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (targetId: string) => {
    setMobileMenuActive(false);
    onNavigate(targetId);
  };

  const isHomeActive = activeSection === 'home';
  const isStudioActive = activeSection === 'work' || activeSection === 'studio';
  const isSkillsActive = activeSection === 'skills';
  const isContactActive = activeSection === 'footer' || activeSection === 'contact';

  return (
    <nav className="fixed top-4 sm:top-6 left-0 w-full z-[100] px-6 sm:px-10 md:px-14 flex flex-row justify-between items-center box-border pointer-events-none transition-all duration-300">
      {/* Brand Logo */}
      <div className="overflow-hidden h-8 sm:h-9 w-10 sm:w-12 mix-blend-exclusion cursor-pointer pointer-events-auto">
        <button
          onClick={() => handleNavClick('home')}
          className="border-none bg-transparent cursor-pointer p-0 m-0 w-full h-full flex items-center justify-center clickable"
          aria-label="Scroll to home"
        >
          <img
            src="/assets/imgs/logo.svg"
            alt="Logo"
            draggable="false"
            className="h-full w-full object-contain"
          />
        </button>
      </div>

      {/* Desktop & Mobile Menu */}
      <div className="flex items-center pointer-events-auto">
        {/* Desktop Menu - Refined typography matching rockybabcock.com */}
        <ul className="hidden md:flex list-none mix-blend-exclusion overflow-hidden m-0 p-0 items-center gap-6 lg:gap-8">
          <li className="font-mono uppercase text-xs tracking-[0.2em] inline-flex items-center">
            <button
              onClick={() => handleNavClick('home')}
              className={`border-none bg-transparent uppercase font-inherit text-inherit tracking-inherit cursor-pointer clickable transition-all duration-300 relative py-1 px-1 ${
                isHomeActive ? 'text-white font-semibold drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]' : 'text-white/80 hover:text-white'
              }`}
            >
              HOME
              {isHomeActive && (
                <span className="absolute bottom-0 left-1 right-1 h-[1.5px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.95)] animate-pulse" />
              )}
            </button>
          </li>
          <li className="font-mono uppercase text-xs tracking-[0.2em] inline-flex items-center">
            <button
              onClick={() => handleNavClick('work')}
              className={`border-none bg-transparent uppercase font-inherit text-inherit tracking-inherit cursor-pointer clickable transition-all duration-300 relative py-1 px-1 ${
                isStudioActive ? 'text-white font-semibold drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]' : 'text-white/80 hover:text-white'
              }`}
            >
              STUDIO
              {isStudioActive && (
                <span className="absolute bottom-0 left-1 right-1 h-[1.5px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.95)] animate-pulse" />
              )}
            </button>
          </li>
          <li className="font-mono uppercase text-xs tracking-[0.2em] inline-flex items-center">
            <button
              onClick={() => handleNavClick('skills')}
              className={`border-none bg-transparent uppercase font-inherit text-inherit tracking-inherit cursor-pointer clickable transition-all duration-300 relative py-1 px-1 ${
                isSkillsActive ? 'text-white font-semibold drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]' : 'text-white/80 hover:text-white'
              }`}
            >
              SKILLS
              {isSkillsActive && (
                <span className="absolute bottom-0 left-1 right-1 h-[1.5px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.95)] animate-pulse" />
              )}
            </button>
          </li>
          <li className="font-mono uppercase text-xs tracking-[0.2em] inline-flex items-center">
            <a
              href="mailto:holmepavolini@gmail.com"
              className={`uppercase font-inherit text-inherit tracking-inherit no-underline clickable transition-all duration-300 relative py-1 px-1 ${
                isContactActive ? 'text-white font-semibold drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]' : 'text-white/80 hover:text-white'
              }`}
            >
              CONTACT
              {isContactActive && (
                <span className="absolute bottom-0 left-1 right-1 h-[1.5px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.95)] animate-pulse" />
              )}
            </a>
          </li>
          <li className="font-mono uppercase text-xs tracking-[0.2em] inline-flex items-center">
            <a
              href="https://github.com/RockyBabcock/Rockyshomepage"
              target="_blank"
              rel="noreferrer"
              className="text-white/80 uppercase font-inherit text-inherit tracking-inherit no-underline clickable hover:text-white transition-colors py-1 px-1"
            >
              GITHUB
            </a>
          </li>
        </ul>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuActive(!mobileMenuActive)}
            className="border-none bg-transparent cursor-pointer p-2 z-[110] relative clickable"
            aria-label="Toggle Navigation Menu"
          >
            <div className="flex flex-col justify-center w-[3vh] h-[2.2vh] gap-[5px] transition-all duration-300">
              <span
                className={`block h-[2px] bg-white transition-all duration-300 ${
                  mobileMenuActive ? 'translate-y-[7px] rotate-[-45deg] w-full' : 'w-full'
                }`}
              />
              <span
                className={`block h-[2px] bg-white transition-all duration-300 ${
                  mobileMenuActive ? 'opacity-0 w-0' : 'w-full'
                }`}
              />
              <span
                className={`block h-[2px] bg-white transition-all duration-300 ${
                  mobileMenuActive ? '-translate-y-[7px] rotate-[45deg] w-full' : 'w-full'
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen bg-[#131314] z-[105] transition-all duration-700 ease-[cubic-bezier(0.58,0.14,0.06,0.97)] overflow-hidden flex flex-col justify-center px-[10vw] pt-[10vh] ${
          mobileMenuActive ? 'w-screen left-0 pointer-events-auto' : 'w-0 pointer-events-none'
        }`}
      >
        <ul className="list-none flex flex-col justify-center w-full m-0 p-0">
          <li className="font-[family-name:var(--body-font)] font-bold lowercase text-[9vw] py-[2vh] border-b border-white/20">
            <button
              onClick={() => handleNavClick('home')}
              className={`border-none bg-transparent font-inherit text-inherit cursor-pointer text-left w-full clickable transition-all ${
                isHomeActive ? 'text-white font-extrabold pl-2 border-l-2 border-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] animate-pulse' : 'text-white/60'
              }`}
            >
              home
            </button>
          </li>
          <li className="font-[family-name:var(--body-font)] font-bold lowercase text-[9vw] py-[2vh] border-b border-white/20">
            <button
              onClick={() => handleNavClick('work')}
              className={`border-none bg-transparent font-inherit text-inherit cursor-pointer text-left w-full clickable transition-all ${
                isStudioActive ? 'text-white font-extrabold pl-2 border-l-2 border-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] animate-pulse' : 'text-white/60'
              }`}
            >
              studio
            </button>
          </li>
          <li className="font-[family-name:var(--body-font)] font-bold lowercase text-[9vw] py-[2vh] border-b border-white/20">
            <button
              onClick={() => handleNavClick('skills')}
              className={`border-none bg-transparent font-inherit text-inherit cursor-pointer text-left w-full clickable transition-all ${
                isSkillsActive ? 'text-white font-extrabold pl-2 border-l-2 border-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] animate-pulse' : 'text-white/60'
              }`}
            >
              skills
            </button>
          </li>
          <li className="font-[family-name:var(--body-font)] font-bold lowercase text-[9vw] py-[2vh] border-b border-white/20">
            <a
              href="mailto:holmepavolini@gmail.com"
              className={`no-underline font-inherit text-inherit block w-full clickable transition-all ${
                isContactActive ? 'text-white font-extrabold pl-2 border-l-2 border-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] animate-pulse' : 'text-white/60'
              }`}
            >
              contact
            </a>
          </li>
          <li className="font-[family-name:var(--body-font)] font-bold lowercase text-[9vw] py-[2vh]">
            <a
              href="https://github.com/RockyBabcock/Rockyshomepage"
              target="_blank"
              rel="noreferrer"
              className="text-white/60 no-underline font-inherit text-inherit block w-full clickable hover:text-white transition-colors"
            >
              git
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};
