import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconSizes = [
  { width: 192, height: 192 },
  { width: 512, height: 512 },
  { width: 180, height: 180 },  // Apple touch icon
  { width: 32, height: 32 },    // Favicon
];

async function generateIcons() {
  // Ensure icons directory exists
  const iconsDir = path.join(__dirname, 'public', 'icons');
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  // Create an SVG with Islamic/Hadith theme
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
      <rect width="100%" height="100%" fill="#047857"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-size="300" font-family="Arial, sans-serif">
        حديث
      </text>
    </svg>
  `;

  for (const size of iconSizes) {
    const filename = `icon-${size.width}x${size.height}.png`;
    const filepath = path.join(iconsDir, filename);

    try {
      await sharp(Buffer.from(svgContent))
        .resize(size.width, size.height)
        .png()
        .toFile(filepath);

      console.log(`Generated ${filename}`);
    } catch (error) {
      console.error(`Error generating ${filename}:`, error);
    }
  }
}

// Run the icon generation
generateIcons().catch(console.error);