import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  RxGithubLogo,
  RxDiscordLogo,
  RxInstagramLogo,
  RxTwitterLogo,
  RxLinkedinLogo,
  RxEnvelopeClosed,
} from 'react-icons/rx';
import { FaYoutube, FaSpotify, FaTelegramPlane } from 'react-icons/fa';
import { onScrolledIntoView } from '../../utils';
import { getReducedMotionPreference } from '../../hooks/useDeviceCapabilities';
import { SiteData } from '../../types';
import {
  FOOTER_SIGNATURE_STROKES,
  SIGNATURE_FINISHING_SHEEN_MS,
  SIGNATURE_PEN_ARRIVAL_MS,
  resolveFooterPlatformBrand,
  type SignatureAnimPhase,
} from './footerSignatureLogic';
import { BackToTopButton } from './BackToTopButton';

interface FooterProps {
  siteData?: SiteData | null;
  onNavigateRoute?: (path: string) => void;
}

const SIGNATURE_STROKE_PATHS = [
  {
    id: 'path-1',
    strokeWidth: 3.2,
    d: 'M 60 180 C 70 130, 110 65, 155 60 C 185 56, 210 78, 200 115 C 190 150, 150 180, 125 185 C 110 188, 100 175, 105 150 L 135 65',
  },
  {
    id: 'path-2',
    strokeWidth: 2.6,
    d: 'M 147 132 C 167 135, 190 155, 200 185 C 205 198, 218 200, 230 185 C 242 165, 270 160, 280 180 C 286 195, 274 205, 260 205 C 246 205, 240 195, 248 182 C 258 170, 275 175, 292 185 M 305 178 C 298 172, 288 178, 292 190 C 296 202, 310 204, 324 194 C 335 175, 355 100, 365 95 C 372 92, 375 102, 365 135 L 350 202 M 355 178 C 370 172, 385 182, 380 195 C 378 200, 385 202, 395 194',
  },
  {
    id: 'path-3',
    strokeWidth: 2.6,
    d: 'M 395 194 C 402 180, 414 176, 422 188 L 426 200 C 435 182, 448 178, 456 190 L 458 205 C 455 230, 440 280, 420 295 C 402 308, 385 295, 402 270 C 418 245, 460 210, 500 185',
  },
  {
    id: 'path-4',
    strokeWidth: 3.0,
    d: 'M 515 205 L 555 55 C 560 38, 545 42, 532 65 L 510 150 C 510 150, 535 115, 570 110 C 600 105, 615 125, 602 155 C 590 178, 560 185, 535 182 C 565 180, 610 178, 618 210 C 624 235, 600 252, 565 250 C 525 248, 500 230, 518 200 M 625 202 C 638 180, 662 178, 670 195 C 675 208, 665 218, 650 218 C 636 218, 630 206, 640 192 C 650 180, 668 185, 678 216 M 678 216 C 690 195, 715 105, 725 100 C 732 96, 735 108, 725 140 L 715 210 C 720 218, 735 216, 745 202 M 758 190 C 750 184, 740 190, 744 204 C 748 215, 764 216, 778 206 C 788 192, 805 190, 812 205 C 816 216, 808 225, 796 225 C 784 225, 778 216, 786 204 C 794 194, 808 198, 822 208 M 840 190 C 832 184, 822 190, 826 204 C 830 215, 846 216, 860 206 C 870 185, 890 115, 900 110 C 906 106, 908 115, 900 145 L 888 208 M 894 186 C 906 180, 918 188, 914 200 C 911 208, 922 208, 936 198 C 960 180, 990 170, 1020 166',
  },
] as const;

// Structured link matrix with global community and social platforms
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
];

