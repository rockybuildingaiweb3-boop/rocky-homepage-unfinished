import React from 'react';
import { useBackgroundMusic } from '../../features/audio';

interface NavbarProps {
  onNavigate?: (targetId: string) => void;
  activeSection?: string;
}

const NAV_ITEMS = [
  { label: 'home', target: 'home' },
  { label: 'studio', target: 'studio' },
  { label: 'skills', target: 'skills' },
  { label: 'contact', target: 'contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeSection = 'home' }) => {
  const { isMuted, toggleMute } = useBackgroundMusic();

  return (
    <header className="fixed inset-x-0 top-0 z-[100] pointer-events-none">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-5 py-5 sm:px-8 sm:py-7">
        <button type="button" onClick={() => onNavigate?.('home')} className="pointer-events-auto block" aria-label="Go home">
          <img src="/assets/imgs/logo-rb-cyber.svg" alt="Rocky Babcock" className="h-8 w-auto sm:h-9" draggable={false} />
        </button>

        <nav aria-label="Primary" className="pointer-events-auto flex items-center gap-5 sm:gap-8">
          {NAV_ITEMS.map((item) => (
            <button key={item.target} type="button" onClick={() => onNavigate?.(item.target)} className={`font-mono text-[10px] uppercase tracking-[0.22em] transition-colors sm:text-xs ${activeSection === item.target ? 'text-white' : 'text-white/55 hover:text-white'}`}>
              {item.target === 'studio' && <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-purple-400" />}
              {item.label}
            </button>
          ))}
          <a href="https://github.com/rockybuildingaiweb3-boop/rocky-homepage-unfinished" target="_blank" rel="noreferrer" className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 hover:text-white sm:text-xs">github</a>
          <button type="button" onClick={toggleMute} className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 hover:text-white sm:text-xs" aria-label={isMuted ? 'Turn audio on' : 'Turn audio off'}>audio {isMuted ? 'off' : 'on'}</button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
