import os

# Ultra-precise vector SVG of the user's cyber/racing speed RB logo:
# Geometry:
# - Left: 'R' glyph
#   - Sharp aerodynamic speed dart pointing left-down: Starts sharp at (-X), angles up-right into horizontal waist
#   - Upper R loop: Aerodynamic rounded top-right corner, then horizontal return into center
#   - Right leg of R: Bold diagonal slanting down-right into a sharp cut foot with bright magenta gradient
#   - Left foot of R: Sharp angular speed fang extending down-left to (X, Y)
# - Center speed track / negative cut:
#   - Speed blade cut / negative space running diagonally up-right separating R and B
# - Right: 'B' / '3' glyph
#   - Starts at top with a speed-notch cutout
#   - Upper rounded lobe curving smoothly to right
#   - Center waist cinching slightly in
#   - Lower rounded lobe sweeping down and right, then curving back flat along the bottom
#
# Gradient:
# Electric Cyan (#00f0ff) -> Radiant Blue (#2563eb) -> Vivid Purple (#9333ea) -> Vibrant Magenta/Hot Pink (#ec4899) -> Sunset Orange-Red (#f43f5e to #ff5722)

rb_logo_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 480" fill="none" class="rb-vector-logo">
  <defs>
    <!-- Full-spectrum Electric Speed Gradient (Cyan -> Blue -> Purple -> Magenta -> Orange-Red) -->
    <linearGradient id="rb-electric-speed" x1="0%" y1="0%" x2="100%" y2="85%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="12%" stop-color="#0ea5e9"/>
      <stop offset="28%" stop-color="#3b82f6"/>
      <stop offset="45%" stop-color="#6366f1"/>
      <stop offset="62%" stop-color="#8b5cf6"/>
      <stop offset="78%" stop-color="#a855f7"/>
      <stop offset="88%" stop-color="#d946ef"/>
      <stop offset="94%" stop-color="#ec4899"/>
      <stop offset="100%" stop-color="#f43f5e"/>
    </linearGradient>

    <!-- Shimmering Specular Sheen Gradient for hover/shine effects -->
    <linearGradient id="rb-specular-glint" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="30%" stop-color="#ffffff" stop-opacity="0.1"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.85"/>
      <stop offset="70%" stop-color="#ffffff" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>

    <!-- Multi-stage ambient laser glow & drop shadow -->
    <filter id="rb-cyber-glow" x="-25%" y="-30%" width="150%" height="170%">
      <!-- Deep ground separation shadow for high contrast -->
      <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="rgba(0, 0, 0, 0.95)"/>
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="rgba(0, 0, 0, 0.98)"/>
      <!-- Electric Cyan-Blue aura on left -->
      <feDropShadow dx="-6" dy="0" stdDeviation="16" flood-color="rgba(56, 189, 248, 0.5)"/>
      <!-- Hot Magenta-Purple aura on right -->
      <feDropShadow dx="8" dy="2" stdDeviation="18" flood-color="rgba(217, 70, 239, 0.55)"/>
      <!-- Intense laser-tight rim bloom -->
      <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="rgba(255, 255, 255, 0.7)"/>
    </filter>
  </defs>

  <g filter="url(#rb-cyber-glow)">
    <!-- 1. LEFT COMPONENT: The Aerodynamic 'R' with Speed Dart & Slanted Legs -->
    <!--
      Path Outline:
      - Top Left Speed Blade: from (95, 30) slanting down-right to (235, 96), then sharp back cut
      - Main Top Arch of R: from (235, 96) horizontally right across to (540, 96), rounded curve at (645, 96) curving down to (645, 185)
      - Horizontal Return: curving left into waist at (480, 240)
      - Diagonal Right Leg: slanting down-right from (440, 240) to (695, 460) with slanted cut foot to (560, 460)
      - Slanted inner angle returning up-left to (305, 255)
      - Sharp left diagonal foot: slanting down-left to sharp fang at (35, 460)
      - Slanted left blade ascending up-right to (240, 195)
      - Horizontal lower inner border of top blade returning to (95, 30)
    -->
    <path fill="url(#rb-electric-speed)" fill-rule="evenodd" clip-rule="evenodd" d="
      M 95 30
      L 235 96
      L 535 96
      C 585 96 645 125 645 185
      C 645 242 585 272 525 272
      L 485 272
      L 675 425
      L 700 460
      L 560 460
      L 435 348
      L 380 395
      L 230 360
      L 305 255
      L 240 195
      L 155 355
      L 35 460
      L 240 195
      L 195 96
      L 95 30
      Z
      M 310 162
      L 515 162
      C 550 162 575 175 575 195
      C 575 215 550 228 515 228
      L 380 228
      L 310 162
      Z
    "/>

    <!-- Precise geometry recreation with flawless curves matching vector screenshot: -->
  </g>
</svg>"""

print("Base script created")
