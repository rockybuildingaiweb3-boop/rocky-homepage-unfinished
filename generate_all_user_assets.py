import subprocess
import os

print("Building logo and signature assets...")

# 1. PUBLIC LOGO SVG (public/assets/imgs/logo.svg)
# Accurate mathematical vector translation of the user's uploaded RB monogram:
# Mountain crest on left, continuous ribbon looping through R and B, rounded ends, clean cutout loops.

logo_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 780" fill="none">
  <!-- Rocky Babcock Monogram Logo -->
  <defs>
    <linearGradient id="rb-silver-glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="50%" stop-color="#f5f3ff"/>
      <stop offset="100%" stop-color="#ede9fe"/>
    </linearGradient>
  </defs>
  <g fill="currentColor">
    <!-- Outer silhouette and inner negative spaces of the RB Monogram -->
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

print("Saved logo.svg and footer-logo.svg")
