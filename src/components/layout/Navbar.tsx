import React, { useState, useEffect } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

interface NavbarProps {
  onNavigate: (targetId: string) => void;
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeSection = 'home' }) => {
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const isMobile = useIsMobile(768);

  useEffect(() => {
    if (!isMobile) {
      setMobileMenuActive(false);
    }
  }, [isMobile]);

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
      {/* Brand Logo - Aerodynamic Cyber RB Emblem */}
      <div className="h-8 sm:h-9 w-16 sm:w-20 cursor-pointer pointer-events-auto transition-transform duration-300 hover:scale-105 flex items-center justify-start">
        <button
          onClick={() => handleNavClick('home')}
          className="border-none bg-transparent cursor-pointer p-0 m-0 w-full h-full flex items-center justify-start clickable focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg group"
          aria-label="Scroll to home"
        >
          <img
            src="/assets/imgs/logo-rb-cyber.svg"
            alt="Rocky Babcock RB Logo"
            draggable="false"
            className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
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
              className={`group border-none bg-transparent uppercase font-inherit text-inherit tracking-inherit cursor-pointer clickable transition-all duration-300 relative py-1 px-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded ${
                isHomeActive ? 'text-white font-semibold drop-shadow-[0_0_12px_rgba(216,180,254,0.9)]' : 'text-white/75 hover:text-white'
              }`}
            >
              HOME
              <span
                className={`absolute bottom-0 left-1 right-1 h-[1.5px] rounded-full transition-all duration-300 pointer-events-none ${
                  isHomeActive
                    ? 'bg-purple-200 opacity-100 scale-x-100 shadow-[0_0_12px_2px_rgba(216,180,254,0.95),_0_0_24px_4px_rgba(168,85,247,0.6)]'
                    : 'bg-purple-300/80 opacity-0 scale-x-50 group-hover:opacity-100 group-hover:scale-x-100 shadow-[0_0_10px_1px_rgba(216,180,254,0.85)]'
                }`}
              />
            </button>
          </li>
          <li className="font-mono uppercase text-xs tracking-[0.2em] inline-flex items-center">
            <button
              onClick={() => handleNavClick('work')}
              className={`group border-none bg-transparent uppercase font-inherit text-inherit tracking-inherit cursor-pointer clickable transition-all duration-300 relative py-1 px-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded ${
                isStudioActive ? 'text-white font-semibold drop-shadow-[0_0_12px_rgba(216,180,254,0.9)]' : 'text-white/75 hover:text-white'
              }`}
            >
              STUDIO
              <span
                className={`absolute bottom-0 left-1 right-1 h-[1.5px] rounded-full transition-all duration-300 pointer-events-none ${
                  isStudioActive
                    ? 'bg-purple-200 opacity-100 scale-x-100 shadow-[0_0_12px_2px_rgba(216,180,254,0.95),_0_0_24px_4px_rgba(168,85,247,0.6)]'
                    : 'bg-purple-300/80 opacity-0 scale-x-50 group-hover:opacity-100 group-hover:scale-x-100 shadow-[0_0_10px_1px_rgba(216,180,254,0.85)]'
                }`}
              />
            </button>
          </li>
          <li className="font-mono uppercase text-xs tracking-[0.2em] inline-flex items-center">
            <button
              onClick={() => handleNavClick('skills')}
              className={`group border-none bg-transparent uppercase font-inherit text-inherit tracking-inherit cursor-pointer clickable transition-all duration-300 relative py-1 px-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded ${
                isSkillsActive ? 'text-white font-semibold drop-shadow-[0_0_12px_rgba(216,180,254,0.9)]' : 'text-white/75 hover:text-white'
              }`}
            >
              SKILLS
              <span
                className={`absolute bottom-0 left-1 right-1 h-[1.5px] rounded-full transition-all duration-300 pointer-events-none ${
                  isSkillsActive
                    ? 'bg-purple-200 opacity-100 scale-x-100 shadow-[0_0_12px_2px_rgba(216,180,254,0.95),_0_0_24px_4px_rgba(168,85,247,0.6)]'
                    : 'bg-purple-300/80 opacity-0 scale-x-50 group-hover:opacity-100 group-hover:scale-x-100 shadow-[0_0_10px_1px_rgba(216,180,254,0.85)]'
                }`}
              />
            </button>
          </li>
          <li className="font-mono uppercase text-xs tracking-[0.2em] inline-flex items-center">
            <button
              onClick={() => handleNavClick('contact')}
              className={`group border-none bg-transparent uppercase font-inherit text-inherit tracking-inherit cursor-pointer clickable transition-all duration-300 relative py-1 px-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded ${
                isContactActive ? 'text-white font-semibold drop-shadow-[0_0_12px_rgba(216,180,254,0.9)]' : 'text-white/75 hover:text-white'
              }`}
            >
              CONTACT
              <span
                className={`absolute bottom-0 left-1 right-1 h-[1.5px] rounded-full transition-all duration-300 pointer-events-none ${
                  isContactActive
                    ? 'bg-purple-200 opacity-100 scale-x-100 shadow-[0_0_12px_2px_rgba(216,180,254,0.95),_0_0_24px_4px_rgba(168,85,247,0.6)]'
                    : 'bg-purple-300/80 opacity-0 scale-x-50 group-hover:opacity-100 group-hover:scale-x-100 shadow-[0_0_10px_1px_rgba(216,180,254,0.85)]'
                }`}
              />
            </button>
          </li>
          <li className="font-mono uppercase text-xs tracking-[0.2em] inline-flex items-center">
            <a
              href="https://github.com/rockybuildingaiweb3-boop/rocky-homepage-unfinished"
              target="_blank"
              rel="noreferrer"
              className="text-white/75 uppercase font-inherit text-inherit tracking-inherit no-underline clickable hover:text-white transition-colors py-1 px-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded"
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

      {/* Editorial Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen bg-[#05030d]/98 backdrop-blur-2xl z-[105] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden flex flex-col justify-between px-8 sm:px-12 py-16 ${
          mobileMenuActive ? 'w-screen left-0 pointer-events-auto opacity-100' : 'w-0 pointer-events-none opacity-0'
        }`}
      >
        <div className="w-full flex justify-between items-center border-b border-white/10 pb-6 mt-4">
          <span className="font-mono text-xs tracking-[0.25em] uppercase text-white/50">
            [ navigation &bull; index ]
          </span>
          <span className="font-mono text-xs tracking-[0.25em] uppercase text-purple-300/70">
            2026
          </span>
        </div>

        <ul className="list-none flex flex-col justify-center w-full my-auto space-y-4">
          {[
            { id: 'home', num: '01', label: 'home', active: isHomeActive },
            { id: 'work', num: '02', label: 'studio', active: isStudioActive },
            { id: 'skills', num: '03', label: 'skills', active: isSkillsActive },
            { id: 'contact', num: '04', label: 'contact', active: isContactActive },
          ].map((item) => (
            <li key={item.id} className="border-b border-white/[0.07] pb-3">
              <button
                onClick={() => handleNavClick(item.id)}
                className="w-full flex items-center justify-between bg-transparent border-none cursor-pointer py-2 text-left group"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs tracking-widest text-purple-300/60 font-light">
                    {item.num}
                  </span>
                  <span
                    className={`font-mono text-xl sm:text-2xl uppercase tracking-[0.18em] transition-all duration-300 ${
                      item.active
                        ? 'text-white font-medium pl-1'
                        : 'text-white/60 group-hover:text-white'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                {item.active && (
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-purple-300 px-2 py-0.5 rounded border border-purple-400/30 bg-purple-500/10">
                    current
                  </span>
                )}
              </button>
            </li>
          ))}
          <li className="border-b border-white/[0.07] pb-3">
            <a
              href="https://github.com/rockybuildingaiweb3-boop/rocky-homepage-unfinished"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-between no-underline py-2 group"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs tracking-widest text-purple-300/60 font-light">
                  05
                </span>
                <span className="font-mono text-xl sm:text-2xl uppercase tracking-[0.18em] text-white/60 group-hover:text-white transition-colors">
                  github ↗
                </span>
              </div>
            </a>
          </li>
        </ul>

        {/* Drawer Footer info */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <a
            href="mailto:rockybuilding.aiweb3@gmail.com"
            className="font-mono text-xs tracking-wide text-white/60 hover:text-white no-underline transition-colors"
          >
            rockybuilding.aiweb3@gmail.com
          </a>
          <span className="font-mono text-[11px] tracking-widest text-white/40 uppercase">
            creative technologist
          </span>
        </div>
      </div>

    </nav>
  );
};