export const Footer: React.FC<FooterProps> = memo(({ siteData, onNavigateRoute }) => {
  const footerContainerElement = useRef<HTMLDivElement>(null);
  const signatureSvgRef = useRef<SVGSVGElement>(null);
  const bloomWaveRectRef = useRef<SVGRectElement>(null);
  const signaturePath1 = useRef<SVGPathElement>(null);
  const signaturePath2 = useRef<SVGPathElement>(null);
  const signaturePath3 = useRef<SVGPathElement>(null);
  const signaturePath4 = useRef<SVGPathElement>(null);
  const signatureAnimationsRef = useRef<Animation[]>([]);
  const signatureTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clickFeedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentYear = new Date().getFullYear();
  const [signaturePhase, setSignaturePhase] = useState<SignatureAnimPhase>('idle');
  const [isFooterVisible, setIsFooterVisible] = useState<boolean>(false);
  const [isSignatureHovered, setIsSignatureHovered] = useState<boolean>(false);
  const [hoverSpotSvg, setHoverSpotSvg] = useState<{ cx: number; cy: number }>({ cx: 510, cy: 160 });
  const [clickedPlatform, setClickedPlatform] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (clickFeedbackTimerRef.current) clearTimeout(clickFeedbackTimerRef.current);
    };
  }, []);

  const handlePlatformClick = useCallback((platformName: string) => {
    setClickedPlatform(platformName);
    if (clickFeedbackTimerRef.current) clearTimeout(clickFeedbackTimerRef.current);
    clickFeedbackTimerRef.current = setTimeout(() => {
      setClickedPlatform(null);
    }, 450);
  }, []);

  const handleSignaturePointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    const svg = signatureSvgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const cx = Math.max(0, Math.min(1020, ((e.clientX - rect.left) / rect.width) * 1020));
    const cy = Math.max(0, Math.min(320, ((e.clientY - rect.top) / rect.height) * 320));
    setHoverSpotSvg({ cx: Math.round(cx), cy: Math.round(cy) });
  }, []);

  // 5-Stage Author Signature Ceremony triggered on first entry into Footer viewport
  useEffect(() => {
    const containerEl = footerContainerElement.current;
    if (!containerEl) return;

    const pathRefs = [
      signaturePath1.current,
      signaturePath2.current,
      signaturePath3.current,
      signaturePath4.current,
    ];

    const prefersReducedMotion = getReducedMotionPreference();

    const pathLengths = pathRefs.map((pathEl) => {
      if (!pathEl) return 0;
      const total = typeof pathEl.getTotalLength === 'function' ? pathEl.getTotalLength() : 0;
      const safeLen = Number.isFinite(total) && total > 0 ? Math.ceil(total) : 600;
      pathEl.style.strokeDasharray = `${safeLen}`;
      pathEl.style.strokeDashoffset = prefersReducedMotion ? '0' : `${safeLen}`;
      return safeLen;
    });

    if (prefersReducedMotion) {
      setSignaturePhase('resting');
      setIsFooterVisible(true);
      return;
    }

    let isCancelled = false;

    const cancelAllAnimationsAndTimers = () => {
      signatureTimersRef.current.forEach((id) => clearTimeout(id));
      signatureTimersRef.current = [];
      signatureAnimationsRef.current.forEach((anim) => {
        try {
          anim.cancel();
        } catch {
          // Safe cleanup on detach/unmount
        }
      });
      signatureAnimationsRef.current = [];
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (isCancelled) return;
        const visible = entry.isIntersecting;
        setIsFooterVisible(visible);
        signatureAnimationsRef.current.forEach((anim) => {
          try {
            if (visible && anim.playState === 'paused') {
              anim.play();
            } else if (!visible && anim.playState === 'running') {
              anim.pause();
            }
          } catch {
            // Ignore finished or detached animations
          }
        });
      },
      { root: null, threshold: 0.05 }
    );
    visibilityObserver.observe(containerEl);

    const cleanupObserver = onScrolledIntoView(
      containerEl,
      () => {
        if (isCancelled) return;

        // Stage 1: Pen Arrival (luminous point alights smoothly at first stroke origin)
        setSignaturePhase('arriving');

        const startWritingTimer = setTimeout(() => {
          if (isCancelled) return;
          // Stage 2: Sequential Natural Handwriting
          setSignaturePhase('drawing');

          const finishedPromises: Promise<unknown>[] = [];
          const createdAnimations: Animation[] = [];

          pathRefs.forEach((pathEl, idx) => {
            const spec = FOOTER_SIGNATURE_STROKES[idx];
            const length = pathLengths[idx];
            if (!pathEl || !spec || typeof pathEl.animate !== 'function') return;

            const anim = pathEl.animate(
              [{ strokeDashoffset: `${length}` }, { strokeDashoffset: '0' }],
              {
                duration: spec.durationMs,
                delay: spec.delayMs,
                easing: spec.easing,
                fill: 'forwards',
              }
            );
            createdAnimations.push(anim);
            if (anim.finished) {
              finishedPromises.push(anim.finished.catch(() => undefined));
            }
          });

          signatureAnimationsRef.current = createdAnimations;

          let hasFinishedDraw = false;
          const finishDraw = () => {
            if (isCancelled || hasFinishedDraw) return;
            hasFinishedDraw = true;

            pathRefs.forEach((pathEl) => {
              if (pathEl) {
                pathEl.style.strokeDashoffset = '0';
              }
            });
            signatureAnimationsRef.current.forEach((anim) => {
              try {
                anim.cancel();
              } catch {
                // Ignore if element detached
              }
            });
            signatureAnimationsRef.current = [];

            // Stage 3: Signature Bloom (light wave sweeping across the full completed signature)
            setSignaturePhase('bloom');

            if (bloomWaveRectRef.current && typeof bloomWaveRectRef.current.animate === 'function') {
              try {
                bloomWaveRectRef.current.animate(
                  [
                    { transform: 'translate3d(-320px, 0, 0)' },
                    { transform: 'translate3d(1180px, 0, 0)' },
                  ],
                  {
                    duration: SIGNATURE_FINISHING_SHEEN_MS,
                    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                    fill: 'forwards',
                  }
                );
              } catch {
                // Ignore SVG animation fallback
              }
            }

            const restTimer = setTimeout(() => {
              if (!isCancelled) {
                // Stage 4: Serene Resting State
                setSignaturePhase('resting');
              }
            }, SIGNATURE_FINISHING_SHEEN_MS);
            signatureTimersRef.current.push(restTimer);
          };

          const maxDrawMs = Math.max(
            ...FOOTER_SIGNATURE_STROKES.map((s) => s.delayMs + s.durationMs)
          );
          const fallbackFinishTimer = setTimeout(finishDraw, maxDrawMs + 80);
          signatureTimersRef.current.push(fallbackFinishTimer);

          Promise.all(finishedPromises).then(finishDraw);
        }, SIGNATURE_PEN_ARRIVAL_MS);

        signatureTimersRef.current.push(startWritingTimer);

        return cancelAllAnimationsAndTimers;
      },
      0.2
    );

    return () => {
      isCancelled = true;
      visibilityObserver.disconnect();
      cleanupObserver();
      cancelAllAnimationsAndTimers();
    };
  }, []);

  const isSignatureComplete = signaturePhase === 'bloom' || signaturePhase === 'resting';

  return (
    <footer
      id="contact"
      className="footer-wrapper relative overflow-hidden w-full border-t border-white/[0.08] bg-gradient-to-b from-[#0b0b0e] via-[#08080a] to-[#040405] text-white z-10"
      ref={footerContainerElement}
      aria-label="Footer & Contact"
    >
      {/* Top subtle ethereal cosmic accent separator */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/25 to-transparent pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-20 lg:py-24">
        {/* Main 3-Column Final Exhibition Chapter Grid */}
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
                className="inline-flex items-center group cursor-pointer select-none"
                aria-label="Rocky Babcock Portfolio Home"
              >
                <img
                  src="/assets/imgs/logo-rb-cyber.svg"
                  alt="Rocky Babcock Logo"
                  width={106}
                  height={49}
                  loading="lazy"
                  decoding="async"
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
                  className="group inline-flex items-center gap-2 font-mono text-xs sm:text-sm tracking-tight text-white/90 hover:text-cyan-300 transition-colors duration-200 py-1 relative"
                  href="mailto:rockybuilding.aiweb3@gmail.com"
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="pointer"
                >
                  <RxEnvelopeClosed className="text-purple-300/80 group-hover:text-cyan-300 transition-colors text-sm shrink-0" />
                  <span>rockybuilding.aiweb3@gmail.com</span>
                  <span className="text-xs text-white/40 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all">&rarr;</span>
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
                  open source on github ↗
                </a>
              </p>
            </div>
          </div>

          {/* Zone 2: Center Curated Platform Matrix - 5 Cols */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8 sm:gap-10">
            {FOOTER_DATA.map((column) => (
              <div key={column.title} className="flex flex-col space-y-3.5">
                <h3 className="font-mono uppercase text-[10px] sm:text-[11px] font-semibold tracking-[0.24em] text-white/40 select-none">
                  {column.title}
                </h3>
                <ul className="list-none p-0 m-0 space-y-2.5">
                  {column.data.map(({ icon: Icon, name, link }) => {
                    const brand = resolveFooterPlatformBrand(name);
                    const isClicked = clickedPlatform === name;

                    return (
                      <li key={name}>
                        <a
                          href={link}
                          target="_blank"
                          rel="noreferrer noopener"
                          data-cursor="pointer"
                          data-platform={brand.id}
                          data-clicked={isClicked ? 'true' : 'false'}
                          onClick={() => handlePlatformClick(name)}
                          className={`group relative inline-flex items-center justify-between gap-3 py-1 pr-1 no-underline text-white/60 hover:text-white transition-all duration-200 text-xs sm:text-[13px] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded ${
                            isClicked ? 'brightness-125' : ''
                          }`}
                        >
                          <span className="inline-flex items-center min-w-0">
                            {Icon && (
                              <span
                                className="text-xs text-white/45 transition-all duration-250 mr-2.5 shrink-0 group-hover:scale-110"
                                style={{
                                  color: undefined,
                                }}
                              >
                                <Icon className={`transition-colors duration-250 ${brand.accentTextClass}`} />
                              </span>
                            )}
                            <span
                              className={`whitespace-nowrap transition-colors duration-250 ${brand.accentTextClass}`}
                            >
                              {name}
                            </span>
                          </span>

                          {/* Subtle miniature external link arrow */}
                          <span
                            aria-hidden="true"
                            className={`text-[10px] font-mono text-white/45 opacity-75 group-hover:opacity-100 -translate-x-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 ${brand.accentTextClass}`}
                          >
                            &#8599;
                          </span>

                          {/* Left-to-right expanding brand-gradient underline */}
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute left-0 right-0 bottom-0 h-[1px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-full"
                            style={{
                              background: brand.underlineGradient,
                              opacity: isClicked ? 1 : 0.85,
                              transform: isClicked ? 'scaleX(1)' : undefined,
                            }}
                          />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Zone 3: Far Right Author Seal & 5-Stage Handwritten Signature Ceremony - 3 Cols */}
          <div className="lg:col-span-3 flex flex-col items-start lg:items-end justify-between pt-6 lg:pt-0">
            <div className="w-full flex flex-col items-start lg:items-end space-y-3">
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/35 select-none">
                AUTHOR SEAL
              </span>

              {/* Interactive 5-Stage Handwritten SVG Signature */}
              <div className="relative group cursor-pointer w-[210px] sm:w-[250px] lg:w-[285px] select-none">
                <svg
                  ref={signatureSvgRef}
                  id="signature"
                  data-signature-phase={signaturePhase}
                  onPointerEnter={() => setIsSignatureHovered(true)}
                  onPointerLeave={() => setIsSignatureHovered(false)}
                  onPointerMove={handleSignaturePointerMove}
                  className={`w-full h-auto transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] select-none ${
                    signaturePhase === 'bloom'
                      ? 'footer-signature-finishing'
                      : signaturePhase === 'resting'
                      ? `${
                          isFooterVisible
                            ? 'footer-signature-resting'
                            : 'footer-signature-resting footer-signature-paused'
                        } ${isSignatureHovered ? 'footer-signature-hover-luster' : ''}`
                      : ''
                  }`}
                  viewBox="0 0 1020 320"
                  aria-label="Rocky Babcock handwritten signature"
                >
                  <defs>
                    <linearGradient id="footer-signature-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="50%" stopColor="#f3e8ff" />
                      <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>

                    <linearGradient id="footer-bloom-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                      <stop offset="35%" stopColor="#e9d5ff" stopOpacity="0.9" />
                      <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                      <stop offset="65%" stopColor="#c4b5fd" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>

                    <radialGradient
                      id="footer-hover-spot-grad"
                      cx={hoverSpotSvg.cx}
                      cy={hoverSpotSvg.cy}
                      r="175"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
                      <stop offset="45%" stopColor="#e9d5ff" stopOpacity="0.58" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                    </radialGradient>

                    {/* Travelling mask clip for Stage 3 Signature Bloom */}
                    <clipPath id="footer-bloom-clip">
                      <rect
                        ref={bloomWaveRectRef}
                        x="0"
                        y="0"
                        width="280"
                        height="320"
                        style={{ transform: 'translate3d(-320px, 0, 0)' }}
                      />
                    </clipPath>
                  </defs>

                  {/* Base 4 calligraphic strokes */}
                  <g stroke="url(#footer-signature-grad)">
                    <path
                      ref={signaturePath1}
                      className="path-1"
                      style={{
                        fill: 'none',
                        strokeWidth: SIGNATURE_STROKE_PATHS[0].strokeWidth,
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round',
                        strokeOpacity: 0.95,
                      }}
                      d={SIGNATURE_STROKE_PATHS[0].d}
                    />
                    <path
                      ref={signaturePath2}
                      className="path-2"
                      style={{
                        fill: 'none',
                        strokeWidth: SIGNATURE_STROKE_PATHS[1].strokeWidth,
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round',
                        strokeOpacity: 0.95,
                      }}
                      d={SIGNATURE_STROKE_PATHS[1].d}
                    />
                    <path
                      ref={signaturePath3}
                      className="path-3"
                      style={{
                        fill: 'none',
                        strokeWidth: SIGNATURE_STROKE_PATHS[2].strokeWidth,
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round',
                        strokeOpacity: 0.95,
                      }}
                      d={SIGNATURE_STROKE_PATHS[2].d}
                    />
                    <path
                      ref={signaturePath4}
                      className="path-4"
                      style={{
                        fill: 'none',
                        strokeWidth: SIGNATURE_STROKE_PATHS[3].strokeWidth,
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round',
                        strokeOpacity: 0.95,
                      }}
                      d={SIGNATURE_STROKE_PATHS[3].d}
                    />
                  </g>

                  {/* Stage 1: Pen Arrival luminous point at opening origin (60, 180) */}
                  {signaturePhase === 'arriving' && (
                    <g className="footer-pen-arrival" aria-hidden="true">
                      <circle cx="60" cy="180" r="18" fill="rgba(192, 132, 252, 0.25)" />
                      <circle cx="60" cy="180" r="6" fill="#ffffff" />
                    </g>
                  )}

                  {/* Stage 3: Travelling Signature Bloom light wave along full stroke contour */}
                  {signaturePhase === 'bloom' && (
                    <g clipPath="url(#footer-bloom-clip)" stroke="url(#footer-bloom-grad)" aria-hidden="true">
                      {SIGNATURE_STROKE_PATHS.map((stroke) => (
                        <path
                          key={`bloom-${stroke.id}`}
                          d={stroke.d}
                          style={{
                            fill: 'none',
                            strokeWidth: stroke.strokeWidth + 2.4,
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round',
                          }}
                        />
                      ))}
                    </g>
                  )}

                  {/* Stage 5: Restrained cursor-tracked local luster on hover (never replays stroke draw) */}
                  {isSignatureComplete && isSignatureHovered && (
                    <g stroke="url(#footer-hover-spot-grad)" aria-hidden="true">
                      {SIGNATURE_STROKE_PATHS.map((stroke) => (
                        <path
                          key={`hover-${stroke.id}`}
                          d={stroke.d}
                          style={{
                            fill: 'none',
                            strokeWidth: stroke.strokeWidth + 1.6,
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round',
                          }}
                        />
                      ))}
                    </g>
                  )}

                  {/* Restrained post-draw starlight sparkle glints */}
                  {isSignatureComplete && (
                    <g
                      className={`footer-signature-sparkle transition-opacity duration-700 ${
                        signaturePhase === 'bloom' ? 'opacity-95' : 'opacity-65'
                      }`}
                    >
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

              <span className="font-mono text-[10px] text-white/40 tracking-widest uppercase select-none">
                AUTHENTICATED &bull; 2026
              </span>
            </div>

            {/* Bottom-Right Independent Back to Top Circular Control */}
            <div className="mt-8 lg:mt-10 self-end">
              <BackToTopButton />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
