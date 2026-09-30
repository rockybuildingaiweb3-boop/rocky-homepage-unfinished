const sharp = require('sharp');
const fs = require('fs');

async function processFlower() {
  const inputPath = './public/assets/imgs/loader-flower.jpg';
  const { data, info } = await sharp(inputPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const numPixels = width * height;

  // 1. Identify pure exterior background using BFS from all 4 image borders.
  // Any pixel connected to the border with low energy is guaranteed exterior.
  const isExterior = new Uint8Array(numPixels);
  const queue = new Int32Array(numPixels * 2);
  let qHead = 0;
  let qTail = 0;

  // Seed borders
  for (let x = 0; x < width; x++) {
    queue[qTail++] = x; queue[qTail++] = 0;
    isExterior[x] = 1;
    const bIdx = (height - 1) * width + x;
    queue[qTail++] = x; queue[qTail++] = height - 1;
    isExterior[bIdx] = 1;
  }
  for (let y = 1; y < height - 1; y++) {
    const lIdx = y * width;
    queue[qTail++] = 0; queue[qTail++] = y;
    isExterior[lIdx] = 1;
    const rIdx = y * width + width - 1;
    queue[qTail++] = width - 1; queue[qTail++] = y;
    isExterior[rIdx] = 1;
  }

  // Flood fill background: background pixels have very low RGB (compression noise <= 4)
  const BG_NOISE_THRESHOLD = 4;
  while (qHead < qTail) {
    const x = queue[qHead++];
    const y = queue[qHead++];
    const neighbors = [
      [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]
    ];
    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx;
        if (!isExterior[nIdx]) {
          const p = nIdx * 3;
          const r = data[p];
          const g = data[p + 1];
          const b = data[p + 2];
          // Near black background noise
          if (r <= BG_NOISE_THRESHOLD && g <= BG_NOISE_THRESHOLD && b <= BG_NOISE_THRESHOLD) {
            isExterior[nIdx] = 1;
            queue[qTail++] = nx;
            queue[qTail++] = ny;
          }
        }
      }
    }
  }

  console.log(`Exterior background pixels identified: ${qTail / 2} / ${numPixels}`);

  // 2. Compute smooth alpha matte.
  // For pixels:
  // - If isExterior == 1: alpha = 0.
  // - If max(R,G,B) > 20: solid rose petal, alpha = 255 (1.0).
  // - In the transition zone (max(R,G,B) between 4 and 20):
  //   compute alpha smoothly from 0 to 1, and unmultiply color so there is no black halo.
  const outRgba = Buffer.alloc(width * height * 4);

  const LOWER_CUTOFF = 3;   // Below this is 0 alpha
  const UPPER_CUTOFF = 18;  // Above this is 100% solid opacity

  for (let i = 0; i < numPixels; i++) {
    const p3 = i * 3;
    const p4 = i * 4;

    const r = data[p3];
    const g = data[p3 + 1];
    const b = data[p3 + 2];
    const maxVal = Math.max(r, g, b);

    if (isExterior[i]) {
      // Pure exterior background
      outRgba[p4] = 0;
      outRgba[p4 + 1] = 0;
      outRgba[p4 + 2] = 0;
      outRgba[p4 + 3] = 0;
    } else if (maxVal >= UPPER_CUTOFF) {
      // Full opacity petal / core
      outRgba[p4] = r;
      outRgba[p4 + 1] = g;
      outRgba[p4 + 2] = b;
      outRgba[p4 + 3] = 255;
    } else if (maxVal <= LOWER_CUTOFF) {
      // Very dim stray exterior pixel that didn't connect
      outRgba[p4] = 0;
      outRgba[p4 + 1] = 0;
      outRgba[p4 + 2] = 0;
      outRgba[p4 + 3] = 0;
    } else {
      // Transition rim zone: compute smooth cubic hermite alpha
      const t = (maxVal - LOWER_CUTOFF) / (UPPER_CUTOFF - LOWER_CUTOFF);
      const smoothAlpha = t * t * (3 - 2 * t);
      const alphaByte = Math.round(smoothAlpha * 255);

      // Unmultiply color slightly so edges don't darken to muddy black fringe
      const unmultFactor = Math.max(1.0, 1.0 / Math.max(0.2, smoothAlpha));
      // Clamp to prevent blowout
      const unmultR = Math.min(255, Math.round(r * Math.min(unmultFactor, 1.8)));
      const unmultG = Math.min(255, Math.round(g * Math.min(unmultFactor, 1.8)));
      const unmultB = Math.min(255, Math.round(b * Math.min(unmultFactor, 1.8)));

      outRgba[p4] = unmultR;
      outRgba[p4 + 1] = unmultG;
      outRgba[p4 + 2] = unmultB;
      outRgba[p4 + 3] = alphaByte;
    }
  }

  // 3. Save as transparent PNG and WebP
  await sharp(outRgba, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile('./public/assets/imgs/loader-flower.png');

  await sharp(outRgba, { raw: { width, height, channels: 4 } })
    .webp({ quality: 95, lossless: false, effort: 6 })
    .toFile('./public/assets/imgs/loader-flower.webp');

  console.log('Successfully saved loader-flower.png and loader-flower.webp');
}

processFlower().catch(console.error);
