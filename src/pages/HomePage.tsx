import React from 'react';
import { Navbar, Footer } from '../components/layout';
import { useRouter } from '../router/RouterContext';

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <main className="relative z-10 w-full min-h-screen overflow-x-hidden">
      <Navbar onNavigate={(target) => {
        if (target === 'studio') {
          navigate('/studio');
          return;
        }
        if (target === 'contact') {
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          return;
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

      <section
        id="home"
        className="relative min-h-screen overflow-hidden flex items-center justify-center px-6 py-24"
        aria-label="Rocky Babcock"
      >
        <img
          src="/assets/imgs/home-back.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />

        <div className="absolute inset-0 bg-black/20" aria-hidden="true" />

        <div className="relative z-10 flex w-full max-w-5xl flex-col items-center text-center">
          <img
            src="/assets/imgs/signature.svg"
            alt="Rocky Babcock"
            className="mb-8 h-auto w-[min(58vw,420px)]"
            draggable={false}
          />

          <h1
            className="m-0 text-[clamp(4.5rem,12vw,10rem)] font-normal lowercase leading-[0.82] tracking-[-0.05em] text-white"
            style={{ fontFamily: 'var(--title-font)' }}
          >
            <span className="block">rocky</span>
            <span className="block">babcock</span>
          </h1>

          <p className="mt-8 font-mono text-xs uppercase tracking-[0.24em] text-white/85 sm:text-sm">
            creative technologist &amp; frontend developer
          </p>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed tracking-[0.08em] text-white/80 sm:text-base">
            写有呼吸的代码，造看得见光的界面。
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default HomePage;
