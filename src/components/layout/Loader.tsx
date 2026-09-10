import React, { useEffect, useState, useRef } from 'react';

interface LoaderProps {
  progress: number;
  loadingDone: boolean;
  onFinish?: () => void;
}

// Exact signature paths from /public/assets/imgs/signature.svg for fluid vector stroke animation
const SIGNATURE_PATHS = [
  // Rocky
  'M 65 190 C 75 140, 115 75, 160 70 C 190 66, 215 88, 205 125 C 195 160, 155 190, 130 195 C 115 198, 105 185, 110 160 L 140 75',
  'M 152 142 C 172 145, 195 165, 205 195 C 210 208, 222 210, 235 195',
  'M 235 195 C 248 175, 275 170, 285 190 C 292 205, 280 215, 265 215 C 250 215, 242 205, 252 192 C 262 180, 280 185, 298 195',
  'M 312 188 C 305 182, 295 188, 298 200 C 302 212, 318 214, 332 204',
  'M 332 204 C 345 185, 365 110, 375 105 C 382 102, 385 112, 375 145 L 360 212 M 365 188 C 380 182, 395 192, 390 205 C 388 210, 395 212, 405 204',
  'M 405 204 C 412 190, 424 186, 432 198 L 436 210 C 445 192, 458 188, 466 200 L 468 215 C 465 240, 450 290, 430 305 C 412 318, 395 305, 412 280 C 428 255, 470 220, 510 195',
  // Babcock
  'M 525 215 L 565 65 C 570 48, 555 52, 542 75 L 520 160 C 520 160, 545 125, 580 120 C 610 115, 625 135, 612 165 C 600 188, 570 195, 545 192 C 575 190, 620 188, 628 220 C 634 245, 610 262, 575 260 C 535 258, 510 240, 528 210',
  'M 635 212 C 648 190, 672 188, 680 205 C 685 218, 675 228, 660 228 C 646 228, 640 216, 650 202 C 660 190, 678 195, 688 226',
  'M 688 226 C 700 205, 725 115, 735 110 C 742 106, 745 118, 735 150 L 725 220 C 730 228, 745 226, 755 212',
  'M 770 200 C 762 194, 752 200, 756 214 C 760 225, 776 226, 790 216',
  'M 802 206 C 812 192, 830 190, 836 205 C 840 216, 832 225, 820 225 C 808 225, 802 216, 810 204 C 818 194, 832 198, 846 208',
  'M 865 200 C 858 194, 848 200, 852 214 C 856 225, 872 226, 886 216',
  'M 886 216 C 896 195, 915 125, 924 120 C 930 116, 932 125, 924 155 L 912 218 M 918 196 C 930 190, 942 198, 938 210 C 935 218, 946 218, 960 208 C 995 188, 1045 178, 1100 174',
];

/**
 * Ceremonial Opening (入场典礼):
 * 黑场 → 签名一笔写出（进度条藏在签名笔触中） → 花亮起来（郁金香柔光盛开） → 名字落地。
 * 3.5 秒严格编排，只播一次（支持 Session 状态记录），支持右上角随时跳过。
 */
