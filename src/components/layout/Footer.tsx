import React, { useEffect, useRef, useState } from 'react';
import {
  RxGithubLogo,
  RxDiscordLogo,
  RxInstagramLogo,
  RxTwitterLogo,
  RxLinkedinLogo,
  RxHeart,
  RxEnvelopeClosed,
  RxArchive,
} from 'react-icons/rx';
import { FaYoutube, FaSpotify, FaTelegramPlane } from 'react-icons/fa';
import { onScrolledIntoView } from '../../utils';
import { SiteData } from '../../types';

interface FooterProps {
  siteData?: SiteData | null;
}

// External links data structure based on sanidhyy/space-portfolio (extensible for future items)
export const FOOTER_DATA = [
  {
    title: 'Community',
    data: [
      {
        name: 'YouTube',
        icon: FaYoutube,
        link: 'https://youtube.com',
      },
      {
        name: 'GitHub',
        icon: RxGithubLogo,
        link: 'https://github.com/RockyBabcock',
      },
      {
        name: 'Discord',
        icon: RxDiscordLogo,
        link: 'https://discord.com',
      },
      {
        name: 'Twitter / X',
        icon: RxTwitterLogo,
        link: 'https://x.com/RockyBabcock',
      },
    ],
  },
  {
    title: 'Social Media',
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
        name: 'Spotify Music',
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
    title: 'About & Inquiries',
    data: [
      {
        name: 'Become Sponsor',
        icon: RxHeart,
        link: 'https://github.com/sponsors',
      },
      {
        name: 'Museum Archive',
        icon: RxArchive,
        link: '#home',
      },
      {
        name: 'Contact Directly',
        icon: RxEnvelopeClosed,
        link: 'mailto:rockybuilding.aiweb3@gmail.com',
      },
    ],
  },
];

