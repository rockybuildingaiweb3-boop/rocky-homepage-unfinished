import os

# Create the full luxury 3D Gold RB Emblem SVG
# Exactly replicating the user's uploaded image:
# - Monogram: 3D embossed gold intertwined 'R' and 'B'/'3' ribbon
# - Text: "ROCKY BABCOCK" in high-contrast golden serif capitals with letter-spacing
# - Fine divider bar: Thin horizontal gold rule with centered faceted diamond (◆)
# - Gradients and Filters: Multi-stop metallic gold linear gradients, specular lighting, bevel drop-shadows

gold_logo_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 860" fill="none">
  <defs>
    <!-- Base 24k Gold Gradients -->
    <linearGradient id="gold-bevel-light" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff8db"/>
      <stop offset="25%" stop-color="#ffd778"/>
      <stop offset="50%" stop-color="#f5be41"/>
      <stop offset="75%" stop-color="#cf9426"/>
      <stop offset="100%" stop-color="#99630e"/>
    </linearGradient>

    <linearGradient id="gold-surface" x1="30%" y1="0%" x2="70%" y2="100%">
      <stop offset="0%" stop-color="#fff2c2"/>
      <stop offset="20%" stop-color="#fed776"/>
      <stop offset="45%" stop-color="#e6b141"/>
      <stop offset="70%" stop-color="#f8c95a"/>
      <stop offset="85%" stop-color="#b87d1e"/>
      <stop offset="100%" stop-color="#694008"/>
    </linearGradient>

    <linearGradient id="gold-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#3d2204"/>
      <stop offset="50%" stop-color="#1f1102"/>
      <stop offset="100%" stop-color="#0a0500"/>
    </linearGradient>

    <linearGradient id="gold-highlight" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#c98e20"/>
      <stop offset="40%" stop-color="#ffea9f"/>
      <stop offset="60%" stop-color="#ffffff"/>
      <stop offset="80%" stop-color="#fed672"/>
      <stop offset="100%" stop-color="#9a6510"/>
    </linearGradient>

    <!-- 3D Extrusion Drop Shadows -->
    <filter id="gold-3d-shadow" x="-15%" y="-15%" width="130%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="14" flood-color="rgba(0, 0, 0, 0.95)"/>
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="rgba(20, 10, 0, 0.85)"/>
      <feDropShadow dx="0" dy="0" stdDeviation="22" flood-color="rgba(245, 190, 65, 0.35)"/>
    </filter>

    <filter id="gold-text-glow" x="-10%" y="-20%" width="120%" height="150%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="rgba(0, 0, 0, 0.9)"/>
      <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="rgba(245, 190, 65, 0.4)"/>
    </filter>
  </defs>

  <g filter="url(#gold-3d-shadow)">
    <!-- 1. UNDERLAYER EXTRUSION (Beveled depth and side walls) -->
    <!-- R Stem & Base Extrusion -->
    <g fill="url(#gold-shadow)">
      <!-- Extruded rim offset downwards by 12px -->
      <path d="
        M 270 178 L 270 190 L 515 190 C 530 190 535 180 535 180 L 535 168 Z
        M 215 540 L 215 552 L 440 552 L 440 540 Z
        M 350 178 L 350 540 L 366 540 L 366 178 Z
      "/>
      <!-- Loop lower extrusion -->
      <path d="
        M 380 435 C 440 455, 520 500, 610 575 C 690 642, 755 605, 775 525 C 790 460, 750 395, 680 375 L 680 390 C 740 408, 775 460, 760 515 C 742 585, 685 622, 610 560 C 525 488, 448 445, 380 425 Z
      "/>
    </g>

    <!-- 2. MAIN 3D EMBOSSED MONOGRAM BODY -->
    <!-- Stylized R with bold serif and swooping intertwined ribbon arch into B -->
    <!-- Left Serif and Stem of 'R' -->
    <path fill="url(#gold-bevel-light)" stroke="url(#gold-highlight)" stroke-width="2.5" stroke-linejoin="round" d="
      M 275 165
      L 510 165
      C 525 165 538 178 535 192
      C 530 215 510 230 485 230
      L 380 230
      L 380 360
      C 420 345 470 335 520 335
      C 605 335 675 370 675 440
      C 675 520 595 565 500 565
      C 455 565 412 552 380 535
      L 380 540
      L 440 540
      L 440 555
      L 220 555
      L 220 540
      L 275 540
      L 275 180
      L 220 180
      L 220 165
      Z
    "/>

    <!-- The Fluid Ribbon: Curves out of R, loops forward into B -->
    <path fill="url(#gold-surface)" stroke="url(#gold-highlight)" stroke-width="2" stroke-linejoin="round" d="
      M 315 425
      C 355 375 420 325 505 320
      C 595 315 675 345 720 395
      C 760 440 770 505 745 560
      C 715 625 645 660 560 655
      C 475 650 405 605 350 545
      C 340 535 348 522 360 528
      C 410 580 472 620 550 625
      C 620 630 678 600 705 548
      C 726 505 718 455 684 418
      C 648 378 585 352 510 355
      C 438 358 378 402 335 445
      Z
    "/>

    <!-- Upper B Hook with beveled inner arch -->
    <path fill="url(#gold-bevel-light)" stroke="url(#gold-highlight)" stroke-width="2" stroke-linejoin="round" d="
      M 540 235
      C 565 235 635 240 680 280
      C 720 315 732 355 725 385
      L 685 380
      C 690 358 680 332 652 308
      C 620 280 568 275 540 275
      L 540 235 Z
    "/>

    <!-- Inner Core Cutouts and Recesses -->
    <path fill="url(#gold-shadow)" opacity="0.3" d="
      M 380 230 L 485 230 C 505 230 518 218 520 202 C 522 188 512 178 495 178 L 380 178 Z
    "/>

    <!-- Specular Bevel Highlights (glints of pure white light across top ridges) -->
    <path fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.85" d="
      M 280 167 L 505 167
      M 382 180 L 382 360
      M 508 322 C 585 318 660 345 705 390
      M 565 624 C 640 626 695 595 720 545
    "/>

    <!-- Diamond glint star on the top-left serif curve -->
    <g transform="translate(315, 320) scale(0.7)">
      <path fill="#ffffff" filter="drop-shadow(0 0 6px #fff8db)" d="M 0 -20 Q 0 0 20 0 Q 0 0 0 20 Q 0 0 -20 0 Q 0 0 0 -20 Z"/>
    </g>
  </g>

  <!-- 3. BRAND NAME: "ROCKY BABCOCK" -->
  <g filter="url(#gold-text-glow)">
    <text x="500" y="740" text-anchor="middle"
      font-family="'Cinzel', 'Playfair Display', 'Times New Roman', serif"
      font-size="64"
      font-weight="700"
      letter-spacing="0.22em"
      fill="url(#gold-surface)"
      stroke="url(#gold-bevel-light)"
      stroke-width="1.2">
      ROCKY BABCOCK
    </text>

    <!-- Top highlight on text -->
    <text x="500" y="739" text-anchor="middle"
      font-family="'Cinzel', 'Playfair Display', 'Times New Roman', serif"
      font-size="64"
      font-weight="700"
      letter-spacing="0.22em"
      fill="none"
      stroke="#ffffff"
      stroke-width="0.6"
      opacity="0.6">
      ROCKY BABCOCK
    </text>
  </g>

  <!-- 4. EMBOSSED GOLD DIVIDER BAR WITH CENTERED DIAMOND -->
  <g filter="url(#gold-text-glow)" transform="translate(0, 785)">
    <!-- Left bar -->
    <line x1="240" y1="0" x2="465" y2="0" stroke="url(#gold-bevel-light)" stroke-width="3" stroke-linecap="round"/>
    <line x1="240" y1="-1" x2="465" y2="-1" stroke="#ffffff" stroke-width="1" opacity="0.65"/>
    <line x1="240" y1="2" x2="465" y2="2" stroke="url(#gold-shadow)" stroke-width="1.5" opacity="0.8"/>

    <!-- Centered Faceted Diamond Accent (◆) -->
    <g transform="translate(500, 0)">
      <!-- Diamond Drop Shadow -->
      <path d="M 0 -13 L 13 0 L 0 13 L -13 0 Z" fill="url(#gold-shadow)" transform="translate(0, 3)"/>
      <!-- Faceted Diamond Facets -->
      <!-- Top Left Facet -->
      <polygon points="0,-13 0,0 -13,0" fill="#fff5d0"/>
      <!-- Top Right Facet (Bright Specular) -->
      <polygon points="0,-13 13,0 0,0" fill="#ffffff"/>
      <!-- Bottom Left Facet (Deep Gold) -->
      <polygon points="-13,0 0,0 0,13" fill="#cf9426"/>
      <!-- Bottom Right Facet (Rich Gold) -->
      <polygon points="0,0 13,0 0,13" fill="#ffd778"/>
      <!-- Outer Rim -->
      <polygon points="0,-13 13,0 0,13 -13,0" fill="none" stroke="url(#gold-bevel-light)" stroke-width="1.2"/>
    </g>

    <!-- Right bar -->
    <line x1="535" y1="0" x2="760" y2="0" stroke="url(#gold-bevel-light)" stroke-width="3" stroke-linecap="round"/>
    <line x1="535" y1="-1" x2="760" y2="-1" stroke="#ffffff" stroke-width="1" opacity="0.65"/>
    <line x1="535" y1="2" x2="760" y2="2" stroke="url(#gold-shadow)" stroke-width="1.5" opacity="0.8"/>
  </g>
