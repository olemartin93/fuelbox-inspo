// Generates PNG app icons from public/favicon.svg. Run: npm run icons
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

const svg = await readFile(new URL('../public/favicon.svg', import.meta.url));
const out = (name) => new URL(`../public/${name}`, import.meta.url).pathname;
const bg = { r: 28, g: 25, b: 23, alpha: 1 };

await sharp(svg, { density: 384 }).resize(192, 192).png().toFile(out('pwa-192x192.png'));
await sharp(svg, { density: 384 }).resize(512, 512).png().toFile(out('pwa-512x512.png'));
await sharp(svg, { density: 384 }).resize(180, 180).flatten({ background: bg }).png().toFile(out('apple-touch-icon.png'));

// Maskable: artwork shrunk into the 80% safe zone on a full-bleed background
const inner = await sharp(svg, { density: 384 }).resize(400, 400).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: bg } })
  .composite([{ input: inner, gravity: 'center' }])
  .png()
  .toFile(out('maskable-512x512.png'));

console.log('Icons generated');
