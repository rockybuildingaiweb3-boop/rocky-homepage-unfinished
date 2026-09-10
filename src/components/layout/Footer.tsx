import React, { useEffect, useRef, useState } from 'react';
import {
  RxGithubLogo,
  RxDiscordLogo,
  RxInstagramLogo,
  RxTwitterLogo,
  RxLinkedinLogo,
  RxEnvelopeClosed,
  RxReader,
  RxBackpack,
  RxLayers,
} from 'react-icons/rx';
import { FaYoutube, FaSpotify, FaTelegramPlane } from 'react-icons/fa';
import { onScrolledIntoView } from '../../utils';
import { SiteData } from '../../types';

interface FooterProps {
  siteData?: SiteData | null;
  onNavigateRoute?: (path: string) => void;
}

// Structured link matrix with direct same-site Studio routes and external socials
export const FOOTER_DATA = [
  {
    title: 'Community',
    data: [
      {
        name: 'GitHub',
        icon: RxGithubLogo,
        link: 'https://github.com/RockyBabcock',
      },
      {
        name: 'Twitter / X',
        icon: RxTwitterLogo,
        link: 'https://x.com/RockyBabcock',
      },
      {
        name: 'Discord',
        icon: RxDiscordLogo,
        link: 'https://discord.com',
      },
      {
        name: 'YouTube',
        icon: FaYoutube,
        link: 'https://youtube.com',
      },
    ],
  },
  {
    title: 'Social & Audio',
    data: [
      {
        name: 'LinkedIn',
        icon: RxLinkedinLogo,
        link: 'https://linkedin.com',
      },
      {
        name: 'Instagram',
        icon: RxInstagramLogo,
        link: 'https://instagram.com',
      },
      {
        name: 'Spotify Sound',
        icon: FaSpotify,
        link: 'https://open.spotify.com',
      },
      {
        name: 'Telegram',
        icon: FaTelegramPlane,
        link: 'https://t.me',
      },
    ],
  },
  {
    title: 'Studio Index',
    data: [
      {
        name: 'Projects (06)',
        icon: RxLayers,
        link: '/studio/projects',
        isInternal: true,
      },
      {
        name: 'Essays & Blog',
        icon: RxReader,
        link: '/studio/blog',
        isInternal: true,
      },
      {
        name: 'Career Dossier',
        icon: RxBackpack,
        link: '/studio/career',
        isInternal: true,
      },
      {
        name: 'Direct Contact',
        icon: RxEnvelopeClosed,
        link: 'mailto:rockybuilding.aiweb3@gmail.com',
      },
    ],
  },
];

