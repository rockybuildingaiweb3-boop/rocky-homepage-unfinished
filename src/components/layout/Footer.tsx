import React from 'react';
import { RxGithubLogo, RxDiscordLogo, RxInstagramLogo, RxTwitterLogo, RxLinkedinLogo, RxEnvelopeClosed } from 'react-icons/rx';
import { FaYoutube, FaSpotify, FaTelegramPlane } from 'react-icons/fa';

interface FooterProps {
  siteData?: { availablity_date?: string } | null;
}

const COMMUNITY = [
  { name: 'GitHub', icon: RxGithubLogo, link: 'https://github.com/RockyBabcock' },
  { name: 'Twitter / X', icon: RxTwitterLogo, link: 'https://x.com/RockyBabcock' },
  { name: 'Discord', icon: RxDiscordLogo, link: 'https://discord.com' },
  { name: 'YouTube', icon: FaYoutube, link: 'https://youtube.com' },
];

const SOCIAL = [
  { name: 'LinkedIn', icon: RxLinkedinLogo, link: 'https://linkedin.com' },
  { name: 'Instagram', icon: RxInstagramLogo, link: 'https://instagram.com' },
  { name: 'Spotify Sound', icon: FaSpotify, link: 'https://open.spotify.com' },
  { name: 'Telegram', icon: FaTelegramPlane, link: 'https://t.me' },
];

export const Footer: React.FC<FooterProps> = ({ siteData }) => (
  <footer id="contact" className="relative w-full overflow-hidden border-t border-white/[0.08] bg-gradient-to-b from-[#0b0b0e] via-[#08080a] to-[#040405] text-white">
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 py-16 sm:px-10 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:py-20">
      <div className="lg:col-span-4">
        <img src="/assets/imgs/logo-rb-cyber.svg" alt="Rocky Babcock" className="h-8 w-auto" draggable={false} />
        <p className="mt-4 max-w-sm text-xs leading-relaxed text-white/60 sm:text-[13px]">
          Currently curating autonomous AI and creative engineering systems. Reach out directly for project collaborations or technical discussions.
        </p>
        <a href="mailto:rockybuilding.aiweb3@gmail.com" className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-white/85 hover:text-white">
          <RxEnvelopeClosed className="text-purple-300/80" />
          rockybuilding.aiweb3@gmail.com
          <span className="text-white/40">→</span>
        </a>
        {siteData?.availablity_date && siteData.availablity_date !== 'TBD' && (
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">Available {siteData.availablity_date}</p>
        )}
        <div className="mt-6 border-t border-white/[0.08] pt-4 text-[11px] text-white/40">
          <p className="font-mono uppercase tracking-wider">© {new Date().getFullYear()} Rocky Babcock</p>
          <a href="https://github.com/rockybuildingaiweb3-boop/rocky-homepage-unfinished" target="_blank" rel="noreferrer" className="mt-2 inline-block font-mono underline underline-offset-4 hover:text-white/80">open source on github ↗</a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 lg:col-span-5">
        {[{ title: 'Community', items: COMMUNITY }, { title: 'Social & Audio', items: SOCIAL }].map((column) => (
          <div key={column.title}>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">{column.title}</h3>
            <ul className="mt-3 space-y-2.5">
              {column.items.map(({ name, icon: Icon, link }) => (
                <li key={name}><a href={link} target="_blank" rel="noreferrer" className="inline-flex items-center text-xs text-white/60 hover:text-white sm:text-[13px]"><Icon className="mr-2 shrink-0 text-white/40" />{name}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-start lg:col-span-3 lg:items-end">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">AUTHOR SEAL</span>
        <img src="/assets/imgs/signature.svg" alt="Rocky Babcock handwritten signature" className="mt-4 w-[220px] sm:w-[250px] lg:w-[280px]" draggable={false} />
        <span className="mt-3 font-mono text-[10px] uppercase tracking-widest text-white/40">AUTHENTICATED · 2026</span>
      </div>
    </div>
  </footer>
);

export default Footer;
