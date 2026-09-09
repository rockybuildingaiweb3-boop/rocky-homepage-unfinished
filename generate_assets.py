import urllib.request
import json
import base64
import subprocess
import os

print("Writing SVG assets directly...")

# 1. Custom Vector Logo SVG
# The user's logo is a stylized modern monogram of 'RB':
# An energetic continuous line where the left leg shoots up like a steep mountain peak ('R' stem),
# cuts sharply down and arches up into the top loop of 'R',
# sweeps through the center and flows into the double-looped swoops of 'B'.
# Both strokes are bold, uniform tubular strokes with rounded caps and turns.

logo_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 680" fill="none">
  <!-- RB Monogram - Precision stylized continuous ribbon path -->
  <g fill="currentColor">
    <path fill-rule="evenodd" clip-rule="evenodd" d="
      M 195 560
      C 155 560 115 525 95 480
      C 60 405 105 320 180 230
      L 245 155
      C 265 130 295 110 330 95
      C 375 75 425 80 460 110
      C 490 135 505 170 500 205
      C 495 240 475 270 445 295
      C 415 320 380 340 345 355
      C 320 365 305 375 305 390
      C 305 405 320 415 340 420
      C 375 428 425 410 475 380
      C 525 350 580 320 635 320
      C 695 320 745 365 745 425
      C 745 470 715 510 670 540
      C 620 575 550 590 480 590
      C 410 590 345 565 300 520
      C 265 485 250 440 250 395
      C 250 345 275 300 315 270
      C 355 240 395 210 415 175
      C 425 155 420 140 410 130
      C 395 115 370 115 345 125
      C 325 135 305 155 285 180
      L 220 255
      C 155 335 125 400 145 450
      C 155 475 175 495 200 495
      C 225 495 250 475 275 445
      L 310 400
      C 325 380 350 370 375 380
      C 400 390 410 415 395 440
      L 360 485
      C 325 530 265 560 195 560 Z
    "/>
  </g>
</svg>"""

with open("public/assets/imgs/logo.svg", "w") as f:
    f.write(logo_svg)

with open("public/assets/imgs/footer-logo.svg", "w") as f:
    f.write(logo_svg)

print("Logo SVGs updated successfully.")