export const Footer: React.FC<FooterProps> = ({ siteData, onNavigateRoute }) => {
  const footerContainerElement = useRef<HTMLDivElement>(null);
  const signaturePath1 = useRef<SVGPathElement>(null);
  const signaturePath2 = useRef<SVGPathElement>(null);
  const signaturePath3 = useRef<SVGPathElement>(null);
  const signaturePath4 = useRef<SVGPathElement>(null);

  const currentYear = new Date().getFullYear();
  const [signatureDrawn, setSignatureDrawn] = useState(false);

  // Natural handwriting stroke animation using physiological pen timing
  useEffect(() => {
    if (!footerContainerElement.current) return;

    const cleanup = onScrolledIntoView(
      footerContainerElement.current,
      () => {
        const strokeAnimation = [{ strokeDashoffset: '0' }];
        const smoothEase = 'cubic-bezier(0.4, 0, 0.2, 1)';

        // 1. Initial Capital 'R' ascender & loop
        signaturePath1.current?.animate(strokeAnimation, {
          duration: 850,
          delay: 0,
          easing: smoothEase,
          fill: 'forwards',
        });

        // 2. 'ocky' natural flow
        signaturePath2.current?.animate(strokeAnimation, {
          duration: 700,
          delay: 780,
          easing: smoothEase,
          fill: 'forwards',
        });

        // 3. 'y' lower loop & bridge into 'B'
        signaturePath3.current?.animate(strokeAnimation, {
          duration: 400,
          delay: 1420,
          easing: smoothEase,
          fill: 'forwards',
        });

        // 4. 'Babcock' flourish & finishing line
        signaturePath4.current?.animate(strokeAnimation, {
          duration: 1150,
          delay: 1780,
          easing: smoothEase,
          fill: 'forwards',
        });

        // Settle into soft post-draw starlight presence
        const timer = setTimeout(() => {
          setSignatureDrawn(true);
        }, 2950);

        return () => clearTimeout(timer);
      },
      0.15
    );

    return cleanup;
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string, isInternal?: boolean) => {
    if (isInternal && onNavigateRoute) {
      e.preventDefault();
      onNavigateRoute(link);
    }
  };

  return (
    <footer
      id="contact"
      className="footer-wrapper relative overflow-hidden w-full border-t border-white/[0.08] bg-gradient-to-b from-[#0b0b0e] via-[#08080a] to-[#040405] text-white select-none z-10"
      ref={footerContainerElement}
      aria-label="Footer & Contact"
    >
      {/* Top subtle ethereal cosmic accent separator */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/25 to-transparent pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-20 lg:py-24">
        {/* Main 3-Column Exhibition Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Zone 1: Left Brand Column (Logo, Availability, Email, Copyright) - 4 Cols */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Crisp Official Logo */}
              <a
                href="#home"
                onClick={(e) => {
                  if (onNavigateRoute) {
                    e.preventDefault();
                    onNavigateRoute('/');
                  }
                }}
                className="inline-flex items-center group cursor-pointer"
                aria-label="Rocky Babcock Portfolio Home"
              >
                <img
                  src="/assets/imgs/logo-rb-cyber.svg"
                  alt="Rocky Babcock Logo"
                  className="logo w-auto h-7 sm:h-8 object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </a>

              {/* Editorial Availability Note */}
              <div className="text-xs sm:text-[13px] text-white/60 font-light leading-relaxed max-w-sm">
                {siteData?.availablity_date === 'TBD' ? (
                  <p className="m-0">
                    Currently curating autonomous AI and creative engineering systems. Reach out directly for project collaborations or technical discussions.
                  </p>
                ) : (
                  <p className="m-0">
                    Available for select architectural and full-stack creative engineering commissions for 2026.
                  </p>
                )}
              </div>

              {/* Direct Touch Email */}
              <div className="pt-1">
                <a
                  className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm tracking-tight text-white/90 hover:text-cyan-300 transition-colors duration-200 py-1"
                  href="mailto:rockybuilding.aiweb3@gmail.com"
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="pointer"
                >
                  <RxEnvelopeClosed className="text-purple-300/80 text-sm shrink-0" />
                  <span>rockybuilding.aiweb3@gmail.com</span>
                  <span className="text-xs text-white/40 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </a>
              </div>
            </div>

            {/* Copyright & Open Source Colophon */}
            <div className="pt-4 border-t border-white/[0.08] space-y-1">
              <p className="font-mono text-[11px] text-white/45 tracking-wider uppercase">
                &copy; {currentYear} Rocky Babcock
              </p>
              <p className="text-[11px] text-white/40 leading-relaxed font-light">
                Designed &amp; engineered as a living digital museum.
                <br />
                <a
                  className="text-white/45 hover:text-white/85 underline underline-offset-4 transition-colors font-mono"
                  href="https://github.com/rockybuildingaiweb3-boop/rocky-homepage-unfinished"
                  target="_blank"
                  rel="noreferrer"
                >
                  open source on github &nearr;
                </a>
              </p>
            </div>
          </div>

          {/* Zone 2: Center Navigation Matrix - 5 Cols */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-6">
            {FOOTER_DATA.map((column) => (
              <div key={column.title} className="flex flex-col space-y-3">
                <h3 className="font-mono uppercase text-[10px] sm:text-[11px] font-semibold tracking-[0.24em] text-white/40 select-none">
                  {column.title}
                </h3>
                <ul className="list-none p-0 m-0 space-y-2.5">
                  {column.data.map(({ icon: Icon, name, link, isInternal }) => (
                    <li key={name}>
                      <a
                        href={link}
                        onClick={(e) => handleLinkClick(e, link, isInternal)}
                        target={link.startsWith('http') ? '_blank' : undefined}
                        rel={link.startsWith('http') ? 'noreferrer noopener' : undefined}
                        data-cursor="pointer"
                        className="inline-flex items-center text-white/60 hover:text-white transition-all duration-200 text-xs sm:text-[13px] group py-0.5"
                      >
                        {Icon && (
                          <span className="text-xs text-white/40 group-hover:text-purple-300 transition-colors mr-2 shrink-0">
                            <Icon />
                          </span>
                        )}
                        <span className="group-hover:translate-x-0.5 transition-transform duration-200 whitespace-nowrap">
                          {name}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Zone 3: Far Right Animated Handwritten Signature - 3 Cols */}
          <div className="lg:col-span-3 flex flex-col items-start lg:items-end justify-between pt-6 lg:pt-0">
            <div className="w-full flex flex-col items-start lg:items-end space-y-3">
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/35 select-none">
                AUTHOR SEAL
              </span>

              {/* Natural Handwritten SVG Signature */}
              <div className="relative group cursor-pointer w-[200px] sm:w-[240px] lg:w-[280px]">
                <svg
                  id="signature"
                  className="w-full h-auto transition-all duration-700 hover:scale-[1.02]"
                  viewBox="0 0 1020 320"
                  style={{
                    filter: signatureDrawn
                      ? 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.35)) drop-shadow(0 0 16px rgba(168, 85, 247, 0.22))'
                      : 'none',
                    transition: 'filter 1.2s ease-out',
                  }}
                  aria-label="Rocky Babcock handwritten signature"
                >
                  <defs>
                    <linearGradient id="footer-signature-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="50%" stopColor="#f3e8ff" />
                      <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>
                  </defs>

                  <g stroke="url(#footer-signature-grad)">
                    {/* Stroke 1: Capital 'R' ascender & initial loop */}
                    <path
                      ref={signaturePath1}
                      className="path-1"
                      style={{
                        fill: 'none',
                        strokeWidth: 3.2,
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round',
                        strokeOpacity: 0.95,
                      }}
                      d="M 60 180 C 70 130, 110 65, 155 60 C 185 56, 210 78, 200 115 C 190 150, 150 180, 125 185 C 110 188, 100 175, 105 150 L 135 65"
                    />
                    {/* Stroke 2: 'ocky' sequence */}
                    <path
                      ref={signaturePath2}
                      className="path-2"
                      style={{
                        fill: 'none',
                        strokeWidth: 2.6,
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round',
                        strokeOpacity: 0.95,
                      }}
                      d="M 147 132 C 167 135, 190 155, 200 185 C 205 198, 218 200, 230 185 C 242 165, 270 160, 280 180 C 286 195, 274 205, 260 205 C 246 205, 240 195, 248 182 C 258 170, 275 175, 292 185 M 305 178 C 298 172, 288 178, 292 190 C 296 202, 310 204, 324 194 C 335 175, 355 100, 365 95 C 372 92, 375 102, 365 135 L 350 202 M 355 178 C 370 172, 385 182, 380 195 C 378 200, 385 202, 395 194"
                    />
                    {/* Stroke 3: 'y' lower loop and flow into 'B' */}
                    <path
                      ref={signaturePath3}
                      className="path-3"
                      style={{
                        fill: 'none',
                        strokeWidth: 2.6,
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round',
                        strokeOpacity: 0.95,
                      }}
                      d="M 395 194 C 402 180, 414 176, 422 188 L 426 200 C 435 182, 448 178, 456 190 L 458 205 C 455 230, 440 280, 420 295 C 402 308, 385 295, 402 270 C 418 245, 460 210, 500 185"
                    />
                    {/* Stroke 4: 'Babcock' and flourishing tail */}
                    <path
                      ref={signaturePath4}
                      className="path-4"
                      style={{
                        fill: 'none',
                        strokeWidth: 3.0,
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round',
                        strokeOpacity: 0.95,
                      }}
                      d="M 515 205 L 555 55 C 560 38, 545 42, 532 65 L 510 150 C 510 150, 535 115, 570 110 C 600 105, 615 125, 602 155 C 590 178, 560 185, 535 182 C 565 180, 610 178, 618 210 C 624 235, 600 252, 565 250 C 525 248, 500 230, 518 200 M 625 202 C 638 180, 662 178, 670 195 C 675 208, 665 218, 650 218 C 636 218, 630 206, 640 192 C 650 180, 668 185, 678 216 M 678 216 C 690 195, 715 105, 725 100 C 732 96, 735 108, 725 140 L 715 210 C 720 218, 735 216, 745 202 M 758 190 C 750 184, 740 190, 744 204 C 748 215, 764 216, 778 206 C 788 192, 805 190, 812 205 C 816 216, 808 225, 796 225 C 784 225, 778 216, 786 204 C 794 194, 808 198, 822 208 M 840 190 C 832 184, 822 190, 826 204 C 830 215, 846 216, 860 206 C 870 185, 890 115, 900 110 C 906 106, 908 115, 900 145 L 888 208 M 894 186 C 906 180, 918 188, 914 200 C 911 208, 922 208, 936 198 C 960 180, 990 170, 1020 166"
                    />
                  </g>

                  {/* Restrained post-draw starlight sparkle glints */}
                  {signatureDrawn && (
                    <g className="transition-opacity duration-1000 opacity-70">
                      <g transform="translate(155, 58) scale(0.45)">
                        <path
                          fill="#ffffff"
                          d="M 0 -16 Q 0 0 16 0 Q 0 0 0 16 Q 0 0 -16 0 Q 0 0 0 -16 Z"
                        />
                      </g>
                      <g transform="translate(605, 120) scale(0.4)">
                        <path
                          fill="#ffffff"
                          d="M 0 -14 Q 0 0 14 0 Q 0 0 0 14 Q 0 0 -14 0 Q 0 0 0 -14 Z"
                        />
                      </g>
                      <g transform="translate(1015, 166) scale(0.45)">
                        <path
                          fill="#ffffff"
                          d="M 0 -18 Q 0 0 18 0 Q 0 0 0 18 Q 0 0 -18 0 Q 0 0 0 -18 Z"
                        />
                      </g>
                    </g>
                  )}
                </svg>
              </div>

              <span className="font-mono text-[10px] text-white/40 tracking-widest uppercase">
                AUTHENTICATED &bull; 2026
              </span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
