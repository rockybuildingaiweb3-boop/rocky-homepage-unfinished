import React, { useEffect, useRef } from 'react';

interface HomeSectionProps {
  onNavigate?: (targetId: string) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({ onNavigate }) => {
  const word1Ref = useRef<HTMLSpanElement>(null);
  const word2Ref = useRef<HTMLSpanElement>(null);
  const signatureRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = [word1Ref.current, word2Ref.current, signatureRef.current].filter(Boolean) as HTMLElement[];
    if (reduced) return;

    elements.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = index < 2 ? 'translate3d(0, 90%, 0)' : 'translate3d(0, 16px, 0) scale(.96) rotate(-4deg)';
      element.style.transition = index < 2
        ? 'transform 1.2s cubic-bezier(.165,.84,.44,1), opacity .9s ease'
        : 'transform 1.2s cubic-bezier(.165,.84,.44,1) .3s, opacity 1s ease .3s';
    });

    const t1 = window.setTimeout(() => {
      if (word1Ref.current) { word1Ref.current.style.opacity = '1'; word1Ref.current.style.transform = 'translate3d(0,0,0)'; }
    }, 120);
    const t2 = window.setTimeout(() => {
      if (word2Ref.current) { word2Ref.current.style.opacity = '1'; word2Ref.current.style.transform = 'translate3d(0,0,0)'; }
    }, 260);
    const t3 = window.setTimeout(() => {
      if (signatureRef.current) { signatureRef.current.style.opacity = '1'; signatureRef.current.style.transform = 'translate3d(0,0,0) scale(1) rotate(-3deg)'; }
    }, 420);
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); window.clearTimeout(t3); };
  }, []);

  return (
    <section id="home" className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#ebe8e1]" aria-label="Hero section — Rocky Babcock">
      <div className="absolute inset-0" aria-hidden="true">
        <img src="/assets/imgs/home-back.jpg" alt="" className="h-full w-full object-cover" draggable={false} />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      <div className="relative z-10 flex w-full flex-col items-center justify-center px-4 text-center pt-10 sm:px-8 sm:pt-14">
        <div className="relative flex flex-col items-center">
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 sm:-top-16 md:-top-20">
            <img ref={signatureRef} src="/assets/imgs/signature.svg" alt="Rocky Babcock handwritten signature" className="w-[52vw] min-w-[190px] max-w-[420px]" draggable={false} />
          </div>

          <h1 className="m-0 flex flex-col items-center font-normal lowercase tracking-[-0.035em] text-white" style={{ fontFamily: 'var(--title-font)' }}>
            <div className="overflow-hidden pb-1"><span ref={word1Ref} className="inline-block text-[clamp(4.2rem,11vw,9.4rem)] leading-[.86]">rocky</span></div>
            <div className="overflow-hidden pb-1"><span ref={word2Ref} className="inline-block text-[clamp(4.2rem,11vw,9.4rem)] leading-[.86]">babcock</span></div>
          </h1>

          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.24em] text-white/90 sm:text-xs md:text-[13px]">creative technologist &amp; frontend developer</p>
          <p className="mt-3 max-w-xl px-4 text-xs font-normal tracking-[0.18em] text-white/95 sm:text-sm">写有呼吸的代码，造看得见光的界面。</p>
          <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">code with breath • interfaces that see light</p>

          <button type="button" onClick={() => onNavigate?.('skills')} className="mt-8 rounded-full border border-white/25 bg-black/30 px-6 py-2.5 font-mono text-xs uppercase tracking-[0.22em] text-white/90 backdrop-blur-md transition-colors hover:border-white/60 hover:bg-white/10">
            scroll to explore
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-[#030014]/50" aria-hidden="true" />
    </section>
  );
};

export default HomeSection;