</svg>"""

with open("public/assets/imgs/logo-gold.svg", "w") as f:
    f.write(gold_logo_svg)

# Also create the pure monogram mark version (without text) for compact spaces like Navbar:
compact_gold_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 700" fill="none">
  <defs>
    <linearGradient id="c-gold-bevel-light" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff8db"/>
      <stop offset="25%" stop-color="#ffd778"/>
      <stop offset="50%" stop-color="#f5be41"/>
      <stop offset="75%" stop-color="#cf9426"/>
      <stop offset="100%" stop-color="#99630e"/>
    </linearGradient>

    <linearGradient id="c-gold-surface" x1="30%" y1="0%" x2="70%" y2="100%">
      <stop offset="0%" stop-color="#fff2c2"/>
      <stop offset="20%" stop-color="#fed776"/>
      <stop offset="45%" stop-color="#e6b141"/>
      <stop offset="70%" stop-color="#f8c95a"/>
      <stop offset="85%" stop-color="#b87d1e"/>
      <stop offset="100%" stop-color="#694008"/>
    </linearGradient>

    <linearGradient id="c-gold-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#3d2204"/>
      <stop offset="50%" stop-color="#1f1102"/>
      <stop offset="100%" stop-color="#0a0500"/>
    </linearGradient>

    <linearGradient id="c-gold-highlight" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#c98e20"/>
      <stop offset="40%" stop-color="#ffea9f"/>
      <stop offset="60%" stop-color="#ffffff"/>
      <stop offset="80%" stop-color="#fed672"/>
      <stop offset="100%" stop-color="#9a6510"/>
    </linearGradient>

    <filter id="c-gold-glow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="rgba(0, 0, 0, 0.95)"/>
      <feDropShadow dx="0" dy="0" stdDeviation="16" flood-color="rgba(245, 190, 65, 0.45)"/>
    </filter>
  </defs>

  <g filter="url(#c-gold-glow)" transform="translate(50, -10)">
    <!-- R Stem & Base Extrusion -->
    <g fill="url(#c-gold-shadow)">
      <path d="M 270 178 L 270 190 L 515 190 C 530 190 535 180 535 180 L 535 168 Z M 215 540 L 215 552 L 440 552 L 440 540 Z M 350 178 L 350 540 L 366 540 L 366 178 Z"/>
      <path d="M 380 435 C 440 455, 520 500, 610 575 C 690 642, 755 605, 775 525 C 790 460, 750 395, 680 375 L 680 390 C 740 408, 775 460, 760 515 C 742 585, 685 622, 610 560 C 525 488, 448 445, 380 425 Z"/>
    </g>

    <!-- Main 3D Monogram Mark -->
    <path fill="url(#c-gold-bevel-light)" stroke="url(#c-gold-highlight)" stroke-width="2.5" stroke-linejoin="round" d="
      M 275 165
      L 510 165
      C 525 165 538 178 535 192
      C 530 215 510 230 485 230
      L 380 230
      L 380 360
      C 420 345 470 335 520 335
      C 605 335 675 370 675 440
      C 675 520 595 565 500 565
      C 455 565 412 552 380 535
      L 380 540
      L 440 540
      L 440 555
      L 220 555
      L 220 540
      L 275 540
      L 275 180
      L 220 180
      L 220 165
      Z
    "/>

    <path fill="url(#c-gold-surface)" stroke="url(#c-gold-highlight)" stroke-width="2" stroke-linejoin="round" d="
      M 315 425
      C 355 375 420 325 505 320
      C 595 315 675 345 720 395
      C 760 440 770 505 745 560
      C 715 625 645 660 560 655
      C 475 650 405 605 350 545
      C 340 535 348 522 360 528
      C 410 580 472 620 550 625
      C 620 630 678 600 705 548
      C 726 505 718 455 684 418
      C 648 378 585 352 510 355
      C 438 358 378 402 335 445
      Z
    "/>

    <path fill="url(#c-gold-bevel-light)" stroke="url(#c-gold-highlight)" stroke-width="2" stroke-linejoin="round" d="
      M 540 235
      C 565 235 635 240 680 280
      C 720 315 732 355 725 385
      L 685 380
      C 690 358 680 332 652 308
      C 620 280 568 275 540 275
      L 540 235 Z
    "/>

    <!-- Specular highlight lines -->
    <path fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.9" d="
      M 280 167 L 505 167
      M 382 180 L 382 360
      M 508 322 C 585 318 660 345 705 390
      M 565 624 C 640 626 695 595 720 545
    "/>

    <!-- Sparkle on top corner -->
    <g transform="translate(315, 320) scale(0.7)">
      <path fill="#ffffff" filter="drop-shadow(0 0 6px #fff8db)" d="M 0 -20 Q 0 0 20 0 Q 0 0 0 20 Q 0 0 -20 0 Q 0 0 0 -20 Z"/>
    </g>
  </g>
</svg>"""

with open("public/assets/imgs/logo-gold-mark.svg", "w") as f:
    f.write(compact_gold_svg)

# Also update logo.svg and footer-logo.svg to use this high-contrast, brilliant 3D gold emblem:
with open("public/assets/imgs/logo.svg", "w") as f:
    f.write(compact_gold_svg)

with open("public/assets/imgs/footer-logo.svg", "w") as f:
    f.write(gold_logo_svg)

print("Generated all luxury gold logo assets successfully!")
