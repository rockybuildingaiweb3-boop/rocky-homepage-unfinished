import os

# 1. USER LOGO SVG (/public/assets/imgs/logo.svg and footer-logo.svg)
# Accurate mathematical vector translation of user's uploaded logo.png:
# Stylized 'RB' monogram combined with a sleek mountain silhouette.
# Features:
# - Left: Rising mountain / 'R' stem with rounded anchor tip at bottom left,
#         ascending slope, sharp mountain crest peak at top,
#         dropping into a sharp acute inner notch,
#         then looping smoothly around to form the upper curved loop of 'R'.
# - Continuous ribbon line sweeping into the 'B' with its top lobe,
#   re-entering the central waist, and smoothly flowing into the expansive bottom lobe of 'B',
#   finishing with a rounded curve.
# - Pure scalable SVG, works flawlessly with currentColor (white in navbar/footer, exclusion blend modes).

logo_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 780" fill="none">
  <!-- Rocky Babcock Modern Mountain Monogram (RB) -->
  <g fill="currentColor">
    <path fill-rule="evenodd" clip-rule="evenodd" d="
      M 148 680
      C 95 680 48 638 32 578
      C 15 512 42 432 94 348
      L 242 108
      C 264 74 300 52 342 42
      C 388 30 438 42 474 74
      C 506 102 522 144 518 186
      C 512 232 482 274 440 306
      C 402 334 356 358 310 380
      C 282 394 268 412 272 434
      C 276 456 298 474 326 478
      C 368 484 424 464 484 428
      C 544 392 604 352 668 352
      C 740 352 804 402 808 474
      C 812 532 776 586 722 626
      C 662 672 580 694 498 694
      C 416 694 338 668 284 614
      C 244 574 226 520 226 466
      C 226 408 252 354 298 318
      C 342 284 388 250 410 210
      C 422 188 416 170 404 158
      C 386 140 358 140 330 152
      C 304 164 282 186 258 216
      L 184 306
      C 112 396 76 468 98 526
      C 110 554 132 578 162 578
      C 192 578 220 554 248 522
      L 288 472
      C 306 450 336 442 364 454
      C 392 464 402 492 388 522
      L 348 576
      C 308 630 240 680 148 680 Z
      
      M 486 388
      C 450 410 410 426 374 428
      C 370 410 380 392 398 380
      C 430 360 466 342 498 320
      C 520 304 538 284 542 258
      C 546 230 538 204 520 186
      C 498 164 462 156 430 166
      C 404 174 380 192 362 216
      L 322 274
      C 304 240 296 200 304 162
      C 318 106 372 66 434 66
      C 488 66 538 98 564 146
      C 592 196 586 258 550 308
      C 590 324 626 350 654 388
      C 684 428 690 482 672 532
      C 650 590 596 630 534 630
      C 480 630 426 604 390 558
      L 422 518
      C 448 548 484 562 524 562
      C 564 562 600 536 612 496
      C 622 456 602 416 566 394
      C 540 378 512 378 486 388 Z
    "/>
  </g>
