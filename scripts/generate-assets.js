import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const staticDir = path.resolve('static');
const svgFaviconBuffer = fs.readFileSync(path.join(staticDir, 'favicon.svg'));

/**
 * Declarative Icon Configuration (Single Source of Truth)
 */
const ICON_CONFIG = [
	{ name: 'favicon-16x16.png', size: 16 },
	{ name: 'favicon-32x32.png', size: 32 },
	{ name: 'apple-touch-icon.png', size: 180 },
	{ name: 'android-chrome-192x192.png', size: 192 },
	{ name: 'android-chrome-512x512.png', size: 512 }
];

async function generateIcons() {
	console.log('Rendering raster icons from static/favicon.svg...');
	await Promise.all(
		ICON_CONFIG.map(({ name, size }) =>
			sharp(svgFaviconBuffer)
				.resize(size, size)
				.png()
				.toFile(path.join(staticDir, name))
				.then(() => console.log(`✓ ${name} (${size}x${size})`))
		)
	);
	console.log('All icons generated successfully.');
}

generateIcons().catch((err) => {
	console.error('Error generating icons:', err);
	process.exit(1);
});
