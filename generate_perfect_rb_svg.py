# Generate an exact vector tracing matching the user's uploaded "RB" emblem:
# Looking closely at the image:
# Shape Analysis:
# 1. Left Glyph 'R':
#    - Top left has a sharp arrow/dart wing: top edge starts at (80, 28) pointing up-left, slants down-right, top edge runs horizontally to top-right of R loop.
#    - Left notch: Under the top arrow, horizontal cut runs in, then slants down-left to form the left sharp leg/fang of R!
#    - Left leg has a slanted sharp foot at (35, 455). Outer edge goes up-right at angle ~30 deg to (235, 195).
#    - Inner center has a triangular/trapezoidal cutout under the R waist.
#    - Right leg of R: Slants down-right through the center at ~35 deg angle, ending in a clean slanted cut foot at (695, 460).
#    - Upper loop of R: Bold horizontal bar across top, smooth rounded corner turning down, curving back into the waist. Inner cutout is rounded-corner horizontal slot.
# 2. Speed streak between R and B:
#    - Notice the distinctive speed needle / slash that emanates from the center waist and shoots up-right into the 'B' glyph!
#    - It divides the bottom of B and creates an energetic speed trail.
# 3. Right Glyph 'B':
#    - Upper top left has a curved cut/shelf matching the R loop curve.
#    - Top horizontal bar goes right into the upper lobe.
#    - Upper lobe curves around smoothly and meets the center waist.
#    - Lower lobe sweeps out in a large, generous rounded curve down to the bottom right.
#    - Bottom edge runs horizontally flat to the left foot of B at (635, 420).
#    - Inner cutout: Upper counter and lower counter separated by the sharp speed dart crossing.
# 4. Color Gradient:
#    - Pure Cyan / Electric Sky Blue (#00b4d8 -> #0284c7 -> #3b82f6) on the top-left wing of R
#    - Royal Blue / Deep Violet (#4f46e5 -> #7c3aed) through the R body and middle
#    - Vivid Purple / Magenta (#9333ea -> #c026d3 -> #d946ef) into the B upper lobe and waist
#    - Hot Pink / Electric Rose (#f43f5e -> #fb7185 / #ff2a85) on the lower lobe of B and right foot of R

svg_code = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1060 490" fill="none" class="rb-brand-vector">
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

    <!-- Linear Gradient for inner blade / speed streaks -->
    <linearGradient id="rb-blade-gradient" x1="20%" y1="60%" x2="100%" y2="20%">
      <stop offset="0%" stop-color="#7c3aed"/>
      <stop offset="50%" stop-color="#9333ea"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>

    <!-- Ambient Shadow & Glow Filter for High Contrast on both Dark and Light Backgrounds -->
    <filter id="rb-vector-glow" x="-20%" y="-30%" width="145%" height="165%">
      <!-- Strong dark occlusion backdrop -->
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="rgba(0, 0, 0, 0.95)"/>
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="rgba(0, 0, 0, 0.98)"/>
      <!-- Cyan Neon Glow Left -->
      <feDropShadow dx="-8" dy="-2" stdDeviation="18" flood-color="rgba(56, 189, 248, 0.55)"/>
      <!-- Magenta Neon Glow Right -->
      <feDropShadow dx="10" dy="4" stdDeviation="20" flood-color="rgba(225, 29, 72, 0.55)"/>
      <!-- Center High-energy Laser Highlight -->
      <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="rgba(255, 255, 255, 0.65)"/>
    </filter>
  </defs>

  <!-- Ambient Dark Pill Backing (Subtle, ensures contrast across any watercolor or light sky) -->
  <g opacity="0.35" filter="blur(20px)">
    <path fill="#02000a" d="M 60 20 L 1020 20 L 1020 470 L 60 470 Z"/>
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

    <!-- CENTER SPEED BLADE / SLASH (The piercing diagonal ray shooting into B) -->
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

  <!-- Specular Shimmer Ray & Sparkles -->
  <!-- Sparkle 1: Top Cyan Wing Tip -->
  <g transform="translate(85, 30) scale(0.65)">
    <path fill="#ffffff" filter="drop-shadow(0 0 6px #ffffff) drop-shadow(0 0 14px #38bdf8)" d="M 0 -18 Q 0 0 18 0 Q 0 0 0 18 Q 0 0 -18 0 Q 0 0 0 -18 Z"/>
  </g>
  <!-- Sparkle 2: Speed Needle Tip -->
  <g transform="translate(820, 140) scale(0.55)">
    <path fill="#ffffff" filter="drop-shadow(0 0 6px #ffffff) drop-shadow(0 0 12px #c084fc)" d="M 0 -16 Q 0 0 16 0 Q 0 0 0 16 Q 0 0 -16 0 Q 0 0 0 -16 Z"/>
  </g>
  <!-- Sparkle 3: Lower Left Foot Fang -->
  <g transform="translate(34, 466) scale(0.55)">
    <path fill="#ffffff" filter="drop-shadow(0 0 6px #ffffff) drop-shadow(0 0 12px #818cf8)" d="M 0 -16 Q 0 0 16 0 Q 0 0 0 16 Q 0 0 -16 0 Q 0 0 0 -16 Z"/>
  </g>
  <!-- Sparkle 4: Lower Right Hot Pink Curve -->
  <g transform="translate(1015, 410) scale(0.6)">
    <path fill="#ffffff" filter="drop-shadow(0 0 8px #ffffff) drop-shadow(0 0 16px #f43f5e)" d="M 0 -18 Q 0 0 18 0 Q 0 0 0 18 Q 0 0 -18 0 Q 0 0 0 -18 Z"/>
  </g>
</svg>"""

with open("public/assets/imgs/logo-rb-cyber.svg", "w") as f:
    f.write(svg_code)

with open("public/assets/imgs/logo.svg", "w") as f:
    f.write(svg_code)

with open("public/assets/imgs/logo-gold-mark.svg", "w") as f:
    f.write(svg_code)

print("Generated logo-rb-cyber.svg and replaced main logo files!")
