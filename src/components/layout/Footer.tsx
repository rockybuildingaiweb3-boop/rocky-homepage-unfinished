import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer
      id="contact"
      className="relative z-10 border-t border-white/10 px-6 py-12 sm:px-10 sm:py-16"
      aria-label="Contact"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">contact</p>
          <h2
            className="mt-3 text-3xl lowercase tracking-[-0.035em] text-white sm:text-4xl"
            style={{ fontFamily: 'var(--title-font)' }}
          >
            let&apos;s make something real.
          </h2>
        </div>

        <a
          href="https://github.com/rockybuildingaiweb3-boop/rocky-homepage-unfinished"
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white sm:text-xs"
        >
          github
        </a>
      </div>

      <div className="mx-auto mt-12 flex w-full max-w-7xl items-center justify-between border-t border-white/10 pt-5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
        <span>rocky babcock</span>
        <span>© 2026</span>
      </div>
    </footer>
  );
};

export default Footer;
