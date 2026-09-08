import React, { useEffect, useRef } from 'react';
import {
  RxGithubLogo,
  RxDiscordLogo,
  RxInstagramLogo,
  RxTwitterLogo,
  RxLinkedinLogo,
  RxHeart,
  RxEnvelopeClosed,
  RxCode,
  RxArchive,
} from 'react-icons/rx';
import { FaYoutube, FaSpotify } from 'react-icons/fa';
import { onScrolledIntoView } from '../utils';
import { SiteData } from '../types';

interface FooterProps {
  siteData?: SiteData | null;
}

// External links data structure based on sanidhyy/space-portfolio
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
        link: 'mailto:holmepavolini@gmail.com',
      },
    ],
  },
  {
    title: 'Architecture',
    data: [
      {
        name: 'Open Source Repo',
        icon: RxCode,
        link: 'https://github.com/RockyBabcock/Rockyshomepage',
      },
      {
        name: 'WebGL Starfield',
        icon: null,
        link: '#home',
      },
      {
        name: 'MIT License',
        icon: null,
        link: 'https://opensource.org/licenses/MIT',
      },
    ],
  },
] as const;

export const Footer: React.FC<FooterProps> = ({ siteData }) => {
  const footerContainerElement = useRef<HTMLDivElement>(null);
  const signaturePath1 = useRef<SVGPathElement>(null);
  const signaturePath2 = useRef<SVGPathElement>(null);
  const signaturePath3 = useRef<SVGPathElement>(null);
  const signaturePath4 = useRef<SVGPathElement>(null);

  const currentYear = new Date().getFullYear();

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
      },
      0.15
    );

    return cleanup;
  }, []);

  return (
    <footer
      id="contact"
      className="footer-wrapper"
      ref={footerContainerElement}
    >
      <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 xl:gap-12">
        {/* Left Column: Top-left Logo, Status & Email, Credits */}
        <div className="flex flex-col justify-between w-full lg:w-[34%] xl:w-[32%] flex-shrink-0">
          {/* Top-left: Pure logo */}
          <div className="logo-wrapper">
            <div className="inline-flex">
              <img src="/assets/imgs/logo.svg" alt="logo" className="logo" />
            </div>
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
                <p className="large-text">
                  I am currently not available for freelance work, <br />
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
              className="button large-text inline-block"
              href="mailto:holmepavolini@gmail.com"
              target="_blank"
              rel="noreferrer"
            >
              holmepavolini@gmail.com
            </a>
          </div>

          {/* Credits wrapper matching Musab Hassan */}
          <div className="credits-wrapper">
            <p className="year">© {currentYear} Rocky Babcock</p>
            <p className="credits">
              designed and developed as a Personal Digital Museum
              <br />
              <a
                className="clickable button no-decor"
                href="https://github.com/RockyBabcock/Rockyshomepage"
                target="_blank"
                rel="noreferrer"
              >
                this website is open source on github
              </a>
            </p>
          </div>
        </div>

        {/* Center / Middle-Right Column: Space-portfolio 4 categorized external link sections */}
        <div className="w-full lg:flex-1 grid grid-cols-2 sm:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-4 lg:px-4">
          {FOOTER_DATA.map((column) => (
            <div
              key={column.title}
              className="flex flex-col items-start justify-start"
            >
              <h3 className="font-semibold text-[15px] sm:text-[16px] text-gray-200 mb-2 tracking-wide">
                {column.title}
              </h3>
              {column.data.map(({ icon: Icon, name, link }) => (
                <a
                  key={`${column.title}-${name}`}
                  href={link}
                  target={link.startsWith('http') ? '_blank' : undefined}
                  rel={link.startsWith('http') ? 'noreferrer noopener' : undefined}
                  className="flex flex-row items-center my-[4px] text-gray-400 hover:text-white transition-colors duration-200 group"
                >
                  {Icon && (
                    <Icon className="text-[16px] flex-shrink-0 text-gray-400 group-hover:text-white" />
                  )}
                  <span
                    className={`text-[14px] sm:text-[15px] leading-snug whitespace-nowrap ${
                      Icon ? 'ml-[8px]' : ''
                    }`}
                  >
                    {name}
                  </span>
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Far Right: Signature in the exact same position, vertically centered and unboxed */}
        <div className="flex-wrapper decor flex items-center justify-end flex-shrink-0 w-full lg:w-[170px] xl:w-[200px]">
          <svg
            id="signature"
            className="name-signature"
            x="0px"
            y="0px"
            viewBox="0 0 190 136.9"
            style={{ stroke: 'rgb(140, 139, 150)' }}
          >
            <g>
              <path
                ref={signaturePath1}
                className="path-1"
                style={{
                  fill: 'none',
                  strokeWidth: 2.5,
                  strokeLinecap: 'round',
                  strokeLinejoin: 'miter',
                  strokeOpacity: 1,
                  strokeMiterlimit: 4,
                }}
                d="M38.1,51c0,0,4.9-34.4,39.6-37.7c11.1-1.1-11.5,86.2-48.9,87.5c-18.5,0.6,19-69.3,51.7-84.4c21.3-9.8,15.3,26,15.3,26s6.2-9.3,7.9-6.1c1.7,3.1,0.1,5.1,6.9-1.9c1-1.2,13.9,3.3,18.8-1.3c1.4-1.3,6.4,1.3,6.4,1.3"
              />
              <path
                ref={signaturePath2}
                className="path-2"
                style={{
                  fill: 'none',
                  strokeWidth: 2.5,
                  strokeLinecap: 'round',
                  strokeLinejoin: 'miter',
                  strokeOpacity: 1,
                  strokeMiterlimit: 4,
                }}
                d="M132.2,48.3l-23.9,78.8"
              />
              <path
                ref={signaturePath3}
                className="path-3"
                style={{
                  fill: 'none',
                  strokeWidth: 2.5,
                  strokeLinecap: 'round',
                  strokeLinejoin: 'miter',
                  strokeOpacity: 1,
                  strokeMiterlimit: 4,
                }}
                d="M110.3,55.3c0,0-0.7,11.7-2.8,18s-6.7,20.2-6.9,24.1"
              />
              <path
                ref={signaturePath4}
                className="path-4"
                style={{
                  fill: 'none',
                  strokeWidth: 2.5,
                  strokeLinecap: 'round',
                  strokeLinejoin: 'miter',
                  strokeOpacity: 1,
                  strokeMiterlimit: 4,
                }}
                d="M122,74.4c0,0-5.9-8-17.1-6.7c-11.1,1.3-20.2,11.3-21.1,12.6c-0.9,1.3-10,9.6,2.2,15s38.9-7.2,38.9-7.2s17.8-10,18.9-10s-4.6,5.9-4.3,7.2c0.4,1.3,2.8,2,7.2-1.5c1-0.8,17.2-0.8,22.2,1c1.9,0.7,3.5-0.2,5-1.4c1-0.8,9.4,2,9.4,2"
              />
            </g>
          </svg>
        </div>
      </div>
    </footer>
  );
};
