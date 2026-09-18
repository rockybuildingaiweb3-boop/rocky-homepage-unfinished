/**
 * Signature Path Geometry & Sequential Handwriting Physics
 * Sourced directly from /public/assets/imgs/signature.svg
 */

export interface SignatureStrokeDef {
  id: string;
  word: 'rocky' | 'babcock';
  pathD: string;
  approxLength: number;
  pauseAfter: number; // Virtual pen-lift delay in virtual units
}

export const SIGNATURE_STROKE_DEFS: SignatureStrokeDef[] = [
  // ── Word 1: Rocky ─────────────────────────────────────────────
  {
    id: 'rocky-R-loop',
    word: 'rocky',
    pathD: 'M 65 190 C 75 140, 115 75, 160 70 C 190 66, 215 88, 205 125 C 195 160, 155 190, 130 195 C 115 198, 105 185, 110 160 L 140 75',
    approxLength: 420,
    pauseAfter: 20,
  },
  {
    id: 'rocky-R-leg',
    word: 'rocky',
    pathD: 'M 152 142 C 172 145, 195 165, 205 195 C 210 208, 222 210, 235 195',
    approxLength: 120,
    pauseAfter: 15,
  },
  {
    id: 'rocky-o',
    word: 'rocky',
    pathD: 'M 235 195 C 248 175, 275 170, 285 190 C 292 205, 280 215, 265 215 C 250 215, 242 205, 252 192 C 262 180, 280 185, 298 195',
    approxLength: 175,
    pauseAfter: 12,
  },
  {
    id: 'rocky-c',
    word: 'rocky',
    pathD: 'M 312 188 C 305 182, 295 188, 298 200 C 302 212, 318 214, 332 204',
    approxLength: 85,
    pauseAfter: 12,
  },
  {
    id: 'rocky-k',
    word: 'rocky',
    pathD: 'M 332 204 C 345 185, 365 110, 375 105 C 382 102, 385 112, 375 145 L 360 212 M 365 188 C 380 182, 395 192, 390 205 C 388 210, 395 212, 405 204',
    approxLength: 320,
    pauseAfter: 15,
  },
  {
    id: 'rocky-y-underline',
    word: 'rocky',
    pathD: 'M 405 204 C 412 190, 424 186, 432 198 L 436 210 C 445 192, 458 188, 466 200 L 468 215 C 465 240, 450 290, 430 305 C 412 318, 395 305, 412 280 C 428 255, 470 220, 510 195',
    approxLength: 390,
    pauseAfter: 95, // Deliberate pen lift between words
  },

  // ── Word 2: Babcock ───────────────────────────────────────────
  {
    id: 'babcock-B',
    word: 'babcock',
    pathD: 'M 525 215 L 565 65 C 570 48, 555 52, 542 75 L 520 160 C 520 160, 545 125, 580 120 C 610 115, 625 135, 612 165 C 600 188, 570 195, 545 192 C 575 190, 620 188, 628 220 C 634 245, 610 262, 575 260 C 535 258, 510 240, 528 210',
    approxLength: 640,
    pauseAfter: 20,
  },
  {
    id: 'babcock-a',
    word: 'babcock',
    pathD: 'M 635 212 C 648 190, 672 188, 680 205 C 685 218, 675 228, 660 228 C 646 228, 640 216, 650 202 C 660 190, 678 195, 688 226',
    approxLength: 170,
    pauseAfter: 12,
  },
  {
    id: 'babcock-b',
    word: 'babcock',
    pathD: 'M 688 226 C 700 205, 725 115, 735 110 C 742 106, 745 118, 735 150 L 725 220 C 730 228, 745 226, 755 212',
    approxLength: 290,
    pauseAfter: 12,
  },
  {
    id: 'babcock-c1',
    word: 'babcock',
    pathD: 'M 770 200 C 762 194, 752 200, 756 214 C 760 225, 776 226, 790 216',
    approxLength: 85,
    pauseAfter: 12,
  },
  {
    id: 'babcock-o',
    word: 'babcock',
    pathD: 'M 802 206 C 812 192, 830 190, 836 205 C 840 216, 832 225, 820 225 C 808 225, 802 216, 810 204 C 818 194, 832 198, 846 208',
    approxLength: 165,
    pauseAfter: 12,
  },
  {
    id: 'babcock-c2',
    word: 'babcock',
    pathD: 'M 865 200 C 858 194, 848 200, 852 214 C 856 225, 872 226, 886 216',
    approxLength: 85,
    pauseAfter: 12,
  },
  {
    id: 'babcock-k-flourish',
    word: 'babcock',
    pathD: 'M 886 216 C 896 195, 915 125, 924 120 C 930 116, 932 125, 924 155 L 912 218 M 918 196 C 930 190, 942 198, 938 210 C 935 218, 946 218, 960 208 C 995 188, 1045 178, 1100 174',
    approxLength: 510,
    pauseAfter: 0,
  },
];

/**
 * Natural handwriting velocity easing curve
 * Accelerates organically, eases through loops, accelerates into the flourish, and settles.
 */
export function easeHandwriting(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  // Custom multi-stage bezier: gentle start, steady cadence, flourish burst, settling finish
  if (clamped < 0.25) {
    // Gentle entry
    return Math.pow(clamped / 0.25, 1.4) * 0.22;
  } else if (clamped < 0.75) {
    // Fluent rhythmic writing through Rocky and start of Babcock
    const midT = (clamped - 0.25) / 0.5;
    return 0.22 + midT * 0.52;
  } else {
    // Soaring flourish acceleration and final graceful deceleration
    const endT = (clamped - 0.75) / 0.25;
    const easedEnd = 1 - Math.pow(1 - endT, 2.2);
    return 0.74 + easedEnd * 0.26;
  }
}
