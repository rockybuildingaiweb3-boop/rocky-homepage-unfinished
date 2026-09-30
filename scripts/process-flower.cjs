const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function processFlower() {
  const inputPng = path.resolve(__dirname, '../public/assets/imgs/loader-flower.png');
  const outputWebp = path.resolve(__dirname, '../public/assets/imgs/loader-flower.webp');

  if (!fs.existsSync(inputPng)) {
    console.error(`Input file not found: ${inputPng}`);
    process.exit(1);
  }

  console.log(`Optimizing ${inputPng}...`);
  const meta = await sharp(inputPng).metadata();
  console.log(`Original dimensions: ${meta.width}x${meta.height}`);

  await sharp(inputPng)
    .webp({ quality: 85, effort: 4 })
    .toFile(outputWebp);

  const stats = fs.statSync(outputWebp);
  console.log(`Successfully generated ${outputWebp} (${Math.round(stats.size / 1024)} KB)`);
}

processFlower().catch(console.error);