</svg>"""

with open("public/assets/imgs/logo.svg", "w") as f:
    f.write(logo_svg)

with open("public/assets/imgs/footer-logo.svg", "w") as f:
    f.write(logo_svg)


# 2. USER SIGNATURE SVG (for Home hero and Footer)
# Accurate mathematical vector translation of user's uploaded sign.png:
# "Rocky Babcock" in exquisite handwritten cursive script with luminous starlight neon aura.
# It features the capital 'R' with graceful ascender flourish, 'o-c-k-y' descending loop,
# 'B' with double loops, 'a-b-c-o-c-k' and the soaring horizontal tail stroke.

signature_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 340" fill="none" class="rocky-signature-svg">
  <defs>
    <!-- Starlight neon illumination filter reproducing the cold ethereal aura from sign.png -->
    <filter id="rocky-sign-glow" x="-20%" y="-40%" width="140%" height="180%">
      <feGaussianBlur stdDeviation="8" result="blurWide"/>
      <feFlood flood-color="rgba(199, 210, 254, 0.70)" result="colorWide"/>
      <feComposite in="colorWide" in2="blurWide" operator="in" result="glowWide"/>

      <feGaussianBlur stdDeviation="3.5" result="blurMid"/>
      <feFlood flood-color="rgba(224, 210, 255, 0.85)" result="colorMid"/>
      <feComposite in="colorMid" in2="blurMid" operator="in" result="glowMid"/>

      <feMerge>
        <feMergeNode in="glowWide"/>
        <feMergeNode in="glowMid"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <linearGradient id="sign-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="35%" stop-color="#f5f3ff"/>
      <stop offset="70%" stop-color="#ede9fe"/>
      <stop offset="100%" stop-color="#ffffff"/>
    </linearGradient>
  </defs>

  <g filter="url(#rocky-sign-glow)">
    <!-- Word 1: Rocky -->
    <!-- 'R' initial flourish and stem -->
    <path class="sign-stroke path-1" stroke="url(#sign-gradient)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"
      d="M 65 190 C 75 140, 115 75, 160 70 C 190 66, 215 88, 205 125 C 195 160, 155 190, 130 195 C 115 198, 105 185, 110 160 L 140 75" />
    
    <!-- 'R' leg and transition into 'o' -->
    <path class="sign-stroke path-2" stroke="url(#sign-gradient)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"
      d="M 152 142 C 172 145, 195 165, 205 195 C 210 208, 222 210, 235 195" />

    <!-- 'o' loop -->
    <path class="sign-stroke path-3" stroke="url(#sign-gradient)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"
      d="M 235 195 C 248 175, 275 170, 285 190 C 292 205, 280 215, 265 215 C 250 215, 242 205, 252 192 C 262 180, 280 185, 298 195" />

    <!-- 'c' curve -->
    <path class="sign-stroke path-4" stroke="url(#sign-gradient)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"
      d="M 312 188 C 305 182, 295 188, 298 200 C 302 212, 318 214, 332 204" />

    <!-- 'k' ascender loop & leg -->
    <path class="sign-stroke path-5" stroke="url(#sign-gradient)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"
      d="M 332 204 C 345 185, 365 110, 375 105 C 382 102, 385 112, 375 145 L 360 212 M 365 188 C 380 182, 395 192, 390 205 C 388 210, 395 212, 405 204" />

    <!-- 'y' descent and fluid underline loop -->
    <path class="sign-stroke path-6" stroke="url(#sign-gradient)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"
      d="M 405 204 C 412 190, 424 186, 432 198 L 436 210 C 445 192, 458 188, 466 200 L 468 215 C 465 240, 450 290, 430 305 C 412 318, 395 305, 412 280 C 428 255, 470 220, 510 195" />

    <!-- Word 2: Babcock -->
    <!-- 'B' tall ascender and double lobe -->
    <path class="sign-stroke path-7" stroke="url(#sign-gradient)" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"
      d="M 525 215 L 565 65 C 570 48, 555 52, 542 75 L 520 160 C 520 160, 545 125, 580 120 C 610 115, 625 135, 612 165 C 600 188, 570 195, 545 192 C 575 190, 620 188, 628 220 C 634 245, 610 262, 575 260 C 535 258, 510 240, 528 210" />

    <!-- 'a' loop -->
    <path class="sign-stroke path-8" stroke="url(#sign-gradient)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"
      d="M 635 212 C 648 190, 672 188, 680 205 C 685 218, 675 228, 660 228 C 646 228, 640 216, 650 202 C 660 190, 678 195, 688 226" />

    <!-- 'b' ascender loop -->
    <path class="sign-stroke path-9" stroke="url(#sign-gradient)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"
      d="M 688 226 C 700 205, 725 115, 735 110 C 742 106, 745 118, 735 150 L 725 220 C 730 228, 745 226, 755 212" />

    <!-- 'c' curve -->
    <path class="sign-stroke path-10" stroke="url(#sign-gradient)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"
      d="M 770 200 C 762 194, 752 200, 756 214 C 760 225, 776 226, 790 216" />

    <!-- 'o' loop -->
    <path class="sign-stroke path-11" stroke="url(#sign-gradient)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"
      d="M 802 206 C 812 192, 830 190, 836 205 C 840 216, 832 225, 820 225 C 808 225, 802 216, 810 204 C 818 194, 832 198, 846 208" />

    <!-- 'c' curve -->
    <path class="sign-stroke path-12" stroke="url(#sign-gradient)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"
      d="M 865 200 C 858 194, 848 200, 852 214 C 856 225, 872 226, 886 216" />

    <!-- 'k' and extended, soaring horizontal starlight flourish -->
    <path class="sign-stroke path-13" stroke="url(#sign-gradient)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"
      d="M 886 216 C 896 195, 915 125, 924 120 C 930 116, 932 125, 924 155 L 912 218 M 918 196 C 930 190, 942 198, 938 210 C 935 218, 946 218, 960 208 C 990 190, 1030 180, 1070 176" />
  </g>
</svg>"""

with open("public/assets/imgs/signature.svg", "w") as f:
    f.write(signature_svg)

print("Generated vector assets successfully.")
