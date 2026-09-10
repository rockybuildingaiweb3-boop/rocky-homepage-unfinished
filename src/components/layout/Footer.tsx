import React from 'react';
import { SiteData } from '../../types';

interface FooterProps {
  siteData: SiteData | null;
  onNavigateRoute?: (to: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ siteData, onNavigateRoute }) => {
  return (
    <footer
      id="contact"
      className="relative z-10 border-t border-white/10 px-6 py-12 sm:px-10 sm:py-16"
      aria-label="Contact"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">contact</p>
          <h2
            className="mt-3 text-3xl lowercase tracking-[-0.035em] text-white sm:text-4xl"
            style={{ fontFamily: 'var(--title-font)' }}
          >
            let&apos;s make something real.
          </h2>
          {siteData?.availablity_date && siteData.availablity_date !== 'TBD' && (
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">
              available {siteData.availablity_date}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[10px] uppercase tracking-[0.2em] sm:text-xs">
          <button
            type="button"
            onClick={() => onNavigateRoute?.('/studio')}
            className="text-white/60 transition-colors hover:text-white"
          >
            studio
          </button>
          <a
            href="https://github.com/rockybuildingaiweb3-boop/rocky-homepage-unfinished"
            target="_blank"
            rel="noreferrer"
            className="text-white/60 transition-colors hover:text-white"
          >
            github
          </a>
        </div>
      </div>

      <div className="mx-auto mt-12 flex w-full max-w-7xl items-center justify-between border-t border-white/10 pt-5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
        <span>rocky babcock</span>
        <span>© 2026</span>
      </div>
    </footer>
  );
};

export default Footer;
