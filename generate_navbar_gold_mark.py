# Generate an ultra-distinctive, crisp 3D gold mark for the Navbar
# - Fits perfectly within the navbar box
# - Has dark occlusion backdrop + radiant 24k gold beveling + glints
# - Clearly visible even against bright skies or dark sections

mark_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 680" fill="none">
  <defs>
    <linearGradient id="nb-gold-face" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#fffbeb"/>
      <stop offset="15%" stop-color="#fef08a"/>
      <stop offset="35%" stop-color="#facc15"/>
      <stop offset="60%" stop-color="#eab308"/>
      <stop offset="85%" stop-color="#ca8a04"/>
      <stop offset="100%" stop-color="#854d0e"/>
    </linearGradient>

    <linearGradient id="nb-gold-rim" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="40%" stop-color="#fef9c3"/>
      <stop offset="70%" stop-color="#eab308"/>
      <stop offset="100%" stop-color="#713f12"/>
    </linearGradient>

    <linearGradient id="nb-gold-dark" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#78350f"/>
      <stop offset="100%" stop-color="#1c0a00"/>
    </linearGradient>

    <filter id="nb-glow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="rgba(0, 0, 0, 0.95)"/>
      <feDropShadow dx="0" dy="0" stdDeviation="16" flood-color="rgba(250, 204, 21, 0.55)"/>
      <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="rgba(255, 255, 255, 0.75)"/>
    </filter>
  </defs>

  <!-- Ambient shadow halo ensuring visibility on light backgrounds -->
  <ellipse cx="400" cy="340" rx="360" ry="280" fill="rgba(12, 10, 16, 0.70)" filter="blur(28px)"/>

  <g filter="url(#nb-glow)" transform="translate(-140, -100)">
    <!-- Extruded side walls -->
    <g fill="url(#nb-gold-dark)">
      <path d="M 330 195 L 330 215 L 615 215 C 635 215 645 205 645 195 Z
               M 260 645 L 260 665 L 530 665 L 530 645 Z
               M 425 215 L 425 645 L 445 645 L 445 215 Z"/>
      <path d="M 460 520 C 530 545, 625 598, 735 688 C 830 768, 910 725, 932 630 C 950 550, 902 475, 818 450 L 818 470 C 890 492, 932 555, 914 620 C 892 705, 825 748, 735 672 C 632 588, 542 535, 460 508 Z"/>
    </g>

    <!-- Main 'R' Body -->
    <path fill="url(#nb-gold-face)" stroke="url(#nb-gold-rim)" stroke-width="3" stroke-linejoin="round" d="
      M 335 180 L 615 180 C 635 180 650 195 648 212 C 642 240 618 258 588 258 L 462 258 L 462 415 C 510 396 570 384 630 384 C 732 384 816 426 816 510 C 816 606 720 660 606 660 C 552 660 500 644 462 624 L 462 630 L 534 630 L 534 648 L 270 648 L 270 630 L 335 630 L 335 198 L 270 198 L 270 180 Z
    "/>

    <!-- Intertwined ribbon into B -->
    <path fill="url(#nb-gold-face)" stroke="url(#nb-gold-rim)" stroke-width="2.5" stroke-linejoin="round" d="
      M 384 495 C 432 435 510 375 612 368 C 720 362 816 398 870 458 C 918 512 930 590 900 656 C 864 735 780 776 678 770 C 576 764 492 710 426 638 C 414 626 424 610 438 618 C 498 680 572 728 666 734 C 750 740 820 704 852 642 C 877 590 868 530 827 485 C 784 437 708 406 618 410 C 532 414 460 466 408 518 Z
    "/>

    <!-- Upper B hook -->
    <path fill="url(#nb-gold-face)" stroke="url(#nb-gold-rim)" stroke-width="2.5" stroke-linejoin="round" d="
      M 654 264 C 684 264 768 270 822 318 C 870 360 884 408 876 444 L 828 438 C 834 412 822 380 788 352 C 750 318 688 312 654 312 L 654 264 Z
    "/>

    <!-- Specular rim highlights -->
    <path fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.9" d="
      M 342 182 L 610 182
      M 464 198 L 464 415
      M 616 370 C 708 365 798 398 852 452
      M 678 732 C 768 735 834 698 864 638
    "/>

    <!-- Star glint -->
    <g transform="translate(385, 370) scale(0.9)">
      <path fill="#ffffff" filter="drop-shadow(0 0 10px #ffffff) drop-shadow(0 0 20px #fde047)" d="M 0 -24 Q 0 0 24 0 Q 0 0 0 24 Q 0 0 -24 0 Q 0 0 0 -24 Z"/>
    </g>
  </g>
</svg>"""

with open("public/assets/imgs/logo-gold-mark.svg", "w") as f:
    f.write(mark_svg)

print("Generated navbar mark successfully!")
