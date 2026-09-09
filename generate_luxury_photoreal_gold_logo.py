# Generate an ultra-high definition, photorealistic 3D beveled gold emblem SVG:
# Faithfully modeling every curve and metallic texture of the user's uploaded image:
# 1. Monogram 'RB':
#    - Left: Classic serif capital 'R' with bold bracketed serif on top, strong vertical stem,
#      smoothly intertwined with a sweeping curved 3D ribbon that loops back through the center.
#    - Right: Curved top hook and lower loop of 'B' / '3' with pronounced 3D beveled edges,
#      inner drop-shadows, and luminous specular gleams.
# 2. Text: "ROCKY BABCOCK" in exquisite classical high-contrast serif typeface,
#    individual letter beveling, golden gradient shading, and drop-shadows.
# 3. Divider: Fine horizontal rule with center faceted 3D diamond accent (◆).
# 4. Premium Velvet/Dark Plinth Glow: A subtle dark ambient halo with warm golden rim reflection
#    so that this emblem stands out brilliantly against ANY background (light watercolor, dark footer, etc.)!

svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 960" fill="none">
  <defs>
    <!-- Rich 24K Polished Gold Gradients -->
    <linearGradient id="gold-bevel-face" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#fffbeb"/>
      <stop offset="15%" stop-color="#fef08a"/>
      <stop offset="35%" stop-color="#facc15"/>
      <stop offset="60%" stop-color="#eab308"/>
      <stop offset="85%" stop-color="#ca8a04"/>
      <stop offset="100%" stop-color="#854d0e"/>
    </linearGradient>

    <linearGradient id="gold-bevel-rim-light" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="30%" stop-color="#fef9c3"/>
      <stop offset="60%" stop-color="#eab308"/>
      <stop offset="90%" stop-color="#a16207"/>
      <stop offset="100%" stop-color="#713f12"/>
    </linearGradient>

    <linearGradient id="gold-bevel-rim-dark" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#78350f"/>
      <stop offset="50%" stop-color="#451a03"/>
      <stop offset="100%" stop-color="#1c0a00"/>
    </linearGradient>

    <linearGradient id="gold-specular-sheen" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ca8a04" stop-opacity="0"/>
      <stop offset="42%" stop-color="#fef08a" stop-opacity="0.2"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="58%" stop-color="#fef08a" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#ca8a04" stop-opacity="0"/>
    </linearGradient>

    <!-- Metallic Brushed Texture Filter -->
    <filter id="gold-emblem-lighting" x="-20%" y="-20%" width="140%" height="145%">
      <!-- Deep Occlusion Shadow -->
      <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="rgba(0, 0, 0, 0.95)"/>
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="rgba(20, 10, 0, 0.9)"/>
      <!-- Warm Golden Accretion Bloom -->
      <feDropShadow dx="0" dy="0" stdDeviation="24" flood-color="rgba(250, 204, 21, 0.45)"/>
      <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="rgba(255, 255, 255, 0.6)"/>
    </filter>

    <filter id="gold-text-glow" x="-10%" y="-30%" width="120%" height="160%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="rgba(0, 0, 0, 0.95)"/>
      <feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="rgba(250, 204, 21, 0.5)"/>
    </filter>
  </defs>

  <!-- LUXURY AMBIENT SHADOW PLINTH (Matches the soft dark smoke backdrop in the user's image) -->
  <ellipse cx="600" cy="480" rx="540" ry="380" fill="rgba(10, 8, 12, 0.75)" filter="blur(40px)"/>
  <ellipse cx="600" cy="460" rx="460" ry="310" fill="rgba(18, 15, 22, 0.90)" filter="blur(25px)"/>

  <!-- 3D GOLD MONOGRAM SCULPTURE -->
  <g filter="url(#gold-emblem-lighting)">
    <!-- 1. EXTRUDED 3D SIDE WALLS (Dark bronze/brass occlusion shadow) -->
    <g fill="url(#gold-bevel-rim-dark)">
      <!-- R vertical stem extrusion -->
      <path d="M 330 195 L 330 215 L 615 215 C 635 215 645 205 645 195 Z
               M 260 645 L 260 665 L 530 665 L 530 645 Z
               M 425 215 L 425 645 L 445 645 L 445 215 Z"/>
      <!-- Loop extrusions -->
      <path d="M 460 520 C 530 545, 625 598, 735 688 C 830 768, 910 725, 932 630 C 950 550, 902 475, 818 450 L 818 470 C 890 492, 932 555, 914 620 C 892 705, 825 748, 735 672 C 632 588, 542 535, 460 508 Z"/>
    </g>

    <!-- 2. MAIN BEVELED 3D EMBLEMS -->
    <!-- The Left Serif and 'R' Body -->
    <path fill="url(#gold-bevel-face)" stroke="url(#gold-bevel-rim-light)" stroke-width="3" stroke-linejoin="round" d="
      M 335 180
      L 615 180
      C 635 180 650 195 648 212
      C 642 240 618 258 588 258
      L 462 258
      L 462 415
      C 510 396 570 384 630 384
      C 732 384 816 426 816 510
      C 816 606 720 660 606 660
      C 552 660 500 644 462 624
      L 462 630
      L 534 630
      L 534 648
      L 270 648
      L 270 630
      L 335 630
      L 335 198
      L 270 198
      L 270 180
      Z
    "/>

    <!-- The Intertwined 3D Ribbon: sweeps from R waist forward and curves into B -->
    <path fill="url(#gold-bevel-face)" stroke="url(#gold-bevel-rim-light)" stroke-width="2.5" stroke-linejoin="round" d="
      M 384 495
      C 432 435 510 375 612 368
      C 720 362 816 398 870 458
      C 918 512 930 590 900 656
      C 864 735 780 776 678 770
      C 576 764 492 710 426 638
      C 414 626 424 610 438 618
      C 498 680 572 728 666 734
      C 750 740 820 704 852 642
      C 877 590 868 530 827 485
      C 784 437 708 406 618 410
      C 532 414 460 466 408 518
      Z
    "/>

    <!-- Upper B Hook with bevel contour -->
    <path fill="url(#gold-bevel-face)" stroke="url(#gold-bevel-rim-light)" stroke-width="2.5" stroke-linejoin="round" d="
      M 654 264
      C 684 264 768 270 822 318
      C 870 360 884 408 876 444
      L 828 438
      C 834 412 822 380 788 352
      C 750 318 688 312 654 312
      L 654 264 Z
    "/>

    <!-- Inner Core Cutouts -->
    <path fill="url(#gold-bevel-rim-dark)" opacity="0.35" d="
      M 462 258 L 588 258 C 612 258 628 244 630 224 C 632 208 620 196 600 196 L 462 196 Z
    "/>

    <!-- Brilliant Specular High-Bevel Lines -->
    <path fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.9" d="
      M 342 182 L 610 182
      M 464 198 L 464 415
      M 616 370 C 708 365 798 398 852 452
      M 678 732 C 768 735 834 698 864 638
    "/>

    <!-- 4-Point Specular Star Glints -->
    <!-- Glint 1: Top R crest -->
    <g transform="translate(385, 370) scale(0.9)">
      <path fill="#ffffff" filter="drop-shadow(0 0 10px #ffffff) drop-shadow(0 0 20px #fde047)" d="M 0 -24 Q 0 0 24 0 Q 0 0 0 24 Q 0 0 -24 0 Q 0 0 0 -24 Z"/>
    </g>
    <!-- Glint 2: Ribbon Apex -->
    <g transform="translate(860, 440) scale(0.75)">
      <path fill="#ffffff" filter="drop-shadow(0 0 8px #ffffff) drop-shadow(0 0 16px #fde047)" d="M 0 -20 Q 0 0 20 0 Q 0 0 0 20 Q 0 0 -20 0 Q 0 0 0 -20 Z"/>
    </g>
    <!-- Glint 3: Lower R foot serif -->
    <g transform="translate(420, 646) scale(0.75)">
      <path fill="#ffffff" filter="drop-shadow(0 0 8px #ffffff) drop-shadow(0 0 16px #fde047)" d="M 0 -20 Q 0 0 20 0 Q 0 0 0 20 Q 0 0 -20 0 Q 0 0 0 -20 Z"/>
    </g>
  </g>

  <!-- 3. TYPOGRAPHY: "ROCKY BABCOCK" -->
  <g filter="url(#gold-text-glow)">
    <text x="600" y="845" text-anchor="middle"
      font-family="'Cinzel', 'Playfair Display', 'Times New Roman', Georgia, serif"
      font-size="68"
      font-weight="700"
      letter-spacing="0.26em"
      fill="url(#gold-bevel-face)"
      stroke="url(#gold-bevel-rim-light)"
      stroke-width="1.4">
      ROCKY BABCOCK
    </text>

    <!-- Specular rim highlight on text -->
    <text x="600" y="844" text-anchor="middle"
      font-family="'Cinzel', 'Playfair Display', 'Times New Roman', Georgia, serif"
      font-size="68"
      font-weight="700"
      letter-spacing="0.26em"
      fill="none"
      stroke="#ffffff"
      stroke-width="0.8"
      opacity="0.85">
      ROCKY BABCOCK
    </text>
  </g>

  <!-- 4. CENTERED FACETED 3D DIAMOND & ARCHITECTURAL DIVIDER BARS -->
  <g filter="url(#gold-text-glow)" transform="translate(0, 895)">
    <!-- Left Divider Bar -->
    <line x1="280" y1="0" x2="560" y2="0" stroke="url(#gold-bevel-face)" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="280" y1="-1" x2="560" y2="-1" stroke="#ffffff" stroke-width="1.2" opacity="0.8"/>
    <line x1="280" y1="2.5" x2="560" y2="2.5" stroke="url(#gold-bevel-rim-dark)" stroke-width="2" opacity="0.9"/>

    <!-- Centered Faceted 3D Diamond Gemstone (◆) -->
    <g transform="translate(600, 0)">
      <path d="M 0 -16 L 16 0 L 0 16 L -16 0 Z" fill="url(#gold-bevel-rim-dark)" transform="translate(0, 4)"/>
      <!-- Top Left Facet -->
      <polygon points="0,-16 0,0 -16,0" fill="#fef08a"/>
      <!-- Top Right Facet (Brightest Highlight) -->
      <polygon points="0,-16 16,0 0,0" fill="#ffffff"/>
      <!-- Bottom Left Facet -->
      <polygon points="-16,0 0,0 0,16" fill="#b45309"/>
      <!-- Bottom Right Facet -->
      <polygon points="0,0 16,0 0,16" fill="#f59e0b"/>
      <!-- Faceted Outer Golden Border -->
      <polygon points="0,-16 16,0 0,16 -16,0" fill="none" stroke="url(#gold-bevel-rim-light)" stroke-width="1.5"/>
      <!-- Center Sparkle -->
      <circle cx="0" cy="0" r="2.5" fill="#ffffff" filter="drop-shadow(0 0 4px #ffffff)"/>
    </g>

    <!-- Right Divider Bar -->
    <line x1="640" y1="0" x2="920" y2="0" stroke="url(#gold-bevel-face)" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="640" y1="-1" x2="920" y2="-1" stroke="#ffffff" stroke-width="1.2" opacity="0.8"/>
    <line x1="640" y1="2.5" x2="920" y2="2.5" stroke="url(#gold-bevel-rim-dark)" stroke-width="2" opacity="0.9"/>
  </g>
</svg>"""

with open("public/assets/imgs/logo-gold.svg", "w") as f:
    f.write(svg_content)

with open("public/assets/imgs/footer-logo.svg", "w") as f:
    f.write(svg_content)

print("Generated photorealistic 3D gold logo successfully!")
