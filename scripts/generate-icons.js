import { createCanvas } from 'canvas';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ICONS_DIR = join(__dirname, '../public/icons');
const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#1976d2';
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.2);
  ctx.fill();

  // Calculator body
  ctx.fillStyle = 'white';
  const margin = size * 0.1875;
  const width = size - (margin * 2);
  const height = size * 0.75;
  ctx.beginPath();
  ctx.roundRect(margin, margin, width, height, size * 0.05);
  ctx.fill();

  // Display
  ctx.fillStyle = '#e3f2fd';
  const displayMargin = size * 0.23;
  const displayWidth = size - (displayMargin * 2);
  const displayHeight = size * 0.15;
  ctx.beginPath();
  ctx.roundRect(displayMargin, displayMargin, displayWidth, displayHeight, size * 0.02);
  ctx.fill();

  // Buttons
  ctx.fillStyle = '#1976d2';
  const buttonSize = size * 0.12;
  const buttonGap = size * 0.04;
  const startY = size * 0.45;

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      const x = displayMargin + (col * (buttonSize + buttonGap));
      const y = startY + (row * (buttonSize + buttonGap));
      const width = col === 3 ? buttonSize * 0.7 : buttonSize;
      
      ctx.beginPath();
      ctx.roundRect(x, y, width, buttonSize, size * 0.02);
      ctx.fill();
    }
  }

  return canvas.toBuffer('image/png');
}

async function generateIcons() {
  try {
    await fs.mkdir(ICONS_DIR, { recursive: true });

    for (const size of SIZES) {
      const buffer = await generateIcon(size);
      const outputPath = join(ICONS_DIR, `icon-${size}x${size}.png`);
      await fs.writeFile(outputPath, buffer);
      console.log(`Generated ${size}x${size} icon`);
    }

    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
