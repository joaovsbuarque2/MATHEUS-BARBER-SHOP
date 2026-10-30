import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const sourceDir = 'img';
const outputDir = 'public/images';

await mkdir(outputDir, { recursive: true });

const images = [
  { file: 'barbearia.jpg', name: 'barbearia', widths: [480, 720, 1080] },
  { file: 'corte-exp-1.jpg', name: 'corte-1', widths: [480, 720, 1080] },
  { file: 'corte-exp-2.jpg', name: 'corte-2', widths: [480, 720, 1050] },
  { file: 'corte-exp-3.jpg', name: 'corte-3', widths: [480, 720, 810] },
  { file: 'corte-exp-4.jpg', name: 'corte-4', widths: [480, 720, 1080] },
];

for (const image of images) {
  const input = path.join(sourceDir, image.file);

  for (const width of image.widths) {
    const output = path.join(outputDir, `${image.name}-${width}.webp`);
    await sharp(input)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(output);
    console.log(`created ${output}`);
  }
}

const logoSource = path.join(sourceDir, 'matheus-barber-logo.png');
const { data, info } = await sharp(logoSource)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let i = 0; i < data.length; i += 4) {
  const alpha = Math.max(data[i], data[i + 1], data[i + 2]);
  data[i] = 244;
  data[i + 1] = 240;
  data[i + 2] = 233;
  data[i + 3] = Math.min(255, Math.round(alpha * 1.08));
}

await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png({ compressionLevel: 9 })
  .toFile(path.join(outputDir, 'logo.png'));

console.log('created public/images/logo.png');

const overlay = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#171513" stop-opacity="0.97"/>
      <stop offset="0.58" stop-color="#171513" stop-opacity="0.82"/>
      <stop offset="1" stop-color="#171513" stop-opacity="0.18"/>
    </linearGradient>
    <linearGradient id="bottom" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.55" stop-color="#171513" stop-opacity="0"/>
      <stop offset="1" stop-color="#171513" stop-opacity="0.85"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#shade)"/>
  <rect width="1200" height="630" fill="url(#bottom)"/>
  <rect x="66" y="66" width="1068" height="498" fill="none" stroke="#D58A39" stroke-opacity="0.55" stroke-width="1"/>
  <line x1="150" y1="226" x2="265" y2="226" stroke="#D58A39" stroke-width="2"/>
  <text x="150" y="218" fill="#D58A39" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="600" letter-spacing="7">BARBEARIA · LIMEIRA, SP</text>
  <text x="145" y="352" fill="#F4F0E9" font-family="Georgia, 'Times New Roman', serif" font-size="118" letter-spacing="4">MATHEUS</text>
  <text x="150" y="414" fill="#D58A39" font-family="Arial, Helvetica, sans-serif" font-size="31" font-weight="600" letter-spacing="14">BARBER SHOP</text>
  <text x="150" y="482" fill="#A7A19A" font-family="Georgia, 'Times New Roman', serif" font-size="28" font-style="italic">Seu estilo. Sua identidade.</text>
</svg>`;

const logoBuffer = await sharp(path.join(outputDir, 'logo.png'))
  .resize({ width: 92 })
  .toBuffer();

await sharp(path.join(sourceDir, 'barbearia.jpg'))
  .rotate()
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .composite([
    { input: Buffer.from(overlay), top: 0, left: 0 },
    { input: logoBuffer, top: 84, left: 145 },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(path.join(outputDir, 'og-image.jpg'));

console.log('created public/images/og-image.jpg');
