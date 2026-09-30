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

  // Flood fill background: background pixels have low RGB and neutral/non-red balance
  const BG_NOISE_THRESHOLD = 12;
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
          // Exterior if dim neutral noise
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
  // Pixels with maxVal <= 10 or not connected to flower are zero alpha.
  // Pixels with r - max(g,b) >= 12 or maxVal >= 25 are solid.
  // Transition is smoothly unmultiplied so NO dark fringe / black matte remains.
  const outRgba = Buffer.alloc(width * height * 4);

  const LOWER_CUTOFF = 10;
  const UPPER_CUTOFF = 26;

  for (let i = 0; i < numPixels; i++) {
    const p3 = i * 3;
    const p4 = i * 4;

    const r = data[p3];
    const g = data[p3 + 1];
    const b = data[p3 + 2];
    const maxVal = Math.max(r, g, b);
    const redExcess = r - Math.max(g, b);

    if (isExterior[i] || (maxVal <= LOWER_CUTOFF && redExcess < 5)) {
      // Pure exterior background - completely transparent
      outRgba[p4] = 0;
      outRgba[p4 + 1] = 0;
      outRgba[p4 + 2] = 0;
      outRgba[p4 + 3] = 0;
    } else if (maxVal >= UPPER_CUTOFF || redExcess >= 14) {
      // Full opacity petal / core
      outRgba[p4] = r;
      outRgba[p4 + 1] = g;
      outRgba[p4 + 2] = b;
      outRgba[p4 + 3] = 255;
    } else {
      // Transition rim zone: compute smooth cubic hermite alpha
      const t = Math.max(0, Math.min(1, (maxVal - LOWER_CUTOFF) / (UPPER_CUTOFF - LOWER_CUTOFF)));
      const smoothAlpha = t * t * (3 - 2 * t);
      const alphaByte = Math.round(smoothAlpha * 255);

      if (alphaByte <= 2) {
        outRgba[p4] = 0;
        outRgba[p4 + 1] = 0;
        outRgba[p4 + 2] = 0;
        outRgba[p4 + 3] = 0;
      } else {
        // Unmultiply color so outer rim does not darken to muddy black fringe
        const unmultFactor = 1.0 / Math.max(0.25, smoothAlpha);
        outRgba[p4] = Math.min(255, Math.round(r * Math.min(unmultFactor, 1.6)));
        outRgba[p4 + 1] = Math.min(255, Math.round(g * Math.min(unmultFactor, 1.6)));
        outRgba[p4 + 2] = Math.min(255, Math.round(b * Math.min(unmultFactor, 1.6)));
        outRgba[p4 + 3] = alphaByte;
      }
    }
  }

  // 3. Save as transparent PNG and WebP
  await sharp(outRgba, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile('./public/assets/imgs/loader-flower.png');

  await sharp(outRgba, { raw: { width, height, channels: 4 } })
    .webp({ quality: 95, lossless: false, effort: 6 })
    .toFile('./public/assets/imgs/loader-flower.webp');

  console.log('Successfully saved clean transparent loader-flower.png and loader-flower.webp');
}

processFlower().catch(console.error);
