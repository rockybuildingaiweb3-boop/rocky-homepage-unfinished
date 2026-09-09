# Generate complete Footer logo including the RB Cyber Mark + "ROCKY BABCOCK" matching brand typography

svg_footer = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 680" fill="none" class="rb-footer-emblem">
  <defs>
    <!-- Multi-stop Cyberpunk / Speed Gradient -->
    <linearGradient id="rb-full-gradient" x1="0%" y1="0%" x2="100%" y2="80%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="12%" stop-color="#0284c7"/>
      <stop offset="28%" stop-color="#2563eb"/>
      <stop offset="44%" stop-color="#4f46e5"/>
      <stop offset="58%" stop-color="#7c3aed"/>
      <stop offset="72%" stop-color="#9333ea"/>
      <stop offset="85%" stop-color="#c026d3"/>
      <stop offset="94%" stop-color="#e11d48"/>
      <stop offset="100%" stop-color="#f43f5e"/>
    </linearGradient>

    <filter id="rb-vector-glow" x="-20%" y="-30%" width="145%" height="165%">
      <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="rgba(0, 0, 0, 0.95)"/>
      <feDropShadow dx="-8" dy="-2" stdDeviation="18" flood-color="rgba(56, 189, 248, 0.55)"/>
      <feDropShadow dx="10" dy="4" stdDeviation="20" flood-color="rgba(225, 29, 72, 0.55)"/>
      <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="rgba(255, 255, 255, 0.75)"/>
    </filter>

    <filter id="rb-text-glow" x="-10%" y="-30%" width="120%" height="160%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="rgba(0, 0, 0, 0.95)"/>
      <feDropShadow dx="0" dy="0" stdDeviation="12" flood-color="rgba(192, 132, 252, 0.5)"/>
    </filter>
  </defs>

  <!-- Ambient Dark Pill Backing -->
  <g opacity="0.45" filter="blur(22px)">
    <rect x="20" y="20" width="1060" height="640" rx="30" fill="#030014"/>
  </g>

  <!-- MAIN RB VECTOR EMBLEM -->
  <g filter="url(#rb-vector-glow)">
    <!-- LEFT COMPONENT: The Aerodynamic 'R' -->
    <path fill="url(#rb-full-gradient)" fill-rule="evenodd" clip-rule="evenodd" d="
      M 82 28
      L 204 98
      L 535 98
      C 572 98 620 120 620 178
      C 620 234 568 266 510 266
      L 452 266
      L 672 468
      L 542 468
      L 396 332
      L 296 256
      L 225 194
      L 152 322
      L 32 468
      L 228 194
      L 194 98
      L 82 28
      Z
      M 314 162
      L 502 162
      C 528 162 550 172 550 188
      C 550 204 528 214 502 214
      L 374 214
      L 314 162
      Z
    "/>

    <!-- CENTER SPEED BLADE / SLASH -->
    <path fill="url(#rb-full-gradient)" d="
      M 426 262
      L 824 140
      L 588 238
      L 550 292
      Z
    "/>

    <!-- RIGHT COMPONENT: The Speed 'B' / '3' -->
    <path fill="url(#rb-full-gradient)" fill-rule="evenodd" clip-rule="evenodd" d="
      M 658 98
      C 648 122 642 152 642 176
      L 654 176
      C 654 135 682 98 750 98
      L 904 98
      C 962 98 1020 124 1020 188
      C 1020 248 970 278 912 288
      C 982 302 1022 344 1022 406
      C 1022 478 948 488 880 488
      L 646 488
      L 574 424
      L 856 424
      C 912 424 946 406 946 374
      C 946 338 910 324 856 324
      L 712 324
      L 664 278
      L 846 278
      C 906 278 942 258 942 222
      C 942 190 908 174 852 174
      L 668 174
      C 664 150 660 124 658 98
      Z
    "/>
  </g>

  <!-- Sparkles -->
  <g transform="translate(85, 30) scale(0.65)">
    <path fill="#ffffff" filter="drop-shadow(0 0 6px #ffffff) drop-shadow(0 0 14px #38bdf8)" d="M 0 -18 Q 0 0 18 0 Q 0 0 0 18 Q 0 0 -18 0 Q 0 0 0 -18 Z"/>
  </g>
  <g transform="translate(820, 140) scale(0.55)">
    <path fill="#ffffff" filter="drop-shadow(0 0 6px #ffffff) drop-shadow(0 0 12px #c084fc)" d="M 0 -16 Q 0 0 16 0 Q 0 0 0 16 Q 0 0 -16 0 Q 0 0 0 -16 Z"/>
  </g>
  <g transform="translate(34, 466) scale(0.55)">
    <path fill="#ffffff" filter="drop-shadow(0 0 6px #ffffff) drop-shadow(0 0 12px #818cf8)" d="M 0 -16 Q 0 0 16 0 Q 0 0 0 16 Q 0 0 -16 0 Q 0 0 0 -16 Z"/>
  </g>
  <g transform="translate(1015, 410) scale(0.6)">
    <path fill="#ffffff" filter="drop-shadow(0 0 8px #ffffff) drop-shadow(0 0 16px #f43f5e)" d="M 0 -18 Q 0 0 18 0 Q 0 0 0 18 Q 0 0 -18 0 Q 0 0 0 -18 Z"/>
  </g>

  <!-- TYPOGRAPHY: ROCKY BABCOCK in high-contrast cyber speed styling -->
  <g filter="url(#rb-text-glow)">
    <text x="550" y="585" text-anchor="middle"
      font-family="'Cinzel', 'Playfair Display', system-ui, -apple-system, sans-serif"
      font-size="52"
      font-weight="800"
      letter-spacing="0.28em"
      fill="url(#rb-full-gradient)">
      ROCKY BABCOCK
    </text>

    <!-- Crisp white rim -->
    <text x="550" y="585" text-anchor="middle"
      font-family="'Cinzel', 'Playfair Display', system-ui, -apple-system, sans-serif"
      font-size="52"
      font-weight="800"
      letter-spacing="0.28em"
      fill="none"
      stroke="#ffffff"
      stroke-width="0.75"
      opacity="0.85">
      ROCKY BABCOCK
    </text>
  </g>

  <!-- FACETED SPEED DIVIDERS -->
  <g filter="url(#rb-text-glow)" transform="translate(0, 626)">
    <line x1="220" y1="0" x2="510" y2="0" stroke="url(#rb-full-gradient)" stroke-width="3" stroke-linecap="round"/>
    <!-- Diamond -->
    <g transform="translate(550, 0)">
      <polygon points="0,-12 12,0 0,12 -12,0" fill="#ffffff" filter="drop-shadow(0 0 6px #ffffff)"/>
    </g>
    <line x1="590" y1="0" x2="880" y2="0" stroke="url(#rb-full-gradient)" stroke-width="3" stroke-linecap="round"/>
  </g>
</svg>"""

with open("public/assets/imgs/logo-gold.svg", "w") as f:
    f.write(svg_footer)

with open("public/assets/imgs/footer-logo.svg", "w") as f:
    f.write(svg_footer)

print("Generated full footer logo successfully!")