export const Loader: React.FC<LoaderProps> = ({ progress, loadingDone, onFinish }) => {
  const [phase, setPhase] = useState<'black' | 'signature' | 'flower' | 'name' | 'exit'>('black');
  const [strokeProgress, setStrokeProgress] = useState<number>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [hasSkipped, setHasSkipped] = useState<boolean>(false);

  const startTimeRef = useRef<number>(performance.now());
  const reqAnimRef = useRef<number | null>(null);
  const progressRef = useRef<number>(progress);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  // Check if session has already experienced the ceremony
  useEffect(() => {
    try {
      const alreadyPlayed = sessionStorage.getItem('rb_ceremony_seen');
      if (alreadyPlayed === 'true') {
        // Fast-path for repeated sessions: immediate exit
        setIsExiting(true);
        if (onFinish) onFinish();
        return;
      }
    } catch {
      // Ignore sessionStorage errors
    }
  }, [onFinish]);

  // Master Ceremonial Timeline: exactly 3.5 seconds
  useEffect(() => {
    if (isExiting) return;

    startTimeRef.current = performance.now();

    const animateTimeline = (now: number) => {
      const elapsed = now - startTimeRef.current;

      // 1. Stage 0: 0.0s - 0.4s (黑场 / Absolute Stillness)
      if (elapsed < 400) {
        setPhase('black');
        setStrokeProgress(0);
      }
      // 2. Stage 1: 0.4s - 1.8s (签名一笔写出 / Signature Stroke Drawing with embedded progress)
      else if (elapsed < 1800) {
        setPhase('signature');
        const drawNorm = (elapsed - 400) / 1400; // 0 -> 1
        // Harmonize time-based stroke drawing with actual network progress
        const networkNorm = Math.min(1, progressRef.current / 100);
        const combined = Math.max(drawNorm, networkNorm * 0.95);
        setStrokeProgress(Math.min(1, combined));
      }
      // 3. Stage 2: 1.8s - 2.5s (花亮起来 / Studio Rose lights up)
      else if (elapsed < 2500) {
        setPhase('flower');
        setStrokeProgress(1);
      }
      // 4. Stage 3: 2.5s - 3.2s (名字落地 / Name drops down with starlight resonance)
      else if (elapsed < 3200) {
        setPhase('name');
        setStrokeProgress(1);
      }
      // 5. Stage 4: 3.2s - 3.5s (Exit / Curtain parts)
      else {
        setPhase('exit');
        setStrokeProgress(1);
        handleCeremonyComplete();
        return;
      }

      reqAnimRef.current = requestAnimationFrame(animateTimeline);
    };

    reqAnimRef.current = requestAnimationFrame(animateTimeline);

    return () => {
      if (reqAnimRef.current) cancelAnimationFrame(reqAnimRef.current);
    };
  }, [isExiting]);

  const handleCeremonyComplete = () => {
    try {
      sessionStorage.setItem('rb_ceremony_seen', 'true');
    } catch {
      // Storage unavailable
    }
    setIsExiting(true);
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 700);
  };

  const handleSkip = () => {
    if (isExiting || hasSkipped) return;
    setHasSkipped(true);
    handleCeremonyComplete();
  };

  // Compute stroke dashoffset (0 = completely drawn, 1000 = hidden)
  const dashoffset = Math.max(0, (1 - strokeProgress) * 1000);

  return (
    <div
      className={`fixed inset-0 w-screen h-screen flex flex-col justify-center items-center z-[1000] bg-black transition-opacity duration-700 ease-out select-none ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-hidden={isExiting}
    >
      {/* Background visual asset: User-provided dark studio rose */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none bg-black flex items-center justify-center z-0">
        <img
          src="/assets/imgs/loader-flower.jpg"
          alt="Ceremony visual"
          className="w-full h-full object-contain sm:object-cover object-center select-none pointer-events-none transition-opacity duration-1000 ease-out"
          style={{
            opacity: phase === 'black' ? 0.25 : 0.9,
          }}
        />
      </div>

      {/* Skip button (可跳过) in upper right */}
      <button
        type="button"
        onClick={handleSkip}
        className="absolute top-6 right-8 sm:top-8 sm:right-10 z-50 text-white/50 hover:text-white text-xs font-mono tracking-[0.24em] uppercase transition-all duration-300 py-1.5 px-3 rounded-full border border-white/10 hover:border-white/30 bg-white/[0.03] backdrop-blur-md cursor-pointer group"
        aria-label="Skip introductory ceremony"
      >
        <span className="group-hover:translate-x-0.5 inline-block transition-transform duration-200">
          skip intro ↗
        </span>
      </button>

      {/* Main Ceremonial Container */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-4xl px-6 z-10">

        {/* ─────────────────────────────────────────────────────────────
            STAGE 1: 签名一笔写出 (SIGNATURE STROKE DRAWING)
            Animated stroke-dashoffset with embedded progress bar along the flourish
           ───────────────────────────────────────────────────────────── */}
        <div
          className={`relative z-10 w-[78vw] sm:w-[65vw] md:w-[50vw] max-w-[560px] h-auto transition-opacity duration-500 ${
            phase === 'black' ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <svg
            viewBox="0 0 1150 360"
            fill="none"
            className="w-full h-auto overflow-visible select-none pointer-events-none"
          >
            <defs>
              <linearGradient id="stroke-neon-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="35%" stopColor="#c084fc" />
                <stop offset="70%" stopColor="#f3e8ff" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>

              {/* Luminous starlight pen tip flare filter */}
              <filter id="pen-tip-flare" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feFlood floodColor="#ffffff" result="color" />
                <feComposite in="color" in2="blur" operator="in" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Glowing Ethereal Stroke Bloom Behind */}
            <g
              stroke="url(#stroke-neon-grad)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-70 filter blur-[3px]"
            >
              {SIGNATURE_PATHS.map((pathD, idx) => (
                <path
                  key={`bloom-${idx}`}
                  d={pathD}
                  pathLength="1000"
                  strokeDasharray="1000"
                  strokeDashoffset={dashoffset}
                  style={{ transition: 'stroke-dashoffset 0.08s linear' }}
                />
              ))}
            </g>

            {/* Laser-Sharp White Foreground Stroke */}
            <g
              stroke="#ffffff"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {SIGNATURE_PATHS.map((pathD, idx) => (
                <path
                  key={`core-${idx}`}
                  d={pathD}
                  pathLength="1000"
                  strokeDasharray="1000"
                  strokeDashoffset={dashoffset}
                  style={{ transition: 'stroke-dashoffset 0.08s linear' }}
                />
              ))}
            </g>

            {/* Spark Tip at the lead of the pen stroke */}
            {strokeProgress > 0.02 && strokeProgress < 0.98 && (
              <circle
                cx={65 + strokeProgress * (1100 - 65)}
                cy={174 + Math.sin(strokeProgress * Math.PI * 4) * 35}
                r="4.5"
                fill="#ffffff"
                filter="url(#pen-tip-flare)"
                className="animate-ping"
              />
            )}
          </svg>

          {/* 进度条藏在签名笔触底部：微弱而精雅的数字度量 */}
          <div
            className={`flex items-center justify-between mt-3 px-2 transition-all duration-700 ${
              phase === 'signature' ? 'opacity-75 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            <div className="h-[1.5px] flex-1 max-w-[120px] rounded-full overflow-hidden bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-white transition-all duration-150"
                style={{ width: `${Math.round(strokeProgress * 100)}%` }}
              />
            </div>
            <span className="text-[10px] font-mono tracking-[0.28em] text-white/70">
              {Math.min(100, Math.round(strokeProgress * 100))}%
            </span>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            STAGE 3: 名字落下 (NAME LANDS WITH GRAVITATIONAL RESONANCE)
            "rocky babcock" drops down from upper sky into sovereign alignment
           ───────────────────────────────────────────────────────────── */}
        <div
          className={`relative z-20 mt-6 sm:mt-8 overflow-hidden transition-all duration-1000 ease-out ${
            phase === 'name' || phase === 'exit'
              ? 'opacity-100 translate-y-0 filter blur-0'
              : 'opacity-0 -translate-y-12 filter blur-sm'
          }`}
        >
          <h1
            className="text-center m-0 p-0 font-normal lowercase tracking-[-0.035em] text-white text-3xl sm:text-4xl md:text-5xl"
            style={{
              fontFamily: 'var(--title-font)',
              textShadow:
                '0 0 20px rgba(255,255,255,0.9), 0 0 40px rgba(168,85,247,0.7), 0 4px 16px rgba(0,0,0,0.95)',
            }}
          >
            rocky babcock
          </h1>
          <p className="mt-2 text-center text-[11px] sm:text-xs font-mono tracking-[0.2em] text-purple-200/70 lowercase">
            ceremony initiated &bull; 2026
          </p>
        </div>
      </div>
    </div>
  );
};
export default Loader;