export const Footer: React.FC<FooterProps> = ({ siteData }) => {
  const footerContainerElement = useRef<HTMLDivElement>(null);
  const signaturePath1 = useRef<SVGPathElement>(null);
  const signaturePath2 = useRef<SVGPathElement>(null);
  const signaturePath3 = useRef<SVGPathElement>(null);
  const signaturePath4 = useRef<SVGPathElement>(null);

  const currentYear = new Date().getFullYear();

  const [signatureDrawn, setSignatureDrawn] = useState(false);

  // Scroll into view animation matching Musab Hassan's exact easing and delays
  useEffect(() => {
    if (!footerContainerElement.current) return;

    const cleanup = onScrolledIntoView(
      footerContainerElement.current,
      () => {
        const animation = [{ strokeDashoffset: '0' }];

        signaturePath1.current?.animate(animation, {
          duration: 1000,
          delay: 0,
          easing: 'cubic-bezier(.72,.3,.25,1)',
          fill: 'forwards',
        });

        signaturePath2.current?.animate(animation, {
          duration: 300,
          delay: 1000,
          easing: 'cubic-bezier(.47,.41,.26,1)',
          fill: 'forwards',
        });

        signaturePath3.current?.animate(animation, {
          duration: 200,
          delay: 1300,
          easing: 'cubic-bezier(.47,.41,.26,1)',
          fill: 'forwards',
        });

        signaturePath4.current?.animate(animation, {
          duration: 1000,
          delay: 1500,
          easing: 'cubic-bezier(.47,.41,.26,1)',
          fill: 'forwards',
        });

        // Trigger post-draw celebration effect: glowing aura + sparkle glints
        setTimeout(() => {
          setSignatureDrawn(true);
        }, 2500);
      },
      0.15
    );

    return cleanup;
  }, []);

  return (
    <footer
      id="contact"
      className="footer-wrapper relative overflow-hidden"
      ref={footerContainerElement}
    >
      {/* Top subtle gradient accent line separating page content from footer */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent pointer-events-none" />

      <div className="w-full max-w-[1400px] mx-auto flex flex-col xl:flex-row items-start xl:items-center justify-between gap-10 xl:gap-8">
        {/* Zone 1: Left Brand Column (Logo, Status & Direct Email, Copyright) */}
        <div className="flex flex-col justify-between w-full xl:w-[32%] flex-shrink-0 space-y-4">
          {/* Top-left: Pure crisp logo */}
          <div className="logo-wrapper !mb-1 flex items-center">
            <a href="#home" className="inline-flex items-center group cursor-pointer" aria-label="Home">
              <img
                src="/assets/imgs/logo-rb-cyber.svg"
                alt="Rocky Babcock Logo"
                className="logo w-auto h-7 sm:h-8 object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </a>
          </div>

          {/* Status text & Email link */}
          <div className="status-wrapper">
            {siteData ? (
              siteData.availablity_date === '' ? (
                <p className="large-text">
                  i am currently accepting freelance work, <br />
                  you may reach me on my email.
                </p>
              ) : siteData.availablity_date === 'TBD' ? (
                <p className="large-text text-white/90">
                  I am currently not available for freelance work, <br className="hidden sm:inline" />
                  but you may reach me on my email for any inquiries.
                </p>
              ) : (
                <p className="large-text">
                  i am available for freelance work after <br />
                  {siteData.availablity_date}.
                </p>
              )
            ) : (
              <p className="large-text">
                i am currently accepting freelance work, <br />
                you may reach me on my email.
              </p>
            )}

            <a
              className="button large-text inline-block mt-2 font-mono tracking-tight text-white/95 hover:text-cyan-300 transition-colors duration-200"
              href="mailto:rockybuilding.aiweb3@gmail.com"
              target="_blank"
              rel="noreferrer"
            >
              rockybuilding.aiweb3@gmail.com
            </a>
          </div>

          {/* Credits wrapper */}
          <div className="credits-wrapper pt-2 border-t border-white/[0.06]">
            <p className="year">© {currentYear} Rocky Babcock</p>
            <p className="credits">
              designed and developed as a Personal Digital Museum
              <br />
              <a
                className="clickable button no-decor text-white/40 hover:text-white/80 transition-colors"
                href="https://github.com/RockyBabcock/Rockyshomepage"
                target="_blank"
                rel="noreferrer"
              >
                this website is open source on github
              </a>
            </p>
          </div>
        </div>

        {/* Zone 2: Middle Navigation & Social Matrix (Flexible, perfectly centered, easily expandable) */}
        <div className="w-full xl:flex-1 flex justify-center xl:px-8">
          <div className="w-full max-w-[560px] grid grid-cols-2 sm:grid-cols-3 gap-x-8 sm:gap-x-12 gap-y-6">
            {FOOTER_DATA.map((column) => (
              <div
                key={column.title}
                className="flex flex-col items-start justify-start min-w-[120px]"
              >
                <h3 className="font-mono uppercase text-[11px] font-semibold tracking-[0.22em] text-white/40 mb-3.5 select-none">
                  {column.title}
                </h3>
                <div className="flex flex-col space-y-2.5">
                  {column.data.map(({ icon: Icon, name, link }) => (
                    <a
                      key={`${column.title}-${name}`}
                      href={link}
                      target={link.startsWith('http') ? '_blank' : undefined}
                      rel={link.startsWith('http') ? 'noreferrer noopener' : undefined}
                      className="flex flex-row items-center text-white/60 hover:text-white transition-all duration-200 group text-[13px] sm:text-[14px]"
                    >
                      {Icon && (
                        <Icon className="text-[15px] flex-shrink-0 text-white/40 group-hover:text-cyan-400 group-hover:scale-110 transition-all duration-200" />
                      )}
                      <span
                        className={`leading-relaxed whitespace-nowrap group-hover:translate-x-0.5 transition-transform duration-200 ${
                          Icon ? 'ml-2.5' : ''
                        }`}
                      >
                        {name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zone 3: Far Right Animated Hand-Drawn Signature */}
        <div className="flex-wrapper decor flex items-center justify-start xl:justify-end flex-shrink-0 w-full xl:w-[280px] pt-4 xl:pt-0">
          <div className="relative group cursor-pointer w-full max-w-[340px] flex justify-start xl:justify-end">
            <svg
              id="signature"
              className={`name-signature ${
                signatureDrawn ? 'footer-signature-active' : ''
              } transition-all duration-700 hover:scale-105`}
              x="0px"
              y="0px"
              viewBox="0 0 1020 320"
              style={{
                stroke: '#ffffff',
                filter: signatureDrawn
                  ? 'drop-shadow(0 0 14px rgba(255,255,255,0.95)) drop-shadow(0 0 28px rgba(192,132,252,0.85)) drop-shadow(0 0 45px rgba(129,140,248,0.55))'
                  : 'drop-shadow(0 0 8px rgba(255,255,255,0.6))',
              }}
            >
              <defs>
                <linearGradient id="footer-signature-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffffff"/>
                  <stop offset="35%" stopColor="#f5f3ff"/>
                  <stop offset="70%" stopColor="#ede9fe"/>
                  <stop offset="100%" stopColor="#ffffff"/>
                </linearGradient>
              </defs>
              <g stroke="url(#footer-signature-grad)">
                {/* Rocky Babcock signature stroke paths with bolder stroke widths */}
                {/* Stroke 1: Capital 'R' ascender & initial loop */}
                <path
                  ref={signaturePath1}
                  className="path-1"
                  style={{
                    fill: 'none',
                    strokeWidth: 4.5,
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    strokeOpacity: 1,
                    strokeMiterlimit: 4,
                  }}
                  d="M 60 180 C 70 130, 110 65, 155 60 C 185 56, 210 78, 200 115 C 190 150, 150 180, 125 185 C 110 188, 100 175, 105 150 L 135 65"
                />
                {/* Stroke 2: 'ocky' sequence */}
                <path
                  ref={signaturePath2}
                  className="path-2"
                  style={{
                    fill: 'none',
                    strokeWidth: 3.8,
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    strokeOpacity: 1,
                    strokeMiterlimit: 4,
                  }}
                  d="M 147 132 C 167 135, 190 155, 200 185 C 205 198, 218 200, 230 185 C 242 165, 270 160, 280 180 C 286 195, 274 205, 260 205 C 246 205, 240 195, 248 182 C 258 170, 275 175, 292 185 M 305 178 C 298 172, 288 178, 292 190 C 296 202, 310 204, 324 194 C 335 175, 355 100, 365 95 C 372 92, 375 102, 365 135 L 350 202 M 355 178 C 370 172, 385 182, 380 195 C 378 200, 385 202, 395 194"
                />
                {/* Stroke 3: 'y' lower loop and flow into 'B' */}
                <path
                  ref={signaturePath3}
                  className="path-3"
                  style={{
                    fill: 'none',
                    strokeWidth: 3.8,
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    strokeOpacity: 1,
                    strokeMiterlimit: 4,
                  }}
                  d="M 395 194 C 402 180, 414 176, 422 188 L 426 200 C 435 182, 448 178, 456 190 L 458 205 C 455 230, 440 280, 420 295 C 402 308, 385 295, 402 270 C 418 245, 460 210, 500 185"
                />
                {/* Stroke 4: Babcock and flourishing tail */}
                <path
                  ref={signaturePath4}
                  className="path-4"
                  style={{
                    fill: 'none',
                    strokeWidth: 4.2,
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    strokeOpacity: 1,
                    strokeMiterlimit: 4,
                  }}
                  d="M 515 205 L 555 55 C 560 38, 545 42, 532 65 L 510 150 C 510 150, 535 115, 570 110 C 600 105, 615 125, 602 155 C 590 178, 560 185, 535 182 C 565 180, 610 178, 618 210 C 624 235, 600 252, 565 250 C 525 248, 500 230, 518 200 M 625 202 C 638 180, 662 178, 670 195 C 675 208, 665 218, 650 218 C 636 218, 630 206, 640 192 C 650 180, 668 185, 678 216 M 678 216 C 690 195, 715 105, 725 100 C 732 96, 735 108, 725 140 L 715 210 C 720 218, 735 216, 745 202 M 758 190 C 750 184, 740 190, 744 204 C 748 215, 764 216, 778 206 C 788 192, 805 190, 812 205 C 816 216, 808 225, 796 225 C 784 225, 778 216, 786 204 C 794 194, 808 198, 822 208 M 840 190 C 832 184, 822 190, 826 204 C 830 215, 846 216, 860 206 C 870 185, 890 115, 900 110 C 906 106, 908 115, 900 145 L 888 208 M 894 186 C 906 180, 918 188, 914 200 C 911 208, 922 208, 936 198 C 960 180, 990 170, 1020 166"
                />
              </g>

              {/* Post-draw sparkling stars */}
              {signatureDrawn && (
                <g className="transition-opacity duration-1000 opacity-100">
                  {/* Star 1 at 'R' loop */}
                  <g transform="translate(155, 58) scale(0.6)">
                    <path
                      fill="#ffffff"
                      filter="drop-shadow(0 0 6px #ffffff) drop-shadow(0 0 14px #c084fc)"
                      d="M 0 -16 Q 0 0 16 0 Q 0 0 0 16 Q 0 0 -16 0 Q 0 0 0 -16 Z"
                    />
                  </g>
                  {/* Star 2 at 'B' upper loop */}
                  <g transform="translate(605, 120) scale(0.55)">
                    <path
                      fill="#ffffff"
                      filter="drop-shadow(0 0 6px #ffffff) drop-shadow(0 0 12px #38bdf8)"
                      d="M 0 -14 Q 0 0 14 0 Q 0 0 0 14 Q 0 0 -14 0 Q 0 0 0 -14 Z"
                    />
                  </g>
                  {/* Star 3 at the flourishing tail apex */}
                  <g transform="translate(1015, 166) scale(0.65)">
                    <path
                      fill="#ffffff"
                      filter="drop-shadow(0 0 8px #ffffff) drop-shadow(0 0 16px #a855f7)"
                      d="M 0 -18 Q 0 0 18 0 Q 0 0 0 18 Q 0 0 -18 0 Q 0 0 0 -18 Z"
                    />
                  </g>
                </g>
              )}
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
};
